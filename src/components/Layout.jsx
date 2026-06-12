import { NavLink, Link } from 'react-router-dom'

const NAV = [
  { to: '/', label: 'Overview', end: true },
  { to: '/hs', label: 'HS Explorer' },
  { to: '/partners', label: 'Partners' },
  { to: '/re-exports', label: 'Re-Export Hub' },
  { to: '/methodology', label: 'Methodology' },
]

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Masthead />
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

function Masthead() {
  return (
    <header className="border-b border-rule bg-bone">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <CedarMark />
          <div className="leading-tight">
            <div className="eyebrow">Lebanon · MENA Trade Intelligence</div>
            <div className="display text-[22px] tracking-tightest text-ink group-hover:text-cedar transition-colors">
              The Beirut Trade Ledger
            </div>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-[12px]">
          <div className="text-right">
            <div className="eyebrow">Reference Year</div>
            <div className="num text-ink">2024</div>
          </div>
          <div className="text-right">
            <div className="eyebrow">Source</div>
            <div className="num text-ink">UN Comtrade</div>
          </div>
          <div className="text-right">
            <div className="eyebrow">Classification</div>
            <div className="num text-ink">HS Rev. 5</div>
          </div>
        </div>
      </div>
    </header>
  )
}

function Nav() {
  return (
    <nav className="sticky top-0 z-30 border-b border-rule bg-bone/95 backdrop-blur supports-[backdrop-filter]:bg-bone/80">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <ul className="flex items-center gap-1 overflow-x-auto">
          {NAV.map(n => (
            <li key={n.to}>
              <NavLink
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  [
                    'inline-block px-4 py-3 text-[13px] tracking-wide transition-colors whitespace-nowrap relative',
                    isActive
                      ? 'text-cedar font-medium'
                      : 'text-slate1 hover:text-ink',
                  ].join(' ')
                }
              >
                {({ isActive }) => (
                  <>
                    {n.label}
                    {isActive && (
                      <span className="absolute left-3 right-3 -bottom-px h-[2px] bg-cedar" />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-rule bg-bone2/40 no-print">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-[13px]">
        <div>
          <CedarMark small />
          <div className="display text-[18px] mt-3 mb-1">The Beirut Trade Ledger</div>
          <p className="text-slate1 leading-relaxed">
            Granular, partner-by-partner and HS-by-HS view of Lebanon's 2024
            external trade. Built on UN Comtrade microdata, designed for
            economists, policymakers and market analysts.
          </p>
        </div>
        <div>
          <div className="eyebrow mb-3">Methodology</div>
          <ul className="space-y-1.5 text-slate1">
            <li>Reporter: Lebanon (M49 422)</li>
            <li>Classification: HS Revision 5 (2017 nomenclature)</li>
            <li>Frequency: Annual, 2024</li>
            <li>Aggregation: line items only, World aggregate excluded</li>
            <li>Currency: USD, primaryValue field</li>
          </ul>
        </div>
        <div>
          <div className="eyebrow mb-3">Caveats</div>
          <ul className="space-y-1.5 text-slate1">
            <li>Customs valuation may diverge from market value during currency crisis episodes</li>
            <li>Mode of transport not reported in this release (port modal split unavailable)</li>
            <li>Special partner codes (Free Zones, Bunkers, n.e.s.) reflect Comtrade conventions</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-rule">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-4 text-[11px] text-slate2 flex flex-col md:flex-row md:justify-between gap-2">
          <span>
            Lebanon Trade Intelligence Portal · A product of AI Economic Pulse
          </span>
          <span className="num">v1.0 · Generated {new Date().toISOString().slice(0, 10)}</span>
        </div>
      </div>
    </footer>
  )
}

function CedarMark({ small = false }) {
  const s = small ? 24 : 30
  return (
    <svg width={s} height={s} viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M16 4 L10 13 L13 13 L8 20 L12 20 L6 28 L26 28 L20 20 L24 20 L19 13 L22 13 Z"
        fill="#8bab86"
      />
      <rect x="14" y="26" width="4" height="3" fill="#cf7d7d" />
    </svg>
  )
}
