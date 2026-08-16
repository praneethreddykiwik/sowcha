"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "./cart-provider";
import { ImageFrame } from "@/components/image-frame";
import type { ArtVariant } from "@/lib/content-types";
import { formatMoney } from "@/lib/money";

const ease = [0.16, 1, 0.3, 1] as const;

export function CartDrawer({
  shippingFlatCents,
  freeShippingThresholdCents,
}: {
  shippingFlatCents: number;
  freeShippingThresholdCents: number;
}) {
  const { lines, isOpen, close, setQuantity, remove, subtotalCents, count } = useCart();

  const qualifiesFree = subtotalCents >= freeShippingThresholdCents;
  const shipping = lines.length === 0 || qualifiesFree ? 0 : shippingFlatCents;
  const remaining = Math.max(0, freeShippingThresholdCents - subtotalCents);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[80]"
          role="dialog"
          aria-modal="true"
          aria-label="Your basket"
        >
          <div
            className="absolute inset-0 bg-foreground/25 backdrop-blur-sm"
            onClick={close}
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease }}
            className="glass-strong absolute right-0 top-0 flex h-[100dvh] w-[min(92vw,440px)] flex-col"
          >
            <header className="flex items-center justify-between border-b border-border px-6 py-5">
              <span className="flex items-center gap-2.5">
                <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.4} />
                <span className="font-serif text-[22px] font-light leading-none">
                  Your basket
                </span>
                {count > 0 && (
                  <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[11px] text-muted">
                    {count}
                  </span>
                )}
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="Close basket"
                className="rounded-full p-3.5 text-muted transition-colors duration-300 hover:text-foreground"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <ShoppingBag className="h-8 w-8 text-muted" strokeWidth={1} />
                <p className="font-serif text-[20px] font-light">Nothing here yet</p>
                <p className="max-w-[28ch] text-[13.5px] leading-relaxed text-muted">
                  Everything on the rail is made in small batches — add a piece and
                  it is held for you at checkout.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-2 rounded-full border border-border px-5 py-3 text-[12.5px] tracking-wideish transition-colors duration-300 hover:border-ink/40"
                >
                  Keep looking
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
                  {lines.map((line) => (
                    <li
                      key={`${line.productId}-${line.variantId ?? "base"}`}
                      className="flex gap-4"
                    >
                      <span className="relative h-24 w-20 shrink-0 overflow-hidden rounded-2xl border border-border">
                        <ImageFrame
                          src={line.image}
                          alt={line.name}
                          art={line.art as ArtVariant}
                          seed={line.name.length}
                          sizes="80px"
                        />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-3">
                          <span className="min-w-0">
                            <span className="block truncate font-serif text-[17px] font-light">
                              {line.name}
                            </span>
                            {line.variantLabel && (
                              <span className="mt-0.5 block text-[12px] text-muted">
                                {line.variantLabel}
                              </span>
                            )}
                          </span>
                          <button
                            type="button"
                            onClick={() => remove(line.productId, line.variantId)}
                            aria-label={`Remove ${line.name}`}
                            className="-mr-2 shrink-0 rounded-full p-3 text-muted transition-colors duration-300 hover:text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </span>

                        <span className="mt-3 flex items-center justify-between gap-3">
                          <span className="flex items-center rounded-full border border-border">
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity(line.productId, line.variantId, line.quantity - 1)
                              }
                              aria-label="Decrease quantity"
                              className="p-3.5 text-muted transition-colors hover:text-foreground"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="min-w-[24px] text-center text-[13px] tabular-nums">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              disabled={line.quantity >= line.maxQuantity}
                              onClick={() =>
                                setQuantity(line.productId, line.variantId, line.quantity + 1)
                              }
                              aria-label="Increase quantity"
                              className="p-3.5 text-muted transition-colors hover:text-foreground disabled:opacity-30"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </span>
                          <span className="text-[14px] tabular-nums">
                            {formatMoney(line.unitPriceCents * line.quantity)}
                          </span>
                        </span>

                        {line.quantity >= line.maxQuantity && (
                          <span className="mt-1.5 block text-[11.5px] text-muted">
                            Only {line.maxQuantity} left
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>

                <footer className="border-t border-border px-6 py-5">
                  {!qualifiesFree && remaining > 0 && (
                    <p className="mb-4 rounded-2xl bg-ink/[0.06] px-4 py-3 text-[12.5px] leading-relaxed text-muted">
                      {formatMoney(remaining)} more for free shipping.
                    </p>
                  )}

                  <dl className="space-y-2 text-[13.5px]">
                    <div className="flex justify-between">
                      <dt className="text-muted">Subtotal</dt>
                      <dd className="tabular-nums">{formatMoney(subtotalCents)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted">Shipping</dt>
                      <dd className="tabular-nums">
                        {shipping === 0 ? "Free" : formatMoney(shipping)}
                      </dd>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2.5 text-[16px]">
                      <dt className="font-serif font-light">Total</dt>
                      <dd className="tabular-nums">
                        {formatMoney(subtotalCents + shipping)}
                      </dd>
                    </div>
                  </dl>

                  <Link
                    href="/checkout"
                    onClick={close}
                    className="mt-5 flex w-full items-center justify-center rounded-full bg-ink px-6 py-3.5 text-[13px] tracking-wideish text-white transition-transform duration-500 ease-silk hover:-translate-y-0.5"
                  >
                    Checkout
                  </Link>
                  <p className="mt-3 text-center text-[11.5px] text-muted">
                    Taxes included. Made to order pieces ship in 5–7 days.
                  </p>
                </footer>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
