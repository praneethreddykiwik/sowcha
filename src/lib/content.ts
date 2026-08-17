import "server-only";
import { unstable_cache } from "next/cache";
import { supabasePublic } from "./supabase/public";
import { fallbackContent } from "./fallback-content";
import type {
  ArtVariant,
  Block,
  SectionCopy,
  SiteContent,
} from "./content-types";

/** Cache tag revalidated by the admin whenever anything is saved. */
export const CONTENT_TAG = "site-content";

const asArt = (value: unknown): ArtVariant => {
  const allowed = ["anarkali", "drape", "sprig", "folds", "butterfly", "bloom"];
  return (allowed.includes(String(value)) ? value : "sprig") as ArtVariant;
};

const str = (value: unknown, fallback = "") =>
  typeof value === "string" && value.length > 0 ? value : fallback;

/* eslint-disable @typescript-eslint/no-explicit-any */

async function fetchContent(): Promise<SiteContent> {
  if (!supabasePublic) {
    // Silent fallback is how the shop ends up showing an unbuyable catalogue
    // with no prices. Say so loudly in the server log.
    console.warn(
      "[sowcha] Supabase is not configured — serving the bundled catalogue. " +
        "Products will have no prices and cannot be added to the basket. " +
        "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
    return fallbackContent;
  }

  try {
    const [
      settingsRes,
      sectionsRes,
      variantsRes,
      imagesRes,
      productsRes,
      capsulesRes,
      categoriesRes,
      galleryRes,
      postsRes,
      testimonialsRes,
      faqsRes,
      sustainabilityRes,
    ] = await Promise.all([
      supabasePublic.from("site_settings").select("*").eq("id", 1).maybeSingle(),
      supabasePublic.from("section_copy").select("*"),
      supabasePublic.from("product_variants").select("*").eq("is_active", true).order("sort_order"),
      supabasePublic.from("product_images").select("*").order("sort_order"),
      supabasePublic
        .from("products")
        .select("*")
        .eq("is_published", true)
        .order("sort_order")
        .order("created_at"),
      supabasePublic
        .from("capsules")
        .select("*")
        .eq("is_published", true)
        .order("sort_order")
        .order("created_at"),
      supabasePublic
        .from("categories")
        .select("*")
        .eq("is_published", true)
        .order("sort_order")
        .order("created_at"),
      supabasePublic
        .from("gallery_items")
        .select("*")
        .eq("is_published", true)
        .order("sort_order")
        .order("created_at"),
      supabasePublic
        .from("posts")
        .select("*")
        .eq("is_published", true)
        .order("sort_order")
        .order("published_at", { ascending: false }),
      supabasePublic
        .from("testimonials")
        .select("*")
        .eq("is_published", true)
        .order("sort_order"),
      supabasePublic.from("faqs").select("*").eq("is_published", true).order("sort_order"),
      supabasePublic
        .from("sustainability_points")
        .select("*")
        .eq("is_published", true)
        .order("sort_order"),
    ]);

    const s: any = settingsRes.data;
    const fb = fallbackContent;

    const settings: SiteContent["settings"] = s
      ? {
          brandName: str(s.brand_name, fb.settings.brandName),
          tagline: str(s.tagline, fb.settings.tagline),
          shortAbout: str(s.short_about, fb.settings.shortAbout),
          aboutIntro: str(s.about_intro, fb.settings.aboutIntro),
          aboutBody: str(s.about_body, fb.settings.aboutBody),
          mission: str(s.mission, fb.settings.mission),
          vision: str(s.vision, fb.settings.vision),
          founderNote: str(s.founder_note, fb.settings.founderNote),
          founderName: str(s.founder_name, fb.settings.founderName),
          aboutImageUrl: s.about_image_url ?? null,
          aboutImage2Url: s.about_image_2_url ?? null,
          phone: str(s.phone, fb.settings.phone),
          phoneHref: str(s.phone_href, fb.settings.phoneHref),
          email: str(s.email, fb.settings.email),
          instagramUrl: str(s.instagram_url, fb.settings.instagramUrl),
          instagramHandle: str(s.instagram_handle, fb.settings.instagramHandle),
          linkedinUrl: str(s.linkedin_url, fb.settings.linkedinUrl),
          location: str(s.location, fb.settings.location),
          mapsUrl: str(s.maps_url, fb.settings.mapsUrl),
          hours: Array.isArray(s.hours) && s.hours.length ? s.hours : fb.settings.hours,
          shippingFlatCents: s.shipping_flat_cents ?? fb.settings.shippingFlatCents,
          freeShippingThresholdCents:
            s.free_shipping_threshold_cents ?? fb.settings.freeShippingThresholdCents,
          codEnabled: s.cod_enabled ?? true,
          bankTransferEnabled: s.bank_transfer_enabled ?? true,
          bankTransferNote: s.bank_transfer_note ?? "",
          values: Array.isArray(s.brand_values) && s.brand_values.length
            ? s.brand_values
            : fb.settings.values,
          timeline: Array.isArray(s.timeline) && s.timeline.length
            ? s.timeline
            : fb.settings.timeline,
          marqueeWords: Array.isArray(s.marquee_words) && s.marquee_words.length
            ? s.marquee_words
            : fb.settings.marqueeWords,
        }
      : fb.settings;

    // Section headings fall back key-by-key, so a blank row never wipes a title.
    const sections: Record<string, SectionCopy> = { ...fb.sections };
    for (const row of (sectionsRes.data ?? []) as any[]) {
      const base = fb.sections[row.key] ?? {
        eyebrow: "",
        title: "",
        accentWords: [],
        subtitle: "",
      };
      sections[row.key] = {
        eyebrow: str(row.eyebrow, base.eyebrow),
        title: str(row.title, base.title),
        accentWords: Array.isArray(row.accent_words)
          ? row.accent_words
          : base.accentWords,
        subtitle: str(row.subtitle, base.subtitle),
      };
    }

    const variantsByProduct = new Map<string, any[]>();
    for (const v of (variantsRes.data ?? []) as any[]) {
      const list = variantsByProduct.get(v.product_id) ?? [];
      list.push(v);
      variantsByProduct.set(v.product_id, list);
    }

    const imagesByProduct = new Map<string, string[]>();
    for (const img of (imagesRes.data ?? []) as any[]) {
      const list = imagesByProduct.get(img.product_id) ?? [];
      list.push(img.url);
      imagesByProduct.set(img.product_id, list);
    }

    const products = (productsRes.data ?? []).map((p: any) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      collection: p.collection ?? "",
      description: p.description ?? "",
      detail: p.detail ?? "",
      materials: Array.isArray(p.materials) ? p.materials : [],
      art: asArt(p.art_variant),
      image: p.image_url ?? "",
      images: imagesByProduct.get(p.id) ?? [],
      care: p.care ?? "",
      sku: p.sku ?? "",
      priceCents: p.price_cents ?? 0,
      compareAtPriceCents: p.compare_at_price_cents ?? null,
      currency: p.currency ?? "INR",
      stock: p.stock ?? 0,
      trackInventory: p.track_inventory ?? true,
      variants: (variantsByProduct.get(p.id) ?? []).map((v: any) => ({
        id: v.id,
        size: v.size ?? "",
        color: v.color ?? "",
        sku: v.sku ?? "",
        priceCents: v.price_cents ?? p.price_cents ?? 0,
        stock: v.stock ?? 0,
      })),
    }));

    const capsules = (capsulesRes.data ?? []).map((c: any) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      kicker: c.kicker ?? "",
      body: c.body ?? "",
      art: asArt(c.art_variant),
      image: c.image_url ?? "",
    }));

    const categories = (categoriesRes.data ?? []).map((c: any) => ({
      id: c.id,
      title: c.title,
      body: c.body ?? "",
      art: asArt(c.art_variant),
      image: c.image_url ?? "",
    }));

    const gallery = (galleryRes.data ?? []).map((g: any) => ({
      id: g.id,
      caption: g.caption ?? "",
      size: (["square", "tall", "wide"].includes(g.size) ? g.size : "square") as
        | "square"
        | "tall"
        | "wide",
      art: asArt(g.art_variant),
      image: g.image_url ?? "",
    }));

    const posts = (postsRes.data ?? []).map((p: any) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt ?? "",
      category: p.category ?? "",
      date: p.published_at,
      readingTime: p.reading_time ?? "",
      art: asArt(p.art_variant),
      image: p.image_url ?? "",
      body: (Array.isArray(p.body) ? p.body : []) as Block[],
    }));

    const testimonials = (testimonialsRes.data ?? []).map((t: any) => ({
      id: t.id,
      name: t.name,
      place: t.place ?? "",
      quote: t.quote,
    }));

    const faqs = (faqsRes.data ?? []).map((f: any) => ({
      id: f.id,
      q: f.question,
      a: f.answer,
    }));

    const sustainabilityPoints = (sustainabilityRes.data ?? []).map((s2: any) => ({
      id: s2.id,
      title: s2.title,
      body: s2.body ?? "",
    }));

    // An empty table means "not seeded yet" rather than "intentionally blank",
    // so each collection keeps its bundled default until real rows exist.
    return {
      live: true,
      settings,
      sections,
      products: products.length ? products : fb.products,
      capsules: capsules.length ? capsules : fb.capsules,
      categories: categories.length ? categories : fb.categories,
      gallery: gallery.length ? gallery : fb.gallery,
      posts: posts.length ? posts : fb.posts,
      testimonials: testimonials.length ? testimonials : fb.testimonials,
      faqs: faqs.length ? faqs : fb.faqs,
      sustainability: sustainabilityPoints.length
        ? sustainabilityPoints
        : fb.sustainability,
    };
  } catch (error) {
    // Never fail the page on a backend hiccup, but do not fail quietly either.
    console.error(
      "[sowcha] Content query failed — serving the bundled catalogue instead:",
      error
    );
    return fallbackContent;
  }
}

/**
 * Cached read used by every public page. Revalidated on the CONTENT_TAG the
 * moment an admin saves, so edits appear immediately rather than after a TTL.
 */
export const getSiteContent = unstable_cache(fetchContent, ["site-content"], {
  tags: [CONTENT_TAG],
  revalidate: 300,
});
