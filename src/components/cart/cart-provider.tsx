"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Cart state lives in localStorage so a basket survives a refresh.
 *
 * Prices are kept here only to render totals — checkout re-reads every price
 * from the database inside place_order(), so editing this state cannot change
 * what someone is charged.
 */

export type CartLine = {
  productId: string;
  variantId: string | null;
  slug: string;
  name: string;
  variantLabel: string;
  unitPriceCents: number;
  image: string;
  /** Fallback illustration key, so the drawer matches the site. */
  art: string;
  quantity: number;
  maxQuantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  isOpen: boolean;
  ready: boolean;
  open: () => void;
  close: () => void;
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQuantity: (productId: string, variantId: string | null, quantity: number) => void;
  remove: (productId: string, variantId: string | null) => void;
  clear: () => void;
};

const STORAGE_KEY = "sowcha-cart";

const CartContext = createContext<CartContextValue | null>(null);

const sameLine = (a: CartLine, productId: string, variantId: string | null) =>
  a.productId === productId && (a.variantId ?? null) === (variantId ?? null);

const posInt = (v: unknown, fallback: number) =>
  Number.isFinite(v) && (v as number) > 0 ? Math.trunc(v as number) : fallback;

/**
 * Storage is attacker-and-corruption-controlled. Anything that does not match
 * the shape is dropped rather than trusted, otherwise one bad entry throws
 * during render and takes down every page (the provider is site-wide).
 */
function sanitise(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];

  return raw.flatMap((item): CartLine[] => {
    if (!item || typeof item !== "object") return [];
    const l = item as Record<string, unknown>;
    if (typeof l.productId !== "string" || !l.productId) return [];
    if (typeof l.name !== "string") return [];

    const maxQuantity = posInt(l.maxQuantity, 20);
    return [
      {
        productId: l.productId,
        variantId: typeof l.variantId === "string" ? l.variantId : null,
        slug: typeof l.slug === "string" ? l.slug : "",
        name: l.name,
        variantLabel: typeof l.variantLabel === "string" ? l.variantLabel : "",
        unitPriceCents:
          Number.isFinite(l.unitPriceCents) && (l.unitPriceCents as number) >= 0
            ? Math.trunc(l.unitPriceCents as number)
            : 0,
        image: typeof l.image === "string" ? l.image : "",
        art: typeof l.art === "string" ? l.art : "folds",
        quantity: Math.min(posInt(l.quantity, 1), maxQuantity),
        maxQuantity,
      },
    ];
  });
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [ready, setReady] = useState(false);

  // Load once on mount; until then `ready` is false so the badge does not
  // flash a stale count during hydration.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(sanitise(JSON.parse(raw)));
    } catch {
      // Corrupt or unavailable storage: start with an empty basket.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Private mode — the cart simply will not persist.
    }
  }, [lines, ready]);

  // Lock the page while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const add = useCallback(
    (line: Omit<CartLine, "quantity">, quantity = 1) => {
      setLines((current) => {
        const existing = current.find((l) => sameLine(l, line.productId, line.variantId));
        if (existing) {
          const capped = Math.min(
            existing.quantity + quantity,
            Math.max(1, line.maxQuantity || 20)
          );
          return current.map((l) =>
            sameLine(l, line.productId, line.variantId) ? { ...l, quantity: capped } : l
          );
        }
        const cap = Math.max(1, line.maxQuantity || 20);
        return [...current, { ...line, quantity: Math.min(posInt(quantity, 1), cap) }];
      });
      setIsOpen(true);
    },
    []
  );

  const setQuantity = useCallback(
    (productId: string, variantId: string | null, quantity: number) => {
      setLines((current) =>
        quantity <= 0
          ? current.filter((l) => !sameLine(l, productId, variantId))
          : current.map((l) =>
              sameLine(l, productId, variantId)
                ? { ...l, quantity: Math.min(quantity, Math.max(1, l.maxQuantity || 20)) }
                : l
            )
      );
    },
    []
  );

  const remove = useCallback((productId: string, variantId: string | null) => {
    setLines((current) => current.filter((l) => !sameLine(l, productId, variantId)));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((n, l) => n + l.quantity, 0);
    const subtotalCents = lines.reduce((n, l) => n + l.unitPriceCents * l.quantity, 0);
    return {
      lines,
      count,
      subtotalCents,
      isOpen,
      ready,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      setQuantity,
      remove,
      clear,
    };
  }, [lines, isOpen, ready, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
