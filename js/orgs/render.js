/**
 * Builds and injects real estate cards cleanly inside your layout grid target container
 * @param {Array} orgsArray - Collection array matching properties row schemas
 * @param {Function} onDeleteClick - Action callback forwarding the unique instance target UUID
 */
      import { loadComponent, createEmptyState } from "https://scybud.github.io/scybud-ui/js/ui.js";
import { handleOrgCreation } from "../create/create-org.js"; 

export async function renderOrgsCards(orgsArray, onDeleteClick) {
  const detailsCard = document.getElementById("detailsCard");
  if (!detailsCard) return;

  if (orgsArray.length === 0) {
    await createEmptyState({
      container: detailsCard,
      icon: "🏢",
      title: "Nothing here yet",
      description: "You have not created an org yet.",
      actionText: "Add org",
      onAction: async () => {
        await loadComponent(
          "../components/modals/create-org.html",
          "modalContainer",
        );
        await handleOrgCreation();
      },
    });
    return;
  }

  detailsCard.innerHTML = "";

  // FIXED: Create ONE single grid container OUTSIDE the loop
  const twoColumnGrid = document.createElement("div");
  twoColumnGrid.classList.add("two-column-grid");

  orgsArray.forEach((org) => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");

        let statusBadgeClass = "not-verified";
        if (org.is_verified === false)
          statusBadgeClass = "not-verified";
        if (org.is_verified === true)
          statusBadgeClass = "verified";

    cardDiv.innerHTML = `
      <h3>${org.name || "Your Asset"}</h3>
      <p>
          <b>org Status:</b> 
          <span class="status-badge ${statusBadgeClass}">${org.is_verified ? "Verified" : "Not verified"}</span>
      </p>
      <div style="margin-top: 15px; display: flex; gap: 8px;">
          <button type="button" class="action-view-btn view-btn">Open</button>
          <button type="button" class="danger delete-btn" style="background: #ff4444; color: white;">🗑 Delete</button>
      </div>
    `;

    cardDiv.querySelector(".view-btn").addEventListener("click", () => {
      localStorage.setItem("viewOrgId", org.id);
      window.location.href = "org.html";
    });

    cardDiv.querySelector(".delete-btn").addEventListener("click", () => {
      onDeleteClick(org.id);
    });

    // Append each individual card into the single parent grid container
    twoColumnGrid.appendChild(cardDiv);
  });

  // FIXED: Prepend the fully populated grid layout container into the main DOM target
  detailsCard.prepend(twoColumnGrid);
}
