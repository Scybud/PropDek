import { supabase } from "./supabase.js";

export const sessionState = {
  user: null,
  agent: null,
};

let resolveSessionReady;

export const sessionReady = new Promise((resolve) => {
  resolveSessionReady = resolve;
});

export async function initSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Session error:", error);
    resolveSessionReady();
    return;
  }

  const user = session?.user || null;

  if (!user) {
    resolveSessionReady();
    console.log("No user found");

    window.location.href = "../auth"
    return;
  }

  const { data: agent, error: agentError } = await supabase
    .from("agents")
    .select("*")
    .eq("id", user.id)
    .single();

  if (agentError) {
    console.error("Profile error:", agentError);
    resolveSessionReady();
    return;
  }

  sessionState.user = user;
  sessionState.agent = agent;

  resolveSessionReady();

  handleUi();
}

function handleUi() {
  const userNames = document.querySelectorAll(".userName");
  const userEmails = document.querySelectorAll(".userEmail");

  if (!sessionState.user || !sessionState.agent) return console.log("error loading profile");

  const email = sessionState.user.email;
  const [local, domain] = email.split("@");
  const shortEmail = `${local.slice(0, 9)}...@${domain}`;

    userNames.forEach((userName) => {

      if (userName) {
          userName.textContent = sessionState.agent.first_name + " " + sessionState.agent.last_name;
        }
    })

  userEmails.forEach((userEmail) => {

      if (userEmail) {
          userEmail.textContent = shortEmail;
        }
    })
}

initSession();
