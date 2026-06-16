// js/create/add-property.js
import { insertOrg } from "../data/orgsDb.js";
import { sessionState } from "../session.js";
import { supabase } from "../supabase.js";
import { toastMsg } from "../components/toast.js";

export async function handleOrgCreation() {
  const form = document.getElementById("orgForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const orgPayload = {
        name: document.getElementById("orgName").value.trim(),
    };

    try {
     const user = await sessionState.user;

      if (!user) throw new Error("No active session tracked.");

      orgPayload.owner_id = user.id;

      await insertOrg(orgPayload);
      window.location.href = "orgs.html";
    } catch (err) {
      console.error(err);
      toastMsg(`Publishing aborted: ${err.message}`, "error");
    }
  });
}
