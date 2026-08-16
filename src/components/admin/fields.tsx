"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Trash2, X } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { registerMedia } from "@/app/admin/actions";
import { MEDIA_BUCKET } from "@/lib/supabase/config";
import { cn } from "@/lib/utils";

/* ---------------- layout ---------------- */

export function Label({
  children,
  help,
}: {
  children: ReactNode;
  help?: string;
}) {
  return (
    <span className="block">
      <span className="block text-[12px] font-medium uppercase tracking-wideish text-muted">
        {children}
      </span>
      {help && (
        <span className="mt-1 block text-[12px] leading-relaxed text-muted/80">
          {help}
        </span>
      )}
    </span>
  );
}

const inputClass =
  "w-full rounded-2xl border border-border bg-card px-4 py-3 text-[14px] text-foreground outline-none transition-colors duration-300 placeholder:text-muted/60 focus:border-ink/40";

export function TextField({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
    />
  );
}

export function TextArea({
  value,
  onChange,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      value={value ?? ""}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      className={cn(inputClass, "resize-y leading-relaxed")}
    />
  );
}

export function SelectField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className={cn(inputClass, "cursor-pointer capitalize")}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

export function Toggle({
  value,
  onChange,
  label,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className="flex items-center gap-3"
    >
      <span
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors duration-300",
          value ? "bg-ink" : "bg-border"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300",
            value ? "translate-x-[22px]" : "translate-x-0.5"
          )}
        />
      </span>
      <span className="text-[13px] text-foreground">{label}</span>
    </button>
  );
}

/** text[] columns — materials, accent words. */
export function TagsField({
  value,
  onChange,
  placeholder = "Type and press Enter",
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const list = Array.isArray(value) ? value : [];

  const commit = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (!list.includes(trimmed)) onChange([...list, trimmed]);
    setDraft("");
  };

  return (
    <div className={cn(inputClass, "flex flex-wrap items-center gap-2 py-2.5")}>
      {list.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink/10 px-3 py-1 text-[12px] text-foreground"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(list.filter((t) => t !== tag))}
            aria-label={`Remove ${tag}`}
            className="text-muted hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        placeholder={list.length ? "" : placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commit();
          }
          if (e.key === "Backspace" && !draft && list.length) {
            onChange(list.slice(0, -1));
          }
        }}
        onBlur={commit}
        className="min-w-[120px] flex-1 bg-transparent text-[14px] outline-none placeholder:text-muted/60"
      />
    </div>
  );
}

/* ---------------- image upload ---------------- */

/**
 * Uploads straight from the browser to Supabase Storage using the admin's
 * session, then records the file in the media table. The parent form only ever
 * deals with the resulting public URL.
 */
export function ImageField({
  value,
  onChange,
  label = "Photo",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("That image is over 10 MB — please resize it first.");
      }

      const supabase = getSupabaseBrowserClient();
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const safe = file.name
        .replace(/\.[^.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 48);
      const path = `${safe || "image"}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(MEDIA_BUCKET)
        .upload(path, file, { cacheControl: "31536000", upsert: false });
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);

      await registerMedia(path, publicUrl, file.size);
      onChange(publicUrl);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) upload(file);
        }}
        className="relative flex min-h-[180px] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-card"
      >
        {value ? (
          <>
            <Image
              src={value}
              alt={label}
              fill
              sizes="320px"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 flex justify-between gap-2 bg-gradient-to-t from-black/60 to-transparent p-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-full bg-white/90 px-3 py-1.5 text-[12px] text-neutral-900"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => onChange(null)}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[12px] text-neutral-900"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center gap-2 px-6 py-8 text-muted transition-colors hover:text-foreground"
          >
            {busy ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <ImagePlus className="h-6 w-6" strokeWidth={1.4} />
            )}
            <span className="text-[13px]">
              {busy ? "Uploading…" : "Click or drop an image here"}
            </span>
            <span className="text-[11.5px] text-muted/70">
              JPG, PNG, WebP or AVIF · up to 10 MB
            </span>
          </button>
        )}

        {busy && value && (
          <span className="absolute inset-0 grid place-items-center bg-black/40">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />

      {error && <p className="mt-2 text-[12px] text-red-600">{error}</p>}
      {!value && !error && (
        <p className="mt-2 text-[12px] text-muted">
          No photo yet — the site shows the drawn illustration instead.
        </p>
      )}
    </div>
  );
}
