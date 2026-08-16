"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Butterfly } from "@/components/butterfly";

/**
 * Sign in, or create the account the first time. Access is still decided by the
 * `admin_emails` allowlist in the database — signing up alone grants nothing.
 */
export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);

    const supabase = getSupabaseBrowserClient();

    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;

        if (!data.session) {
          setNotice(
            "Account created. Check your inbox to confirm the address, then sign in."
          );
          setMode("signin");
          return;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }

      router.replace(next);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <Butterfly className="h-14 w-14" strokeWidth={2} />
          <h1 className="mt-6 font-serif text-[30px] font-light leading-none">
            Sow<span className="italic text-ink">Cha</span>
          </h1>
          <p className="mt-2 text-[11px] uppercase tracking-luxe text-muted">
            Content admin
          </p>
        </div>

        <form
          onSubmit={submit}
          className="mt-10 space-y-4 rounded-3xl border border-border bg-card p-7 shadow-soft"
        >
          <label className="block">
            <span className="text-[12px] uppercase tracking-wideish text-muted">
              Email
            </span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-[14px] outline-none transition-colors focus:border-ink/40"
            />
          </label>

          <label className="block">
            <span className="text-[12px] uppercase tracking-wideish text-muted">
              Password
            </span>
            <input
              type="password"
              required
              minLength={6}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-[14px] outline-none transition-colors focus:border-ink/40"
            />
          </label>

          {error && (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-[13px] text-red-700">
              {error}
            </p>
          )}
          {notice && (
            <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-[13px] text-emerald-800">
              {notice}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-[13px] tracking-wideish text-white transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>

          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setNotice(null);
            }}
            className="w-full text-center text-[12.5px] text-muted transition-colors hover:text-foreground"
          >
            {mode === "signin"
              ? "First time here? Create your account"
              : "Already have an account? Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
