"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

const variants: Record<string, Variants> = {
  up: {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0 },
  },
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  },
  left: {
    hidden: { opacity: 0, x: -32 },
    show: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 32 },
    show: { opacity: 1, x: 0 },
  },
  /** A 3D card that settles in from below with a slight tilt. */
  card: {
    hidden: { opacity: 0, y: 40, rotateX: 8, scale: 0.97 },
    show: { opacity: 1, y: 0, rotateX: 0, scale: 1 },
  },
};

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 1,
  variant = "up",
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: keyof typeof variants;
  once?: boolean;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-90px" }}
      variants={variants[variant]}
      transition={{ duration, ease, delay }}
      className={cn(className)}
      style={variant === "card" ? { transformStyle: "preserve-3d" } : undefined}
    >
      {children}
    </motion.div>
  );
}

/** Staggers direct children that use the `Reveal.Item` variants. */
export function RevealGroup({
  children,
  className,
  stagger = 0.09,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  variant = "card",
}: {
  children: ReactNode;
  className?: string;
  variant?: keyof typeof variants;
}) {
  return (
    <motion.div
      variants={variants[variant]}
      transition={{ duration: 1, ease }}
      className={cn(className)}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}
