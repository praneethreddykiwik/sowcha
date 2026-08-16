import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser, isCurrentUserAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Deployed without the Supabase keys: say so plainly instead of throwing.
  // The public site keeps working from its bundled content.
  if (!isSupabaseConfigured) {
    return (
      <div className="grid min-h-screen place-items-center bg-background p-6">
        <div className="max-w-lg rounded-3xl border border-border bg-card p-10">
          <h1 className="font-serif text-[28px] font-light">Admin not configured</h1>
          <p className="mt-3 text-[14px] leading-relaxed text-muted">
            This deployment has no Supabase credentials, so the admin cannot
            load. Add these in your hosting environment and redeploy:
          </p>
          <pre className="mt-5 overflow-x-auto rounded-2xl bg-background p-4 text-[12.5px] leading-relaxed">
{`NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY`}
          </pre>
          <p className="mt-5 text-[13px] leading-relaxed text-muted">
            The public site is unaffected — it falls back to the content bundled
            in the repository.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-full bg-ink px-6 py-2.5 text-[13px] text-white"
          >
            Back to the site
          </Link>
        </div>
      </div>
    );
  }

  const user = await getCurrentUser();

  // The login page renders itself; middleware handles the redirect for the rest.
  if (!user) return <>{children}</>;

  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-background p-6">
        <div className="max-w-md rounded-3xl border border-border bg-card p-10 text-center">
          <h1 className="font-serif text-[28px] font-light">Not on the list</h1>
          <p className="mt-3 text-[14px] leading-relaxed text-muted">
            You are signed in as <strong>{user.email}</strong>, but that address
            is not an admin for this site. Add it to the{" "}
            <code className="rounded bg-background px-1.5 py-0.5 text-[12.5px]">
              admin_emails
            </code>{" "}
            table in Supabase, then reload.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-full bg-ink px-6 py-2.5 text-[13px] text-white"
          >
            Back to the site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNav email={user.email ?? ""} />
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:pl-[280px]">
        {children}
      </div>
    </div>
  );
}
