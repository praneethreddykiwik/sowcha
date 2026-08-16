import { ART_VARIANTS } from "@/lib/content-types";

/**
 * Every editable collection described once. The admin UI is generated from
 * this, so adding a field to a table means adding one line here — not a new
 * screen.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "boolean"
  | "select"
  | "tags"
  | "image"
  | "date"
  | "blocks";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  options?: string[];
  required?: boolean;
  rows?: number;
};

export type CollectionKey =
  | "products"
  | "capsules"
  | "categories"
  | "gallery_items"
  | "posts"
  | "testimonials"
  | "faqs"
  | "sustainability_points";

export type Collection = {
  key: CollectionKey;
  table: string;
  label: string;
  singular: string;
  description: string;
  /** Column used as the row title in list views. */
  titleField: string;
  subtitleField?: string;
  imageField?: string;
  artField?: string;
  fields: Field[];
  defaults: Record<string, unknown>;
};

const artField: Field = {
  name: "art_variant",
  label: "Fallback illustration",
  type: "select",
  options: ART_VARIANTS,
  help: "Drawn artwork shown until a photo is uploaded, and if a photo fails to load.",
};

const publishedField: Field = {
  name: "is_published",
  label: "Visible on the site",
  type: "boolean",
};

export const collections: Collection[] = [
  {
    key: "products",
    table: "products",
    label: "Products",
    singular: "Product",
    description: "The featured collection grid and its quick-view panels.",
    titleField: "name",
    subtitleField: "collection",
    imageField: "image_url",
    artField: "art_variant",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      {
        name: "slug",
        label: "Slug",
        type: "text",
        required: true,
        help: "Lowercase, hyphenated. Used internally and must be unique.",
      },
      { name: "collection", label: "Capsule label", type: "text" },
      { name: "image_url", label: "Photo", type: "image" },
      { name: "description", label: "Short description", type: "textarea", rows: 2 },
      {
        name: "detail",
        label: "Quick-view detail",
        type: "textarea",
        rows: 4,
        help: "The longer paragraph shown when someone opens Quick view.",
      },
      {
        name: "materials",
        label: "Materials",
        type: "tags",
        help: "Press Enter after each material.",
      },
      artField,
      publishedField,
    ],
    defaults: {
      name: "",
      slug: "",
      collection: "",
      description: "",
      detail: "",
      materials: [],
      art_variant: "anarkali",
      image_url: null,
      is_published: true,
    },
  },
  {
    key: "capsules",
    table: "capsules",
    label: "Capsules",
    singular: "Capsule",
    description: "The large editorial rows further down the home page.",
    titleField: "title",
    subtitleField: "kicker",
    imageField: "image_url",
    artField: "art_variant",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "kicker", label: "Kicker", type: "text", help: 'e.g. "Capsule 01"' },
      { name: "image_url", label: "Photo", type: "image" },
      { name: "body", label: "Description", type: "textarea", rows: 3 },
      artField,
      publishedField,
    ],
    defaults: {
      title: "",
      slug: "",
      kicker: "",
      body: "",
      art_variant: "folds",
      image_url: null,
      is_published: true,
    },
  },
  {
    key: "categories",
    table: "categories",
    label: "Category tiles",
    singular: "Category",
    description: "The four small tiles above the product grid.",
    titleField: "title",
    subtitleField: "body",
    imageField: "image_url",
    artField: "art_variant",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "body", label: "Caption", type: "text" },
      { name: "image_url", label: "Photo", type: "image" },
      artField,
      publishedField,
    ],
    defaults: {
      title: "",
      body: "",
      art_variant: "folds",
      image_url: null,
      is_published: true,
    },
  },
  {
    key: "gallery_items",
    table: "gallery_items",
    label: "Gallery",
    singular: "Gallery image",
    description: "The masonry grid. Tall and wide tiles break the rhythm.",
    titleField: "caption",
    imageField: "image_url",
    artField: "art_variant",
    fields: [
      { name: "caption", label: "Caption", type: "text", required: true },
      { name: "image_url", label: "Photo", type: "image" },
      {
        name: "size",
        label: "Tile size",
        type: "select",
        options: ["square", "tall", "wide"],
      },
      artField,
      publishedField,
    ],
    defaults: {
      caption: "",
      size: "square",
      art_variant: "sprig",
      image_url: null,
      is_published: true,
    },
  },
  {
    key: "posts",
    table: "posts",
    label: "Journal",
    singular: "Entry",
    description: "Blog entries at /journal. Each one gets its own page.",
    titleField: "title",
    subtitleField: "category",
    imageField: "image_url",
    artField: "art_variant",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "excerpt", label: "Excerpt", type: "textarea", rows: 3 },
      { name: "image_url", label: "Cover photo", type: "image" },
      { name: "category", label: "Category", type: "text" },
      { name: "published_at", label: "Date", type: "date" },
      { name: "reading_time", label: "Reading time", type: "text", help: 'e.g. "6 min"' },
      artField,
      { name: "body", label: "Entry", type: "blocks" },
      publishedField,
    ],
    defaults: {
      title: "",
      slug: "",
      excerpt: "",
      category: "Craft",
      reading_time: "5 min",
      art_variant: "sprig",
      image_url: null,
      body: [],
      is_published: true,
    },
  },
  {
    key: "testimonials",
    table: "testimonials",
    label: "Testimonials",
    singular: "Testimonial",
    description: "Customer quotes in the sustainability section.",
    titleField: "name",
    subtitleField: "place",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "place", label: "City", type: "text" },
      { name: "quote", label: "Quote", type: "textarea", rows: 4, required: true },
      publishedField,
    ],
    defaults: { name: "", place: "", quote: "", is_published: true },
  },
  {
    key: "faqs",
    table: "faqs",
    label: "FAQs",
    singular: "Question",
    description: "The accordion near the bottom of the home page.",
    titleField: "question",
    fields: [
      { name: "question", label: "Question", type: "text", required: true },
      { name: "answer", label: "Answer", type: "textarea", rows: 4, required: true },
      publishedField,
    ],
    defaults: { question: "", answer: "", is_published: true },
  },
  {
    key: "sustainability_points",
    table: "sustainability_points",
    label: "Sustainability",
    singular: "Point",
    description: "The four cards describing how you work.",
    titleField: "title",
    subtitleField: "body",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "body", label: "Body", type: "textarea", rows: 3 },
      publishedField,
    ],
    defaults: { title: "", body: "", is_published: true },
  },
];

export const getCollection = (key: string) =>
  collections.find((c) => c.key === key);

export const SECTION_LABELS: Record<string, string> = {
  about: "About section",
  featured: "Featured collection",
  atelier: "Product spotlight (the animated dress)",
  capsules: "Premium capsules",
  sustainability: "Sustainability",
  gallery: "Gallery",
  journal: "Journal",
  faq: "FAQ",
  contact: "Contact",
};
