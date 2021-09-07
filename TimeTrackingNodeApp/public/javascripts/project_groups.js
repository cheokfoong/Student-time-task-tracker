/*
FUNCTIONS AND CODE FOR CREATING PROJECTS
*/

let projectNames = JSON.parse(projectList)

let projectClicked; // This variable will store the name of the project which the user clicked
// This variable will be used as a reference and hence we'll be able to laaod the correct
// information for each project from the database 


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
      projectClicked = String(thisproj.innerText); // projectClicked will store the name of the project we clicked on
      $.post('/select_project', { projectClicked }) // send the variable projectClicked to the server

      location.href = "/select_group" // when user clicks on a project, user will go to this page
    });
  
}

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
let i = 0;
// The 3 variables below is used for testing, i.e. upon clickinn a particular project,
//we'll show the groups who are currently working on that project
// will need to obtain all these data from database
// let groupOnproject1 = ["group1", "group2", "group3"]
// let groupOnproject2 = ["group4", "group5", "group6"]
// let groupOnproject3 = ["group7", "group8", "group9"]
// let lst = [groupOnproject1, groupOnproject2, groupOnproject3] // this variable stores all the groups which
// are working on different projects, it's a list of lists

function loadGroups(){
  /*
    This function will load the appropriate groups which are working on a project,
    the name of the project is stored in variable 'projectClicked'
    That variable stores the name of the project on which the user clicked on
    Depending on the name, we'll need to load all the groups working on that page from the database
  */
  let projectClicked = projectSel
  let projectNames = JSON.parse(projectList)

  let groupsToLoad; // variable will store group which we'll load on the page
  let index = projectNames.indexOf(projectClicked); // we get the index of the name of the project that the user clicked on
  // The index of each project names matches with that of the groups working on that project in the list named lst
  
  groupsToLoad = JSON.parse(projectGroupList)
  
  for(let a = 0; a < groupsToLoad.length; a++){ // loop to add all the names of the groups working on that project
    addRow(groupsToLoad[a]);
  }
}

// function to load the current groups to the group_table
function addRow(name){
    let tableRef = document.getElementById("group_table").getElementsByTagName('tbody')[0];
    let newRow = tableRef.insertRow(tableRef.rows.length);
    let cell = newRow.insertCell(0)
    // cell.innerHTML = "TBD" // random group name to test adding to table
    cell.innerHTML = name // Add group name to table

    // create button for checking members
    let members = document.createElement('BUTTON');
    Object.assign(members,{
        className: 'members',
        id: 'members'.concat(i), //starts with member0, member1 ... for special ids for each group,
        //onclick: memberClick()
    })

    let member_text = document.createTextNode('MEMBERS');
    members.appendChild(member_text);

    // create button to direct to project log page
    let projectlog = document.createElement('BUTTON');
    Object.assign(projectlog,{
        className: 'projectlog',
        id: name, //starts with projectlog0, projectlog1 ... for special ids for each group
        //onclick: projectLog()
    })

    let projectlog_text =  document.createTextNode('PROJECT LOG')
    projectlog.appendChild(projectlog_text)


     /*
    ADD NEW BUTTON CALLED (GRAPH)
    WHEN BUTTON IS CLICKED, REDIRECT TO "graph_page.html" Page
    */

    // create button to check graph
    let graph = document.createElement('BUTTON');
    Object.assign(graph,{
        className: 'graph',
        id: name, //starts with graph0, graph1 ... for special ids for each group,
    })

    let graph_text = document.createTextNode('VIEW GRAPH');
    graph.appendChild(graph_text);

    //appending these two buttons on each group
    cell.appendChild(members);
    cell.appendChild(projectlog);
    cell.appendChild(graph);

    i++ // increment i by 1
    
    let projects = JSON.parse(projectList); // stores the name of all names of projects

    let names = JSON.parse(MembersList); // lst of all members in the order they appear in groups
    let number = JSON.parse(NumberOfMembers); // list of all number of students assigned to work in a group

    let inn = projects.indexOf(projectSel); // get the index of the project we clicked
    let num = number[inn]; // get the number of students that should be in this group

    // Add event handler when we click on members
    members.addEventListener ("click", function() {
      // We'll need to access the members of each group from the database and then display them
      // This can be done, if we store the id of each group in the database,
      // We can then use this id to list the members
      //The code below is an example of how we can do this:
      // To get the id of the button we clicked, use this code: this.id

      //let group1Members = ["student 1", "student 2", "student 3" ] // This is just a test
      //let group2Members = ["student 4", "student 5", "student 6" ] // This is just a test
      // We'll need to get the members of each group from database

      var lastChar = this.id.substr(this.id.length - 1); // get the last character of our id
      let index = parseInt(lastChar); // convert that last character into a string
      // alert(index);
      let lst = [];
      for (let a = index*num; a < (index*num) + num; a++){
          lst.push(names[a]);
      }
      alert(lst);
      
    });

    // Add event handler when we click on projectLog
    //When user click on PROJECT LOG button, it will direct to project log page for that group they click on

    projectlog.addEventListener ("click", function() {
      // We can know for which group the user clicked on by using this code: this.id
      let projectID = this.id; // This will show the id of the group the user clicked on
      $.post('/select_group', { projectID })
      location.href = "/project_log";
      // We can use this id to know from which database we'll need to load from
      
      // then when we go to the page, we'll need to load the data for this group from the database
      
    });
  
  // Add event handler when we click on VIEW GRAPH
  //When user click on VIEW GRAPH button, it will direct to graph page for that group they click on

  graph.addEventListener ("click", function() {
    // We can know for which group the user clicked on by using this code: this.id
    let graphID = this.id; // This will show the id of the group the user clicked on
    $.post('/graph_page', { graphID })
    location.href = "/graph_page";
    // We can use this id to know from which database we'll need to load from

    // then when we go to the page, we'll need to load the data for this group from the database

  });

}





/*
  Functions to add groups to a project
*/

function addGroups(){
  location.href = '/groups' // when user clicks on add groups, we'll redirect the user to the page where
  // the user can create the group and upon clicking save, the group will be added in the table
  // we'll need to store the info of the group in database and then upon going to the table,
  //the database will automatically update the table for the particular project
}



/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */

// function memberClick() {
//     //document.getElementById("members").classList.toggle("show");
//     alert("click")
//   }



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

  
