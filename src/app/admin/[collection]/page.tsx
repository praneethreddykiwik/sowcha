import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCollection } from "@/lib/admin/collections";
import { CollectionEditor } from "@/components/admin/collection-editor";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * One route serves every collection listed in lib/admin/collections.ts.
 * Reserved admin paths (brand, sections, media, orders, login) have their own
 * files and take precedence over this dynamic segment.
 */
export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection: key } = await params;
  const collection = getCollection(key);
  if (!collection) notFound();

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from(collection.table)
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    return (
      <p className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-[13px] text-red-700">
        Could not load {collection.label}: {error.message}
      </p>
    );
  }

  let rows: any[] = data ?? [];

  // Sizes live in their own table; fold them into each product row so the
  // editor can present them as one form.
  if (collection.key === "products" && rows.length) {
    const { data: variants } = await supabase
      .from("product_variants")
      .select("*")
      .in(
        "product_id",
        rows.map((r) => r.id)
      )
      .order("sort_order");

    const byProduct = new Map<string, any[]>();
    for (const v of variants ?? []) {
      const list = byProduct.get(v.product_id) ?? [];
      list.push({
        id: v.id,
        size: v.size ?? "",
        color: v.color ?? "",
        sku: v.sku ?? "",
        price_cents: v.price_cents,
        stock: v.stock ?? 0,
      });
      byProduct.set(v.product_id, list);
    }

    rows = rows.map((r) => ({ ...r, variants: byProduct.get(r.id) ?? [] }));
  }

  return <CollectionEditor collection={collection} initialRows={rows} />;
}
