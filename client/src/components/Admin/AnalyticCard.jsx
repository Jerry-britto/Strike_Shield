/**
 * Clean stat card used across the admin dashboard. Replaces the previous
 * clip-art wave background (which clipped the label text).
 */
export default function AnalyticCard({ icon: Icon, title, content, hint }) {
  return (
    <div className="card flex items-start gap-4 p-5">
      {Icon && (
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50">
          <Icon sx={{ fontSize: 26, color: "#ea580c" }} />
        </span>
      )}
      <div className="min-w-0">
        <h2 className="truncate text-sm font-semibold uppercase tracking-wide text-navy-500">
          {title}
        </h2>
        {/* Tabular figures keep long amounts aligned; text-smstep scaling
            avoids truncation on wide values like ₹90,391.14. */}
        <p className="mt-1 break-words text-2xl font-extrabold leading-tight text-navy-900 [font-variant-numeric:tabular-nums] sm:text-3xl">
          {content}
        </p>
        {hint && <p className="mt-1 text-xs text-navy-400">{hint}</p>}
      </div>
    </div>
  );
}
