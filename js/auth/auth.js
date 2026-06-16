import { handleBackBtn } from "https://scybud.github.io/scybud-ui/js/ui.js";
import { supabase } from "../supabase";

handleBackBtn()

async function guardAppAuth() {
    const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          window.location.href = "../auth/login.html";
          return;
        }
}