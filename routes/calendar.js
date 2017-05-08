var express = require('express');
var router = express.Router();
var app = require('./../app');
var user = app.locals.user;

router.get('/', function(req, res, next) {
    if(user.logged_in){
        res.render('calendar', { title: 'Calendar', user: user});
    }
    else{
        res.redirect("../");//Go back to home page
    }
});

module.exports = router;
