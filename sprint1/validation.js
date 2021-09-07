function checkTime(){
/*
  Function checks if the time entered by the user is in the correct format
  correct format is xx-xx-xx
*/

  let time = document.getElementById("time").value;
  //let rel = /^\d{2}-\d{2}-\d{2}$/;
  let rel = /^[0-9][0-9]*:[0-5]?[0-9]:[0-5]?[0-9]$/
  if (rel.test(time)){
   document.getElementById("TimePrompt").innerHTML = "<strong> valid </strong>";
   document.getElementById("TimePrompt").style.color = "green";
   return (true);
  }

  else{
    document.getElementById("TimePrompt").innerHTML = "<strong> Time must be in the xx:xx:xx format or check if minutes and seconds are less than 60 </strong>";
    document.getElementById("TimePrompt").style.color = "red";

    return (false);
  }
}


function checkSave(){
 /*
   Function to handle the action of user clicking save button
   Function will check if user filled in all input fields if not then will show an alert
 */
  let fn = document.getElementById("fname").value;
  let ln = document.getElementById("lname").value;
  let student = document.getElementById("siD").value;
  let task = document.getElementById("task").value;
  let time = document.getElementById("time").value;
  let date = document.getElementById("date").value;
  let status = checkStatus();

  let check = false;
  if(fn.trim().length >=1 && ln.trim().length>=1 && student.trim().length>=1 && task.trim().length >=1 && date.length >0 && time.length > 0) {
      check = true;
  }

  if(!check){
    alert("Please make sure you filled in all fields before saving")
  }

  else{
    addTable(fn, ln, student, task, date, time, status)
    enableViewButton();
  }

}

function viewFile()
{
  if (confirm("Continue to view the recent saved file?"))
  {
    openFile();
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


function enableViewButton()
{
  //let clickBtn = document.getElementByClassName("mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent")[0];
  let button = document.getElementById("viewButton");
  button.disabled = false;

  //add event listener when button is click
  button.addEventListener("click",function(event)
  {
     button.disabled = true;
  });
}
