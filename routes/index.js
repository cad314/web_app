var express = require('express');
var router = express.Router();
var debug = require('debug');
var app = require('./../app');
var user = app.locals.user;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Home'});
});

router.post('/', function(req, res, next) {

    //Choose between login or signup
    if(req.body.signup === undefined){
        login(req,res);//Perform login action if signup was undefined
    }
    else{
        signup(req,res);
    }
});


//Runs tests for debugging
router.get('/test',function (res,req,next) {
    user.test();
});

router.get('/logout', function (req, res, next) {
    user.logout();
    res.redirect('../');
});

function login(req,res){
    var formData = req.body;

    var error = function(err){
        debug.log("Error occurred: " + err.message);
    };

    var profilePage = function (res) {
        user.getExtraData(function () {
            //Go to type specific profile page
            if(user.isStudent){
                res.redirect("/student");
            }
            else {
                res.redirect("/instructor");
            }
        }, error);
    };

    user.login(formData.email,formData.password, function() {
        //Get appointment data (if any exists)
        //On success go to profile
        user.getExtraData(function () {
            user.getAppointmentData(function () {
                profilePage(res);
            },error);
        },function () {
            error(err);
        });
    },function () {
        debug.log("Bad login credentials.");
        res.render('index', { title: 'Home'});
    },function(err){
        res.render('index', { title: 'Home'});
        error(err);
    });
}

function signup(req,res){
    res.redirect("/signup");
}

function error(err) {
    debug.log("An unexpected error occurred:");
    debug.log(err.message);
}

module.exports = router;
