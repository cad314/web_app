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

User.prototype.login = function(first,last,pw,onSuccess,onFail){

    var success = function(rows){
        console.log("Success!");
        if(rows.length > 0) {
            console.log("User found! First name: " + rows[0].firstName + " Last name: " + rows[0].lastName + " PW: " + rows[0].password);
            onSuccess(true);
            return;
        }
        onSuccess(false);
    };

    var fail = function(err){
        console.log("An error occured: " + err.message);
        onFail(err);
    };

    db.sendQuery("SELECT * FROM Students WHERE firstName=? AND lastName=? AND password=?",[first,last,pw],success,fail);
};

module.exports = new User();