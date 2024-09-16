const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.send('Seung Hoon Han - 108302233');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
