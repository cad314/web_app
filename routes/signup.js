var express = require('express');
var debug = require('debug');
var app = require('./../app');

var router = express.Router();
var user = app.locals.user;

router.get('/', function(req, res, next) {
    // res.render('signup', { title: 'CALENDAR APP' });
    res.render('choose_user', { title: 'CALENDAR APP' });
});

router.get('/student', function(req, res, next) {
    res.render('student_signup', { title: 'CALENDAR APP' });
});

router.get('/professor', function(req, res, next) {
    res.render('professor_signup', { title: 'CALENDAR APP' });
});

router.post('/student', function(req, res, next) {

    var form = req.body;

    debug.log(form);

    user.registerStudent(form.fname,form.lname,form.email,form.pw,form.phone,form.major,form.minor,
        function (id) {
            debug.log("Success! New student id: " + id);
            user.logout();
            res.redirect("../");
        },
        function(){
            debug.log("Student already exists. User not added.");
            user.logout();
            res.redirect("../");
        },
        function (err) {
            debug.log("Failed! Error: " + err.message);
            user.logout();
            res.redirect("../");
        }
    );
});

router.post('/professor', function(req, res, next) {

    var form = req.body;

    debug.log(form);

    user.registerProf(form.fname,form.lname,form.email,form.pw,form.dept,form.office,
        function (id) {
            debug.log("Success! New professor id: " + id);
            user.logout();
            res.redirect("../");
        },
        function(){
        debug.log("Professor already exists. User not added.");
            user.logout();
            res.redirect("../");
        },
        function (err) {
            debug.log("Failed! Error: " + err.message);
            user.logout();
            res.redirect("../");
        }
    );
});

module.exports = router;