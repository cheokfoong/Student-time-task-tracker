function addTable(fn, ln, student, task, date, time, status) {
  /*
  Function to add log into table
  */

  let input = [fn, ln, student, task, date, time, status];
  // adding a new row in the table body
  let table = document.getElementById("logTable").getElementsByTagName('tbody')[0];
  let row = table.insertRow();
  for (i = 0; i < input.length; i++) {
    let cell = row.insertCell(i);
    cell.innerHTML = input[i];
  }
}

function removeTable() {
  let table = document.getElementById("logTable").getElementsByTagName('tbody')[0];
  table.deleteRow(-1);
}
