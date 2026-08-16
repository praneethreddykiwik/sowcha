"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/content-types";
import { useCart } from "./cart-provider";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

/**
 * Size picker + add to cart. Sits inside the existing quick-view panel so the
 * lookbook layout is untouched.
 */
export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();

  // If the catalogue ever falls back to bundled placeholder data (or a piece is
  // simply not priced yet) there is nothing legitimate to sell, so the buying
  // controls are withheld rather than offering a ₹0 order.
  if (!product.priceCents || product.priceCents <= 0) {
    return (
      <p className="text-[13.5px] leading-relaxed text-muted">
        Not on sale online just yet — write to us and we will tell you what is on
        the rail.
      </p>
    );
  }

  return <AddToCartControls product={product} add={add} />;
}

function AddToCartControls({
  product,
  add,
}: {
  product: Product;
  add: ReturnType<typeof useCart>["add"];
}) {
  const inStockVariants = product.variants.filter((v) => v.stock > 0);
  const hasVariants = product.variants.length > 0;

  const [variantId, setVariantId] = useState<string | null>(
    inStockVariants.length === 1 ? inStockVariants[0].id : null
  );
  const [justAdded, setJustAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const variant = product.variants.find((v) => v.id === variantId) ?? null;
  const unitPrice = variant?.priceCents ?? product.priceCents;
  const available = hasVariants
    ? (variant?.stock ?? 0)
    : product.trackInventory
      ? product.stock
      : 20;

  const soldOut = hasVariants
    ? inStockVariants.length === 0
    : product.trackInventory && product.stock <= 0;

  function handleAdd() {
    if (hasVariants && !variant) {
      setError("Please choose a size.");
      return;
    }
    setError(null);

    add({
      productId: product.id,
      variantId: variant?.id ?? null,
      slug: product.slug,
      name: product.name,
      variantLabel: variant
        ? [variant.size, variant.color].filter(Boolean).join(" / ")
        : "",
      unitPriceCents: unitPrice,
      image: product.image,
      art: product.art,
      maxQuantity: Math.max(1, Math.min(available, 20)),
    });

    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <div>
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-[28px] font-light leading-none">
          {formatMoney(unitPrice, product.currency)}
        </span>
        {product.compareAtPriceCents &&
          product.compareAtPriceCents > unitPrice && (
            <span className="text-[14px] text-muted line-through">
              {formatMoney(product.compareAtPriceCents, product.currency)}
            </span>
          )}
      </div>

      {hasVariants && (
        <div className="mt-6">
          <span className="eyebrow">Size</span>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.variants.map((v) => {
              const out = v.stock <= 0;
              const label = [v.size, v.color].filter(Boolean).join(" / ");
              return (
                <button
                  key={v.id}
                  type="button"
                  disabled={out}
                  onClick={() => {
                    setVariantId(v.id);
                    setError(null);
                  }}
                  className={cn(
                    "min-w-[52px] rounded-full border px-4 py-3 text-[12.5px] transition-all duration-300",
                    v.id === variantId
                      ? "border-ink bg-ink text-white"
                      : "border-border text-foreground hover:border-ink/40",
                    out && "cursor-not-allowed text-muted line-through opacity-50 hover:border-border"
                  )}
                >
                  {label || "One size"}
                </button>
              );
            })}
          </div>
          {variant && variant.stock > 0 && variant.stock <= 3 && (
            <p className="mt-3 text-[12.5px] text-muted">
              Only {variant.stock} left in this size.
            </p>
          )}
        </div>
      )}

      {error && <p className="mt-4 text-[12.5px] text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handleAdd}
        disabled={soldOut}
        className={cn(
          "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[13px] tracking-wideish transition-all duration-500 ease-silk",
          soldOut
            ? "cursor-not-allowed border border-border text-muted"
            : "bg-ink text-white hover:-translate-y-0.5"
        )}
      >
        {soldOut ? (
          "Sold out"
        ) : justAdded ? (
          <>
            <Check className="h-4 w-4" strokeWidth={1.6} />
            Added to basket
          </>
        ) : (
          <>
            <ShoppingBag className="h-4 w-4" strokeWidth={1.4} />
            Add to basket
          </>
        )}
      </button>

      {product.sku && (
        <p className="mt-4 break-all text-[11.5px] uppercase tracking-wideish text-muted">
          {variant?.sku || product.sku}
        </p>
      )}
    </div>
  );
}
