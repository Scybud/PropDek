import { toastMsg } from "../components/toast.js";
import { insertClient } from "../data/clientsDb.js";

/**
 * Attaches submission listeners to the Add Client form elements
 */
export async function handleClientSubmit(agentId, orgId, onSuccessCallback) {
  const form = document.getElementById("addClientForm");
  const modalContainer = document.getElementById("modalContainer");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const name = document.getElementById("client-name").value.trim();
    const email = document.getElementById("client-email").value.trim();
    const phone = document.getElementById("client-phone").value.trim();

    if (!name || !email || !phone) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Adding...";
      }

      const clientPayload = {
        name,
        email,
        phone,
        organization_id: orgId, 
        agent_id: agentId, 
        is_personal: false, 
      };
      
      await insertClient(clientPayload);

      toastMsg("Client added successfully!", "success");

      // Close modal dynamically
      if (modalContainer) modalContainer.innerHTML = "";

      // Refresh the client list automatically
      if (onSuccessCallback) onSuccessCallback();
    } catch (error) {
      console.error("Error inserting client:", error);
      toastMsg("Failed to save client record.", "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Add Client";
      }
    }
  });
}
