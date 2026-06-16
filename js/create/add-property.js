// js/create/add-property.js
import { insertProperty } from "../data/propertiesDb.js";
import { supabase } from "../supabase.js";


export async function handleFormSteps() {
  const form = document.getElementById("propertyForm");
  const steps = document.querySelectorAll(".form-step");
  const dots = document.querySelectorAll(".step-dot");
  const nextButtons = document.querySelectorAll(".btn-next");
  const prevButtons = document.querySelectorAll(".btn-prev");
  const unitsContainer = document.getElementById("unitsContainer");
  const addUnitBtn = document.getElementById("addUnitBtn");

  let currentStep = 1;
  let unitCount = 1;

  function updateFormState() {
    steps.forEach((step) => {
      step.classList.toggle(
        "active",
        parseInt(step.dataset.step) === currentStep,
      );
    });
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index < currentStep);
    });
  }

  nextButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const currentFields =
        steps[currentStep - 1].querySelectorAll("[required]");
      let allValid = true;
      currentFields.forEach((field) => {
        if (!field.checkValidity()) {
          field.reportValidity();
          allValid = false;
        }
      });
      if (allValid && currentStep < steps.length) {
        currentStep++;
        updateFormState();
      }
    });
  });

  prevButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (currentStep > 1) {
        currentStep--;
        updateFormState();
      }
    });
  });

  if (addUnitBtn) {
    addUnitBtn.addEventListener("click", () => {
      unitCount++;
      const unitCard = document.createElement("div");
      unitCard.classList.add("unit-card");
      unitCard.setAttribute("data-unit-index", unitCount - 1);
      unitCard.innerHTML = `
      <div class="unit-card-header">
            <h4>Unit ##${unitCount}</h4>
            <button type="button" class="btn-remove-unit" style="display: none;">Remove</button>
          </div>
          <div class="form-group-row">
            <input type="text" name="unit_name[]" placeholder="Unit # (e.g., Apt 1A)" required />
            <select name="unit_type[]" required>
              <option value="" disabled selected>Select Type</option>
              <option value="Apartment">Full Apartment</option>
              <option value="Room">Single Room</option>
              <option value="Studio">Studio Suite</option>
            </select>
          </div>
          <div class="form-group-row">
            <input type="number" name="unit_beds[]" placeholder="Beds" min="0" value="0"/>
            <input type="number" name="unit_baths[]" placeholder="Baths" min="0" value="0"/>
          </div>
        
      `;
      unitsContainer.appendChild(unitCard);
      unitCard
        .querySelector(".btn-remove-unit")
        .addEventListener("click", () => {
          unitCard.remove();
          reindexUnits();
        });
    });
  }

  function reindexUnits() {
    const remainingCards = unitsContainer.querySelectorAll(".unit-card");
    unitCount = remainingCards.length;
    remainingCards.forEach((card, idx) => {
      card.querySelector("h4").innerText = `Unit #${idx + 1}`;
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Fallback static strings map to missing layout components cleanly
    const propertyPayload = {
      title: document.getElementById("title")?.value || "Managed Asset Listing",
      property_type:
        document.getElementById("property_type")?.value || "Apartment",
      status: document.getElementById("status")?.value || "available",
      list_price:
        parseFloat(document.getElementById("list_price")?.value) || 0.0,
      currency: "NGN",
      period: document.getElementById("period")?.value || "rent",
      rent_expiry_date:
        document.getElementById("rent_expiry_date")?.value || null,
      owner_name:
        document.getElementById("owner_name")?.value || "Unknown Client",
      description: document.getElementById("description")?.value || "",
      address: document.getElementById("address").value.trim(),
      city: document.getElementById("city")?.value || "Lagos",
      state: document.getElementById("state")?.value || "Lagos",
      country: "Nigeria",

      // Serialize nested sub-units into your fallback JSONB column layout
      internal_units_json: Array.from(
        unitsContainer.querySelectorAll(".unit-card"),
      ).map((card) => ({
        name: card.querySelector('input[name="unit_name[]"]').value.trim(),
        type: card.querySelector('select[name="unit_type[]"]').value,
      })),
    };

    try {
      // Append runtime Auth identity meta allocations before sending down to SQL
      const {
        data: { user },
      } = await supabase.auth.getUser(); // or import from supabase.js
      if (!user) throw new Error("No active agent session detected.");

      propertyPayload.agent_id = user.id;
      propertyPayload.organization_id =
        user.user_metadata?.organization_id || null;

      await insertProperty(propertyPayload);
      window.location.href = "dashboard.html";
    } catch (err) {
        console.error(err)
      alert(`Submission failed: ${err.message}`);
    }
  });
}
