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

                            return res.render('calendar', { title: 'Calendar', user: user, busyDays: days, availability: "0,0,0,0,0,0,0", calendarID: user.userID});
                        },function (err) {
                            debug.log("There was an error getting instructor appt dates. Error: " + err.message);
                            return res.render('calendar', { title: 'Calendar', user: user, availability:  "0,0,0,0,0,0,0", busyDays: "",  calendarID: user.userID});
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

                            return res.render('prof_calendar', { title: 'Calendar', user: user, availability: avail, busyDays: days, calendarID: user.userID});
                        },function (err) {
                            debug.log("There was an error getting instructor appt dates. Error: " + err.message);
                            return res.render('prof_calendar', { title: 'Calendar', user: user, availability: avail, busyDays: "", calendarID: user.userID});
                        });
                },function (err) {
                    debug.log("There was an error getting instructor availability. Error: " + err.message);
                    return res.render('prof_calendar', { title: 'Calendar', user: user, availability:  "0,0,0,0,0,0,0", busyDays: "", calendarID: user.userID});
                });
        }
    }
    else{
        res.redirect("../");//Go back to home page
    }
});

router.get('/click',function (req, res, next) {

    var id = req.query.id;
    var day = req.query.day;

    debug.log("ID: "+id+" Day: "+day)

    if(user.logged_in && user.isStudent){
        user.getDayInfo(id,day,
            function (rows) {
                debug.log(rows);
                res.render("bookAppointment", { title: 'Appointments', user: user, calendarInfo: {hey: "test"}});
            },function (err) {
                debug.log("An error occured: " + err.message);
            })
    }
    else{

    }
});

router.get('/updateStudent',function (req, res, next) {

    debug.log(req.query.myID);

    user.getScheduledDays(true,req.query.myID,
        function (days) {
            debug.log(days);
            return res.render('calendar', { title: 'Calendar', user: user, availability: "0,0,0,0,0,0,0", busyDays: days, calendarID: user.userID});
        }, function (err) {
            debug.log("There was an error! Error: " + err.message);
            return res.render('calendar', { title: 'Calendar', user: user, availability: "0,0,0,0,0,0,0", busyDays: "", calendarID: user.userID});
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
                    return res.render('calendar', { title: 'Calendar', user: user, availability: avail, busyDays: days, calendarID: req.query.profID});
                }, function (err) {
                    debug.log("There was an error! Error: " + err.message);
                    return res.render('calendar', { title: 'Calendar', user: user, availability: avail, busyDays: "", calendarID: 0});
                })
        }, function (err) {
            debug.log("There was an error! Error: " + err.message);
            return res.render('calendar', { title: 'Calendar', user: user, availability: "0,0,0,0,0,0,0", busyDays: "", calendarID: 0});
        });
});

module.exports = router;
