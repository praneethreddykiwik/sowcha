"use client";

import Image from "next/image";
import { useState } from "react";
import type { ArtVariant } from "@/config/products";
import { isCloudinaryConfigured } from "@/config/cloudinary";
import { BotanicalArt } from "./botanical-art";
import { cn } from "@/lib/utils";

/**
 * Decides whether a URL is worth requesting.
 *
 * Uploads from the admin page (Supabase Storage) and any ordinary absolute URL
 * are fetched. Legacy Cloudinary URLs are only fetched when an account is
 * actually configured — otherwise every tile would 404 through the image
 * optimizer. Anything else falls through to the illustration.
 */
export function isRenderableImage(src?: string | null): boolean {
  if (!src) return false;
  if (src.startsWith("/")) return true;
  if (src.includes("res.cloudinary.com")) return isCloudinaryConfigured;
  return /^https?:\/\//i.test(src);
}

/**
 * An image that degrades gracefully: until a photo is uploaded (or if one
 * fails to load) we render the matching botanical illustration instead of a
 * broken tile.
 */
export function ImageFrame({
  src,
  alt,
  art = "sprig",
  seed = 1,
  className,
  imgClassName,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
}: {
  src?: string | null;
  alt: string;
  art?: ArtVariant;
  seed?: number;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const showRemote = isRenderableImage(src) && !failed;

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-background", className)}>
      {/* Always painted underneath — doubles as the loading state. */}
      <BotanicalArt
        variant={art}
        seed={seed}
        className={cn(
          "absolute inset-0 transition-opacity duration-900 ease-silk",
          loaded && showRemote ? "opacity-0" : "opacity-100"
        )}
      />

      {showRemote && src && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setFailed(true)}
          onLoad={() => setLoaded(true)}
          className={cn(
            "object-cover transition-[opacity,transform] duration-1200 ease-silk",
            loaded ? "opacity-100" : "opacity-0",
            imgClassName
          )}
        />
      )}

      <span className="noise" aria-hidden />
    </div>
  );
}
