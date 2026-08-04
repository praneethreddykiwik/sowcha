/**
 * Cloudinary URL builder.
 *
 * There is no upload widget and no API in this project by design — images live
 * in your Cloudinary account and are referenced by public id. To publish a new
 * photo: upload it in the Cloudinary dashboard, copy the public id, paste it in
 * products.ts / gallery.ts / journal.ts.
 *
 * Set your cloud name below (or NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env.local).
 * Until then every <ImageFrame> falls back to hand-drawn botanical artwork, so
 * the site still looks finished with zero configuration.
 */

export const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "sowcha";

type CldOptions = {
  /** Target width in px. Cloudinary handles the rest (f_auto, q_auto). */
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "limit";
  gravity?: "auto" | "face" | "center";
};

export function cld(publicId: string, options: CldOptions = {}): string {
  const { width = 1200, height, crop = "limit", gravity = "auto" } = options;

  const transforms = [
    "f_auto",
    "q_auto:good",
    `c_${crop}`,
    `w_${width}`,
    height ? `h_${height}` : null,
    crop === "fill" ? `g_${gravity}` : null,
    "dpr_auto",
  ]
    .filter(Boolean)
    .join(",");

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}
