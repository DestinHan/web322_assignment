// Student Name:  Seung Hoon Han
// Student Number:  108302233
// Student Email:  shhan11@myseneca.ca
// Date Created:  2024/10/03
// Last Modified: 2024/10/04

const express = require('express');
const contentService = require('./content-service');
const app = express();
const PORT = 1004; 

app.use(express.static('public')); 

app.get('/', (req, res) => {
    res.redirect('/about');
});

app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/views/about.html');
});

contentService.initialize().then(() => {
  console.log('Content service initialized successfully.');
    app.get('/articles', (req, res) => {
        contentService.getPublishedArticles()
        .then((data) => res.json(data))
        .catch((err) => res.json({ message: err }));
    });

    app.get('/categories', (req, res) => {
        contentService.getCategories()
        .then((data) => res.json(data))
        .catch((err) => res.json({ message: err }));
    });
}).catch(err => {
    console.log("Failed to initialize: " + err);
});

app.listen(PORT, () => {
    console.log(`Express http server listening on port ${PORT}`);
});
