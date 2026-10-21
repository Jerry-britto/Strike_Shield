// Shared formatting helpers so numbers, currency, dates and IDs render
// consistently across the whole app (the codebase previously mixed raw
// numbers, toFixed(2) and ₹ prefixes in ad-hoc ways).

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/**
 * Format a number as Indian Rupees.
 * formatINR(780)        -> "₹780"
 * formatINR(114284.29)  -> "₹1,14,284.29"
 */
export function formatINR(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "₹0";
  return inrFormatter.format(num);
}

/** Format a number with thousands separators (no currency symbol). */
export function formatNumber(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "0";
  return num.toLocaleString("en-IN");
}

/** Format an ISO date string as e.g. "16 Sep 2024". Falls back gracefully. */
export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Shorten a long Mongo ObjectId for display while keeping it identifiable,
 * e.g. shortId("66ebb2e5ba3dadccdf5d3f98") -> "66ebb2e5…d3f98".
 */
export function shortId(id) {
  if (!id) return "—";
  const str = String(id);
  if (str.length <= 12) return str;
  return `${str.slice(0, 8)}…${str.slice(-5)}`;
}
