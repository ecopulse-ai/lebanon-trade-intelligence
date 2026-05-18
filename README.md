# Lebanon Trade Intelligence Portal

> *The Beirut Trade Ledger* — a granular reading of Lebanon's 2024 external trade,
> drawn from UN Comtrade microdata (HS Revision 5).

A standalone analytics portal in the same family as the GCC Optimal Shipping Routes
platform. Built for institutional clients — central banks, ministries, IFIs, market
analysts — who want partner-by-partner and HS-by-HS visibility into Lebanon's trade,
not a glossy infographic.

## What's inside

| View | What it answers |
|---|---|
| **Overview** | Headline aggregates, top 12 partners, top 10 chapters, regional mosaic, concentration metrics (HHI on partners and products) |
| **HS Explorer** | Drill-down from HS-2 chapter → HS-4 heading → HS-6 subheading, switchable by flow (M / DX / RX / total), with search |
| **Partners** | Sortable, searchable list of all 189 import partners and 172 export partners, with click-through bilateral composition |
| **Re-Export Hub** | Lebanon's transit-trade role — top re-exported HS-6 commodities, destinations, and re-export share by chapter |
| **Methodology** | Sources, definitions, transformations, caveats, citation |

## Stack

- **Frontend**: React 18 + Vite + React Router
- **Styling**: Tailwind CSS with a custom editorial palette (cream / cedar / burgundy / gold)
- **Charts**: Recharts
- **Typography**: Fraunces (display) + IBM Plex Sans (body) + IBM Plex Mono (data)
- **Data prep**: Python 3 + pandas (one-shot ETL → JSON)
- **Deploy**: Vercel (zero-config)

## Architecture

```
lebanon-trade-intelligence/
├── data/
│   └── C_A_H5_422_2024.tsv         # Raw UN Comtrade extract (input)
├── scripts/
│   ├── prepare_data.py             # ETL: TSV → JSON
│   ├── country_codes.py            # M49 → name / region / iso2 lookup
│   └── hs_codes.py                 # HS chapter / heading / 6-digit labels
├── public/
│   └── data/                       # Generated JSON files
│       ├── headlines.json
│       ├── partners.json
│       ├── chapters.json
│       ├── hs_explorer.json
│       ├── partner_hs2.json
│       ├── reexports.json
│       ├── concentration.json
│       └── regions.json
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── components/
    │   ├── Layout.jsx
    │   └── ui.jsx
    ├── lib/
    │   ├── data.js                 # fetch + cache hook
    │   └── format.js               # USD, percent, balance formatters
    └── views/
        ├── Overview.jsx
        ├── HSExplorer.jsx
        ├── Partners.jsx
        ├── ReExports.jsx
        └── Methodology.jsx
```

## Local development

```bash
# 1. Generate the JSON data files from the raw Comtrade TSV
python3 scripts/prepare_data.py

# 2. Install JS dependencies
npm install

# 3. Run the dev server
npm run dev
```

The dev server runs at `http://localhost:5173`.

## Production build

```bash
npm run build       # outputs to dist/
npm run preview     # local preview of the built app
```

## Deployment to Vercel

```bash
vercel
```

Vercel auto-detects Vite and uses the configuration in `vercel.json`. The
`/data/*.json` route is set to cache for one hour; static assets are immutable.

## Updating with new data

When a new Comtrade vintage is released (or when extending to multiple years):

1. Drop the new TSV file(s) into `data/` keeping the same column schema.
2. If multi-year, modify `prepare_data.py` to concatenate before grouping.
3. Run `python3 scripts/prepare_data.py`.
4. Commit and push — Vercel rebuilds automatically.

The data pipeline scales linearly with row count and handles any reporter or year
on the standard Comtrade schema. To switch reporters (e.g. Syria, Jordan), change
the input file path and the `reporter_code` / `reporter` fields at the top of
`main()` in `prepare_data.py`.

## Data caveats

See the in-app **Methodology** page for a fuller treatment. Headline points:

- Values are in current US dollars (Comtrade `primaryValue`); imports CIF, exports FOB.
- Aggregation uses **line items only** (`isAggregate=0`) to avoid HS-level double-counting.
- The "World" partner aggregate (code 0) is excluded — its totals overlap bilateral flows.
- **Mode of transport is not reported** in this release (all `motCode=0`), so a port-modal split
  is not available. A future iteration could merge in Lebanese Customs port-of-entry data.
- 2024 is a single-year snapshot; multi-year time-series views are not yet implemented.

## License & Attribution

Built by AI Economic Pulse. Data sourced from the UN Comtrade Database
(comtrade.un.org). Free for non-commercial analytical use; please cite both
this portal and the underlying UN Comtrade source.

---

*A sister product to the GCC Optimal Shipping Routes platform — same architectural
patterns (React/Vite/Vercel), same editorial design discipline, different country focus.*
