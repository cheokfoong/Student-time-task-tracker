/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function buttonClickStudent() {
  document.getElementById("myDropdown").classList.toggle("show")
  document.getElementById("myDropdown2").classList.remove("show");;
}

function buttonClickLect() {
  document.getElementById("myDropdown2").classList.toggle("show");
  document.getElementById("myDropdown").classList.remove("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    let dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}


