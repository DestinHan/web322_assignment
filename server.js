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
const { Pool } = require('pg'); 
const PORT = 1004;

const pool = new Pool({
    user: 'neondb_owner',                      
    host: 'ep-round-base-a5dqihfg', 
    database: 'blog_database',                        
    password: 'fZkRXBTHY50g',                  
    port: 5432,                                
    ssl: { rejectUnauthorized: false }         
});

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
        if (category) {
            contentService.getArticlesByCategory(category)
                .then(data => res.render('articles', { articles: data, error: null }))
                .catch(err => res.render('articles', { articles: [], error: err }));
        } else {
            contentService.getAllArticles()
                .then(data => res.render('articles', { articles: data, error: null }))
                .catch(err => res.render('articles', { articles: [], error: err }));
        }
    });

    app.get('/categories', (req, res) => {
        contentService.getCategories()
            .then(data => res.render('categories', { categories: data, error: null }))
            .catch(err => res.render('categories', { categories: [], error: err }));
    });

    app.get('/articles/add', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'addArticle.html'));
    });

    app.post('/articles/add', upload.single("featureImage"), (req, res) => {
        let processArticle = (imageUrl) => {
            req.body.featureImage = imageUrl;
            contentService.addArticle(req.body)
                .then(() => res.redirect('/articles'))
                .catch(err => res.status(500).json({ message: "Article creation failed", error: err }));
        };

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

            streamUpload(req)
                .then(uploaded => processArticle(uploaded.url))
                .catch(err => res.status(500).json({ message: "Image upload failed", error: err }));
        } else {
            processArticle("");
        }
    });

    app.get('/post/:id', (req, res) => {
        contentService.getArticleById(req.params.id)
            .then(data => res.render('article', { article: data }))
            .catch(err => res.status(404).render('404', { message: "Article not found." }));
    });

    app.put('/articles/:id', (req, res) => {
        const { title, content, published, category } = req.body;
        pool.query(
            'UPDATE articles SET title = $1, content = $2, published = $3, category = $4 WHERE id = $5 RETURNING *',
            [title, content, published, category, req.params.id]
        )
        .then(result => {
            if (result.rows.length > 0) {
                res.json(result.rows[0]);
            } else {
                res.status(404).send("Article not found");
            }
        })
        .catch(err => res.status(500).send("Error updating article"));
    });

    app.delete('/articles/:id', (req, res) => {
        pool.query('DELETE FROM articles WHERE id = $1 RETURNING *', [req.params.id])
            .then(result => {
                if (result.rows.length > 0) {
                    res.json(result.rows[0]);
                } else {
                    res.status(404).send("Article not found");
                }
            })
            .catch(err => res.status(500).send("Error deleting article"));
    });

}).catch(err => {
    console.log("Failed to initialize: " + err);
});

app.listen(PORT, () => {
    console.log(`Express http server listening on port ${PORT}`);
});
