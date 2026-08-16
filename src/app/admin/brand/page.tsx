import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BrandForm } from "./brand-form";

export default async function BrandPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  return <BrandForm initial={data ?? {}} />;
}
