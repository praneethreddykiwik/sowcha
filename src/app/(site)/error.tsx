"use client";

import Link from "next/link";
import { Butterfly } from "@/components/butterfly";
import { FloatingLeaves } from "@/components/floating-leaves";

/**
 * Keeps a failed page inside the site's own shell — a transient Supabase
 * hiccup mid-purchase should not blank the browser.
 */
export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="relative flex min-h-[80svh] items-center justify-center overflow-hidden py-32">
      <FloatingLeaves count={7} className="opacity-50" />
      <div className="container relative max-w-xl text-center">
        <Butterfly className="mx-auto h-20 w-20" strokeWidth={2} />
        <h1 className="mt-10 font-serif text-[clamp(2rem,5vw,3rem)] font-light leading-tight">
          Something went <span className="italic text-ink">quiet</span>
        </h1>
        <p className="mx-auto mt-5 max-w-[44ch] text-[15px] leading-[1.9] text-muted pretty">
          We could not load that just now. Your basket is safe — try again, or
          carry on browsing.
        </p>
        {error.digest && (
          <p className="mt-3 text-[11.5px] text-muted/70">Reference {error.digest}</p>
        )}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-ink px-7 py-3 text-[13px] tracking-wideish text-white transition-transform duration-500 ease-silk hover:-translate-y-0.5"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-border px-7 py-3 text-[13px] tracking-wideish transition-colors hover:border-ink/40"
          >
            Back to the shop
          </Link>
        </div>
      </div>
    </section>
  );
}
