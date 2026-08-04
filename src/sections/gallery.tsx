"use client";

import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { gallery } from "@/config/gallery";
import { brand } from "@/config/brand";
import { ImageFrame } from "@/components/image-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

const spanFor = (size: string) =>
  size === "tall"
    ? "row-span-2 aspect-[3/4] sm:aspect-auto"
    : size === "wide"
      ? "sm:col-span-2 aspect-[16/10]"
      : "aspect-square";

export function Gallery() {
  return (
    <section id="gallery" className="relative py-28 sm:py-36">
      <div className="container">
        <SectionHeading
          eyebrow="Gallery"
          title="From the cutting room"
          accentWords={["cutting"]}
          subtitle="Unstyled, unedited, mostly taken on a phone between two other things."
        />

        <div className="mt-16 grid auto-rows-[minmax(180px,auto)] grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {gallery.map((item, i) => (
            <motion.figure
              key={item.id}
              initial={{ opacity: 0, y: 34, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 1, ease, delay: (i % 4) * 0.07 }}
              className={cn(
                "group relative overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-shadow duration-700 hover:shadow-lift",
                spanFor(item.size)
              )}
            >
              <ImageFrame
                src={item.image}
                alt={item.caption}
                art={item.art}
                seed={i + 70}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                imgClassName="group-hover:scale-[1.07]"
                className="[&>svg]:transition-transform [&>svg]:duration-1200 [&>svg]:ease-silk group-hover:[&>svg]:scale-[1.07]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/45 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-3 p-4 text-[12px] tracking-wideish text-white opacity-0 transition-all duration-600 ease-silk group-hover:translate-y-0 group-hover:opacity-100">
                {item.caption}
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <LinkButton
            href={brand.contact.instagram}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            size="lg"
          >
            <Instagram className="h-4 w-4" strokeWidth={1.4} />
            Follow {brand.contact.instagramHandle}
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
