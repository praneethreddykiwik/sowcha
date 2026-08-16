import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MediaLibrary } from "./media-library";

export default async function MediaPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });

  return <MediaLibrary initial={data ?? []} />;
}
