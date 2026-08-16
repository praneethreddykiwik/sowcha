# SowCha

A showcase site for the SowCha label — brand, lookbook and journal, with a
Supabase-backed admin at `/admin` for editing every image and every line of copy.

The site also sells: cart, checkout, stock-aware sizes, order tracking, and an
Orders desk in the admin. Payment is cash on delivery or bank transfer — no
gateway keys required.

Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion · Supabase.

```bash
npm install
cp .env.example .env.local   # fill in the Supabase values
npm run dev                  # http://localhost:3000
npm run build
```

### Environment

| Variable | Needed | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Project API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Publishable key — safe in the browser, RLS does the guarding |
| `NEXT_PUBLIC_SITE_URL` | optional | Absolute URL for OG tags; Vercel's own URL is used if unset |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | no | Legacy image host, unused once images are uploaded to Supabase |

Set the same variables in **Vercel → Settings → Environment Variables** so the
deployed site talks to the same backend.

## Editing content

Everything on the site is edited from **`/admin`** — no code, no redeploy. Each
save writes to Supabase and immediately revalidates the public pages.

| Screen | Covers |
| --- | --- |
| Brand & contact | Name, tagline, hero intro, marquee phrases, the about story, mission, vision, founder quote, both about images, phone, email, Instagram, LinkedIn, address, maps link, opening hours, values, timeline |
| Section headings | The eyebrow, headline, italic words and intro paragraph above every home-page section |
| Products | Featured grid + quick-view panels, with photo upload |
| Capsules | The large editorial rows |
| Category tiles | The four tiles above the product grid |
| Gallery | Masonry grid, with square/tall/wide sizing |
| Journal | Blog entries — block editor for paragraphs, headings, pull quotes, lists and inline images |
| Testimonials · FAQs · Sustainability | The remaining copy blocks |
| Media library | Every uploaded file, with copy-URL and delete |

Every collection supports create, edit, reorder, show/hide and delete.

### First sign-in

1. Go to `/admin` — you are redirected to `/admin/login`.
2. Choose **Create your account** and use an address on the allowlist.
3. You are signed straight in (allowlisted addresses are auto-confirmed).

To add another admin, insert their address into `admin_emails` in Supabase.
Anyone can create an account, but without an allowlist entry they get no
read or write access beyond what the public site already shows.

### Images

Upload directly in any editor — drag a file onto the photo box, or click it.
Files go to the Supabase Storage `media` bucket (public read, admin-only write,
10 MB limit, JPG/PNG/WebP/AVIF/GIF/SVG).

Until a photo is uploaded, every image slot falls back to the hand-drawn
botanical illustration, so the site never shows a broken tile.

## Shop

| Piece | Where |
| --- | --- |
| Prices, compare-at price, SKU, stock, care notes | Admin → Products |
| Sizes with their own stock and optional price override | Admin → Products → Sizes & stock |
| Cart | Basket button in the navbar; persists in `localStorage` |
| Checkout | `/checkout` — address, COD or bank transfer |
| Order tracking | `/orders/track` — order number **and** the email used |
| Orders desk | Admin → Orders — status, payment, courier, tracking, revenue |

**Prices are never trusted from the browser.** The cart sends product ids and
quantities only; `place_order()` reads every price from the database, locks the
rows, checks stock and computes the total in one transaction. Editing the cart
in devtools changes the display and nothing else.

Money is stored as integer paise everywhere (`price_cents`), so there is no
float drift and no numeric-as-string surprises.

Order numbers look like `SC-2026-1003-7824` — sequential prefix for readability,
random suffix so they cannot be walked. Tracking needs the number *and* the
matching email, checked inside `get_order_status()`; the orders table itself is
never readable from the browser.

## Backend

Supabase — Postgres, Auth and Storage.

The full schema is committed at [`supabase/schema.sql`](supabase/schema.sql) —
run it on a fresh project to recreate everything.

```
site_settings          brand, about copy, contact, hours, values, timeline,
                       shipping rates and payment toggles
section_copy           per-section eyebrow / headline / accent words / subtitle
products               copy, price, stock, SKU, care
product_variants       sizes, each with its own stock
product_images         extra gallery shots
orders · order_items   checkout output, with snapshotted names and prices
capsules · categories · gallery_items · posts
testimonials · faqs · sustainability_points
media                  index of uploaded files
admin_emails           the write allowlist
```

Row level security is on for every table: anonymous visitors can read published
rows and nothing else; writes require a signed-in account whose email is in
`admin_emails`, checked by the `is_admin()` function used in every policy.

**Caching.** Public pages are statically rendered and read through a cached
`getSiteContent()` (5-minute TTL) tagged `site-content`. Every admin save calls
`revalidateTag`, so edits appear immediately rather than after the TTL. The
dashboard also has a manual *Refresh live site* button for when you edit rows
directly in the Supabase table editor.

Without Supabase environment variables the app falls back to the bundled
content in `src/config` — it still builds and renders.

## Themes

Three palettes — 🌿 Sage (default), 🌸 Blossom, 💜 Lavender — swapped from the
navbar and remembered in `localStorage`. An inline script in `layout.tsx`
applies the stored theme before first paint, so returning visitors never see a
flash of the wrong palette.

Colours are CSS variables (`--primary`, `--bg`, `--accent`, …) holding `R G B`
triplets, defined per `[data-theme]` in `src/app/globals.css` and mapped into
Tailwind in `tailwind.config.ts`. Everything — including the drawn artwork and
the animated dress — is painted from those variables, so a theme change re-dyes
the illustrations too.

To add a theme: add a `[data-theme="name"]` block in `globals.css`, add an entry
to `themes.ts`, and add the id to the validation array in `themeInitScript`.

## The animated dress

`src/components/animated-dress.tsx` draws the Rosewater Anarkali as seven
stacked SVG layers inside a shared CSS perspective — halo, rail, dupatta,
garment, pleats, painted vine, front edge, drifting petals. Pointer movement
parallaxes the layers against each other; the pleats and the vine draw
themselves on when the section scrolls into view; the dupatta sways on its own
axis. All of it honours `prefers-reduced-motion`.

## Structure

```
src/
  app/          routes: /, /journal, /journal/[slug]
  components/   navbar, footer, butterfly emblem, animated dress,
                botanical art, image frame, product card, theme switcher,
                ui/ (button, section heading, reveal, tilt)
  sections/     hero, about, featured, atelier, collections,
                sustainability, gallery, journal preview, faq, contact
  config/       all editable content
  lib/          utils
```

## Notes

- Every route is statically prerendered; there are no runtime data fetches.
- Motion is centralised: `Reveal` / `RevealGroup` for scroll entrances, `Tilt`
  for pointer-driven 3D, all on the same `cubic-bezier(0.16, 1, 0.3, 1)` curve.
- Accessibility: skip link, labelled controls, keyboard-dismissable dialogs,
  visible focus rings, and a full reduced-motion path.
