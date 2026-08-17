/**
 * Supabase connection details.
 *
 * Environment variables win when present. When they are absent the project
 * defaults below are used, so a deployment that has not had its variables set
 * still runs the real shop instead of silently degrading to an unbuyable
 * catalogue with no prices — which is exactly what happened on the first
 * production deploy.
 *
 * Committing these two values is safe by design:
 *   - `NEXT_PUBLIC_*` values are inlined into the client bundle at build time,
 *     so the publishable key is already visible to anyone who opens devtools on
 *     the live site. Keeping it in the repo exposes nothing new.
 *   - It is a *publishable* key, not the service-role key. Every table is
 *     guarded by row level security: anonymous visitors can read published rows
 *     and nothing else, and any write requires an account whose email is in
 *     `admin_emails`.
 *
 * The service-role key must never appear here or anywhere else in this repo.
 */

const DEFAULT_SUPABASE_URL = "https://pmmknagxjcjgzfujoive.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_Yw2J9LvkoeTQpG5dXBP-Cg_8TlhDZKu";

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || DEFAULT_SUPABASE_URL;

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || DEFAULT_SUPABASE_ANON_KEY;

/**
 * False only if both the environment variables and the defaults are blanked
 * out, in which case the site falls back to the catalogue bundled in src/config.
 */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const MEDIA_BUCKET = "media";
