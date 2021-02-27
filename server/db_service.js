const mysql = require('mysql');

const dotenv = require('dotenv');
dotenv.config();


const mySqlCon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password : 'boxpassword1.',
    database: 'flight_database',
    multipleStatements: true
});



module.exports = mySqlCon;