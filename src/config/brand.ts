/**
 * Single source of truth for brand facts. Everything user-facing reads from
 * here — change it once and the whole site follows.
 */

export const brand = {
  name: "SowCha",
  tagline: "Luxury in Simplicity",
  shortAbout:
    "Nature inspired pieces, designed with elegance and purpose — made slowly, worn softly, kept for years.",

  about: {
    intro:
      "SowCha began with a simple observation: the pieces we return to are never the loudest ones. They are the quiet ones — the weightless cotton, the hand-drawn vine along a hem, the colour that behaves in every light.",
    body: "We work with small ateliers, natural fibres and hand-finished detail. Every silhouette is drawn, draped and revised until it feels like it was always there. Nothing is rushed, nothing is decorative for its own sake.",
    mission:
      "To make everyday dressing feel considered — through natural materials, honest craft and designs that outlive a season.",
    vision:
      "A wardrobe with fewer, better things: pieces carried between generations rather than replaced each year.",
    founderNote:
      "I wanted to build the kind of label I kept looking for and never found — soft, unhurried, and made by people whose names I know.",
    founderName: "Founder, SowCha",
  },

  contact: {
    phone: "+91 98765 43210",
    phoneHref: "tel:+919876543210",
    email: "hello@sowcha.com",
    instagram: "https://instagram.com/sowcha",
    instagramHandle: "@sowcha",
    linkedin: "https://www.linkedin.com/company/sowcha",
    location: "Jubilee Hills, Hyderabad, Telangana 500033, India",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Jubilee+Hills+Hyderabad",
    hours: [
      { days: "Monday — Friday", time: "10:00 — 19:00" },
      { days: "Saturday", time: "11:00 — 18:00" },
      { days: "Sunday", time: "By appointment" },
    ],
  },

  values: [
    { title: "Support", body: "Small ateliers, fair work, long relationships." },
    { title: "Trust", body: "Honest materials described exactly as they are." },
    { title: "Nature", body: "Plant-dyed, breathable, gentle on the skin." },
    { title: "Love", body: "Every piece finished by hand before it leaves us." },
  ],

  timeline: [
    { year: "2021", title: "A sketchbook", body: "Three silhouettes drawn at a kitchen table." },
    { year: "2022", title: "First atelier", body: "Four artisans, one cutting room, endless samples." },
    { year: "2024", title: "The Sage line", body: "Our first fully plant-dyed capsule sells out." },
    { year: "2026", title: "Slow and steady", body: "Eleven artisans. Still no season we rush." },
  ],
} as const;

export const nav = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Collection", href: "/#collection" },
  { label: "Atelier", href: "/#atelier" },
  { label: "Journal", href: "/journal" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Contact", href: "/#contact" },
] as const;
