"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  Check,
  EyeOff,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import type { Collection, Field } from "@/lib/admin/collections";
import type { Block } from "@/lib/content-types";
import { deleteRow, reorderRows, saveRow } from "@/app/admin/actions";
import {
  ImageField,
  Label,
  SelectField,
  TagsField,
  TextArea,
  TextField,
  Toggle,
} from "./fields";
import { BlocksEditor } from "./blocks-editor";
import { cn } from "@/lib/utils";

type Row = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * One screen that lists, creates, edits, reorders and deletes rows for any
 * collection described in lib/admin/collections.ts.
 */
export function CollectionEditor({
  collection,
  initialRows,
}: {
  collection: Collection;
  initialRows: Row[];
}) {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [editing, setEditing] = useState<Row | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const flash = (result: { ok: boolean; message: string }) => {
    setToast(result);
    window.setTimeout(() => setToast(null), 4000);
  };

  function startCreate() {
    setEditing({ ...collection.defaults });
    setIsNew(true);
  }

  function startEdit(row: Row) {
    setEditing({ ...row });
    setIsNew(false);
  }

  function handleSave() {
    if (!editing) return;

    // Only send real columns; strip database-managed fields.
    const payload: Row = {};
    for (const field of collection.fields) payload[field.name] = editing[field.name];
    if (isNew) payload.sort_order = rows.length + 1;

    startTransition(async () => {
      const result = await saveRow(
        collection.table,
        isNew ? null : editing.id,
        payload
      );
      flash(result);
      if (result.ok) {
        setEditing(null);
        // Optimistic list update; the server is the source of truth on reload.
        setRows((current) =>
          isNew
            ? [...current, { ...payload, id: crypto.randomUUID() }]
            : current.map((r) => (r.id === editing.id ? { ...r, ...payload } : r))
        );
      }
    });
  }

  function handleDelete(row: Row) {
    if (!window.confirm(`Delete “${row[collection.titleField]}”? This cannot be undone.`))
      return;

    startTransition(async () => {
      const result = await deleteRow(collection.table, row.id);
      flash(result);
      if (result.ok) setRows((current) => current.filter((r) => r.id !== row.id));
    });
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= rows.length) return;

    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    setRows(next);

    startTransition(async () => {
      const result = await reorderRows(
        collection.table,
        next.map((r) => r.id)
      );
      if (!result.ok) flash(result);
    });
  }

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-[34px] font-light leading-none">
            {collection.label}
          </h1>
          <p className="mt-2 text-[14px] text-muted">{collection.description}</p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[13px] text-white transition-transform duration-300 hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" />
          New {collection.singular.toLowerCase()}
        </button>
      </header>

      {toast && (
        <div
          className={cn(
            "mt-6 rounded-2xl border px-4 py-3 text-[13px]",
            toast.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
          )}
        >
          {toast.message}
        </div>
      )}

      <ul className="mt-8 space-y-2">
        {rows.length === 0 && (
          <li className="rounded-2xl border border-dashed border-border px-5 py-10 text-center text-[14px] text-muted">
            Nothing here yet. Create the first {collection.singular.toLowerCase()}.
          </li>
        )}

        {rows.map((row, i) => (
          <li
            key={row.id ?? i}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-3 pr-4"
          >
            {collection.imageField && (
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-background">
                {row[collection.imageField] ? (
                  <Image
                    src={row[collection.imageField]}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <span className="grid h-full w-full place-items-center text-[10px] uppercase tracking-wideish text-muted">
                    Art
                  </span>
                )}
              </span>
            )}

            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="truncate text-[15px]">
                  {row[collection.titleField] || "Untitled"}
                </span>
                {row.is_published === false && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-border px-2 py-0.5 text-[10px] uppercase tracking-wideish text-muted">
                    <EyeOff className="h-3 w-3" />
                    Hidden
                  </span>
                )}
              </span>
              {collection.subtitleField && row[collection.subtitleField] && (
                <span className="mt-0.5 block truncate text-[12.5px] text-muted">
                  {row[collection.subtitleField]}
                </span>
              )}
            </span>

            <span className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0 || pending}
                aria-label="Move up"
                className="rounded-full p-2 text-muted transition-colors hover:text-foreground disabled:opacity-30"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === rows.length - 1 || pending}
                aria-label="Move down"
                className="rounded-full p-2 text-muted transition-colors hover:text-foreground disabled:opacity-30"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => startEdit(row)}
                aria-label="Edit"
                className="rounded-full p-2 text-muted transition-colors hover:text-foreground"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(row)}
                aria-label="Delete"
                className="rounded-full p-2 text-muted transition-colors hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </span>
          </li>
        ))}
      </ul>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 p-4 backdrop-blur-sm sm:p-8">
          <div className="w-full max-w-2xl rounded-3xl border border-border bg-background shadow-lift">
            <header className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="font-serif text-[22px] font-light">
                {isNew ? `New ${collection.singular.toLowerCase()}` : `Edit ${collection.singular.toLowerCase()}`}
              </h2>
              <button
                type="button"
                onClick={() => setEditing(null)}
                aria-label="Close"
                className="rounded-full p-2 text-muted transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="space-y-5 px-6 py-6">
              {collection.fields.map((field) => (
                <FieldInput
                  key={field.name}
                  field={field}
                  value={editing[field.name]}
                  onChange={(v) =>
                    setEditing((current) => ({ ...current!, [field.name]: v }))
                  }
                />
              ))}
            </div>

            <footer className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-full px-5 py-2.5 text-[13px] text-muted transition-colors hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={pending}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-[13px] text-white disabled:opacity-60"
              >
                {pending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Save &amp; publish
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  if (field.type === "boolean") {
    return (
      <Toggle
        value={Boolean(value)}
        onChange={onChange}
        label={field.label}
      />
    );
  }

  return (
    <label className="block">
      <Label help={field.help}>{field.label}</Label>
      <div className="mt-2">
        {field.type === "text" && (
          <TextField value={(value as string) ?? ""} onChange={onChange} />
        )}
        {field.type === "date" && (
          <TextField
            type="date"
            value={((value as string) ?? "").slice(0, 10)}
            onChange={onChange}
          />
        )}
        {field.type === "number" && (
          <TextField
            type="number"
            value={String(value ?? "")}
            onChange={(v) => onChange(Number(v))}
          />
        )}
        {(field.type === "textarea" || field.type === "richtext") && (
          <TextArea
            value={(value as string) ?? ""}
            rows={field.rows ?? 3}
            onChange={onChange}
          />
        )}
        {field.type === "select" && (
          <SelectField
            value={(value as string) ?? ""}
            options={field.options ?? []}
            onChange={onChange}
          />
        )}
        {field.type === "tags" && (
          <TagsField value={(value as string[]) ?? []} onChange={onChange} />
        )}
        {field.type === "image" && (
          <ImageField
            value={(value as string) ?? null}
            onChange={onChange}
            label={field.label}
          />
        )}
        {field.type === "blocks" && (
          <BlocksEditor value={(value as Block[]) ?? []} onChange={onChange} />
        )}
      </div>
    </label>
  );
}
