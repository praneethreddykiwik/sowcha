"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";
import { saveSettings } from "@/app/admin/actions";
import {
  ImageField,
  Label,
  TagsField,
  TextArea,
  TextField,
} from "@/components/admin/fields";
import { cn } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>;

type RepeaterItem = Record<string, string>;

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <h2 className="font-serif text-[24px] font-light">{title}</h2>
      {description && (
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
          {description}
        </p>
      )}
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

function Text({
  label,
  help,
  value,
  onChange,
  rows,
}: {
  label: string;
  help?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <Label help={help}>{label}</Label>
      <div className="mt-2">
        {rows ? (
          <TextArea value={value} rows={rows} onChange={onChange} />
        ) : (
          <TextField value={value} onChange={onChange} />
        )}
      </div>
    </label>
  );
}

/** Editable list of small objects — hours, values, timeline. */
function Repeater({
  label,
  help,
  items,
  fields,
  onChange,
}: {
  label: string;
  help?: string;
  items: RepeaterItem[];
  fields: { name: string; label: string; rows?: number }[];
  onChange: (items: RepeaterItem[]) => void;
}) {
  const list = Array.isArray(items) ? items : [];

  return (
    <div>
      <Label help={help}>{label}</Label>
      <div className="mt-3 space-y-3">
        {list.map((item, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-background/60 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                {fields.map((f) => (
                  <label key={f.name} className="block">
                    <span className="text-[11px] uppercase tracking-wideish text-muted">
                      {f.label}
                    </span>
                    <div className="mt-1.5">
                      {f.rows ? (
                        <TextArea
                          value={item[f.name] ?? ""}
                          rows={f.rows}
                          onChange={(v) =>
                            onChange(
                              list.map((it, j) =>
                                j === i ? { ...it, [f.name]: v } : it
                              )
                            )
                          }
                        />
                      ) : (
                        <TextField
                          value={item[f.name] ?? ""}
                          onChange={(v) =>
                            onChange(
                              list.map((it, j) =>
                                j === i ? { ...it, [f.name]: v } : it
                              )
                            )
                          }
                        />
                      )}
                    </div>
                  </label>
                ))}
              </div>
              <button
                type="button"
                onClick={() => onChange(list.filter((_, j) => j !== i))}
                aria-label="Remove"
                className="mt-5 rounded-full p-2 text-muted transition-colors hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            onChange([
              ...list,
              Object.fromEntries(fields.map((f) => [f.name, ""])),
            ])
          }
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-[12px] text-muted transition-colors hover:border-ink/40 hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5" />
          Add row
        </button>
      </div>
    </div>
  );
}

export function BrandForm({ initial }: { initial: Row }) {
  const [form, setForm] = useState<Row>({
    brand_name: initial.brand_name ?? "SowCha",
    tagline: initial.tagline ?? "",
    short_about: initial.short_about ?? "",
    about_intro: initial.about_intro ?? "",
    about_body: initial.about_body ?? "",
    mission: initial.mission ?? "",
    vision: initial.vision ?? "",
    founder_note: initial.founder_note ?? "",
    founder_name: initial.founder_name ?? "",
    about_image_url: initial.about_image_url ?? null,
    about_image_2_url: initial.about_image_2_url ?? null,
    phone: initial.phone ?? "",
    phone_href: initial.phone_href ?? "",
    email: initial.email ?? "",
    instagram_url: initial.instagram_url ?? "",
    instagram_handle: initial.instagram_handle ?? "",
    linkedin_url: initial.linkedin_url ?? "",
    location: initial.location ?? "",
    maps_url: initial.maps_url ?? "",
    hours: initial.hours ?? [],
    brand_values: initial.brand_values ?? [],
    timeline: initial.timeline ?? [],
    marquee_words: initial.marquee_words ?? [],
  });

  const [toast, setToast] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const set = (key: string) => (value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  function save() {
    startTransition(async () => {
      const result = await saveSettings(form);
      setToast(result);
      window.setTimeout(() => setToast(null), 4000);
    });
  }

  return (
    <div className="pb-28">
      <header>
        <h1 className="font-serif text-[34px] font-light leading-none">
          Brand &amp; contact
        </h1>
        <p className="mt-2 max-w-[54ch] text-[14px] text-muted">
          Everything here appears in the hero, the about section, the contact
          card and the footer.
        </p>
      </header>

      <div className="mt-8 space-y-4">
        <Section title="Identity" description="Shown in the hero and the footer.">
          <Text
            label="Brand name"
            value={form.brand_name}
            onChange={set("brand_name")}
          />
          <Text
            label="Tagline"
            help="The large hero headline. The final word is italicised automatically."
            value={form.tagline}
            onChange={set("tagline")}
          />
          <Text
            label="Short introduction"
            help="Sits under the hero headline and in the footer."
            rows={3}
            value={form.short_about}
            onChange={set("short_about")}
          />
          <div>
            <Label help="Each phrase scrolls slowly across the strip under the hero.">
              Marquee phrases
            </Label>
            <div className="mt-2">
              <TagsField
                value={form.marquee_words}
                onChange={set("marquee_words")}
                placeholder="Add a phrase and press Enter"
              />
            </div>
          </div>
        </Section>

        <Section title="The story" description="The About section of the home page.">
          <Text
            label="Opening paragraph"
            help="Used as the About section's intro line."
            rows={4}
            value={form.about_intro}
            onChange={set("about_intro")}
          />
          <Text
            label="Main paragraph"
            rows={5}
            value={form.about_body}
            onChange={set("about_body")}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Text label="Mission" rows={4} value={form.mission} onChange={set("mission")} />
            <Text label="Vision" rows={4} value={form.vision} onChange={set("vision")} />
          </div>
          <Text
            label="Founder quote"
            rows={3}
            value={form.founder_note}
            onChange={set("founder_note")}
          />
          <Text
            label="Founder attribution"
            value={form.founder_name}
            onChange={set("founder_name")}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label help="The large frame in the About collage.">
                About image — main
              </Label>
              <div className="mt-2">
                <ImageField
                  value={form.about_image_url}
                  onChange={set("about_image_url")}
                />
              </div>
            </div>
            <div>
              <Label help="The smaller square overlapping it.">
                About image — detail
              </Label>
              <div className="mt-2">
                <ImageField
                  value={form.about_image_2_url}
                  onChange={set("about_image_2_url")}
                />
              </div>
            </div>
          </div>
        </Section>

        <Section title="Contact">
          <div className="grid gap-5 sm:grid-cols-2">
            <Text label="Phone (displayed)" value={form.phone} onChange={set("phone")} />
            <Text
              label="Phone link"
              help="e.g. tel:+919876543210"
              value={form.phone_href}
              onChange={set("phone_href")}
            />
            <Text label="Email" value={form.email} onChange={set("email")} />
            <Text
              label="Instagram handle"
              value={form.instagram_handle}
              onChange={set("instagram_handle")}
            />
            <Text
              label="Instagram URL"
              value={form.instagram_url}
              onChange={set("instagram_url")}
            />
            <Text
              label="LinkedIn URL"
              value={form.linkedin_url}
              onChange={set("linkedin_url")}
            />
          </div>
          <Text label="Address" rows={2} value={form.location} onChange={set("location")} />
          <Text
            label="Google Maps link"
            value={form.maps_url}
            onChange={set("maps_url")}
          />
          <Repeater
            label="Opening hours"
            items={form.hours}
            fields={[
              { name: "days", label: "Days" },
              { name: "time", label: "Hours" },
            ]}
            onChange={set("hours")}
          />
        </Section>

        <Section title="Values" description="The four cards under the timeline.">
          <Repeater
            label="Values"
            items={form.brand_values}
            fields={[
              { name: "title", label: "Title" },
              { name: "body", label: "Description", rows: 2 },
            ]}
            onChange={set("brand_values")}
          />
        </Section>

        <Section title="Timeline" description="The four dated milestones in About.">
          <Repeater
            label="Milestones"
            items={form.timeline}
            fields={[
              { name: "year", label: "Year" },
              { name: "title", label: "Title" },
              { name: "body", label: "Description", rows: 2 },
            ]}
            onChange={set("timeline")}
          />
        </Section>
      </div>

      {/* sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/90 backdrop-blur lg:left-[260px]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <p
            className={cn(
              "text-[13px]",
              toast
                ? toast.ok
                  ? "text-emerald-700"
                  : "text-red-600"
                : "text-muted"
            )}
          >
            {toast?.message ?? "Changes publish to the live site as soon as you save."}
          </p>
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-[13px] text-white disabled:opacity-60"
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Save &amp; publish
          </button>
        </div>
      </div>
    </div>
  );
}
