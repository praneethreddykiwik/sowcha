import { ImageResponse } from "next/og";
import { brand } from "@/config/brand";

export const alt = `${brand.name} — ${brand.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The social card. Twitter/X was told `summary_large_image` with no image at
 * all, which renders as a blank card — every share looked broken.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(140deg, #FFFFFF 0%, #F7F6F3 45%, #E8E6DF 100%)",
          fontFamily: "Georgia, serif",
        }}
      >
        <svg width="150" height="150" viewBox="-160 -170 320 330">
          <path
            d="M-6 -46 C -74 -134 -176 -112 -156 -32 C -143 20 -72 30 -8 -4 Z"
            fill="#657266" fillOpacity="0.28" stroke="#657266" strokeWidth="8" strokeLinejoin="round"
          />
          <path
            d="M6 -46 C 74 -134 176 -112 156 -32 C 143 20 72 30 8 -4 Z"
            fill="#657266" fillOpacity="0.28" stroke="#657266" strokeWidth="8" strokeLinejoin="round"
          />
          <path
            d="M-8 6 C -70 24 -122 82 -84 124 C -48 162 -14 110 -6 42 Z"
            fill="#657266" fillOpacity="0.2" stroke="#657266" strokeWidth="8" strokeLinejoin="round"
          />
          <path
            d="M8 6 C 70 24 122 82 84 124 C 48 162 14 110 6 42 Z"
            fill="#657266" fillOpacity="0.2" stroke="#657266" strokeWidth="8" strokeLinejoin="round"
          />
          <path d="M0 -58 C 9 -22 9 44 0 104" stroke="#657266" strokeWidth="20" strokeLinecap="round" fill="none" />
          <circle cx="-60" cy="-114" r="10" fill="#D7C7B8" />
          <circle cx="60" cy="-114" r="10" fill="#D7C7B8" />
        </svg>

        <div style={{ display: "flex", fontSize: 86, color: "#323533", marginTop: 26 }}>
          {brand.name}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 34,
            color: "#657266",
            marginTop: 10,
            fontStyle: "italic",
          }}
        >
          {brand.tagline}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 20,
            color: "#7A807C",
            marginTop: 34,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          Hand finished · Plant dyed · Made in small batches
        </div>
      </div>
    ),
    size
  );
}
