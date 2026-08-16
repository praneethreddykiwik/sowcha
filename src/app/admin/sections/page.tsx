import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SECTION_LABELS } from "@/lib/admin/collections";
import { SectionsForm } from "./sections-form";

export default async function SectionsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("section_copy").select("*");

  const rows = Object.keys(SECTION_LABELS).map((key) => {
    const existing = data?.find((r) => r.key === key);
    return {
      key,
      eyebrow: existing?.eyebrow ?? "",
      title: existing?.title ?? "",
      accent_words: existing?.accent_words ?? [],
      subtitle: existing?.subtitle ?? "",
    };
  });

  return <SectionsForm rows={rows} />;
}
