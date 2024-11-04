// Student Name:  Seung Hoon Han
// Student Number:  108302233
// Student Email:  shhan11@myseneca.ca
// Date Created:  2024/10/03
// Last Modified: 2024/10/04

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
app.use(express.static('public'));  // Setting to serve static files from the "public" directory.

app.get('/', (req, res) => {
    res.redirect('/about');
}); // Redirecto the root URL to "/about" page.

app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/views/about.html');
}); // Serving "about.html" when "/about" has accessed.

contentService.initialize().then(() => {

  console.log('Content service initialized successfully.'); // This is just for me to check if it works

    app.get('/articles', (req, res) => {
        contentService.getPublishedArticles()
        .then((data) => res.json(data))
        .catch((err) => res.json({ message: err }));
    }); // Send the list of published aritcles, also handling errors.

    app.get('/categories', (req, res) => {
        contentService.getCategories()
        .then((data) => res.json(data))
        .catch((err) => res.json({ message: err }));
    }); // Route to get all categories, also handling errors.

    app.get('/posts/add', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'addPost.html'));
    });

    app.post('/posts/add', upload.single("featureImage"), (req, res) => {
        if (req.file) {
            let streamUpload = (req) => {
                return new Promise((resolve, reject) => {
                    let stream = cloudinary.uploader.upload_stream((error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    });
                    streamifier.createReadStream(req.file.buffer).pipe(stream);
                });
            };
    
            async function upload(req) {
                let result = await streamUpload(req);
                return result;
            }
    
            upload(req).then((uploaded) => {
                processPost(uploaded.url);
            });
        } else {
            processPost("");
        }
    
        function processPost(imageUrl) {
            req.body.featureImage = imageUrl; 
    
            contentService.addPost(req.body).then(() => {
                res.redirect('/posts'); 
            }).catch((err) => {
                res.status(500).json({ message: err });
            });
        }
    });

    app.get('/post/:id', (req, res) => {
        contentService.getPostById(req.params.id).then((post) => {
            res.json(post);
        }).catch((err) => {
            res.status(404).json({ message: err });
        });
    });
    
    
}).catch(err => {
    console.log("Failed to initialize: " + err);    // If there's an issue, log the error.
});

app.listen(PORT, () => {
    console.log(`Express http server listening on port ${PORT}`);
}); // Starting the server.
