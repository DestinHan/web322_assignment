// get the express module
const express = require('express');

const path = require('path');

// instantiates the module
const app = express();

// server port
const HTTP_PORT =  1004;

app.use(express.static('public'));

app.get('/', (req, res) => {
    console.log("Redirecting to /about");
    res.redirect('/about');
});

app.get('/about', (req, res) => {
    console.log("Serving about.html");
    res.sendFile(path.join(__dirname, '/views/about.html'));
});

// start the server
app.listen(HTTP_PORT, () => console.log(`server listening on http://localhost:${HTTP_PORT}`))