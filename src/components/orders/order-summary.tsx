import { ImageFrame } from "@/components/image-frame";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */

const STAGES = [
  { key: "pending", label: "Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "packed", label: "Packed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
] as const;

const STATUS_COPY: Record<string, string> = {
  pending: "We have your order and are confirming the pieces.",
  confirmed: "Confirmed — your pieces are set aside.",
  packed: "Folded into cloth and packed.",
  shipped: "On its way to you.",
  delivered: "Delivered. We hope it was worth the wait.",
  cancelled: "This order was cancelled.",
};

/** Shared by the confirmation page and the tracking page. */
export function OrderSummary({ order }: { order: any }) {
  const cancelled = order.status === "cancelled";
  const currentIndex = STAGES.findIndex((s) => s.key === order.status);

  return (
    <div className="rounded-[28px] border border-border bg-card p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <span className="eyebrow">Order</span>
          <p className="mt-1.5 font-serif text-[24px] font-light leading-none">
            {order.order_number}
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1.5 text-[11px] uppercase tracking-wideish",
            cancelled ? "bg-red-50 text-red-700" : "bg-ink/10 text-foreground"
          )}
        >
          {order.status}
        </span>
      </div>

      <p className="mt-4 text-[13.5px] leading-relaxed text-muted">
        {STATUS_COPY[order.status] ?? ""}
      </p>

      {/* progress rail */}
      {!cancelled && (
        <ol className="mt-7 flex items-center gap-1">
          {STAGES.map((stage, i) => {
            const done = i <= currentIndex;
            return (
              <li key={stage.key} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <span className="flex w-full items-center">
                  <span
                    className={cn(
                      "h-1 flex-1 rounded-full",
                      i === 0 ? "bg-transparent" : done ? "bg-ink" : "bg-border"
                    )}
                  />
                  <span
                    className={cn(
                      "h-2.5 w-2.5 shrink-0 rounded-full",
                      done ? "bg-ink" : "bg-border"
                    )}
                  />
                  <span
                    className={cn(
                      "h-1 flex-1 rounded-full",
                      i === STAGES.length - 1
                        ? "bg-transparent"
                        : i < currentIndex
                          ? "bg-ink"
                          : "bg-border"
                    )}
                  />
                </span>
                <span
                  className={cn(
                    "w-full break-words text-center text-[10.5px] uppercase leading-tight tracking-wideish",
                    done ? "text-foreground" : "text-muted"
                  )}
                >
                  {stage.label}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      {order.tracking_number && (
        <p className="mt-6 break-all rounded-2xl bg-ink/[0.06] px-4 py-3 text-[13px] leading-relaxed">
          <span className="text-muted">Tracking · </span>
          {order.courier ? `${order.courier} — ` : ""}
          <strong>{order.tracking_number}</strong>
        </p>
      )}

      <ul className="mt-7 space-y-4 border-t border-border pt-6">
        {(order.items ?? []).map((item: any, i: number) => (
          <li key={i} className="flex gap-3">
            <span className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border border-border">
              <ImageFrame
                src={item.image_url}
                alt={item.product_name}
                art="folds"
                seed={i + 3}
                sizes="64px"
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-serif text-[16px] font-light">
                {item.product_name}
              </span>
              <span className="mt-0.5 block text-[12px] text-muted">
                {[item.variant_label, `Qty ${item.quantity}`].filter(Boolean).join(" · ")}
              </span>
            </span>
            <span className="shrink-0 text-[13.5px] tabular-nums">
              {formatMoney(item.line_total_cents)}
            </span>
          </li>
        ))}
      </ul>

      <dl className="mt-6 space-y-2 border-t border-border pt-5 text-[13.5px]">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd className="tabular-nums">{formatMoney(order.subtotal_cents)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Shipping</dt>
          <dd className="tabular-nums">
            {order.shipping_cents === 0 ? "Free" : formatMoney(order.shipping_cents)}
          </dd>
        </div>
        <div className="flex justify-between border-t border-border pt-2.5 text-[17px]">
          <dt className="font-serif font-light">Total</dt>
          <dd className="tabular-nums">{formatMoney(order.total_cents)}</dd>
        </div>
        <div className="flex justify-between pt-1">
          <dt className="text-muted">Payment</dt>
          <dd className="text-right capitalize">
            {order.payment_method === "cod" ? "Cash on delivery" : "Bank transfer"} ·{" "}
            {order.payment_status}
          </dd>
        </div>
      </dl>
    </div>
  );
}
