#!/usr/bin/env python3
"""
ETL pipeline: UN Comtrade Lebanon 2024 (HS Revision 5) -> JSON files for the web app.

Input:  data/C_A_H5_422_2024.tsv
Output: public/data/*.json

Run with:  python3 scripts/prepare_data.py
"""

import json
import math
import os
import sys
from pathlib import Path

import pandas as pd

# Make sibling modules importable
sys.path.insert(0, str(Path(__file__).parent))
from country_codes import name as country_name, region as country_region, iso2
from hs_codes import (
    CHAPTERS,
    SECTIONS,
    HS6_LABELS,
    chapter_name,
    hs_label,
)

ROOT = Path(__file__).parent.parent
RAW = ROOT / "data" / "C_A_H5_422_2024.tsv"
OUT = ROOT / "public" / "data"
OUT.mkdir(parents=True, exist_ok=True)


def write_json(obj, name, *, compact=True):
    """Write JSON with deterministic key ordering and round floats."""
    path = OUT / name
    sep = (",", ":") if compact else (", ", ": ")
    with path.open("w", encoding="utf-8") as f:
        json.dump(obj, f, separators=sep, ensure_ascii=False, default=_default)
    size_kb = path.stat().st_size / 1024
    print(f"  wrote {name:32s} {size_kb:8.1f} KB")


def _default(o):
    if isinstance(o, (pd.Timestamp,)):
        return o.isoformat()
    if hasattr(o, "item"):
        return o.item()
    raise TypeError(f"Not JSON serialisable: {type(o)}")


def r(x):
    """Round value to integer USD — keeps payload small without losing meaningful precision."""
    if x is None or (isinstance(x, float) and (math.isnan(x) or math.isinf(x))):
        return 0
    return int(round(float(x)))


def hhi(shares):
    """Herfindahl–Hirschman Index in the conventional 0–10000 scale.

    shares is an iterable of percentage shares summing to ~100.
    """
    return round(sum(s * s for s in shares), 1)


def main():
    if not RAW.exists():
        print(f"FATAL: raw data not found at {RAW}")
        sys.exit(1)

    print(f"Reading {RAW.name} ...")
    df = pd.read_csv(RAW, sep="\t", low_memory=False)
    print(f"  loaded {len(df):,} rows, {df.shape[1]} cols")

    # ---- Filters ----------------------------------------------------------
    # Use only "line items" (isAggregate==0) to avoid double-counting since
    # Comtrade publishes the same trade at HS-2, HS-4 and HS-6 levels.
    line = df[df["isAggregate"] == 0].copy()
    line["cmdCode"] = line["cmdCode"].astype(str).str.zfill(6)
    line["hs2"] = line["cmdCode"].str[:2]
    line["hs4"] = line["cmdCode"].str[:4]

    # Drop the World aggregate (partnerCode==0) from per-partner analyses
    line = line[line["partnerCode"] != 0].copy()
    print(f"  after filters: {len(line):,} line rows")

    print(f"  flow distribution: {line['flowCode'].value_counts().to_dict()}")

    # ---- Headline totals --------------------------------------------------
    print("\n[1/8] headlines.json")
    flow_totals = (
        line.groupby("flowCode")["primaryValue"].sum().to_dict()
    )
    imports = flow_totals.get("M", 0)
    dx = flow_totals.get("DX", 0)
    rx = flow_totals.get("RX", 0)
    rm = flow_totals.get("RM", 0)
    total_exports = dx + rx
    deficit = imports - total_exports
    coverage = (total_exports / imports * 100) if imports else 0
    reexport_share = (rx / total_exports * 100) if total_exports else 0

    n_partners_imp = line[line["flowCode"] == "M"]["partnerCode"].nunique()
    n_partners_dx = line[line["flowCode"] == "DX"]["partnerCode"].nunique()
    n_hs6_imp = line[line["flowCode"] == "M"]["cmdCode"].nunique()
    n_hs6_dx = line[line["flowCode"] == "DX"]["cmdCode"].nunique()

    headlines = {
        "reporter": "Lebanon",
        "reporter_code": 422,
        "year": 2024,
        "source": "UN Comtrade",
        "classification": "HS Revision 5 (2017)",
        "values": {
            "imports": r(imports),
            "domestic_exports": r(dx),
            "re_exports": r(rx),
            "re_imports": r(rm),
            "total_exports": r(total_exports),
            "trade_balance": r(-deficit),  # negative = deficit
            "trade_deficit": r(deficit),
            "total_trade": r(imports + total_exports),
        },
        "ratios": {
            "export_coverage_pct": round(coverage, 1),
            "re_export_share_of_exports_pct": round(reexport_share, 1),
            "deficit_to_imports_pct": round(deficit / imports * 100, 1) if imports else 0,
        },
        "counts": {
            "import_partners": int(n_partners_imp),
            "export_partners": int(n_partners_dx),
            "import_hs6_lines": int(n_hs6_imp),
            "export_hs6_lines": int(n_hs6_dx),
        },
    }
    write_json(headlines, "headlines.json", compact=False)

    # ---- Partners ---------------------------------------------------------
    print("\n[2/8] partners.json")
    flows_for_partners = ["M", "DX", "X", "RX", "RM"]
    p_df = (
        line[line["flowCode"].isin(flows_for_partners)]
        .groupby(["partnerCode", "flowCode"])["primaryValue"]
        .sum()
        .unstack(fill_value=0.0)
        .reset_index()
    )
    for col in flows_for_partners:
        if col not in p_df.columns:
            p_df[col] = 0.0

    p_df["name"] = p_df["partnerCode"].map(country_name)
    p_df["region"] = p_df["partnerCode"].map(country_region)
    p_df["iso2"] = p_df["partnerCode"].map(iso2)

    p_df["total_trade"] = p_df["M"] + p_df["DX"] + p_df["RX"]
    p_df["balance"] = (p_df["DX"] + p_df["RX"]) - p_df["M"]
    p_df = p_df.sort_values("total_trade", ascending=False)

    partners = [
        {
            "code": int(row["partnerCode"]),
            "name": row["name"],
            "iso2": row["iso2"],
            "region": row["region"],
            "imports": r(row["M"]),
            "dx": r(row["DX"]),
            "rx": r(row["RX"]),
            "total_exports": r(row["DX"] + row["RX"]),
            "total": r(row["total_trade"]),
            "balance": r(row["balance"]),
        }
        for _, row in p_df.iterrows()
        if row["total_trade"] > 0
    ]
    write_json({"partners": partners}, "partners.json")

    # ---- HS-2 chapter totals ---------------------------------------------
    print("\n[3/8] chapters.json")
    ch_df = (
        line.groupby(["hs2", "flowCode"])["primaryValue"]
        .sum()
        .unstack(fill_value=0.0)
        .reset_index()
    )
    for col in flows_for_partners:
        if col not in ch_df.columns:
            ch_df[col] = 0.0
    ch_df["name"] = ch_df["hs2"].map(chapter_name)
    ch_df["total_trade"] = ch_df["M"] + ch_df["DX"] + ch_df["RX"]
    ch_df["balance"] = (ch_df["DX"] + ch_df["RX"]) - ch_df["M"]
    ch_df = ch_df.sort_values("total_trade", ascending=False)

    # Map each chapter to its HS section
    chapter_section = {}
    for sec_roman, sec_name, chapters in SECTIONS:
        for c in chapters:
            chapter_section[c] = {"roman": sec_roman, "name": sec_name}

    chapters_out = [
        {
            "hs2": row["hs2"],
            "name": row["name"],
            "section": chapter_section.get(row["hs2"], {"roman": "—", "name": "Other"})["name"],
            "section_roman": chapter_section.get(row["hs2"], {"roman": "—", "name": "Other"})["roman"],
            "imports": r(row["M"]),
            "dx": r(row["DX"]),
            "rx": r(row["RX"]),
            "total_exports": r(row["DX"] + row["RX"]),
            "total": r(row["total_trade"]),
            "balance": r(row["balance"]),
        }
        for _, row in ch_df.iterrows()
        if row["total_trade"] > 0
    ]
    write_json({"chapters": chapters_out}, "chapters.json")

    # ---- HS Explorer (full hierarchy) ------------------------------------
    print("\n[4/8] hs_explorer.json")

    def _agg(rows):
        return {
            "imports": r(rows.get("M", 0)),
            "dx": r(rows.get("DX", 0)),
            "rx": r(rows.get("RX", 0)),
            "total": r(rows.get("M", 0) + rows.get("DX", 0) + rows.get("RX", 0)),
        }

    # HS-4 totals
    hs4_df = (
        line.groupby(["hs2", "hs4", "flowCode"])["primaryValue"]
        .sum()
        .unstack(fill_value=0.0)
    )
    # HS-6 totals
    hs6_df = (
        line.groupby(["hs2", "hs4", "cmdCode", "flowCode"])["primaryValue"]
        .sum()
        .unstack(fill_value=0.0)
    )

    explorer = []
    for hs2 in sorted(line["hs2"].unique()):
        ch_rows = (
            line[line["hs2"] == hs2]
            .groupby("flowCode")["primaryValue"]
            .sum()
            .to_dict()
        )
        ch_agg = _agg(ch_rows)
        if ch_agg["total"] == 0:
            continue

        # HS-4 children
        hs4_children = []
        hs4_for_ch = [h for (h2, h) in hs4_df.index if h2 == hs2]
        for h4 in sorted(set(hs4_for_ch)):
            try:
                h4_rows = hs4_df.loc[(hs2, h4)].to_dict()
            except KeyError:
                continue
            h4_agg = _agg(h4_rows)
            if h4_agg["total"] == 0:
                continue

            # HS-6 children
            hs6_children = []
            hs6_keys = [
                (h2, h4_, h6) for (h2, h4_, h6) in hs6_df.index
                if h2 == hs2 and h4_ == h4
            ]
            for h2k, h4k, h6 in sorted(hs6_keys):
                h6_rows = hs6_df.loc[(h2k, h4k, h6)].to_dict()
                h6_agg = _agg(h6_rows)
                if h6_agg["total"] == 0:
                    continue
                hs6_children.append({
                    "code": h6,
                    "label": HS6_LABELS.get(h6, f"HS {h6}"),
                    **h6_agg,
                })
            hs6_children.sort(key=lambda x: x["total"], reverse=True)

            hs4_children.append({
                "code": h4,
                "label": f"HS {h4}",
                **h4_agg,
                "children": hs6_children,
            })
        hs4_children.sort(key=lambda x: x["total"], reverse=True)

        explorer.append({
            "code": hs2,
            "label": chapter_name(hs2),
            "section": chapter_section.get(hs2, {"name": "Other"})["name"],
            "section_roman": chapter_section.get(hs2, {"roman": "—"})["roman"],
            **ch_agg,
            "children": hs4_children,
        })

    explorer.sort(key=lambda x: x["total"], reverse=True)
    write_json({"chapters": explorer}, "hs_explorer.json")

    # ---- Partner × HS-2 (for bilateral composition view) -----------------
    print("\n[5/8] partner_hs2.json")
    pxhs2 = (
        line.groupby(["partnerCode", "hs2", "flowCode"])["primaryValue"]
        .sum()
        .unstack(fill_value=0.0)
        .reset_index()
    )
    for col in flows_for_partners:
        if col not in pxhs2.columns:
            pxhs2[col] = 0.0

    pxhs2["total"] = pxhs2["M"] + pxhs2["DX"] + pxhs2["RX"]
    # Keep only meaningful rows to reduce payload size
    pxhs2 = pxhs2[pxhs2["total"] > 10_000]

    bilateral = {}
    for code, group in pxhs2.groupby("partnerCode"):
        bilateral[str(int(code))] = [
            {
                "hs2": row["hs2"],
                "name": chapter_name(row["hs2"]),
                "imports": r(row["M"]),
                "dx": r(row["DX"]),
                "rx": r(row["RX"]),
                "total": r(row["total"]),
            }
            for _, row in group.sort_values("total", ascending=False).iterrows()
        ]
    write_json(bilateral, "partner_hs2.json")

    # ---- Re-Export view --------------------------------------------------
    print("\n[6/8] reexports.json")
    rx_df = line[line["flowCode"] == "RX"].copy()

    # Top re-export commodities (HS-6)
    rx_hs6 = (
        rx_df.groupby("cmdCode")["primaryValue"]
        .sum()
        .sort_values(ascending=False)
        .head(30)
    )
    top_rx_commodities = [
        {
            "code": code,
            "label": HS6_LABELS.get(code, f"HS {code}"),
            "hs2": code[:2],
            "chapter": chapter_name(code[:2]),
            "value": r(v),
        }
        for code, v in rx_hs6.items()
    ]

    # Top re-export destinations
    rx_part = (
        rx_df.groupby("partnerCode")["primaryValue"]
        .sum()
        .sort_values(ascending=False)
        .head(20)
    )
    top_rx_partners = [
        {
            "code": int(c),
            "name": country_name(c),
            "iso2": iso2(c),
            "value": r(v),
        }
        for c, v in rx_part.items()
    ]

    # Re-export by chapter
    rx_ch = (
        rx_df.groupby("hs2")["primaryValue"]
        .sum()
        .sort_values(ascending=False)
        .head(15)
    )
    rx_by_chapter = [
        {"hs2": h, "name": chapter_name(h), "value": r(v)}
        for h, v in rx_ch.items()
    ]

    # For each top re-export chapter: compare to domestic exports of same chapter
    dx_by_ch = line[line["flowCode"] == "DX"].groupby("hs2")["primaryValue"].sum().to_dict()
    rx_by_ch_dict = rx_df.groupby("hs2")["primaryValue"].sum().to_dict()
    chapter_compare = []
    for h in sorted(rx_by_ch_dict.keys(), key=lambda x: -rx_by_ch_dict[x])[:15]:
        chapter_compare.append({
            "hs2": h,
            "name": chapter_name(h),
            "dx": r(dx_by_ch.get(h, 0)),
            "rx": r(rx_by_ch_dict[h]),
            "rx_share": round(
                rx_by_ch_dict[h] / (dx_by_ch.get(h, 0) + rx_by_ch_dict[h]) * 100, 1
            ) if (dx_by_ch.get(h, 0) + rx_by_ch_dict[h]) > 0 else 0,
        })

    write_json({
        "total_rx": r(rx_df["primaryValue"].sum()),
        "top_commodities": top_rx_commodities,
        "top_partners": top_rx_partners,
        "by_chapter": rx_by_chapter,
        "chapter_compare": chapter_compare,
    }, "reexports.json", compact=False)

    # ---- Concentration metrics -------------------------------------------
    print("\n[7/8] concentration.json")

    def _hhi_for(flow):
        f = line[line["flowCode"] == flow]
        if f.empty:
            return {}
        # Partner HHI
        psum = f.groupby("partnerCode")["primaryValue"].sum()
        psum = psum[psum > 0]
        total = psum.sum()
        shares = (psum / total * 100).tolist()
        partner_hhi = hhi(shares)
        # Product HHI (HS-6)
        ssum = f.groupby("cmdCode")["primaryValue"].sum()
        ssum = ssum[ssum > 0]
        total_s = ssum.sum()
        pshares = (ssum / total_s * 100).tolist()
        product_hhi = hhi(pshares)
        # Top shares
        top1_p = psum.sort_values(ascending=False).head(1).sum() / total * 100
        top5_p = psum.sort_values(ascending=False).head(5).sum() / total * 100
        top10_p = psum.sort_values(ascending=False).head(10).sum() / total * 100
        top10_s = ssum.sort_values(ascending=False).head(10).sum() / total_s * 100
        return {
            "partner_hhi": partner_hhi,
            "product_hhi": product_hhi,
            "top1_partner_pct": round(top1_p, 1),
            "top5_partner_pct": round(top5_p, 1),
            "top10_partner_pct": round(top10_p, 1),
            "top10_product_pct": round(top10_s, 1),
            "n_partners": int(len(psum)),
            "n_products": int(len(ssum)),
        }

    write_json({
        "imports": _hhi_for("M"),
        "domestic_exports": _hhi_for("DX"),
        "re_exports": _hhi_for("RX"),
    }, "concentration.json", compact=False)

    # ---- Regional rollup -------------------------------------------------
    print("\n[8/8] regions.json")
    line["region"] = line["partnerCode"].map(country_region)
    reg_df = (
        line.groupby(["region", "flowCode"])["primaryValue"]
        .sum()
        .unstack(fill_value=0.0)
        .reset_index()
    )
    for col in flows_for_partners:
        if col not in reg_df.columns:
            reg_df[col] = 0.0
    reg_df["total"] = reg_df["M"] + reg_df["DX"] + reg_df["RX"]
    reg_df = reg_df.sort_values("total", ascending=False)
    regions_out = [
        {
            "region": row["region"],
            "imports": r(row["M"]),
            "dx": r(row["DX"]),
            "rx": r(row["RX"]),
            "total": r(row["total"]),
            "balance": r((row["DX"] + row["RX"]) - row["M"]),
        }
        for _, row in reg_df.iterrows()
        if row["total"] > 0
    ]
    write_json({"regions": regions_out}, "regions.json", compact=False)

    print("\n  ETL complete.")
    print(f"  Output dir: {OUT}")


if __name__ == "__main__":
    main()
