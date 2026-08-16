/**
 * All money moves through the app as integer minor units (paise), matching the
 * database. Formatting is the only place it becomes a decimal.
 */

export function formatMoney(cents: number, currency = "INR") {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    // Whole rupees stay clean; anything carrying paise shows them rather than
    // silently rounding to a figure that is not what gets charged.
    minimumFractionDigits: 0,
    maximumFractionDigits: (cents ?? 0) % 100 === 0 ? 0 : 2,
  }).format(Number.isFinite(cents) ? cents / 100 : 0);
}

/** Parses a rupee string from an admin field into paise. */
export function parseMoneyToCents(value: string): number {
  // Keep only the first decimal point so "1.2.3" does not silently become 0,
  // which would publish a free product.
  const cleaned = String(value).replace(/[^0-9.]/g, "");
  const [whole, ...rest] = cleaned.split(".");
  const normalised = rest.length ? `${whole}.${rest.join("")}` : whole;
  const n = Number(normalised);
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) : 0;
}

export const centsToUnits = (cents: number) => (cents ?? 0) / 100;
