/**
 * Created by SLAM on 024 05/09/2017.
 */
var express = require('express');
var router = express.Router();
var debug = require('debug');
var app = require('./../app');
var user = app.locals.user;

router.get('/', function(req, res, next) {
    //Render the page is user is logged in and user is a student
    if(user.logged_in && user.isStudent == 0){
        res.render('availability',{ title: 'Set Availability', user: user })
    }
    else{
        res.redirect("/");//Go back to home page
    }
});

router.post('/', function(req, res, next) {
    //Render the page is user is logged in and user is a student
    if(user.logged_in && user.isStudent == 0){
        setAvailability(req,res);
    }
    else{
        res.redirect("/");//Go back to home page
    }
});

var setAvailability = function (req,res) {

    var mon_value = 0;
    var tues_value = 0;
    var wed_value = 0;
    var thurs_value = 0;
    var fri_value = 0;
    var sat_value = 0;
    var sun_value = 0;

    var data = req.body;

    if(typeof data.mon !== 'undefined'){
        if(data.mon.constructor === Array){
            for (i = 0; i < data.mon.length; i++) {
                mon_value += Number(data.mon[i]);
            }
        }
        else {
            mon_value = Number(data.mon);
        }
    }
    if(typeof data.tues !== 'undefined'){
        if(data.tues.constructor === Array){
            for (i = 0; i < data.tues.length; i++) {
                tues_value += Number(data.tues[i]);
            }
        }
        else {
            tues_value = Number(data.tues);
        }
    }
    if(typeof data.wed !== 'undefined'){
        if(data.wed.constructor === Array){
            for (i = 0; i < data.wed.length; i++) {
                wed_value += Number(data.wed[i]);
            }
        }
        else {
            wed_value = Number(data.wed);
        }
    }
    if(typeof data.thurs !== 'undefined'){
        if(data.thurs.constructor === Array){
            for (i = 0; i < data.thurs.length; i++) {
                thurs_value += Number(data.thurs[i]);
            }
        }
        else {
            thurs_value = Number(data.thurs);
        }
    }
    if(typeof data.fri !== 'undefined'){
        if(data.fri.constructor === Array){
            for (i = 0; i < data.fri.length; i++) {
                fri_value += Number(data.fri[i]);
            }
        }
        else {
            fri_value = Number(data.fri);
        }
    }
    if(typeof data.sat !== 'undefined'){
        if(data.sat.constructor === Array){
            for (i = 0; i < data.sat.length; i++) {
                sat_value += Number(data.sat[i]);
            }
        }
        else {
            sat_value = Number(data.sat);
        }
    }
    if(typeof data.sun !== 'undefined'){
        if(data.sun.constructor === Array){
            for (i = 0; i < data.sun.length; i++) {
                sun_value += Number(data.sun[i]);
            }
        }
        else {
            sun_value = Number(data.sun);
        }
    }


    user.setAvailability([mon_value,tues_value,wed_value,thurs_value,fri_value,sat_value,sun_value],
        function () {
            debug.log("Availability updated!");
            res.redirect('/profile/professor');
        },
        function (err) {
            debug.log("An error occurred. Err: " + err.message);
            res.redirect('/profile/professor');
        });

};


module.exports = router;