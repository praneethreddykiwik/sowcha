"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Pointer-driven 3D tilt with an optional soft glare sweep.
 * Kept intentionally shallow (max ~8deg) — the brief asks for whispering, not shouting.
 */
export function Tilt({
  children,
  className,
  intensity = 7,
  glare = true,
  lift = 6,
  scale = 1.01,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
  lift?: number;
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const hovered = useMotionValue(0);

  const spring = { stiffness: 140, damping: 20, mass: 0.6 };
  const rotateX = useSpring(
    useTransform(py, [0, 1], [intensity, -intensity]),
    spring
  );
  const rotateY = useSpring(
    useTransform(px, [0, 1], [-intensity, intensity]),
    spring
  );
  const translateY = useSpring(useTransform(hovered, [0, 1], [0, -lift]), spring);
  const scaleSpring = useSpring(useTransform(hovered, [0, 1], [1, scale]), spring);

  const glareX = useTransform(px, (v) => `${v * 100}%`);
  const glareY = useTransform(py, (v) => `${v * 100}%`);
  const glareOpacity = useSpring(useTransform(hovered, [0, 1], [0, 0.5]), spring);
  const glareBg = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, rgb(255 255 255 / 0.75), transparent 62%)`;

  return (
    <div className={cn("scene", className)}>
      <motion.div
        ref={ref}
        onPointerMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - rect.left) / rect.width);
          py.set((e.clientY - rect.top) / rect.height);
        }}
        onPointerEnter={() => hovered.set(1)}
        onPointerLeave={() => {
          hovered.set(0);
          px.set(0.5);
          py.set(0.5);
        }}
        style={{
          rotateX,
          rotateY,
          y: translateY,
          scale: scaleSpring,
          transformStyle: "preserve-3d",
        }}
        className="relative h-full w-full"
      >
        {children}
        {glare && (
          <motion.span
            aria-hidden
            style={{ background: glareBg, opacity: glareOpacity }}
            className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light"
          />
        )}
      </motion.div>
    </div>
  );
}

/** Pushes a child forward on the Z axis inside a <Tilt>. */
export function Layer({
  z = 40,
  className,
  children,
}: {
  z?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(className)}
      style={{ transform: `translateZ(${z}px)`, transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}
