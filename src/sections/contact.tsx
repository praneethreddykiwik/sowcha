"use client";

import { motion } from "framer-motion";
import { Clock, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { brand } from "@/config/brand";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";
import { FloatingLeaves } from "@/components/floating-leaves";
import { Butterfly } from "@/components/butterfly";

const ease = [0.16, 1, 0.3, 1] as const;

const lines = [
  {
    icon: Phone,
    label: "Telephone",
    value: brand.contact.phone,
    href: brand.contact.phoneHref,
  },
  {
    icon: Mail,
    label: "Email",
    value: brand.contact.email,
    href: `mailto:${brand.contact.email}`,
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: brand.contact.instagramHandle,
    href: brand.contact.instagram,
  },
  {
    icon: MapPin,
    label: "Atelier",
    value: brand.contact.location,
    href: brand.contact.mapsUrl,
  },
];

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden py-28 sm:py-36">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(100% 70% at 50% 100%, rgb(var(--primary)/0.12) 0%, rgb(var(--bg)) 60%)",
        }}
      />
      <FloatingLeaves count={6} className="opacity-50" />

      <div className="container relative">
        <SectionHeading
          eyebrow="Visit or write"
          title="Come and see the cloth"
          accentWords={["cloth"]}
          subtitle="The rail changes weekly. Tell us what you are looking for and we will set aside the pieces worth your afternoon."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* details card */}
          <motion.div
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease }}
            className="glass rounded-[32px] p-8 shadow-soft sm:p-11"
          >
            <div className="flex items-center gap-3">
              <Butterfly className="h-8 w-8" strokeWidth={2.4} />
              <span className="font-serif text-[26px] leading-none">
                Sow<span className="italic text-ink">Cha</span>
              </span>
            </div>

            <ul className="mt-9 grid gap-6 sm:grid-cols-2">
              {lines.map((line, i) => {
                const Icon = line.icon;
                return (
                  <motion.li
                    key={line.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease, delay: 0.1 + i * 0.07 }}
                  >
                    <span className="eyebrow">{line.label}</span>
                    <a
                      href={line.href}
                      target={line.href.startsWith("http") ? "_blank" : undefined}
                      rel={line.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="group mt-2.5 flex items-start gap-2.5 text-[14.5px] leading-relaxed text-foreground/85 transition-colors duration-400 hover:text-ink"
                    >
                      <Icon
                        className="mt-0.5 h-4 w-4 shrink-0 text-muted transition-colors duration-400 group-hover:text-ink"
                        strokeWidth={1.4}
                      />
                      {line.value}
                    </a>
                  </motion.li>
                );
              })}
            </ul>

            <div className="mt-10 rounded-3xl border border-border bg-card/60 p-6">
              <span className="flex items-center gap-2 text-[11px] uppercase tracking-luxe text-muted">
                <Clock className="h-3.5 w-3.5" strokeWidth={1.4} />
                Business hours
              </span>
              <ul className="mt-4 space-y-2.5">
                {brand.contact.hours.map((h) => (
                  <li
                    key={h.days}
                    className="flex items-baseline justify-between gap-4 text-[14px]"
                  >
                    <span className="text-muted">{h.days}</span>
                    <span
                      aria-hidden
                      className="mx-2 h-px flex-1 border-b border-dashed border-border"
                    />
                    <span>{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <LinkButton
                href={brand.contact.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin className="h-4 w-4" strokeWidth={1.4} />
                Open in Google Maps
              </LinkButton>
              <LinkButton href={`mailto:${brand.contact.email}`} variant="outline">
                Write to us
              </LinkButton>
            </div>
          </motion.div>

          {/* drawn map plate */}
          <motion.div
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease, delay: 0.12 }}
            className="relative min-h-[340px] overflow-hidden rounded-[32px] border border-border bg-card shadow-soft"
          >
            <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden>
              <rect width="400" height="400" fill="rgb(var(--bg))" />
              <g stroke="rgb(var(--border))" strokeWidth="1">
                {Array.from({ length: 9 }).map((_, i) => (
                  <line key={`h${i}`} x1="0" y1={i * 50} x2="400" y2={i * 50} />
                ))}
                {Array.from({ length: 9 }).map((_, i) => (
                  <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="400" />
                ))}
              </g>
              <path
                d="M0 250 C 90 240 130 190 200 186 C 268 182 320 140 400 150"
                fill="none"
                stroke="rgb(var(--primary) / 0.35)"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M186 400 C 190 320 196 250 200 186 C 204 120 198 60 210 0"
                fill="none"
                stroke="rgb(var(--primary) / 0.2)"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <circle cx="200" cy="186" r="46" fill="rgb(var(--accent) / 0.18)" />
              <motion.circle
                cx="200"
                cy="186"
                r="46"
                fill="none"
                stroke="rgb(var(--accent))"
                strokeWidth="1.5"
                animate={{ r: [46, 74, 46], opacity: [0.9, 0, 0.9] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeOut" }}
              />
              <circle cx="200" cy="186" r="7" fill="rgb(var(--primary))" />
            </svg>

            <div className="absolute inset-x-0 bottom-0 p-6">
              <div className="glass-strong rounded-2xl px-5 py-4">
                <p className="font-serif text-[19px] font-light">The SowCha Atelier</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">
                  {brand.contact.location}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
