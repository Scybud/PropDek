// js/create/add-property.js
import { insertOrgInvites } from "../data/orgsDb.js";
import { sessionState } from "../session.js";
import { supabase } from "../supabase.js";
import { toastMsg } from "../components/toast.js";

function generateInviteToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}
function generateExpiry(hours = 48) {
  const expires = new Date();
  expires.setHours(expires.getHours() + hours);
  return expires.toISOString();
}


export async function handleMemberInvite(userId, orgId) {
  const form = document.getElementById("inviteForm");
  
  const token = generateInviteToken();
  const expiresAt = generateExpiry();
  
  form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("inviteEmail").value;
      if (!email) return toastMsg("Type a email for the invite", "error");
      
      console.log("here")
    const orgInvitePayload = {
      organization_id: orgId,
      email: email,
      token: token,
      status: "pending",
      invited_by: userId,
      expires_at: expiresAt,
    };

    try {

      await insertOrgInvites(orgInvitePayload);

      window.location.href = "orgs.html";
    } catch (err) {
      console.error(err);
      toastMsg(`Publishing aborted: ${err.message}`, "error");
    }
  });
}
