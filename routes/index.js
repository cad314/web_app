var express = require('express');
var user_dal = require('../DAL/User_DAL');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.body);
    res.render('index', { title: 'Home', logged_in: false});
});

router.post('/', function(req, res, next) {
    console.log(req.body);
    res.render('index', { title: 'Home', logged_in: false});
});

function action(){
    console.log(req.body);
    user_dal.login("cad314","is THE BOMB!",function(logged){
        if(logged){
            res.render('index', { title: 'Home of Carlos', logged_in: true});
        }
        else{
            res.render('index', { title: 'Home of Nobody', logged_in: false});
        }

    },function(err){
        res.render('index', { title: 'Home', logged_in: false});
    });
}

module.exports = router;
