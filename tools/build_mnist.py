#!/usr/bin/env python3
"""Bundle a small, balanced slice of MNIST for the "Build a Brain" activity.

    python tools/build_mnist.py

Writes into site/data/:
    mnist_images.png   one digit per row: 784 grey pixels (28×28, row-major)
    mnist_labels.bin   one uint8 label (0-9) per row, same order
    mnist_meta.json    how many rows are training vs test

The browser reads the PNG into a canvas, so the whole dataset is one ~2 MB
download with no parsing library. A fixed seed makes the file reproducible.

MNIST: Yann LeCun, Corinna Cortes, Christopher J.C. Burges — CC BY-SA 3.0.
Downloaded from Google's public mirror of the original files.
"""
from __future__ import annotations

import gzip
import json
import urllib.request
from pathlib import Path

import numpy as np
from PIL import Image

MIRROR = "https://storage.googleapis.com/cvdf-datasets/mnist/"
OUT = Path(__file__).resolve().parent.parent / "site" / "data"
N_TRAIN, N_TEST, SEED = 10_000, 1_000, 7


def fetch(name: str) -> bytes:
    with urllib.request.urlopen(MIRROR + name, timeout=60) as r:
        return gzip.decompress(r.read())


def images(raw: bytes) -> np.ndarray:
    return np.frombuffer(raw, dtype=np.uint8, offset=16).reshape(-1, 784)


def labels(raw: bytes) -> np.ndarray:
    return np.frombuffer(raw, dtype=np.uint8, offset=8)


def balanced(y: np.ndarray, n: int, rng: np.random.Generator) -> np.ndarray:
    """n indices, n/10 per digit, shuffled — so no digit is under-represented."""
    per = n // 10
    idx = np.concatenate([rng.choice(np.flatnonzero(y == d), per, replace=False) for d in range(10)])
    rng.shuffle(idx)
    return idx


def main() -> None:
    rng = np.random.default_rng(SEED)
    print("downloading MNIST …")
    xtr, ytr = images(fetch("train-images-idx3-ubyte.gz")), labels(fetch("train-labels-idx1-ubyte.gz"))
    xte, yte = images(fetch("t10k-images-idx3-ubyte.gz")), labels(fetch("t10k-labels-idx1-ubyte.gz"))

    itr, ite = balanced(ytr, N_TRAIN, rng), balanced(yte, N_TEST, rng)
    x = np.concatenate([xtr[itr], xte[ite]])
    y = np.concatenate([ytr[itr], yte[ite]])

    OUT.mkdir(parents=True, exist_ok=True)
    Image.fromarray(x, mode="L").save(OUT / "mnist_images.png", optimize=True)
    (OUT / "mnist_labels.bin").write_bytes(y.tobytes())
    (OUT / "mnist_meta.json").write_text(json.dumps({
        "train": N_TRAIN, "test": N_TEST, "size": 28,
        "source": "MNIST — LeCun, Cortes & Burges, CC BY-SA 3.0",
    }, indent=1) + "\n")
    kb = (OUT / "mnist_images.png").stat().st_size / 1024
    print(f"wrote {len(y)} digits ({N_TRAIN} train + {N_TEST} test), images {kb:.0f} KB")


if __name__ == "__main__":
    main()
