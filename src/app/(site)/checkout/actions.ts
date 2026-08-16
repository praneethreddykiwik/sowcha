"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { supabasePublic } from "@/lib/supabase/public";
import { CONTENT_TAG } from "@/lib/content";

export type CheckoutItem = {
  product_id: string;
  variant_id: string | null;
  quantity: number;
};

export type CheckoutCustomer = {
  name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  notes: string;
};

export type CheckoutResult =
  | {
      ok: true;
      orderNumber: string;
      totalCents: number;
      subtotalCents: number;
      shippingCents: number;
    }
  | { ok: false; message: string };

/**
 * Places the order through the place_order() database function.
 *
 * Only ids and quantities cross the wire — every price, stock check and total
 * is computed inside the database transaction, so a tampered cart cannot
 * change what is charged or oversell a piece.
 */
export async function placeOrder(
  customer: CheckoutCustomer,
  items: CheckoutItem[],
  paymentMethod: "cod" | "bank_transfer"
): Promise<CheckoutResult> {
  if (!supabasePublic) {
    return { ok: false, message: "The shop is not connected to its database yet." };
  }

  if (!items.length) {
    return { ok: false, message: "Your basket is empty." };
  }
  if (items.length > 50) {
    return { ok: false, message: "That is too many lines for one order." };
  }

  // A server action is a public endpoint — never forward the payload verbatim.
  const cleanItems = items.map((i) => ({
    product_id: String(i.product_id ?? ""),
    variant_id: i.variant_id ? String(i.variant_id) : null,
    quantity: Number(i.quantity),
  }));

  const badLine = cleanItems.find(
    (i) =>
      !i.product_id ||
      !Number.isSafeInteger(i.quantity) ||
      i.quantity < 1 ||
      i.quantity > 20
  );
  if (badLine) {
    return { ok: false, message: "Something in your basket looks wrong. Please try again." };
  }

  // Only these keys reach the database function.
  const cleanCustomer = {
    name: String(customer.name ?? "").trim().slice(0, 120),
    email: String(customer.email ?? "").trim().slice(0, 160),
    phone: String(customer.phone ?? "").trim().slice(0, 40),
    address_line1: String(customer.address_line1 ?? "").trim().slice(0, 200),
    address_line2: String(customer.address_line2 ?? "").trim().slice(0, 200),
    city: String(customer.city ?? "").trim().slice(0, 80),
    state: String(customer.state ?? "").trim().slice(0, 80),
    postal_code: String(customer.postal_code ?? "").trim().slice(0, 20),
    country: String(customer.country ?? "India").trim().slice(0, 80),
    notes: String(customer.notes ?? "").trim().slice(0, 1000),
  };

  // Mirrors lib/validation.ts. The browser form is a convenience; this is the
  // boundary that actually decides what is allowed in.
  const phoneDigits = cleanCustomer.phone.replace(/\D/g, "");
  const pinDigits = cleanCustomer.postal_code.replace(/\D/g, "");

  if (cleanCustomer.name.length < 2) {
    return { ok: false, message: "Please enter your full name." };
  }
  if (!/^[^@\s]+@[^@\s.]+(\.[^@\s.]+)+$/.test(cleanCustomer.email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  if (phoneDigits.length !== 10 || !/^[6-9]/.test(phoneDigits)) {
    return { ok: false, message: "Please enter a valid 10-digit phone number." };
  }
  if (pinDigits.length !== 6 || pinDigits.startsWith("0")) {
    return { ok: false, message: "Please enter a valid 6-digit PIN code." };
  }
  if (cleanCustomer.address_line1.length < 5) {
    return { ok: false, message: "Please enter a complete address." };
  }
  if (cleanCustomer.city.length < 2 || cleanCustomer.state.length < 2) {
    return { ok: false, message: "Please enter your city and state." };
  }

  cleanCustomer.phone = phoneDigits;
  cleanCustomer.postal_code = pinDigits;

  const { data, error } = await supabasePublic.rpc("place_order", {
    p_customer: cleanCustomer,
    p_items: cleanItems,
    p_payment_method: paymentMethod,
  });

  if (error) {
    // Only our own RAISE messages are shopper-facing. Anything else (constraint
    // names, type-cast failures) would leak schema detail, so it is generalised.
    const known =
      /^(Only \d+ left|A piece in your basket|That size is no longer|Your basket is empty|A valid email|A name is required|Invalid quantity|Unsupported payment|Too many lines|A piece in your basket is not priced)/;
    return {
      ok: false,
      message: known.test(error.message)
        ? error.message
        : "We could not complete that order. Please try again, or write to us.",
    };
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!row || typeof row.order_number !== "string") {
    return {
      ok: false,
      message:
        "Your order may have gone through — please check your email or contact us before trying again.",
    };
  }

  // Stock changed, so product pages should re-render.
  revalidateTag(CONTENT_TAG);

  // The email half of the tracking credential travels in an httpOnly cookie
  // rather than the URL, which would otherwise land in history and logs.
  const jar = await cookies();
  jar.set("sowcha-last-order", JSON.stringify({ n: row.order_number, e: cleanCustomer.email }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return {
    ok: true,
    orderNumber: row.order_number,
    totalCents: row.total_cents,
    subtotalCents: row.subtotal_cents,
    shippingCents: row.shipping_cents,
  };
}

/** Order tracking lookup — requires the order number and the matching email. */
export async function lookupOrder(orderNumber: string, email: string) {
  if (!supabasePublic) return null;

  const { data, error } = await supabasePublic.rpc("get_order_status", {
    p_order_number: orderNumber,
    p_email: email,
  });

  if (error) return null;
  return data ?? null;
}
