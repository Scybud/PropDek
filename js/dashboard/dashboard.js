// js/dashboard/dashboard.js
import { supabase } from "../supabase.js";
import { fetchProperties, removePropertyFromDb } from "../data/propertiesDb.js";
import { renderOverviewStats, renderPropertyCards } from "./render.js";

export async function initDashboard() {

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "../auth/login.html";
      return;
    }

    const orgId = user.user_metadata?.organization_id || null;
    const properties = await fetchProperties(user.id, orgId);

    renderOverviewStats(properties);
    renderPropertyCards(properties, async (id) => {
      if (confirm("Are you sure you want to delete this asset row?")) {
        await removePropertyFromDb(id);
        // Reload dashboard rows locally down pipeline
        initDashboard();
      }
    });
  } catch (error) {
    console.error("Dashboard error:", error.message);
  } 
}
