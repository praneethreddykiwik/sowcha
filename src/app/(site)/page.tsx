import { getSiteContent } from "@/lib/content";
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

  return (
    <>
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
