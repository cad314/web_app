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
                debug.log(user.professors);

                user.getAvailability(user.professors[0].userID,
                    function (avail) {
                        debug.log("Availability acquired! Value: " + avail);
                        user.getBusyDays(user.professors[0].userID,
                            function (days) {
                                debug.log("Days acquired! Days: " + days);

                                res.render('calendar', { title: 'Calendar', user: user, availability: avail, busyDays: days});
                            },function (err) {
                                debug.log("There was an error getting instructor appt dates. Error: " + err.message);
                                res.render('calendar', { title: 'Calendar', user: user, availability: avail});
                            });
                    },function (err) {
                        debug.log("There was an error getting instructor availability. Error: " + err.message);
                        res.render('calendar', { title: 'Calendar', user: user});
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
                    user.getBusyDays(user.userID,
                        function (days) {
                            debug.log("Days acquired! Days: " + days);

                            res.render('prof_calendar', { title: 'Calendar', user: user, availability: avail, busyDays: days});
                        },function (err) {
                            debug.log("There was an error getting instructor appt dates. Error: " + err.message);
                            res.render('prof_calendar', { title: 'Calendar', user: user, availability: avail});
                        });
                },function (err) {
                    debug.log("There was an error getting instructor availability. Error: " + err.message);
                    res.render('prof_calendar', { title: 'Calendar', user: user});
                });

            res.render('prof_calendar', { title: 'Calendar', user: user});
        }
    }
    else{
        res.redirect("../");//Go back to home page
    }
});

router.get('/updateProf',function (req,res,next) {

    debug.log(req.query.profID);

    user.getAvailability(req.query.profID,
        function (avail) {
            debug.log(avail);

            user.getBusyDays(req.query.profID,
                function (days) {
                    debug.log(days);
                    res.render('calendar', { title: 'Calendar', user: user, availability: avail, busyDays: days});
                }, function (err) {
                    debug.log("There was an error! Error: " + err.message);

                    res.render('calendar', { title: 'Calendar', user: user, availability: avail});
                })
        }, function (err) {
            debug.log("There was an error! Error: " + err.message);

            res.render('calendar', { title: 'Calendar', user: user});
        });
});

module.exports = router;
