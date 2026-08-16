/**
 * Input rules used by the checkout, the tracking form and the admin.
 *
 * Two layers, deliberately:
 *   sanitise* — runs on every keystroke and makes the wrong character
 *               impossible to type (no minus sign in a stock box, no letters
 *               in a phone number).
 *   validate* — runs on blur and on submit, and produces the message.
 *
 * Both are mirrored server-side in the checkout action and by CHECK
 * constraints in Postgres, because a disabled button stops nobody.
 */

export const LIMITS = {
  name: { min: 2, max: 120 },
  email: { max: 160 },
  phoneDigits: 10,
  postcodeDigits: 6,
  address: { min: 5, max: 200 },
  address2: { max: 200 },
  city: { min: 2, max: 80 },
  state: { min: 2, max: 80 },
  notes: { max: 1000 },
  orderNumber: { max: 24 },
  /** ₹0 – ₹10,00,000 in paise. */
  priceCents: { min: 0, max: 100_000_000 },
  stock: { min: 0, max: 99_999 },
  sku: { max: 40 },
  size: { max: 24 },
  courier: { max: 60 },
  tracking: { max: 60 },
} as const;

/* ------------------------------------------------------------ sanitisers */

/** Digits only, capped. Used for phone and postcode. */
export const sanitiseDigits = (value: string, max: number) =>
  value.replace(/\D/g, "").slice(0, max);

/**
 * Phone typed with +91, spaces or hyphens still ends up as ten digits.
 * A leading 91 or 0 is dropped so pasting "+91 90909 09090" works.
 */
export function sanitisePhone(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length > 10 && digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, LIMITS.phoneDigits);
}

/** Letters, spaces, apostrophes and hyphens — no digits or symbols. */
export const sanitiseName = (value: string) =>
  value.replace(/[^\p{L}\s'’.-]/gu, "").replace(/\s{2,}/g, " ").slice(0, LIMITS.name.max);

export const sanitisePlace = (value: string, max: number) =>
  value.replace(/[^\p{L}\s'’.-]/gu, "").replace(/\s{2,}/g, " ").slice(0, max);

/** Non-negative integer, clamped. Typing "-" or "e" simply does nothing. */
export function sanitiseInteger(value: string, min: number, max: number) {
  const digits = value.replace(/\D/g, "");
  if (digits === "") return min;
  return Math.min(Math.max(parseInt(digits, 10), min), max);
}

/**
 * Money in rupees: digits and at most one decimal point, at most two decimal
 * places, never negative.
 */
export function sanitiseMoneyInput(value: string) {
  let v = value.replace(/[^\d.]/g, "");
  const first = v.indexOf(".");
  if (first !== -1) {
    v = v.slice(0, first + 1) + v.slice(first + 1).replace(/\./g, "");
    const [whole, dec = ""] = v.split(".");
    v = `${whole.slice(0, 8)}.${dec.slice(0, 2)}`;
  } else {
    v = v.slice(0, 8);
  }
  return v;
}

export const sanitiseOrderNumber = (value: string) =>
  value.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, LIMITS.orderNumber.max);

export const sanitiseSku = (value: string) =>
  value.toUpperCase().replace(/[^A-Z0-9\-_]/g, "").slice(0, LIMITS.sku.max);

/* ------------------------------------------------------------ validators */

export type Validator = (value: string) => string | null;

export const required =
  (label: string): Validator =>
  (v) =>
    v.trim() ? null : `${label} is required.`;

export const validateName: Validator = (v) => {
  const t = v.trim();
  if (!t) return "Please enter your full name.";
  if (t.length < LIMITS.name.min) return "That name looks too short.";
  if (t.length > LIMITS.name.max) return `Keep it under ${LIMITS.name.max} characters.`;
  if (!/\p{L}/u.test(t)) return "Please use letters.";
  return null;
};

export const validateEmail: Validator = (v) => {
  const t = v.trim();
  if (!t) return "Please enter your email.";
  if (t.length > LIMITS.email.max) return "That email is too long.";
  // Deliberately permissive but structural: something@something.tld
  if (!/^[^@\s]+@[^@\s.]+(\.[^@\s.]+)+$/.test(t)) return "That email does not look right.";
  return null;
};

export const validatePhone: Validator = (v) => {
  const d = v.replace(/\D/g, "");
  if (!d) return "Please enter a phone number — the courier needs it.";
  if (d.length !== LIMITS.phoneDigits) return "Enter all 10 digits.";
  if (!/^[6-9]/.test(d)) return "Indian mobile numbers start with 6, 7, 8 or 9.";
  return null;
};

export const validatePostcode: Validator = (v) => {
  const d = v.replace(/\D/g, "");
  if (!d) return "Please enter your PIN code.";
  if (d.length !== LIMITS.postcodeDigits) return "A PIN code is 6 digits.";
  if (/^0/.test(d)) return "A PIN code does not start with 0.";
  return null;
};

export const validateAddress: Validator = (v) => {
  const t = v.trim();
  if (!t) return "Please enter your address.";
  if (t.length < LIMITS.address.min) return "That address looks too short.";
  if (t.length > LIMITS.address.max) return `Keep it under ${LIMITS.address.max} characters.`;
  return null;
};

export const validateCity: Validator = (v) => {
  const t = v.trim();
  if (!t) return "Please enter your city.";
  if (t.length < LIMITS.city.min) return "That looks too short.";
  return null;
};

export const validateState: Validator = (v) => {
  const t = v.trim();
  if (!t) return "Please enter your state.";
  if (t.length < LIMITS.state.min) return "That looks too short.";
  return null;
};

export const validateOptional =
  (max: number): Validator =>
  (v) =>
    v.length > max ? `Keep it under ${max} characters.` : null;

export const validateOrderNumber: Validator = (v) => {
  const t = v.trim().toUpperCase();
  if (!t) return "Enter your order number.";
  if (!/^SC-\d{4}-\d{4}(-[A-Z0-9]{4})?$/.test(t)) {
    return "Order numbers look like SC-2026-1001-AB12.";
  }
  return null;
};
