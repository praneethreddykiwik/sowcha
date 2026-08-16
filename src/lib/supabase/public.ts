import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

/**
 * Cookie-less client used for public content reads.
 *
 * Deliberately separate from the auth-aware server client: because it never
 * touches cookies, pages that use it can still be statically rendered and
 * revalidated on a tag instead of becoming dynamic on every request.
 */
export const supabasePublic = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;
