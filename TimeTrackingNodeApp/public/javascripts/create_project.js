function confirmation()
{
  //this function ask user to double confirm if they would
  //want to proceed change to a different page.

  confirm("Do you wish to proceed leaving the current page?")
}

function fieldConfirmation()
{
  //this function checks if all the required fields are fill in.
  //if all are fill in, show alert saying project is created and go to a pageee
  //if not, alert user to fill in all fields before proceeding

  let name = document.getElementById("project_name").value;
  let desc = document.getElementById("description").value;
  let numOfStudents = document.getElementById('numbers')
  let numberOfStudents = parseInt(numOfStudents.value) // This will contain the integer value

  let check = false;
  if((name.trim().length >=1) && (desc.trim().length>=1) && (numOfStudents.selectedIndex != 0)) {
      check = true;

      /* Must store the data in database
         i.e. name contains the name of the project
              desc contains the description of the project
              numberOfStudents contains the integer value of the number of students in the group
      */

      location.href = "/select_project"; // if user filled all the fields, we change the page
    
  }

  if(!check){
    alert("Please make sure you filled in all fields before saving");
    return false;
  }
  else {
      alert("Project is created!");
  }
  return false;

}

