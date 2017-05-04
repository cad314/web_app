var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('student_signup.ejs', { title: 'CALENDAR APP' });
});

router.get('/professor', function(req, res, next) {
    res.render('professor_signup.ejs', { title: 'CALENDAR APP' });
});

module.exports = router;