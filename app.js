// Retrieve centralized storage or initialize cleanly
let getproperty = JSON.parse(localStorage.getItem("properties")) || [];

// --- RENDERING ENGINE ---
function renderTable() {
  const tbody = document.getElementById("property-table-body");
  if (!tbody) return; // Guard clause to prevent errors if elements don't exist on current page

  tbody.innerHTML = "";

  getproperty.forEach((property, index) => {
    // Safely calculate the total units added in Step 2 of the form layout
    const totalUnits = property.units ? property.units.length : 0;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <strong>${escapeHTML(property.type)}</strong>
        <br />
        <small style="color: #8aa3b8; font-size: 11px;">${escapeHTML(property.address || "No Address Listed")}</small>
      </td>
      <td>${escapeHTML(property.owner)}</td>
      <td><span class="status-badge ${property.status.toLowerCase().replace(/\s+/g, "-")}">${escapeHTML(property.status)}</span></td>
      <td>${escapeHTML(property.rent)}</td>
      <td>
        <span class="unit-counter-badge">${totalUnits} ${totalUnits === 1 ? "Unit" : "Units"}</span>
      </td>
      <td>
        <button class="action-view-btn" onclick="viewProperty(${index})">View Details</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// --- NAVIGATION ENGINE ---
function viewProperty(index) {
  const selectedProperty = getproperty[index];
  localStorage.setItem("viewProperty", JSON.stringify(selectedProperty));
  window.location.href = "view-property.html";
}

// --- Safe XSS String Escaper (Prevents database text injections breaking layouts) ---
function escapeHTML(str) {
  if (!str) return "";
  return str
    .toString()
    .replace(
      /[&<>'"]/g,
      (tag) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;",
        })[tag] || tag,
    );
}

// --- UNIFIED INTEGRATED SUBMISSION CONTROLLER ---
const propertyForm = document.getElementById("propertyForm");
if (propertyForm) {
  propertyForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const type = document.getElementById("type").value;
    const owner = document.getElementById("owner").value.trim();
    const status = document.getElementById("status").value;
    const rent = "₦" + document.getElementById("rent").value.trim();
    const expiry = document.getElementById("expiry").value;
    const tenants = document.getElementById("tenants").value.trim();
    const description = document.getElementById("description").value.trim();
    const address = document.getElementById("address").value.trim();
    const propertyId = crypto.randomUUID();

    // Map through dynamic sub-units from Step 2
    const unitsContainer = document.getElementById("unitsContainer");
    const units = Array.from(unitsContainer.querySelectorAll(".unit-card")).map(
      (card) => ({
        name: card.querySelector('input[name="unit_name[]"]').value.trim(),
        type: card.querySelector('select[name="unit_type[]"]').value,
      }),
    );

    const newProperty = {
      propertyId,
      type,
      owner,
      status,
      rent,
      leaseExpiry: expiry,
      tenants,
      description,
      address,
      units,
    };

    getproperty.push(newProperty);
    localStorage.setItem("properties", JSON.stringify(getproperty));

    // Redirect back to the dashboard layout view
    window.location.href = "dashboard.html";
  });
}

// Execute render strictly when the fully qualified DOM is painted
document.addEventListener("DOMContentLoaded", renderTable);
