import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://upbofnjkbglrcrdkbsxo.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwYm9mbmprYmdscmNyZGtic3hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0ODIwMzIsImV4cCI6MjEwMTA1ODAzMn0.k2D2U58M73W5zhgWm36vvezl_uvrZCnqaLFcX9-KI5U";

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
