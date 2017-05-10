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
        res.render('student', { title: 'Student' });
    }
    else{
        debug.log("redirected");
        res.redirect('../');
    }
}); 

router.get('/student/edit', function(req, res, next) {

    //Render the page is user is logged in and user is a student
    if(user.logged_in && user.isStudent > 0){
        res.render('editStudent', { title: 'Edit Student Profile', user: user });
    }
    else{
        res.redirect("../");//Go back to home page
    }
});

router.get('/professor', function(req, res, next) {
    if(user.logged_in){
        res.render('instructor', { title: 'Professor' });
    }
    else{
        debug.log("redirected");
        res.redirect('../');
    }
});

router.get('/professor/edit', function(req, res, next) {
    //Render the page if the professor is logged in and wants to edit their profile
    if(user.logged_in && user.isStudent == 0) {
        res.render('editProfessor', {title: 'Edit Professor Profile', user: user});
    }
    else {
        res.redirect('../'); //Go back to home page
    }
});

router.post('/submit', function (req, res, next) {
    // if the user is a professor and is logged in
    if(user.logged_in && user.isStudent == 0) {
        var form = req.body;

        debug.log("This is form data: " + form);

        user.updateProf(form.email, form.psswd, form.dept, form.phone,
            function (id) {
                debug.log("Success! Information was updated for Professor ID: " + id);
                res.render("/profile/professor");
            }, function (err) {
                debug.log("Error: " + err.message);
            });
    }
            // if the user is a student
    else if(user.logged_in) {
        var form = req.body;

        debug.log("This is form data: " + form);

        user.updateStudent(form.email, form.psswd, form.phone, form.major, form.minor,
            function (id) {
                debug.log("Success! Information was updated for Student ID: " + id);
                res.redirect("/profile/student");
            }, function (err) {
                debug.log("Error: " + err.message);
            });
    }
    else{
        res.redirect('../'); //Go back to home page
    }
});

module.exports = router;