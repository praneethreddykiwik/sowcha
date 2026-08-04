import Link from "next/link";
import { Butterfly } from "@/components/butterfly";
import { FloatingLeaves } from "@/components/floating-leaves";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center justify-center overflow-hidden py-32">
      <FloatingLeaves count={8} className="opacity-60" />
      <div className="container relative text-center">
        <Butterfly className="mx-auto h-24 w-24" strokeWidth={2} />
        <h1 className="mt-10 font-serif text-[clamp(2.4rem,6vw,4rem)] font-light leading-tight">
          This page went <span className="italic text-ink">quiet</span>
        </h1>
        <p className="mx-auto mt-5 max-w-[44ch] text-[15px] leading-[1.9] text-muted pretty">
          The thread you followed does not lead anywhere. Everything else is still
          where you left it.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex h-12 items-center rounded-full bg-ink px-8 text-[13px] tracking-wideish text-white transition-transform duration-500 ease-silk hover:-translate-y-0.5"
        >
          Return home
        </Link>
      </div>
    </section>
  );
}
