"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { Faq as FaqItem, SectionCopy } from "@/lib/content-types";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

export function Faq({ faqs, copy }: { faqs: FaqItem[]; copy: SectionCopy }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative py-28 sm:py-36">
      <div className="container max-w-3xl">
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={copy.title}
          accentWords={copy.accentWords}
          subtitle={copy.subtitle}
        />

        <div className="mt-14">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease, delay: i * 0.06 }}
                className="border-b border-border"
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors duration-400 hover:text-ink"
                  >
                    <span className="font-serif text-[21px] font-light leading-snug sm:text-[23px]">
                      {item.q}
                    </span>
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border transition-all duration-600 ease-silk",
                        isOpen && "rotate-45 border-primary/40 bg-primary/10"
                      )}
                    >
                      <Plus className="h-4 w-4" strokeWidth={1.3} />
                    </span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease }}
                      className="overflow-hidden"
                    >
                      <p className="pb-7 pr-14 text-[14.5px] leading-[1.9] text-muted pretty">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
