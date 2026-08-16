"use client";

import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/content-types";
import { formatMoney } from "@/lib/money";
import { ImageFrame } from "./image-frame";
import { Layer, Tilt } from "./ui/tilt";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  index,
  onQuickView,
  className,
}: {
  product: Product;
  index: number;
  onQuickView: (product: Product) => void;
  className?: string;
}) {
  return (
    <Tilt className={cn("h-full", className)} intensity={6} lift={8}>
      <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-border bg-card shadow-soft transition-shadow duration-700 ease-silk hover:shadow-lift">
        <div className="relative aspect-[4/5] overflow-hidden">
          <ImageFrame
            src={product.image}
            alt={product.name}
            art={product.art}
            seed={index + 3}
            imgClassName="group-hover:scale-[1.04]"
            className="[&>svg]:transition-transform [&>svg]:duration-1200 [&>svg]:ease-silk group-hover:[&>svg]:scale-[1.04]"
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 30vw"
          />

          {/* collection tag floats above the image plane */}
          <Layer z={38} className="pointer-events-none absolute left-4 top-4">
            <span className="glass rounded-full px-3 py-1.5 text-[10px] uppercase tracking-luxe text-foreground/80">
              {product.collection}
            </span>
          </Layer>

          {/* quick view reveals on hover */}
          <div className="absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition-all duration-600 ease-silk group-hover:translate-y-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => onQuickView(product)}
              className="glass-strong flex w-full items-center justify-between rounded-full px-5 py-3 text-[12px] tracking-wideish text-foreground transition-colors duration-400 hover:text-ink"
            >
              Quick view
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <Layer z={22} className="flex flex-1 flex-col p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-serif text-[24px] font-light leading-tight">
              {product.name}
            </h3>
            {product.priceCents > 0 && (
              <span className="shrink-0 text-[15px] tabular-nums text-foreground/80">
                {formatMoney(product.priceCents, product.currency)}
              </span>
            )}
          </div>
          <p className="mt-2 text-[13.5px] leading-[1.75] text-muted pretty">
            {product.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {product.materials.slice(0, 2).map((m) => (
              <span
                key={m}
                className="rounded-full border border-border px-2.5 py-1 text-[10.5px] uppercase tracking-wideish text-muted"
              >
                {m}
              </span>
            ))}
          </div>
        </Layer>

        {/* soft edge glow on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 ring-1 ring-inset ring-primary/25 transition-opacity duration-700 group-hover:opacity-100"
        />
      </article>
    </Tilt>
  );
}
