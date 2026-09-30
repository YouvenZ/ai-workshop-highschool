#!/usr/bin/env python3
"""Export the Breast Cancer Wisconsin (Diagnostic) data for "AI Doctor's Assistant".

    python tools/build_medical.py

Writes site/data/breast_cancer.json: 569 real patients, the 30 measurements
made from a microscope image of each biopsy, and the diagnosis (1 = malignant,
0 = benign). A fixed split marks 25% of patients as "test" so the numbers
students see in the browser are honest — the model never trains on them.

Source: W. Wolberg, O. Mangasarian, N. Street, W. Street, UCI Machine Learning
Repository, https://doi.org/10.24432/C5DW2B — CC BY 4.0.
Shipped with scikit-learn, so no download is needed.
"""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from sklearn.datasets import load_breast_cancer

OUT = Path(__file__).resolve().parent.parent / "site" / "data" / "breast_cancer.json"

# Plain-English names for the measurements students can pick on the axes.
# (sklearn name, what we call it, one line a 15-year-old understands)
FRIENDLY = [
    ("mean radius",          "Cell size",          "How big the cell nuclei are (radius, in microscope units)"),
    ("mean texture",         "Texture",            "How patchy the grey levels inside the cells look"),
    ("mean concave points",  "Dents",              "How many inward dents the cell outlines have"),
    ("mean smoothness",      "Smoothness",         "How wobbly the cell outlines are, locally"),
    ("mean symmetry",        "Symmetry",           "How lopsided the cells are"),
    ("mean compactness",     "Compactness",        "Perimeter² ÷ area — how far from a perfect circle"),
    ("worst area",           "Largest cell area",  "Area of the three biggest cells in the image"),
    ("worst concave points", "Worst dents",        "Dents in the three most irregular cells"),
]


def main() -> None:
    d = load_breast_cancer()
    names = list(d.feature_names)
    x = d.data
    y = 1 - d.target            # sklearn: 0 = malignant. We want 1 = malignant ("positive" test).
    rng = np.random.default_rng(42)
    test = np.zeros(len(y), dtype=int)
    for cls in (0, 1):          # stratified 25% test split
        idx = np.flatnonzero(y == cls)
        test[rng.choice(idx, round(len(idx) * 0.25), replace=False)] = 1

    out = {
        "source": "Breast Cancer Wisconsin (Diagnostic), UCI ML Repository, CC BY 4.0",
        "features": names,
        "friendly": [{"key": n, "name": f, "help": h, "index": names.index(n)} for n, f, h in FRIENDLY],
        "rows": [[round(float(v), 5) for v in row] for row in x],
        "diagnosis": [int(v) for v in y],
        "test": [int(v) for v in test],
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, separators=(",", ":")) + "\n")
    print(f"wrote {len(y)} patients ({int(y.sum())} malignant, {int(test.sum())} held out), "
          f"{OUT.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
