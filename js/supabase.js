import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://laufplkcopsosmqlteyt.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ZObeZm6kf743EsKbw3YgXQ_HZzcthgg";

//EXPORT CLIENT INFO
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // flowType: "pkce",
    persistSession: true,
    autoRefreshToken: true,
    // detectSessionInUrl: true,
  },
});
