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

//Isert member invite to org
export async function insertOrgInvites(orgInvitePayload) {
  const { data, error } = await supabase
    .from("organization_invitations")
    .insert([orgInvitePayload])
    .select();
  if (error) throw error;
  return data;
}

//Isert member to org
export async function insertOrgMember(orgMemberPayload) {
  const { data, error } = await supabase
    .from("organization_members")
    .insert([orgMemberPayload])
    .select();
  if (error) throw error;
  return data;
}

//Isert member to org
export async function fetchOrgMembers(orgId) {
  const { data, error } = await supabase
    .from("organization_members")
    .select("*, agents(first_name, last_name)")
    .order("organization_id", orgId);
  if (error) throw error;
  return data;
}

// Fetch all orgs belonging to the standalone agent
export async function fetchOrgs(agentId) {

  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

// Delete org row
export async function removeOrgFromDb(orgId) {
  const { error } = await supabase
    .from("organizations")
    .delete()
    .eq("id", orgId);
  if (error) throw error;
}


// Fetch a single unique org row
export async function fetchOrgById(orgId) {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", orgId)
      .single(); // Gets a single object row back instead of an array
    if (error) throw error;
    return data;
}