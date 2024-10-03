// get the express module
const express = require('express');

const path = require('path');

// instantiates the module
const app = express();

// server port
const HTTP_PORT =  1004;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect('/about');
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/articles', (req, res) => {
    res.json(contentService.getAllArticles());
  });
  
app.get('/categories', (req, res) => {
    res.json(contentService.getAllCategories());
  });
  

// start the server
app.listen(HTTP_PORT, () => console.log(`server listening on http://localhost:${HTTP_PORT}`))