/* Deck behaviour: reveal.js setup, lazy activity iframes, timers, QR code,
   the title-slide data constellation, the neural-network animation and the
   closing confetti. */
(function () {
  "use strict";

  Reveal.initialize({
    disableLayout: true,      // we lay out with CSS; keeps canvas/drag coordinates exact
    display: "flex",
    center: false,
    hash: true,
    controls: true,
    progress: true,
    slideNumber: "c/t",
    transition: "convex",
    backgroundTransition: "fade",
    // Keep swipes inside activities from changing slides.
    touch: true,
    plugins: [RevealNotes],
  });

  // ---------- activity iframes: load only on the current slide ----------
  // Two camera activities loaded at once would fight over the webcam, and
  // TensorFlow models eat memory — so each iframe exists only while its slide
  // is on screen. Leaving the slide also switches the camera light off.
  function syncFrames(current) {
    document.querySelectorAll("iframe[data-lazy]").forEach((f) => {
      const want = current.contains(f);
      const src = f.dataset.lazy + (f.dataset.lazy.includes("?") ? "&" : "?") + "embed=1";
      if (want && f.getAttribute("src") !== src) f.setAttribute("src", src);
      if (!want && f.getAttribute("src") !== "about:blank") f.setAttribute("src", "about:blank");
    });
  }

  // ---------- keys pressed inside an iframe (forwarded by fx.js) ----------
  window.addEventListener("message", (e) => {
    if (e.origin !== location.origin && location.origin !== "null") return;
    const d = e.data;
    if (!d || d.type !== "deck-key") return;
    const k = d.key;
    if (k === "ArrowRight" || k === "PageDown" || k === "n" || (k === " " && !d.shift)) Reveal.next();
    else if (k === "ArrowLeft" || k === "PageUp" || k === "p" || (k === " " && d.shift)) Reveal.prev();
    else if (k === "ArrowDown") Reveal.down();
    else if (k === "ArrowUp") Reveal.up();
    else if (k === "Home") Reveal.slide(0);
    else if (k === "End") Reveal.slide(Reveal.getTotalSlides() - 1);
    document.activeElement && document.activeElement.blur && document.activeElement.blur();
  });

  // ---------- activity timers (click to start / pause, double-click to reset) ----------
  document.querySelectorAll(".timer").forEach((t) => {
    const total = +t.dataset.sec;
    let left = total, iv = null;
    const fmt = () => (t.textContent = "⏱ " + Math.floor(left / 60) + ":" + String(left % 60).padStart(2, "0"));
    fmt();
    t.addEventListener("click", () => {
      if (iv) { clearInterval(iv); iv = null; t.classList.remove("running"); return; }
      t.classList.add("running"); t.classList.remove("done");
      iv = setInterval(() => {
        left = Math.max(0, left - 1); fmt();
        if (!left) { clearInterval(iv); iv = null; t.classList.remove("running"); t.classList.add("done"); }
      }, 1000);
    });
    t.addEventListener("dblclick", () => { clearInterval(iv); iv = null; left = total; t.classList.remove("running", "done"); fmt(); });
  });

  // ---------- QR code pointing at the activity hub ----------
  function drawQR() {
    const box = document.getElementById("qr");
    if (!box || box.dataset.done) return;
    const url = new URL("play/", location.href.split("#")[0]).href;
    document.getElementById("qr-url").textContent = url;
    if (typeof qrcode !== "function") { box.innerHTML = '<p style="color:#000;padding:1em">QR library offline — type the address below.</p>'; return; }
    const qr = qrcode(0, "M");
    qr.addData(url); qr.make();
    box.innerHTML = qr.createSvgTag({ cellSize: 8, margin: 1, scalable: true });
    box.dataset.done = "1";
  }

  // ---------- neural network animation ----------
  const NN = (function () {
    const cv = document.getElementById("nn");
    if (!cv) return { start() {}, stop() {} };
    const ctx = cv.getContext("2d");
    const LAYERS = [6, 8, 8, 3];
    const COL = ["#22e4ff", "#8b5cff", "#ff4fd8", "#ffc53d"];
    let raf = 0, sparks = [], nodes = [];
    function layout() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      cv.width = cv.clientWidth * dpr; cv.height = cv.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const W = cv.clientWidth, H = cv.clientHeight;
      nodes = LAYERS.map((n, li) => Array.from({ length: n }, (_, i) => ({
        x: W * (0.1 + 0.8 * li / (LAYERS.length - 1)), y: H * ((i + 1) / (n + 1)), glow: 0,
      })));
    }
    function tick() {
      const W = cv.clientWidth, H = cv.clientHeight;
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      for (let l = 0; l < nodes.length - 1; l++) for (const a of nodes[l]) for (const b of nodes[l + 1]) {
        ctx.strokeStyle = "rgba(255,255,255,.07)"; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      if (Math.random() < 0.35) {
        const a = nodes[0][Math.floor(Math.random() * nodes[0].length)];
        sparks.push({ l: 0, a, b: nodes[1][Math.floor(Math.random() * nodes[1].length)], t: 0 });
      }
      sparks = sparks.filter((s) => {
        s.t += 0.03;
        if (s.t >= 1) {
          s.b.glow = 1;
          if (s.l + 2 < nodes.length) {
            const nx = nodes[s.l + 2];
            sparks.push({ l: s.l + 1, a: s.b, b: nx[Math.floor(Math.random() * nx.length)], t: 0 });
          }
          return false;
        }
        const x = s.a.x + (s.b.x - s.a.x) * s.t, y = s.a.y + (s.b.y - s.a.y) * s.t;
        ctx.fillStyle = COL[s.l + 1]; ctx.shadowColor = COL[s.l + 1]; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
        return true;
      });
      nodes.forEach((layer, li) => layer.forEach((n) => {
        n.glow *= 0.94;
        ctx.fillStyle = "#150f3a"; ctx.strokeStyle = COL[li]; ctx.lineWidth = 3;
        ctx.shadowColor = COL[li]; ctx.shadowBlur = 8 + 30 * n.glow;
        ctx.beginPath(); ctx.arc(n.x, n.y, 13 + 5 * n.glow, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.shadowBlur = 0;
      }));
      raf = requestAnimationFrame(tick);
    }
    window.addEventListener("resize", () => raf && layout());
    return { start() { if (!raf) { layout(); tick(); } }, stop() { cancelAnimationFrame(raf); raf = 0; } };
  })();


  // ---------- title slide: "data learns its shape" ----------
  // Unlabelled data drifts as noise → each point gets a label (colour) →
  // the points organise themselves into three clusters wired like a neural
  // network → signals race from every cluster into the brain, which lights
  // up → the clusters dissolve and it starts again, somewhere new.
  // It is the whole workshop in nine seconds: data + labels → learning.
  const Hero = (function () {
    const cv = document.getElementById("hero");
    if (!cv) return { start() {}, stop() {} };
    const ctx = cv.getContext("2d");
    const COL = ["34,228,255", "255,79,216", "255,197,61"];
    const CYCLE = 9000;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W, H, raf = 0, pts = [], centres = [], t0 = 0, cycle = -1, signals = [], brain = { x: 0, y: 0 };
    const core = document.querySelector(".title-orbit .core"), orbit = document.querySelector(".title-orbit");

    function layout() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(190, Math.max(90, W * H / 9000)));
      if (pts.length !== n) pts = Array.from({ length: n }, (_, i) => ({
        x: Math.random() * W, y: Math.random() * H, vx: 0, vy: 0, k: i % 3,
        ox: (Math.random() - .5), oy: (Math.random() - .5), jit: Math.random() * 6.28,
      }));
      if (core) {
        const a = core.getBoundingClientRect(), b = cv.getBoundingClientRect();
        brain = { x: a.left + a.width / 2 - b.left, y: a.top + a.height / 2 - b.top };
      } else brain = { x: W / 2, y: H * .3 };
    }
    // Cluster centres around the edges, never on top of the title text.
    function newCentres() {
      const spots = [[.13, .3], [.87, .3], [.14, .68], [.88, .72], [.3, .1], [.7, .1]];   // bottom-left stays clear of the phase caption
      const pick = spots.sort(() => Math.random() - .5).slice(0, 3);
      centres = pick.map(([x, y]) => ({ x: x * W, y: y * H, r: Math.min(W, H) * (.09 + Math.random() * .03) }));
    }
    const smooth = (a, b, t) => { const u = Math.max(0, Math.min(1, (t - a) / (b - a))); return u * u * (3 - 2 * u); };

    function frame(now) {
      if (!t0) t0 = now;
      const el = now - t0, c = Math.floor(el / CYCLE), ph = (el % CYCLE) / CYCLE;
      if (c !== cycle) { cycle = c; newCentres(); }
      const label = smooth(.08, .22, ph);          // colour appears
      const pull = smooth(.2, .45, ph) * (1 - smooth(.86, .98, ph));   // organise, then let go
      ctx.clearRect(0, 0, W, H);

      // move
      for (const p of pts) {
        p.jit += .02;
        const ce = centres[p.k];
        const tx = ce.x + p.ox * ce.r * 2, ty = ce.y + p.oy * ce.r * 1.6;
        const drift = 1 - pull;
        p.vx += (Math.cos(p.jit) * .05) * drift + (tx - p.x) * .012 * pull;
        p.vy += (Math.sin(p.jit * 1.3) * .05) * drift + (ty - p.y) * .012 * pull;
        p.vx *= .9; p.vy *= .9;
        p.x += p.vx; p.y += p.vy;
        if (pull < .05) { if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10; if (p.y < -10) p.y = H + 10; if (p.y > H + 10) p.y = -10; }
      }
      // synapses between nearby points of the same class (the "learned" structure)
      const reach = 34 + 40 * pull;
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j];
        if (a.k !== b.k && pull > .2) continue;
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d > reach) continue;
        const alpha = (1 - d / reach) * (.12 + .3 * pull);
        ctx.strokeStyle = label > .5 ? `rgba(${COL[a.k]},${alpha})` : `rgba(200,190,255,${alpha})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      // signals: from each organised cluster into the brain
      if (pull > .85 && Math.random() < .35) {
        const k = Math.floor(Math.random() * 3), ce = centres[k];
        signals.push({ x0: ce.x, y0: ce.y, k, t: 0 });
      }
      signals = signals.filter((s) => {
        s.t += .022;
        if (s.t >= 1) { if (orbit) { orbit.classList.remove("zap"); void orbit.offsetWidth; orbit.classList.add("zap"); } return false; }
        const e = s.t * s.t * (3 - 2 * s.t);
        const mx = (s.x0 + brain.x) / 2, my = Math.min(s.y0, brain.y) - 60;     // a gentle arc
        const x = (1 - e) * (1 - e) * s.x0 + 2 * (1 - e) * e * mx + e * e * brain.x;
        const y = (1 - e) * (1 - e) * s.y0 + 2 * (1 - e) * e * my + e * e * brain.y;
        ctx.fillStyle = `rgba(${COL[s.k]},.95)`; ctx.shadowColor = `rgba(${COL[s.k]},1)`; ctx.shadowBlur = 16;
        ctx.beginPath(); ctx.arc(x, y, 3.2, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
        return true;
      });
      // points
      for (const p of pts) {
        const col = label > 0 ? COL[p.k] : "200,190,255";
        ctx.fillStyle = `rgba(${col},${.35 + .55 * Math.max(label, .3)})`;
        if (pull > .5) { ctx.shadowColor = `rgba(${COL[p.k]},.9)`; ctx.shadowBlur = 8 * pull; }
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.6 + 1.2 * label + 1.2 * pull, 0, 7); ctx.fill();
        ctx.shadowBlur = 0;
      }
      // cluster labels ("class A/B/C" learned)
      const fs = Math.max(12, Math.min(17, W / 85));
      ctx.font = `700 ${fs}px Fredoka, Outfit, system-ui`; ctx.textAlign = "center";
      centres.forEach((ce, k) => {
        const a = smooth(.42, .55, ph) * (1 - smooth(.84, .92, ph));
        if (a <= 0) return;
        ctx.fillStyle = `rgba(${COL[k]},${a * .95})`;
        ctx.fillText(["group A", "group B", "group C"][k], ce.x, ce.y - ce.r * 1.1 - 10);
      });
      // what the audience is watching, in four words
      const stage = ph < .1 ? 0 : ph < .22 ? 1 : ph < .5 ? 2 : ph < .86 ? 3 : 0;
      const STAGES = ["① raw data", "② + labels", "③ learning the groups", "④ the brain has learned"];
      ctx.font = `600 ${Math.round(fs * .85)}px "JetBrains Mono", monospace`; ctx.textAlign = "left";
      STAGES.forEach((txt, i) => {
        ctx.fillStyle = i === stage ? "rgba(182,255,59,.95)" : "rgba(183,176,216,.32)";
        ctx.fillText(txt, 18, H - 18 - (STAGES.length - 1 - i) * fs * 1.3);
      });
      if (!reduced) raf = requestAnimationFrame(frame);
    }
    window.addEventListener("resize", () => { if (raf || reduced) layout(); });
    return {
      start() {
        if (raf) return;
        layout();
        if (reduced) {                       // one still frame: organised clusters, no motion
          newCentres(); cycle = 0;
          for (const p of pts) { const ce = centres[p.k]; p.x = ce.x + p.ox * ce.r * 2; p.y = ce.y + p.oy * ce.r * 1.6; }
          t0 = performance.now() - CYCLE * .7; frame(performance.now()); return;
        }
        t0 = 0; raf = requestAnimationFrame(frame);
      },
      stop() { cancelAnimationFrame(raf); raf = 0; },
    };
  })();

  // ---------- "every AI in a few lines of Python" grid ----------
  // Built from the same snippets the 🐍 buttons show, so the line counts are
  // always the real ones.
  (function pyGrid() {
    const box = document.getElementById("pygrid"), all = window.PY_SNIPPETS;
    if (!box) return;
    if (!all) { box.innerHTML = '<p class="muted">The Python examples didn\'t load — check the connection.</p>'; return; }
    box.innerHTML = Object.entries(all).map(([id, s]) => {
      const n = s.code.split("\n").filter((l) => l.trim() && !l.trim().startsWith("#")).length;
      return `<button class="pycard" data-py="${id}"><span class="e">${s.emoji}</span><b>${s.title}</b><small><i>${n}</i> lines of Python</small></button>`;
    }).join("");
  })();

  // ---------- per-slide hooks ----------
  function onSlide(slide) {
    syncFrames(slide);
    if (slide.id === "nn-slide") NN.start(); else NN.stop();
    if (slide.id === "home") drawQR();
    if (slide.id === "title") Hero.start(); else Hero.stop();
    // The only party in the deck: real confetti on the thank-you slide.
    if (slide.dataset.confetti !== undefined) setTimeout(() => FX.party(2200), 400);
  }
  Reveal.on("ready", (e) => onSlide(e.currentSlide));
  Reveal.on("slidechanged", (e) => onSlide(e.currentSlide));
  Reveal.on("fragmentshown", (e) => { if (e.fragment.dataset.confetti !== undefined) FX.confetti(); });

})();
