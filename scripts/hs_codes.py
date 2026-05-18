"""HS Revision 5 (2017 nomenclature) lookup — chapter names and section groupings.

Provides display labels for the explorer. Heading (HS-4) and subheading (HS-6) labels
are emitted as "HS xxxx" placeholders when no friendly label is available; this keeps
the bundle small while still rendering useful UI. The repo can ship a fuller HS6
description file later from WCO source data without changing the app code.
"""

# 99 standard chapters + the unallocated chapter 99
CHAPTERS = {
    "01": "Live animals",
    "02": "Meat and edible meat offal",
    "03": "Fish, crustaceans, molluscs",
    "04": "Dairy, eggs, honey",
    "05": "Other animal products",
    "06": "Live trees, plants, cut flowers",
    "07": "Edible vegetables",
    "08": "Edible fruit and nuts",
    "09": "Coffee, tea, mate, spices",
    "10": "Cereals",
    "11": "Milling products, malt, starches",
    "12": "Oil seeds, oleaginous fruits",
    "13": "Lac, gums, resins, vegetable extracts",
    "14": "Vegetable plaiting materials",
    "15": "Animal/vegetable fats and oils",
    "16": "Preparations of meat, fish",
    "17": "Sugars and sugar confectionery",
    "18": "Cocoa and cocoa preparations",
    "19": "Cereal, flour, milk preparations",
    "20": "Preparations of vegetables, fruit",
    "21": "Miscellaneous edible preparations",
    "22": "Beverages, spirits, vinegar",
    "23": "Animal fodder residues",
    "24": "Tobacco and manufactured substitutes",
    "25": "Salt, sulphur, earths, stone, cement",
    "26": "Ores, slag, ash",
    "27": "Mineral fuels, oils, waxes",
    "28": "Inorganic chemicals",
    "29": "Organic chemicals",
    "30": "Pharmaceutical products",
    "31": "Fertilizers",
    "32": "Tanning/dyeing extracts, paints",
    "33": "Essential oils, perfumery, cosmetics",
    "34": "Soaps, waxes, candles",
    "35": "Albuminoidal substances, glues",
    "36": "Explosives, pyrotechnics",
    "37": "Photographic or cinematographic goods",
    "38": "Miscellaneous chemical products",
    "39": "Plastics and articles thereof",
    "40": "Rubber and articles thereof",
    "41": "Raw hides, skins, leather",
    "42": "Articles of leather, travel goods",
    "43": "Furskins and artificial fur",
    "44": "Wood and articles of wood",
    "45": "Cork and articles of cork",
    "46": "Plaiting materials, basketwork",
    "47": "Pulp of wood, paper waste",
    "48": "Paper, paperboard, articles thereof",
    "49": "Printed books, newspapers",
    "50": "Silk",
    "51": "Wool, animal hair, woven fabrics",
    "52": "Cotton",
    "53": "Other vegetable textile fibres",
    "54": "Man-made filaments",
    "55": "Man-made staple fibres",
    "56": "Wadding, felt, nonwovens, twine",
    "57": "Carpets and other textile floor coverings",
    "58": "Special woven fabrics, tapestries",
    "59": "Impregnated, coated textile fabrics",
    "60": "Knitted or crocheted fabrics",
    "61": "Apparel, knitted or crocheted",
    "62": "Apparel, not knitted",
    "63": "Other made-up textile articles",
    "64": "Footwear, gaiters",
    "65": "Headgear and parts thereof",
    "66": "Umbrellas, walking sticks",
    "67": "Prepared feathers, artificial flowers",
    "68": "Articles of stone, plaster, cement",
    "69": "Ceramic products",
    "70": "Glass and glassware",
    "71": "Precious metals, gems, jewellery",
    "72": "Iron and steel",
    "73": "Articles of iron or steel",
    "74": "Copper and articles thereof",
    "75": "Nickel and articles thereof",
    "76": "Aluminium and articles thereof",
    "78": "Lead and articles thereof",
    "79": "Zinc and articles thereof",
    "80": "Tin and articles thereof",
    "81": "Other base metals, cermets",
    "82": "Tools, implements, cutlery",
    "83": "Miscellaneous articles of base metal",
    "84": "Machinery, mechanical appliances",
    "85": "Electrical machinery, equipment",
    "86": "Railway vehicles, track fixtures",
    "87": "Vehicles other than railway",
    "88": "Aircraft, spacecraft, parts",
    "89": "Ships, boats, floating structures",
    "90": "Optical, medical, precision instruments",
    "91": "Clocks, watches and parts",
    "92": "Musical instruments",
    "93": "Arms and ammunition",
    "94": "Furniture, bedding, lamps",
    "95": "Toys, games, sports requisites",
    "96": "Miscellaneous manufactured articles",
    "97": "Works of art, collectors' pieces",
    "98": "Special transactions",
    "99": "Commodities n.e.s.",
}

# HS Sections (groups of chapters) for high-level navigation
SECTIONS = [
    ("I",    "Live animals & animal products",      ["01", "02", "03", "04", "05"]),
    ("II",   "Vegetable products",                  ["06", "07", "08", "09", "10", "11", "12", "13", "14"]),
    ("III",  "Animal & vegetable fats",             ["15"]),
    ("IV",   "Prepared foodstuffs, beverages, tobacco", ["16","17","18","19","20","21","22","23","24"]),
    ("V",    "Mineral products",                    ["25", "26", "27"]),
    ("VI",   "Chemical products",                   ["28","29","30","31","32","33","34","35","36","37","38"]),
    ("VII",  "Plastics and rubber",                 ["39", "40"]),
    ("VIII", "Hides, leather and travel goods",     ["41", "42", "43"]),
    ("IX",   "Wood, cork and basketwork",           ["44", "45", "46"]),
    ("X",    "Pulp, paper and printed matter",      ["47", "48", "49"]),
    ("XI",   "Textiles and textile articles",       ["50","51","52","53","54","55","56","57","58","59","60","61","62","63"]),
    ("XII",  "Footwear, headgear, umbrellas",       ["64", "65", "66", "67"]),
    ("XIII", "Articles of stone, ceramics, glass",  ["68", "69", "70"]),
    ("XIV",  "Precious stones, metals, jewellery",  ["71"]),
    ("XV",   "Base metals and articles thereof",    ["72","73","74","75","76","78","79","80","81","82","83"]),
    ("XVI",  "Machinery and electrical equipment",  ["84", "85"]),
    ("XVII", "Transport equipment",                 ["86", "87", "88", "89"]),
    ("XVIII","Precision instruments, clocks",       ["90", "91", "92"]),
    ("XIX",  "Arms and ammunition",                 ["93"]),
    ("XX",   "Miscellaneous manufactures",          ["94", "95", "96"]),
    ("XXI",  "Works of art and antiques",           ["97"]),
    ("XXII", "Special transactions",                ["98", "99"]),
]

# Hand-curated labels for the most commercially significant HS-6 codes in Lebanon's trade,
# focused on top imports, top exports, and top re-exports. Other HS-6 codes will display as "HS xxxxxx".
HS6_LABELS = {
    # --- Chapter 27 — Mineral fuels (Lebanon's largest import chapter) ---
    "270900": "Crude petroleum oils",
    "271012": "Light oils & preparations (gasoline)",
    "271019": "Other petroleum oils (diesel, fuel oil)",
    "271111": "Liquefied natural gas",
    "271112": "Liquefied propane (LPG)",
    "271113": "Liquefied butane (LPG)",
    "271600": "Electrical energy",

    # --- Chapter 71 — Gold & jewellery (Lebanon's #2 import, #1 domestic export) ---
    "710812": "Gold, unwrought (non-monetary)",
    "710813": "Gold, semi-manufactured",
    "710820": "Gold, monetary",
    "711319": "Articles of jewellery, other precious metal",
    "711311": "Articles of jewellery, silver",
    "711719": "Imitation jewellery, base metal",
    "710231": "Diamonds, non-industrial, unworked",
    "710239": "Diamonds, non-industrial, worked",

    # --- Chapter 87 — Vehicles (key re-export category) ---
    "870321": "Cars, spark-ignition <1000cc",
    "870322": "Cars, spark-ignition 1000–1500cc",
    "870323": "Cars, spark-ignition 1500–3000cc",
    "870324": "Cars, spark-ignition >3000cc",
    "870331": "Cars, diesel <1500cc",
    "870332": "Cars, diesel 1500–2500cc",
    "870333": "Cars, diesel >2500cc",
    "870360": "Hybrid passenger vehicles",
    "870380": "Electric passenger vehicles",
    "870421": "Trucks, diesel ≤5t",
    "870422": "Trucks, diesel 5–20t",
    "870431": "Trucks, petrol ≤5t",
    "870210": "Buses, diesel ≥10 persons",
    "870829": "Body parts & accessories for motor vehicles",

    # --- Chapter 30 — Pharmaceuticals ---
    "300490": "Medicaments, other (packaged for retail)",
    "300210": "Antisera, immunological products",
    "300220": "Vaccines for human medicine",
    "300215": "Immunological products, dosage",

    # --- Chapter 85 — Electrical machinery ---
    "851712": "Mobile telephones",
    "854411": "Insulated copper winding wire",
    "850440": "Static converters (power supplies)",
    "850710": "Lead-acid storage batteries",
    "854430": "Ignition wiring sets for vehicles",

    # --- Chapter 84 — Machinery ---
    "841869": "Refrigerating equipment, other",
    "841861": "Heat pumps",
    "847130": "Portable digital computers",

    # --- Chapter 10 — Cereals ---
    "100199": "Wheat & meslin, other",
    "100590": "Maize, other",
    "100630": "Rice, semi-milled or wholly milled",

    # --- Chapter 01–02 — Live animals & meat ---
    "010229": "Live cattle, other",
    "020230": "Bovine cuts, frozen, boneless",
    "020714": "Chicken cuts, frozen",

    # --- Chapter 20 — Vegetable preparations (export strength) ---
    "200799": "Jams, fruit jellies, marmalades",
    "200580": "Sweet corn preparations",
    "200911": "Frozen orange juice",
    "200819": "Other nuts, prepared or preserved",

    # --- Chapter 21 — Misc edible (export strength) ---
    "210690": "Food preparations, other",
    "210390": "Sauces, mixed condiments",

    # --- Chapter 22 — Beverages (Lebanese wine, arak exports) ---
    "220421": "Wine in containers ≤2L",
    "220290": "Other non-alcoholic beverages",
    "220210": "Waters, sweetened",

    # --- Chapter 72 — Iron & steel ---
    "720449": "Ferrous waste & scrap, other",
    "721049": "Flat-rolled steel, zinc-coated",
    "721420": "Concrete reinforcing bars",

    # --- Chapter 74 — Copper ---
    "740400": "Copper waste & scrap",

    # --- Chapter 39 — Plastics ---
    "390210": "Polypropylene, primary forms",
    "390110": "Polyethylene, low-density",

    # --- Chapter 07/08 — Fresh produce (export strength) ---
    "070110": "Seed potatoes",
    "070190": "Potatoes, fresh",
    "080510": "Oranges, fresh",
    "080232": "Walnuts, shelled",
    "080620": "Grapes, dried",

    # --- Chapter 24 — Tobacco ---
    "240210": "Cigars, cheroots",
    "240220": "Cigarettes containing tobacco",

    # --- Chapter 33 — Cosmetics ---
    "330300": "Perfumes and toilet waters",
    "330499": "Beauty/skincare preparations, other",

    # --- Chapter 99 — N.e.s. ---
    "999999": "Commodities not elsewhere specified",
}


def chapter_name(code):
    """Return chapter name for HS-2 code (e.g. '27' or 27)."""
    if isinstance(code, int):
        code = f"{code:02d}"
    code = str(code).zfill(2)[:2]
    return CHAPTERS.get(code, f"Chapter {code}")


def hs_label(code):
    """Return display label for any HS code (2/4/6 digit).

    HS-6 returns curated label if available, else 'HS xxxxxx'.
    HS-4 returns 'HS xxxx — <chapter name>'.
    HS-2 returns chapter name.
    """
    code = str(code).zfill(2)
    if len(code) == 2:
        return chapter_name(code)
    if len(code) == 4:
        return f"HS {code}"
    if len(code) == 6:
        return HS6_LABELS.get(code, f"HS {code}")
    return f"HS {code}"
