// get the express module
const express = require('express');

const path = require('path');

// instantiates the module
const app = express();

// server port
const HTTP_PORT =  3000;

// index GET Route
app.get('/',(req,res) =>
{
    console.log("Received a GET");

    res.sendFile(path.join(__dirname, '/views/index.html'));
});

// start the server
app.listen(HTTP_PORT, () => console.log(`server listening on http://localhost:${HTTP_PORT}`))