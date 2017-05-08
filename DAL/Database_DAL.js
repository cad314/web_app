/**
 * Created by CAD on 024 04/24/2017.
 */
var mysql = require('mysql');

function DatabaseConnector() {

    this.host = "blue.cs.sonoma.edu";
    this.user = "jdevincenzi";
    this.password = "003930490";
    this.database = "test_database";
    this.connected = false;

    //Create connection
    this.connection = mysql.createConnection(({host:this.host,user:this.user,password:this.password,database:this.database}));
}

DatabaseConnector.prototype.connect = function(callback){
    var self = this;
    if(!self.connection){
        console.log("Error creating connection");
    }
    else{
        self.connection.connect(function(err){
            if(err){
                console.log("Error connecting to DB: " + err.message);
                return;
            }
            self.connected = true;
            console.log("Connection successful!");
            callback();
        });
    }
};

DatabaseConnector.prototype.checkConnection = function(){
    var self = this;

    if(!self.connected){
        self.connect(function () {
            console.log("Connected: " + self.connected);
            self.sendQuery("SELECT * FROM Students",null,function(rows){
                //Performs on success
                console.log("Test successful, values: " + rows[2].firstName + " " + rows[2].password);
                self.connection.end(function () {
                    self.connected = false;
                    console.log("Connection closed.");
                })
            },function(err){
                //Performs on failure
                console.log("Test failed: " + err.message);
            });
        });
    }
};

DatabaseConnector.prototype.sendQuery = function(query,queryValues,onSuccess,onFail){
    var self = this;
    self.connection.query(query,queryValues,function(err,rows,fields){
        if(err){
            onFail(err);
            return;
        }
        onSuccess(rows);
    });
};

module.exports = new DatabaseConnector();
