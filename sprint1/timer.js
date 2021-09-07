/*
 This section contains all the code for the timer.
 id of input for time is "time"
 id for where timer will run is "Timer"
*/

// Declare variables to use in the functions
let startTime;
let elapsedTime = 0;
let timerInterval;

// Function to convert time recorded in the appropriate format
function timeToString(time) {
  let diffInHrs = time / 3600000;
  let hh = Math.floor(diffInHrs);

  let diffInMin = (diffInHrs - hh) * 60;
  let mm = Math.floor(diffInMin);

  let diffInSec = (diffInMin - mm) * 60;
  let ss = Math.floor(diffInSec);

  let formattedHH = hh.toString().padStart(2, "0");
  let formattedMM = mm.toString().padStart(2, "0");
  let formattedSS = ss.toString().padStart(2, "0");

  return `${formattedHH}:${formattedMM}:${formattedSS}`;
}

// Function to start timer
function start() {
  startTime = Date.now() - elapsedTime;
  document.getElementById("Timer").innerHTML = timeToString(elapsedTime)

  timerInterval = setInterval(function timing() {
    elapsedTime = Date.now() - startTime;
    document.getElementById("Timer").innerHTML = timeToString(elapsedTime);
  }, 1000);

  timerButton.innerHTML = "Stop Timer"
  timerButton.setAttribute("onclick", "stop()")
}

// Function to stop timer
function stop() {
  clearInterval(timerInterval);

  document.getElementById("time").value = timeToString(elapsedTime); // updates the 'Time spent on task' field
  elapsedTime = 0; // resets timer
  checkTime()

  document.getElementById("Timer").innerHTML = ""
  timerButton.innerHTML = "Start Timer";
  timerButton.setAttribute("onclick", "start()")
}

document.getElementById("TestDB").innerHTML = "yoyo";
