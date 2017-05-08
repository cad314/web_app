var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('signup', { title: 'CALENDAR APP' });
});

router.post('/', function(req, res, next) {

    //Choose between student or instructor signup
    if(req.body.instructor === undefined){
        res.redirect("/signup/student");
    }
    else{
        res.redirect("/signup/professor");
    }
});

router.get('/student', function(req, res, next) {
    res.render('student_signup', { title: 'CALENDAR APP' });
});

router.get('/professor', function(req, res, next) {
    res.render('professor_signup', { title: 'CALENDAR APP' });
});

module.exports = router;