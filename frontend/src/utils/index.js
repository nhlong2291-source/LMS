export function formatDate(ts) {
  if (!ts) return "";
  const d = typeof ts === "number" ? new Date(ts) : new Date(ts);
  return d.toLocaleString();
}

export function currency(n) {
  return typeof n === "number" ? n.toLocaleString() : n;
}
