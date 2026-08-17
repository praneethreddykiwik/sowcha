"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Instagram, Menu, ShoppingBag, X } from "lucide-react";
import { nav } from "@/config/brand";
import type { Settings } from "@/lib/content-types";
import { Wordmark } from "./butterfly";
import { ThemeToggle } from "./theme/theme-toggle";
import { CartButton } from "./cart/cart-button";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

export function Navbar({ settings }: { settings: Settings }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease, delay: 0.2 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "transition-all duration-700 ease-silk",
            scrolled ? "glass-strong shadow-soft" : "bg-transparent"
          )}
        >
          <nav
            aria-label="Primary"
            className={cn(
              "container flex items-center justify-between transition-all duration-700 ease-silk",
              scrolled ? "h-[68px]" : "h-[86px]"
            )}
          >
            <Link
              href="/"
              className="shrink-0 transition-transform duration-500 ease-silk hover:scale-[1.02]"
              aria-label={`${settings.brandName} — home`}
            >
              <Wordmark />
            </Link>

            <ul className="hidden items-center gap-1 lg:flex">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group relative block px-3.5 py-2 text-[13px] tracking-wideish text-muted transition-colors duration-500 hover:text-foreground"
                  >
                    {item.label}
                    <span className="absolute inset-x-3.5 bottom-1 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 ease-silk group-hover:scale-x-100" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <CartButton />
              <ThemeToggle />
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${settings.brandName} on Instagram`}
                className="hidden h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-card/70 text-muted backdrop-blur transition-all duration-500 ease-silk hover:-translate-y-0.5 hover:border-primary/40 hover:text-ink hover:shadow-soft sm:flex"
              >
                <Instagram className="h-[16px] w-[16px]" strokeWidth={1.4} />
              </a>
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-card/70 text-foreground backdrop-blur transition-colors duration-500 hover:border-primary/40 lg:hidden"
              >
                <Menu className="h-[17px] w-[17px]" strokeWidth={1.4} />
              </button>
            </div>
          </nav>
        </div>

        {/* reading progress */}
        <motion.div
          style={{ scaleX: progress }}
          className="h-[2px] origin-left bg-gradient-to-r from-primary via-accent to-primary/40"
        />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div
              className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.6, ease }}
              className="glass-strong absolute right-0 top-0 flex h-[100dvh] w-[min(86vw,360px)] flex-col overflow-y-auto overscroll-contain p-6"
            >
              <div className="flex items-center justify-between">
                <Wordmark />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground"
                >
                  <X className="h-[17px] w-[17px]" strokeWidth={1.4} />
                </button>
              </div>

              <ul className="mt-10 flex flex-col gap-1">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease, delay: 0.12 + i * 0.06 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block border-b border-border/70 py-4 font-serif text-2xl font-light transition-colors duration-300 hover:text-ink"
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-auto space-y-1 pt-8 text-[13px] text-muted">
                <a href={settings.phoneHref} className="block hover:text-foreground">
                  {settings.phone}
                </a>
                <a href={`mailto:${settings.email}`} className="block hover:text-foreground">
                  {settings.email}
                </a>
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-foreground"
                >
                  {settings.instagramHandle}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
