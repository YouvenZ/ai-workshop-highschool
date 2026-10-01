/* Shared helpers for the deck and every activity page.
   No framework, no build step: loaded with a plain <script> tag. */
(function () {
  "use strict";

  const FX = {};

  // Embedded inside the deck's <iframe>? The deck passes ?embed=1; the
  // window check is the fallback for someone opening the iframe URL directly.
  FX.embedded = /[?&]embed=1\b/.test(location.search) || window.self !== window.top;
  if (FX.embedded) {
    document.documentElement.classList.add("embedded");
    document.addEventListener("DOMContentLoaded", () => document.body.classList.add("embedded"));
  }

  // Keys pressed while the iframe has focus never reach reveal.js, so after
  // a student clicks inside an activity the presenter's clicker would "die".
  // Forward navigation keys to the deck — but never while someone is typing.
  if (FX.embedded) {
    const NAV = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "PageUp", "PageDown", " ", "n", "p", "Home", "End"]);
    window.addEventListener("keydown", (e) => {
      const t = e.target;
      const typing = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
      if (typing || !NAV.has(e.key) || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === " " && t && t.tagName === "BUTTON") return;   // space presses a focused button
      e.preventDefault();
      try { window.parent.postMessage({ type: "deck-key", key: e.key, shift: e.shiftKey }, location.origin === "null" ? "*" : location.origin); } catch (_) {}
    });
  }

  // ---------- celebrations ----------
  // Activities celebrate with a NEURAL BURST: glowing neurons fire out from a
  // point and wire themselves together, then fade — an "aha" that looks like
  // AI, not like a birthday. Real party confetti (canvas-confetti) is kept for
  // one moment only: the deck's thank-you slide (FX.party).
  const NEON = ["34,228,255", "255,79,216", "255,197,61", "182,255,59", "139,92,255"];
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let burstCv, burstCtx, bursts = [], burstRaf = 0;
  function burstLoop() {
    const w = innerWidth, h = innerHeight;
    burstCtx.clearRect(0, 0, w, h);
    const now = performance.now();
    bursts = bursts.filter((b) => now - b.t0 < b.life);
    for (const b of bursts) {
      const t = (now - b.t0) / b.life, ease = 1 - Math.pow(1 - Math.min(1, t * 1.6), 3), fade = 1 - Math.max(0, (t - .45) / .55);
      const pts = b.nodes.map((n) => ({ x: b.x + n.dx * ease, y: b.y + n.dy * ease, c: n.c, r: n.r }));
      // synapses: each neuron wires to its two nearest neighbours
      burstCtx.lineWidth = 1.2;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        b.links[i].forEach((j) => {
          const c = pts[j];
          burstCtx.strokeStyle = `rgba(${a.c},${0.45 * fade})`;
          burstCtx.beginPath(); burstCtx.moveTo(a.x, a.y); burstCtx.lineTo(c.x, c.y); burstCtx.stroke();
          // a signal racing along the synapse
          const s = (t * 2.2 + i * .13) % 1;
          burstCtx.fillStyle = `rgba(255,255,255,${0.9 * fade})`;
          burstCtx.beginPath(); burstCtx.arc(a.x + (c.x - a.x) * s, a.y + (c.y - a.y) * s, 1.6, 0, 7); burstCtx.fill();
        });
      }
      for (const a of pts) {
        burstCtx.fillStyle = `rgba(${a.c},${fade})`;
        burstCtx.shadowColor = `rgba(${a.c},1)`; burstCtx.shadowBlur = 14;
        burstCtx.beginPath(); burstCtx.arc(a.x, a.y, a.r * (1 + .4 * (1 - ease)), 0, 7); burstCtx.fill();
      }
      burstCtx.shadowBlur = 0;
      // core flash
      const g = burstCtx.createRadialGradient(b.x, b.y, 0, b.x, b.y, 60 + 120 * ease);
      g.addColorStop(0, `rgba(255,255,255,${0.35 * (1 - t)})`); g.addColorStop(1, "rgba(255,255,255,0)");
      burstCtx.fillStyle = g; burstCtx.beginPath(); burstCtx.arc(b.x, b.y, 60 + 120 * ease, 0, 7); burstCtx.fill();
    }
    burstRaf = bursts.length ? requestAnimationFrame(burstLoop) : 0;
    if (!burstRaf) burstCtx.clearRect(0, 0, w, h);
  }
  FX.burst = function (opts) {
    if (reduced()) return;
    opts = opts || {};
    if (!burstCv) {
      burstCv = document.createElement("canvas");
      burstCv.className = "fx-burst";
      burstCv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:150";
      document.body.appendChild(burstCv);
      burstCtx = burstCv.getContext("2d");
    }
    const dpr = Math.min(devicePixelRatio || 1, 2);
    if (burstCv.width !== Math.round(innerWidth * dpr)) {
      burstCv.width = Math.round(innerWidth * dpr); burstCv.height = Math.round(innerHeight * dpr);
      burstCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    const o = opts.origin || {};
    const x = (o.x != null ? o.x : 0.5) * innerWidth, y = (o.y != null ? o.y : 0.6) * innerHeight;
    const n = Math.max(10, Math.min(34, Math.round((opts.particleCount || 60) / 3)));
    const R = Math.min(innerWidth, innerHeight) * (opts.spread ? opts.spread / 260 : 0.28);
    const nodes = Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 + Math.random() * .5, d = R * (.35 + Math.random() * .65);
      return { dx: Math.cos(a) * d, dy: Math.sin(a) * d, c: NEON[i % NEON.length], r: 2 + Math.random() * 2.5 };
    });
    const links = nodes.map((a, i) => nodes.map((b, j) => [j, Math.hypot(a.dx - b.dx, a.dy - b.dy)])
      .filter(([j]) => j !== i).sort((p, q) => p[1] - q[1]).slice(0, 2).map(([j]) => j));
    bursts.push({ x, y, nodes, links, t0: performance.now(), life: 1300 });
    if (!burstRaf) burstRaf = requestAnimationFrame(burstLoop);
  };
  // A short volley of bursts across the screen (an activity's grand finale).
  FX.burstShow = function (ms) {
    const end = Date.now() + (ms || 1400);
    (function next() {
      FX.burst({ particleCount: 70, origin: { x: .15 + Math.random() * .7, y: .25 + Math.random() * .5 } });
      if (Date.now() < end) setTimeout(next, 260);
    })();
  };
  // Back-compatible names used by the activities: they now fire neural bursts.
  FX.confetti = function (opts) { FX.burst(opts); };
  FX.fireworks = function (ms) { FX.burstShow(ms); };
  // The one real party: confetti cannons for the deck's final slide.
  FX.party = function (ms) {
    if (typeof window.confetti !== "function") return FX.burstShow(ms);
    const colors = ["#22e4ff", "#ff4fd8", "#ffc53d", "#b6ff3b", "#8b5cff"];
    const end = Date.now() + (ms || 1600);
    (function frame() {
      window.confetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0, y: 0.8 }, colors });
      window.confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1, y: 0.8 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  // ---------- toast ----------
  let toastEl, toastTimer;
  FX.toast = function (msg, ms) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), ms || 2200);
  };

  // ---------- floating particle network ----------
  FX.particles = function (canvas, count) {
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    const colors = ["34,228,255", "255,79,216", "255,197,61", "139,92,255"];
    let w, h, dpr, pts = [];
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);
    const n = count || Math.round(Math.min(70, (w * h) / 22000));
    for (let i = 0; i < n; i++) {
      pts.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
                 r: 1 + Math.random() * 2.2, c: colors[i % colors.length] });
    }
    function tick() {
      if (!document.hidden) {
        ctx.clearRect(0, 0, w, h);
        for (const p of pts) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < 130) {
              ctx.strokeStyle = `rgba(${a.c},${(1 - d / 130) * 0.25})`;
              ctx.lineWidth = 1;
              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            }
          }
        }
        for (const p of pts) {
          ctx.fillStyle = `rgba(${p.c},0.85)`;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        }
      }
      requestAnimationFrame(tick);
    }
    tick();
  };

  // ---------- camera ----------
  // Resolves to a MediaStream or rejects with an Error whose .friendly is a
  // sentence a 15-year-old understands.
  FX.startCamera = async function (video, opts) {
    const fail = (msg, err) => { const e = new Error(msg); e.friendly = msg; e.cause = err; throw e; };
    if (!window.isSecureContext) fail("The camera only works on https:// or localhost. Open the live website instead of the file.");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) fail("This browser can't use a camera. Try Chrome, Edge, Firefox or Safari.");
    let stream;
    // The permission pop-up lives in the browser bar, easy to miss on a projector.
    const nag = setTimeout(() => FX.toast("👆 Click “Allow” in the camera pop-up at the top of the browser", 5000), 1500);
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: Object.assign({ facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } }, opts || {}),
        audio: false,
      });
    } catch (err) {
      const name = err && err.name;
      if (name === "NotAllowedError" || name === "SecurityError") fail("Camera permission was blocked. Click the 🔒 / 🎥 icon in the address bar, allow the camera, and reload.", err);
      if (name === "NotFoundError" || name === "OverconstrainedError") fail("No camera found on this device.", err);
      if (name === "NotReadableError") fail("Another app or tab is using the camera. Close it and press Start again.", err);
      fail("The camera didn't start (" + (name || "unknown error") + ").", err);
    } finally {
      clearTimeout(nag);
    }
    video.srcObject = stream;
    video.muted = true; video.playsInline = true;
    await video.play().catch(() => {});
    if (!video.videoWidth) await new Promise((r) => video.addEventListener("loadedmetadata", r, { once: true }));
    // Stop the camera light when the page (or the deck's iframe) goes away.
    window.addEventListener("pagehide", () => FX.stopCamera(video), { once: true });
    return stream;
  };
  FX.stopCamera = function (video) {
    const s = video && video.srcObject;
    if (s) s.getTracks().forEach((t) => t.stop());
    if (video) video.srcObject = null;
  };

  // Load an image from a user-picked file.
  FX.imageFromFile = function (file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("That file isn't an image I can read."));
      img.src = URL.createObjectURL(file);
    });
  };
  FX.loadImage = function (src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  // Promise that rejects after ms — so a hung model download becomes a
  // visible fallback instead of an endless spinner.
  FX.timeout = function (promise, ms, what) {
    return Promise.race([
      promise,
      new Promise((_, rej) => setTimeout(() => rej(new Error((what || "Loading") + " took too long — the wifi may be slow.")), ms)),
    ]);
  };

  // Wait until a global (a CDN library) exists, or reject.
  FX.need = function (name, ms) {
    return new Promise((resolve, reject) => {
      const t0 = Date.now();
      (function poll() {
        if (window[name]) return resolve(window[name]);
        if (Date.now() - t0 > (ms || 15000)) return reject(new Error("Couldn't download the " + name + " library — check the internet connection."));
        setTimeout(poll, 100);
      })();
    });
  };

  FX.shuffle = function (a) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };

  // Canvas pointer position in the canvas's own pixel space, whatever CSS size it is shown at.
  FX.canvasPoint = function (canvas, e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (canvas.width / r.width), y: (e.clientY - r.top) * (canvas.height / r.height) };
  };

  // Standalone pages: start the particle backdrop.
  document.addEventListener("DOMContentLoaded", () => {
    const pc = document.getElementById("particles");
    if (pc && !FX.embedded) FX.particles(pc);
  });

  window.FX = FX;
})();
