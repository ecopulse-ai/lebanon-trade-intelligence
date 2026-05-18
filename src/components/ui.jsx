// Reusable display primitives.

export function Eyebrow({ children, className = '' }) {
  return <div className={`eyebrow ${className}`}>{children}</div>
}

export function SectionHead({ eyebrow, title, kicker, anchor }) {
  return (
    <header className="mb-6" id={anchor}>
      {eyebrow && <Eyebrow className="mb-2">{eyebrow}</Eyebrow>}
      <h2 className="display text-3xl md:text-4xl text-ink tracking-tightest leading-[1.05]">{title}</h2>
      {kicker && <p className="mt-3 text-slate1 max-w-2xl leading-relaxed">{kicker}</p>}
    </header>
  )
}

export function MetricTile({ label, value, sub, accent = 'ink' }) {
  const accentClass = {
    ink: 'text-ink',
    cedar: 'text-cedar',
    burgundy: 'text-burgundy',
    gold: 'text-gold',
  }[accent] || 'text-ink'
  return (
    <div className="border border-rule bg-bone p-5 transition-colors hover:bg-bone2/30">
      <Eyebrow>{label}</Eyebrow>
      <div className={`display text-[34px] md:text-[40px] mt-2 leading-none tracking-tightest ${accentClass}`}>
        {value}
      </div>
      {sub && <div className="text-[12px] text-slate1 mt-2">{sub}</div>}
    </div>
  )
}

/** Inline horizontal share bar - 'variant' controls the colour. */
export function ShareBar({ pctValue, variant = 'export' }) {
  const w = Math.min(100, Math.max(0, pctValue))
  return (
    <div className={`bar ${variant}`}>
      <span style={{ width: `${w}%` }} />
    </div>
  )
}

export function Loading({ label = 'Loading…' }) {
  return (
    <div className="py-20 text-center">
      <div className="eyebrow text-slate2">{label}</div>
    </div>
  )
}

export function ErrorBox({ message }) {
  return (
    <div className="border border-burgundy/40 bg-burgundy/5 p-4 text-sm text-burgundy">
      {message}
    </div>
  )
}

/** Card wrapper for content blocks. */
export function Card({ children, className = '' }) {
  return (
    <div className={`border border-rule bg-bone ${className}`}>
      {children}
    </div>
  )
}

export function CardHead({ title, sub, right }) {
  return (
    <div className="px-5 py-4 border-b border-rule flex items-center justify-between gap-4">
      <div>
        <div className="display text-[18px] leading-tight">{title}</div>
        {sub && <div className="text-[12px] text-slate1 mt-0.5">{sub}</div>}
      </div>
      {right}
    </div>
  )
}

/** Pill-like tag for chapter sections, flow types, regions. */
export function Tag({ children, tone = 'neutral' }) {
  const tones = {
    neutral: 'bg-bone2 text-slate1 border-rule',
    cedar: 'bg-cedar/10 text-cedar border-cedar/30',
    burgundy: 'bg-burgundy/10 text-burgundy border-burgundy/30',
    gold: 'bg-gold/15 text-gold border-gold/40',
  }
  return (
    <span
      className={`inline-block text-[10.5px] tracking-wider uppercase px-2 py-0.5 border ${tones[tone] || tones.neutral} num`}
    >
      {children}
    </span>
  )
}
