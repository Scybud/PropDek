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

// Insert member invite to org
export async function insertOrgInvites(orgInvitePayload) {
  const { data, error } = await supabase
    .from("organization_invitations")
    .insert([orgInvitePayload])
    .select();
  if (error) throw error;
  return data;
}

// Insert member to org
export async function insertOrgMember(orgMemberPayload) {
  const { data, error } = await supabase
    .from("organization_members")
    .insert([orgMemberPayload])
    .select();
  if (error) throw error;
  return data;
}

// FETCH members of a specific org
export async function fetchOrgMembers(orgId) {
  const { data, error } = await supabase
    .from("organization_members")
    .select("*, agents(first_name, last_name)")
    .eq("organization_id", orgId); // ✅ Filter by orgId first!
  if (error) throw error;
  return data;
}

// ✅ NEW: Delete an individual member from an organization
export async function removeMemberFromDb(memberId) {
  const { error } = await supabase
    .from("organization_members")
    .delete()
    .eq("id", memberId); // Adjust "id" if your primary key is named differently
  if (error) throw error;
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
    .single();
  if (error) throw error;
  return data;
}

// ✅ NEW: Update organization name (For settings panel)
export async function updateOrgNameInDb(orgId, newName) {
  const { data, error } = await supabase
    .from("organizations")
    .update({ name: newName }) // Assumes column name is "name"
    .eq("id", orgId)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}
