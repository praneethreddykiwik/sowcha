/**
 * The site's absolute URL, resolved once and shared by metadata, canonical
 * tags, the sitemap, robots.txt and the manifest.
 *
 * The production domain is the default rather than a Vercel fallback: these
 * values are inlined at build time, so without it canonical tags and the
 * sitemap would advertise the `*.vercel.app` deployment URL instead of
 * sowcha.com — which is a duplicate-content split, not a cosmetic issue.
 *
 * Preview deploys still identify themselves, because VERCEL_ENV is "preview"
 * there and we fall through to the deployment URL.
 */

const PRODUCTION_URL = "https://sowcha.com";

function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.NODE_ENV === "development") return "http://localhost:3000";

  return PRODUCTION_URL;
}

export const siteUrl = resolveSiteUrl();
