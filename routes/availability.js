/**
 * Created by SLAM on 024 05/09/2017.
 */
var express = require('express');
var router = express.Router();
var app = require('./../app');
var user = app.locals.user;

router.get('/', function(req, res, next) {
    //Render the page is user is logged in and user is a student
    if(user.logged_in && user.isStudent == 0){
        res.render('availability', { title: 'Instructor', user: user });
    }
    else{
        res.redirect("../");//Go back to home page
    }
});

module.exports = router;