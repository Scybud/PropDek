// js/dashboard/dashboard.js
import { supabase } from "../supabase.js";
import { fetchOrgs, removeOrgFromDb } from "../data/orgsDb.js";
import { renderOrgsCards } from "./render.js";

export async function initOrgs() {

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "../auth/login.html";
      return;
    }

    const orgs = await fetchOrgs(user.id);

    renderOrgsCards(orgs, async (id) => {
      if (confirm("Are you sure you want to delete this asset row?")) {
        await removeOrgFromDb(id);
        // Reload dashboard rows locally down pipeline
        initOrgs();
      }
    });
  } catch (error) {
    console.error("Orgs error:", error.message);
  } 
}
