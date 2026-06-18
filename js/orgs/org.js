import { renderSectionHeader } from "../components/section-header.js";
import { handleMemberInvite } from "../create/add-member.js";
import { handleFormSteps } from "../create/add-property.js";
import { renderPropertyCards } from "../dashboard/render.js";
import { fetchOrgMembers } from "../data/orgsDb.js";
import { fetchProperties, removePropertyFromDb } from "../data/propertiesDb.js";
import { sessionReady, sessionState } from "../session.js";
import { renderMembersCards } from "./render.js";
      import {
        loadComponent,
      } from "https://scybud.github.io/scybud-ui/js/ui.js";


document.addEventListener("DOMContentLoaded", async () => {
  await sessionReady;
  const orgNavBar = document.getElementById("org-nav-bar");

  const params = new URLSearchParams(window.location.search);
  const orgId = params.get("org");

  const userId = await sessionState.user.id;

  if (!orgId || orgId === "undefined") {
    console.error("Invalid orgId:", orgId);
    window.location.href = "dashboard.html";
    return;
  }

  await loadAssets(userId, orgId);

  //Org Page Navs
  const loadOrgNavs = () => {
    if (!orgNavBar) return;

    const btns = [
      { text: "Assets", onClick: async () => await loadAssets(userId, orgId) },
      { text: "Members", onClick: () => loadMembers(userId, orgId) },
      { text: "Clients", onClick: () => console.log("Clients clicked") },
      { text: "Settings", onClick: () => console.log("Settings clicked") },
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
});

export async function loadAssets(userId, orgId) {
  const container = document.getElementById("container");
  container.innerHTML = "";

  // Render header FIRST
  renderSectionHeader(
    "Assets",
    `<button type="button" class="btn-primary btn-sm btn add-property">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V19M5 12H19"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"/>
      </svg>
      Add property
    </button>`,
  );

  document.querySelector(".add-property").addEventListener("click", async () => {

      await loadComponent(
          "../components/modals/add-property.html",
          "modalContainer",
        );
        await handleFormSteps(orgId);
    })

  const assetsData = await fetchProperties(userId, orgId);

  await renderPropertyCards(
    assetsData,
    async (id) => {
      if (confirm("Are you sure you want to delete this asset row?")) {
        await removePropertyFromDb(id);
        loadAssets(userId, orgId);
      }
    },
    orgId,
  );
}

export async function loadMembers(userId, orgId) {
  const container = document.getElementById("container");
  container.innerHTML = "";

  renderSectionHeader(
    "Members",
    `<button type="button" class="btn-primary btn-sm btn invite-member">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V19M5 12H19"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"/>
      </svg>
      Invite member
    </button>`,
  );

  document.querySelector(".invite-member").addEventListener("click", async () => {
     await loadComponent(
              "../components/modals/invite-member.html",
              "modalContainer",
            );
            await handleMemberInvite(userId, orgId);
  })

  const membersData = await fetchOrgMembers(orgId);

  await renderMembersCards(
    membersData,
    async (id) => {
      if (confirm("Are you sure you want to delete this member?")) {
        await removeMemberFromDb(id);
        loadMembers(orgId);
      }
    },
    userId,
    orgId
  );
}
