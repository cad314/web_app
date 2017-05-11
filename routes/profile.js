//var app = require('./../app');
var express = require('express');
var debug = require('debug');
var router = express.Router();
var app = require('./../app');
var user = app.locals.user;

router.get('/', function(req, res, next) {
    //Render the page is user is logged in and user is a student
    if(user.logged_in && user.isStudent){
        res.redirect('/profile/student');
    }
    else if(user.logged_in){
        res.redirect('/profile/professor');
    }
    else {
        res.redirect('../');
    }
});

router.post('/edit', function (req, res, next) {
    // if the user is a professor and is logged in

    debug.log(req.body);

    var data = req.body;

    if(user.logged_in && user.isStudent == 0) {

        user.updateProf(data.first, data.last, data.pw, data.dept, data.phone,
            function (id) {
                user.first = data.first;
                user.last = data.last;
                user.extraData.deptName = data.dept;
                user.extraData.officePhone = data.phone;

                debug.log("Success! Information was updated for Professor ID: " + id);
                res.redirect('/profile/professor');
            }, function (err) {
                debug.log("Error: " + err.message);
            });
    }
    // if the user is a student
    else if(user.logged_in) {

        user.updateStudent(data.first, data.last, data.pw, data.phone, data.major, data.minor,
            function (id) {
                user.first = data.first;
                user.last = data.last;
                user.extraData.phoneNo = data.phone;
                user.extraData.major = data.major;
                user.extraData.major = data.minor;

                debug.log("Success! Information was updated for Student ID: " + id);
                res.redirect('/profile/student');
            }, function (err) {
                debug.log("Error: " + err.message);
            });
    }
    else{
        res.redirect('../'); //Go back to home page
    }
});

router.get('/student', function(req, res, next) {
    if(user.logged_in){
        res.render('student', { title: 'Student', user: user });
    }
    else{
        debug.log("redirected");
        res.redirect('../');
    }
});

router.get('/edit', function(req, res, next) {

    //Render the page is user is logged in and user is a student
    if(user.logged_in && user.isStudent === 1){
        res.render("editStudent",{title: "Edit Student Profile", user: user});
    }
    else if(user.logged_in){
        res.render('editProfessor', {title: 'Edit Professor Profile', user: user});
    }
    else{
        res.redirect("../");//Go back to home page
    }
});

router.get('/professor', function(req, res, next) {
    if(user.logged_in){
        res.render('instructor', { title: 'Professor', user: user });
    }
    else{
        debug.log("redirected");
        res.redirect('../');
    }
});

module.exports = router;