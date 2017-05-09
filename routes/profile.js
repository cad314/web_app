//var app = require('./../app');
var express = require('express');
var debug = require('debug');
var router = express.Router();
var app = require('./../app');
var user = app.locals.user;

router.get('/', function(req, res, next) {
    //Render the page is user is logged in and user is a student
    if(user.isStudent){
        res.redirect('/profile/student');
    }
    else {
        res.redirect('/profile/professor');
    }
});

router.get('/student', function(req, res, next) {
    if(user.logged_in){
        res.render('student', { title: 'CALENDAR APP' });
    }
    else{
        debug.log("redirected");
        res.redirect('../');
    }
});

router.get('/professor', function(req, res, next) {
    if(user.logged_in){
        res.render('instructor', { title: 'CALENDAR APP' });
    }
    else{
        debug.log("redirected");
        res.redirect('../');
    }
});

module.exports = router;