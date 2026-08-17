"use client";

/**
 * Last-resort boundary. Only fires when the root layout itself throws, so it
 * must render its own <html>/<body> and cannot rely on any app styling.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#F7F6F3",
          color: "#323533",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 460, textAlign: "center" }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 300, fontSize: 34, margin: 0 }}>
            Something went quiet
          </h1>
          <p style={{ marginTop: 14, lineHeight: 1.8, fontSize: 15, color: "#7A807C" }}>
            The page could not be loaded. Nothing you were doing has been lost.
          </p>
          {error.digest && (
            <p style={{ marginTop: 8, fontSize: 12, color: "#9AA09C" }}>
              Reference {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              marginTop: 28,
              border: 0,
              borderRadius: 999,
              background: "#4E594F",
              color: "#fff",
              padding: "13px 30px",
              fontSize: 13,
              letterSpacing: "0.12em",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
