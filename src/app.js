const express = require('express');

const app = express();

app.use("/test",(req, res) => {
    res.send('Welcome')
});

app.listen(3000);