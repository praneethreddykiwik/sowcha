"use client";

import Image from "next/image";
import { useState } from "react";
import type { ArtVariant } from "@/config/products";
import { isCloudinaryConfigured } from "@/config/cloudinary";
import { BotanicalArt } from "./botanical-art";
import { cn } from "@/lib/utils";

/**
 * A Cloudinary image that degrades gracefully: while the account is not
 * configured (or a public id is wrong) we render the matching botanical
 * illustration instead of a broken tile.
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
  src: string;
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

  // No account configured yet → don't even request the URL; the illustration
  // is the intended visual until real photography is uploaded.
  const showRemote = isCloudinaryConfigured && !failed;

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

      {showRemote && (
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
