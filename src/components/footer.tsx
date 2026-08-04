"use client";

import Link from "next/link";
import { Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { brand, nav } from "@/config/brand";
import { Butterfly } from "./butterfly";
import { FloatingLeaves } from "./floating-leaves";
import { Reveal } from "./ui/reveal";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-border bg-card/40">
      <FloatingLeaves count={5} className="opacity-40" />

      <div className="container relative py-20">
        <Reveal className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Butterfly className="h-9 w-9" strokeWidth={2.2} />
              <span className="font-serif text-[30px] leading-none">
                Sow<span className="italic text-ink">Cha</span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-[14px] leading-[1.9] text-muted pretty">
              {brand.shortAbout}
            </p>
            <p className="eyebrow mt-6">{brand.tagline}</p>

            <div className="mt-7 flex gap-2">
              <a
                href={brand.contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted transition-all duration-500 ease-silk hover:-translate-y-0.5 hover:border-primary/40 hover:text-ink hover:shadow-soft"
              >
                <Instagram className="h-4 w-4" strokeWidth={1.4} />
              </a>
              <a
                href={brand.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted transition-all duration-500 ease-silk hover:-translate-y-0.5 hover:border-primary/40 hover:text-ink hover:shadow-soft"
              >
                <Linkedin className="h-4 w-4" strokeWidth={1.4} />
              </a>
              <a
                href={`mailto:${brand.contact.email}`}
                aria-label="Email"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted transition-all duration-500 ease-silk hover:-translate-y-0.5 hover:border-primary/40 hover:text-ink hover:shadow-soft"
              >
                <Mail className="h-4 w-4" strokeWidth={1.4} />
              </a>
            </div>
          </div>

          <nav aria-label="Footer">
            <h3 className="eyebrow">Explore</h3>
            <ul className="mt-5 space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[14px] text-muted transition-colors duration-400 hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="eyebrow">Reach us</h3>
            <ul className="mt-5 space-y-3.5 text-[14px] text-muted">
              <li>
                <a
                  href={brand.contact.phoneHref}
                  className="flex items-start gap-2.5 transition-colors duration-400 hover:text-foreground"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.4} />
                  {brand.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${brand.contact.email}`}
                  className="flex items-start gap-2.5 transition-colors duration-400 hover:text-foreground"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.4} />
                  {brand.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5 leading-relaxed">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.4} />
                {brand.contact.location}
              </li>
            </ul>
          </div>
        </Reveal>

        <div className="rule mt-16" />

        <div className="mt-7 flex flex-col items-center justify-between gap-3 text-[12px] text-muted sm:flex-row">
          <p>
            © {year} {brand.name}. All rights reserved.
          </p>
          <p className="tracking-wideish">Made slowly, in Hyderabad.</p>
        </div>
      </div>
    </footer>
  );
}
