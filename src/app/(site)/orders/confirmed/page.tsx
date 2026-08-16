import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { Check } from "lucide-react";
import { lookupOrder } from "../../checkout/actions";
import { FloatingLeaves } from "@/components/floating-leaves";
import { Butterfly } from "@/components/butterfly";
import { OrderSummary } from "@/components/orders/order-summary";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

export default async function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  // The email half of the credential comes from the httpOnly cookie the
  // checkout action set, so it never appears in a URL, history entry or log.
  const jar = await cookies();
  let email: string | null = null;
  try {
    const raw = jar.get("sowcha-last-order")?.value;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.n === order && typeof parsed.e === "string") email = parsed.e;
    }
  } catch {
    // Malformed cookie: fall through to the "no details" state below.
  }

  const data = order && email ? await lookupOrder(order, email) : null;

  return (
    <section className="relative overflow-hidden pb-28 pt-32 sm:pt-40">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(110% 60% at 50% 0%, rgb(var(--card)) 0%, rgb(var(--bg)) 60%)",
        }}
      />
      <FloatingLeaves count={7} className="opacity-50" />

      <div className="container relative max-w-2xl text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink/10">
          <Check className="h-6 w-6 text-ink" strokeWidth={1.5} />
        </span>

        <h1 className="mt-8 font-serif text-[clamp(2.2rem,5vw,3.4rem)] font-light leading-[1.05]">
          Thank you — it is <span className="italic text-ink">ours to make</span>
        </h1>

        {order ? (
          <p className="mx-auto mt-5 max-w-[46ch] text-[15px] leading-[1.9] text-muted pretty">
            Your order is <strong className="text-foreground">{order}</strong>. Write
            it down — that number and your email are how you track the parcel. We
            will be in touch to confirm.
          </p>
        ) : (
          <p className="mx-auto mt-5 max-w-[46ch] text-[15px] leading-[1.9] text-muted">
            We could not find that order reference.
          </p>
        )}

        <Suspense>
          {data && (
            <div className="mt-12 text-left">
              <OrderSummary order={data} />
            </div>
          )}
        </Suspense>

        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/orders/track"
            className="rounded-full bg-ink px-7 py-3 text-[13px] tracking-wideish text-white"
          >
            Track this order
          </Link>
          <Link
            href="/#collection"
            className="rounded-full border border-border px-7 py-3 text-[13px] tracking-wideish transition-colors hover:border-ink/40"
          >
            Continue browsing
          </Link>
        </div>

        <div className="mt-16 flex flex-col items-center">
          <Butterfly className="h-9 w-9" strokeWidth={2.2} />
          <p className="mt-3 text-[11px] uppercase tracking-luxe text-muted">
            SowCha · Luxury in Simplicity
          </p>
        </div>
      </div>
    </section>
  );
}
