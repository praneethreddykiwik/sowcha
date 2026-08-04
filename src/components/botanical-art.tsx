import type { ArtVariant } from "@/config/products";
import { cn, seeded } from "@/lib/utils";

/**
 * Hand-drawn stand-in artwork. Shown until a Cloudinary photo is available (and
 * whenever one fails to load) so an unconfigured build still looks designed
 * rather than broken. Everything is drawn from theme tokens, so the art
 * re-colours with the active theme.
 */

export function BotanicalArt({
  variant = "sprig",
  seed = 1,
  className,
}: {
  variant?: ArtVariant;
  seed?: number;
  className?: string;
}) {
  const gid = `${variant}-${seed}`;
  return (
    <svg
      viewBox="0 0 400 520"
      preserveAspectRatio="xMidYMid slice"
      className={cn("h-full w-full", className)}
      role="img"
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id={`bg-${gid}`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="rgb(var(--card))" />
          <stop offset="55%" stopColor="rgb(var(--bg))" />
          <stop offset="100%" stopColor="rgb(var(--primary) / 0.14)" />
        </linearGradient>
        <linearGradient id={`cloth-${gid}`} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="rgb(var(--primary) / 0.30)" />
          <stop offset="45%" stopColor="rgb(var(--primary) / 0.16)" />
          <stop offset="100%" stopColor="rgb(var(--accent) / 0.30)" />
        </linearGradient>
        <radialGradient id={`halo-${gid}`} cx="0.5" cy="0.35" r="0.7">
          <stop offset="0%" stopColor="rgb(var(--accent) / 0.35)" />
          <stop offset="100%" stopColor="rgb(var(--accent) / 0)" />
        </radialGradient>
      </defs>

      <rect width="400" height="520" fill={`url(#bg-${gid})`} />
      <circle cx="200" cy="180" r="190" fill={`url(#halo-${gid})`} />

      {variant === "anarkali" && <Anarkali gid={gid} />}
      {variant === "folds" && <Folds gid={gid} />}
      {variant === "drape" && <Drape gid={gid} />}
      {variant === "sprig" && <Sprig gid={gid} />}
      {variant === "butterfly" && <ArtButterfly gid={gid} />}
      {variant === "bloom" && <Bloom gid={gid} seed={seed} />}

      {/* corner sprigs, offset per seed so tiles never look copy-pasted */}
      <g
        stroke="rgb(var(--primary) / 0.30)"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        transform={`translate(${(8 + seeded(seed) * 14).toFixed(2)}, ${(430 + seeded(seed + 3) * 20).toFixed(2)}) rotate(${(-8 + seeded(seed + 5) * 16).toFixed(2)})`}
      >
        <path d="M0 60 C 14 40, 22 20, 24 0" />
        <path d="M10 42 c 10 -6 14 -14 13 -22 -10 2 -15 10 -13 22Z" fill="rgb(var(--primary) / 0.12)" />
        <path d="M17 24 c 11 -4 16 -12 16 -20 -10 1 -16 8 -16 20Z" fill="rgb(var(--primary) / 0.12)" />
      </g>
    </svg>
  );
}

function Anarkali({ gid }: { gid: string }) {
  return (
    <g>
      {/* flared body */}
      <path
        d="M200 92 C 176 96 160 104 152 118 L 138 168 C 120 250 96 358 72 470 L 328 470 C 304 358 280 250 262 168 L 248 118 C 240 104 224 96 200 92 Z"
        fill={`url(#cloth-${gid})`}
        stroke="rgb(var(--primary) / 0.45)"
        strokeWidth="1.1"
      />
      {/* sleeves */}
      <path d="M152 118 C 128 132 116 168 110 214 L 132 220 C 138 178 146 148 158 132 Z" fill="rgb(var(--primary) / 0.18)" stroke="rgb(var(--primary) / 0.35)" strokeWidth="1" />
      <path d="M248 118 C 272 132 284 168 290 214 L 268 220 C 262 178 254 148 242 132 Z" fill="rgb(var(--primary) / 0.18)" stroke="rgb(var(--primary) / 0.35)" strokeWidth="1" />
      {/* neckline */}
      <path d="M180 96 C 188 116 212 116 220 96" fill="none" stroke="rgb(var(--primary) / 0.55)" strokeWidth="1.2" />
      {/* pleats */}
      <g stroke="rgb(var(--card) / 0.75)" strokeWidth="0.9" fill="none">
        {Array.from({ length: 11 }).map((_, i) => {
          const x = 150 + i * 10;
          const spread = (x - 200) * 1.55;
          return <path key={i} d={`M${x} 128 C ${x + spread * 0.2} 260, ${200 + spread * 0.85} 380, ${200 + spread} 468`} />;
        })}
      </g>
      {/* hand-painted vine */}
      <g stroke="rgb(var(--card))" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.95">
        <path d="M186 456 C 176 400 188 348 202 306 C 214 268 210 236 196 214" />
        <path d="M198 320 c 22 -10 30 -28 27 -46 -20 4 -30 22 -27 46Z" fill="rgb(var(--card) / 0.85)" />
        <path d="M196 372 c -24 -8 -33 -26 -30 -44 20 4 32 20 30 44Z" fill="rgb(var(--card) / 0.85)" />
        <path d="M204 258 c 20 -12 26 -30 22 -46 -18 6 -26 24 -22 46Z" fill="rgb(var(--card) / 0.85)" />
        <path d="M190 418 c -22 -6 -30 -22 -28 -40 18 4 29 18 28 40Z" fill="rgb(var(--card) / 0.85)" />
      </g>
    </g>
  );
}

function Folds({ gid }: { gid: string }) {
  return (
    <g>
      <rect x="52" y="70" width="296" height="400" rx="16" fill={`url(#cloth-${gid})`} />
      <g stroke="rgb(var(--card) / 0.6)" fill="none" strokeWidth="1.1">
        {Array.from({ length: 14 }).map((_, i) => {
          const x = 62 + i * 21;
          return (
            <path
              key={i}
              d={`M${x} 70 C ${x + (i % 2 ? 14 : -14)} 190, ${x + (i % 2 ? -12 : 12)} 330, ${x} 470`}
            />
          );
        })}
      </g>
      <g stroke="rgb(var(--primary) / 0.35)" fill="none" strokeWidth="1">
        <path d="M52 250 C 140 232 260 268 348 244" />
        <path d="M52 322 C 140 306 260 340 348 316" />
      </g>
      <rect x="52" y="70" width="296" height="400" rx="16" fill="none" stroke="rgb(var(--primary) / 0.30)" />
    </g>
  );
}

function Drape({ gid }: { gid: string }) {
  return (
    <g>
      <path
        d="M60 74 C 150 110 250 62 344 96 C 330 210 356 320 322 452 C 232 420 150 470 66 442 C 92 320 46 196 60 74 Z"
        fill={`url(#cloth-${gid})`}
        stroke="rgb(var(--primary) / 0.35)"
        strokeWidth="1.1"
      />
      <g stroke="rgb(var(--card) / 0.65)" fill="none" strokeWidth="1.2">
        <path d="M96 92 C 116 210 92 330 104 440" />
        <path d="M150 100 C 172 220 148 336 158 452" />
        <path d="M206 92 C 228 214 204 330 214 444" />
        <path d="M262 86 C 284 208 260 326 270 448" />
        <path d="M312 92 C 330 210 306 330 316 446" />
      </g>
      <path d="M60 74 C 150 110 250 62 344 96" fill="none" stroke="rgb(var(--accent))" strokeWidth="2" opacity="0.7" />
    </g>
  );
}

function Sprig({ gid }: { gid: string }) {
  const leaf = (x: number, y: number, r: number, s: number) => (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path
        d="M0 0 C 26 -10 42 -34 40 -62 C 12 -56 -4 -32 0 0 Z"
        fill="rgb(var(--primary) / 0.16)"
        stroke="rgb(var(--primary) / 0.5)"
        strokeWidth="1.1"
      />
      <path d="M0 0 C 14 -18 28 -38 39 -60" stroke="rgb(var(--primary) / 0.45)" strokeWidth="0.8" fill="none" />
    </g>
  );
  return (
    <g>
      <circle cx="200" cy="250" r="132" fill={`url(#cloth-${gid})`} opacity="0.55" />
      <circle cx="200" cy="250" r="132" fill="none" stroke="rgb(var(--primary) / 0.25)" />
      <path
        d="M200 452 C 194 372 206 300 214 240 C 222 180 216 128 200 92"
        fill="none"
        stroke="rgb(var(--primary) / 0.6)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {leaf(210, 300, 18, 1)}
      {leaf(206, 358, 150, 0.9)}
      {leaf(216, 232, 26, 0.85)}
      {leaf(210, 178, 158, 0.75)}
      {leaf(204, 132, 22, 0.6)}
      <circle cx="200" cy="92" r="5" fill="rgb(var(--accent))" />
    </g>
  );
}

function ArtButterfly({ gid }: { gid: string }) {
  return (
    <g transform="translate(200 250)">
      <circle r="150" fill={`url(#cloth-${gid})`} opacity="0.5" />
      <g stroke="rgb(var(--primary) / 0.55)" strokeWidth="1.3" fill="rgb(var(--primary) / 0.16)">
        <path d="M-6 -46 C -70 -128 -168 -110 -150 -34 C -138 16 -70 26 -8 -4 Z" />
        <path d="M6 -46 C 70 -128 168 -110 150 -34 C 138 16 70 26 8 -4 Z" />
        <path d="M-8 6 C -66 22 -116 78 -80 118 C -46 154 -14 106 -6 40 Z" />
        <path d="M8 6 C 66 22 116 78 80 118 C 46 154 14 106 6 40 Z" />
      </g>
      <path d="M0 -56 C 8 -20 8 40 0 96" stroke="rgb(var(--accent))" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M-2 -58 C -18 -84 -34 -96 -48 -100" stroke="rgb(var(--primary) / 0.7)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M2 -58 C 18 -84 34 -96 48 -100" stroke="rgb(var(--primary) / 0.7)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <circle cx="-48" cy="-100" r="3" fill="rgb(var(--accent))" />
      <circle cx="48" cy="-100" r="3" fill="rgb(var(--accent))" />
    </g>
  );
}

function Bloom({ gid, seed }: { gid: string; seed: number }) {
  return (
    <g>
      <circle cx="200" cy="240" r="140" fill={`url(#cloth-${gid})`} opacity="0.6" />
      {Array.from({ length: 7 }).map((_, i) => {
        // Rounded: Node and the browser disagree on the last float digit of
        // sin/cos, which is enough to trip React's hydration check.
        const round = (n: number) => Number(n.toFixed(3));
        const a = (i / 7) * Math.PI * 2 + seeded(seed) * 2;
        const r = 78 + seeded(seed + i) * 22;
        const cx = round(200 + Math.cos(a) * r * 0.5);
        const cy = round(240 + Math.sin(a) * r * 0.5);
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx={54}
            ry={34}
            transform={`rotate(${round((a * 180) / Math.PI)} ${cx} ${cy})`}
            fill="rgb(var(--primary) / 0.12)"
            stroke="rgb(var(--primary) / 0.34)"
          />
        );
      })}
      <circle cx="200" cy="240" r="24" fill="rgb(var(--accent) / 0.5)" stroke="rgb(var(--accent))" />
      <path
        d="M200 264 C 198 330 204 396 194 462"
        fill="none"
        stroke="rgb(var(--primary) / 0.5)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </g>
  );
}
