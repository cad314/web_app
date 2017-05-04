var express = require('express');
var user_dal = require('../DAL/User_DAL');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Home'});
});

router.post('/', function(req, res, next) {

    //Choose between login or signup
    if(req.body.signup == undefined){
        login(req,res);//Perform login action if signup was undefined
    }
    else{
        signup(req,res);
    }
});

function login(req,res){
    var formData = req.body;

    user_dal.login(formData.email,formData.password,function(logged,rows){
        if(logged){
            app.locals.UserData = rows[0];
            app.locals.logged = true;
            if(rows[0].isStudent){
                res.redirect("/student");
                //res.render('student', { title: 'Student Profile', data: app.locals.UserData});
            }
            else {
                res.redirect("/instructor");
                //res.render('instructor', { title: 'Instructor Profile', data: app.locals.UserData});
            }
        }
        else{
            console.log("Bad login");
            app.locals.logged = false;
            res.render('index', { title: 'Home'});
        }

    },function(err){
        app.locals.logged = false;
        res.render('index', { title: 'Home'});
    });
}

function signup(req,res){
    res.redirect("/signup");
}

module.exports = router;
