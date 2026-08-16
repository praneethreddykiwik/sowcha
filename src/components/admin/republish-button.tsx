"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, RefreshCw } from "lucide-react";
import { republish } from "@/app/admin/actions";

/** Manual cache flush — useful after editing rows directly in Supabase. */
export function RepublishButton() {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await republish();
          setDone(true);
          window.setTimeout(() => setDone(false), 2500);
        })
      }
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-[13px] text-muted transition-colors hover:border-ink/40 hover:text-foreground disabled:opacity-60"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : done ? (
        <Check className="h-4 w-4 text-emerald-600" />
      ) : (
        <RefreshCw className="h-4 w-4" />
      )}
      {done ? "Live site refreshed" : "Refresh live site"}
    </button>
  );
}
