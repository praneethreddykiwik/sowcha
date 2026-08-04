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

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <Featured />
      <Atelier />
      <Collections />
      <Sustainability />
      <Gallery />
      <JournalPreview />
      <Faq />
      <Contact />
    </>
  );
}
