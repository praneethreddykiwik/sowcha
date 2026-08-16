"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/config/journal";
import type { Post, SectionCopy } from "@/lib/content-types";
import { ImageFrame } from "@/components/image-frame";
import { FloatingLeaves } from "@/components/floating-leaves";
import { Tilt } from "@/components/ui/tilt";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

export function JournalIndex({
  posts,
  copy,
}: {
  posts: Post[];
  copy: SectionCopy;
}) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(posts.map((p) => p.category)))],
    [posts]
  );
  const [filter, setFilter] = useState("All");

  const visible = filter === "All" ? posts : posts.filter((p) => p.category === filter);
  const [lead, ...rest] = visible;

  return (
    <>
      {/* header */}
      <section className="relative overflow-hidden pb-16 pt-40 sm:pt-48">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(110% 70% at 50% 0%, rgb(var(--card)) 0%, rgb(var(--bg)) 55%, rgb(var(--primary)/0.08) 100%)",
          }}
        />
        <FloatingLeaves count={7} className="opacity-60" />

        <div className="container relative text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="eyebrow"
          >
            {copy.eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease, delay: 0.1 }}
            className="mt-5 font-serif text-[clamp(2.6rem,7vw,5rem)] font-light leading-[1.02] tracking-[-0.02em]"
          >
            Notes from the <span className="italic text-ink">atelier</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease, delay: 0.2 }}
            className="mx-auto mt-6 max-w-[52ch] text-[15px] leading-[1.9] text-muted pretty"
          >
            Everything we have learned about cloth, dye and patience — written down
            so it is not lost between seasons.
          </motion.p>

          {/* filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.35 }}
            className="mt-11 flex flex-wrap items-center justify-center gap-2"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={cn(
                  "relative rounded-full border px-4 py-2 text-[12px] tracking-wideish transition-all duration-500 ease-silk",
                  filter === cat
                    ? "border-primary/35 text-foreground"
                    : "border-border text-muted hover:border-primary/25 hover:text-foreground"
                )}
              >
                {filter === cat && (
                  <motion.span
                    layoutId="journal-filter"
                    className="absolute inset-0 rounded-full bg-primary/10"
                    transition={{ duration: 0.5, ease }}
                  />
                )}
                <span className="relative">{cat}</span>
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* entries */}
      <section className="pb-32">
        <div className="container">
          <AnimatePresence mode="popLayout">
            {lead && (
              <motion.article
                key={lead.slug}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease }}
                className="mb-6"
              >
                <Link
                  href={`/journal/${lead.slug}`}
                  className="group grid overflow-hidden rounded-[36px] border border-border bg-card shadow-soft transition-shadow duration-700 ease-silk hover:shadow-lift lg:grid-cols-2"
                >
                  <div className="relative aspect-[16/11] overflow-hidden lg:aspect-auto lg:min-h-[420px]">
                    <ImageFrame
                      src={lead.image}
                      alt={lead.title}
                      art={lead.art}
                      seed={2}
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      imgClassName="group-hover:scale-[1.04]"
                      className="[&>svg]:transition-transform [&>svg]:duration-1200 [&>svg]:ease-silk group-hover:[&>svg]:scale-[1.04]"
                    />
                    <span className="glass absolute left-5 top-5 rounded-full px-3.5 py-1.5 text-[10px] uppercase tracking-luxe">
                      Latest · {lead.category}
                    </span>
                  </div>

                  <div className="flex flex-col justify-center p-8 sm:p-12">
                    <div className="flex items-center gap-2 text-[11.5px] uppercase tracking-wideish text-muted">
                      <span>{formatDate(lead.date)}</span>
                      <span className="h-1 w-1 rounded-full bg-accent" />
                      <span>{lead.readingTime}</span>
                    </div>
                    <h2 className="mt-5 font-serif text-[clamp(1.9rem,3.4vw,2.8rem)] font-light leading-[1.12]">
                      {lead.title}
                    </h2>
                    <p className="mt-5 max-w-[46ch] text-[14.5px] leading-[1.9] text-muted pretty">
                      {lead.excerpt}
                    </p>
                    <span className="mt-8 inline-flex items-center gap-2 text-[13px] tracking-wideish">
                      Read the entry
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-500 ease-silk group-hover:translate-x-1.5"
                        strokeWidth={1.4}
                      />
                    </span>
                  </div>
                </Link>
              </motion.article>
            )}
          </AnimatePresence>

          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {rest.map((post, i) => (
                <motion.article
                  key={post.slug}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.7, ease, delay: i * 0.05 }}
                  className="h-full"
                >
                  <Tilt intensity={5} lift={6} className="h-full">
                    <Link
                      href={`/journal/${post.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-border bg-card shadow-soft transition-shadow duration-700 ease-silk hover:shadow-lift"
                    >
                      <div className="relative aspect-[16/11] overflow-hidden">
                        <ImageFrame
                          src={post.image}
                          alt={post.title}
                          art={post.art}
                          seed={i + 40}
                          sizes="(max-width: 640px) 92vw, 32vw"
                          imgClassName="group-hover:scale-[1.05]"
                          className="[&>svg]:transition-transform [&>svg]:duration-1200 [&>svg]:ease-silk group-hover:[&>svg]:scale-[1.05]"
                        />
                        <span className="glass absolute left-4 top-4 rounded-full px-3 py-1.5 text-[10px] uppercase tracking-luxe">
                          {post.category}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-7">
                        <div className="flex items-center gap-2 text-[11.5px] uppercase tracking-wideish text-muted">
                          <span>{formatDate(post.date)}</span>
                          <span className="h-1 w-1 rounded-full bg-accent" />
                          <span>{post.readingTime}</span>
                        </div>
                        <h2 className="mt-4 font-serif text-[24px] font-light leading-[1.2]">
                          {post.title}
                        </h2>
                        <p className="mt-3 text-[13.5px] leading-[1.8] text-muted pretty">
                          {post.excerpt}
                        </p>
                        <span className="mt-6 inline-flex items-center gap-2 text-[12.5px] tracking-wideish">
                          Read
                          <ArrowRight
                            className="h-3.5 w-3.5 transition-transform duration-500 ease-silk group-hover:translate-x-1.5"
                            strokeWidth={1.4}
                          />
                        </span>
                      </div>
                    </Link>
                  </Tilt>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </>
  );
}
