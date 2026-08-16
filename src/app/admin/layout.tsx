import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser, isCurrentUserAdmin } from "@/lib/supabase/server";
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
