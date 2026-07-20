import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Browser client (for client-side use)
export const createBrowserClient = (): SupabaseClient | null => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase env vars for browser client");
    return null;
  }
  return createClient(supabaseUrl, supabaseKey);
};

// Server client (for server-side use)
export const createServerClient = (): SupabaseClient | null => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase env vars for server client");
    return null;
  }
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
