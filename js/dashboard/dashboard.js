// js/dashboard/dashboard.js
import { supabase } from "../supabase.js";
import { fetchProperties, removePropertyFromDb } from "../data/propertiesDb.js";
import { renderOverviewStats, renderPropertyCards } from "./render.js";

export async function initDashboard(orgId) {

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "../auth/login.html";
      return;
    }

    const userOrgId = orgId || null;
    const properties = await fetchProperties(user.id, userOrgId);

    renderOverviewStats(properties);
    renderPropertyCards(properties, async (id) => {
      if (confirm("Are you sure you want to delete this asset row?")) {
        await removePropertyFromDb(id);
        // Reload dashboard rows locally down pipeline
        initDashboard(orgId);
      }
    }, orgId);
  } catch (error) {
    console.error("Dashboard error:", error.message);
  } 
}
