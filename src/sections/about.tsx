"use client";

import { motion } from "framer-motion";
import type { SectionCopy, Settings } from "@/lib/content-types";
import { ImageFrame } from "@/components/image-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tilt } from "@/components/ui/tilt";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";

const ease = [0.16, 1, 0.3, 1] as const;

export function About({
  settings,
  copy,
}: {
  settings: Settings;
  copy: SectionCopy;
}) {
  return (
    <section id="about" className="relative overflow-hidden py-28 sm:py-36">
      <div className="container">
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={copy.title}
          accentWords={copy.accentWords}
          subtitle={settings.aboutIntro}
          align="center"
        />

        <div className="mt-20 grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          {/* offset collage — two frames at different depths */}
          <Reveal variant="left" duration={1.2}>
            <div className="scene relative mx-auto w-full max-w-[460px]">
              <div
                aria-hidden
                className="absolute -left-4 -top-4 h-full w-full rounded-[36px] border border-border/70"
              />
              <Tilt intensity={5} lift={6}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] border border-border bg-card shadow-lift">
                  <ImageFrame
                    src={settings.aboutImageUrl}
                    alt="Hand finishing at the SowCha atelier"
                    art="folds"
                    seed={12}
                    sizes="(max-width: 1024px) 90vw, 40vw"
                  />
                </div>
              </Tilt>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease, delay: 0.25 }}
                className="absolute -bottom-10 -right-6 w-[46%] overflow-hidden rounded-3xl border border-border bg-card shadow-lift sm:-right-10"
              >
                <div className="relative aspect-square">
                  <ImageFrame
                    src={settings.aboutImage2Url}
                    alt="Hand-painted vine detail"
                    art="sprig"
                    seed={5}
                    sizes="25vw"
                  />
                </div>
              </motion.div>
            </div>
          </Reveal>

          <Reveal variant="right" duration={1.2} delay={0.1}>
            <p className="text-[16px] leading-[1.95] text-foreground/85 pretty">
              {settings.aboutBody}
            </p>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="eyebrow">Mission</h3>
                <p className="mt-3 text-[14.5px] leading-[1.85] text-muted pretty">
                  {settings.mission}
                </p>
              </div>
              <div>
                <h3 className="eyebrow">Vision</h3>
                <p className="mt-3 text-[14.5px] leading-[1.85] text-muted pretty">
                  {settings.vision}
                </p>
              </div>
            </div>

            <figure className="mt-10 border-l border-accent pl-6">
              <blockquote className="font-serif text-[22px] font-light italic leading-[1.55] text-foreground/90 pretty">
                “{settings.founderNote}”
              </blockquote>
              <figcaption className="mt-3 text-[12px] uppercase tracking-wideish text-muted">
                {settings.founderName}
              </figcaption>
            </figure>
          </Reveal>
        </div>

        {/* timeline */}
        <div className="mt-28">
          <div className="rule" />
          <RevealGroup className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {settings.timeline.map((item) => (
              <RevealItem key={item.year} variant="up">
                <div className="group relative">
                  <span className="font-serif text-[46px] font-light leading-none text-ink/25 transition-colors duration-700 group-hover:text-ink/50">
                    {item.year}
                  </span>
                  <h3 className="mt-3 font-serif text-[21px] font-light">{item.title}</h3>
                  <p className="mt-2 text-[14px] leading-[1.8] text-muted pretty">
                    {item.body}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/* values */}
        <div className="mt-24 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {settings.values.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, ease, delay: i * 0.08 }}
              whileHover={{ y: -5 }}
              className="glass rounded-3xl p-7 shadow-soft transition-shadow duration-700 hover:shadow-lift"
              style={{ transformStyle: "preserve-3d" }}
            >
              <span className="block h-1.5 w-1.5 rounded-full bg-accent" />
              <h3 className="mt-5 font-serif text-[22px] font-light">{value.title}</h3>
              <p className="mt-2 text-[13.5px] leading-[1.8] text-muted pretty">
                {value.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
