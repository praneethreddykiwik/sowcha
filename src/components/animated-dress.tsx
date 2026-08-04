"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn, seeded } from "@/lib/utils";

/**
 * The Rosewater Anarkali, drawn rather than photographed.
 *
 * Built as seven stacked SVG layers, each pushed to its own Z depth inside a
 * shared perspective, so pointer movement produces genuine parallax between the
 * dupatta, the skirt and the embroidery instead of a flat tilt. Everything is
 * painted from theme tokens, so the piece re-dyes itself when the theme changes.
 */

const VB = "0 0 600 840";
const ease = [0.16, 1, 0.3, 1] as const;

/* ---------- shared geometry ---------- */

const BODY_PATH =
  "M300 116 C 266 118 244 129 234 146 L 222 202 C 206 302 166 522 118 764 Q 300 796 482 764 C 434 522 394 302 378 202 L 366 146 C 356 129 334 118 300 116 Z";

const SLEEVE_L =
  "M234 146 C 198 170 180 228 172 302 C 166 358 164 398 166 430 L 212 436 C 212 394 216 346 224 298 C 232 242 240 192 252 166 Z";

const SLEEVE_R =
  "M366 146 C 402 170 420 228 428 302 C 434 358 436 398 434 430 L 388 436 C 388 394 384 346 376 298 C 368 242 360 192 348 166 Z";

const DUPATTA_PATH =
  "M368 132 C 428 160 470 236 496 340 C 524 456 544 622 560 776 L 470 790 C 452 626 428 474 402 366 C 382 280 370 204 368 132 Z";

function Layer({
  z,
  children,
  className,
  style,
}: {
  z: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn("absolute inset-0", className)}
      style={{ transform: `translateZ(${z}px)`, transformStyle: "preserve-3d", ...style }}
    >
      {children}
    </div>
  );
}

const Svg = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <svg viewBox={VB} className={cn("h-full w-full", className)} aria-hidden focusable="false">
    {children}
  </svg>
);

/* ---------- the piece ---------- */

export function AnimatedDress({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 90, damping: 22, mass: 0.8 };

  const rotateY = useSpring(useTransform(px, [0, 1], [11, -11]), spring);
  const rotateX = useSpring(useTransform(py, [0, 1], [-7, 7]), spring);

  // Slow drift as the section passes through the viewport.
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "end start"],
  });
  const driftY = useSpring(useTransform(scrollYProgress, [0, 1], [42, -42]), {
    stiffness: 60,
    damping: 20,
  });

  return (
    <div
      ref={wrapRef}
      className={cn("relative select-none", className)}
      style={{ perspective: 1500, perspectiveOrigin: "50% 38%" }}
      onPointerMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
    >
      <motion.div
        style={{
          rotateX: reduce ? 0 : rotateX,
          rotateY: reduce ? 0 : rotateY,
          y: reduce ? 0 : driftY,
          transformStyle: "preserve-3d",
        }}
        className="relative aspect-[600/840] w-full"
      >
        {/* 1 — halo + shadow, furthest back */}
        <Layer z={-90}>
          <Svg>
            <defs>
              <radialGradient id="dz-halo" cx="0.5" cy="0.38" r="0.62">
                <stop offset="0%" stopColor="rgb(var(--primary) / 0.26)" />
                <stop offset="60%" stopColor="rgb(var(--accent) / 0.14)" />
                <stop offset="100%" stopColor="rgb(var(--accent) / 0)" />
              </radialGradient>
            </defs>
            <motion.circle
              cx="300"
              cy="330"
              r="300"
              fill="url(#dz-halo)"
              animate={reduce ? undefined : { r: [292, 312, 292], opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
            />
            <ellipse cx="300" cy="806" rx="196" ry="20" fill="rgb(var(--fg) / 0.07)" />
          </Svg>
        </Layer>

        {/* 2 — hanging rail + a hint of the room behind */}
        <Layer z={-60}>
          <Svg>
            <line x1="120" y1="72" x2="480" y2="72" stroke="rgb(var(--border))" strokeWidth="3" strokeLinecap="round" />
            <path d="M286 74 C 288 92 292 100 300 110 C 308 100 312 92 314 74" fill="none" stroke="rgb(var(--secondary))" strokeWidth="3" strokeLinecap="round" />
          </Svg>
        </Layer>

        {/* 3 — dupatta, swaying on its own axis behind the body */}
        <motion.div
          className="absolute inset-0"
          style={{ transform: "translateZ(-30px)", transformOrigin: "62% 16%", transformStyle: "preserve-3d" }}
          animate={reduce ? undefined : { rotate: [-1.4, 1.6, -1.4], skewX: [-0.6, 0.8, -0.6] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        >
          <Svg>
            <defs>
              <linearGradient id="dz-dup" x1="0.2" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgb(var(--primary) / 0.34)" />
                <stop offset="55%" stopColor="rgb(var(--primary) / 0.20)" />
                <stop offset="100%" stopColor="rgb(var(--accent) / 0.34)" />
              </linearGradient>
            </defs>
            <path d={DUPATTA_PATH} fill="url(#dz-dup)" stroke="rgb(var(--primary) / 0.34)" strokeWidth="1.2" />
            {/* chiffon folds */}
            <g fill="none" stroke="rgb(var(--card) / 0.55)" strokeWidth="1.1">
              <path d="M392 150 C 424 268 452 470 476 782" />
              <path d="M424 186 C 456 300 486 500 508 780" />
              <path d="M456 240 C 484 356 512 540 532 778" />
            </g>
            {/* hand-run scalloped edge */}
            <path
              d="M368 132 C 428 160 470 236 496 340 C 524 456 544 622 560 776"
              fill="none"
              stroke="rgb(var(--accent))"
              strokeWidth="2"
              strokeDasharray="1 9"
              strokeLinecap="round"
              opacity="0.85"
            />
          </Svg>
        </motion.div>

        {/* 4 — the garment itself */}
        <Layer z={0}>
          <Svg>
            <defs>
              <linearGradient id="dz-cloth" x1="0.12" y1="0" x2="0.9" y2="1">
                <stop offset="0%" stopColor="rgb(var(--primary) / 0.62)" />
                <stop offset="42%" stopColor="rgb(var(--primary) / 0.40)" />
                <stop offset="100%" stopColor="rgb(var(--accent) / 0.58)" />
              </linearGradient>
              <clipPath id="dz-clip">
                <path d={BODY_PATH} />
              </clipPath>
            </defs>

            <path d={SLEEVE_L} fill="rgb(var(--primary) / 0.38)" stroke="rgb(var(--primary) / 0.45)" strokeWidth="1.1" />
            <path d={SLEEVE_R} fill="rgb(var(--primary) / 0.38)" stroke="rgb(var(--primary) / 0.45)" strokeWidth="1.1" />

            {/* lace cuffs */}
            <g stroke="rgb(var(--card) / 0.8)" strokeWidth="1.4" fill="none">
              <path d="M167 412 L 212 418" />
              <path d="M166 428 L 212 434" />
              <path d="M433 412 L 388 418" />
              <path d="M434 428 L 388 434" />
            </g>

            <path d={BODY_PATH} fill="url(#dz-cloth)" stroke="rgb(var(--primary) / 0.42)" strokeWidth="1.2" />

            {/* woven shimmer, clipped to the silhouette */}
            <g clipPath="url(#dz-clip)">
              <defs>
                <linearGradient id="dz-sheen" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgb(255 255 255 / 0)" />
                  <stop offset="50%" stopColor="rgb(255 255 255 / 0.5)" />
                  <stop offset="100%" stopColor="rgb(255 255 255 / 0)" />
                </linearGradient>
              </defs>
              <motion.rect
                x="-360"
                y="0"
                width="300"
                height="840"
                fill="url(#dz-sheen)"
                animate={reduce ? undefined : { x: [-360, 660] }}
                transition={{ duration: 7, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
              />
            </g>

            {/* neckline + its wave trim */}
            <path d="M268 120 C 282 156 318 156 332 120" fill="rgb(var(--bg))" stroke="rgb(var(--primary) / 0.5)" strokeWidth="1.2" />
            <path
              d="M266 118 C 281 158 319 158 334 118"
              fill="none"
              stroke="rgb(var(--accent))"
              strokeWidth="2.4"
              strokeDasharray="1 7"
              strokeLinecap="round"
            />

            {/* hem shadow */}
            <path d="M118 764 Q 300 796 482 764" fill="none" stroke="rgb(var(--primary) / 0.4)" strokeWidth="2" />
          </Svg>
        </Layer>

        {/* 5 — knife pleats, breathing */}
        <Layer z={14}>
          <motion.div
            className="h-full w-full"
            animate={reduce ? undefined : { scaleX: [1, 1.012, 1] }}
            transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "50% 18%" }}
          >
            <Svg>
              <defs>
                <clipPath id="dz-clip-pleats">
                  <path d={BODY_PATH} />
                </clipPath>
              </defs>
              <g clipPath="url(#dz-clip-pleats)" stroke="rgb(var(--card) / 0.72)" strokeWidth="1.1" fill="none">
                {Array.from({ length: 15 }).map((_, i) => {
                  const x = 234 + i * 9.4;
                  const spread = (x - 300) * 2.6;
                  return (
                    <motion.path
                      key={i}
                      d={`M${x} 150 C ${x + spread * 0.12} 330, ${300 + spread * 0.7} 560, ${300 + spread} 780`}
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 1.6, ease, delay: 0.25 + i * 0.045 }}
                    />
                  );
                })}
              </g>
            </Svg>
          </motion.div>
        </Layer>

        {/* 6 — hand-painted vine, drawn on as it enters view */}
        <Layer z={34}>
          <Svg>
            <motion.g
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-120px" }}
              stroke="rgb(var(--card))"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            >
              <motion.path
                d="M232 752 C 214 640 246 520 272 434 C 296 352 292 282 268 236"
                strokeWidth="1.6"
                variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1 } }}
                transition={{ duration: 2.6, ease }}
              />
              {/*
                Leaves are one shape reused at different points along the stem —
                small, veined and tipped outward, the way they are painted by hand.
              */}
              {[
                { x: 268, y: 452, r: 34, s: 1.0, delay: 0.9 },
                { x: 256, y: 546, r: 208, s: 0.92, delay: 1.15 },
                { x: 283, y: 372, r: 28, s: 0.85, delay: 1.4 },
                { x: 243, y: 646, r: 200, s: 0.8, delay: 1.65 },
                { x: 288, y: 300, r: 24, s: 0.72, delay: 1.9 },
                { x: 236, y: 716, r: 196, s: 0.66, delay: 2.1 },
                { x: 276, y: 250, r: 18, s: 0.55, delay: 2.3 },
              ].map((leaf, i) => (
                // The outer <g> holds the placement as an SVG attribute; the inner
                // motion.g owns the animated transform so the two never collide.
                <g
                  key={i}
                  transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.r}) scale(${leaf.s})`}
                >
                  <motion.g
                    variants={{
                      hidden: { opacity: 0, scale: 0.35 },
                      show: { opacity: 1, scale: 1 },
                    }}
                    transition={{ duration: 1, ease, delay: leaf.delay }}
                    style={{ transformOrigin: "0px 0px" }}
                  >
                    <path
                      d="M0 0 C 20 -6 32 -24 31 -46 C 10 -42 -2 -22 0 0 Z"
                      fill="rgb(var(--card) / 0.94)"
                      strokeWidth="1.2"
                    />
                    <path d="M1 -2 C 10 -14 20 -30 29 -44" strokeWidth="0.9" opacity="0.55" />
                  </motion.g>
                </g>
              ))}
            </motion.g>

            {/* a second sprig on the dupatta */}
            <motion.g
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, delay: 2.3 }}
              stroke="rgb(var(--card))"
              strokeWidth="1.2"
              fill="rgb(var(--card) / 0.9)"
            >
              <g transform="translate(474 548) rotate(30)">
                <path d="M0 0 C 18 -6 29 -22 28 -42 C 9 -38 -2 -20 0 0 Z" />
              </g>
              <g transform="translate(492 618) rotate(206)">
                <path d="M0 0 C 18 -6 29 -22 28 -42 C 9 -38 -2 -20 0 0 Z" />
              </g>
            </motion.g>
          </Svg>
        </Layer>

        {/* 7 — front dupatta edge, closest to the viewer */}
        <motion.div
          className="absolute inset-0"
          style={{ transform: "translateZ(66px)", transformOrigin: "58% 14%" }}
          animate={reduce ? undefined : { rotate: [0.9, -1.1, 0.9] }}
          transition={{ duration: 7.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Svg>
            <path
              d="M356 138 C 372 250 386 386 392 520 C 396 620 392 700 384 776"
              fill="none"
              stroke="rgb(var(--accent) / 0.75)"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M356 138 C 372 250 386 386 392 520 C 396 620 392 700 384 776"
              fill="none"
              stroke="rgb(var(--card) / 0.6)"
              strokeWidth="7"
              strokeLinecap="round"
              opacity="0.45"
            />
          </Svg>
        </motion.div>

        {/* 8 — petals drifting in front */}
        {!reduce && (
          <Layer z={110} className="pointer-events-none">
            {Array.from({ length: 7 }).map((_, i) => {
              const round = (n: number) => Math.round(n * 100) / 100;
              const left = round(8 + seeded(i + 7) * 84);
              const size = round(9 + seeded(i + 17) * 12);
              return (
                <motion.span
                  key={i}
                  className="absolute rounded-[60%_40%_55%_45%/50%_60%_40%_50%]"
                  style={{
                    left: `${left}%`,
                    top: `${round(18 + seeded(i + 27) * 60)}%`,
                    width: size,
                    height: round(size * 0.8),
                    backgroundColor: "rgb(var(--accent) / 0.55)",
                    boxShadow: "0 4px 14px rgb(var(--accent) / 0.35)",
                  }}
                  animate={{
                    y: [0, -70 - seeded(i + 37) * 60, 0],
                    x: [0, 26 - seeded(i + 47) * 52, 0],
                    rotate: [0, 180, 360],
                    opacity: [0, 0.9, 0],
                  }}
                  transition={{
                    duration: 12 + seeded(i + 57) * 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: seeded(i + 67) * 8,
                  }}
                />
              );
            })}
          </Layer>
        )}
      </motion.div>
    </div>
  );
}

/** Tiny flourish used beside labels. */
export function DressSpecDot({ progress }: { progress?: MotionValue<number> }) {
  return (
    <motion.span
      style={progress ? { scale: progress } : undefined}
      className="inline-block h-1.5 w-1.5 rounded-full bg-accent"
    />
  );
}
