/**
 * Created by CAD on 001 05/01/2017.
 */
var db = require('./../app').locals.database;
var debug = require('debug');

//User Model
function User(){
    this.logged_in = false;
    this.userID = 0;
    this.first = "";
    this.last = "";
    this.email = "";
    this.isStudent = true;
    this.extraData = null;
    this.appointments = null;
    this.professors = null;
}

//Logs out the user
User.prototype.logout = function(){
    this.logged_in = false;
    this.userID = 0;
    this.first = "";
    this.last = "";
    this.email = "";
    this.isStudent = true;
    this.extraData = null;
    this.appointments = null;
    this.professors = null;
};

//Looks for user with password and email address, updates user object
//Calls the callback functions upon database success or failure, passing the login status
User.prototype.login = function(email,password,onSuccess,onFail,onErr){

    var self = this;

    var success = function(rows){

        if(rows.length > 0) {

            //Update User basic data
            self.logged_in = true;
            self.userID = rows[0].userID;
            self.first = rows[0].firstName;
            self.last = rows[0].lastName;
            self.email = rows[0].email;
            self.isStudent = rows[0].isStudent;

            onSuccess();
        }
        else {
            self.logout();//Wipe user data clean
            onFail();
        }
    };

    var error = function(err){
        onErr(err);
    };

    db.sendQuery("SELECT firstName, lastName, email, userID, isStudent FROM Users WHERE email=? AND password=?",[email,password],success,error);
};

User.prototype.getExtraData = function(onSuccess,onEmpty,onErr){
    var self = this;

    if(!self.logged_in){
        return;//Exit if user not logged in
    }

    var success = function(rows){

        if(rows.length > 0) {

            //Update User type data, while ignoring userID in results
            self.extraData = rows[0];

            debug.log(self.extraData);

            onSuccess();
        }
        else{
            onEmpty();
        }
    };

    var error = function(err){
        onErr(err);
    };

    //Get user type specific data
    if(self.isStudent){
        db.sendQuery("SELECT * FROM Students WHERE userID = ?",[self.userID],success,error);
    }
    else{
        var Query = "SELECT p.deptName, p.officePhone, d.phoneNo AS deptPhone, d.location FROM test_database.Professors AS p ";
        Query += "JOIN test_database.Department AS d ON p.deptName = d.deptName WHERE p.userID = ?";

        db.sendQuery(Query,[self.userID],success,error);
    }
};

User.prototype.getScheduledDays = function(student, userID, onSuccess, onErr){

    var query = "";

    if(student){
        query = "SELECT * FROM test_database.Appointments WHERE day >= CURDATE() AND studentID = ?;";
    }
    else{
        query = "SELECT * FROM test_database.Appointments WHERE day >= CURDATE() AND profID = ?;";
    }

    db.sendQuery(query,[userID],function (rows) {

        var days = "";

        var writeDay = function(item,index){

            //Set value to negative if the day is unavailable
            if(item.class === "UNAVAILABLE"){
                days += ";-" + Math.round(item.day.valueOf()/86400000);
            }
            else {
                days += ";" + Math.round(item.day.valueOf()/86400000);
            }
        };

        //Read rows data and write to a string to return.
        debug.log(rows);
        rows.forEach(writeDay);

        days = days.slice(1);

        onSuccess(days);
    },onErr);
};

User.prototype.getAvailability = function (profID,onSuccess,onErr) {
    var query = "SELECT Mon, Tues, Wed, Thurs, Fri, Sat, Sun FROM test_database.Professors WHERE userID = ?;";

    db.sendQuery(query,[profID],function (rows) {

        var availability = rows[0].Sun + "," + rows[0].Mon + "," + rows[0].Tues + "," + rows[0].Wed;
        availability += "," + rows[0].Thurs + "," + rows[0].Fri + "," + rows[0].Sat;

        onSuccess(availability);
    },onErr);
};

User.prototype.getAppointmentData = function(onSuccess,onErr){
    var self = this;

    if(!self.logged_in){
        return;//Exit if user not logged in
    }

    var success = function(rows){

        self.appointments = rows;
        debug.log(self.appointments);

        onSuccess();
    };

    var error = function(err){
        onErr(err);
    };

    //Get user type specific appointment data
    var Query = "SELECT Appointments.apptStartTime, Appointments.duration, Appointments.day, Appointments.class, "
        + "Appointments.discussionTopic, Appointments.message, user1.firstName AS studentFirst, "
        + "user1.lastName AS studentLast, user1.email AS studentEmail, user2.firstName AS profFirst, "
        + "user2.lastName AS profLast, user2.email AS profEmail FROM Appointments INNER JOIN Users AS user1 "
        + "ON Appointments.studentID = user1.userID INNER JOIN Users AS user2 ON Appointments.profID = user2.userID ";

    if(self.isStudent){
        Query += "WHERE user1.userID = ?;";
        db.sendQuery(Query,[self.userID],success,error);
    }
    else{
        Query += "WHERE user2.userID = ?;";
        db.sendQuery(Query,[self.userID],success,error);
    }
};

User.prototype.register = function(firstName, lastName, email, password, isStudent, onSuccess, onFail, onErr){

    var newUser = function(rows){

        if(rows.length > 0){
            onFail();
        }
        else{
            var Query = "INSERT INTO `test_database`.`Users` (`firstName`, `lastName`, `password`, `email`, `isStudent`) VALUES (?, ?, ?, ?, ?);";

            //Register new student
            var student = isStudent ? 1 : 0;
            db.sendQuery(Query,[firstName,lastName,password,email,student],
                function(rows){
                    onSuccess(rows);
                },
                function(err){
                    error(err);
                });
        }
    };

    var error = function(err){
        onErr(err);
    };

    //Check whether user exists
    Query = "SELECT * FROM Users WHERE email = ?";

    db.sendQuery(Query,[email],newUser,error);
};

//Passes the new user ID to the 'onSuccess' function
User.prototype.registerStudent = function(first,last,email,password,phone,major,minor,onSuccess,onFail,onErr){

    var Query = "INSERT INTO `test_database`.`Students` (`phoneNo`, `major`, `minor`, `userID`) VALUES (?, ?, ?, ?);";

    this.register(first,last,email,password,1,
        function (rows) {
            var userID = rows.insertId;

            db.sendQuery(Query,[phone,major,minor,userID],
                function () {
                    onSuccess(userID);
                },
                function (err) {
                    onErr(err);
                }
            );
        },function(rows){
            onFail(rows);
        },
        function (err) {
            onErr(err);
        }
    );
};

User.prototype.registerProf =function(first,last,email,password,dept,office,onSuccess,onFail,onErr){

    var Query = "INSERT INTO `test_database`.`Professors` (`deptName`, `officePhone`, `userID`) VALUES (?, ?, ?);";

    this.register(first,last,email,password,0,
        function (rows) {
            var userID = rows.insertId;

            db.sendQuery(Query,[dept,office,userID],
                function () {
                    onSuccess(userID);
                },
                function (err) {
                    onErr(err);
                }
            );
        },function(rows){
            onFail(rows);
        },
        function (err) {
            onErr(err);
        }
    );
};

User.prototype.updateStudent = function(email,password,phone,major,minor,onSuccess,onErr){

    var Query = "UPDATE 'test_database'.'Users' SET 'email' = ?, 'password' = ? WHERE 'userID' = ? ";
    Query += "UPDATE `test_database`.`Students` SET `phoneNo`= ?, 'major' = ?, 'minor' = ? WHERE `userID` = ?;";

    db.sendQuery(Query,[first,last,password,user.userID,phone,major,minor,user.userID],onSuccess,onErr);
};

User.prototype.updateProf = function (email,password,dept,officeNo,onSuccess,onErr) {

    var Query = "UPDATE 'test_database'.'Users' SET 'email' = ?, 'password' = ? WHERE 'userID' = ? ";
    Query += "UPDATE `test_database`.`Professors` SET `deptName`= ?, 'officePhone' = ? WHERE `userID` = ?;";

    db.sendQuery(Query,[first,last,password,user.userID,dept,officeNo,user.userID],onSuccess,onErr);
};

//Returns a list of all professors, containing their first name, last name, email and userID.
User.prototype.getProfessorData = function (onSuccess,onErr) {
    var Query = "SELECT firstName, lastName, email, userID FROM test_database.Users WHERE isStudent = 0;";
    var self = this;

    db.sendQuery(Query,[],
        function (rows) {
            self.professors = rows;
            onSuccess();
        },
        function (err) {
            onErr(err);
        }
    )
};

User.prototype.test = function () {
    debug.log("The test function was called");
};

module.exports = new User();