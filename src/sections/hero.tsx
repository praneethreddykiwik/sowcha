"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import type { Settings } from "@/lib/content-types";
import { Butterfly } from "@/components/butterfly";
import { FloatingLeaves } from "@/components/floating-leaves";
import { LinkButton } from "@/components/ui/button";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero({ settings }: { settings: Settings }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const emblemY = useTransform(scrollYProgress, [0, 1], [0, 240]);

  // pointer parallax for the emblem
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const spring = { stiffness: 80, damping: 20 };
  const rotY = useSpring(useTransform(mx, [0, 1], [14, -14]), spring);
  const rotX = useSpring(useTransform(my, [0, 1], [-10, 10]), spring);

  const words = settings.tagline.split(" ");

  return (
    <section
      id="home"
      ref={ref}
      onPointerMove={(e) => {
        if (reduce) return;
        mx.set(e.clientX / window.innerWidth);
        my.set(e.clientY / window.innerHeight);
      }}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pb-28 pt-28"
    >
      {/* background wash */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgb(var(--card)) 0%, rgb(var(--bg)) 45%, rgb(var(--primary)/0.10) 100%)",
        }}
      />
      <FloatingLeaves count={10} />

      {/* very slow drifting blobs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-24 h-[420px] w-[420px] rounded-full blur-3xl"
        style={{ background: "rgb(var(--primary) / 0.14)" }}
        animate={reduce ? undefined : { x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-[380px] w-[380px] rounded-full blur-3xl"
        style={{ background: "rgb(var(--accent) / 0.22)" }}
        animate={reduce ? undefined : { x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        style={{ y, opacity: fade }}
        className="container relative z-10 flex flex-col items-center text-center"
      >
        {/* emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.82, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.6, ease }}
          className="scene"
          style={{ perspective: 1200 }}
        >
          <motion.div
            style={{
              rotateX: reduce ? 0 : rotX,
              rotateY: reduce ? 0 : rotY,
              y: emblemY,
              transformStyle: "preserve-3d",
            }}
            className="relative"
          >
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
              style={{ background: "rgb(var(--accent) / 0.28)" }}
            />
            <Butterfly className="relative h-32 w-32 sm:h-40 sm:w-40" strokeWidth={2} />
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.5 }}
          className="eyebrow mt-9"
        >
          {settings.brandName} · Est. 2021 · Hyderabad
        </motion.p>

        <h1 className="mt-5 font-serif text-[clamp(2.9rem,9vw,7rem)] font-light leading-[0.98] tracking-[-0.02em]">
          {words.map((w, i) => (
            <motion.span
              key={w}
              initial={{ opacity: 0, y: 46, rotateX: -55 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1.4, ease, delay: 0.55 + i * 0.12 }}
              className={i === words.length - 1 ? "inline-block italic text-ink" : "inline-block"}
              style={{ transformStyle: "preserve-3d" }}
            >
              {w}
              {i < words.length - 1 && " "}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 1.05 }}
          className="mt-7 max-w-[48ch] text-[15px] leading-[1.9] text-muted pretty"
        >
          {settings.shortAbout}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 1.25 }}
          className="mt-11 flex flex-col items-center gap-3 sm:flex-row"
        >
          <LinkButton href="#collection" size="lg">
            Explore Collection
          </LinkButton>
          <LinkButton href="#about" variant="outline" size="lg">
            Discover More
          </LinkButton>
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.a
        href="#about"
        aria-label="Scroll to about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
        style={{ opacity: fade }}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 text-muted transition-colors duration-500 hover:text-ink md:block"
      >
        <motion.span
          className="flex flex-col items-center gap-2"
          animate={reduce ? undefined : { y: [0, 9, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-[10px] uppercase tracking-luxe">Scroll</span>
          <ArrowDown className="h-4 w-4" strokeWidth={1.2} />
        </motion.span>
      </motion.a>
    </section>
  );
}
