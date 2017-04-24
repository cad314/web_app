/**
 * Created by CAD on 024 04/24/2017.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('instructor', { title: 'Instructor' });
});

module.exports = router;