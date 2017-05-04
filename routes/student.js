/**
 * Created by CAD on 024 04/24/2017.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.body);

    //Render the page is user is logged in and user is a student
    if(app.locals.logged && app.locals.UserData.isStudent > 0){
        res.render('student', { title: 'Student', data: app.locals.UserData });
    }
    else{
        res.redirect("../");//Go back to home page
    }
});

module.exports = router;