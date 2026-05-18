// Compact USD formatting helpers.

/** Format a USD amount with adaptive units: $1.23B, $456.7M, $89.0K. */
export function usd(value, opts = {}) {
  if (value == null || isNaN(value)) return '—'
  const abs = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(opts.bDigits ?? 2)}B`
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(opts.mDigits ?? 1)}M`
  if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(0)}K`
  return `${sign}$${abs.toFixed(0)}`
}

/** Format a USD amount without unit suffix, with thousand separators: $1,234,567. */
export function usdFull(value) {
  if (value == null || isNaN(value)) return '—'
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

/** Percentage with 1 decimal: 24.8%. */
export function pct(value, digits = 1) {
  if (value == null || isNaN(value)) return '—'
  return `${value.toFixed(digits)}%`
}

/** Compact integer with commas. */
export function int(value) {
  if (value == null || isNaN(value)) return '—'
  return Math.round(value).toLocaleString('en-US')
}

/** Format trade balance: surplus in cedar, deficit in burgundy.
 *  Returns {label, className}. */
export function balanceStyle(value) {
  if (value > 0) {
    return { label: `+${usd(value)}`, className: 'text-cedar' }
  }
  if (value < 0) {
    return { label: usd(value), className: 'text-burgundy' }
  }
  return { label: '$0', className: 'text-slate1' }
}
