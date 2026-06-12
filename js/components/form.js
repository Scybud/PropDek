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
  let getproperty = JSON.parse(localStorage.getItem("properties")) || [];

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

  // Handle all Next buttons dynamically across multiple steps
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

  // Handle all Previous buttons
  prevButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (currentStep > 1) {
        currentStep--;
        updateFormState();
      }
    });
  });

  // --- Dynamic Room/Apartment Addition Engine ---
  addUnitBtn.addEventListener("click", () => {
    unitCount++;

    const unitCard = document.createElement("div");
    unitCard.classList.add("unit-card");
    unitCard.setAttribute("data-unit-index", unitCount - 1);

    unitCard.innerHTML = `
      <div class="unit-card-header">
        <h4>Unit #${unitCount}</h4>
        <button type="button" class="btn-remove-unit">Remove</button>
      </div>
      <div class="form-group-row">
        <input type="text" name="unit_name[]" placeholder="Unit/Room # (e.g., Apt 1A)" required />
        <select name="unit_type[]" required>
          <option value="" disabled selected>Select Type</option>
          <option value="Apartment">Full Apartment</option>
          <option value="Room">Single Room</option>
          <option value="Studio">Studio Suite</option>
        </select>
      </div>
    `;

    unitsContainer.appendChild(unitCard);

    unitCard.querySelector(".btn-remove-unit").addEventListener("click", () => {
      unitCard.remove();
      reindexUnits();
    });
  });

  function reindexUnits() {
    const remainingCards = unitsContainer.querySelectorAll(".unit-card");
    unitCount = remainingCards.length;
    remainingCards.forEach((card, idx) => {
      card.querySelector("h4").innerText = `Unit #${idx + 1}`;
    });
  }

  // --- Safe Form Submit Handler ---
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const type = document.getElementById("type").value;
    const owner = document.getElementById("owner").value.trim();
    const status = document.getElementById("status").value;
    const rent = "₦" + document.getElementById("rent").value.trim();
    const expiry = document.getElementById("expiry").value;
    const tenants = document.getElementById("tenants").value.trim();
    const description = document.getElementById("description").value.trim();
    const address = document.getElementById("address").value.trim();
    const propertyId = crypto.randomUUID();

    // Map through dynamic sub-units arrays if they exist
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
      expiry,
      tenants,
      description,
      address,
      units,
    };

    getproperty.push(newProperty);
    localStorage.setItem("properties", JSON.stringify(getproperty));

    window.location.href = "dashboard.html";
  });
};
