"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Loader2, Search } from "lucide-react";
import { lookupOrder } from "../../checkout/actions";
import { OrderSummary } from "@/components/orders/order-summary";
import { FloatingLeaves } from "@/components/floating-leaves";
import { cn } from "@/lib/utils";
import {
  LIMITS,
  sanitiseOrderNumber,
  validateEmail,
  validateOrderNumber,
} from "@/lib/validation";

const ease = [0.16, 1, 0.3, 1] as const;

const field =
  "w-full rounded-2xl border border-border bg-card px-4 py-3 text-[16px] outline-none sm:text-[14px] transition-colors duration-300 placeholder:text-muted/60 focus:border-ink/40";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function TrackForm() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [touched, setTouched] = useState({ order: false, email: false });
  const [pending, startTransition] = useTransition();

  const orderError = validateOrderNumber(orderNumber);
  const emailError = validateEmail(email);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setNotFound(false);
    setOrder(null);

    if (orderError || emailError) {
      setTouched({ order: true, email: true });
      return;
    }

    startTransition(async () => {
      const result = await lookupOrder(orderNumber, email);
      if (result) setOrder(result);
      else setNotFound(true);
    });
  }

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
      <FloatingLeaves count={6} className="opacity-45" />

      <div className="container relative max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease }}
          className="text-center"
        >
          <p className="eyebrow">Order tracking</p>
          <h1 className="mt-5 font-serif text-[clamp(2.2rem,5vw,3.4rem)] font-light leading-[1.05]">
            Where is my <span className="italic text-ink">parcel</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[46ch] text-[15px] leading-[1.9] text-muted pretty">
            Enter the order number from your confirmation, along with the email
            you used.
          </p>
        </motion.div>

        <form
          onSubmit={submit}
          noValidate
          className="mt-10 rounded-[28px] border border-border bg-card p-6 sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-[11px] uppercase tracking-wideish text-muted">
                Order number
              </span>
              <input
                required
                value={orderNumber}
                placeholder="SC-2026-1001-AB12"
                maxLength={LIMITS.orderNumber.max}
                inputMode="text"
                autoCapitalize="characters"
                aria-invalid={Boolean(touched.order && orderError)}
                onChange={(e) => setOrderNumber(sanitiseOrderNumber(e.target.value))}
                onBlur={() => setTouched((t) => ({ ...t, order: true }))}
                className={cn(
                  field,
                  "mt-2 uppercase tabular-nums",
                  touched.order && orderError && "border-red-400"
                )}
              />
              {touched.order && orderError && (
                <span className="mt-1.5 block text-[12px] text-red-600">{orderError}</span>
              )}
            </label>
            <label className="block">
              <span className="text-[11px] uppercase tracking-wideish text-muted">
                Email
              </span>
              <input
                required
                type="email"
                inputMode="email"
                value={email}
                maxLength={LIMITS.email.max}
                aria-invalid={Boolean(touched.email && emailError)}
                onChange={(e) => setEmail(e.target.value.replace(/\s/g, ""))}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                className={cn(
                  field,
                  "mt-2",
                  touched.email && emailError && "border-red-400"
                )}
              />
              {touched.email && emailError && (
                <span className="mt-1.5 block text-[12px] text-red-600">{emailError}</span>
              )}
            </label>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[13px] tracking-wideish text-white transition-transform duration-500 ease-silk hover:-translate-y-0.5 disabled:opacity-60"
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" strokeWidth={1.5} />
            )}
            Find my order
          </button>

          {notFound && (
            <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-[13px] leading-relaxed text-red-700">
              No order matches that number and email. Check both, or write to us
              and we will look it up.
            </p>
          )}
        </form>

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="mt-8"
          >
            <OrderSummary order={order} />
          </motion.div>
        )}
      </div>
    </section>
  );
}
