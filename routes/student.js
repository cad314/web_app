/**
 * Created by CAD on 024 04/24/2017.
 */
//var app = require('./../app');
var express = require('express');
var debug = require('debug');
var router = express.Router();
var app = require('./../app');
var user = app.locals.user;

router.get('/', function(req, res, next) {

    //Render the page is user is logged in and user is a student
    if(user.logged_in && user.isStudent > 0){
        res.render('student', { title: 'Student', user: user });
    }
    else{
        res.redirect("../");//Go back to home page
    }
});



module.exports = router;