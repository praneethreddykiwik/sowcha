"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, Loader2, Package, Search, X } from "lucide-react";
import { updateOrder } from "@/app/admin/actions";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import { LIMITS } from "@/lib/validation";

/* eslint-disable @typescript-eslint/no-explicit-any */

const STATUSES = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

const PAYMENT_STATUSES = ["unpaid", "paid", "refunded"] as const;

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  confirmed: "bg-sky-50 text-sky-800 border-sky-200",
  packed: "bg-indigo-50 text-indigo-800 border-indigo-200",
  shipped: "bg-violet-50 text-violet-800 border-violet-200",
  delivered: "bg-emerald-50 text-emerald-800 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export function OrdersBoard({ orders: initial }: { orders: any[] }) {
  const [orders, setOrders] = useState(initial);
  const [shipping, setShipping] = useState({ courier: "", tracking_number: "" });
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<any>(null);
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ ok: boolean; message: string } | null>(null);

  const stats = useMemo(() => {
    const live = orders.filter((o) => o.status !== "cancelled");
    return {
      count: orders.length,
      revenue: live.reduce((n, o) => n + (o.total_cents ?? 0), 0),
      openCount: orders.filter((o) =>
        ["pending", "confirmed", "packed"].includes(o.status)
      ).length,
    };
  }, [orders]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter !== "all" && o.status !== filter) return false;
      if (!q) return true;
      return (
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_email.toLowerCase().includes(q)
      );
    });
  }, [orders, filter, query]);

  function patch(order: any, values: Record<string, string>) {
    startTransition(async () => {
      const result = await updateOrder(order.id, values);
      setToast(result);
      window.setTimeout(() => setToast(null), 3000);

      if (result.ok) {
        setOrders((current) =>
          current.map((o) => (o.id === order.id ? { ...o, ...values } : o))
        );
        setOpen((current: any) =>
          current && current.id === order.id ? { ...current, ...values } : current
        );
      }
    });
  }

  return (
    <div>
      <header>
        <h1 className="font-serif text-[34px] font-light leading-none">Orders</h1>
        <p className="mt-2 text-[14px] text-muted">
          Everything placed through the shop, newest first.
        </p>
      </header>

      {/* stats */}
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Orders", value: String(stats.count) },
          { label: "Revenue", value: formatMoney(stats.revenue) },
          { label: "Awaiting fulfilment", value: String(stats.openCount) },
        ].map((s) => (
          <div key={s.label} className="rounded-3xl border border-border bg-card p-5">
            <span className="text-[11px] uppercase tracking-luxe text-muted">
              {s.label}
            </span>
            <p className="mt-2 font-serif text-[28px] font-light leading-none tabular-nums">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {toast && (
        <div
          className={cn(
            "fixed inset-x-4 bottom-4 z-[60] rounded-2xl border px-4 py-3 text-[13px] shadow-lift sm:inset-x-auto sm:right-6 sm:max-w-sm",
            toast.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
          )}
        >
          {toast.message}
        </div>
      )}

      {/* filters */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Order number, name or email"
            maxLength={120}
            className="w-full rounded-full border border-border bg-card py-3 pl-9 pr-4 text-[16px] outline-none transition-colors focus:border-ink/40 sm:text-[13px]"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["all", ...STATUSES].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={cn(
                "rounded-full border px-3.5 py-3 text-[12px] capitalize transition-colors duration-300",
                filter === s
                  ? "border-ink/40 bg-ink/10 text-foreground"
                  : "border-border text-muted hover:border-ink/25 hover:text-foreground"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* list */}
      <ul className="mt-6 space-y-2">
        {visible.length === 0 && (
          <li className="rounded-2xl border border-dashed border-border px-5 py-12 text-center text-[14px] text-muted">
            {orders.length === 0
              ? "No orders yet. They appear here the moment someone checks out."
              : "No orders match that filter."}
          </li>
        )}

        {visible.map((o) => (
          <li key={o.id}>
            <button
              type="button"
              onClick={() => {
                setOpen(o);
                setShipping({
                  courier: o.courier ?? "",
                  tracking_number: o.tracking_number ?? "",
                });
              }}
              className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-shadow duration-500 hover:shadow-soft"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/[0.07]">
                <Package className="h-4 w-4 text-muted" strokeWidth={1.4} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-medium tabular-nums">{o.order_number}</span>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10.5px] uppercase tracking-wideish",
                      STATUS_STYLE[o.status] ?? "border-border text-muted"
                    )}
                  >
                    {o.status}
                  </span>
                  {o.payment_status === "paid" && (
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10.5px] uppercase tracking-wideish text-emerald-800">
                      paid
                    </span>
                  )}
                </span>
                <span className="mt-1 block truncate text-[13px] text-muted">
                  {o.customer_name} · {o.customer_email} · {formatDate(o.created_at)}
                </span>
              </span>

              <span className="shrink-0 text-right">
                <span className="block text-[15px] tabular-nums">
                  {formatMoney(o.total_cents)}
                </span>
                <span className="block text-[11.5px] text-muted">
                  {(o.order_items ?? []).length} item
                  {(o.order_items ?? []).length === 1 ? "" : "s"}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* detail */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 p-4 backdrop-blur-sm sm:p-8">
          <div className="w-full max-w-2xl rounded-3xl border border-border bg-background shadow-lift">
            <header className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl border-b border-border bg-background px-6 py-4">
              <div>
                <h2 className="font-serif text-[22px] font-light">
                  {open.order_number}
                </h2>
                <p className="mt-0.5 text-[12.5px] text-muted">
                  {formatDate(open.created_at)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(null)}
                aria-label="Close"
                className="rounded-full p-3.5 text-muted transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="space-y-6 px-6 py-6">
              {/* customer */}
              <section>
                <h3 className="eyebrow">Customer</h3>
                <p className="mt-2 text-[14px]">{open.customer_name}</p>
                <p className="break-all text-[13px] text-muted">{open.customer_email}</p>
                {open.customer_phone && (
                  <p className="text-[13px] text-muted">{open.customer_phone}</p>
                )}
                <p className="mt-2 text-[13px] leading-relaxed text-muted">
                  {[
                    open.address_line1,
                    open.address_line2,
                    open.city,
                    open.state,
                    open.postal_code,
                    open.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                {open.notes && (
                  <p className="mt-3 rounded-2xl bg-ink/[0.06] px-4 py-3 text-[13px] leading-relaxed">
                    {open.notes}
                  </p>
                )}
              </section>

              {/* items */}
              <section>
                <h3 className="eyebrow">Items</h3>
                <ul className="mt-3 space-y-2">
                  {(open.order_items ?? []).map((item: any) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-border px-4 py-3 text-[13.5px]"
                    >
                      <span className="min-w-0">
                        <span className="block truncate">{item.product_name}</span>
                        <span className="block text-[12px] text-muted">
                          {[item.variant_label, `Qty ${item.quantity}`]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      </span>
                      <span className="shrink-0 tabular-nums">
                        {formatMoney(item.line_total_cents)}
                      </span>
                    </li>
                  ))}
                </ul>

                <dl className="mt-4 space-y-1.5 text-[13.5px]">
                  <div className="flex justify-between">
                    <dt className="text-muted">Subtotal</dt>
                    <dd className="tabular-nums">{formatMoney(open.subtotal_cents)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">Shipping</dt>
                    <dd className="tabular-nums">
                      {open.shipping_cents === 0 ? "Free" : formatMoney(open.shipping_cents)}
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 text-[16px]">
                    <dt className="font-serif font-light">Total</dt>
                    <dd className="tabular-nums">{formatMoney(open.total_cents)}</dd>
                  </div>
                </dl>
              </section>

              {/* fulfilment */}
              <section>
                <h3 className="eyebrow">Fulfilment</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={pending}
                      onClick={() => patch(open, { status: s })}
                      className={cn(
                        "rounded-full border px-3.5 py-3 text-[12px] capitalize transition-colors duration-300 disabled:opacity-50",
                        open.status === s
                          ? STATUS_STYLE[s]
                          : "border-border text-muted hover:border-ink/30 hover:text-foreground"
                      )}
                    >
                      {open.status === s && <Check className="mr-1 inline h-3 w-3" />}
                      {s}
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {PAYMENT_STATUSES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={pending}
                      onClick={() => patch(open, { payment_status: s })}
                      className={cn(
                        "rounded-full border px-3.5 py-3 text-[12px] capitalize transition-colors duration-300 disabled:opacity-50",
                        open.payment_status === s
                          ? "border-ink/40 bg-ink/10 text-foreground"
                          : "border-border text-muted hover:border-ink/30"
                      )}
                    >
                      Payment: {s}
                    </button>
                  ))}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[11px] uppercase tracking-wideish text-muted">
                      Courier
                    </span>
                    <input
                      value={shipping.courier}
                      maxLength={LIMITS.courier.max}
                      onChange={(e) =>
                        setShipping((s) => ({
                          ...s,
                          courier: e.target.value.slice(0, LIMITS.courier.max),
                        }))
                      }
                      className="mt-2 w-full rounded-2xl border border-border bg-card px-4 py-3 text-[16px] outline-none focus:border-ink/40 sm:text-[13.5px]"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[11px] uppercase tracking-wideish text-muted">
                      Tracking number
                    </span>
                    <input
                      value={shipping.tracking_number}
                      maxLength={LIMITS.tracking.max}
                      onChange={(e) =>
                        setShipping((s) => ({
                          ...s,
                          tracking_number: e.target.value
                            .toUpperCase()
                            .replace(/[^A-Z0-9\-_]/g, "")
                            .slice(0, LIMITS.tracking.max),
                        }))
                      }
                      className="mt-2 w-full rounded-2xl border border-border bg-card px-4 py-3 text-[16px] outline-none focus:border-ink/40 sm:text-[13.5px]"
                    />
                  </label>
                </div>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => patch(open, shipping)}
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[12.5px] text-white disabled:opacity-60"
                >
                  <Check className="h-3.5 w-3.5" />
                  Save tracking
                </button>
                <p className="mt-2 text-[11.5px] text-muted">
                  The shopper sees the courier and tracking number on the tracking
                  page as soon as you save.
                </p>
              </section>
            </div>

            <footer className="flex items-center justify-between gap-3 border-t border-border px-6 py-4">
              <span className="text-[12.5px] text-muted">
                {pending ? "Saving…" : "Changes save immediately."}
              </span>
              {pending && <Loader2 className="h-4 w-4 animate-spin text-muted" />}
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
