'use strict';

var express = require('express'),
    path = require('path'),
    app = express(),
    logger = require('morgan'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    user;


app.use(logger('dev'));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(session({ 
    secret: 'app', 
    resave: true,
    saveUninitialized: true, 
    cookie: { 
        maxAge: 60000 
    }
}));

var verifyUser = function(req, res, next) {
    if(req.session.loggedIn) {
        next();
    } else {
        if(req.body.username === "admin" &&
           req.body.password === "admin") {
            req.session.loggedIn = true;
            user = req.body.username;
            res.redirect('/');
        } else {
            res.send("please login");
        }
    }
};

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/public')));

app.post('/login', verifyUser);

app.get('/', function(req, res) {
    if(req.session.loggedIn) {
        res.send('Login success with ' + user);
    } else {
        res.send('please login');
    }

});

app.get('/login', function(req, res) {
    res.sendFile(__dirname + '/views/login.html');
});



app.listen(8008, function() {
    console.log('Express was running at port ' + 8008);
});







