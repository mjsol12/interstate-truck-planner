export function formatMiles(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—'

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
  }).format(value)
}
