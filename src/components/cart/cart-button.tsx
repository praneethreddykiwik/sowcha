"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./cart-provider";

/** Basket button in the navbar, styled to match the existing controls. */
export function CartButton() {
  const { count, open, ready } = useCart();

  return (
    <button
      type="button"
      onClick={open}
      aria-label={count > 0 ? `Open basket, ${count} items` : "Open basket"}
      className="relative flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-card/70 text-muted backdrop-blur transition-all duration-500 ease-silk hover:-translate-y-0.5 hover:border-ink/40 hover:text-ink hover:shadow-soft"
    >
      <ShoppingBag className="h-[16px] w-[16px]" strokeWidth={1.4} />
      {/*
        Deliberately not wrapped in AnimatePresence: an exit animation that
        never completes (a backgrounded or throttled tab) would leave a stale
        count pinned to the icon. The badge simply unmounts.
      */}
      {ready && count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-ink px-1 text-[10px] font-medium tabular-nums text-white"
        >
          {count}
        </motion.span>
      )}
    </button>
  );
}
