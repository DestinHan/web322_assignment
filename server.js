// get the express module
const express = require('express');

const path = require('path');

// instantiates the module
const app = express();
const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.send('Seung Hoon Han - 108302233');
});

// start the server
app.listen(HTTP_PORT, () => console.log(`server listening on http://localhost:${HTTP_PORT}`))