"use client";

import { motion } from "framer-motion";
import { Leaf, Recycle, Sprout, Wind } from "lucide-react";
import type {
  SectionCopy,
  SustainabilityPoint,
  Testimonial,
} from "@/lib/content-types";
import { SectionHeading } from "@/components/ui/section-heading";
import { FloatingLeaves } from "@/components/floating-leaves";

const ease = [0.16, 1, 0.3, 1] as const;
const icons = [Leaf, Sprout, Recycle, Wind];

export function Sustainability({
  points,
  testimonials,
  copy,
}: {
  points: SustainabilityPoint[];
  testimonials: Testimonial[];
  copy: SectionCopy;
}) {
  return (
    <section className="relative overflow-hidden bg-card/35 py-28 sm:py-36">
      <FloatingLeaves count={6} className="opacity-50" />

      <div className="container relative">
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={copy.title}
          accentWords={copy.accentWords}
          subtitle={copy.subtitle}
        />

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 34, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1, ease, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                style={{ transformStyle: "preserve-3d" }}
                className="rounded-[28px] border border-border bg-card p-7 shadow-soft transition-shadow duration-700 hover:shadow-lift"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-ink">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.4} />
                </span>
                <h3 className="mt-5 font-serif text-[21px] font-light">{item.title}</h3>
                <p className="mt-2 text-[13.5px] leading-[1.8] text-muted pretty">
                  {item.body}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* testimonials */}
        <div className="mt-28">
          <div className="rule" />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.figure
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1, ease, delay: i * 0.1 }}
                className="glass flex h-full flex-col rounded-[28px] p-8 shadow-soft"
              >
                <span className="font-serif text-[40px] leading-none text-accent">“</span>
                <blockquote className="mt-2 flex-1 text-[14.5px] leading-[1.9] text-foreground/85 pretty">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/12 font-serif text-[15px] text-ink">
                    {t.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-[13.5px]">{t.name}</span>
                    <span className="block text-[11.5px] uppercase tracking-wideish text-muted">
                      {t.place}
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
