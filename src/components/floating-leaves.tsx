"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn, seeded } from "@/lib/utils";

const Leaf = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 60 90" className={cn("h-full w-full", className)} aria-hidden>
    <path
      d="M30 88 C 6 60 0 28 12 4 C 40 12 58 40 52 64 C 48 78 40 84 30 88 Z"
      fill="rgb(var(--primary) / 0.10)"
      stroke="rgb(var(--primary) / 0.32)"
      strokeWidth="1"
    />
    <path d="M30 88 C 26 60 24 30 14 6" fill="none" stroke="rgb(var(--primary) / 0.30)" strokeWidth="0.9" />
    <path d="M27 62 L 46 56 M26 46 L 42 36 M22 30 L 34 18" stroke="rgb(var(--primary) / 0.22)" strokeWidth="0.7" />
  </svg>
);

const Petal = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 60 60" className={cn("h-full w-full", className)} aria-hidden>
    <path
      d="M30 4 C 52 14 56 42 30 56 C 4 42 8 14 30 4 Z"
      fill="rgb(var(--accent) / 0.16)"
      stroke="rgb(var(--accent) / 0.42)"
      strokeWidth="1"
    />
  </svg>
);

/**
 * Ambient botanicals. Positions are seeded so server and client agree, and the
 * whole layer is inert to pointer events.
 */
export function FloatingLeaves({
  count = 9,
  className,
}: {
  count?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {Array.from({ length: count }).map((_, i) => {
        // Rounded so the server-rendered style string and the value framer-motion
        // writes on the client serialise identically (no hydration mismatch).
        const round = (n: number) => Math.round(n * 100) / 100;
        const left = round(seeded(i + 1) * 100);
        const top = round(seeded(i + 21) * 100);
        const size = round(26 + seeded(i + 41) * 62);
        const rotate = round(seeded(i + 61) * 360);
        const dur = 12 + seeded(i + 81) * 12;
        const isPetal = i % 3 === 0;

        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: round(size * (isPetal ? 1 : 1.5)),
              rotate,
              opacity: round(0.3 + seeded(i + 101) * 0.35),
            }}
            animate={
              reduce
                ? undefined
                : {
                    y: [0, -26 - seeded(i + 121) * 26, 0],
                    x: [0, 12 - seeded(i + 141) * 24, 0],
                    rotate: [rotate, rotate + 14, rotate],
                  }
            }
            transition={{
              duration: dur,
              repeat: Infinity,
              ease: "easeInOut",
              delay: seeded(i + 161) * 6,
            }}
          >
            {isPetal ? <Petal /> : <Leaf />}
          </motion.div>
        );
      })}
    </div>
  );
}
