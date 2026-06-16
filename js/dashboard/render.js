// js/dashboard/render.js

/**
 * Updates top-level workspace KPI analytic card layouts
 * @param {Array} propertiesArray - Array of raw row metrics direct from Supabase
 */
export function renderOverviewStats(propertiesArray) {
  const allPropertiesCount = document.getElementById("allPropertiesCount");
  const rentedPropertyCount = document.getElementById("rentedPropertyCount");
  const availablePropertyCount = document.getElementById(
    "availablePropertyCount",
  );

  if (!allPropertiesCount) return;

  const total = propertiesArray.length;
  // Lowercase match matching our database status field transformations
  const rented = propertiesArray.filter(
    (p) => p.status?.toLowerCase() === "rented",
  ).length;
  const available = total - rented;

  allPropertiesCount.innerText = total;
  rentedPropertyCount.innerText = rented;
  availablePropertyCount.innerText = available;
}

/**
 * Builds and injects real estate cards cleanly inside your layout grid target container
 * @param {Array} propertiesArray - Collection array matching properties row schemas
 * @param {Function} onDeleteClick - Action callback forwarding the unique instance target UUID
 */
export function renderPropertyCards(propertiesArray, onDeleteClick) {
  const detailsCard = document.getElementById("detailsCard");
  if (!detailsCard) return;

  if (propertiesArray.length === 0) {
    detailsCard.innerHTML = `<p class="placeholderText">Nothing to show</p>`;
    return;
  }

  detailsCard.innerHTML = "";

  propertiesArray.forEach((property) => {
    const cardDiv = document.createElement("div");

    // Match status text strings with your background class badges (.for-sale, .rented, .leased)
    let statusBadgeClass = "for-sale";
    if (property.status?.toLowerCase() === "rented")
      statusBadgeClass = "rented";
    if (property.status?.toLowerCase() === "leased")
      statusBadgeClass = "leased";

    // Count items packed dynamically inside your internal JSONB column schema array
    const totalUnitsCount = Array.isArray(property.internal_units_json)
      ? property.internal_units_json.length
      : 0;

    // Structure HTML strictly adhering to your semantic layout declarations
    cardDiv.innerHTML = `
            <h3>${property.owner_name || "Client Asset"}</h3>
            <p><b>Title:</b> ${property.title || "Untitled Asset"}</p>
            <p><b>Property Type:</b> ${property.property_type || "Unspecified"}</p>
            <p>
                <b>Property Status:</b> 
                <span class="status-badge ${statusBadgeClass}">${property.status || "available"}</span>
            </p>
            <p>
                <b>Managed Capacity:</b> 
                <span class="unit-counter-badge">${totalUnitsCount} Units</span>
            </p>
            <p><b>Rent Valuation:</b> ₦${Number(property.list_price || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}</p>
            <div style="margin-top: 15px; display: flex; gap: 8px;">
                <button type="button" class="action-view-btn view-btn" data-id="${property.id}">👀 View</button>
                <button type="button" class="danger delete-btn" style="background: #ff4444; color: white;" data-id="${property.id}">🗑 Remove</button>
            </div>
        `;

    // Operational event link listeners
    cardDiv.querySelector(".view-btn").addEventListener("click", () => {
      localStorage.setItem("viewPropertyId", property.id);
      window.location.href = "property.html";
    });

    cardDiv.querySelector(".delete-btn").addEventListener("click", () => {
      onDeleteClick(property.id);
    });

    // Use prepend so newly listed client assets appear instantly at the very top of the agent grid workspace
    detailsCard.prepend(cardDiv);
  });
}
