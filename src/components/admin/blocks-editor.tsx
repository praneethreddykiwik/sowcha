"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { ArtVariant, Block } from "@/lib/content-types";
import { ART_VARIANTS } from "@/lib/content-types";
import { ImageField, Label, SelectField, TagsField, TextArea, TextField } from "./fields";

/**
 * Journal entries are stored as an ordered list of typed blocks, so the article
 * layout stays editorial instead of collapsing into one HTML blob.
 */

const BLOCK_LABELS: Record<Block["type"], string> = {
  p: "Paragraph",
  h: "Heading",
  quote: "Pull quote",
  list: "Bulleted list",
  image: "Image",
};

function emptyBlock(type: Block["type"]): Block {
  switch (type) {
    case "h":
      return { type: "h", text: "" };
    case "quote":
      return { type: "quote", text: "", by: "" };
    case "list":
      return { type: "list", items: [] };
    case "image":
      return { type: "image", art: "sprig", image: "", caption: "" };
    default:
      return { type: "p", text: "" };
  }
}

export function BlocksEditor({
  value,
  onChange,
}: {
  value: Block[];
  onChange: (blocks: Block[]) => void;
}) {
  const blocks = Array.isArray(value) ? value : [];

  const update = (index: number, next: Block) =>
    onChange(blocks.map((b, i) => (i === index ? next : b)));

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= blocks.length) return;
    const copy = [...blocks];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    onChange(copy);
  };

  return (
    <div className="space-y-3">
      {blocks.map((block, i) => (
        <div
          key={i}
          className="rounded-2xl border border-border bg-background/60 p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wideish text-muted">
              {BLOCK_LABELS[block.type]}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label="Move up"
                className="rounded-full p-1.5 text-muted transition-colors hover:text-foreground disabled:opacity-30"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === blocks.length - 1}
                aria-label="Move down"
                className="rounded-full p-1.5 text-muted transition-colors hover:text-foreground disabled:opacity-30"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onChange(blocks.filter((_, j) => j !== i))}
                aria-label="Delete block"
                className="rounded-full p-1.5 text-muted transition-colors hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {(block.type === "p" || block.type === "h") && (
            <TextArea
              value={block.text}
              rows={block.type === "h" ? 1 : 4}
              onChange={(text) => update(i, { ...block, text })}
            />
          )}

          {block.type === "quote" && (
            <div className="space-y-3">
              <TextArea
                value={block.text}
                rows={3}
                onChange={(text) => update(i, { ...block, text })}
              />
              <div>
                <Label>Attribution (optional)</Label>
                <div className="mt-1.5">
                  <TextField
                    value={block.by ?? ""}
                    onChange={(by) => update(i, { ...block, by })}
                  />
                </div>
              </div>
            </div>
          )}

          {block.type === "list" && (
            <TagsField
              value={block.items}
              onChange={(items) => update(i, { ...block, items })}
              placeholder="Add a bullet and press Enter"
            />
          )}

          {block.type === "image" && (
            <div className="grid gap-4 sm:grid-cols-[220px_1fr]">
              <ImageField
                value={block.image || null}
                onChange={(url) => update(i, { ...block, image: url ?? "" })}
              />
              <div className="space-y-3">
                <div>
                  <Label>Caption</Label>
                  <div className="mt-1.5">
                    <TextField
                      value={block.caption ?? ""}
                      onChange={(caption) => update(i, { ...block, caption })}
                    />
                  </div>
                </div>
                <div>
                  <Label help="Used until a photo is uploaded.">
                    Fallback illustration
                  </Label>
                  <div className="mt-1.5">
                    <SelectField
                      value={block.art}
                      options={ART_VARIANTS}
                      onChange={(art) =>
                        update(i, { ...block, art: art as ArtVariant })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        {(Object.keys(BLOCK_LABELS) as Block["type"][]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onChange([...blocks, emptyBlock(type)])}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-[12px] text-muted transition-colors hover:border-ink/40 hover:text-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
            {BLOCK_LABELS[type]}
          </button>
        ))}
      </div>
    </div>
  );
}
