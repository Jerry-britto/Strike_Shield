/**
 * Full-page loading indicator used by route-level Suspense and async views.
 */
export default function FullPageLoader({ label = "Loading…" }) {
  return (
    <div
      className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4"
      role="status"
      aria-live="polite"
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-navy-200 border-t-brand-600" />
      <p className="text-sm font-medium text-navy-500">{label}</p>
      <span className="sr-only">{label}</span>
    </div>
  );
}
