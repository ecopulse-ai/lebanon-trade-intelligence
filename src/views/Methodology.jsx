import { Eyebrow, SectionHead, Card } from '../components/ui.jsx'

export default function Methodology() {
  return (
    <div className="max-w-[900px] mx-auto px-6 lg:px-10 py-12 space-y-10">
      <SectionHead
        eyebrow="Methodology"
        title="What you are looking at, and what you are not."
        kicker="A short note on data sources, definitions, transformations and known caveats."
      />

      <article className="space-y-8 text-[15px] leading-[1.75] text-ink">
        <section>
          <Eyebrow className="mb-2">Source</Eyebrow>
          <p>
            All figures are drawn from the United Nations International Trade Statistics
            Database (UN Comtrade), annual public release. Reporter: Lebanon (M49 code 422).
            Reference year: 2024. The file is the standard Comtrade tab-separated extract
            (<span className="num">C_A_H5_422_2024</span>) covering <span className="num">183,761</span> records
            before deduplication.
          </p>
        </section>

        <section>
          <Eyebrow className="mb-2">Classification</Eyebrow>
          <p>
            Commodity codes follow the World Customs Organization's Harmonized System,
            Revision 5 (2017 nomenclature). Three levels appear in the dataset:
            two-digit chapters (99 categories), four-digit headings, and six-digit
            subheadings. The 2017 revision is the basis on which most countries currently
            report and is comparable across reporters from 2017 onward.
          </p>
        </section>

        <section>
          <Eyebrow className="mb-2">Aggregation</Eyebrow>
          <p>
            Comtrade publishes the same underlying trade at multiple levels of the HS
            hierarchy — a single shipment may appear as an HS-2 chapter line, an HS-4
            heading line, and an HS-6 subheading line. To avoid triple-counting, this
            portal uses only line items where <span className="num">isAggregate = 0</span>,
            which restricts the universe to true six-digit transaction-level rows. The
            "World" partner aggregate (M49 code 0) is excluded for the same reason —
            its totals overlap with the sum of bilateral flows.
          </p>
        </section>

        <section>
          <Eyebrow className="mb-2">Flows</Eyebrow>
          <ul className="space-y-2 list-none pl-0">
            <li><span className="num font-medium">M</span> · Imports — inbound goods entering Lebanese customs territory.</li>
            <li><span className="num font-medium">DX</span> · Domestic Exports — Lebanese-origin goods shipped abroad.</li>
            <li><span className="num font-medium">RX</span> · Re-Exports — goods previously imported and then re-exported without substantial transformation.</li>
            <li><span className="num font-medium">RM</span> · Re-Imports — Lebanese-origin goods returning.</li>
            <li><span className="num font-medium">X</span> · Total Exports (DX + RX). Reported separately by Comtrade; this portal recomputes from DX and RX.</li>
          </ul>
        </section>

        <section>
          <Eyebrow className="mb-2">Valuation</Eyebrow>
          <p>
            All figures use the <span className="num">primaryValue</span> field, expressed in
            current US dollars. Imports are reported on a CIF basis where available and
            exports on an FOB basis, following Comtrade convention. Trade balance is computed
            as (DX + RX) − M.
          </p>
        </section>

        <section>
          <Eyebrow className="mb-2">Concentration metrics</Eyebrow>
          <p>
            The Herfindahl–Hirschman Index reported on the Overview page is calculated as
            the sum of squared percentage shares (<span className="num">Σ s²ᵢ</span>) on a
            0–10,000 scale. Partner HHI uses bilateral shares across countries; product HHI
            uses HS-6 subheading shares. Conventional benchmarks: under 1,500 unconcentrated,
            1,500–2,500 moderately concentrated, above 2,500 highly concentrated.
          </p>
        </section>

        <section>
          <Eyebrow className="mb-2">Known caveats</Eyebrow>
          <ul className="space-y-3 list-none pl-0">
            <li>
              <span className="font-medium">Currency-crisis valuation.</span> Lebanon's
              parallel-market exchange rate has diverged substantially from official
              rates since 2019. Customs valuation conventions may understate the true
              USD-equivalent value of certain transactions, particularly those settled
              in Lebanese pounds at administered rates.
            </li>
            <li>
              <span className="font-medium">Mode of transport.</span> The
              <span className="num"> motCode </span>
              field is zero across all records in this release, meaning no port-level
              or transport-mode breakdown is available. A port-modal-split view (Beirut /
              Tripoli / Masnaa land crossing / air) would require complementary data from
              Lebanese Customs.
            </li>
            <li>
              <span className="font-medium">Special partner codes.</span> Comtrade uses
              area codes like Bunkers (837), Free Zones (838), and Areas n.e.s. (896, 899)
              for shipments that cannot be allocated to a specific country. These appear
              in the Partners tab under "Special / Unallocated."
            </li>
            <li>
              <span className="font-medium">Single-year window.</span> This is a 2024
              snapshot. Time-series analysis (e.g. crisis composition shift) requires
              additional yearly extracts; the data pipeline scales trivially to multi-year
              inputs.
            </li>
          </ul>
        </section>

        <section>
          <Eyebrow className="mb-2">Reproduction</Eyebrow>
          <p>
            The full ETL pipeline that produces every figure shown here is in
            <span className="num"> /scripts/prepare_data.py</span>. It accepts the raw
            Comtrade TSV as input and emits JSON files into{' '}
            <span className="num">/public/data/</span>. To rebuild from a fresh download,
            run <span className="num">npm run prepare-data</span>.
          </p>
        </section>

        <section>
          <Eyebrow className="mb-2">Citation</Eyebrow>
          <p className="text-slate1">
            UN Comtrade Database. International Trade Statistics. Lebanon, 2024 (HS Revision 5).
            United Nations Statistics Division. Retrieved 2026.
          </p>
        </section>
      </article>
    </div>
  )
}
