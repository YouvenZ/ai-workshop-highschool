#!/usr/bin/env python3
"""Static checks for the site/ folder, run by CI before every deploy.

1. Every local href / src / data-lazy in every HTML page resolves to a file.
2. Every local asset referenced from inline JS ("../img/x.svg", model.json …) exists.
3. Every external <script> / stylesheet is served over https from a CDN URL
   pinned to an exact version (name@1.2.3) — an unpinned "latest" can change
   under you the night before the workshop.
4. Every bundled TF.js model.json lists weight shards that are really there.

No dependencies beyond the standard library. Exit code 1 on any problem.
"""
from __future__ import annotations

import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote

SITE = Path(__file__).resolve().parent.parent / "site"
PINNED = re.compile(r"@\d+\.\d+\.\d+(/|$)")
# Fonts are the one external resource that is not versioned by URL.
UNPINNED_OK = ("https://fonts.googleapis.com/", "https://fonts.gstatic.com/")
JS_ASSET = re.compile(r"""["'`]((?:\.\./|\./)?(?:img|models|css|js|play)/[^"'`\s]+?\.(?:svg|png|jpg|json|css|js|html))["'`]""")


class Refs(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.refs: list[tuple[str, str, str]] = []   # (tag, attr, value)
        self.scripts: list[str] = []
        self._in_script = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        for attr in ("href", "src", "data-lazy"):
            if a.get(attr):
                self.refs.append((tag, attr, a[attr]))
        if tag == "link" and a.get("rel") in ("preconnect", "dns-prefetch"):
            self.refs.pop()      # a bare origin, nothing to fetch
        self._in_script = tag == "script" and not a.get("src")

    def handle_endtag(self, tag):
        if tag == "script":
            self._in_script = False

    def handle_data(self, data):
        if self._in_script:
            self.scripts.append(data)


def local_target(page: Path, ref: str) -> Path | None:
    parts = urlsplit(ref)
    if parts.scheme or ref.startswith(("#", "//", "mailto:", "about:", "data:")):
        return None
    path = unquote(parts.path)
    if not path:
        return None
    target = (page.parent / path).resolve()
    if path.endswith("/") or target.is_dir():
        target = target / "index.html"
    return target


def main() -> int:
    errors: list[str] = []
    pages = sorted(SITE.rglob("*.html"))
    for page in pages:
        rel = page.relative_to(SITE)
        p = Refs()
        p.feed(page.read_text(encoding="utf-8"))

        for tag, attr, ref in p.refs:
            if ref.startswith("http://"):
                errors.append(f"{rel}: insecure http:// URL {ref}")
                continue
            if ref.startswith("https://"):
                if tag in ("script", "link") and not ref.startswith(UNPINNED_OK) and not PINNED.search(ref):
                    errors.append(f"{rel}: external {tag} is not pinned to a version: {ref}")
                continue
            target = local_target(page, ref)
            if target and not target.exists():
                errors.append(f"{rel}: <{tag} {attr}=\"{ref}\"> → missing {target.relative_to(SITE.parent)}")

        for ref in JS_ASSET.findall("\n".join(p.scripts)):
            target = local_target(page, ref)
            if target and not target.exists():
                errors.append(f"{rel}: script references missing {ref}")

    for js in sorted((SITE / "js").glob("*.js")):
        for ref in re.findall(r"""cdn\.jsdelivr\.net/npm/[^"'\s)]+""", js.read_text(encoding="utf-8")):
            if not PINNED.search(ref):
                errors.append(f"{js.relative_to(SITE)}: unpinned CDN URL {ref}")

    for model in sorted(SITE.glob("models/*/model.json")):
        manifest = json.loads(model.read_text(encoding="utf-8")).get("weightsManifest", [])
        for group in manifest:
            for shard in group["paths"]:
                if not (model.parent / shard).exists():
                    errors.append(f"{model.relative_to(SITE)}: weight shard {shard} is missing")

    if errors:
        print(f"✗ {len(errors)} problem(s):")
        for e in errors:
            print("  -", e)
        return 1
    print(f"✓ {len(pages)} pages checked: every local link resolves, every CDN script is pinned, every model is complete.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
