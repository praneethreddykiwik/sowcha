import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/**
 * Tab icon, generated from the butterfly emblem so there is no binary asset to
 * keep in sync with the brand.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F7F6F3",
        }}
      >
        <svg width="380" height="380" viewBox="-160 -170 320 330">
          <g>
            <path
              d="M-6 -46 C -74 -134 -176 -112 -156 -32 C -143 20 -72 30 -8 -4 Z"
              fill="#657266" fillOpacity="0.30" stroke="#657266" strokeWidth="9"
              strokeLinejoin="round"
            />
            <path
              d="M6 -46 C 74 -134 176 -112 156 -32 C 143 20 72 30 8 -4 Z"
              fill="#657266" fillOpacity="0.30" stroke="#657266" strokeWidth="9"
              strokeLinejoin="round"
            />
            <path
              d="M-8 6 C -70 24 -122 82 -84 124 C -48 162 -14 110 -6 42 Z"
              fill="#657266" fillOpacity="0.22" stroke="#657266" strokeWidth="9"
              strokeLinejoin="round"
            />
            <path
              d="M8 6 C 70 24 122 82 84 124 C 48 162 14 110 6 42 Z"
              fill="#657266" fillOpacity="0.22" stroke="#657266" strokeWidth="9"
              strokeLinejoin="round"
            />
            <path d="M0 -58 C 9 -22 9 44 0 104" stroke="#657266" strokeWidth="22" strokeLinecap="round" fill="none" />
            <path d="M-2 -60 C -22 -92 -42 -108 -60 -114" stroke="#657266" strokeWidth="9" fill="none" strokeLinecap="round" />
            <path d="M2 -60 C 22 -92 42 -108 60 -114" stroke="#657266" strokeWidth="9" fill="none" strokeLinecap="round" />
            <circle cx="-60" cy="-114" r="12" fill="#D7C7B8" />
            <circle cx="60" cy="-114" r="12" fill="#D7C7B8" />
          </g>
        </svg>
      </div>
    ),
    size
  );
}
