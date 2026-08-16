import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/**
 * Auth-aware client for the admin area (server components + server actions).
 * Reads and refreshes the session from cookies, so anything using it is
 * dynamically rendered — which is what we want behind the login.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a server component: middleware refreshes the session
          // instead, so this is safe to swallow.
        }
      },
    },
  });
}

/** The signed-in user, or null. */
export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * True when the signed-in account is on the admin allowlist. Checked against
 * the database rather than trusted from the client — the same `is_admin()`
 * function guards every RLS policy.
 */
export async function isCurrentUserAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase.rpc("is_admin");
  if (error) return false;
  return data === true;
}
