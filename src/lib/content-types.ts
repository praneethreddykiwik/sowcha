import type { ArtVariant } from "@/config/products";

export type { ArtVariant };

export type Settings = {
  brandName: string;
  tagline: string;
  shortAbout: string;
  aboutIntro: string;
  aboutBody: string;
  mission: string;
  vision: string;
  founderNote: string;
  founderName: string;
  aboutImageUrl: string | null;
  aboutImage2Url: string | null;
  phone: string;
  phoneHref: string;
  email: string;
  instagramUrl: string;
  instagramHandle: string;
  linkedinUrl: string;
  location: string;
  mapsUrl: string;
  hours: { days: string; time: string }[];
  values: { title: string; body: string }[];
  timeline: { year: string; title: string; body: string }[];
  marqueeWords: string[];
};

export type SectionCopy = {
  eyebrow: string;
  title: string;
  accentWords: string[];
  subtitle: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  collection: string;
  description: string;
  detail: string;
  materials: string[];
  art: ArtVariant;
  image: string;
};

export type Capsule = {
  id: string;
  slug: string;
  title: string;
  kicker: string;
  body: string;
  art: ArtVariant;
  image: string;
};

export type Category = {
  id: string;
  title: string;
  body: string;
  art: ArtVariant;
  image: string;
};

export type GalleryItem = {
  id: string;
  caption: string;
  size: "square" | "tall" | "wide";
  art: ArtVariant;
  image: string;
};

export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "quote"; text: string; by?: string }
  | { type: "list"; items: string[] }
  | { type: "image"; art: ArtVariant; image: string; caption?: string };

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: string;
  art: ArtVariant;
  image: string;
  body: Block[];
};

export type Testimonial = {
  id: string;
  name: string;
  place: string;
  quote: string;
};

export type Faq = { id: string; q: string; a: string };

export type SustainabilityPoint = { id: string; title: string; body: string };

export type SiteContent = {
  settings: Settings;
  sections: Record<string, SectionCopy>;
  products: Product[];
  capsules: Capsule[];
  categories: Category[];
  gallery: GalleryItem[];
  posts: Post[];
  testimonials: Testimonial[];
  faqs: Faq[];
  sustainability: SustainabilityPoint[];
  /** False when the site is running on bundled defaults. */
  live: boolean;
};

export const SECTION_KEYS = [
  "about",
  "featured",
  "atelier",
  "capsules",
  "sustainability",
  "gallery",
  "journal",
  "faq",
  "contact",
] as const;

export const ART_VARIANTS: ArtVariant[] = [
  "anarkali",
  "drape",
  "sprig",
  "folds",
  "butterfly",
  "bloom",
];
