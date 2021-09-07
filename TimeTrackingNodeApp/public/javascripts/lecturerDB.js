const pool = require('./database');
const bcrypt = require('bcrypt');


function Lecturer() {};

Lecturer.prototype = {
    // Find the lecturer data by email.
    find : function(user = null, callback)
    {
        // prepare the sql query
        let sql = `SELECT * FROM lecturerinfo WHERE ${'email'} = ?`;

        pool.query(sql, user, function(err, result) {
            if(err) throw err

            if(result.length) {
                callback(result[0]);
            }else {
                callback(null);
            }
        });
    },

    // This function will insert data into the database. (create a new user)
    // body is an object 
    create : function(body, callback) 
    {

        var pwd = body.password;
        // Hash the password before insert it into the database.
        body.password = bcrypt.hashSync(pwd,10);

        // this array will contain the values of the fields.
        var bind = [];
        // loop in the attributes of the object and push the values into the bind array.
        for(prop in body){
            bind.push(body[prop]);
        }
        // prepare the sql query
        let sql = `INSERT INTO lecturerinfo(email, password) VALUES (?, ?)`;
        // call the query give it the sql string and the values (bind array)
        pool.query(sql, bind, function(err, result) {
            if(err) callback(1000);
            // return the last inserted id. if there is no error
            else{
                callback(result.insertId);
            }
        });
    },

    login : function(email, password, callback)
    {
        // find the lecturer data by his email.
        this.find(email, function(user) {
            // if there is a user by this username.
            if(user) {
                // now we check his password.
                if(bcrypt.compareSync(password, user.password)) {
                    // return his data.
                    callback(user);
                    return;
                }  
            }
            // if the email/password is wrong then return null.
            callback(null);
        });
        
    }
}

module.exports = Lecturer;