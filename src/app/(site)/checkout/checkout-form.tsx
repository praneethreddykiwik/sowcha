"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Banknote, Loader2, Truck } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { ImageFrame } from "@/components/image-frame";
import { FloatingLeaves } from "@/components/floating-leaves";
import type { ArtVariant } from "@/lib/content-types";
import { formatMoney } from "@/lib/money";
import {
  LIMITS,
  sanitiseName,
  sanitisePhone,
  sanitisePlace,
  sanitiseDigits,
  validateAddress,
  validateCity,
  validateEmail,
  validateName,
  validateOptional,
  validatePhone,
  validatePostcode,
  validateState,
  type Validator,
} from "@/lib/validation";
import { placeOrder } from "./actions";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

const field =
  "w-full rounded-2xl border bg-card px-4 py-3 text-[16px] text-foreground outline-none transition-colors duration-300 placeholder:text-muted/60 sm:text-[14px]";

type FieldKey =
  | "name"
  | "email"
  | "phone"
  | "address_line1"
  | "address_line2"
  | "city"
  | "state"
  | "postal_code"
  | "notes";

/** Every rule for the form in one table, so nothing is enforced in only one place. */
const RULES: Record<
  FieldKey,
  {
    label: string;
    required: boolean;
    maxLength: number;
    sanitise: (v: string) => string;
    validate: Validator;
    inputMode?: "text" | "tel" | "numeric" | "email";
    autoComplete?: string;
    placeholder?: string;
    type?: string;
    hint?: string;
  }
> = {
  name: {
    label: "Full name",
    required: true,
    maxLength: LIMITS.name.max,
    sanitise: sanitiseName,
    validate: validateName,
    autoComplete: "name",
    hint: "Letters only",
  },
  email: {
    label: "Email",
    required: true,
    maxLength: LIMITS.email.max,
    sanitise: (v) => v.replace(/\s/g, "").slice(0, LIMITS.email.max),
    validate: validateEmail,
    type: "email",
    inputMode: "email",
    autoComplete: "email",
  },
  phone: {
    label: "Phone",
    required: true,
    maxLength: LIMITS.phoneDigits,
    sanitise: sanitisePhone,
    validate: validatePhone,
    inputMode: "tel",
    autoComplete: "tel",
    placeholder: "10 digits",
    hint: "10 digits, starting 6–9",
  },
  postal_code: {
    label: "PIN code",
    required: true,
    maxLength: LIMITS.postcodeDigits,
    sanitise: (v) => sanitiseDigits(v, LIMITS.postcodeDigits),
    validate: validatePostcode,
    inputMode: "numeric",
    autoComplete: "postal-code",
    placeholder: "6 digits",
    hint: "6 digits",
  },
  address_line1: {
    label: "Address",
    required: true,
    maxLength: LIMITS.address.max,
    sanitise: (v) => v.slice(0, LIMITS.address.max),
    validate: validateAddress,
    autoComplete: "address-line1",
  },
  address_line2: {
    label: "Apartment, landmark (optional)",
    required: false,
    maxLength: LIMITS.address2.max,
    sanitise: (v) => v.slice(0, LIMITS.address2.max),
    validate: validateOptional(LIMITS.address2.max),
    autoComplete: "address-line2",
  },
  city: {
    label: "City",
    required: true,
    maxLength: LIMITS.city.max,
    sanitise: (v) => sanitisePlace(v, LIMITS.city.max),
    validate: validateCity,
    autoComplete: "address-level2",
  },
  state: {
    label: "State",
    required: true,
    maxLength: LIMITS.state.max,
    sanitise: (v) => sanitisePlace(v, LIMITS.state.max),
    validate: validateState,
    autoComplete: "address-level1",
  },
  notes: {
    label: "Anything we should know",
    required: false,
    maxLength: LIMITS.notes.max,
    sanitise: (v) => v.slice(0, LIMITS.notes.max),
    validate: validateOptional(LIMITS.notes.max),
  },
};

const EMPTY: Record<FieldKey, string> = {
  name: "",
  email: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  postal_code: "",
  notes: "",
};

/**
 * Declared at module scope on purpose: a component defined inside CheckoutForm
 * would be a new type on every keystroke, remounting the input and throwing
 * away focus mid-typing.
 */
function Field({
  name,
  value,
  error,
  onChange,
  onBlur,
  className,
}: {
  name: FieldKey;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  className?: string;
}) {
  const rule = RULES[name];

  return (
    <label className={cn("block", className)}>
      <span className="flex items-baseline justify-between gap-2">
        <span className="text-[11px] uppercase tracking-wideish text-muted">
          {rule.label}
          {rule.required && <span className="ml-1 text-accent">*</span>}
        </span>
        {rule.hint && !error && (
          <span className="text-[10.5px] text-muted/70">{rule.hint}</span>
        )}
      </span>

      <input
        id={`field-${name}`}
        type={rule.type ?? "text"}
        inputMode={rule.inputMode}
        autoComplete={rule.autoComplete}
        placeholder={rule.placeholder}
        maxLength={rule.maxLength}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `error-${name}` : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={cn(
          field,
          "mt-2",
          error ? "border-red-400 focus:border-red-500" : "border-border focus:border-ink/40"
        )}
      />

      {error && (
        <span id={`error-${name}`} className="mt-1.5 block text-[12px] text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}

export function CheckoutForm({
  shippingFlatCents,
  freeShippingThresholdCents,
  codEnabled,
  bankTransferEnabled,
  bankTransferNote,
  email: brandEmail,
}: {
  shippingFlatCents: number;
  freeShippingThresholdCents: number;
  codEnabled: boolean;
  bankTransferEnabled: boolean;
  bankTransferNote: string;
  email: string;
}) {
  const router = useRouter();
  const { lines, subtotalCents, clear, ready } = useCart();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<Record<FieldKey, string>>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [payment, setPayment] = useState<"cod" | "bank_transfer">(
    codEnabled ? "cod" : "bank_transfer"
  );

  const errors = (Object.keys(RULES) as FieldKey[]).reduce(
    (acc, key) => {
      const message = RULES[key].validate(form[key]);
      if (message) acc[key] = message;
      return acc;
    },
    {} as Partial<Record<FieldKey, string>>
  );

  const isValid = Object.keys(errors).length === 0;

  const setValue = (key: FieldKey) => (raw: string) =>
    setForm((f) => ({ ...f, [key]: RULES[key].sanitise(raw) }));

  const qualifiesFree = subtotalCents >= freeShippingThresholdCents;
  const shipping = qualifiesFree || lines.length === 0 ? 0 : shippingFlatCents;
  const total = subtotalCents + shipping;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isValid) {
      // Reveal every message at once rather than one per attempt.
      setTouched(
        (Object.keys(RULES) as FieldKey[]).reduce(
          (acc, k) => ({ ...acc, [k]: true }),
          {}
        )
      );
      const firstBad = (Object.keys(RULES) as FieldKey[]).find((k) => errors[k]);
      if (firstBad) {
        document.getElementById(`field-${firstBad}`)?.focus();
      }
      setError("Please correct the highlighted fields.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await placeOrder(
          { ...form, country: "India" },
          lines.map((l) => ({
            product_id: l.productId,
            variant_id: l.variantId,
            quantity: l.quantity,
          })),
          payment
        );

        if (!result.ok) {
          setError(result.message);
          return;
        }

        clear();
        router.push(`/orders/confirmed?order=${encodeURIComponent(result.orderNumber)}`);
      } catch {
        setError(
          "We lost the connection while placing that order. Check your email before trying again — it may have gone through."
        );
      }
    });
  }

  // Before hydration the cart is unknown. Rendering the form here showed a
  // complete checkout with "Subtotal ₹0" to every first-paint visitor.
  if (!ready) {
    return (
      <section className="flex min-h-[70svh] items-center justify-center py-32">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-ink" />
      </section>
    );
  }

  if (lines.length === 0) {
    return (
      <section className="relative flex min-h-[70svh] items-center justify-center overflow-hidden py-32">
        <FloatingLeaves count={6} className="opacity-50" />
        <div className="container relative text-center">
          <h1 className="font-serif text-[clamp(2rem,5vw,3rem)] font-light">
            Your basket is <span className="italic text-ink">empty</span>
          </h1>
          <p className="mx-auto mt-4 max-w-[42ch] text-[15px] leading-relaxed text-muted">
            Nothing to check out just yet.
          </p>
          <Link
            href="/#collection"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3 text-[13px] tracking-wideish text-white"
          >
            Back to the collection
          </Link>
        </div>
      </section>
    );
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
      <FloatingLeaves count={5} className="opacity-40" />

      <div className="container relative">
        <Link
          href="/#collection"
          className="group -ml-1 inline-flex min-h-[44px] items-center gap-2 px-1 text-[12px] tracking-wideish text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft
            className="h-3.5 w-3.5 transition-transform duration-500 ease-silk group-hover:-translate-x-1"
            strokeWidth={1.4}
          />
          Keep looking
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease }}
          className="mt-4 font-serif text-[clamp(2.2rem,5vw,3.4rem)] font-light leading-[1.05]"
        >
          Checkout
        </motion.h1>

        <form onSubmit={submit} noValidate className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <div className="rounded-[28px] border border-border bg-card p-6 sm:p-8">
              <h2 className="font-serif text-[22px] font-light">Where it goes</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field
                  name="name"
                  value={form.name}
                  error={touched.name ? errors.name : undefined}
                  onChange={setValue("name")}
                  onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                />
                <Field
                  name="email"
                  value={form.email}
                  error={touched.email ? errors.email : undefined}
                  onChange={setValue("email")}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                />
                <Field
                  name="phone"
                  value={form.phone}
                  error={touched.phone ? errors.phone : undefined}
                  onChange={setValue("phone")}
                  onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                />
                <Field
                  name="postal_code"
                  value={form.postal_code}
                  error={touched.postal_code ? errors.postal_code : undefined}
                  onChange={setValue("postal_code")}
                  onBlur={() => setTouched((t) => ({ ...t, postal_code: true }))}
                />
                <Field
                  name="address_line1"
                  value={form.address_line1}
                  error={touched.address_line1 ? errors.address_line1 : undefined}
                  onChange={setValue("address_line1")}
                  onBlur={() => setTouched((t) => ({ ...t, address_line1: true }))}
                  className="sm:col-span-2"
                />
                <Field
                  name="address_line2"
                  value={form.address_line2}
                  error={touched.address_line2 ? errors.address_line2 : undefined}
                  onChange={setValue("address_line2")}
                  onBlur={() => setTouched((t) => ({ ...t, address_line2: true }))}
                  className="sm:col-span-2"
                />
                <Field
                  name="city"
                  value={form.city}
                  error={touched.city ? errors.city : undefined}
                  onChange={setValue("city")}
                  onBlur={() => setTouched((t) => ({ ...t, city: true }))}
                />
                <Field
                  name="state"
                  value={form.state}
                  error={touched.state ? errors.state : undefined}
                  onChange={setValue("state")}
                  onBlur={() => setTouched((t) => ({ ...t, state: true }))}
                />
              </div>

              <label className="mt-4 block">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-[11px] uppercase tracking-wideish text-muted">
                    {RULES.notes.label}
                  </span>
                  <span className="text-[10.5px] text-muted/70">
                    {form.notes.length}/{LIMITS.notes.max}
                  </span>
                </span>
                <textarea
                  rows={3}
                  maxLength={LIMITS.notes.max}
                  value={form.notes}
                  onChange={(e) => setValue("notes")(e.target.value)}
                  className={cn(field, "mt-2 resize-y border-border focus:border-ink/40")}
                />
              </label>
            </div>

            <div className="rounded-[28px] border border-border bg-card p-6 sm:p-8">
              <h2 className="font-serif text-[22px] font-light">How you would like to pay</h2>
              <div className="mt-5 space-y-3">
                {codEnabled && (
                  <button
                    type="button"
                    onClick={() => setPayment("cod")}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors duration-300",
                      payment === "cod" ? "border-ink/40 bg-ink/[0.06]" : "border-border hover:border-ink/25"
                    )}
                  >
                    <Truck className="mt-0.5 h-4 w-4 shrink-0 text-muted" strokeWidth={1.4} />
                    <span>
                      <span className="block text-[14px]">Cash on delivery</span>
                      <span className="mt-1 block text-[12.5px] leading-relaxed text-muted">
                        Pay the courier when the parcel reaches you.
                      </span>
                    </span>
                  </button>
                )}
                {bankTransferEnabled && (
                  <button
                    type="button"
                    onClick={() => setPayment("bank_transfer")}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors duration-300",
                      payment === "bank_transfer"
                        ? "border-ink/40 bg-ink/[0.06]"
                        : "border-border hover:border-ink/25"
                    )}
                  >
                    <Banknote className="mt-0.5 h-4 w-4 shrink-0 text-muted" strokeWidth={1.4} />
                    <span>
                      <span className="block text-[14px]">Bank transfer</span>
                      <span className="mt-1 block text-[12.5px] leading-relaxed text-muted">
                        {bankTransferNote ||
                          "We will send account details by email once the order is placed."}
                      </span>
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[28px] border border-border bg-card p-6 sm:p-7">
              <h2 className="font-serif text-[22px] font-light">Your order</h2>

              <ul className="mt-6 space-y-4">
                {lines.map((l) => (
                  <li key={`${l.productId}-${l.variantId ?? "base"}`} className="flex gap-3">
                    <span className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border border-border">
                      <ImageFrame
                        src={l.image}
                        alt={l.name}
                        art={l.art as ArtVariant}
                        seed={l.name.length}
                        sizes="64px"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-serif text-[16px] font-light">
                        {l.name}
                      </span>
                      <span className="mt-0.5 block text-[12px] text-muted">
                        {[l.variantLabel, `Qty ${l.quantity}`].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                    <span className="shrink-0 text-[13.5px] tabular-nums">
                      {formatMoney(l.unitPriceCents * l.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="mt-6 space-y-2 border-t border-border pt-5 text-[13.5px]">
                <div className="flex justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd className="tabular-nums">{formatMoney(subtotalCents)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Shipping</dt>
                  <dd className="tabular-nums">
                    {shipping === 0 ? "Free" : formatMoney(shipping)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-border pt-2.5 text-[17px]">
                  <dt className="font-serif font-light">Total</dt>
                  <dd className="tabular-nums">{formatMoney(total)}</dd>
                </div>
              </dl>

              {error && (
                <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-[13px] leading-relaxed text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={pending || !ready}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[13px] tracking-wideish text-white transition-transform duration-500 ease-silk hover:-translate-y-0.5 disabled:opacity-60"
              >
                {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                Place order
              </button>

              <p className="mt-4 break-words text-center text-[11.5px] leading-relaxed text-muted">
                Questions? Write to {brandEmail}. Prices include taxes.
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
