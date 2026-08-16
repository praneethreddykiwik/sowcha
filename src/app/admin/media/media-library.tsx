"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { Check, Copy, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { deleteMedia, registerMedia } from "@/app/admin/actions";
import { MEDIA_BUCKET } from "@/lib/supabase/config";

type MediaRow = {
  id: string;
  path: string;
  public_url: string;
  size_bytes: number | null;
  created_at: string;
};

const kb = (bytes: number | null) =>
  bytes ? `${Math.round(bytes / 1024).toLocaleString()} KB` : "—";

/**
 * Every uploaded file in one place. Uploading here is a convenience — images
 * are normally added from within whichever item they belong to.
 */
export function MediaLibrary({ initial }: { initial: MediaRow[] }) {
  const [rows, setRows] = useState<MediaRow[]>(initial);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(files: FileList) {
    setBusy(true);
    setError(null);
    const supabase = getSupabaseBrowserClient();

    try {
      for (const file of Array.from(files)) {
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
          .upload(path, file, { cacheControl: "31536000" });
        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);

        await registerMedia(path, publicUrl, file.size);

        setRows((current) => [
          {
            id: crypto.randomUUID(),
            path,
            public_url: publicUrl,
            size_bytes: file.size,
            created_at: new Date().toISOString(),
          },
          ...current,
        ]);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function remove(row: MediaRow) {
    if (!window.confirm("Delete this image? Anything using it falls back to the illustration."))
      return;

    startTransition(async () => {
      const result = await deleteMedia(row.id, row.path);
      if (result.ok) setRows((current) => current.filter((r) => r.id !== row.id));
      else setError(result.message);
    });
  }

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-[34px] font-light leading-none">
            Media library
          </h1>
          <p className="mt-2 text-[14px] text-muted">
            {rows.length} image{rows.length === 1 ? "" : "s"} in Supabase Storage.
          </p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[13px] text-white disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
          Upload
        </button>
      </header>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files?.length) upload(e.target.files);
          e.target.value = "";
        }}
      />

      {error && (
        <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
          {error}
        </p>
      )}

      {rows.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-border px-5 py-12 text-center text-[14px] text-muted">
          No uploads yet. The site is showing its drawn illustrations.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <figure
              key={row.id}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="relative aspect-[4/3] bg-background">
                <Image
                  src={row.public_url}
                  alt={row.path}
                  fill
                  sizes="(max-width: 640px) 92vw, 300px"
                  className="object-cover"
                />
              </div>
              <figcaption className="flex items-center justify-between gap-2 px-3 py-2.5">
                <span className="min-w-0">
                  <span className="block truncate text-[12.5px]">{row.path}</span>
                  <span className="block text-[11.5px] text-muted">
                    {kb(row.size_bytes)}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    aria-label="Copy URL"
                    onClick={() => {
                      navigator.clipboard.writeText(row.public_url);
                      setCopied(row.id);
                      window.setTimeout(() => setCopied(null), 1800);
                    }}
                    className="rounded-full p-2 text-muted transition-colors hover:text-foreground"
                  >
                    {copied === row.id ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    aria-label="Delete"
                    onClick={() => remove(row)}
                    className="rounded-full p-2 text-muted transition-colors hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
