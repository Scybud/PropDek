const navBar = document.getElementById("nav-bar");

const anchors = [
  { text: "Dashboard", href: "dashboard.html" },
  { text: "Organisations", href: "orgs.html" },
  { text: "Clients", href: "clients.html" },
];

anchors.forEach((link) => {
  const a = document.createElement("a");
  a.classList.add("anchor-nav-bar");
  a.textContent = link.text;
  a.href = link.href;
  navBar.appendChild(a);
});
