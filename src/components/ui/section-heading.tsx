"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  /** Words to italicise inside the title, matched case-insensitively. */
  accentWords?: string[];
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
};

const ease = [0.16, 1, 0.3, 1] as const;

export function SectionHeading({
  eyebrow,
  title,
  accentWords = [],
  subtitle,
  align = "center",
  className,
}: Props) {
  const words = title.split(" ");
  const accented = new Set(accentWords.map((w) => w.toLowerCase()));

  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="flex items-center gap-3"
        >
          <span className="h-px w-8 bg-accent" />
          <span className="eyebrow">{eyebrow}</span>
          <span className="h-px w-8 bg-accent" />
        </motion.div>
      )}

      <h2
        className={cn(
          "max-w-3xl font-serif text-[clamp(2rem,5vw,3.6rem)] font-light leading-[1.08] tracking-[-0.01em] balance",
          align === "center" && "mx-auto"
        )}
      >
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            initial={{ opacity: 0, y: 24, rotateX: -35 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.9, ease, delay: 0.05 * i }}
            className={cn(
              "inline-block will-change-transform",
              accented.has(word.toLowerCase().replace(/[^a-z]/g, "")) &&
                "font-normal italic text-ink"
            )}
            style={{ transformStyle: "preserve-3d" }}
          >
            {word}
            {i < words.length - 1 && " "}
          </motion.span>
        ))}
      </h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.9, ease, delay: 0.15 }}
          className={cn(
            "max-w-[46ch] text-[15px] leading-[1.85] text-muted pretty",
            align === "center" && "mx-auto"
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
