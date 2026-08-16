"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ExternalLink,
  Files,
  HelpCircle,
  Images,
  Layers,
  LayoutGrid,
  Leaf,
  LogOut,
  Menu,
  MessageSquareQuote,
  Newspaper,
  Settings,
  Shirt,
  Type,
  X,
} from "lucide-react";
import { signOut } from "@/app/admin/actions";
import { Butterfly } from "@/components/butterfly";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutGrid, exact: true },
  { href: "/admin/brand", label: "Brand & contact", icon: Settings },
  { href: "/admin/sections", label: "Section headings", icon: Type },
  { href: "/admin/products", label: "Products", icon: Shirt },
  { href: "/admin/capsules", label: "Capsules", icon: Layers },
  { href: "/admin/categories", label: "Category tiles", icon: Files },
  { href: "/admin/gallery_items", label: "Gallery", icon: Images },
  { href: "/admin/posts", label: "Journal", icon: Newspaper },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/sustainability_points", label: "Sustainability", icon: Leaf },
  { href: "/admin/media", label: "Media library", icon: Images },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex h-full flex-col gap-1 p-4">
      <Link
        href="/admin"
        onClick={() => setOpen(false)}
        className="mb-4 flex items-center gap-2.5 px-2 py-2"
      >
        <Butterfly className="h-7 w-7" strokeWidth={2.4} flutter={false} />
        <span className="font-serif text-[22px] leading-none">
          Sow<span className="italic text-ink">Cha</span>
          <span className="ml-2 align-middle text-[10px] uppercase tracking-luxe text-muted">
            Admin
          </span>
        </span>
      </Link>

      {links.map((link) => {
        const Icon = link.icon;
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[13.5px] transition-colors duration-300",
              active
                ? "bg-ink/10 text-foreground"
                : "text-muted hover:bg-ink/[0.05] hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            {link.label}
          </Link>
        );
      })}

      <div className="mt-auto space-y-1 border-t border-border pt-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[13.5px] text-muted transition-colors hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
          View live site
        </a>
        <p className="truncate px-3 pt-2 text-[11.5px] text-muted">{email}</p>
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-[13.5px] text-muted transition-colors hover:text-foreground"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
            Sign out
          </button>
        </form>
      </div>
    </nav>
  );

  return (
    <>
      {/* desktop rail */}
      <aside className="fixed inset-y-0 left-0 hidden w-[260px] border-r border-border bg-card/60 backdrop-blur lg:block">
        {nav}
      </aside>

      {/* mobile bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 backdrop-blur lg:hidden">
        <span className="font-serif text-[20px]">
          Sow<span className="italic text-ink">Cha</span>{" "}
          <span className="text-[10px] uppercase tracking-luxe text-muted">Admin</span>
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open admin menu"
          className="rounded-full border border-border p-2"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[min(84vw,300px)] bg-background shadow-lift">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-3 rounded-full p-2 text-muted"
            >
              <X className="h-4 w-4" />
            </button>
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
