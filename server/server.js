//Budget API

const express = require('express');
const cors = require('cors');
const app  = express();
const port = 3000;

app.use(cors());

app.get('/budget',(req,res) => {
    var fs = require('fs');
    var budget = JSON.parse(fs.readFileSync('../budget_categories.json', 'utf8'));
    res.json(budget);
});

app.listen(port,() => {
    console.log(`API served at http://localhost:${port}`);
});