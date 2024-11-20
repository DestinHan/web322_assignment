// Student Name:  Seung Hoon Han
// Student Number:  108302233
// Student Email:  shhan11@myseneca.ca
// Date Created:  2024/10/03
// Last Modified: 2024/11/13

const express = require('express');
const contentService = require('./content-service');
const app = express();
const path = require('path');
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const PORT = 1004;

cloudinary.config({
    cloud_name: 'damszhuew',
    api_key: '555378815964317',
    api_secret: 'DCl-HU4drtj0yGpsm3QO6XqDOyQ',
    secure: true
});

const upload = multer();

app.use(express.json());
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.redirect('/about');
});

app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/views/about.html');
});

contentService.initialize().then(() => {
    console.log('Content service initialized successfully.');

    
    app.get('/articles', (req, res) => {
        const { category } = req.query;
        contentService.getPublishedArticles()
            .then((articles) => {
                let filteredArticles = articles;
    
                if (category) {
                    filteredArticles = articles.filter(article => article.category === category);
                }
    
                // 카테고리 이름 추가
                filteredArticles = filteredArticles.map(article => {
                    const categoryName = contentService.getCategoryNameById(article.category);
                    console.log(`Article: ${article.title}, Category Name: ${categoryName}`); // 디버깅 출력
                    return {
                        ...article,
                        categoryName: categoryName
                    };
                });
    
                res.render('articles', {
                    articles: filteredArticles,
                    error: filteredArticles.length === 0 ? "No articles found for the selected category." : null
                });
            })
            .catch((err) => {
                res.render('articles', { articles: [], error: "Failed to load articles." });
            });
    });
    

    app.get('/categories', (req, res) => {
        contentService.getCategories()
            .then((categories) => {
                res.render('categories', {
                    categories,
                    error: categories.length === 0 ? "No categories available." : null
                });
            })
            .catch((err) => {
                res.render('categories', { categories: [], error: "Failed to load categories." });
            });
    });

    app.get('/articles/add', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'addArticle.html'));
    });

    app.post('/articles/add', upload.single("featureImage"), (req, res) => {
        if (req.file) {
            let streamUpload = (req) => {
                return new Promise((resolve, reject) => {
                    let stream = cloudinary.uploader.upload_stream((error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    });
                    streamifier.createReadStream(req.file.buffer).pipe(stream);
                });
            };

            async function upload(req) {
                let result = await streamUpload(req);
                return result;
            }

            upload(req).then((uploaded) => {
                processArticle(uploaded.url);
            }).catch(err => res.status(500).json({ message: "Image upload failed", error: err }));
        } else {
            processArticle("");
        }

        function processArticle(imageUrl) {
            req.body.featureImage = imageUrl;
            contentService.addArticle(req.body)
                .then(() => res.redirect('/articles'))
                .catch(err => res.status(500).json({ message: "Article creation failed", error: err }));
        }
    });

    app.get('/post/:id', (req, res) => {
        const articleId = req.params.id;
    
        contentService.getArticleById(articleId)
            .then((article) => {
                if (!article.published) {
                    res.status(404).render('404', { message: "This article is not published." });
                } else {
                    
                    article.categoryName = contentService.getCategoryNameById(article.category);
    
                    res.render('article', { article });
                }
            })
            .catch((err) => {
                res.status(404).render('404', { message: "Article not found." });
            });
    });
    

}).catch(err => {
    console.log("Failed to initialize: " + err);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Express http server listening on port ${PORT}`);
});
