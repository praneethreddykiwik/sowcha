"use client";

import { motion, useReducedMotion } from "framer-motion";

const words = [
  "Nature inspired",
  "Hand finished",
  "Plant dyed",
  "Made in small batches",
  "Luxury in simplicity",
  "Repairs, free for three years",
];

/** A slow horizontal whisper between sections. */
export function Marquee() {
  const reduce = useReducedMotion();
  const line = [...words, ...words];

  return (
    <div className="relative overflow-hidden border-y border-border bg-card/40 py-6">
      <motion.div
        className="flex w-max items-center gap-12 whitespace-nowrap"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 44, repeat: Infinity, ease: "linear" }}
      >
        {line.map((word, i) => (
          <span key={`${word}-${i}`} className="flex items-center gap-12">
            <span className="font-serif text-[22px] font-light italic text-foreground/70 sm:text-[26px]">
              {word}
            </span>
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          </span>
        ))}
      </motion.div>

      {/* edge fades */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent"
      />
    </div>
  );
}
