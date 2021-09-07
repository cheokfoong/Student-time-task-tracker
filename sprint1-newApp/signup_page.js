// Runs the init method before the page starts
document.addEventListener("DOMContentLoaded", function() {
  init();})

const init = function(e) {
    // Checks what role does the user have and determines which sign up role
    let role = localStorage.getItem("role");
    if (role == "Student") {
      studentSignUp();
    }
    else if (role == "Lecturer") {
      lectSignUp();
    }
}

function lectSignUp()
{
  let x = document.getElementById("student-signup");
  let y = document.getElementById("lecturer-signup");
  let z = document.getElementById("btn");
  x.style.left = "-400px";
  y.style.left = "50px";
  z.style.left = "100px";
}


const mysql = require("mysql");
function studentSignUp()
{
  let x = document.getElementById("student-signup");
  let y = document.getElementById("lecturer-signup");
  let z = document.getElementById("btn");
  x.style.left = "50px";
  y.style.left = "400px";
  z.style.left = "0px";

  const db = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Palkiadialga1.",
    });

  // db.connect((err) => {
  // if (err) {
  //     // throw err;
  //     document.getElementById("testDB").innerHTML = "Connected";
  // }

  // document.getElementById("testDB").innerHTML = "Connected";
  // });
  document.getElementById("testDB").innerHTML = "Connected"
}
