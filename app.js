var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;//App must be exported before

//Application level variables
app.locals.database = require('./DAL/Database_DAL');
app.locals.user = require('./DAL/User_DAL');

//Routes and pages
var index = require('./routes/index');
var calendar = require('./routes/calendar');
var student = require('./routes/student');
var instructor = require('./routes/instructor');
var signup = require('./routes/signup');

app.use('/', index);
app.use('/calendar', calendar);
app.use('/student', student);
app.use('/instructor', instructor);
app.use('/signup', signup);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);

    res.render('productionError',{title: "Error"});
});