#!/usr/bin/env python3
"""Static checks for the site/ folder, run by CI before every deploy.

1. Every local href / src / data-lazy in every HTML page resolves to a file.
2. Every local asset referenced from inline JS ("../img/x.svg", model.json …) exists.
3. Every external <script> / stylesheet is served over https from a CDN URL
   pinned to an exact version (name@1.2.3) — an unpinned "latest" can change
   under you the night before the workshop.
4. Every bundled TF.js model.json lists weight shards that are really there.
5. Every activity in play/ has a 🐍 Python snippet, loads the panel, is linked
   from the hub (play/index.html) and has a slide in the deck; every data-py
   button points at a snippet that exists.
6. Every activity loads the 💡 Intuition panel and has What/How/Why + step
   content in js/intuition-data.js; every illustration it names exists; every
   data-intu button in the deck points at an activity that has content, and
   every activity slide has both a 💡 Intuition and a 🐍 Python button.

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
JS_ASSET = re.compile(r"""["'`]((?:\.\./|\./)?(?:img|models|css|js|play|data)/[^"'`\s]+?\.(?:svg|png|jpg|json|css|js|html|txt|bin))["'`]""")


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


def check_python_panel() -> list[str]:
    errors: list[str] = []
    js = SITE / "js" / "python-snippets.js"
    if not js.exists():
        return ["js/python-snippets.js is missing — run `python tools/build_python.py`"]
    text = js.read_text(encoding="utf-8")
    snippets = json.loads(text[text.index("window.PY_SNIPPETS = ") + len("window.PY_SNIPPETS = "):].rstrip().rstrip(";"))
    hub = (SITE / "play" / "index.html").read_text(encoding="utf-8")
    deck = (SITE / "index.html").read_text(encoding="utf-8")
    for page in sorted((SITE / "play").glob("*.html")):
        if page.name == "index.html":
            continue
        html = page.read_text(encoding="utf-8")
        m = re.search(r'<body[^>]*data-py="([^"]+)"', html)
        rel = page.relative_to(SITE)
        if not m:
            errors.append(f"{rel}: <body> has no data-py — the 🐍 button won't appear")
        elif m.group(1) not in snippets:
            errors.append(f"{rel}: data-py=\"{m.group(1)}\" has no snippet in tools/python_snippets.py")
        for need in ("python-snippets.js", "python-panel.js"):
            if need not in html:
                errors.append(f"{rel}: does not load js/{need}")
        if f'href="{page.name}"' not in hub:
            errors.append(f"{rel}: not linked from the activity hub play/index.html")
        if f'data-lazy="play/{page.name}"' not in deck:
            errors.append(f"{rel}: no slide in the deck embeds it")
    for page in sorted(SITE.rglob("*.html")):
        for ref in re.findall(r'data-py="([^"]+)"', page.read_text(encoding="utf-8")):
            if ref not in snippets:
                errors.append(f"{page.relative_to(SITE)}: data-py=\"{ref}\" has no snippet")
    return errors


def check_intuition() -> list[str]:
    errors: list[str] = []
    js = SITE / "js" / "intuition-data.js"
    if not js.exists():
        return ["js/intuition-data.js is missing"]
    text = js.read_text(encoding="utf-8")
    arts = set(re.findall(r"^    (\w+): \(\) =>", text, re.M))
    body = text[text.index("const ACTS = {"):]
    acts = {}
    for m in re.finditer(r'^    "?([a-z][\w-]*)"?: \{\n      emoji:', body, re.M):
        end = body.find("\n    },\n", m.end())
        acts[m.group(1)] = body[m.end(): end if end > 0 else len(body)]
    for act, chunk in acts.items():
        for part in ("what:", "how:", "why:"):
            if part not in chunk:
                errors.append(f"intuition-data.js: {act} has no {part[:-1]} card")
        if "steps: [" not in chunk or "at:" not in chunk:
            errors.append(f"intuition-data.js: {act} has no step explanations")
        for name in re.findall(r'art: "([^"]+)"', chunk):
            if name not in arts:
                errors.append(f"intuition-data.js: {act} uses unknown illustration \"{name}\"")
    deck = (SITE / "index.html").read_text(encoding="utf-8")
    for page in sorted((SITE / "play").glob("*.html")):
        if page.name == "index.html":
            continue
        html = page.read_text(encoding="utf-8")
        rel = page.relative_to(SITE)
        m = re.search(r'<body[^>]*data-py="([^"]+)"', html)
        if m and m.group(1) not in acts:
            errors.append(f"{rel}: no 💡 Intuition content for \"{m.group(1)}\" in js/intuition-data.js")
        for need in ("intuition-data.js", "intuition-panel.js"):
            if need not in html:
                errors.append(f"{rel}: does not load js/{need}")
    for ref in re.findall(r'data-intu="([^"]+)"', deck):
        if ref not in acts:
            errors.append(f"index.html: data-intu=\"{ref}\" has no content")
    for head in re.findall(r'<div class="act-head">(.*?)</div>', deck, re.S):
        if "data-py=" in head and "data-intu=" not in head:
            errors.append("index.html: an activity slide has a 🐍 button but no 💡 Intuition button")
    for need in ("intuition-data.js", "intuition-panel.js"):
        if need not in deck:
            errors.append(f"index.html: does not load js/{need}")
    return errors


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

    errors += check_python_panel()
    errors += check_intuition()

    if errors:
        print(f"✗ {len(errors)} problem(s):")
        for e in errors:
            print("  -", e)
        return 1
    print(f"✓ {len(pages)} pages checked: every local link resolves, every CDN script is pinned, every model is complete,"
          " every activity has its 🐍 Python and 💡 Intuition panels.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
