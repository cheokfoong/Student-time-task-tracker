/*
FUNCTIONS AND CODE FOR CREATING PROJECTS
*/

//function to create projects
function createProject(name){
    let thisproj = document.createElement('BUTTON');
    Object.assign(thisproj,{
        className: 'projects',
        id: 'projects'
    })

    let project_text = document.createTextNode(name);
    thisproj.appendChild(project_text);
    document.getElementById("here").appendChild(thisproj);

    // Add event handler
    thisproj.addEventListener ("click", function() {
      studentProjectClicked = thisproj.innerText; // projectClicked will store the name of the project we clicked on
      // will need to store this variable in database to know which project the user clicked

      $.post('/select_project_students', { studentProjectClicked })
      location.href = "/select_group_students" // when user clicks on a project, user will go to this page
    });

}

let projectNames = JSON.parse(studentProjects) 

let projectClicked; // This variable will store the name of the project which the user clicked
// This variable will be used as a reference and hence we'll be able to laaod the correct
// information for each project from the database 

function loadProjects(){
  /*
    Function which will load all the projects which are already created once page loads
  */
  // loop through the list of project names:
  for (let i = 0; i < projectNames.length; i++){
   // will create all the project buttons once page load
    createProject(projectNames[i]); // projectNames is a list that will contain all the projectNames
    // Will need to get these names from the database
  }

}






/*
FUNCTIONS AND CODE FOR LOADING GROUPS
*/

function loadGroups(){
  
  groupToLoad = studentGroup;

  addRow(groupToLoad);
  // add the name of the group working on that project
  
}

// function to load the current groups to the group_table
function addRow(name){
    let tableRef = document.getElementById("group_table").getElementsByTagName('tbody')[0];
    let newRow = tableRef.insertRow(tableRef.rows.length);
    let cell = newRow.insertCell(0)
    //cell.innerHTML = "TBD" // random group name to test adding to table
    cell.innerHTML = name // Add group name to table

    // create button for checking members
    let members = document.createElement('BUTTON');
    Object.assign(members,{
        className: 'members',
        id: 'members'
        //onclick: memberClick()
    })

    let member_text = document.createTextNode('MEMBERS');
    members.appendChild(member_text);

    // create button to direct to project log page
    let projectlog = document.createElement('BUTTON');
    Object.assign(projectlog,{
        className: 'projectlog',
        id: 'projectlog'
        //onclick: projectLog()
    })

    let projectlog_text =  document.createTextNode('PROJECT LOG')
    projectlog.appendChild(projectlog_text)

    //appending these two buttons on each group
    cell.appendChild(projectlog);
    cell.appendChild(members);

    // Add event handler when we click on members
    members.addEventListener ("click", function() {
      // We'll need to access the members of each group from the database and then display them
      // This can be done, if we store the id of the group in the database,
      // We can then use this id to list the members
      //The code below is an example of how we can do this:
      // To get the id of the button we clicked is 'members'

      //let studentsInGroup = ["Bruce Wayne", "Diana Prince", "Oliver Queen"] // This is just an exampple
      // We'll need to fetch the names from the database
      alert("Members are: \n" +  JSON.parse(membersList)); // display the names of the students in the group
      
    });

    // Add event handler when we click on projectLog
    //When user click on PROJECT LOG button, it will direct to project log page for that group they click on

    projectlog.addEventListener ("click", function() {
      // id of project log button is: ''projectlog''
       
      location.href = "/project_log_students";
      // We can use this id to know from which database we'll need to load from
      
      // then when we go to the page, we'll need to load the data for this group from the database
      
    });

}

//Example of adding members to the list
function addElement(name){
  var members = document.getElementById("members");
  var newdiv = document.createElement('div');
  newdiv.className = "dropdown-content";
  newdiv.id = "memberList";
  newdiv.innerHTML = name;
  members.appendChild(newdiv);

}

/* When the user clicks on MEMBERS button,
toggle between hiding and showing the dropdown content */
// function memberClick() {
//   document.getElementById("memberList").classList.toggle("display");

// }
  
  // Close the dropdown if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }


  