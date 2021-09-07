const util = require('util');
const mysql = require('mysql');
/**
 * Connection to the database.
 *  */
const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "Meng8937",
    database: "tasklog"
});

pool.getConnection((err, connection) => {
    if(err) 
        console.error(err);
    
    if(connection)
        console.log("Mysql connected.")
        connection.release();
    return;
});

pool.query = util.promisify(pool.query);

module.exports = pool;