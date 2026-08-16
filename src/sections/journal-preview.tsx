"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/config/journal";
import type { Post, SectionCopy } from "@/lib/content-types";
import { ImageFrame } from "@/components/image-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";
import { Tilt } from "@/components/ui/tilt";

const ease = [0.16, 1, 0.3, 1] as const;

export function JournalPreview({
  posts,
  copy,
}: {
  posts: Post[];
  copy: SectionCopy;
}) {
  const featured = posts.slice(0, 3);

  return (
    <section id="journal" className="relative py-28 sm:py-36">
      <div className="container">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow={copy.eyebrow}
            title={copy.title}
            accentWords={copy.accentWords}
            align="left"
            subtitle={copy.subtitle}
          />
          <LinkButton href="/journal" variant="outline" className="shrink-0">
            All entries
            <ArrowRight className="h-4 w-4" strokeWidth={1.4} />
          </LinkButton>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {featured.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 38, rotateX: 8 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, ease, delay: i * 0.1 }}
              style={{ transformStyle: "preserve-3d" }}
              className="h-full"
            >
              <Tilt intensity={5} lift={7} className="h-full">
                <Link
                  href={`/journal/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-border bg-card shadow-soft transition-shadow duration-700 ease-silk hover:shadow-lift"
                >
                  <div className="relative aspect-[16/11] overflow-hidden">
                    <ImageFrame
                      src={post.image}
                      alt={post.title}
                      art={post.art}
                      seed={i + 90}
                      sizes="(max-width: 1024px) 92vw, 32vw"
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
                    <h3 className="mt-4 font-serif text-[25px] font-light leading-[1.2]">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-[13.5px] leading-[1.8] text-muted pretty">
                      {post.excerpt}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-[12.5px] tracking-wideish text-foreground">
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
        </div>
      </div>
    </section>
  );
}
