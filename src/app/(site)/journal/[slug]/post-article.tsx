"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { formatDate } from "@/config/journal";
import type { Block, Post } from "@/lib/content-types";
import { ImageFrame } from "@/components/image-frame";
import { FloatingLeaves } from "@/components/floating-leaves";
import { Butterfly } from "@/components/butterfly";

const ease = [0.16, 1, 0.3, 1] as const;

function BlockView({ block, index }: { block: Block; index: number }) {
  const common = {
    initial: { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-70px" },
    transition: { duration: 0.9, ease, delay: 0.04 * (index % 5) },
  };

  switch (block.type) {
    case "h":
      return (
        <motion.h2
          {...common}
          className="mt-14 font-serif text-[clamp(1.6rem,3vw,2.2rem)] font-light leading-tight"
        >
          {block.text}
        </motion.h2>
      );
    case "p":
      return (
        <motion.p
          {...common}
          className="mt-6 text-[16.5px] leading-[1.95] text-foreground/85 pretty"
        >
          {block.text}
        </motion.p>
      );
    case "quote":
      return (
        <motion.figure {...common} className="my-14 border-l border-accent pl-7">
          <blockquote className="font-serif text-[clamp(1.4rem,2.6vw,1.9rem)] font-light italic leading-[1.5] pretty">
            “{block.text}”
          </blockquote>
          {block.by && (
            <figcaption className="mt-4 text-[12px] uppercase tracking-wideish text-muted">
              {block.by}
            </figcaption>
          )}
        </motion.figure>
      );
    case "list":
      return (
        <motion.ul {...common} className="mt-7 space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3.5 text-[15.5px] leading-[1.85] text-foreground/85">
              <span className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </motion.ul>
      );
    case "image":
      return (
        <motion.figure {...common} className="my-14">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] border border-border bg-card shadow-soft">
            <ImageFrame
              src={block.image}
              alt={block.caption ?? ""}
              art={block.art}
              seed={index + 20}
              sizes="(max-width: 768px) 92vw, 720px"
            />
          </div>
          {block.caption && (
            <figcaption className="mt-3 text-center text-[12.5px] text-muted">
              {block.caption}
            </figcaption>
          )}
        </motion.figure>
      );
  }
}

export function PostArticle({ post, next }: { post: Post; next: Post }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  const { scrollYProgress: heroProgress } = useScroll({
    target: ref,
    offset: ["start start", "60% start"],
  });
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.12]);
  const heroFade = useTransform(heroProgress, [0, 1], [1, 0.25]);

  return (
    <div ref={ref}>
      {/* reading progress */}
      <motion.div
        style={{ scaleX: bar }}
        className="fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-accent"
      />

      {/* hero */}
      <section className="relative overflow-hidden pb-14 pt-36 sm:pt-44">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(110% 70% at 50% 0%, rgb(var(--card)) 0%, rgb(var(--bg)) 60%)",
          }}
        />
        <FloatingLeaves count={6} className="opacity-50" />

        <div className="container relative max-w-3xl text-center">
          <Link
            href="/journal"
            className="group inline-flex items-center gap-2 text-[12px] tracking-wideish text-muted transition-colors duration-400 hover:text-foreground"
          >
            <ArrowLeft
              className="h-3.5 w-3.5 transition-transform duration-500 ease-silk group-hover:-translate-x-1"
              strokeWidth={1.4}
            />
            Journal
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="mt-8 flex items-center justify-center gap-2 text-[11.5px] uppercase tracking-wideish text-muted"
          >
            <span>{post.category}</span>
            <span className="h-1 w-1 rounded-full bg-accent" />
            <span>{formatDate(post.date)}</span>
            <span className="h-1 w-1 rounded-full bg-accent" />
            <span>{post.readingTime}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease, delay: 0.1 }}
            className="mt-6 font-serif text-[clamp(2.2rem,6vw,4rem)] font-light leading-[1.06] tracking-[-0.02em] balance"
          >
            {post.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease, delay: 0.2 }}
            className="mx-auto mt-6 max-w-[54ch] text-[16px] leading-[1.9] text-muted pretty"
          >
            {post.excerpt}
          </motion.p>
        </div>
      </section>

      {/* cover */}
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease, delay: 0.25 }}
          style={{ opacity: heroFade }}
          className="relative mx-auto aspect-[16/9] max-w-5xl overflow-hidden rounded-[36px] border border-border bg-card shadow-lift"
        >
          <motion.div style={{ scale: heroScale }} className="absolute inset-0">
            <ImageFrame
              src={post.image}
              alt={post.title}
              art={post.art}
              seed={4}
              priority
              sizes="(max-width: 1024px) 96vw, 1024px"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* body */}
      <article className="container max-w-[720px] pb-24 pt-16">
        {post.body.map((block, i) => (
          <BlockView key={i} block={block} index={i} />
        ))}

        <div className="mt-20 flex flex-col items-center">
          <Butterfly className="h-10 w-10" strokeWidth={2.2} />
          <p className="mt-4 text-[12px] uppercase tracking-luxe text-muted">
            SowCha · Luxury in Simplicity
          </p>
        </div>
      </article>

      {/* next */}
      <section className="border-t border-border bg-card/40 py-20">
        <div className="container">
          <p className="eyebrow text-center">Next entry</p>
          <Link
            href={`/journal/${next.slug}`}
            className="group mx-auto mt-6 flex max-w-3xl flex-col items-center gap-3 text-center"
          >
            <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-light leading-tight transition-colors duration-500 group-hover:text-ink">
              {next.title}
            </h2>
            <span className="inline-flex items-center gap-2 text-[13px] tracking-wideish text-muted">
              Continue reading
              <ArrowRight
                className="h-4 w-4 transition-transform duration-500 ease-silk group-hover:translate-x-1.5"
                strokeWidth={1.4}
              />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
