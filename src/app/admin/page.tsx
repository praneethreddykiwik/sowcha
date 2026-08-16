import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { collections } from "@/lib/admin/collections";
import { RepublishButton } from "@/components/admin/republish-button";

export default async function AdminDashboard() {
  const supabase = await createSupabaseServerClient();

  const counts = await Promise.all(
    collections.map(async (c) => {
      const { count } = await supabase
        .from(c.table)
        .select("*", { count: "exact", head: true });
      return { ...c, count: count ?? 0 };
    })
  );

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-[38px] font-light leading-none">
            Everything on the site
          </h1>
          <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-muted">
            Edit any text or swap any image here. Each save publishes straight to
            the live site — no build, no deploy.
          </p>
        </div>
        <RepublishButton />
      </header>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        <Link
          href="/admin/brand"
          className="group rounded-3xl border border-border bg-card p-6 transition-shadow duration-500 hover:shadow-soft"
        >
          <span className="text-[11px] uppercase tracking-luxe text-muted">
            Start here
          </span>
          <h2 className="mt-3 font-serif text-[24px] font-light">Brand &amp; contact</h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
            Name, tagline, the about story, mission, vision, phone, email,
            address, opening hours, values and timeline.
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-[12.5px]">
            Edit
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Link>

        <Link
          href="/admin/sections"
          className="group rounded-3xl border border-border bg-card p-6 transition-shadow duration-500 hover:shadow-soft"
        >
          <span className="text-[11px] uppercase tracking-luxe text-muted">Copy</span>
          <h2 className="mt-3 font-serif text-[24px] font-light">Section headings</h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
            The eyebrow, headline and intro paragraph above every section of the
            home page.
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-[12.5px]">
            Edit
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Link>
      </div>

      <h2 className="mt-12 text-[11px] uppercase tracking-luxe text-muted">
        Collections
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {counts.map((c) => (
          <Link
            key={c.key}
            href={`/admin/${c.key}`}
            className="group rounded-3xl border border-border bg-card p-5 transition-shadow duration-500 hover:shadow-soft"
          >
            <div className="flex items-baseline justify-between">
              <h3 className="font-serif text-[21px] font-light">{c.label}</h3>
              <span className="text-[13px] text-muted">{c.count}</span>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              {c.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
