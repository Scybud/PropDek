//For side bar display
const sidebar = document.getElementById("sidebar");
function toggleSidebar() {
  sidebar.classList.toggle("show");
}
//to move between pages if using select element
function goToLink(selectElement) {
  const selectedValue = selectElement.value;
  if (selectedValue) {
    window.location.href = selectedValue;
  }
}
// Link glows slightly when active
const links = document.querySelectorAll(".anchor-nav-bar");
links.forEach((link) => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});


const dotContainer = document.querySelector(".dot-container");

const span = document.createElement("span");

for(let i = 0; i < 3; i++) {
  const copy = span.cloneNode("true");
  
  dotContainer.appendChild(copy);
}

   window.addEventListener("load", () => {
     dotContainer.style.display = "none";
   });