import { cld } from "./cloudinary";

/**
 * Showcase only — deliberately no price, no stock, no cart. Each entry needs a
 * Cloudinary public id; `art` picks the fallback illustration used until the
 * photo is uploaded (see components/ImageFrame).
 */

export type ArtVariant = "anarkali" | "drape" | "sprig" | "folds" | "butterfly" | "bloom";

export type Product = {
  slug: string;
  name: string;
  collection: string;
  description: string;
  detail: string;
  materials: string[];
  art: ArtVariant;
  image: string;
};

export const products: Product[] = [
  {
    slug: "rosewater-anarkali",
    name: "Rosewater Anarkali",
    collection: "Blossom",
    description: "Hand-painted vines climbing a pleated cotton-mul flare.",
    detail:
      "Twelve metres of feather-light mul, knife-pleated at the yoke so the skirt moves a half second after you do.",
    materials: ["Cotton mul", "Hand-painted vine", "Chiffon dupatta"],
    art: "anarkali",
    image: cld("sowcha/products/rosewater-anarkali", { width: 1000 }),
  },
  {
    slug: "sage-linen-set",
    name: "Sage Linen Set",
    collection: "Sage",
    description: "Plant-dyed linen with a quiet, unlined drape.",
    detail:
      "Dyed in small batches with indigo and myrobalan; every set settles into its own shade of green over time.",
    materials: ["European linen", "Plant dye", "Shell buttons"],
    art: "folds",
    image: cld("sowcha/products/sage-linen-set", { width: 1000 }),
  },
  {
    slug: "butterfly-kurta",
    name: "Butterfly Kurta",
    collection: "Signature",
    description: "Our emblem, embroidered by hand at the shoulder.",
    detail:
      "Fifty-one hours of thread work per piece. The wings are stitched in two tones so they shift with the light.",
    materials: ["Handloom cotton", "Silk thread", "Mother of pearl"],
    art: "butterfly",
    image: cld("sowcha/products/butterfly-kurta", { width: 1000 }),
  },
  {
    slug: "morning-mul-drape",
    name: "Morning Mul Drape",
    collection: "Sage",
    description: "A single length of cloth, finished with a rolled hem.",
    detail:
      "No fastenings, no lining. Just cloth that behaves — six ways to wear it, all of them correct.",
    materials: ["Cotton mul", "Rolled hand hem"],
    art: "drape",
    image: cld("sowcha/products/morning-mul-drape", { width: 1000 }),
  },
  {
    slug: "lavender-dusk-suit",
    name: "Lavender Dusk Suit",
    collection: "Lavender",
    description: "Dusk violet with tone-on-tone leaf appliqué.",
    detail:
      "Appliqué leaves cut from the same bolt as the body, so the pattern reads only when the light moves.",
    materials: ["Chanderi", "Tonal appliqué", "Organza trim"],
    art: "sprig",
    image: cld("sowcha/products/lavender-dusk-suit", { width: 1000 }),
  },
  {
    slug: "petal-fall-dupatta",
    name: "Petal Fall Dupatta",
    collection: "Blossom",
    description: "Scalloped chiffon, edged with a hand-run wave.",
    detail:
      "The scallop is drawn freehand before it is cut, which is why no two edges are identical.",
    materials: ["Silk chiffon", "Hand-run scallop"],
    art: "bloom",
    image: cld("sowcha/products/petal-fall-dupatta", { width: 1000 }),
  },
];

/** Editorial rows on the home page — larger, story-led, one image each. */
export const collections = [
  {
    slug: "sage",
    title: "The Sage Line",
    kicker: "Capsule 01",
    body: "Plant-dyed linen and handloom cotton in seven greens, made to be worn until they soften into something better.",
    art: "folds" as ArtVariant,
    image: cld("sowcha/collections/sage", { width: 1400 }),
  },
  {
    slug: "blossom",
    title: "Blossom",
    kicker: "Capsule 02",
    body: "Rose, powder and shell — hand-painted botanicals on cloth light enough to read through.",
    art: "anarkali" as ArtVariant,
    image: cld("sowcha/collections/blossom", { width: 1400 }),
  },
  {
    slug: "lavender",
    title: "Lavender Hour",
    kicker: "Capsule 03",
    body: "Occasion pieces in dusk violet, cut clean and left almost undecorated on purpose.",
    art: "sprig" as ArtVariant,
    image: cld("sowcha/collections/lavender", { width: 1400 }),
  },
];

/** Compact category tiles. */
export const categories = [
  { title: "Everyday", body: "Cotton, linen, air.", art: "folds" as ArtVariant },
  { title: "Occasion", body: "Quiet celebration.", art: "anarkali" as ArtVariant },
  { title: "Drapes", body: "One cloth, many ways.", art: "drape" as ArtVariant },
  { title: "Gifting", body: "Wrapped by hand.", art: "butterfly" as ArtVariant },
];
