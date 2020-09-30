const { Console } = require('console');
const express = require('express');
const app  = express();
const port = 3000;

app.use('/',express.static('public'));

app.get('/hello',(req,res) => {
    res.send('Hello World');
});

app.get('/budget',(req,res) => {
    var fs = require('fs');
    var budget = JSON.parse(fs.readFileSync('../personal-budget/budget_categories.json', 'utf8'));
    res.json(budget);
});

app.listen(port,() => {
    console.log(`API served at http://localhost:${port}`);
});