import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCollection } from "@/lib/admin/collections";
import { CollectionEditor } from "@/components/admin/collection-editor";

/**
 * One route serves every collection listed in lib/admin/collections.ts.
 * Reserved admin paths (brand, sections, media, login) have their own files and
 * take precedence over this dynamic segment.
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

  return <CollectionEditor collection={collection} initialRows={data ?? []} />;
}
