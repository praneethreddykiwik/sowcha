import { brand } from "@/config/brand";
import { categories, collections, products } from "@/config/products";
import { faqs, gallery, sustainability, testimonials } from "@/config/gallery";
import { posts } from "@/config/journal";
import type { SiteContent } from "./content-types";

/**
 * The site as shipped in code. Used when Supabase is not configured, and as
 * the safety net if a query fails — the page renders yesterday's design
 * rather than an error.
 */
export const fallbackContent: SiteContent = {
  live: false,
  settings: {
    brandName: brand.name,
    tagline: brand.tagline,
    shortAbout: brand.shortAbout,
    aboutIntro: brand.about.intro,
    aboutBody: brand.about.body,
    mission: brand.about.mission,
    vision: brand.about.vision,
    founderNote: brand.about.founderNote,
    founderName: brand.about.founderName,
    aboutImageUrl: null,
    aboutImage2Url: null,
    phone: brand.contact.phone,
    phoneHref: brand.contact.phoneHref,
    email: brand.contact.email,
    instagramUrl: brand.contact.instagram,
    instagramHandle: brand.contact.instagramHandle,
    linkedinUrl: brand.contact.linkedin,
    location: brand.contact.location,
    mapsUrl: brand.contact.mapsUrl,
    hours: brand.contact.hours.map((h) => ({ days: h.days, time: h.time })),
    values: brand.values.map((v) => ({ title: v.title, body: v.body })),
    timeline: brand.timeline.map((t) => ({
      year: t.year,
      title: t.title,
      body: t.body,
    })),
    marqueeWords: [
      "Nature inspired",
      "Hand finished",
      "Plant dyed",
      "Made in small batches",
      "Luxury in simplicity",
      "Repairs, free for three years",
    ],
  },
  sections: {
    about: {
      eyebrow: "Our Story",
      title: "Made slowly, worn softly",
      accentWords: ["softly"],
      subtitle: brand.about.intro,
    },
    featured: {
      eyebrow: "Featured Collection",
      title: "Pieces we are quietly proud of",
      accentWords: ["quietly"],
      subtitle:
        "A lookbook, not a shop. Everything here exists — write to us and we will tell you what is currently on the rail.",
    },
    atelier: {
      eyebrow: "Product Spotlight",
      title: "The Rosewater Anarkali",
      accentWords: ["Anarkali"],
      subtitle:
        "Drawn rather than photographed — move your cursor across it and the dupatta, the skirt and the painted vine part company, exactly as they do on a hanger.",
    },
    capsules: {
      eyebrow: "Premium Capsules",
      title: "Three lines, one temperament",
      accentWords: ["temperament"],
      subtitle:
        "Each capsule is small on purpose — a handful of silhouettes we can make properly rather than a catalogue we cannot.",
    },
    sustainability: {
      eyebrow: "How we work",
      title: "Kind to skin, kinder to soil",
      accentWords: ["kinder"],
      subtitle:
        "Not a campaign — just the constraints we agreed on before the first piece was cut.",
    },
    gallery: {
      eyebrow: "Gallery",
      title: "From the cutting room",
      accentWords: ["cutting"],
      subtitle:
        "Unstyled, unedited, mostly taken on a phone between two other things.",
    },
    journal: {
      eyebrow: "The Journal",
      title: "Notes from the atelier",
      accentWords: ["atelier"],
      subtitle: "Cloth, dye, hands and the occasional argument about hemlines.",
    },
    faq: {
      eyebrow: "Questions",
      title: "The things people ask",
      accentWords: ["ask"],
      subtitle: "",
    },
    contact: {
      eyebrow: "Visit or write",
      title: "Come and see the cloth",
      accentWords: ["cloth"],
      subtitle:
        "The rail changes weekly. Tell us what you are looking for and we will set aside the pieces worth your afternoon.",
    },
  },
  products: products.map((p) => ({
    id: p.slug,
    slug: p.slug,
    name: p.name,
    collection: p.collection,
    description: p.description,
    detail: p.detail,
    materials: [...p.materials],
    art: p.art,
    image: p.image,
  })),
  capsules: collections.map((c) => ({
    id: c.slug,
    slug: c.slug,
    title: c.title,
    kicker: c.kicker,
    body: c.body,
    art: c.art,
    image: c.image,
  })),
  categories: categories.map((c, i) => ({
    id: `category-${i}`,
    title: c.title,
    body: c.body,
    art: c.art,
    image: "",
  })),
  gallery: gallery.map((g) => ({
    id: g.id,
    caption: g.caption,
    size: g.size,
    art: g.art,
    image: g.image,
  })),
  posts: posts.map((p) => ({
    id: p.slug,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    date: p.date,
    readingTime: p.readingTime,
    art: p.art,
    image: p.image,
    body: p.body,
  })),
  testimonials: testimonials.map((t, i) => ({
    id: `testimonial-${i}`,
    name: t.name,
    place: t.place,
    quote: t.quote,
  })),
  faqs: faqs.map((f, i) => ({ id: `faq-${i}`, q: f.q, a: f.a })),
  sustainability: sustainability.map((s, i) => ({
    id: `sustainability-${i}`,
    title: s.title,
    body: s.body,
  })),
};
