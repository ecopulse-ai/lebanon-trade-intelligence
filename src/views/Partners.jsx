import { useMemo, useState } from 'react'
import { useData } from '../lib/data.js'
import { usd, balanceStyle } from '../lib/format.js'
import {
  Card,
  CardHead,
  Eyebrow,
  Loading,
  SectionHead,
  ShareBar,
  Tag,
} from '../components/ui.jsx'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export default function Partners() {
  const parts = useData('partners.json')
  const bilateral = useData('partner_hs2.json')

  const [selected, setSelected] = useState(null)  // partner code
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('total')   // total | imports | exports | balance

  if (parts.loading || bilateral.loading) {
    return <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12"><Loading /></div>
  }

  const partners = parts.data.partners
  const totals = {
    imports: partners.reduce((s, p) => s + p.imports, 0),
    exports: partners.reduce((s, p) => s + p.total_exports, 0),
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    let list = q
      ? partners.filter(p => p.name.toLowerCase().includes(q) || String(p.code).includes(q))
      : [...partners]
    list.sort((a, b) => {
      if (sortBy === 'imports') return b.imports - a.imports
      if (sortBy === 'exports') return b.total_exports - a.total_exports
      if (sortBy === 'balance') return b.balance - a.balance
      return b.total - a.total
    })
    return list
  }, [partners, search, sortBy])

  const selectedPartner = selected ? partners.find(p => p.code === selected) : null
  const selectedComposition = selected ? (bilateral.data[String(selected)] || []) : []

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10 space-y-10">
      <SectionHead
        eyebrow="The Counterpart Atlas"
        title="Every country Lebanon traded with in 2024."
        kicker="Sortable, searchable. Click any partner to open a bilateral composition view — the HS chapters that define that relationship."
      />

      <div className="grid lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-7">
          <div className="px-5 py-4 border-b border-rule flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <Eyebrow>Sort</Eyebrow>
              {['total', 'imports', 'exports', 'balance'].map(s => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={[
                    'text-[12px] px-3 py-1 border transition-colors capitalize num',
                    sortBy === s
                      ? 'bg-ink text-bone border-ink'
                      : 'bg-bone text-slate1 border-rule hover:text-ink',
                  ].join(' ')}
                >
                  {s}
                </button>
              ))}
            </div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search partner…"
              className="border border-rule bg-bone px-3 py-1.5 text-[13px] num focus:outline-none focus:border-cedar w-56"
            />
          </div>
          <div className="max-h-[680px] overflow-y-auto">
            <table className="dt">
              <thead className="sticky top-0 bg-bone z-10">
                <tr>
                  <th>Partner</th>
                  <th>Region</th>
                  <th className="text-right">Imports</th>
                  <th className="text-right">Exports</th>
                  <th className="text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const bal = balanceStyle(p.balance)
                  const active = p.code === selected
                  return (
                    <tr
                      key={p.code}
                      onClick={() => setSelected(p.code)}
                      className={`cursor-pointer ${active ? 'bg-cedar/10' : ''}`}
                    >
                      <td>
                        <div className={`font-medium ${active ? 'text-cedar' : 'text-ink'}`}>{p.name}</div>
                        <div className="text-[11px] text-slate2 num">M49 {p.code}</div>
                      </td>
                      <td><Tag>{p.region}</Tag></td>
                      <td className="text-right num">{usd(p.imports)}</td>
                      <td className="text-right num">{usd(p.total_exports)}</td>
                      <td className={`text-right num ${bal.className}`}>{bal.label}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="lg:col-span-5">
          {selectedPartner ? (
            <PartnerDetail partner={selectedPartner} composition={selectedComposition} />
          ) : (
            <Card>
              <div className="p-10 text-center">
                <Eyebrow className="mb-3">Bilateral Composition</Eyebrow>
                <p className="text-slate1 text-[14px] leading-relaxed">
                  Select a partner to see the HS chapters that define Lebanon's
                  trade with that country.
                </p>
                <p className="display text-[28px] mt-4 text-slate2">Pick a row →</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function PartnerDetail({ partner, composition }) {
  const top = composition.slice(0, 10)
  const chartData = top.map(c => ({
    name: c.name.split(',')[0].slice(0, 16),
    imp: c.imports / 1e6,
    exp: (c.dx + c.rx) / 1e6,
  }))
  const bal = balanceStyle(partner.balance)
  return (
    <Card>
      <div className="px-5 py-4 border-b border-rule">
        <Eyebrow className="mb-1">Bilateral</Eyebrow>
        <div className="display text-[26px] text-ink leading-tight">{partner.name}</div>
        <div className="text-[12px] text-slate1 num mt-1">
          M49 {partner.code} · {partner.region}
        </div>
      </div>
      <div className="px-5 py-4 grid grid-cols-3 gap-3 border-b border-rule">
        <div>
          <Eyebrow>Imports</Eyebrow>
          <div className="display text-[22px] text-burgundy num">{usd(partner.imports)}</div>
        </div>
        <div>
          <Eyebrow>Exports</Eyebrow>
          <div className="display text-[22px] text-cedar num">{usd(partner.total_exports)}</div>
        </div>
        <div>
          <Eyebrow>Balance</Eyebrow>
          <div className={`display text-[22px] num ${bal.className}`}>{bal.label}</div>
        </div>
      </div>

      <div className="p-3 h-[280px] border-b border-rule">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
            <XAxis type="number" stroke="#8a8a8a" fontSize={10} />
            <YAxis dataKey="name" type="category" stroke="#0d1117" fontSize={10} width={100} interval={0} />
            <Tooltip formatter={(v) => `$${Number(v).toFixed(1)}M`} />
            <Bar dataKey="imp" fill="#7a2e2e" name="Imports" />
            <Bar dataKey="exp" fill="#3d5a40" name="Exports" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="max-h-[320px] overflow-y-auto">
        <table className="dt">
          <thead className="sticky top-0 bg-bone z-10">
            <tr>
              <th>Chapter</th>
              <th className="text-right">Imp</th>
              <th className="text-right">Exp</th>
            </tr>
          </thead>
          <tbody>
            {composition.map(c => (
              <tr key={c.hs2}>
                <td>
                  <span className="num text-slate2 text-[11px] mr-1.5">{c.hs2}</span>
                  <span className="text-[13px]">{c.name}</span>
                </td>
                <td className="text-right num text-burgundy">{c.imports > 0 ? usd(c.imports) : '—'}</td>
                <td className="text-right num text-cedar">{c.dx + c.rx > 0 ? usd(c.dx + c.rx) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
