"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
      <h1 className="font-serif text-[24px] font-light text-red-800">
        This screen could not load
      </h1>
      <p className="mt-3 text-[14px] leading-relaxed text-red-700">
        {error.message || "Something went wrong talking to the database."}
      </p>
      {error.digest && (
        <p className="mt-2 text-[12px] text-red-600/80">Reference {error.digest}</p>
      )}
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-ink px-6 py-2.5 text-[13px] text-white"
      >
        Try again
      </button>
    </div>
  );
}
