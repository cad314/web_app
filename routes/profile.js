var express = require('express');
var router = express.Router();

router.get('/student', function(req, res, next) {
    res.render('student_profile.ejs', { title: 'CALENDAR APP' });
});

router.get('/professor', function(req, res, next) {
    res.render('professor_profile.ejs', { title: 'CALENDAR APP' });
});


module.exports = router;