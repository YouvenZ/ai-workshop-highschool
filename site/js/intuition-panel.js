/* "💡 Intuition" — one shared component for the deck and every activity.

   Content: js/intuition-data.js (window.INTUITION = { ART, ACTS }).

   Two views in one panel:
     • the big picture — three illustrated cards: WHAT · HOW · WHY
     • a step           — opened from a 💡 next to an instruction inside an
                          activity: what you do / what happens / why, with
                          ◀ ▶ to walk through every step

   Use it:
     • deck:      <button class="btn intu" data-intu="teach">💡 Intuition</button>
     • activity:  <body class="play" data-py="teach"> → the header button and
                  every step 💡 are added automatically
     • anywhere:  IntuPanel.open("teach")  or  IntuPanel.open("teach", 1)

   Inside the deck an activity lives in a short <iframe>; a panel there would
   be squeezed into it. So when embedded, the 💡 asks the deck (same origin)
   to open the panel full-size instead, and falls back to opening locally. */
(function () {
  "use strict";

  let root, lastFocus, cur = { id: null, step: -1 };
  const data = () => window.INTUITION || { ART: {}, ACTS: {} };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const embedded = () => document.documentElement.classList.contains("embedded") || window.self !== window.top;

  function art(name) {
    const f = data().ART[name];
    try { return f ? f() : ""; } catch (_) { return ""; }
  }

  function build() {
    root = document.createElement("div");
    root.className = "ip";
    root.hidden = true;
    root.innerHTML = `
      <div class="ip-back" data-close></div>
      <div class="ip-card glass" role="dialog" aria-modal="true" aria-labelledby="ip-title">
        <header class="ip-head">
          <span class="ip-emo"></span>
          <div class="ip-titles">
            <p class="ip-kicker">💡 Intuition</p>
            <h2 id="ip-title"></h2>
          </div>
          <button class="btn ip-x" data-close aria-label="Close">✕</button>
        </header>
        <nav class="ip-nav" aria-label="Intuition sections"></nav>
        <div class="ip-body"></div>
      </div>`;
    document.body.appendChild(root);
    root.addEventListener("click", (e) => {
      if (e.target.closest("[data-close]")) return close();
      const go = e.target.closest("[data-go]");
      if (go) show(cur.id, +go.dataset.go);
    });
    // Keep pointer/touch inside the panel from reaching reveal.js (swipe = next slide).
    ["pointerdown", "touchstart", "wheel"].forEach((t) => root.addEventListener(t, (e) => e.stopPropagation(), { passive: true }));
    root.addEventListener("keydown", (e) => {
      e.stopPropagation();
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight" && cur.step >= 0) stepBy(1);
      if (e.key === "ArrowLeft" && cur.step >= 0) stepBy(-1);
      if (e.key === "Tab") trap(e);
    });
  }

  function trap(e) {
    const f = [...root.querySelectorAll("button, a[href]")].filter((b) => !b.disabled && b.offsetParent);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function stepBy(d) {
    const a = data().ACTS[cur.id];
    if (!a) return;
    const n = a.steps.length, s = cur.step + d;
    if (s >= 0 && s < n) show(cur.id, s);
  }

  function overview(a) {
    const list = (items) => `<ol class="ip-list">${items.map((t, i) => `<li style="--i:${i}"><span class="n">${i + 1}</span>${esc(t)}</li>`).join("")}</ol>`;
    const card = (key, icon, heading, part, col) => `
      <article class="ip-part ${key}" style="--col:var(${col})">
        <p class="ip-tag">${icon} ${key.toUpperCase()}</p>
        <h3>${heading}</h3>
        <div class="ip-art">${art(part.art)}</div>
        ${part.list ? list(part.list) : `<p>${esc(part.text)}</p>`}
      </article>`;
    return `<div class="ip-grid">
      ${card("what", "🎯", "What is the AI doing?", a.what, "--cyan")}
      ${card("how", "⚙️", "How does it work?", a.how, "--pink")}
      ${card("why", "🌍", "Why does it matter?", a.why, "--amber")}
    </div>`;
  }

  function stepView(a, i) {
    const s = a.steps[i];
    return `<div class="ip-step">
      <div class="ip-art big">${art(s.art)}</div>
      <div class="ip-explain">
        <p class="ip-steplabel">Step ${i + 1} of ${a.steps.length} · <b>${esc(s.label)}</b></p>
        <section class="you"><h4>🖐️ What you do</h4><p>${esc(s.do)}</p></section>
        <section class="ai"><h4>⚙️ What the AI does</h4><p>${esc(s.happens)}</p></section>
        <section class="why"><h4>💡 Why it matters</h4><p>${esc(s.why)}</p></section>
        <div class="ip-stepnav">
          <button class="btn" data-go="${i - 1}" ${i === 0 ? "disabled" : ""}>◀ Previous</button>
          <button class="btn" data-go="-1">🗺️ Big picture</button>
          <button class="btn primary" data-go="${i + 1}" ${i === a.steps.length - 1 ? "disabled" : ""}>Next ▶</button>
        </div>
      </div>
    </div>`;
  }

  function show(id, step) {
    const a = data().ACTS[id];
    cur = { id, step: a && step >= 0 && step < a.steps.length ? step : -1 };
    const nav = root.querySelector(".ip-nav"), body = root.querySelector(".ip-body");
    if (!a) {
      root.querySelector("#ip-title").textContent = "Intuition";
      root.querySelector(".ip-emo").textContent = "💡";
      nav.innerHTML = "";
      body.innerHTML = '<p class="notice">The explanations didn\'t load — check the internet connection and reload.</p>';
      return;
    }
    root.querySelector("#ip-title").textContent = a.title;
    root.querySelector(".ip-emo").textContent = a.emoji;
    nav.innerHTML = `<button class="chip ${cur.step < 0 ? "on" : ""}" data-go="-1">🗺️ What · How · Why</button>` +
      a.steps.map((s, i) => `<button class="chip ${cur.step === i ? "on" : ""}" data-go="${i}"><span class="n">${i + 1}</span>${esc(s.label)}</button>`).join("");
    body.innerHTML = cur.step < 0 ? overview(a) : stepView(a, cur.step);
    body.scrollTop = 0;
    if (reduced()) body.querySelectorAll("svg").forEach((s) => s.pauseAnimations && s.pauseAnimations());
    const on = nav.querySelector(".on");
    if (on && on.scrollIntoView) on.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  function open(id, step) {
    // Embedded in a slide: open in the deck, where there is room.
    if (embedded()) {
      try {
        if (window.parent && window.parent !== window && window.parent.IntuPanel) { window.parent.IntuPanel.open(id, step); return; }
      } catch (_) { /* cross-origin (shouldn't happen) — open here instead */ }
    }
    if (!root) build();
    show(id, step == null ? -1 : +step);
    lastFocus = document.activeElement;
    root.hidden = false;
    requestAnimationFrame(() => root.classList.add("show"));
    if (window.Reveal && Reveal.configure) Reveal.configure({ keyboard: false });
    root.querySelector(".ip-x").focus({ preventScroll: true });
  }

  function close() {
    if (!root || root.hidden) return;
    root.classList.remove("show");
    setTimeout(() => { root.hidden = true; root.querySelector(".ip-body").innerHTML = ""; }, 250);   // stop the SVG animations
    if (window.Reveal && Reveal.configure) Reveal.configure({ keyboard: true });
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-intu]:not(body)");
    if (b) { e.preventDefault(); e.stopPropagation(); open(b.dataset.intu, b.dataset.step != null ? +b.dataset.step : -1); }
  }, true);   // capture: a 💡 inside a drop zone must not also trigger the zone

  // Activity pages: the header button and one 💡 per instruction.
  document.addEventListener("DOMContentLoaded", () => {
    const id = document.body.dataset.py;
    const a = data().ACTS[id];
    if (!id || !a) return;
    if (!embedded()) {
      const head = document.querySelector("header.top");
      const py = head && head.querySelector(".btn.py");
      if (head) {
        const b = document.createElement("button");
        b.className = "btn intu"; b.dataset.intu = id;
        b.innerHTML = "💡 Intuition";
        head.insertBefore(b, py || head.querySelector("a.back"));
        if (!py) b.style.marginLeft = "auto";
      }
    }
    a.steps.forEach((s, i) => {
      const el = document.querySelectorAll(s.at)[s.n || 0];
      if (!el) { console.warn("intuition: step", i + 1, "of", id, "— no element for", s.at); return; }
      const bulb = document.createElement("button");
      bulb.type = "button";
      bulb.className = "ib";
      bulb.dataset.intu = id; bulb.dataset.step = i;
      bulb.title = "Why? — " + s.label;
      bulb.setAttribute("aria-label", "Explain step: " + s.label);
      bulb.innerHTML = "💡";
      if (s.where === "append") { el.appendChild(bulb); return; }
      if (s.where === "inline") { el.insertAdjacentElement("afterend", bulb); bulb.classList.add("inline"); return; }
      // "before": a small labelled line, placed outside any button row
      let host = el;
      while (host.parentElement && host.parentElement.matches(".row, .axes, .seg, .temp, .teach")) host = host.parentElement;
      const line = document.createElement("div");
      line.className = "ib-line";
      line.appendChild(bulb);
      line.insertAdjacentHTML("beforeend", `<span>${esc(s.label)}</span>`);
      bulb.removeAttribute("aria-label");
      line.title = bulb.title;
      host.parentElement.insertBefore(line, host);
      line.addEventListener("click", (e) => { if (e.target === line || e.target.tagName === "SPAN") bulb.click(); });
    });
  });

  window.IntuPanel = { open, close };
})();
