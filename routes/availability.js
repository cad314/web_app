/**
 * Created by SLAM on 024 05/09/2017.
 */
var express = require('express');
var router = express.Router();
var app = require('./../app');
var user = app.locals.user;

router.get('/', function(req, res, next) {
    //Render the page is user is logged in and user is a student
    if(user.logged_in && user.isStudent == 0){
        res.render('availability', { title: 'Instructor', user: user });
    }
    else{
        res.redirect("../");//Go back to home page
    }
});

router.get('/submit', function(req, res, next) {
    //Render the page is user is logged in and user is a student
    if(user.logged_in && user.isStudent == 0){
        getAvailability();
        //res.redirect('/');
    }
    else{
        res.redirect("../");//Go back to home page
    }
});

var getAvailability = function () {

    var mon_value = 0;
    var tues_value = 0;
    var wed_value = 0;
    var thurs_value = 0;
    var fri_value = 0;
    var sat_value = 0;
    var sun_value = 0;
    var name;

    var table = document.getElementById("avail_table");
    for (var i = 0, cell; cell = table.cells[i]; i++) {
        //cells would be accessed using the "cell" variable assigned in the for loop
        name = cell.getAttribute("class");

        if (name === "mon") {
            mon_value += cell.getElementsByClassName("mon").value
        }
        else if (name === "tues") {
            tues_value += cell.getElementsByClassName("tues").value
        }
        else if (name === "wed") {
            wed_value += cell.getElementsByClassName("wed").value
        }
        else if (name === "thurs") {
            thurs_value += cell.getElementsByClassName("thurs").value
        }
        else if (name === "fri") {
            fri_value += cell.getElementsByClassName("fri").value
        }
        else if (name === "sat") {
            sat_value += cell.getElementsByClassName("sat").value
        }
        else {
            sun_value += cell.value
        }
    }

};


module.exports = router;