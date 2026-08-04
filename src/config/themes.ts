/**
 * Theme registry. Adding a theme = add an entry here + a [data-theme] block
 * in globals.css. Nothing else in the app needs to change.
 */

export const THEME_STORAGE_KEY = "sowcha-theme";

export type ThemeId = "sage" | "blossom" | "lavender";

export type ThemeMeta = {
  id: ThemeId;
  label: string;
  glyph: string;
  description: string;
  /** Swatches used by the theme switcher preview dots. */
  swatch: [string, string, string];
};

export const themes: ThemeMeta[] = [
  {
    id: "sage",
    label: "Sage",
    glyph: "🌿",
    description: "Quiet green, warm linen, morning light.",
    swatch: ["#657266", "#D7C7B8", "#F7F6F3"],
  },
  {
    id: "blossom",
    label: "Blossom",
    glyph: "🌸",
    description: "Rose petal softness with a gilded edge.",
    swatch: ["#D8A6B5", "#B88497", "#FFF9FB"],
  },
  {
    id: "lavender",
    label: "Lavender",
    glyph: "💜",
    description: "Dusk violet, calm and quietly regal.",
    swatch: ["#9E88C6", "#7867A7", "#FAF9FF"],
  },
];

export const defaultTheme: ThemeId = "sage";

export const isThemeId = (value: unknown): value is ThemeId =>
  typeof value === "string" && themes.some((t) => t.id === value);
