"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Palette } from "lucide-react";
import { themes } from "@/config/themes";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const active = themes.find((t) => t.id === theme) ?? themes[0];

  return (
    <div
      className={cn("relative", className)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Colour theme: ${active.label}. Change theme`}
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setOpen(true)}
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
          <motion.ul
            role="listbox"
            aria-label="Colour theme"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="glass-strong absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-3xl p-2 shadow-lift"
          >
            {themes.map((t) => {
              const selected = t.id === theme;
              return (
                <li key={t.id} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => {
                      setTheme(t.id);
                      setOpen(false);
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
                          <Check
                            className="h-3.5 w-3.5 text-ink"
                            strokeWidth={2}
                          />
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
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
