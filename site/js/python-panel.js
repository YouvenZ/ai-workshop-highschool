/* "🐍 Show me the Python" — one shared component for the deck and every activity.

   Content comes from js/python-snippets.js (generated from tools/python_snippets.py,
   the same source as notebooks/try-it-in-python.ipynb).

   Use it:
     • deck:      <button class="btn py" data-py="teach">🐍 Python</button>
     • activity:  <body class="play" data-py="teach">  → a button is added to the page
                  header automatically (not when embedded: the slide has its own).
     • anywhere:  PyPanel.open("teach")

   Syntax colouring uses Prism (pinned). If Prism can't be downloaded the code
   is still shown, just in one colour — never a blank panel. */
(function () {
  "use strict";

  const PRISM = "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/";
  const MARKS = ["❶", "❷", "❸", "❹", "❺"];
  let root, prismReady, lastFocus, current;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src; s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  function prism() {
    if (!prismReady) {
      // Prism would auto-highlight every <code> on the page; we only want ours.
      window.Prism = window.Prism || {}; window.Prism.manual = true;
      prismReady = loadScript(PRISM + "prism.min.js")
        .then(() => loadScript(PRISM + "components/prism-python.min.js"))
        .then(() => window.Prism)
        .catch(() => null);
    }
    return prismReady;
  }

  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

  // Split highlighted HTML into lines, closing and re-opening any <span> that
  // runs across a line break (a multi-line string, say), so every line is a
  // self-contained element we can animate and highlight on its own.
  function splitLines(html) {
    const lines = [], open = [];
    let cur = "";
    const re = /(<span[^>]*>)|(<\/span>)|(\n)|([^<\n]+)/g;
    let m;
    while ((m = re.exec(html))) {
      if (m[1]) { open.push(m[1]); cur += m[1]; }
      else if (m[2]) { open.pop(); cur += m[2]; }
      else if (m[3]) { cur += "</span>".repeat(open.length); lines.push(cur); cur = open.join(""); }
      else cur += m[4];
    }
    lines.push(cur);
    return lines;
  }

  function build() {
    root = document.createElement("div");
    root.className = "pyp";
    root.hidden = true;
    root.innerHTML = `
      <div class="pyp-back" data-close></div>
      <div class="pyp-card glass" role="dialog" aria-modal="true" aria-labelledby="pyp-title">
        <header class="pyp-head">
          <span class="pyp-emo"></span>
          <div class="pyp-titles">
            <p class="pyp-kicker">🐍 Build it in Python</p>
            <h2 id="pyp-title"></h2>
            <p class="pyp-tag muted"></p>
          </div>
          <button class="btn pyp-x" data-close aria-label="Close">✕</button>
        </header>
        <ol class="pyp-steps"></ol>
        <div class="pyp-code"><pre><code class="language-python"></code></pre></div>
        <footer class="pyp-foot">
          <span class="pill pyp-lines"></span>
          <span class="pyp-pip muted"></span>
          <span class="spacer"></span>
          <button class="btn pyp-copy">📋 Copy</button>
          <a class="btn primary pyp-colab" target="_blank" rel="noopener">▶ Run it in Colab</a>
        </footer>
      </div>`;
    document.body.appendChild(root);
    root.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) close(); });
    // Keep pointer/touch inside the panel from reaching reveal.js (swipe = next slide).
    ["pointerdown", "touchstart", "wheel"].forEach((t) => root.addEventListener(t, (e) => e.stopPropagation(), { passive: true }));
    root.addEventListener("keydown", (e) => {
      e.stopPropagation();
      if (e.key === "Escape") close();
      if (e.key === "Tab") trap(e);
    });
    root.querySelector(".pyp-copy").addEventListener("click", copy);
    root.querySelector(".pyp-steps").addEventListener("mouseleave", () => focusStep(-1));
  }

  function trap(e) {
    const f = [...root.querySelectorAll("button, a[href]")];
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function render(lines) {
    const code = root.querySelector("code");
    code.innerHTML = lines.map((l, i) => `<span class="ln" style="--i:${i}">${l || " "}</span>`).join("");
    // Which step does each line belong to? A step starts at the line holding ❶, ❷ …
    let step = -1;
    code.querySelectorAll(".ln").forEach((el) => {
      const hit = MARKS.findIndex((m) => el.textContent.includes(m));
      if (hit >= 0) step = hit;
      el.dataset.step = step;
    });
  }

  function focusStep(i) {
    const code = root.querySelector("code");
    code.classList.toggle("focusing", i >= 0);
    code.querySelectorAll(".ln").forEach((el) => el.classList.toggle("hl", +el.dataset.step === i));
    root.querySelectorAll(".pyp-steps li").forEach((li, j) => li.classList.toggle("on", j === i));
    const first = code.querySelector(`.ln[data-step="${i}"]`);
    if (first) first.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function open(id) {
    const all = window.PY_SNIPPETS || {};
    const s = all[id];
    if (!root) build();
    current = s;
    root.querySelector("#pyp-title").textContent = s ? s.title : "Python";
    root.querySelector(".pyp-emo").textContent = s ? s.emoji : "🐍";
    root.querySelector(".pyp-tag").textContent = s ? s.tagline : "";
    root.querySelector(".pyp-colab").href = window.PY_COLAB || "#";
    const steps = root.querySelector(".pyp-steps");
    steps.innerHTML = "";
    if (!s) {
      root.querySelector("code").innerHTML = '<span class="ln">' + esc("# The Python examples didn't load — check the internet connection and reload.") + "</span>";
      root.querySelector(".pyp-lines").textContent = "";
      root.querySelector(".pyp-pip").textContent = "";
    } else {
      s.steps.forEach((t, i) => {
        const li = document.createElement("li");
        li.innerHTML = `<span class="n">${MARKS[i] || i + 1}</span>${esc(t)}`;
        li.style.setProperty("--i", i);
        li.tabIndex = 0;
        li.addEventListener("mouseenter", () => focusStep(i));
        li.addEventListener("focus", () => focusStep(i));
        li.addEventListener("click", () => focusStep(i));
        steps.appendChild(li);
      });
      const code = s.code.replace(/\n$/, "");
      const n = code.split("\n").filter((l) => l.trim() && !l.trim().startsWith("#")).length;
      root.querySelector(".pyp-lines").textContent = `🧮 The whole AI: ${n} lines of code`;
      root.querySelector(".pyp-pip").textContent = s.pip ? `first: pip install ${s.pip}` : "";
      render(code.split("\n").map(esc));             // plain first: instant, never blank
      prism().then((P) => {
        if (P && P.languages && P.languages.python && current === s) render(splitLines(P.highlight(code, P.languages.python, "python")));
      });
    }
    lastFocus = document.activeElement;
    root.hidden = false;
    requestAnimationFrame(() => root.classList.add("show"));
    if (window.Reveal && Reveal.configure) Reveal.configure({ keyboard: false });
    root.querySelector(".pyp-x").focus({ preventScroll: true });
  }

  function close() {
    if (!root || root.hidden) return;
    root.classList.remove("show");
    setTimeout(() => { root.hidden = true; }, 250);
    if (window.Reveal && Reveal.configure) Reveal.configure({ keyboard: true });
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  async function copy() {
    const btn = root.querySelector(".pyp-copy");
    const text = current ? current.code : "";
    try { await navigator.clipboard.writeText(text); }
    catch (_) {                                   // http:// or an old browser
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (_) {}
      ta.remove();
    }
    btn.textContent = "✅ Copied!";
    setTimeout(() => (btn.textContent = "📋 Copy"), 1600);
  }

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-py]:not(body)");
    if (b) { e.preventDefault(); open(b.dataset.py); }
  });

  // Activity pages: add the button to the page header.
  document.addEventListener("DOMContentLoaded", () => {
    const id = document.body.dataset.py;
    if (!id || document.documentElement.classList.contains("embedded")) return;
    const head = document.querySelector("header.top");
    if (!head) return;
    const b = document.createElement("button");
    b.className = "btn py"; b.dataset.py = id;
    b.innerHTML = "🐍 Show me the Python";
    const back = head.querySelector("a.back");
    head.insertBefore(b, back);
  });

  window.PyPanel = { open, close };
})();
