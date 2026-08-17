import { getSiteContent } from "@/lib/content";
import { siteUrl } from "@/config/site";
import { Hero } from "@/sections/hero";
import { Marquee } from "@/sections/marquee";
import { About } from "@/sections/about";
import { Featured } from "@/sections/featured";
import { Atelier } from "@/sections/atelier";
import { Collections } from "@/sections/collections";
import { Sustainability } from "@/sections/sustainability";
import { Gallery } from "@/sections/gallery";
import { JournalPreview } from "@/sections/journal-preview";
import { Faq } from "@/sections/faq";
import { Contact } from "@/sections/contact";

export default async function HomePage() {
  const content = await getSiteContent();

  // Organization + WebSite + the product list, so search engines can render
  // rich results instead of a plain blue link.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: content.settings.brandName,
        url: siteUrl,
        description: content.settings.shortAbout,
        email: content.settings.email,
        telephone: content.settings.phone,
        sameAs: [content.settings.instagramUrl, content.settings.linkedinUrl].filter(Boolean),
        address: {
          "@type": "PostalAddress",
          streetAddress: content.settings.location,
          addressCountry: "IN",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: content.settings.brandName,
        publisher: { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type": "ItemList",
        name: "Featured collection",
        itemListElement: content.products
          .filter((p) => p.priceCents > 0)
          .map((product, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Product",
              name: product.name,
              description: product.description,
              sku: product.sku || undefined,
              image: product.image || undefined,
              brand: { "@type": "Brand", name: content.settings.brandName },
              offers: {
                "@type": "Offer",
                price: (product.priceCents / 100).toFixed(2),
                priceCurrency: product.currency,
                availability:
                  product.variants.some((v) => v.stock > 0) || product.stock > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
              },
            },
          })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero settings={content.settings} />
      <Marquee words={content.settings.marqueeWords} />
      <About
        settings={content.settings}
        copy={content.sections.about}
      />
      <Featured
        products={content.products}
        categories={content.categories}
        copy={content.sections.featured}
      />
      <Atelier copy={content.sections.atelier} />
      <Collections capsules={content.capsules} copy={content.sections.capsules} />
      <Sustainability
        points={content.sustainability}
        testimonials={content.testimonials}
        copy={content.sections.sustainability}
      />
      <Gallery
        items={content.gallery}
        copy={content.sections.gallery}
        instagramUrl={content.settings.instagramUrl}
        instagramHandle={content.settings.instagramHandle}
      />
      <JournalPreview posts={content.posts} copy={content.sections.journal} />
      <Faq faqs={content.faqs} copy={content.sections.faq} />
      <Contact settings={content.settings} copy={content.sections.contact} />
    </>
  );
}
