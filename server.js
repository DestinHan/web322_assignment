// Get the express module
const express = require('express');

// Instantiates the module
const app = express();

// Server port
const HTTP_PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.send('Seung Hoon Han - 108302233');
});

// Start the server
app.listen(HTTP_PORT, () => {
    console.log(`Server listening on http://localhost:${HTTP_PORT}`);
});
