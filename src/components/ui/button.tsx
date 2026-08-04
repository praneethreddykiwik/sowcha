"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-sans font-medium transition-all duration-500 ease-silk disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // `ink` rather than `primary`: the pale Blossom/Lavender primaries
        // cannot carry white text at accessible contrast.
        primary:
          "bg-ink text-white shadow-soft hover:shadow-lift hover:-translate-y-0.5",
        outline:
          "border border-border bg-card/60 text-foreground backdrop-blur hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-soft",
        ghost: "text-foreground hover:bg-primary/[0.07]",
        link: "text-foreground underline-offset-[6px] hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-[12px] tracking-wideish",
        md: "h-11 px-6 text-[13px] tracking-wideish",
        lg: "h-[52px] px-8 text-[13px] tracking-wideish",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

/** Soft ripple that follows the pointer — the "button ripple" in the spec. */
function useRipple() {
  const [ripples, setRipples] = React.useState<
    { id: number; x: number; y: number }[]
  >([]);

  const push = React.useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now() + Math.random();
    setRipples((r) => [
      ...r,
      { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
    ]);
    window.setTimeout(
      () => setRipples((r) => r.filter((item) => item.id !== id)),
      750
    );
  }, []);

  const node = (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute h-0 w-0 animate-[ripple_0.75s_ease-out_forwards] rounded-full bg-current opacity-20"
          style={{ left: r.x, top: r.y }}
        />
      ))}
    </span>
  );

  return { push, node };
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, onClick, ...props }, ref) => {
    const ripple = useRipple();
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        onClick={(e) => {
          ripple.push(e);
          onClick?.(e);
        }}
        {...props}
      >
        <span className="relative z-10 inline-flex items-center gap-2">
          {children}
        </span>
        {/* slow sheen on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1100 ease-silk group-hover:translate-x-full"
        />
        {ripple.node}
      </button>
    );
  }
);
Button.displayName = "Button";

type LinkButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants>;

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1100 ease-silk group-hover:translate-x-full"
      />
    </a>
  )
);
LinkButton.displayName = "LinkButton";

export { buttonVariants };
