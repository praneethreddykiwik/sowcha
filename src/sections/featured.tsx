"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { categories, products, type Product } from "@/config/products";
import { ProductCard } from "@/components/product-card";
import { BotanicalArt } from "@/components/botanical-art";
import { ImageFrame } from "@/components/image-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Tilt } from "@/components/ui/tilt";

const ease = [0.16, 1, 0.3, 1] as const;

export function Featured() {
  const [active, setActive] = useState<Product | null>(null);

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <section id="collection" className="relative py-28 sm:py-36">
      <div className="container">
        <SectionHeading
          eyebrow="Featured Collection"
          title="Pieces we are quietly proud of"
          accentWords={["quietly"]}
          subtitle="A lookbook, not a shop. Everything here exists — write to us and we will tell you what is currently on the rail."
        />

        {/* categories */}
        <RevealGroup className="mt-16 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <RevealItem key={cat.title}>
              <Tilt intensity={8} lift={5}>
                <div className="group relative aspect-[5/4] overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-shadow duration-700 hover:shadow-lift">
                  <BotanicalArt
                    variant={cat.art}
                    seed={i + 30}
                    className="absolute inset-0 transition-transform duration-1200 ease-silk group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/35 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="glass rounded-2xl px-4 py-3">
                      <h3 className="font-serif text-[19px] font-light leading-none">
                        {cat.title}
                      </h3>
                      <p className="mt-1.5 text-[12px] text-muted">{cat.body}</p>
                    </div>
                  </div>
                </div>
              </Tilt>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* products */}
        <RevealGroup
          className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6"
          stagger={0.08}
        >
          {products.map((product, i) => (
            <RevealItem key={product.slug} className="h-full">
              <ProductCard product={product} index={i} onQuickView={setActive} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      {/* quick view */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={`${active.name} details`}
          >
            <div
              className="absolute inset-0 bg-foreground/25 backdrop-blur-md"
              onClick={() => setActive(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96, rotateX: 8 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.7, ease }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative grid max-h-[88vh] w-full max-w-3xl overflow-hidden rounded-[32px] border border-border bg-card shadow-lift sm:grid-cols-2"
            >
              <div className="relative aspect-[4/5] sm:aspect-auto">
                <ImageFrame
                  src={active.image}
                  alt={active.name}
                  art={active.art}
                  seed={9}
                  sizes="(max-width: 640px) 100vw, 40vw"
                />
              </div>

              <div className="flex flex-col overflow-y-auto p-8 sm:p-10">
                <span className="eyebrow">{active.collection}</span>
                <h3 className="mt-3 font-serif text-[32px] font-light leading-tight">
                  {active.name}
                </h3>
                <p className="mt-4 text-[14.5px] leading-[1.9] text-muted pretty">
                  {active.detail}
                </p>

                <h4 className="eyebrow mt-8">Materials</h4>
                <ul className="mt-3 space-y-2">
                  {active.materials.map((m) => (
                    <li
                      key={m}
                      className="flex items-center gap-2.5 text-[14px] text-foreground/85"
                    >
                      <span className="h-1 w-1 rounded-full bg-accent" />
                      {m}
                    </li>
                  ))}
                </ul>

                <p className="mt-auto pt-8 text-[12px] leading-relaxed text-muted">
                  Displayed for reference. Availability is confirmed by appointment.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Close"
                className="glass absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors duration-400 hover:text-ink"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
