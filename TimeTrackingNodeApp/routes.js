var express = require('express')
var moment = require('moment')
var router = express.Router();
const Student = require('./public/javascripts/studentDB');
const Lecturer = require('./public/javascripts/lecturerDB');
const Project = require('./public/javascripts/projectsDB');
const pool = require('./public/javascripts/database');
const { render } = require('ejs');

const student = new Student()
const lecturer = new Lecturer()
const project = new Project()
var projectSelected
var projectCurrentGroup
var currentGroupTasklog
var groupSelectedTasklog
var currentStudent
var currentStudentProjects
var studentProjectSelected
var studentProjectSelectedGroup
var currentGroupChartInfo


router.get('/', function(req, res){
    res.render("index")
})


router.get("/create_project", function(req,res){
    
    res.render("create_project");
});


router.get("/graph_page", function(req,res){
    
    console.log(currentGroupChartInfo)
    res.render("graph_page", { currentGroupChartInfo, projectSelected, projectCurrentGroup });
});

router.post('/graph_page', function(req, res) {

    let groupGraph = req.body.graphID
    let chartInfo = [['Task', 'Hours per Day']]
    let flag = true;

    projectCurrentGroup = groupGraph

    pool.query("Select * from project" + projectSelected + groupGraph + "tasklog",  
    function(err, rows) {
        if (err) {
            console.log(err)
            return;
        }
    
    rows.forEach(function(result) {
        for (let i = 0; i < chartInfo.length; i++){
            if (result.name == chartInfo[i][0]) {flag = false;}
        }

        if (flag){
            chartInfo.push([result.name])
        }

        else {flag = true}
    })
    
    for (let a = 1; a < chartInfo.length; a++){
        let studentTotalTimeTaken = 0

        rows.forEach(function(result) {
            if (result.name == chartInfo[a][0]){
                var startTime = moment(result.starttime, "HH:mm");
                var endTime = moment(result.endtime, "HH:mm");

                // calculate total duration
                var duration = moment.duration(endTime.diff(startTime));
                studentTotalTimeTaken += duration.asHours()
            }
        })
        chartInfo[a].push(studentTotalTimeTaken)
    }
    currentGroupChartInfo = chartInfo

    });    
});


router.get("/groups", function(req,res){ // this is the page where teacher allocate students into groups
    
    const students = []
    const studentsInGroups = []
    const projects = []
    const numMembers = []
    
    pool.query("Select * from studentinfo", // get all data from the table named studentinfo
    function(err, rows) {
        if (err) {
            console.log(err)
            return;
        }
    
    rows.forEach(function(result) {
        students.push(result.name) // push all students that are in studentinfo into the list called students
        })    

    pool.query("Select * from project" + projectSelected + "StudentsAdded", // ?? query from the table of the project we clicked on
    function(err, rows) {
        if (err) {
            console.log(err)
            return;
        }
    
    rows.forEach(function(result) {
        studentsInGroups.push(result.name) // add all students who are in this project in the list studentsInGroups
        })
    
    pool.query("Select * from project", // get all data from the table named project
    function(err, rows) {
        if (err) {
            console.log(err)
            return;
        }
    
    rows.forEach(function(result) { // add project names into the list called projects
        projects.push(result.projectName) 
        numMembers.push(result.numStudents)
        })  
    
    console.log(students)
    console.log(projectSelected)
    console.log(studentsInGroups)
    console.log(projects)
    console.log(numMembers)


    res.render("groups", {students, projectSelected, studentsInGroups, projects, numMembers}); // send all data to the page groups.ejs
    
    })
    })
    })
});

router.post('/groups', function(req, res) {
    var projectGroupName = req.body.name
    var membersList = JSON.parse(req.body.members)

    var sql = 'INSERT INTO project' + projectSelected + 'groups(groupname) VALUES (' + JSON.stringify(projectGroupName) + ')';
    // call the query give it the sql string and the values (bind array)
    pool.query(sql, function(err, result) {
        if(err){
            console.log(err);
        };
        console.log(result);
    });

    var sql = 'CREATE TABLE project' + projectSelected + projectGroupName + 'tasklog' + '(rowID INT NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), id VARCHAR(45), task VARCHAR(128), date VARCHAR(30), starttime VARCHAR(40), endtime VARCHAR(40), taskdescription VARCHAR(200), status VARCHAR(20), comment VARCHAR(100))';
    pool.query(sql, (err, result) => {
        if(err){
            console.log('Error in creating table');

        };
        console.log('Table created');
    });
    
    var sql = 'CREATE TABLE project' + projectSelected + projectGroupName + 'members' + '(members VARCHAR(255), PRIMARY KEY (members))';
    pool.query(sql, (err, result) => {
        if(err){
            console.log('Error in creating table');

        };
        console.log('Table created');

    for (a = 0; a < membersList.length; a++){
        var sqlquery = 'INSERT INTO project' + projectSelected + projectGroupName + 'members (members) VALUES (' + JSON.stringify(membersList[a]) + ')';
        // call the query give it the sql string and the values (bind array)
        pool.query(sqlquery, function(err, result) {
            if(err){
                console.log(err);
            };
            console.log(result);
        })

        for (i = 0; i < membersList.length; i++){
            var sqlquery = 'INSERT INTO project' + projectSelected + 'StudentsAdded(name) VALUES (' + JSON.stringify(membersList[i]) + ')'

            pool.query(sqlquery, function(err, result) {
            if(err){
                console.log(err);
            };
            console.log(result);
            });
        }

    };
    })

})


router.get('/index', function(req, res){
    res.render("index")
})


router.get("/lect_homepage", function(req,res){
    
    res.render("lect_homepage");
});


router.get("/lecturer_login", function(req,res){
    
    res.render("lecturer_login");
});


router.get("/project_log_students", function(req,res){
    
    let tasklog = []

    pool.query("Select * from project" + studentProjectSelected + studentProjectSelectedGroup + "tasklog",  
    function(err, rows) {
        if (err) {
            console.log(err)
            return;
        }
    
    rows.forEach(function(result) {
        tasklog.push([result.name, result.id, result.task, result.date, result.starttime, result.endtime, result.taskdescription, result.status, result.comment])  
    }) 

    console.log(tasklog)
    res.render("project_log_students", { currentStudent ,tasklog });
    });
});

router.post("/project_log_students", function(req, res){

    let id = JSON.stringify(req.body.student)
    let taskDone = JSON.stringify(req.body.task)
    let dateCompleted = JSON.stringify(req.body.date)
    let startTime = JSON.stringify(req.body.start_time)
    let endTime = JSON.stringify(req.body.end_time)
    let taskDescription = JSON.stringify(req.body.description)
    let taskStatus = JSON.stringify(req.body.status)

    var sqlquery = 'INSERT INTO project' + studentProjectSelected + studentProjectSelectedGroup + 'tasklog (name, id, task, date, starttime, endtime, taskdescription, status) VALUES (' + JSON.stringify(currentStudent) + ', ' + id + ', ' + taskDone + ', ' + dateCompleted + ', ' + startTime + ', ' + endTime + ', ' + taskDescription + ', ' + taskStatus + ')';
    // call the query give it the sql string and the values (bind array)
    pool.query(sqlquery, function(err, result) {
        if(err){
            console.log(err);
        };
        console.log(result);
    })
});


router.get("/project_log", function(req,res){
    
    res.render("project_log", { groupSelectedTasklog });
});

router.post("/project_log", function(req, res){
    
    let rowToInsert = req.body.rowToAdd
    let comment = req.body.msg

    var sql = 'UPDATE project' + projectSelected + currentGroupTasklog + 'tasklog SET comment =' + JSON.stringify(comment) + 'WHERE rowID = ' + rowToInsert;

    // call the query give it the sql string and the values (bind array)
    pool.query(sql, function(err, result) {
        if(err){
            console.log(err);
        };
        console.log(result);
    });
});


router.get("/select_group_students", function(req,res){
    /*
        currentStudentProjects: list of all projects that student is working on
        studentProjectSelectedGroup: is the group name of which the student is a member of
        studentProjectSelected: is the project on which the student clicked
    */
   let members = [];
   let projectSelectedGroups = []

   pool.query("Select * from project" + studentProjectSelected + "groups",  
   function(err, rows) {
       if (err) {
           console.log(err)
           return;
       }
   
   rows.forEach(function(result) {
       projectSelectedGroups.push(result.groupname)  // add all the project names into the list
   })    

   projectSelectedGroups.forEach(group => {
       pool.query("Select * from project" + studentProjectSelected + group + "members",  
       function(err, rows) {
           if (err) {
               console.log(err)
               return;
           }
       
       rows.forEach(function(result) {
           if (currentStudent == result.members){
               studentProjectSelectedGroup = group
            //    console.log(studentProjectSelectedGroup);
            //    console.log(group);
           }
       })
       pool.query("Select * from project" + studentProjectSelected + studentProjectSelectedGroup +"members", // get the members for the group working on the project the student clicked on
       
       function(err, rows) {
           if (err) {
               console.log(err)
               return;
           }
       
       rows.forEach(function(result) { // add project names into the list called projects
           
           members.push(result.members)

        //    console.log(members);
               
           })
           res.render("select_group_students", { currentStudentProjects, studentProjectSelectedGroup, members });
      
       })
       });
   })
   
   
   });

   console.log(currentStudentProjects);
   console.log(studentProjectSelectedGroup);
//    console.log("hey");
   console.log(studentProjectSelected);
   //console.log(members);
//    console.log("render");
   //res.render("select_group_students", { currentStudentProjects, studentProjectSelectedGroup, members });
});


router.get("/select_group", function(req,res){
    
    const projects = []
    const projectGroups = []
    const members = []
    let nums = []

    pool.query("Select * from project", // get all data from the table named project
    function(err, rows) {
        if (err) {
            console.log(err)
            return;
        }
    
    rows.forEach(function(result) { // add project names into the list called projects
        projects.push(result.projectName)
        nums.push(result.numStudents);

        })    
    
    pool.query("Select * from project" + projectSelected + "groups", // get all data from the table which contains all the group names on the project we selected
    function(err, rows) {
        if (err) {
            console.log(err)
            return;
        }
    
    rows.forEach(function(result) {
        projectGroups.push(result.groupname) // add group names into the list called projectGroups
    })

    let index = projects.indexOf(projectSelected); // get the index of the project we clicked
    let num = nums[index]; // get the number of students that should be in this group

    for(i = 0; i< projectGroups.length; i++){
        
        pool.query("Select * from project" + projectSelected + projectGroups[i] +"members", // get all data from the table named project
        
        function(err, rows) {
            if (err) {
                console.log(err)
                return;
            }
        
        rows.forEach(function(result) { // add project names into the list called projects
            
            members.push(result.members)
             
            })
            
        
        if (members.length === num * projectGroups.length){
            res.render("select_group", {projects, projectSelected, projectGroups, members, nums}); // send all the data to the page select_group.ejs
        }    
        });
        
        }
        if (projectGroups.length === 0){
            res.render("select_group", {projects, projectSelected, projectGroups, members, nums}); // send all the data to the page select_group.ejs
        }

    // res.render("select_group", {projects, projectSelected, projectGroups, members}); // send all the data to the page select_group.ejs
    });
    // res.render("select_group", {projects, projectSelected});
    
    });


    // for(i = 0; i< projectGroups.length; i++){
    //     let lst = [];
    //     pool.query("Select * from project" + projectSelected + projectGroups[i] +"members", // get all data from the table named project
        
    //     function(err, rows) {
    //         if (err) {
    //             console.log(err)
    //             return;
    //         }
        
    //     rows.forEach(function(result) { // add project names into the list called projects
    //         lst.push(result.members) 
    //         }) 
    //     })
    //     members.push(lst);
    // }

    // res.render("select_group", {projects, projectSelected, projectGroups, members}); // send all the data to the page select_group.ejs
});

router.post('/select_group', function(req, res) { // routes.post takes data from client and send to our server
    let groupToShowTasklog = req.body.projectID 
    currentGroupTasklog = groupToShowTasklog

    let tasklog = []

    pool.query("Select * from project" + projectSelected + groupToShowTasklog + "tasklog",  
    function(err, rows) {
        if (err) {
            console.log(err)
            return;
        }
    
    rows.forEach(function(result) {
        tasklog.push([result.name, result.id, result.task, result.date, result.starttime, result.endtime, result.taskdescription, result.status, result.comment])  
    })

    groupSelectedTasklog = tasklog
    });
})

router.post('/select_project', function(req, res) { // routes.post takes data from client and send to our server
    var projectVal = req.body.projectClicked  // projectClicked stores the name of the project we clicked on
    projectSelected = projectVal // we then store the name of the project in the global variable
})

router.get("/select_project_students", function(req,res){
    
    res.render("select_project_students", { currentStudent, currentStudentProjects })
});

router.post("/select_project_students", function(req, res){

    studentProjectSelected = req.body.studentProjectClicked
    let projectSelectedGroups = []

    pool.query("Select * from project" + studentProjectSelected + "groups",  
    function(err, rows) {
        if (err) {
            console.log(err)
            return;
        }
    
    rows.forEach(function(result) {
        projectSelectedGroups.push(result.groupname)  // add all the project names into the list projects
    })    

    projectSelectedGroups.forEach(group => {
        pool.query("Select * from project" + studentProjectSelected + group + "members",  
        function(err, rows) {
            if (err) {
                console.log(err)
                return;
            }
        
        rows.forEach(function(result) {
            if (currentStudent == result.members){
                studentProjectSelectedGroup = group
            }
        })
        });
    })
    
    
    });

});


router.get("/select_project", function(req,res){

    const projects = []
    
    pool.query("Select * from project",  // get all data from the table named project
    function(err, rows) {
        if (err) {
            console.log(err)
            return;
        }
    
    rows.forEach(function(result) {
        projects.push(result.projectName)  // add all the project names into the list projects
        })    
    
    res.render("select_project", {projects}); // send that data to the page select_project.ejs
    });
});


router.get("/signup_page", function(req,res){
    
    res.render("signup_page");
});


router.get("/student_login", function(req,res){
    
    res.render("student_login");
});

router.post('/student_login', function(req, res) {

    student.login(req.body.username, req.body.password, function(result) {
        if(result) {
            let sql = 'SELECT * FROM studentinfo WHERE username = ' + JSON.stringify(req.body.username);

            pool.query(sql, function(err, rows) {
                if(err){
                    console.log(err);
                };

                rows.forEach(function(result) { // add project names into the list called projects
                    currentStudent = result.name
                });
               
                let projects = []
                let studentProjects = []
                pool.query("Select * from project",

                function(err, rows) {
                    if (err) {
                        console.log(err)
                        return;
                    }
                
                rows.forEach(function(result) { // add project names into the list called projects 
                    projects.push(result.projectName)    
                })
                
                for (i = 0; i < projects.length; i++){
        
                    let project = projects[i]
                    pool.query("Select * from project" + project + "studentsadded",
        
                        function(err, rows) {
                            if (err) {
                                console.log(err)
                                return;
                            }
        
                        let projectStudentAdded = []
                        rows.forEach(function(result) { // add project names into the list called projects 
                            projectStudentAdded.push(result.name)    
                        })
        
                        // console.log(project)
                        // console.log(currentStudent)
                        // console.log(projectStudentAdded[0])
        
                        for (a = 0; a < projectStudentAdded.length; a++){
                            if (currentStudent == projectStudentAdded[a]) {
                                studentProjects.push(project)
                            }
                        }
                        currentStudentProjects = studentProjects
                        
                    })
                }
                res.redirect('/select_project_students');
                
            });
            });
            
        }else {
            // if the login function returns null send this error message back to the user.
            res.send('Username/Password incorrect!');
            
        }
    })

});

// Post login data for LECTURER
router.post('/lect_homepage', (req, res, next) => {
    // The data sent from the user are stored in the req.body object.
    // call our login function and it will return the result(the user data).
    lecturer.login(req.body.email, req.body.password, function(result) {
        if(result) {
            // Store the user data in a session.
            // req.session.user = result;
            // req.session.opp = 1;
            // redirect the user to the home page.
            res.redirect('/lect_homepage');
        }else {
            // if the login function returns null send this error message back to the user.
            res.send('Email/Password incorrect!');
        }
    })

});


// Post register data
router.post('/signup_page', (req, res, next) => {
    // prepare an object containing all user inputs.
    let userInput = {
        name: req.body.studentName,
        username: req.body.studentUsername,
        password: req.body.studentPassword
    };

    // call create function. to create a new user. if there is no error this function will return its id.
    student.create(userInput, function(lastId) {
        // if the creation of the user goes well we should get an integer (id of the inserted user)
        if(!lastId) {
            // Get the user data by its id. and store it in a session.
            student.find(lastId, function(result) {
                // req.session.user = result;
                // req.session.opp = 0;
                res.redirect('/student_login');
            });

        }else {
            res.redirect('/signup_page'); // chamge this later
            console.log('Error creating a new user ...');
        }
    });

});

// Post register data
router.post('/create_project', (req, res, next) => {
    // prepare an object containing all user inputs.
    let userInput = {
        projectName: req.body.project_name, // project_name is the id used in the html, body is the tag from create_project.ejs
        description: req.body.description,
        numStudents: req.body.numbers
    };

    // call create function. to create a new user. if there is no error this function will return its id.
    project.create(userInput, function(lastId) {
        // if the creation of the user goes well we should get an integer (id of the inserted user)
        if(!lastId) {
            // Get the user data by its id. and store it in a session.
            project.find(lastId, function(result) {
                // req.session.user = result;
                // req.session.opp = 0;
                let sql = 'CREATE TABLE project' + userInput.projectName + 'Groups' + '(groupname VARCHAR(255), PRIMARY KEY (groupname))'; // create a table for that particular project
                pool.query(sql, (err, result) => {
                    if(err){
                        console.log('Error in creating table');
                    };
                    console.log(result);
                
                var sqlquery = 'CREATE TABLE project' + userInput.projectName + 'StudentsAdded' + '(name VARCHAR(255), PRIMARY KEY (name))'; // create a table which will contain all students allocated in that particular project
                pool.query(sqlquery, (err, result) => {
                    if(err){
                        console.log('Error in creating table');
                    };
                    console.log(result);

                });
            })

                res.redirect('/select_project'); // after creating, send us to the page select_project.ejs
            });

        }else {
            // res.redirect('/create_project'); // chamge this later
            res.send('Fill in all the fields!');
        }
    });

});



module.exports = router;