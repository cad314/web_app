/**
 * Created by CAD on 001 05/01/2017.
 */

var db = require('./db_connect.js');//Database connection
//var db_conn = require("../app").db_connection;
//var db_conn = db.connect();

//User Model
function User(){

    this.first = "";
    this.last = "";
    this.pw = "";
}

User.prototype.login = function(email,password,onSuccess,onFail){

    var success = function(rows){
        console.log("Login Success!");
        if(rows.length > 0) {
            onSuccess(true,rows);
            return;
        }
        onSuccess(false,null);
    };

    var fail = function(err){
        console.log("An error occured: " + err.message);
        onFail(err);
    };

    db.sendQuery("SELECT firstName, lastName, email, userID, isStudent FROM Users WHERE email=? AND password=?",[email,password],success,fail);
};

User.prototype.register = function(){

};

module.exports = new User();