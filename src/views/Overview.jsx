import { useData } from '../lib/data.js'
import { usd, pct, balanceStyle, int } from '../lib/format.js'
import {
  Card,
  CardHead,
  Eyebrow,
  ErrorBox,
  Loading,
  MetricTile,
  SectionHead,
  ShareBar,
  Tag,
} from '../components/ui.jsx'
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export default function Overview() {
  const head = useData('headlines.json')
  const parts = useData('partners.json')
  const chaps = useData('chapters.json')
  const conc = useData('concentration.json')
  const regs = useData('regions.json')

  if (head.loading || parts.loading || chaps.loading || conc.loading || regs.loading) {
    return <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12"><Loading /></div>
  }
  if (head.error) return <ErrorBox message={head.error} />

  const h = head.data
  const partners = parts.data.partners
  const chapters = chaps.data.chapters
  const concentration = conc.data
  const regions = regs.data.regions

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10 space-y-16">
      <Hero h={h} />
      <Headlines h={h} />
      <TopPartners partners={partners} totalImp={h.values.imports} totalExp={h.values.total_exports} />
      <TopChapters chapters={chapters} />
      <Regions regions={regions} />
      <Concentration concentration={concentration} />
    </div>
  )
}

function Hero({ h }) {
  return (
    <section className="border-b border-rule pb-10 fade-in">
      <Eyebrow className="mb-3">A 2024 Reading of Lebanon's External Trade</Eyebrow>
      <h1 className="display text-[44px] md:text-[68px] leading-[0.95] tracking-tightest text-ink max-w-4xl">
        A country importing four dollars for every one it ships out.
      </h1>
      <p className="mt-6 max-w-3xl text-[15px] md:text-[16px] text-slate1 leading-relaxed">
        Lebanon recorded <span className="num text-ink">{usd(h.values.imports)}</span> in
        imports against just <span className="num text-ink">{usd(h.values.total_exports)}</span> in
        outbound shipments, leaving a <span className="text-burgundy num">{usd(h.values.trade_deficit)} deficit</span>{' '}
        — equivalent to {pct(h.ratios.deficit_to_imports_pct)} of the import bill. Below: a partner-by-partner,
        chapter-by-chapter ledger drawn from {int(h.counts.import_hs6_lines + h.counts.export_hs6_lines)}{' '}
        HS-6 product lines across {h.counts.import_partners} import sources and {h.counts.export_partners} export
        destinations.
      </p>
    </section>
  )
}

function Headlines({ h }) {
  return (
    <section className="fade-in">
      <SectionHead
        eyebrow="Headline Aggregates"
        title="The numbers, in a single glance."
        kicker="All values in current US dollars. Domestic exports and re-exports are reported separately to surface Lebanon's transit-trade role."
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricTile
          label="Total Imports"
          value={usd(h.values.imports)}
          sub={`From ${h.counts.import_partners} partners · ${int(h.counts.import_hs6_lines)} HS-6 lines`}
          accent="burgundy"
        />
        <MetricTile
          label="Domestic Exports"
          value={usd(h.values.domestic_exports)}
          sub={`Lebanese-origin shipments to ${h.counts.export_partners} markets`}
          accent="cedar"
        />
        <MetricTile
          label="Re-Exports"
          value={usd(h.values.re_exports)}
          sub={`${pct(h.ratios.re_export_share_of_exports_pct)} of total outbound shipments`}
          accent="gold"
        />
        <MetricTile
          label="Trade Deficit"
          value={usd(h.values.trade_deficit)}
          sub={`Export coverage ratio: ${pct(h.ratios.export_coverage_pct)}`}
          accent="burgundy"
        />
      </div>
    </section>
  )
}

function TopPartners({ partners, totalImp, totalExp }) {
  const top = partners.slice(0, 12)
  return (
    <section className="fade-in">
      <SectionHead
        eyebrow="Partners · Top Twelve by Two-Way Trade"
        title="The geography of Beirut's import bill — and where its exports actually go."
        kicker="China dominates the import side; the United Arab Emirates is the single largest destination for Lebanese exports. Greece and Switzerland appear high in imports thanks to fuel transshipment and the gold trade respectively."
      />
      <Card>
        <table className="dt">
          <thead>
            <tr>
              <th style={{ width: '6%' }}>Rank</th>
              <th>Partner</th>
              <th>Region</th>
              <th className="text-right">Imports</th>
              <th>Share</th>
              <th className="text-right">Exports</th>
              <th>Share</th>
              <th className="text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {top.map((p, i) => {
              const impShare = (p.imports / totalImp) * 100
              const expShare = (p.total_exports / totalExp) * 100
              const bal = balanceStyle(p.balance)
              return (
                <tr key={p.code}>
                  <td className="num text-slate2">{String(i + 1).padStart(2, '0')}</td>
                  <td>
                    <div className="font-medium text-ink">{p.name}</div>
                    <div className="text-[11px] text-slate2 num">M49 {p.code}</div>
                  </td>
                  <td><Tag>{p.region}</Tag></td>
                  <td className="text-right num">{usd(p.imports)}</td>
                  <td style={{ width: '14%' }}>
                    <ShareBar pctValue={impShare} variant="import" />
                    <div className="text-[10.5px] num text-slate2 mt-1">{impShare.toFixed(1)}%</div>
                  </td>
                  <td className="text-right num">{usd(p.total_exports)}</td>
                  <td style={{ width: '14%' }}>
                    <ShareBar pctValue={expShare} variant="export" />
                    <div className="text-[10.5px] num text-slate2 mt-1">{expShare.toFixed(1)}%</div>
                  </td>
                  <td className={`text-right num ${bal.className}`}>{bal.label}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </section>
  )
}

function TopChapters({ chapters }) {
  const top = chapters.slice(0, 10)
  return (
    <section className="fade-in">
      <SectionHead
        eyebrow="Composition · Top Ten HS Chapters by Trade Value"
        title="Two chapters — fuel and gold — account for over a third of imports."
        kicker="Lebanon's import basket is shaped by structural energy dependence (HS 27) and the country's long-standing role as a Levantine gold and jewellery entrepôt (HS 71)."
      />
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <table className="dt">
              <thead>
                <tr>
                  <th>Chapter</th>
                  <th className="text-right">Imports</th>
                  <th className="text-right">Domestic Exp.</th>
                  <th className="text-right">Re-exp.</th>
                  <th className="text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {top.map(c => {
                  const bal = balanceStyle(c.balance)
                  return (
                    <tr key={c.hs2}>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="num text-slate2 text-[11px]">{c.hs2}</span>
                          <span className="font-medium text-ink">{c.name}</span>
                        </div>
                        <div className="text-[11px] text-slate2 mt-0.5">{c.section_roman} · {c.section}</div>
                      </td>
                      <td className="text-right num">{usd(c.imports)}</td>
                      <td className="text-right num">{usd(c.dx)}</td>
                      <td className="text-right num text-gold">{usd(c.rx)}</td>
                      <td className={`text-right num ${bal.className}`}>{bal.label}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHead title="Imports vs Exports" sub="Top 10 chapters, USD millions" />
            <div className="p-3 h-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={top.map(c => ({
                  name: c.name.split(',')[0].slice(0, 18),
                  imp: c.imports / 1e6,
                  exp: (c.dx + c.rx) / 1e6,
                }))} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
                  <XAxis type="number" stroke="#8a8a8a" fontSize={10} />
                  <YAxis dataKey="name" type="category" stroke="#0d1117" fontSize={10.5} width={110} interval={0} />
                  <Tooltip formatter={(v) => `$${Number(v).toFixed(0)}M`} />
                  <Bar dataKey="imp" fill="#7a2e2e" name="Imports" />
                  <Bar dataKey="exp" fill="#3d5a40" name="Exports" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

function Regions({ regions }) {
  const total = regions.reduce((s, r) => s + r.total, 0)
  return (
    <section className="fade-in">
      <SectionHead
        eyebrow="Regional Mosaic"
        title="The EU is Lebanon's biggest counterpart — but the GCC tilts the export ledger."
        kicker="On imports the European Union sets the pace; on exports the picture inverts, with Gulf Cooperation Council markets absorbing the largest share of Lebanese-origin and re-exported goods."
      />
      <Card>
        <table className="dt">
          <thead>
            <tr>
              <th>Region</th>
              <th className="text-right">Imports</th>
              <th className="text-right">Domestic Exp.</th>
              <th className="text-right">Re-exp.</th>
              <th className="text-right">Total Trade</th>
              <th>Share of Total</th>
              <th className="text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {regions.map(r => {
              const share = (r.total / total) * 100
              const bal = balanceStyle(r.balance)
              return (
                <tr key={r.region}>
                  <td className="font-medium">{r.region}</td>
                  <td className="text-right num">{usd(r.imports)}</td>
                  <td className="text-right num">{usd(r.dx)}</td>
                  <td className="text-right num">{usd(r.rx)}</td>
                  <td className="text-right num text-ink">{usd(r.total)}</td>
                  <td style={{ width: '18%' }}>
                    <ShareBar pctValue={share} variant="export" />
                    <div className="text-[10.5px] num text-slate2 mt-1">{share.toFixed(1)}%</div>
                  </td>
                  <td className={`text-right num ${bal.className}`}>{bal.label}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </section>
  )
}

function Concentration({ concentration }) {
  const rows = [
    { key: 'imports', label: 'Imports', tone: 'burgundy', d: concentration.imports },
    { key: 'domestic_exports', label: 'Domestic Exports', tone: 'cedar', d: concentration.domestic_exports },
    { key: 're_exports', label: 'Re-Exports', tone: 'gold', d: concentration.re_exports },
  ]
  const hhiLabel = v => {
    if (v < 1500) return 'Unconcentrated'
    if (v < 2500) return 'Moderately concentrated'
    return 'Highly concentrated'
  }
  return (
    <section className="fade-in">
      <SectionHead
        eyebrow="Concentration Metrics"
        title="Re-exports cluster narrowly; imports are broadly diversified."
        kicker="Herfindahl–Hirschman Index measured on partner and product shares (0–10,000 scale). The contrast between imports and re-exports tells you everything about the structure of Lebanon's trade hub function."
      />
      <Card>
        <table className="dt">
          <thead>
            <tr>
              <th>Flow</th>
              <th className="text-right">Partner HHI</th>
              <th className="text-right">Product HHI</th>
              <th className="text-right">Top 1 Partner</th>
              <th className="text-right">Top 5 Partners</th>
              <th className="text-right">Top 10 Products</th>
              <th className="text-right"># Partners</th>
              <th className="text-right"># Products</th>
              <th>Assessment</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.key}>
                <td><Tag tone={r.tone}>{r.label}</Tag></td>
                <td className="text-right num">{r.d.partner_hhi.toFixed(0)}</td>
                <td className="text-right num">{r.d.product_hhi.toFixed(0)}</td>
                <td className="text-right num">{pct(r.d.top1_partner_pct)}</td>
                <td className="text-right num">{pct(r.d.top5_partner_pct)}</td>
                <td className="text-right num">{pct(r.d.top10_product_pct)}</td>
                <td className="text-right num">{r.d.n_partners}</td>
                <td className="text-right num">{r.d.n_products.toLocaleString()}</td>
                <td className="text-slate1 text-[12px]">{hhiLabel(r.d.partner_hhi)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  )
}
