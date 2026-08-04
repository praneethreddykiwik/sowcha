# SowCha

A showcase site for the SowCha label — brand, lookbook and journal. **Not** an
ecommerce site: there is no cart, checkout, login, pricing, inventory, backend,
database or admin panel anywhere in the codebase, and none is planned in this
layer.

Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion · Cloudinary URLs.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # every route prerenders as static HTML
```

## Editing content

Everything user-facing lives in `src/config` as plain TypeScript. No CMS, no API.

| File | What it holds |
| --- | --- |
| `brand.ts` | Name, tagline, about copy, mission, vision, values, timeline, phone, email, Instagram, location, hours, nav items |
| `products.ts` | Featured pieces, editorial capsules, category tiles |
| `gallery.ts` | Gallery grid, testimonials, FAQs, sustainability points |
| `journal.ts` | Blog posts (add an object → a page appears at `/journal/<slug>`) |
| `themes.ts` | The three colour themes |
| `cloudinary.ts` | Your cloud name + the URL builder |

### Images

Upload in the Cloudinary dashboard, copy the public id, and reference it:

```ts
image: cld("sowcha/products/rosewater-anarkali", { width: 1000 })
```

Set your cloud name once, in `.env.local`:

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

Until an image resolves, `<ImageFrame>` renders the matching hand-drawn
botanical illustration instead of a broken tile — so the site looks finished
with zero configuration, and each photo simply replaces its placeholder as you
upload it.

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
