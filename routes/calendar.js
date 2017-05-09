var express = require('express');
var debug = require('debug');
var router = express.Router();
var app = require('./../app');
var user = app.locals.user;

router.get('/', function(req, res, next) {
    if(user.logged_in){
        user.getProfessorData(function (data) {
            debug.log("Professor data acquired!");
            debug.log(data);
            res.render('calendar', { title: 'Calendar', user: user, professors: data});
        },function (err) {
            debug.log("An error occurred fetching professor data: " + err.message);
        });
    }
    else{
        res.redirect("../");//Go back to home page
    }
});

module.exports = router;
