const mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3000,
    user: "root",
    password: "M0byNick",
    database: "employeesDB",
});

connection.connect(function(err) {
    if(err){
        return Promise.reject(err);
    }
});

module.exports = connection;
