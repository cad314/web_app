var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    console.log(req.body);
    if(app.locals.logged){
        res.render('calendar', { title: 'Calendar', data: app.locals.UserData });
    }
    else{
        res.redirect("../");//Go back to home page
    }
});

module.exports = router;
