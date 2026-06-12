import { useMemo, useState } from 'react'
import { useData } from '../lib/data.js'
import { usd, pct, balanceStyle } from '../lib/format.js'
import {
  Card,
  CardHead,
  Eyebrow,
  Loading,
  SectionHead,
  ShareBar,
  Tag,
} from '../components/ui.jsx'

const FLOWS = [
  { key: 'imports', label: 'Imports', tone: 'burgundy' },
  { key: 'dx', label: 'Domestic Exports', tone: 'cedar' },
  { key: 'rx', label: 'Re-Exports', tone: 'gold' },
  { key: 'total', label: 'Total Trade', tone: 'neutral' },
]

export default function HSExplorer() {
  const exp = useData('hs_explorer.json')
  const [flow, setFlow] = useState('total')
  const [openChap, setOpenChap] = useState(null)
  const [openHead, setOpenHead] = useState(null)
  const [search, setSearch] = useState('')

  const chapters = exp.data?.chapters ?? []

  const filteredChapters = useMemo(() => {
    if (!search.trim()) return chapters
    const q = search.toLowerCase()
    return chapters
      .map(c => {
        const matchChap = c.label.toLowerCase().includes(q) || c.code.includes(q)
        const headings = c.children.filter(h => {
          const matchHead = h.label.toLowerCase().includes(q) || h.code.includes(q)
          const subs = h.children.filter(s =>
            s.label.toLowerCase().includes(q) || s.code.includes(q)
          )
          if (matchHead || subs.length) return true
          return false
        })
        if (matchChap || headings.length) return { ...c, children: headings.length ? headings : c.children }
        return null
      })
      .filter(Boolean)
  }, [chapters, search])

  if (exp.loading) {
    return <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12"><Loading /></div>
  }

  const totalForFlow = chapters.reduce((s, c) => s + (c[flow] || 0), 0)
  const sorted = [...filteredChapters].sort((a, b) => (b[flow] || 0) - (a[flow] || 0))

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10 space-y-10">
      <SectionHead
        eyebrow="The HS Ledger"
        title="Drill into Lebanon's trade — chapter by chapter, line by line."
        kicker="Every commodity Lebanon imported or exported in 2024, organised by the World Customs Organization's Harmonised System (Revision 5). Expand a chapter to see four-digit headings; expand a heading to see six-digit lines."
      />

      <Card>
        <div className="px-5 py-4 border-b border-rule flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="eyebrow mr-2">View</span>
            {FLOWS.map(f => (
              <button
                key={f.key}
                onClick={() => setFlow(f.key)}
                className={[
                  'text-[12px] tracking-wide px-3 py-1.5 border transition-colors num',
                  flow === f.key
                    ? 'bg-ink text-bone border-ink'
                    : 'bg-bone text-slate1 border-rule hover:text-ink hover:border-ink/40',
                ].join(' ')}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="eyebrow">Search</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="chapter, code, or keyword"
              className="border border-rule bg-bone px-3 py-1.5 text-[13px] num focus:outline-none focus:border-cedar w-64"
            />
          </div>
        </div>

        <div>
          <table className="dt">
            <thead>
              <tr>
                <th style={{ width: '6%' }}></th>
                <th style={{ width: '8%' }}>Code</th>
                <th>Description</th>
                <th>Section</th>
                <th className="text-right">Value</th>
                <th>Share</th>
                <th className="text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(c => {
                const v = c[flow] || 0
                if (v === 0 && flow !== 'total') return null
                const share = totalForFlow > 0 ? (v / totalForFlow) * 100 : 0
                const open = openChap === c.code
                const bal = balanceStyle((c.dx + c.rx) - c.imports)
                return (
                  <ChapterRows
                    key={c.code}
                    chapter={c}
                    open={open}
                    onToggle={() => {
                      setOpenChap(open ? null : c.code)
                      setOpenHead(null)
                    }}
                    openHead={openHead}
                    setOpenHead={setOpenHead}
                    flow={flow}
                    share={share}
                    balanceTone={bal}
                    valueDisplay={usd(v)}
                  />
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <FlowLegend flow={flow} />
    </div>
  )
}

function ChapterRows({ chapter, open, onToggle, openHead, setOpenHead, flow, share, balanceTone, valueDisplay }) {
  const c = chapter
  return (
    <>
      <tr className="cursor-pointer" onClick={onToggle}>
        <td className="num text-cedar font-semibold">{open ? '–' : '+'}</td>
        <td className="num text-slate2">{c.code}</td>
        <td>
          <div className="font-medium text-ink">{c.label}</div>
        </td>
        <td><Tag>{c.section_roman} · {c.section}</Tag></td>
        <td className="text-right num text-ink">{valueDisplay}</td>
        <td style={{ width: '16%' }}>
          <ShareBar pctValue={share} variant={shareVariant(flow)} />
          <div className="text-[10.5px] num text-slate2 mt-1">{share.toFixed(2)}%</div>
        </td>
        <td className={`text-right num ${balanceTone.className}`}>{balanceTone.label}</td>
      </tr>
      {open && c.children.map(h => {
        const hv = h[flow] || 0
        if (hv === 0 && flow !== 'total') return null
        const headOpen = openHead === h.code
        const hShare = c[flow] > 0 ? (hv / c[flow]) * 100 : 0
        const hBal = balanceStyle((h.dx + h.rx) - h.imports)
        return (
          <>
            <tr key={h.code} className="bg-bone2/30 cursor-pointer" onClick={() => setOpenHead(headOpen ? null : h.code)}>
              <td className="num text-cedar text-[12px] pl-8">{headOpen ? '–' : '+'}</td>
              <td className="num text-slate2 pl-4">{h.code}</td>
              <td className="pl-4">
                <div className="text-ink">{h.label}</div>
              </td>
              <td></td>
              <td className="text-right num text-ink">{usd(hv)}</td>
              <td style={{ width: '16%' }}>
                <ShareBar pctValue={hShare} variant={shareVariant(flow)} />
                <div className="text-[10.5px] num text-slate2 mt-1">{hShare.toFixed(1)}% of {c.code}</div>
              </td>
              <td className={`text-right num ${hBal.className}`}>{hBal.label}</td>
            </tr>
            {headOpen && h.children.map(s => {
              const sv = s[flow] || 0
              if (sv === 0 && flow !== 'total') return null
              const sShare = h[flow] > 0 ? (sv / h[flow]) * 100 : 0
              const sBal = balanceStyle((s.dx + s.rx) - s.imports)
              return (
                <tr key={s.code} className="bg-bone2/50">
                  <td className="pl-12"></td>
                  <td className="num text-slate2 pl-8 text-[12px]">{s.code}</td>
                  <td className="pl-8 text-[13px] text-slate1">{s.label}</td>
                  <td></td>
                  <td className="text-right num text-slate1">{usd(sv)}</td>
                  <td style={{ width: '16%' }}>
                    <ShareBar pctValue={sShare} variant={shareVariant(flow)} />
                    <div className="text-[10.5px] num text-slate2 mt-1">{sShare.toFixed(1)}% of {h.code}</div>
                  </td>
                  <td className={`text-right num ${sBal.className}`}>{sBal.label}</td>
                </tr>
              )
            })}
          </>
        )
      })}
    </>
  )
}

function shareVariant(flow) {
  return flow === 'imports' ? 'import' : flow === 'rx' ? 'rx' : 'export'
}

function FlowLegend({ flow }) {
  const items = {
    imports: 'Inbound flows from foreign suppliers, valued CIF where reported.',
    dx: 'Lebanese-origin goods sold abroad; the conventional "exports" used in policy discussion.',
    rx: 'Goods previously imported and then re-exported without substantial transformation. A measure of Lebanon\'s entrepôt role.',
    total: 'Sum of imports plus all outbound shipments (domestic exports + re-exports).',
  }
  return (
    <p className="text-[13px] text-slate1 max-w-3xl">
      <Eyebrow className="inline mr-2">Definition</Eyebrow>
      {items[flow]}
    </p>
  )
}
