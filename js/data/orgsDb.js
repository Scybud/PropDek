// js/data/propertiesDb.js
import { supabase } from "../supabase.js";

// Insert a brand new property asset
export async function insertOrg(orgPayload) {
  const { data, error } = await supabase
    .from("organizations")
    .insert([orgPayload])
    .select();
  if (error) throw error;
  return data;
}

// Fetch all properties belonging to the active organization or standalone agent
export async function fetchOrgs(agentId) {

  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

// Delete property asset row
export async function removeOrgFromDb(orgId) {
  const { error } = await supabase
    .from("organizations")
    .delete()
    .eq("id", orgId);
  if (error) throw error;
}


// Fetch a single unique property profile row
export async function fetchOrgById(orgId) {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", orgId)
      .single(); // Gets a single object row back instead of an array
    if (error) throw error;
    return data;
}