/** Every admin route is force-dynamic, so each navigation waits on Supabase. */
export default function AdminLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-9 w-56 rounded-2xl bg-border/60" />
      <div className="mt-3 h-4 w-80 rounded-xl bg-border/40" />
      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 rounded-3xl border border-border bg-card" />
        ))}
      </div>
      <div className="mt-6 space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-2xl border border-border bg-card" />
        ))}
      </div>
    </div>
  );
}
