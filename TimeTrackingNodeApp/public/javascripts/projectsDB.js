const pool = require('./database');

function Project() {};

Project.prototype = {
    // Find the project by name.
    find : function(user = null, callback)
    {
        // prepare the sql query
        let sql = `SELECT * FROM project WHERE ${'projectName'} = ?`;


        pool.query(sql, user, function(err, result) {
            if(err) throw err

            if(result.length) {
                callback(result[0]);
            }else {
                callback(null);
            }
        });
    },

    // This function will insert data into the database. (create a new project)
    // body is an object 
    create : function(body, callback) 
    {

        // this array will contain the values of the fields.
        var bind = [];
        // loop in the attributes of the object and push the values into the bind array.
        for(prop in body){
            bind.push(body[prop]);
        }
        // prepare the sql query
        let sql = `INSERT INTO project(projectName, description, numStudents) VALUES (?, ?, ?)`;
        // call the query give it the sql string and the values (bind array)
        pool.query(sql, bind, function(err, result) {
            if(err) callback(1000);
            // return the last inserted id. if there is no error
            else{
                callback(result.insertId);
            }
        });
    }
}

module.exports = Project;