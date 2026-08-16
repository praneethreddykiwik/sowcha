"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { saveSectionCopy } from "@/app/admin/actions";
import { SECTION_LABELS } from "@/lib/admin/collections";
import { Label, TagsField, TextArea, TextField } from "@/components/admin/fields";
import { cn } from "@/lib/utils";

type SectionRow = {
  key: string;
  eyebrow: string;
  title: string;
  accent_words: string[];
  subtitle: string;
};

export function SectionsForm({ rows }: { rows: SectionRow[] }) {
  const [state, setState] = useState<SectionRow[]>(rows);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [toast, setToast] = useState<{ key: string; ok: boolean; message: string } | null>(
    null
  );
  const [, startTransition] = useTransition();

  const update = (key: string, patch: Partial<SectionRow>) =>
    setState((rowsState) =>
      rowsState.map((r) => (r.key === key ? { ...r, ...patch } : r))
    );

  function save(row: SectionRow) {
    setSavingKey(row.key);
    startTransition(async () => {
      const result = await saveSectionCopy(row.key, {
        eyebrow: row.eyebrow,
        title: row.title,
        accent_words: row.accent_words,
        subtitle: row.subtitle,
      });
      setSavingKey(null);
      setToast({ key: row.key, ...result });
      window.setTimeout(() => setToast(null), 4000);
    });
  }

  return (
    <div>
      <header>
        <h1 className="font-serif text-[34px] font-light leading-none">
          Section headings
        </h1>
        <p className="mt-2 max-w-[56ch] text-[14px] leading-relaxed text-muted">
          The small uppercase label, the large headline and the paragraph beneath
          it, for each block of the home page. Words listed as “italic words” are
          set in italic accent type inside the headline.
        </p>
      </header>

      <div className="mt-8 space-y-4">
        {state.map((row) => (
          <section
            key={row.key}
            className="rounded-3xl border border-border bg-card p-6 sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-serif text-[22px] font-light">
                {SECTION_LABELS[row.key] ?? row.key}
              </h2>
              <button
                type="button"
                onClick={() => save(row)}
                disabled={savingKey === row.key}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-2 text-[12.5px] text-white disabled:opacity-60"
              >
                {savingKey === row.key ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
                Save
              </button>
            </div>

            {toast?.key === row.key && (
              <p
                className={cn(
                  "mt-3 text-[12.5px]",
                  toast.ok ? "text-emerald-700" : "text-red-600"
                )}
              >
                {toast.message}
              </p>
            )}

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <Label>Eyebrow</Label>
                <div className="mt-2">
                  <TextField
                    value={row.eyebrow}
                    onChange={(v) => update(row.key, { eyebrow: v })}
                  />
                </div>
              </label>
              <label className="block">
                <Label>Headline</Label>
                <div className="mt-2">
                  <TextField
                    value={row.title}
                    onChange={(v) => update(row.key, { title: v })}
                  />
                </div>
              </label>
            </div>

            <div className="mt-4">
              <Label help="Any word from the headline listed here is italicised.">
                Italic words
              </Label>
              <div className="mt-2">
                <TagsField
                  value={row.accent_words}
                  onChange={(v) => update(row.key, { accent_words: v })}
                  placeholder="e.g. softly"
                />
              </div>
            </div>

            <label className="mt-4 block">
              <Label>Intro paragraph</Label>
              <div className="mt-2">
                <TextArea
                  value={row.subtitle}
                  rows={3}
                  onChange={(v) => update(row.key, { subtitle: v })}
                />
              </div>
            </label>
          </section>
        ))}
      </div>
    </div>
  );
}
