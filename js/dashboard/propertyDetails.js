// js/dashboard/propertyDetails.js
import { fetchPropertyById } from "../data/propertiesDb.js";

document.addEventListener("DOMContentLoaded", async () => {
  const detailsDiv = document.getElementById("details");
  const propertyId = localStorage.getItem("viewPropertyId");

  if (!propertyId) {
    detailsDiv.innerHTML = `<p style="text-align:center; color:#ef4444;">No target property selected. Please return to the dashboard.</p>`;
    return;
  }

  try {
    const property = await fetchPropertyById(propertyId);

    // Map data safely and look for real table values
    const formattedPrice = Number(property.list_price || 0).toLocaleString(
      "en-NG",
      { minimumFractionDigits: 2 },
    );
    const expiryDate = property.rent_expiry_date
      ? escapeHTML(property.rent_expiry_date)
      : "N/A";
    const unitsArray = property.internal_units_json || [];

    let detailsHTML = `
            <h3>${escapeHTML(property.title || "Managed Asset")}</h3>
            <p><strong>Property Type:</strong> ${escapeHTML(property.property_type || "Unspecified")}</p>
            <p><strong>Address:</strong> ${escapeHTML(property.address || "No address provided")}</p>
            <p><strong>City/State:</strong> ${escapeHTML(property.city)}, ${escapeHTML(property.state)}</p>
            <p><strong>Owner/Client:</strong> ${escapeHTML(property.owner_name || "Unknown Client")}</p>
            <p><strong>Listing Status:</strong> ${escapeHTML(property.status || "available")}</p>
            <p><strong>Valuation/Rent:</strong> ₦${formattedPrice} (${escapeHTML(property.period)})</p>
            <p><strong>Lease Expiry:</strong> ${expiryDate}</p>
            <p><strong>Asset ID:</strong> <code style="color: #cbd5e1; font-family: monospace; font-size: 0.8rem;">${escapeHTML(property.id)}</code></p>
            <p><strong>Internal Description / Notes:</strong><br>${escapeHTML(property.description || "No descriptions saved for this asset.")}</p>
        `;

    // Loop and print units cleanly from our single JSONB field mapping
    if (unitsArray.length > 0) {
      detailsHTML += `
                <div class="units-section">
                    <h4>Assigned Units / Rooms (${unitsArray.length})</h4>
                    <div class="units-grid">
            `;

      unitsArray.forEach((unit) => {
        detailsHTML += `
                    <div class="unit-pill">
                        <strong>${escapeHTML(unit.name)}</strong>
                        <span>${escapeHTML(unit.type)}</span>
                    </div>
                `;
      });

      detailsHTML += `
                    </div>
                </div>
            `;
    } else {
      detailsHTML += `
                <div class="units-section">
                    <h4>Assigned Units / Rooms (0)</h4>
                    <p style="font-size: 0.85rem; color: #a0aec0; font-style: italic;">No independent sub-units assigned to this workspace listing.</p>
                </div>
            `;
    }

    // --- HIGH-FIDELITY GOOGLE MAPS INJECTION ---
    if (property.latitude && property.longitude) {
      const lat = parseFloat(property.latitude);
      const lon = parseFloat(property.longitude);

      detailsHTML += `
                <div class="map-section">
                    <div class="map-header-row">
                        <h4>Location Tracking</h4>
                                                                <p style="font-size: 0.85rem; color: #a0aec0; font-style: italic;">Approximate location based on address given.</p>

                        <a href="https://www.google.com/maps/search/?api=1&query=${lat},${lon}" 
                           target="_blank" 
                           class="btn-nav">
                           🚗 Open in Google Maps
                        </a>
                    </div>
                    <div class="map-frame-wrapper">
                        <iframe 
                            src="https://maps.google.com/maps?q=${lat},${lon}&z=16&output=embed"
                            allowfullscreen="" 
                            loading="lazy">
                        </iframe>
                    </div>
                </div>
            `;
    } else {
      detailsHTML += `
                <div class="map-section">
                    <h4>Location Tracking</h4>
                    <p style="font-size: 0.85rem; color: #a0aec0; font-style: italic;">No verified GPS coordinates linked to this asset profile.</p>
                </div>
            `;
    }

    detailsDiv.innerHTML = detailsHTML;
  } catch (err) {
    console.error("Failed to load building overview profile:", err.message);
    detailsDiv.innerHTML = `<p style="text-align:center; color:#ef4444;">Error fetching data: ${escapeHTML(err.message)}</p>`;
  }
});

// XSS Prevention sanitizer
function escapeHTML(str) {
  if (!str) return "";
  return str.toString().replace(
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
