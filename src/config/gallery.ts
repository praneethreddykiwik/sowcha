import { cld } from "./cloudinary";
import type { ArtVariant } from "./products";

export type GalleryItem = {
  id: string;
  caption: string;
  /** Masonry span. "tall" and "wide" break the grid rhythm. */
  size: "tall" | "wide" | "square";
  art: ArtVariant;
  image: string;
};

export const gallery: GalleryItem[] = [
  { id: "g1", caption: "Cutting room, 7am", size: "tall", art: "folds", image: cld("sowcha/gallery/cutting-room", { width: 900 }) },
  { id: "g2", caption: "Vine study in rose", size: "square", art: "sprig", image: cld("sowcha/gallery/vine-study", { width: 800 }) },
  { id: "g3", caption: "Pleats, unpressed", size: "square", art: "anarkali", image: cld("sowcha/gallery/pleats", { width: 800 }) },
  { id: "g4", caption: "Indigo, third dip", size: "wide", art: "bloom", image: cld("sowcha/gallery/indigo", { width: 1200 }) },
  { id: "g5", caption: "The emblem, by hand", size: "tall", art: "butterfly", image: cld("sowcha/gallery/emblem", { width: 900 }) },
  { id: "g6", caption: "Mul against morning", size: "square", art: "drape", image: cld("sowcha/gallery/mul", { width: 800 }) },
  { id: "g7", caption: "Hem, rolled twice", size: "square", art: "folds", image: cld("sowcha/gallery/hem", { width: 800 }) },
  { id: "g8", caption: "Dupatta, drying", size: "wide", art: "drape", image: cld("sowcha/gallery/drying", { width: 1200 }) },
];

export const testimonials = [
  {
    name: "Ananya R.",
    place: "Bengaluru",
    quote:
      "It arrived folded in cloth, not plastic. Two years on, the linen has gone softer and the colour has gone kinder.",
  },
  {
    name: "Meher K.",
    place: "Dubai",
    quote:
      "I wore the anarkali to my sister's mehendi and three people asked whether it was vintage. It is one season old.",
  },
  {
    name: "Sara T.",
    place: "London",
    quote:
      "Nothing about it shouts. That is precisely why I keep reaching for it over things that cost four times as much.",
  },
];

export const faqs = [
  {
    q: "Do you sell online?",
    a: "This site is a lookbook, not a store. Pieces are released through our atelier and by appointment — write to us and we will walk you through what is currently on the rail.",
  },
  {
    q: "How should I care for plant-dyed cloth?",
    a: "Cold water, mild soap, dry in shade. Plant dyes shift slightly with every wash; that drift is the point, not a defect.",
  },
  {
    q: "Are pieces made to measure?",
    a: "Most silhouettes can be adjusted at the yoke, sleeve and length. Made-to-measure takes three to four weeks from first fitting.",
  },
  {
    q: "Where is everything made?",
    a: "In our own atelier in Hyderabad, with eleven artisans. Weaving and natural dyeing happen with partner clusters in Telangana and West Bengal.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes, on request. Packaging is cloth and recycled board — no plastic anywhere in the box.",
  },
];

export const sustainability = [
  { title: "Natural fibres", body: "Cotton, linen, silk and nothing synthetic next to the skin." },
  { title: "Plant dyed", body: "Indigo, madder, myrobalan — dyed in small, water-metered batches." },
  { title: "Zero plastic", body: "Cloth wrap, recycled board, paper tape. Every order, every time." },
  { title: "Made to last", body: "Repairs are free for the first three years. Send it back, we mend it." },
];
