var express = require('express');
var user_dal = require('../DAL/User_DAL');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    user_dal.login("Carlos","Downie","is THE BOMB!",function(logged){
        if(logged){
            res.render('index', { title: 'Home of Carlos', logged_in: " Carlos Downie"});
        }
        else{
            res.render('index', { title: 'Home of Nobody', logged_in: ""});
        }

    },function(err){
        res.render('index', { title: 'Home', logged_in: "Error"});
    });
});

module.exports = router;
