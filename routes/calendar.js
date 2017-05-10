var express = require('express');
var debug = require('debug');
var router = express.Router();
var app = require('./../app');
var user = app.locals.user;

router.get('/', function(req, res, next) {

    if(user.logged_in){

        if(user.isStudent){
            user.getProfessorData(function () {
                debug.log("Professor data acquired! This is a student calendar.");

                    user.getScheduledDays(true,user.userID,
                        function (days) {
                            debug.log("Days acquired! Days: " + days);

                            return res.render('calendar', { title: 'Calendar', user: user, busyDays: days, availability: "0,0,0,0,0,0,0"});
                        },function (err) {
                            debug.log("There was an error getting instructor appt dates. Error: " + err.message);
                            return res.render('calendar', { title: 'Calendar', user: user, availability:  "0,0,0,0,0,0,0", busyDays: ""});
                        });
            },function (err) {
                debug.log("An error occurred fetching professor data: " + err.message);
            });
        }
        else{
            debug.log("This is a professor calendar.");

            user.getAvailability(user.userID,
                function (avail) {
                    debug.log("Availability acquired! Value: " + avail);
                    user.getScheduledDays(false,user.userID,
                        function (days) {
                            debug.log("Days acquired! Days: " + days);

                            return res.render('prof_calendar', { title: 'Calendar', user: user, availability: avail, busyDays: days});
                        },function (err) {
                            debug.log("There was an error getting instructor appt dates. Error: " + err.message);
                            return res.render('prof_calendar', { title: 'Calendar', user: user, availability: avail, busyDays: ""});
                        });
                },function (err) {
                    debug.log("There was an error getting instructor availability. Error: " + err.message);
                    return res.render('prof_calendar', { title: 'Calendar', user: user, availability:  "0,0,0,0,0,0,0", busyDays: ""});
                });
        }
    }
    else{
        res.redirect("../");//Go back to home page
    }
});

router.get('/updateStudent',function (req,res,next) {

    debug.log(req.query.myID);

    user.getScheduledDays(true,req.query.myID,
        function (days) {
            debug.log(days);
            return res.render('calendar', { title: 'Calendar', user: user, availability: "0,0,0,0,0,0,0", busyDays: days});
        }, function (err) {
            debug.log("There was an error! Error: " + err.message);
            return res.render('calendar', { title: 'Calendar', user: user, availability: "0,0,0,0,0,0,0", busyDays: ""});
        })
});

router.get('/updateProf',function (req,res,next) {

    debug.log(req.query.profID);

    user.getAvailability(req.query.profID,
        function (avail) {
            debug.log(avail);

            user.getScheduledDays(false,req.query.profID,
                function (days) {
                    debug.log(days);
                    return res.render('calendar', { title: 'Calendar', user: user, availability: avail, busyDays: days});
                }, function (err) {
                    debug.log("There was an error! Error: " + err.message);
                    return res.render('calendar', { title: 'Calendar', user: user, availability: avail, busyDays: ""});
                })
        }, function (err) {
            debug.log("There was an error! Error: " + err.message);
            return res.render('calendar', { title: 'Calendar', user: user, availability: "0,0,0,0,0,0,0", busyDays: ""});
        });
});

module.exports = router;
