export function formatDate(date?: string | Date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString();
}

export function formatCurrency(n = 0) {
  return new Intl.NumberFormat().format(n);
}
