"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Capsule, SectionCopy } from "@/lib/content-types";
import { ImageFrame } from "@/components/image-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tilt } from "@/components/ui/tilt";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

function Row({ item, index }: { item: Capsule; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useSpring(useTransform(scrollYProgress, [0, 1], [40, -40]), {
    stiffness: 60,
    damping: 20,
  });
  const flipped = index % 2 === 1;

  return (
    <div
      ref={ref}
      className={cn(
        "grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
        flipped && "lg:[&>*:first-child]:order-2"
      )}
    >
      <Tilt intensity={5} lift={8} className="w-full">
        <motion.div
          style={{ y: imgY }}
          className="relative aspect-[5/6] overflow-hidden rounded-[36px] border border-border bg-card shadow-lift sm:aspect-[4/3] lg:aspect-[5/6]"
        >
          <ImageFrame
            src={item.image}
            alt={item.title}
            art={item.art}
            seed={index + 50}
            sizes="(max-width: 1024px) 92vw, 46vw"
            imgClassName="scale-[1.06]"
          />
          <span className="glass absolute left-5 top-5 rounded-full px-3.5 py-1.5 text-[10px] uppercase tracking-luxe">
            {item.kicker}
          </span>
        </motion.div>
      </Tilt>

      <div className={cn(flipped && "lg:order-1")}>
        <motion.h3
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 1, ease }}
          className="font-serif text-[clamp(2rem,4vw,3rem)] font-light leading-[1.1]"
        >
          {item.title}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 1, ease, delay: 0.1 }}
          className="mt-5 max-w-[46ch] text-[15px] leading-[1.95] text-muted pretty"
        >
          {item.body}
        </motion.p>
        <motion.a
          href="#gallery"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="group mt-8 inline-flex items-center gap-2 text-[13px] tracking-wideish text-foreground"
        >
          See the capsule
          <ArrowRight
            className="h-4 w-4 transition-transform duration-500 ease-silk group-hover:translate-x-1.5"
            strokeWidth={1.4}
          />
        </motion.a>
      </div>
    </div>
  );
}

export function Collections({
  capsules,
  copy,
}: {
  capsules: Capsule[];
  copy: SectionCopy;
}) {
  return (
    <section className="relative bg-card/35 py-28 sm:py-36">
      <div className="container">
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={copy.title}
          accentWords={copy.accentWords}
          subtitle={copy.subtitle}
        />

        <div className="mt-20 space-y-24 lg:space-y-32">
          {capsules.map((item, i) => (
            <Row key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
