import { handleBackBtn } from "https://scybud.github.io/scybud-ui/js/ui.js";

const navBar = document.getElementById("nav-bar");
const orgNavBar = document.getElementById("org-nav-bar");

const loadPageNavs = () => {
  if (!navBar) return;

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
};
loadPageNavs();

//Org Page Navs
const loadOrgNavs = () => {
  if (!orgNavBar) return;

  const btns = [
    { text: "Assets", onClick: "" },
    { text: "Members", onClick: "" },
    { text: "Clients", onClick: "" },
    { text: "Settings", onClick: "" },
  ];

  btns.forEach((btn) => {
    const navBtn = document.createElement("button");
    navBtn.classList.add("btn-nav-bar");
    navBtn.textContent = btn.text;
    navBtn.onclick = btn.onClick;

    orgNavBar.appendChild(navBtn);
  });
};
loadOrgNavs();


handleBackBtn()