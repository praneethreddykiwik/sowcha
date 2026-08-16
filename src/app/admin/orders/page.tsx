import { createSupabaseServerClient } from "@/lib/supabase/server";
import { OrdersBoard } from "./orders-board";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const supabase = await createSupabaseServerClient();

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return (
      <p className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-[13px] text-red-700">
        Could not load orders: {error.message}
      </p>
    );
  }

  return <OrdersBoard orders={orders ?? []} />;
}
