let students = JSON.parse(studentList)
let studentsAlreadyAdded = JSON.parse(studentsAlreadyUsed)
let student; // will store the student that the teacher selected
let groupMembers = []; // empty list that will store all members in that group
let number = JSON.parse(NumOfMembers) // list of number of students that should be allocated
let projects = JSON.parse(projectList); // list of all projectNames

let projectClicked = projetSel; // projectClicked will store the name of the project where he/she clicked the add button
// will need to retrieve this info from database to know which project we need to store the newly allocated group
console.log(projects);
console.log(number);

function allocate() {
    /*
        This function is executed everytime the teacher clicks on "Allocate Student"
        Teacher selects student first from the list then upon clicking the "Allocate Student" button,
        The student will be appended to the list of group members.

        We'll then remove the student from the testing list and create the new list of students from
        which the teacher can select a new student

    */
    var node = document.createElement("LI"); // create a list item
    student = document.getElementById("mySelect").value; // get the student name the teacher selected
    var textnode = document.createTextNode(student);
    node.appendChild(textnode);
    document.getElementById("members").appendChild(node); // appends student's name in the list of group members

    groupMembers.push(student); // add the student in the list of groupMembers
    console.log(groupMembers)
    // This is done so that we can store the students later in our database
    
    // remove added elements from list
    var index = students.indexOf(student); // will need to change to make it work with database

    if(index!=-1){

        students.splice(index, 1); // remove the student from the list  of students

        var select = document.getElementById("mySelect");
        select.options.length = 0; // reset the list that we select students from

        myFunc(); // update the list that we can select from with 1 student less i.e. can't select one student twice
    }

  }

function myFunc(){
    /*
        This function is executed once when the page is loaded.
        It takes all students from database and list them in the select options for group members
    */
    let select = document.getElementById( 'mySelect' );
    console.log(studentsAlreadyAdded)
    for ( let i = 0; i < students.length; i++) {
        if (studentsAlreadyAdded.includes(students[i])){}
        else {
            option = document.createElement( 'option' );
            option.value = option.text = students[i];
            select.add(option);
        }
    }
}

function save(){
    /*
        When teacher clicks save, it should store the group name and the list of students in database
    */

    let name = document.getElementById("gName").value;
    //var ul = document.getElementById("members").value; // get the list in the html page
    let members = JSON.stringify(groupMembers)
    
    let index = projects.indexOf(projectClicked); // get the index of the project we clicked
    let num = number[index]; // get the number of students that should be in this group

    if (name.length === 0){
        alert("Please fill in the name of the group before saving");
    }

    else if(groupMembers.length < num){
        alert("Please select " + num + " students");
    }

    else if(groupMembers.length > num){
        alert("More than " + num + " students selected");
    }

    else{
        // groupMembers will contain the students allocated in that group
        // name is the name of that group
        // projectClicked stores the name of the project, we need this variable to know
        // in which database we need to store the newly allocated group
        //we must store this data in database

        $.post('/groups', { name, members })

        // After storing the data in database we redirect the user to the select_group.html
        location.href = "/select_group"
    }

    
}


function deallocate(){
    /*
        This function is used to remove a student from the group
    */

    // Remove student from the list of group members:
    var listItems = document.getElementById("members").getElementsByTagName("LI"); // get all list items on the html page
    var last = listItems[listItems.length - 1]; // get the last item we added 
    last.parentNode.removeChild(last); // remove that item

    // Add the student back in the list of all students who are not yet allocated:
    students.push(student); // read the student back in the list of all students

    // Remove the student from the list of groupMembers:
    var index = groupMembers.indexOf(student); // get the index of the student in our list groupMembers

    if(index!=-1){

        groupMembers.splice(index, 1); // remove the student from the list  of students
    }

    var select = document.getElementById("mySelect");
    select.options.length = 0; // reset the list that we select students from

    myFunc(); // update the list that we can select from with the student back

}

