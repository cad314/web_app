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
};

//Looks for user with password and email address, updates user object
//Calls the callback functions upon database success or failure, passing the login status
User.prototype.login = function(email,password,onSuccess,onFail,onErr){

    var self = this;

    var success = function(rows){

        if(rows.length > 0) {
            debug.log("Login Success!");

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
        debug.log("An error occurred: " + err.message);
        onErr(err);
    };

    db.sendQuery("SELECT firstName, lastName, email, userID, isStudent FROM Users WHERE email=? AND password=?",[email,password],success,error);
};

User.prototype.getExtraData = function(onSuccess,onErr){
    var self = this;

    if(!self.logged_in){
        return;//Exit if user not logged in
    }

    var success = function(rows){

        if(rows.length > 0) {
            debug.log("Extra data acquired!");

            //Update User type data, while ignoring userID in results
            self.extraData = rows[0];

            debug.log(self.extraData);

            onSuccess();
        }
        else{
            debug.log("No extra user data found!");
        }
    };

    var error = function(err){
        debug.log("An error occured: " + err.message);
        onErr(err);
    };

    //Get user type specific data
    if(self.isStudent){
        db.sendQuery("SELECT * FROM Students WHERE userID = ?",[self.userID],success,error);
    }
    else{
        db.sendQuery("SELECT * FROM Professors WHERE userID = ?",[self.userID],success,error);
    }
};

User.prototype.getAppointmentData = function(onSuccess,onErr){
    var self = this;

    if(!self.logged_in){
        return;//Exit if user not logged in
    }

    var success = function(rows){

        debug.log("Appointment data acquired!");

        self.appointments = rows;
        debug.log(self.appointments);

        onSuccess();
    };

    var error = function(err){
        debug.log("An error occurred: " + err.message);
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

User.prototype.register = function(firstName, lastName, email, password, isStudent, extraData, onSuccess, onFail, onErr){

    var self = this;

    var newUser = function(rows){

        if(rows.length > 0){
            debug.log("User email already exists. Registration stopped.");
            onFail();
        }
        else{
            debug.log("Ready to add user! First: " + firstName + " Last: " + lastName + " Email: " + email + " PW: " + password + " Student: " + String(isStudent));

            var Query = "INSERT INTO `test_database`.`Users` (`firstName`, `lastName`, `password`, `email`, `isStudent`) VALUES (?, ?, ?, ?, ?);";

            if(isStudent){
                //Register new student
                db.sendQuery(Query,[firstName,lastName,password,email,1],
                    function(){
                        self.registerStudent(email,extraData.phoneNo,extraData.major,extraData.minor,onSuccess,error);
                    },
                    function(err){
                        error(err);
                    });
            }
            else{
                db.sendQuery(Query,[firstName,lastName,password,email,0],
                    function(){
                        self.registerProf(email,extraData.deptName,extraData.officePhone,onSuccess,error);
                    },
                    function(err){
                        error(err);
                    });
            }
        }
    };

    var error = function(err){
        debug.log("An error occurred: " + err.message);
        onErr(err);
    };

    //Check whether user exists
    Query = "SELECT * FROM Users WHERE email = ?";

    db.sendQuery(Query,[email],newUser,error);
};

User.prototype.registerStudent = function(email,phone,major,minor,onSuccess,onErr){

    var newStudent = function(rows){
        var Query = "INSERT INTO `test_database`.`Students` (`phoneNo`, `major`, `minor`, `userID`) VALUES (?, ?, ?, ?);";
        var userID = rows[0].userID;

        db.sendQuery(Query,[phone,major,minor,userID],onSuccess,onErr);
    };

    //Get user ID, pass to new student query
    db.sendQuery("SELECT * FROM Users WHERE email = ?",[email],newStudent,onErr);
};

User.prototype.registerProf = function(email,dept,office,onSuccess,onErr){

};

User.prototype.updateUser = function(isStudent,first,last,password,extraData,onSuccess,onFail,onErr){

};

module.exports = new User();