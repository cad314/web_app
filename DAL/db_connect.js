/**
 * Created by CAD on 024 04/24/2017.
 */

var mysql = require('mysql');

var con = mysql.createConnection({
    host     : 'localhost:3306',
    user     : 'cody.mccants@gmail.com',
    password : '',
    database: "test_database"
});

con.connect(function(err){
    if(err){
        console.log('Error connecting to Db: ' + err.message);
        return;
    }
    console.log('Connection established');
});

con.end(function(err) {
    // The connection is terminated gracefully
    // Ensures all previously enqueued queries are still
    // before sending a COM_QUIT packet to the MySQL server.
});

module.exports = con;