"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Palette } from "lucide-react";
import { themes } from "@/config/themes";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/utils";

/** Grace period before a hover-out actually closes the menu. */
const CLOSE_DELAY = 280;

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const active = themes.find((t) => t.id === theme) ?? themes[0];

  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  // Deliberately delayed: a fast diagonal flick toward the menu briefly leaves
  // the wrapper, and closing on that first frame makes the menu unusable.
  const closeSoon = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY);
  }, [cancelClose]);

  const closeNow = useCallback(() => {
    cancelClose();
    setOpen(false);
  }, [cancelClose]);

  useEffect(() => cancelClose, [cancelClose]);

  // Escape closes and hands focus back; a click anywhere else dismisses.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeNow();
        buttonRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) closeNow();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, closeNow]);

  return (
    <div
      ref={rootRef}
      className={cn("relative", className)}
      onPointerEnter={cancelClose}
      onPointerLeave={closeSoon}
      // Keyboard users tabbing out of the menu should close it too.
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) closeNow();
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Colour theme: ${active.label}. Change theme`}
        onClick={() => (open ? closeNow() : (cancelClose(), setOpen(true)))}
        onPointerEnter={(e) => {
          // Touch and pen already have the tap; hover-open is mouse-only.
          if (e.pointerType !== "mouse") return;
          cancelClose();
          setOpen(true);
        }}
        onFocus={() => {
          cancelClose();
          setOpen(true);
        }}
        className="group flex h-10 items-center gap-2 rounded-full border border-border/80 bg-card/70 px-3 backdrop-blur transition-all duration-500 ease-silk hover:border-primary/40 hover:shadow-soft"
      >
        <Palette
          className="h-[15px] w-[15px] text-muted transition-colors duration-500 group-hover:text-ink"
          strokeWidth={1.4}
        />
        <span className="flex items-center gap-1">
          {active.swatch.map((c) => (
            <span
              key={c}
              className="h-2.5 w-2.5 rounded-full ring-1 ring-black/5"
              style={{ background: c }}
            />
          ))}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          /*
           * The wrapper sits flush against the button (top-full) and carries the
           * visual offset as padding. That keeps the strip between button and
           * panel inside this element, so travelling to the menu never leaves
           * the hover region — the bug was an 8px dead gap here.
           */
          /*
           * The animated element must be AnimatePresence's *direct* child — a
           * plain wrapper here leaves the menu mounted after close, because the
           * exit never resolves. So the bridge and the animation are one node.
           */
          <motion.div
            key="theme-menu"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "top right" }}
            className="absolute right-0 top-full z-50 pt-2.5"
          >
            <ul
              role="listbox"
              aria-label="Colour theme"
              aria-activedescendant={`theme-option-${active.id}`}
              className="glass-strong w-64 overflow-hidden rounded-3xl p-2 shadow-lift"
            >
              {themes.map((t) => {
                const selected = t.id === theme;
                return (
                  <li key={t.id} id={`theme-option-${t.id}`} role="option" aria-selected={selected}>
                    <button
                      type="button"
                      onClick={() => {
                        setTheme(t.id);
                        closeNow();
                      }}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors duration-300",
                        selected ? "bg-primary/10" : "hover:bg-primary/[0.06]"
                      )}
                    >
                      <span
                        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] ring-1 ring-black/5"
                        style={{ background: t.swatch[2] }}
                        aria-hidden
                      >
                        {t.glyph}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="font-serif text-[17px] leading-none">
                            {t.label}
                          </span>
                          {selected && (
                            <Check className="h-3.5 w-3.5 text-ink" strokeWidth={2} />
                          )}
                        </span>
                        <span className="mt-1 block text-[12px] leading-snug text-muted">
                          {t.description}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
