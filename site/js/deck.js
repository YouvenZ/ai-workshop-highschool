/* Deck behaviour: reveal.js setup, lazy activity iframes, timers, QR code,
   the neural-network animation and confetti moments. */
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

  // ---------- per-slide hooks ----------
  function onSlide(slide) {
    syncFrames(slide);
    if (slide.id === "nn-slide") NN.start(); else NN.stop();
    if (slide.id === "home") drawQR();
    if (slide.dataset.confetti !== undefined) setTimeout(() => FX.fireworks(2000), 400);
  }
  Reveal.on("ready", (e) => onSlide(e.currentSlide));
  Reveal.on("slidechanged", (e) => onSlide(e.currentSlide));
  Reveal.on("fragmentshown", (e) => { if (e.fragment.dataset.confetti !== undefined) FX.confetti(); });

})();
