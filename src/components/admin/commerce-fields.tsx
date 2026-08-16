"use client";

import { Plus, Trash2 } from "lucide-react";
import { formatMoney, parseMoneyToCents } from "@/lib/money";
import { LIMITS, sanitiseInteger, sanitiseMoneyInput, sanitiseSku } from "@/lib/validation";
import type { VariantInput } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const input =
  "w-full rounded-2xl border border-border bg-card px-4 py-3 text-[16px] sm:text-[14px] text-foreground outline-none transition-colors duration-300 placeholder:text-muted/60 focus:border-ink/40";

/**
 * Money is entered in rupees but stored as integer paise, so the admin never
 * has to think about minor units and the database never sees a float.
 */
export function MoneyField({
  value,
  onChange,
  allowEmpty = false,
}: {
  value: number | null;
  onChange: (cents: number | null) => void;
  allowEmpty?: boolean;
}) {
  const display = value === null || value === undefined ? "" : String(value / 100);

  return (
    <div>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-muted">
          ₹
        </span>
        <input
          inputMode="decimal"
          value={display}
          placeholder={allowEmpty ? "—" : "0"}
          maxLength={11}
          onChange={(e) => {
            // Minus signs, letters and a second decimal point never make it in.
            const raw = sanitiseMoneyInput(e.target.value);
            if (raw === "") {
              onChange(allowEmpty ? null : 0);
              return;
            }
            const cents = Math.min(parseMoneyToCents(raw), LIMITS.priceCents.max);
            onChange(cents);
          }}
          className={cn(input, "pl-9 tabular-nums")}
        />
      </div>
      {value ? (
        <p className="mt-1.5 text-[11.5px] text-muted">Shows as {formatMoney(value)}</p>
      ) : (
        !allowEmpty && (
          <p className="mt-1.5 text-[11.5px] text-amber-700">
            A piece priced at ₹0 cannot be bought — set a price before publishing.
          </p>
        )
      )}
    </div>
  );
}

/** Size / colour rows, each with their own stock and optional price override. */
export function VariantsField({
  value,
  onChange,
}: {
  value: VariantInput[];
  onChange: (rows: VariantInput[]) => void;
}) {
  const rows = Array.isArray(value) ? value : [];

  const update = (index: number, patch: Partial<VariantInput>) =>
    onChange(rows.map((r, i) => (i === index ? { ...r, ...patch } : r)));

  const totalStock = rows.reduce((n, r) => n + (Number(r.stock) || 0), 0);

  return (
    <div>
      {rows.length > 0 && (
        <div className="mb-3 flex items-center justify-between text-[12px] text-muted">
          <span>
            {rows.length} size{rows.length === 1 ? "" : "s"}
          </span>
          <span>{totalStock} in stock</span>
        </div>
      )}

      <div className="space-y-2">
        {rows.map((row, i) => (
          <div
            key={row.id ?? `new-${i}`}
            className="grid grid-cols-2 items-end gap-2 rounded-2xl border border-border bg-background/60 p-3 sm:grid-cols-[1.1fr_1.1fr_1fr_0.9fr_auto]"
          >
            <label className="block min-w-0">
              <span className="text-[10.5px] uppercase tracking-wideish text-muted">
                Size
              </span>
              <input
                value={row.size ?? ""}
                placeholder="M"
                maxLength={LIMITS.size.max}
                onChange={(e) => update(i, { size: e.target.value.slice(0, LIMITS.size.max) })}
                className={cn(input, "mt-1 px-3 py-3 text-[16px] sm:text-[13px]")}
              />
            </label>

            <label className="block min-w-0">
              <span className="text-[10.5px] uppercase tracking-wideish text-muted">
                Stock
              </span>
              <input
                inputMode="numeric"
                value={String(row.stock ?? 0)}
                maxLength={5}
                onChange={(e) =>
                  update(i, {
                    stock: sanitiseInteger(e.target.value, LIMITS.stock.min, LIMITS.stock.max),
                  })
                }
                className={cn(input, "mt-1 px-3 py-3 text-[16px] tabular-nums sm:text-[13px]")}
              />
            </label>

            <label className="block min-w-0">
              <span className="text-[10.5px] uppercase tracking-wideish text-muted">
                SKU
              </span>
              <input
                value={row.sku ?? ""}
                maxLength={LIMITS.sku.max}
                onChange={(e) => update(i, { sku: sanitiseSku(e.target.value) })}
                className={cn(input, "mt-1 px-3 py-3 text-[16px] sm:text-[13px]")}
              />
            </label>

            <label className="block min-w-0">
              <span className="text-[10.5px] uppercase tracking-wideish text-muted">
                Price override
              </span>
              <input
                inputMode="decimal"
                placeholder="—"
                value={
                  row.price_cents === null || row.price_cents === undefined
                    ? ""
                    : String(row.price_cents / 100)
                }
                maxLength={11}
                onChange={(e) => {
                  const raw = sanitiseMoneyInput(e.target.value);
                  update(i, {
                    price_cents:
                      raw === ""
                        ? null
                        : Math.min(parseMoneyToCents(raw), LIMITS.priceCents.max),
                  });
                }}
                className={cn(input, "mt-1 px-3 py-3 text-[16px] tabular-nums sm:text-[13px]")}
              />
            </label>

            <button
              type="button"
              onClick={() => onChange(rows.filter((_, j) => j !== i))}
              aria-label="Remove size"
              className="col-span-2 mb-1 justify-self-end rounded-full p-3.5 text-muted transition-colors hover:text-red-600 sm:col-span-1"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() =>
            onChange([...rows, { size: "", color: "", sku: "", price_cents: null, stock: 0 }])
          }
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-3 text-[12px] text-muted transition-colors hover:border-ink/40 hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5" />
          Add size
        </button>

        {rows.length === 0 && (
          <button
            type="button"
            onClick={() =>
              onChange(
                ["XS", "S", "M", "L", "XL"].map((size) => ({
                  size,
                  color: "",
                  sku: "",
                  price_cents: null,
                  stock: 0,
                }))
              )
            }
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-3 text-[12px] text-muted transition-colors hover:border-ink/40 hover:text-foreground"
          >
            Add XS–XL
          </button>
        )}
      </div>

      {rows.length === 0 && (
        <p className="mt-3 text-[12px] leading-relaxed text-muted">
          No sizes yet — the piece will sell as one item using the stock number
          above.
        </p>
      )}
    </div>
  );
}
