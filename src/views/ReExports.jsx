import { useData } from '../lib/data.js'
import { usd, pct } from '../lib/format.js'
import {
  Card,
  CardHead,
  Eyebrow,
  Loading,
  MetricTile,
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

export default function ReExports() {
  const head = useData('headlines.json')
  const rxd = useData('reexports.json')
  const conc = useData('concentration.json')

  if (head.loading || rxd.loading || conc.loading) {
    return <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12"><Loading /></div>
  }

  const h = head.data
  const d = rxd.data
  const c = conc.data.re_exports

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10 space-y-12">
      <Hero h={h} d={d} />

      <section className="fade-in">
        <SectionHead
          eyebrow="The Concentration Story"
          title="A small number of goods, headed to a small number of places."
          kicker="Lebanon's re-export trade looks nothing like its import or domestic-export trade. Two destinations absorb half the value; two product chapters define almost the whole basket."
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricTile
            label="Top Destination"
            value={pct(c.top1_partner_pct)}
            sub={`${d.top_partners[0].name} alone`}
            accent="gold"
          />
          <MetricTile
            label="Top 5 Destinations"
            value={pct(c.top5_partner_pct)}
            sub={`Combined share`}
            accent="gold"
          />
          <MetricTile
            label="Top 10 Products"
            value={pct(c.top10_product_pct)}
            sub={`Of total re-export value`}
            accent="gold"
          />
          <MetricTile
            label="Partner HHI"
            value={c.partner_hhi.toFixed(0)}
            sub={c.partner_hhi >= 2500 ? 'Highly concentrated' : 'Moderately concentrated'}
            accent="gold"
          />
        </div>
      </section>

      <section className="fade-in grid lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-7">
          <CardHead title="Top Re-Export Commodities" sub="HS-6 lines, 2024" />
          <table className="dt">
            <thead>
              <tr>
                <th>Code</th>
                <th>Description</th>
                <th>Chapter</th>
                <th className="text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {d.top_commodities.slice(0, 15).map(p => (
                <tr key={p.code}>
                  <td className="num text-slate2 text-[12px]">{p.code}</td>
                  <td>
                    <div className="text-ink">{p.label}</div>
                  </td>
                  <td>
                    <span className="num text-slate2 text-[11px] mr-1">{p.hs2}</span>
                    <span className="text-[12px]">{p.chapter}</span>
                  </td>
                  <td className="text-right num text-gold">{usd(p.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="lg:col-span-5">
          <CardHead title="Top Re-Export Destinations" sub="USD value, 2024" />
          <div className="p-3 h-[460px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={d.top_partners.slice(0, 12).map(p => ({
                  name: p.name,
                  value: p.value / 1e6,
                }))}
                layout="vertical"
                margin={{ top: 4, right: 20, bottom: 4, left: 8 }}
              >
                <XAxis type="number" stroke="#8a8a8a" fontSize={10} />
                <YAxis dataKey="name" type="category" stroke="#0d1117" fontSize={10.5} width={130} interval={0} />
                <Tooltip formatter={(v) => `$${Number(v).toFixed(1)}M`} />
                <Bar dataKey="value" fill="#a87c2a" name="Re-Exports" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <section className="fade-in">
        <SectionHead
          eyebrow="Re-Export vs Domestic Export · By Chapter"
          title="Which chapters does Lebanon make, and which does Lebanon merely pass through?"
          kicker="The re-export share — the third column below — separates the country's industrial base from its commercial transit role. Chapters where the re-export share is high are pure entrepôt categories; chapters where it is low reflect domestic production."
        />
        <Card>
          <table className="dt">
            <thead>
              <tr>
                <th>Chapter</th>
                <th className="text-right">Domestic Exports</th>
                <th className="text-right">Re-Exports</th>
                <th>Re-Export Share of Outbound</th>
                <th className="text-right">% of Outbound</th>
              </tr>
            </thead>
            <tbody>
              {d.chapter_compare.map(c => (
                <tr key={c.hs2}>
                  <td>
                    <span className="num text-slate2 text-[11px] mr-2">{c.hs2}</span>
                    <span className="font-medium text-ink">{c.name}</span>
                  </td>
                  <td className="text-right num text-cedar">{usd(c.dx)}</td>
                  <td className="text-right num text-gold">{usd(c.rx)}</td>
                  <td style={{ width: '28%' }}>
                    <ShareBar pctValue={c.rx_share} variant="rx" />
                  </td>
                  <td className="text-right num text-ink">{pct(c.rx_share)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>

      <section className="fade-in">
        <Card className="p-6 lg:p-8">
          <Eyebrow className="mb-3">Reader's Note</Eyebrow>
          <p className="text-slate1 text-[14.5px] leading-relaxed max-w-3xl">
            Re-exports are a particular kind of trade flow: goods imported into Lebanon
            and then shipped onward, typically without substantial transformation.
            Historically, Beirut's role as a Mediterranean transit hub made re-exports
            a major share of outbound trade. In 2024 they accounted for{' '}
            <span className="num text-gold">{pct((d.total_rx / (d.total_rx + (d.chapter_compare.reduce((s, c) => s + c.dx, 0))))*100)}</span>{' '}
            of total exports — a meaningful but no longer dominant share, reflecting both
            the post-2019 contraction of Lebanese banking-and-trade intermediation and the
            displacement of regional transit by Gulf ports.
          </p>
        </Card>
      </section>
    </div>
  )
}

function Hero({ h, d }) {
  return (
    <section className="border-b border-rule pb-10 fade-in">
      <Eyebrow className="mb-3">The Entrepôt Question</Eyebrow>
      <h1 className="display text-[40px] md:text-[58px] leading-[1] tracking-tightest text-ink max-w-4xl">
        Beirut's transit trade, by the numbers.
      </h1>
      <p className="mt-6 max-w-3xl text-[15px] md:text-[16px] text-slate1 leading-relaxed">
        Lebanon re-exported <span className="num text-gold">{usd(d.total_rx)}</span>{' '}
        worth of goods in 2024 — {pct(h.ratios.re_export_share_of_exports_pct)} of total outbound
        trade. The pattern is unmistakeable: this is largely a vehicles-and-jewellery
        flow, headed for Gulf and African markets. Cars assembled in the Far East,
        gold processed in Switzerland, electronics from East Asia — all crossing Beirut
        on their way somewhere else.
      </p>
    </section>
  )
}
