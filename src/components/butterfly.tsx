"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * The SowCha emblem. Wings are separate groups rotated on the Y axis so the
 * flutter reads as depth rather than a flat squash.
 */
export function Butterfly({
  className,
  flutter = true,
  strokeWidth = 1.6,
}: {
  className?: string;
  flutter?: boolean;
  strokeWidth?: number;
}) {
  const reduce = useReducedMotion();
  const on = flutter && !reduce;

  const wing = (dir: 1 | -1) => ({
    animate: on
      ? { rotateY: [0, dir * 26, 0], scaleX: [1, 0.94, 1] }
      : { rotateY: 0 },
    transition: {
      duration: 6.5,
      repeat: Infinity,
      ease: [0.45, 0, 0.55, 1] as const,
      delay: dir === 1 ? 0 : 0.12,
    },
  });

  return (
    <svg
      viewBox="-160 -170 320 330"
      className={cn("overflow-visible", className)}
      role="img"
      aria-label="SowCha butterfly emblem"
    >
      <defs>
        <linearGradient id="sc-wing-l" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(var(--primary))" />
          <stop offset="100%" stopColor="rgb(var(--accent))" />
        </linearGradient>
        <linearGradient id="sc-wing-r" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgb(var(--primary))" />
          <stop offset="100%" stopColor="rgb(var(--accent))" />
        </linearGradient>
      </defs>

      <g style={{ transformStyle: "preserve-3d" }}>
        {/* left wings */}
        <motion.g
          style={{ originX: "50%", transformOrigin: "0px 0px", transformStyle: "preserve-3d" }}
          {...wing(1)}
        >
          <path
            d="M-6 -46 C -74 -134 -176 -112 -156 -32 C -143 20 -72 30 -8 -4 Z"
            fill="url(#sc-wing-l)"
            fillOpacity="0.30"
            stroke="url(#sc-wing-l)"
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          <path
            d="M-8 6 C -70 24 -122 82 -84 124 C -48 162 -14 110 -6 42 Z"
            fill="url(#sc-wing-l)"
            fillOpacity="0.22"
            stroke="url(#sc-wing-l)"
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          <path
            d="M-40 -60 C -70 -60 -96 -46 -108 -22"
            fill="none"
            stroke="rgb(var(--accent))"
            strokeWidth="1"
            opacity="0.8"
          />
        </motion.g>

        {/* right wings */}
        <motion.g
          style={{ transformOrigin: "0px 0px", transformStyle: "preserve-3d" }}
          {...wing(-1)}
        >
          <path
            d="M6 -46 C 74 -134 176 -112 156 -32 C 143 20 72 30 8 -4 Z"
            fill="url(#sc-wing-r)"
            fillOpacity="0.30"
            stroke="url(#sc-wing-r)"
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          <path
            d="M8 6 C 70 24 122 82 84 124 C 48 162 14 110 6 42 Z"
            fill="url(#sc-wing-r)"
            fillOpacity="0.22"
            stroke="url(#sc-wing-r)"
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          <path
            d="M40 -60 C 70 -60 96 -46 108 -22"
            fill="none"
            stroke="rgb(var(--accent))"
            strokeWidth="1"
            opacity="0.8"
          />
        </motion.g>

        {/* body + antennae */}
        <path
          d="M0 -58 C 9 -22 9 44 0 104"
          stroke="rgb(var(--primary))"
          strokeWidth={strokeWidth * 3}
          strokeLinecap="round"
          fill="none"
        />
        <motion.g
          animate={on ? { rotate: [0, 2.5, 0] } : undefined}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M-2 -60 C -22 -92 -42 -108 -60 -114" fill="none" stroke="rgb(var(--primary))" strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M2 -60 C 22 -92 42 -108 60 -114" fill="none" stroke="rgb(var(--primary))" strokeWidth={strokeWidth} strokeLinecap="round" />
          <circle cx="-60" cy="-114" r="4" fill="rgb(var(--accent))" />
          <circle cx="60" cy="-114" r="4" fill="rgb(var(--accent))" />
        </motion.g>
      </g>
    </svg>
  );
}

/** Small lockup: emblem + wordmark, used in the navbar and footer. */
export function Wordmark({
  className,
  showEmblem = true,
}: {
  className?: string;
  showEmblem?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {showEmblem && <Butterfly className="h-7 w-7" strokeWidth={2.4} />}
      <span className="font-serif text-[26px] font-medium leading-none tracking-[-0.01em]">
        Sow<span className="italic text-ink">Cha</span>
      </span>
    </span>
  );
}
