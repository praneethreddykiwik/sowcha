"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient, isCurrentUserAdmin } from "@/lib/supabase/server";
import { CONTENT_TAG } from "@/lib/content";

export type ActionResult = { ok: boolean; message: string; id?: string };

/**
 * Drops the cached content read and re-renders every public route, so an edit
 * is visible on the live site the moment Save returns.
 */
function publish() {
  revalidateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
  revalidatePath("/journal");
}

async function guard() {
  if (!(await isCurrentUserAdmin())) {
    throw new Error("Not authorised — this account is not on the admin list.");
  }
  return createSupabaseServerClient();
}

/** Insert or update a single row in a content table. */
export async function saveRow(
  table: string,
  id: string | null,
  values: Record<string, unknown>
): Promise<ActionResult> {
  try {
    const supabase = await guard();

    let rowId = id;

    if (id) {
      const { error } = await supabase.from(table).update(values).eq("id", id);
      if (error) throw error;
    } else {
      const { data, error } = await supabase
        .from(table)
        .insert(values)
        .select("id")
        .single();
      if (error) throw error;
      rowId = data?.id ?? null;
    }

    publish();
    return {
      ok: true,
      id: rowId ?? undefined,
      message: id ? "Saved and published." : "Created and published.",
    };
  } catch (error) {
    return { ok: false, message: (error as Error).message };
  }
}

export async function deleteRow(table: string, id: string): Promise<ActionResult> {
  try {
    const supabase = await guard();
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) throw error;

    publish();
    return { ok: true, message: "Deleted." };
  } catch (error) {
    return { ok: false, message: (error as Error).message };
  }
}

/** Persists a new ordering (array of ids in display order). */
export async function reorderRows(
  table: string,
  orderedIds: string[]
): Promise<ActionResult> {
  try {
    const supabase = await guard();

    await Promise.all(
      orderedIds.map((id, index) =>
        supabase.from(table).update({ sort_order: index + 1 }).eq("id", id)
      )
    );

    publish();
    return { ok: true, message: "Order saved." };
  } catch (error) {
    return { ok: false, message: (error as Error).message };
  }
}

/** The single settings row. */
export async function saveSettings(
  values: Record<string, unknown>
): Promise<ActionResult> {
  try {
    const supabase = await guard();
    const { error } = await supabase
      .from("site_settings")
      .upsert({ id: 1, ...values }, { onConflict: "id" });
    if (error) throw error;

    publish();
    return { ok: true, message: "Brand details saved and published." };
  } catch (error) {
    return { ok: false, message: (error as Error).message };
  }
}

/** One section heading block (eyebrow / title / accent words / subtitle). */
export async function saveSectionCopy(
  key: string,
  values: {
    eyebrow: string;
    title: string;
    accent_words: string[];
    subtitle: string;
  }
): Promise<ActionResult> {
  try {
    const supabase = await guard();
    const { error } = await supabase
      .from("section_copy")
      .upsert({ key, ...values }, { onConflict: "key" });
    if (error) throw error;

    publish();
    return { ok: true, message: "Section copy saved and published." };
  } catch (error) {
    return { ok: false, message: (error as Error).message };
  }
}

/** Records an upload in the media library after it lands in Storage. */
export async function registerMedia(
  path: string,
  publicUrl: string,
  sizeBytes: number,
  alt = ""
): Promise<ActionResult> {
  try {
    const supabase = await guard();
    const { error } = await supabase
      .from("media")
      .upsert(
        { path, public_url: publicUrl, size_bytes: sizeBytes, alt },
        { onConflict: "path" }
      );
    if (error) throw error;
    return { ok: true, message: "Uploaded." };
  } catch (error) {
    return { ok: false, message: (error as Error).message };
  }
}

export async function deleteMedia(
  id: string,
  path: string
): Promise<ActionResult> {
  try {
    const supabase = await guard();

    const { error: storageError } = await supabase.storage
      .from("media")
      .remove([path]);
    if (storageError) throw storageError;

    const { error } = await supabase.from("media").delete().eq("id", id);
    if (error) throw error;

    publish();
    return { ok: true, message: "Image deleted." };
  } catch (error) {
    return { ok: false, message: (error as Error).message };
  }
}

/** Manual "push to live" button on the dashboard. */
export async function republish(): Promise<ActionResult> {
  try {
    await guard();
    publish();
    return { ok: true, message: "Live site refreshed." };
  } catch (error) {
    return { ok: false, message: (error as Error).message };
  }
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}


/* ---------------- commerce ---------------- */

export type VariantInput = {
  id?: string;
  size: string;
  color: string;
  sku: string;
  price_cents: number | null;
  stock: number;
};

/**
 * Replaces a product's size rows.
 *
 * Rows that still exist are updated in place so their ids survive — an id is
 * referenced by order_items, and recreating them would orphan order history.
 */
export async function saveProductVariants(
  productId: string,
  variants: VariantInput[]
): Promise<ActionResult> {
  try {
    const supabase = await guard();

    const { data: existing, error: readError } = await supabase
      .from("product_variants")
      .select("id")
      .eq("product_id", productId);
    if (readError) throw readError;

    const keptIds = variants.map((v) => v.id).filter(Boolean) as string[];
    const toDelete = (existing ?? [])
      .map((r) => r.id as string)
      .filter((existingId) => !keptIds.includes(existingId));

    if (toDelete.length) {
      const { error } = await supabase
        .from("product_variants")
        .delete()
        .in("id", toDelete);
      if (error) throw error;
    }

    for (const [index, variant] of variants.entries()) {
      const payload = {
        product_id: productId,
        size: variant.size ?? "",
        color: variant.color ?? "",
        sku: variant.sku || null,
        price_cents: variant.price_cents,
        stock: Number.isFinite(variant.stock) ? variant.stock : 0,
        sort_order: index + 1,
        is_active: true,
      };

      if (variant.id) {
        const { error } = await supabase
          .from("product_variants")
          .update(payload)
          .eq("id", variant.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("product_variants").insert(payload);
        if (error) throw error;
      }
    }

    publish();
    return { ok: true, message: "Sizes saved." };
  } catch (error) {
    return { ok: false, message: (error as Error).message };
  }
}

/** Moves an order along its fulfilment status. */
export async function updateOrder(
  id: string,
  values: {
    status?: string;
    payment_status?: string;
    courier?: string;
    tracking_number?: string;
  }
): Promise<ActionResult> {
  try {
    const supabase = await guard();
    const { error } = await supabase.from("orders").update(values).eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/orders");
    return { ok: true, message: "Order updated." };
  } catch (error) {
    return { ok: false, message: (error as Error).message };
  }
}
