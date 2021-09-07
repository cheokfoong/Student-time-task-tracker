// function checkTime(){
//     /*
//       Function checks if the time entered by the user is in the correct format
//       correct format is xx-xx-xx
//     */
    
//     let start_time = document.getElementById("start_time").value;
//     let end_time = document.getElementById("end_time").value;
//       //let rel = /^\d{2}-\d{2}-\d{2}$/;
//       let rel = /^[0-9][0-9]*:[0-5]?[0-9]:[0-5]?[0-9]$/
//       if (rel.test(start_time) && rel.test(end_time)){
//        document.getElementById("TimePrompt").innerHTML = "<strong> valid </strong>";
//        document.getElementById("TimePrompt").style.color = "green";
//        return (true);
//       }
    
//       else{
//         document.getElementById("TimePrompt").innerHTML = "<strong> Time must be in the xx:xx:xx format or check if minutes and seconds are less than 60 </strong>";
//         document.getElementById("TimePrompt").style.color = "red";
    
//         return (false);
//       }
//     }


function checkSave(){
    /*
      Function to handle the action of user clicking save button
      Function will check if user filled in all input fields if not then will show an alert
    */
     let student = document.getElementById("siD").value;
     let task = document.getElementById("task").value;
     let start_time = document.getElementById("start_time").value;
     let end_time = document.getElementById("end_time").value;
     let date = document.getElementById("date").value;
     let description = document.getElementById("description").value;
     let status = checkStatus();

     let check = false;
     if((student.trim().length>=1 && task.trim().length >=1 && start_time.length >0 && end_time.length >0 && date.length >0 && description.trim().length >= 1)) {
         check = true;
     }
   
     if(!check){
       alert("Please make sure you filled in all fields before saving")
     }
   
     else{
       //if check = true, clicking save will exit the modal and add log to table
       $.post('/project_log_students', { student, task, date, start_time, end_time, description, status })
       var modal = document.getElementById("myModal");
        modal.style.display = "none";
        addRowToProjectLog(studentName, student, task, date, start_time, end_time, description, status)
     }
   
   }

   function checkStatus() {
    let status = document.getElementsByName("status");
    for(let i = 0; i < status.length; i++) {
      if(status[i].checked) {
        return status[i].value
      }
    }
  }

  function addRowToProjectLog(name, student, task, date, start_time, end_time, description, status) {
    /*
    Function to add log into table
    */
    
    //add a comment button to create a comment box 
    // let comment = document.createElement("BUTTON");
    // let comment_symbol = document.createTextNode("+");
    // comment.appendChild(comment_symbol);
    let comment = "";

    let input = [name, student, task, date, start_time, end_time, description, status, comment];
    // adding a new row in the table body
    let table = document.getElementById("Log_table").getElementsByTagName('tbody')[0];
    let row = table.insertRow(-1);
    for (i = 0; i < input.length; i++) {
        let cell = row.insertCell(i);
        if(input[i] == comment){
          cell.appendChild(input[i]);
        }
        else{
          cell.innerHTML = input[i];
        }
    }

    // Add event handler when we click on '+'
    // If student tries to add comment we tell them they can't

    // comment.addEventListener ("click", function() {
      
    //   alert("Only lecturer can add a comment");

    // });





  }


function openModal(){
  // function to open modal when create log
  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  var btn = document.getElementById("create_log");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("cancel")[0];

  // When the user clicks the button, open the modal
  btn.onclick = function() {
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }

// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// }
}





// Load the logs upon loading the project_log.html page

function loadLogs(){
  /*
    This function will be executed whenever the page loads
    It will show the logs for this particular project
    We'll need to get this data from the appropriate database
  */

  let info = JSON.parse(projectlog)
  
  // This is just an example to see if upon loading we can make these data appear
  // We'll need to get these data from the database
  // We can use the id of the projectID to know from which database we need to load from

  for (let i = 0; i < info.length; i++){
    let details = info[i];
    if (details[8] != null){ 
      loadRowToProjectLog(details[0], details[1],details[2] , details[3], details[4], 
        details[5], details[6], details[7], details[8]);
    }
    else{ 
      addRowToProjectLog(details[0], details[1],details[2] , details[3], details[4], 
        details[5], details[6], details[7]);
    }
  }

}

function loadRowToProjectLog(name, student, task, date, start_time, end_time, description, status, comment) {
  /*
  Function to load the logs into table
  */

  let input = [name, student, task, date, start_time, end_time, description, status, comment];
  // adding a new row in the table body
  let table = document.getElementById("Log_table").getElementsByTagName('tbody')[0];
  let row = table.insertRow(-1);
  for (i = 0; i < input.length; i++) {
      let cell = row.insertCell(i);
      
      cell.innerHTML = input[i];     

  }

}

