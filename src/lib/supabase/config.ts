/**
 * Supabase connection details. Both values are NEXT_PUBLIC_* so they are
 * inlined at build time and resolve identically on localhost and Vercel.
 *
 * The anon/publishable key is safe to ship to the browser — every table is
 * protected by row level security, and writes require an account whose email
 * is in `admin_emails`.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

/**
 * When false the site runs entirely on the bundled static config, so a clone
 * with no environment variables still builds and renders.
 */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const MEDIA_BUCKET = "media";
