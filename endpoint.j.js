//This is a hardened endpoint which all server requests have to pass through

var express = require('express');
var app= express();
var jwt= require('express-jwt');
var cors= require('cors');

app.use(cors());

//secret is checked against secret on user stored token
//audience id which is also proved by the stored token
var authCheck=jwt({
secret: new Buffer('yetDcMg9b6hptwMS4rF1LtZ38vLWVmxSlwIAo-WmoERa5FqEi5z8pwEO8mkqA8Yu', 'base64'),
audience: 'colKuoJH7mWmMZLxqc3jyAqjZXmUhNT6'
});

app.get('/api/public', authCheck, function(req,res){
    res.json({message: "Authentication has succeeded"});
});

//this is where the endpoint listens for requests
app.listen(3001);
console.log('Listening on http://localhost:3001');