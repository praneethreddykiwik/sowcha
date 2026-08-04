"use client";

import { motion } from "framer-motion";
import { AnimatedDress } from "@/components/animated-dress";
import { FloatingLeaves } from "@/components/floating-leaves";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { LinkButton } from "@/components/ui/button";

const ease = [0.16, 1, 0.3, 1] as const;

/** Notes pinned around the drawing, each at its own depth. */
const specs = [
  {
    label: "Cloth",
    value: "Cotton mul, 12 metres",
    note: "Light enough to read a page through.",
    className: "left-0 top-[14%] text-left",
  },
  {
    label: "Pleats",
    value: "Knife folds, 9mm",
    note: "Pressed once, then never again.",
    className: "right-0 top-[34%] text-right",
  },
  {
    label: "Vine",
    value: "Painted freehand",
    note: "Which is why no two land alike.",
    className: "left-0 bottom-[22%] text-left",
  },
  {
    label: "Dupatta",
    value: "Scalloped chiffon",
    note: "Edge run by hand, not machine.",
    className: "right-0 bottom-[8%] text-right",
  },
];

export function Atelier() {
  return (
    <section id="atelier" className="relative overflow-hidden py-28 sm:py-36">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 60% at 50% 40%, rgb(var(--card)) 0%, rgb(var(--bg)) 60%, rgb(var(--primary)/0.08) 100%)",
        }}
      />
      <FloatingLeaves count={7} className="opacity-60" />

      <div className="container relative">
        <SectionHeading
          eyebrow="Product Spotlight"
          title="The Rosewater Anarkali"
          accentWords={["Anarkali"]}
          subtitle="Drawn rather than photographed — move your cursor across it and the dupatta, the skirt and the painted vine part company, exactly as they do on a hanger."
        />

        <div className="relative mt-16 lg:mt-24">
          {/* the piece */}
          <div className="mx-auto w-full max-w-[520px] lg:max-w-[560px]">
            <AnimatedDress />
          </div>

          {/* pinned specs — absolute on large screens, stacked on mobile */}
          <div className="pointer-events-none absolute inset-0 hidden lg:block">
            {specs.map((spec, i) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.1, ease, delay: 0.5 + i * 0.18 }}
                className={`absolute w-[220px] ${spec.className}`}
              >
                <span className="eyebrow">{spec.label}</span>
                <p className="mt-2 font-serif text-[21px] font-light leading-snug">
                  {spec.value}
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted pretty">
                  {spec.note}
                </p>
                <span
                  aria-hidden
                  className={`mt-4 block h-px w-16 bg-accent ${
                    spec.className.includes("right-0") ? "ml-auto" : ""
                  }`}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* mobile spec list */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:hidden">
          {specs.map((spec) => (
            <Reveal key={spec.label} variant="up">
              <span className="eyebrow">{spec.label}</span>
              <p className="mt-2 font-serif text-[20px] font-light">{spec.value}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted pretty">
                {spec.note}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 flex justify-center" delay={0.2}>
          <LinkButton href="/journal/the-anatomy-of-a-good-anarkali" variant="outline" size="lg">
            Read how it is made
          </LinkButton>
        </Reveal>
      </div>
    </section>
  );
}
