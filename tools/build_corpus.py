#!/usr/bin/env python3
"""Fetch the training text for "Mini ChatGPT" (the next-word predictor).

    python tools/build_corpus.py

Writes site/data/alice.txt: the full text of Lewis Carroll's *Alice's
Adventures in Wonderland* (1865), which is in the public domain. The Project
Gutenberg header and licence footer are removed, as Gutenberg asks when the
text is redistributed without their trademark. The browser builds the n-gram
model from this file in a fraction of a second.
"""
from __future__ import annotations

import re
import urllib.request
from pathlib import Path

URL = "https://www.gutenberg.org/cache/epub/11/pg11.txt"
OUT = Path(__file__).resolve().parent.parent / "site" / "data" / "alice.txt"


def main() -> None:
    with urllib.request.urlopen(URL, timeout=60) as r:
        raw = r.read().decode("utf-8-sig")
    start = raw.index("*** START OF")
    start = raw.index("\n", start) + 1
    end = raw.index("*** END OF")
    body = raw[start:end]
    # The book proper starts at the first chapter heading after the contents list.
    first = [m.start() for m in re.finditer(r"^CHAPTER I\.", body, flags=re.M)]
    body = body[first[-1]:] if first else body
    body = body.replace("_", "").replace("\r", "")
    body = re.sub(r"\n{3,}", "\n\n", body).strip() + "\n"
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(body, encoding="utf-8")
    print(f"wrote {len(body.split()):,} words, {OUT.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
