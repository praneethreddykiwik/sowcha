import { cld } from "./cloudinary";
import type { ArtVariant } from "./products";

/**
 * The SowCha Journal. Posts are plain data — add an object, get a page at
 * /journal/<slug>. `body` is an array of blocks so the layout stays editorial
 * without needing a CMS or markdown pipeline.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "quote"; text: string; by?: string }
  | { type: "list"; items: string[] }
  | { type: "image"; art: ArtVariant; image: string; caption?: string };

export type Post = {
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

export const posts: Post[] = [
  {
    slug: "the-anatomy-of-a-good-anarkali",
    title: "The anatomy of a good anarkali",
    excerpt:
      "Twelve metres of cloth, one yoke, and the half-second of delay that separates a beautiful flare from a stiff one.",
    category: "Craft",
    date: "2026-07-18",
    readingTime: "6 min",
    art: "anarkali",
    image: cld("sowcha/journal/anarkali", { width: 1600 }),
    body: [
      {
        type: "p",
        text: "An anarkali is judged in motion, not on a hanger. Everything we do to it — the pleat depth, the yoke height, the weight of the hem — exists to control what happens in the second after you turn.",
      },
      { type: "h", text: "Start at the yoke" },
      {
        type: "p",
        text: "The yoke is the only rigid part of the garment. Sit it too low and the flare begins at the waist, which reads heavy. Sit it too high and the pleats fan from the chest, which reads costume. We settle it just under the bust and pleat outward from the centre in knife folds no wider than a fingertip.",
      },
      {
        type: "list",
        items: [
          "Twelve metres of cotton mul for a full-length flare",
          "Knife pleats, 9mm, pressed once and never again",
          "A hem weighted only by a second rolled edge — never by tape",
        ],
      },
      { type: "h", text: "Then let the cloth decide" },
      {
        type: "p",
        text: "Mul is unhelpfully light, which is exactly why it works. It refuses to hold a shape you impose on it, so the silhouette has to come from the cut. Once the cut is right, the fabric does the rest and keeps doing it for years.",
      },
      {
        type: "quote",
        text: "If the skirt needs stiffening to look good standing still, it will look wrong walking.",
        by: "Our head cutter, on her third correction of my first sample",
      },
      {
        type: "p",
        text: "The painted vine came later. We wanted a mark that started at the hem and climbed — something that made you follow the length of the piece rather than take it in at once. It is drawn freehand, so it lands differently on every garment.",
      },
    ],
  },
  {
    slug: "what-plant-dye-actually-does",
    title: "What plant dye actually does",
    excerpt:
      "Indigo, madder, myrobalan — and why your green will not be the green in the photograph, which is the point.",
    category: "Materials",
    date: "2026-06-02",
    readingTime: "5 min",
    art: "folds",
    image: cld("sowcha/journal/dye", { width: 1600 }),
    body: [
      {
        type: "p",
        text: "Synthetic dye is a promise of sameness. Every metre matches every other metre, this year and next. Plant dye promises nothing of the sort, and we have built the entire Sage line on that refusal.",
      },
      { type: "h", text: "Three dips, three greens" },
      {
        type: "p",
        text: "Our sage comes from indigo over myrobalan. The first dip is a pale, almost grey wash. The second finds the green. The third takes it somewhere deeper that we can aim for but never precisely repeat, because the vat is alive and behaves differently in July than in December.",
      },
      {
        type: "image",
        art: "sprig",
        image: cld("sowcha/journal/dye-vat", { width: 1400 }),
        caption: "The vat, mid-July. Warmer weeks pull the green bluer.",
      },
      { type: "h", text: "How it ages" },
      {
        type: "p",
        text: "It fades — gently, unevenly, toward warmth. Shoulders lighten first. After two years a plant-dyed linen looks worn in the way a good book looks read. We consider that a feature, and we say so before you buy rather than after.",
      },
      {
        type: "list",
        items: [
          "Cold water and mild soap only",
          "Dry in shade; direct sun accelerates the shift",
          "Store folded, not hung — weight pulls the shoulder",
        ],
      },
    ],
  },
  {
    slug: "why-the-butterfly",
    title: "Why the butterfly",
    excerpt:
      "The emblem is not decoration. It is a note to ourselves about what the label is supposed to be for.",
    category: "Brand",
    date: "2026-05-09",
    readingTime: "4 min",
    art: "butterfly",
    image: cld("sowcha/journal/butterfly", { width: 1600 }),
    body: [
      {
        type: "p",
        text: "We drew eleven marks before this one. Leaves, a seed, a thread and needle, a bowl. All of them were about making. None of them were about the person wearing the result.",
      },
      {
        type: "p",
        text: "The butterfly is about change — the slow, unglamorous, mostly invisible kind. It felt honest for a label that asks people to buy less and keep it longer, and it gave us the vocabulary the rest of the design follows: wings, vines, air, nothing heavy.",
      },
      {
        type: "quote",
        text: "Luxury in simplicity — not simplicity as a shortcut, but as the harder result.",
      },
      { type: "h", text: "Where you will find it" },
      {
        type: "p",
        text: "Embroidered at the left shoulder on Signature pieces, blind-stamped on the box, and printed once inside the care label where only you will see it. Never across the chest. It is a signature, not a slogan.",
      },
    ],
  },
  {
    slug: "a-day-in-the-atelier",
    title: "A day in the atelier",
    excerpt:
      "Seven in the morning to six in the evening, eleven pairs of hands, and roughly four finished garments.",
    category: "Atelier",
    date: "2026-04-21",
    readingTime: "7 min",
    art: "drape",
    image: cld("sowcha/journal/atelier", { width: 1600 }),
    body: [
      {
        type: "p",
        text: "Four garments a day is not a production figure anyone would boast about. It is, however, the number that lets every piece pass through the same two people at the finishing table.",
      },
      { type: "h", text: "Morning" },
      {
        type: "p",
        text: "Cloth is laid at seven while the light is flat and colours read true. Cutting happens before the room warms up, because mul stretches with humidity and a pattern cut at noon in June is not the pattern cut at seven.",
      },
      { type: "h", text: "Afternoon" },
      {
        type: "p",
        text: "Painting and embroidery. This is the slow half — a vine takes most of a day, the shoulder butterfly rather more. Nothing here can be hurried without showing, so we do not try.",
      },
      {
        type: "image",
        art: "bloom",
        image: cld("sowcha/journal/finishing", { width: 1400 }),
        caption: "Finishing table, late afternoon.",
      },
      { type: "h", text: "Evening" },
      {
        type: "p",
        text: "Every piece is checked, folded into cloth, and set aside overnight before it ships. The overnight rest is not superstition — it is when pressed pleats settle and any pull at a seam becomes obvious.",
      },
    ],
  },
  {
    slug: "how-to-build-a-wardrobe-of-twelve",
    title: "How to build a wardrobe of twelve",
    excerpt:
      "An argument for fewer pieces, and a practical list of what those pieces should actually be.",
    category: "Living",
    date: "2026-03-14",
    readingTime: "6 min",
    art: "sprig",
    image: cld("sowcha/journal/wardrobe", { width: 1600 }),
    body: [
      {
        type: "p",
        text: "Most wardrobes are not too small; they are too undecided. Twelve pieces that agree with each other will dress you better than forty that do not.",
      },
      { type: "h", text: "The rule" },
      {
        type: "p",
        text: "Pick one family of colour and one weight of cloth. Everything you add has to work with at least four things you already own, or it does not come home.",
      },
      {
        type: "list",
        items: [
          "Three everyday kurtas in one tonal family",
          "Two drapes that double as scarves",
          "One occasion piece you would wear twice a year for a decade",
          "Two sets of linen separates",
          "Four pieces that are simply yours and follow no rule at all",
        ],
      },
      {
        type: "p",
        text: "The last four matter most. A wardrobe built entirely on discipline is a uniform, and we are not interested in dressing anyone in a uniform.",
      },
    ],
  },
  {
    slug: "notes-on-white-space",
    title: "Notes on white space",
    excerpt:
      "What our packaging, our shop floor and our hemlines have in common — mostly, what is not there.",
    category: "Design",
    date: "2026-02-02",
    readingTime: "4 min",
    art: "bloom",
    image: cld("sowcha/journal/whitespace", { width: 1600 }),
    body: [
      {
        type: "p",
        text: "The first version of our box had the logo three times, a pattern, a ribbon and a card. The final version has a blind stamp and a cloth wrap. It costs more to make and says considerably less.",
      },
      {
        type: "p",
        text: "Restraint is expensive because it removes the places you can hide. A plain hem has to be a good hem. An unlined jacket has to have clean seams inside. When there is nothing to look at except the making, the making has to be right.",
      },
      {
        type: "quote",
        text: "Nothing should scream. Everything should whisper.",
      },
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
