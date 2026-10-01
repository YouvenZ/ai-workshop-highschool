/* 💡 Intuition — the content behind every "Intuition" button and step 💡.

   ONE data file for all 11 activities, read by js/intuition-panel.js.

   Each activity has:
     what / how / why   → the three illustrated cards of the big-picture view
     steps[]            → one 💡 per instruction in the activity:
                          at    = CSS selector of the element the 💡 is attached to
                          n     = which match, if the selector matches several (default 0)
                          where = "append" (inside, at the end — for headings)
                                | "inline" (right after it, e.g. next to a button — adds no height)
                                | "before" (a small "💡 label" line placed before it;
                                  lifted out of a .row so it never breaks a button row)
                          label, do (what you do), happens (what the AI does), why

   Illustrations are small animated SVGs (SMIL) in the site's neon palette,
   built by the functions in ART so the same picture can be reused. */
(function () {
  "use strict";

  const C = { c: "#22e4ff", p: "#ff4fd8", a: "#ffc53d", l: "#b6ff3b", v: "#8b5cff", i: "#f5f2ff", m: "#b7b0d8", d: "#150f3a", r: "#ff5a6e" };
  const svg = (label, body) =>
    `<svg class="ia" viewBox="0 0 320 180" role="img" aria-label="${label}" font-family="Outfit, system-ui, sans-serif">${body}</svg>`;
  const A = (attr, values, dur, more) =>
    `<animate attributeName="${attr}" values="${values}" dur="${dur}s" repeatCount="indefinite" ${more || ""}/>`;
  // text-anchor defaults to middle; pass it in `more` to override (never both:
  // a duplicate attribute is silently dropped by the HTML parser)
  const T = (x, y, s, col, size, more) =>
    `<text x="${x}" y="${y}" fill="${col || C.i}" font-size="${size || 12}" ${/text-anchor/.test(more || "") ? "" : 'text-anchor="middle"'} ${more || ""}>${s}</text>`;
  // Two captions that take turns in the same spot use calcMode="discrete",
  // so they swap instantly instead of cross-fading through each other.
  const glow = `<defs><filter id="gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
  // a deterministic scatter, so the pictures look the same every time
  function rnd(seed) { let s = seed; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); }
  function cloud(cx, cy, n, sx, sy, col, seed, shape) {
    const r = rnd(seed); let out = "";
    for (let i = 0; i < n; i++) {
      const x = cx + (r() - .5) * sx, y = cy + (r() - .5) * sy;
      out += shape === "tri"
        ? `<path d="M${x} ${y - 4}L${x + 4} ${y + 3}L${x - 4} ${y + 3}Z" fill="${col}"/>`
        : `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.4" fill="${col}"/>`;
    }
    return out;
  }

  const ART = {
    // rules written by people vs rules learned from examples
    rules: () => svg("Rules written by a person versus rules learned from examples", glow + `
      <rect x="12" y="22" width="132" height="120" rx="12" fill="none" stroke="${C.a}" stroke-width="1.5"/>
      ${T(78, 42, "⚙️ RULES", C.a, 12, 'font-weight="700"')}
      <text x="24" y="70" fill="${C.i}" font-size="11" font-family="JetBrains Mono, monospace">IF temp &lt; 20
        ${A("opacity", "0;1;1;1", 4)}</text>
      <text x="24" y="88" fill="${C.i}" font-size="11" font-family="JetBrains Mono, monospace">THEN heat ON
        ${A("opacity", "0;0;1;1", 4)}</text>
      ${T(78, 124, "a person wrote this", C.m, 10)}
      <rect x="176" y="22" width="132" height="120" rx="12" fill="none" stroke="${C.c}" stroke-width="1.5"/>
      ${T(242, 42, "🧠 LEARNED", C.c, 12, 'font-weight="700"')}
      ${[0, 1, 2, 3, 4].map((i) => `<circle r="4" fill="${i % 2 ? C.p : C.c}" filter="url(#gl)"><animateMotion dur="3s" begin="${i * .55}s" repeatCount="indefinite" path="M${190 + i * 8} 62 Q 230 ${70 + i * 6} 242 100"/></circle>`).join("")}
      <circle cx="242" cy="104" r="15" fill="${C.d}" stroke="${C.v}" stroke-width="2">${A("r", "14;17;14", 1.4)}</circle>
      ${T(242, 108, "🧠", C.i, 13)}
      ${T(242, 134, "pattern found in the data", C.m, 10)}
      ${T(160, 168, "Normal program = rules · AI = learns rules from data", C.i, 11, 'font-weight="600"')}`),

    // labelled examples → model → label for a new thing
    examples: () => svg("Labelled examples go into a model, which then labels something new", glow + `
      ${[["🐱", "cat", 30], ["🐶", "dog", 72], ["🐱", "cat", 114]].map(([e, l, y], i) => `
        <g>${A("opacity", "0;1;1", 3, `begin="${i * .3}s"`)}
          <rect x="14" y="${y - 18}" width="70" height="30" rx="8" fill="rgba(255,255,255,.07)" stroke="${C.m}" stroke-opacity=".4"/>
          ${T(32, y + 2, e, C.i, 15)}
          <rect x="46" y="${y - 10}" width="32" height="15" rx="7" fill="${l === "cat" ? C.c : C.p}" fill-opacity=".25" stroke="${l === "cat" ? C.c : C.p}"/>
          ${T(62, y + 1, l, C.i, 9)}</g>`).join("")}
      <path d="M92 72 H130" stroke="${C.m}" stroke-width="2" marker-end="url(#ar)"/>
      <defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="${C.m}"/></marker></defs>
      <rect x="134" y="44" width="70" height="56" rx="12" fill="${C.d}" stroke="${C.v}" stroke-width="2" filter="url(#gl)">${A("stroke", `${C.v};${C.c};${C.v}`, 2)}</rect>
      ${T(169, 70, "model", C.i, 12, 'font-weight="700"')}${T(169, 86, "learns", C.m, 10)}
      <path d="M210 72 H246" stroke="${C.m}" stroke-width="2" marker-end="url(#ar)"/>
      <rect x="252" y="50" width="56" height="44" rx="10" fill="rgba(255,255,255,.07)" stroke="${C.m}" stroke-opacity=".4"/>
      ${T(280, 78, "🐈", C.i, 18)}
      <rect x="254" y="100" width="52" height="18" rx="9" fill="${C.c}" fill-opacity=".25" stroke="${C.c}">${A("opacity", "0;0;1;1", 3)}</rect>
      <text x="280" y="113" fill="${C.i}" font-size="10" text-anchor="middle">cat ✓${A("opacity", "0;0;1;1", 3)}</text>
      ${T(160, 160, "examples + answers → a model → answers for NEW things", C.i, 11, 'font-weight="600"')}`),

    // K nearest neighbours vote on a new point
    knn: () => svg("A new point; the circle grows until it holds the K nearest neighbours, which vote", glow + `
      ${cloud(90, 90, 14, 110, 90, C.c, 3)}${cloud(220, 92, 14, 110, 90, C.p, 7)}
      <circle cx="152" cy="86" r="0" fill="none" stroke="${C.i}" stroke-dasharray="4 4" stroke-width="1.5">${A("r", "0;34;34;34", 4)}</circle>
      ${[[132, 70], [130, 101], [176, 92]].map(([x, y], i) => `<line x1="152" y1="86" x2="${x}" y2="${y}" stroke="${i < 2 ? C.c : C.p}" stroke-width="2">${A("opacity", `0;0;${i < 2 ? 1 : 1};1`, 4, `keyTimes="0;${.3 + i * .12};${.31 + i * .12};1"`)}</line>`).join("")}
      <path d="M152 78 l2.5 5 5.5 .8 -4 3.9 1 5.5 -5 -2.6 -5 2.6 1 -5.5 -4 -3.9 5.5 -.8z" fill="${C.i}" filter="url(#gl)">${A("opacity", "1;.5;1", 1)}</path>
      <g>${A("opacity", "0;0;1;1", 4, 'keyTimes="0;.7;.72;1"')}
        <rect x="104" y="140" width="112" height="24" rx="12" fill="rgba(34,228,255,.18)" stroke="${C.c}"/>
        ${T(160, 156, "vote: 2 ● vs 1 ● → ●", C.i, 11, 'font-weight="700"')}</g>
      ${T(160, 16, "K = 3 nearest neighbours vote", C.m, 11)}`),

    // K small = jagged, K large = smooth
    kchoice: () => svg("Small K makes a jagged boundary, large K a smooth one", `
      ${[0, 1].map((k) => `<g transform="translate(${k * 160} 0)">
        <rect x="10" y="22" width="140" height="120" rx="10" fill="rgba(255,255,255,.04)" stroke="${C.m}" stroke-opacity=".3"/>
        ${cloud(48, 82, 12, 60, 100, C.c, 11 + k)}${cloud(112, 82, 12, 60, 100, C.p, 21 + k)}
        <path d="${k ? "M80 24 C 78 60, 84 100, 80 140" : "M80 24 L70 40 L88 52 L74 66 L92 80 L72 96 L86 110 L76 124 L84 140"}" fill="none" stroke="${C.a}" stroke-width="2.5" stroke-dasharray="300" stroke-dashoffset="300">${A("stroke-dashoffset", "300;0;0", 3)}</path>
        ${T(80, 160, k ? "K = 15 · smooth, calm" : "K = 1 · jagged, nervous", k ? C.l : C.a, 11, 'font-weight="700"')}</g>`).join("")}`),

    // one odd example makes an island when K = 1
    outlier: () => svg("One weird example creates an island when K is 1, and is outvoted when K is larger", `
      <rect x="20" y="22" width="280" height="120" rx="12" fill="rgba(34,228,255,.06)" stroke="${C.m}" stroke-opacity=".3"/>
      ${cloud(160, 82, 26, 250, 100, C.c, 31)}
      <circle cx="160" cy="80" r="26" fill="${C.p}" fill-opacity=".25" stroke="${C.p}" stroke-dasharray="3 3">${A("opacity", "1;1;0;0;1", 5, 'calcMode="discrete"')}</circle>
      <circle cx="160" cy="80" r="5" fill="${C.p}"/>
      ${T(160, 66, "😈", C.i, 14)}
      <text x="160" y="164" fill="${C.a}" font-size="11" text-anchor="middle" font-weight="700">K = 1: one weird example owns an island${A("opacity", "1;1;0;0;1", 5, 'calcMode="discrete"')}</text>
      <text x="160" y="164" fill="${C.l}" font-size="11" text-anchor="middle" font-weight="700" opacity="0">K = 7: its neighbours outvote it${A("opacity", "0;0;1;1;0", 5, 'calcMode="discrete"')}</text>`),

    // a picture is a grid of numbers
    pixels: () => {
      const r = rnd(5); let cells = "";
      for (let y = 0; y < 5; y++) for (let x = 0; x < 7; x++) {
        const v = Math.round(40 + r() * 215), col = `rgb(${v},${Math.round(v * .55)},${Math.round(255 - v * .5)})`;
        cells += `<rect x="${20 + x * 24}" y="${26 + y * 24}" width="23" height="23" fill="${col}"/>
          <text x="${31.5 + x * 24}" y="${41 + y * 24}" font-size="8" fill="#fff" text-anchor="middle" font-family="JetBrains Mono, monospace" opacity="0">${v}${A("opacity", "0;0;1;1;0", 6, `keyTimes="0;${(.1 + (x + y * 7) * .012).toFixed(3)};${(.14 + (x + y * 7) * .012).toFixed(3)};.92;1"`)}</text>`;
      }
      return svg("A photo is a grid of pixels, and every pixel is just numbers", `${cells}
        <path d="M196 86 H226" stroke="${C.m}" stroke-width="2"/><path d="M220 80 L228 86 L220 92" fill="none" stroke="${C.m}" stroke-width="2"/>
        <rect x="236" y="40" width="70" height="70" rx="8" fill="rgba(255,255,255,.06)" stroke="${C.m}" stroke-opacity=".4"/>
        ${T(271, 64, "R 214", C.r, 11, 'font-family="JetBrains Mono, monospace"')}${T(271, 80, "G 118", C.l, 11, 'font-family="JetBrains Mono, monospace"')}${T(271, 96, "B 147", C.c, 11, 'font-family="JetBrains Mono, monospace"')}
        ${T(160, 168, "a computer never sees a picture — only numbers", C.i, 11, 'font-weight="600"')}`);
    },

    // a 3×3 filter slides over the image
    filter: () => {
      let g = "";
      for (let y = 0; y < 5; y++) for (let x = 0; x < 6; x++) g += `<rect x="${16 + x * 20}" y="${30 + y * 20}" width="19" height="19" fill="${(x + y) % 3 ? "#3a2f72" : "#6a5bbf"}"/>`;
      let o = "";
      for (let y = 0; y < 3; y++) for (let x = 0; x < 4; x++) {
        const i = y * 4 + x;
        o += `<rect x="${200 + x * 22}" y="${50 + y * 22}" width="21" height="21" fill="${C.a}" opacity=".08">${A("opacity", ".08;.08;.9;.9", 6, `keyTimes="0;${(i / 12).toFixed(3)};${((i + .5) / 12).toFixed(3)};1"`)}</rect>`;
      }
      const pos = []; for (let y = 0; y < 3; y++) for (let x = 0; x < 4; x++) pos.push(`${16 + x * 20} ${30 + y * 20}`);
      return svg("A 3 by 3 filter slides over every pixel and makes a new image", `${g}
        <rect width="59" height="59" fill="none" stroke="${C.a}" stroke-width="3" rx="3">
          <animateTransform attributeName="transform" type="translate" values="${pos.join(";")}" dur="6s" calcMode="discrete" repeatCount="indefinite"/></rect>
        <path d="M150 90 H186" stroke="${C.m}" stroke-width="2"/><path d="M180 84 L188 90 L180 96" fill="none" stroke="${C.m}" stroke-width="2"/>
        ${T(168, 80, "× filter", C.a, 10)}${o}
        ${T(76, 22, "image", C.m, 10)}${T(244, 40, "edges found", C.a, 10)}
        ${T(160, 168, "multiply 3×3 numbers, add up, write one pixel — repeat", C.i, 11, 'font-weight="600"')}`);
    },

    // layers: edges → shapes → objects
    layers: () => svg("Neural network layers see edges, then shapes, then whole objects", `
      ${[["edges", 40, C.c], ["shapes", 160, C.p], ["objects", 280, C.a]].map(([l, x, col], i) => `
        <g>${A("opacity", ".25;1;1;.25", 4.5, `keyTimes="0;${(i * .25 + .05).toFixed(2)};${(i * .25 + .35).toFixed(2)};1"`)}
          <rect x="${x - 46}" y="34" width="92" height="92" rx="12" fill="rgba(255,255,255,.05)" stroke="${col}" stroke-width="2"/>
          ${i === 0 ? `<path d="M${x - 30} 60 L${x - 6} 60 M${x + 8} 50 L${x + 8} 76 M${x - 28} 100 L${x - 10} 82 M${x + 4} 104 L${x + 30} 92" stroke="${col}" stroke-width="3"/>` : ""}
          ${i === 1 ? `<circle cx="${x - 18}" cy="70" r="13" fill="none" stroke="${col}" stroke-width="3"/><path d="M${x + 4} 96 L${x + 18} 66 L${x + 32} 96 Z" fill="none" stroke="${col}" stroke-width="3"/><path d="M${x - 30} 104 h22" stroke="${col}" stroke-width="3"/>` : ""}
          ${i === 2 ? T(x, 94, "🐱", C.i, 42) : ""}
          ${T(x, 146, l, col, 12, 'font-weight="700"')}</g>
        ${i < 2 ? `<path d="M${x + 50} 80 H${x + 70}" stroke="${C.m}" stroke-width="2"/>` : ""}`).join("")}
      ${T(160, 172, "each layer builds on the one before", C.i, 11, 'font-weight="600"')}`),

    // a pretrained network turns a photo into numbers; the nearest class wins
    embedding: () => {
      const r = rnd(9); let bars = "";
      for (let i = 0; i < 16; i++) { const h = 8 + r() * 40; bars += `<rect x="${150 + i * 6}" y="${92 - h}" width="4" height="${h}" fill="${C.c}">${A("height", `${h};${8 + r() * 40};${h}`, 2.5)}</rect>`; }
      return svg("A pretrained network turns each camera frame into a list of numbers; the closest class wins", glow + `
        <rect x="12" y="44" width="64" height="52" rx="8" fill="#000" stroke="${C.m}" stroke-opacity=".5"/>${T(44, 78, "🙂", C.i, 24)}
        ${T(44, 112, "camera", C.m, 10)}
        <path d="M84 52 L134 60 L134 84 L84 92 Z" fill="${C.d}" stroke="${C.v}" stroke-width="2" filter="url(#gl)"/>${T(109, 76, "Mobile", C.i, 9)}${T(109, 86, "Net", C.i, 9)}
        ${bars}${T(196, 108, "1 280 numbers", C.m, 10)}
        <rect x="160" y="124" width="66" height="22" rx="11" fill="rgba(34,228,255,.2)" stroke="${C.c}">${A("stroke-width", "1;3;1", 1.4)}</rect>${T(193, 139, "✋ 92%", C.i, 11)}
        <rect x="236" y="124" width="66" height="22" rx="11" fill="rgba(255,79,216,.1)" stroke="${C.p}"/>${T(269, 139, "👍 8%", C.m, 11)}
        ${T(160, 20, "it compares the numbers with your recorded examples", C.m, 11)}`);
    },

    // narrow training data → fails on different people
    bias: () => svg("Trained only on one kind of example, the AI fails on different ones", `
      <rect x="12" y="26" width="168" height="62" rx="10" fill="rgba(255,255,255,.05)" stroke="${C.m}" stroke-opacity=".35"/>
      ${T(96, 20, "training: one person, one room", C.m, 10)}
      ${[0, 1, 2, 3, 4].map((i) => T(36 + i * 30, 66, "🧑🏻", C.i, 22)).join("")}
      <rect x="208" y="26" width="100" height="62" rx="10" fill="rgba(255,90,110,.08)" stroke="${C.r}"/>
      ${T(258, 20, "test: someone new", C.m, 10)}${T(258, 66, "🧑🏾", C.i, 26)}
      <rect x="40" y="112" width="240" height="14" rx="7" fill="rgba(255,255,255,.08)"/>
      <rect x="40" y="112" width="120" height="14" rx="7" fill="${C.a}">${A("width", "120;40;210;90;120", 3)}</rect>
      ${T(160, 148, "😕 confused — it never saw anyone like this", C.a, 11, 'font-weight="700"')}
      ${T(160, 170, "narrow data → an unfair AI", C.i, 11, 'font-weight="600"')}`),

    // drawing labelled boxes
    boxes: () => svg("People draw boxes around objects and give each one a label", `
      <rect x="14" y="20" width="180" height="128" rx="10" fill="#1d1650"/>
      <rect x="14" y="110" width="180" height="38" fill="#2a2066"/>
      ${T(60, 114, "🚗", C.i, 34)}${T(150, 104, "🚶", C.i, 34)}
      <rect x="34" y="84" width="54" height="38" rx="3" fill="none" stroke="${C.c}" stroke-width="2.5" stroke-dasharray="190" stroke-dashoffset="190">${A("stroke-dashoffset", "190;0;0", 3)}</rect>
      <rect x="132" y="66" width="38" height="48" rx="3" fill="none" stroke="${C.p}" stroke-width="2.5" stroke-dasharray="190" stroke-dashoffset="190">${A("stroke-dashoffset", "190;190;0;0", 3)}</rect>
      <rect x="34" y="72" width="30" height="13" fill="${C.c}">${A("opacity", "0;1;1", 3)}</rect><text x="49" y="82" font-size="9" fill="#000" text-anchor="middle">car${A("opacity", "0;1;1", 3)}</text>
      <rect x="132" y="54" width="40" height="13" fill="${C.p}">${A("opacity", "0;0;1;1", 3)}</rect><text x="152" y="64" font-size="9" fill="#000" text-anchor="middle">person${A("opacity", "0;0;1;1", 3)}</text>
      <g font-family="JetBrains Mono, monospace" font-size="9" fill="${C.l}">${A("opacity", "0;0;1;1", 3, 'keyTimes="0;.6;.7;1"')}
        <text x="206" y="56">{ "car":</text><text x="214" y="70">[34, 84, 54, 38] },</text>
        <text x="206" y="90">{ "person":</text><text x="214" y="104">[132, 66, 38, 48] }</text></g>
      ${T(160, 170, "this is what a detection AI learns from", C.i, 11, 'font-weight="600"')}`),

    // many candidate boxes, keep the confident ones
    detect: () => svg("The detector proposes many boxes with a confidence each, and keeps the confident ones", `
      <rect x="14" y="20" width="200" height="130" rx="10" fill="#1d1650"/>
      ${T(70, 108, "🐶", C.i, 46)}${T(160, 100, "☕", C.i, 32)}
      ${[[34, 54, 74, 66, 92, C.l], [130, 70, 54, 42, 81, C.l], [24, 30, 50, 40, 22, C.m], [150, 30, 50, 34, 12, C.m], [96, 100, 50, 40, 31, C.m]].map(([x, y, w, h, s, col]) => `
        <g>${s > 50 ? "" : A("opacity", "1;1;0;0;1", 5, 'calcMode="discrete"')}
          <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${col}" stroke-width="${s > 50 ? 2.5 : 1.2}" stroke-dasharray="${s > 50 ? "" : "3 3"}"/>
          <text x="${x + 3}" y="${y + 11}" font-size="9" fill="${col}">${s}%</text></g>`).join("")}
      <rect x="226" y="28" width="12" height="114" rx="6" fill="rgba(255,255,255,.08)"/>
      <rect x="222" y="80" width="20" height="5" rx="2" fill="${C.a}"/>
      ${T(280, 60, "keep if", C.m, 10)}${T(280, 76, "≥ 50% sure", C.a, 12, 'font-weight="700"')}
      ${T(280, 112, "dog 92% ✓", C.l, 11)}${T(280, 128, "cup 81% ✓", C.l, 11)}
      ${T(160, 170, "low-confidence guesses are thrown away", C.i, 11, 'font-weight="600"')}`),

    // the MLP: pixels → hidden layers → 10 answers
    mlp: () => {
      const L = [[40, 5], [120, 4], [200, 4], [280, 5]];
      const node = (x, n, i) => 30 + (i + 1) * (120 / (n + 1));
      let e = "", s = "", nds = "";
      for (let l = 0; l < 3; l++) for (let i = 0; i < L[l][1]; i++) for (let j = 0; j < L[l + 1][1]; j++)
        e += `<line x1="${L[l][0]}" y1="${node(0, L[l][1], i)}" x2="${L[l + 1][0]}" y2="${node(0, L[l + 1][1], j)}" stroke="rgba(255,255,255,.1)"/>`;
      const cols = [C.c, C.v, C.p, C.a];
      for (let k = 0; k < 6; k++) {
        const a = k % 5, b = (k * 3) % 4, c = (k * 2 + 1) % 4, d = k % 5;
        s += `<circle r="3.2" fill="${cols[k % 4]}" filter="url(#gl)"><animateMotion dur="2.4s" begin="${k * .4}s" repeatCount="indefinite"
          path="M40 ${node(0, 5, a)} L120 ${node(0, 4, b)} L200 ${node(0, 4, c)} L280 ${node(0, 5, d)}"/></circle>`;
      }
      L.forEach(([x, n], l) => { for (let i = 0; i < n; i++) nds += `<circle cx="${x}" cy="${node(0, n, i)}" r="8" fill="${C.d}" stroke="${cols[l]}" stroke-width="2"/>`; });
      return svg("Pixels flow through hidden layers of neurons to ten answers", glow + e + s + nds + `
        ${T(40, 22, "pixels", C.c, 10)}${T(160, 22, "hidden layers", C.p, 10)}${T(280, 22, "0 … 9", C.a, 10)}
        <rect x="292" y="${node(0, 5, 3) - 6}" width="22" height="12" rx="3" fill="${C.l}">${A("opacity", ".3;1;.3", 1.2)}</rect>${T(303, node(0, 5, 3) + 4, "7", "#000", 10, 'font-weight="700"')}
        ${T(160, 172, "every connection is a number the AI tunes", C.i, 11, 'font-weight="600"')}`);
    },

    // learning curve: error goes down, accuracy goes up
    loss: () => svg("During training the error goes down and accuracy goes up", glow + `
      <path d="M40 20 V140 H300" fill="none" stroke="${C.m}" stroke-opacity=".5"/>
      ${T(170, 160, "epochs (rounds of studying) →", C.m, 10)}
      <path id="lc" d="M44 30 C 80 110, 120 122, 180 128 S 280 134, 296 134" fill="none" stroke="${C.p}" stroke-width="3" stroke-dasharray="320" stroke-dashoffset="320">${A("stroke-dashoffset", "320;0;0", 4)}</path>
      <path d="M44 130 C 80 60, 120 44, 180 38 S 280 32, 296 32" fill="none" stroke="${C.l}" stroke-width="3" stroke-dasharray="320" stroke-dashoffset="320">${A("stroke-dashoffset", "320;0;0", 4)}</path>
      ${T(260, 124, "error ↓", C.p, 12, 'font-weight="700"')}${T(260, 26, "accuracy ↑", C.l, 12, 'font-weight="700"')}
      ${T(160, 176, "each round: guess → check → nudge the numbers", C.i, 11, 'font-weight="600"')}`),

    // one neuron: weighted sum → squash
    neuron: () => svg("One neuron multiplies its inputs by weights, adds them up and squashes the result", glow + `
      ${[40, 80, 120].map((y, i) => `<circle cx="34" cy="${y}" r="10" fill="${C.d}" stroke="${C.c}" stroke-width="2"/>
        <line x1="44" y1="${y}" x2="146" y2="80" stroke="${[C.l, C.r, C.l][i]}" stroke-width="${[4, 1.5, 2.5][i]}">${A("stroke-opacity", ".4;1;.4", 1.6, `begin="${i * .3}s"`)}</line>
        ${T(92, y < 80 ? y + 10 : y - 4, ["×0.8", "×−0.3", "×0.5"][i], [C.l, C.r, C.l][i], 10)}`).join("")}
      <circle cx="160" cy="80" r="20" fill="${C.d}" stroke="${C.p}" stroke-width="2.5" filter="url(#gl)">${A("r", "19;22;19", 1.6)}</circle>${T(160, 85, "Σ", C.i, 16)}
      <path d="M184 80 H210" stroke="${C.m}" stroke-width="2"/>
      <path d="M214 110 C 240 110, 244 50, 270 50" fill="none" stroke="${C.a}" stroke-width="3"/>
      ${T(242, 128, "squash", C.a, 10)}
      <path d="M276 80 H300" stroke="${C.m}" stroke-width="2"/>${T(306, 84, "→", C.i, 12)}
      ${T(160, 168, "weights = how much each input matters (learned!)", C.i, 11, 'font-weight="600"')}`),

    // hide some data for the exam
    split: () => svg("Some data is hidden from the AI during training, then used as the exam", `
      ${Array.from({ length: 20 }, (_, i) => `<rect x="${18 + (i % 10) * 29}" y="${40 + Math.floor(i / 10) * 30}" width="24" height="24" rx="5" fill="${i % 10 >= 8 ? C.a : C.c}" fill-opacity="${i % 10 >= 8 ? .85 : .55}">${i % 10 >= 8 ? A("y", `${40 + Math.floor(i / 10) * 30};${40 + Math.floor(i / 10) * 30};${100 + Math.floor(i / 10) * 28};${100 + Math.floor(i / 10) * 28}`, 4) : ""}</rect>`).join("")}
      ${T(110, 30, "studies these (train)", C.c, 11, 'font-weight="700"')}${T(266, 30, "hidden", C.a, 11, 'font-weight="700"')}
      ${T(264, 166, "the exam it never saw", C.a, 11)}
      ${T(110, 154, "you don't grade a student", C.m, 10)}${T(110, 168, "on the questions they studied", C.m, 10)}`),

    // the threshold trade-off
    threshold: () => svg("Moving the threshold trades missed cancers against false alarms", `
      <rect x="20" y="64" width="280" height="10" rx="5" fill="url(#rg)"/>
      <defs><linearGradient id="rg"><stop offset="0" stop-color="${C.c}"/><stop offset="1" stop-color="${C.p}"/></linearGradient></defs>
      ${T(20, 92, "0% risk", C.m, 10, 'text-anchor="start"')}${T(300, 92, "100%", C.m, 10, 'text-anchor="end"')}
      ${cloud(110, 40, 12, 170, 30, C.c, 41)}${cloud(210, 40, 10, 170, 30, C.p, 43, "tri")}
      <line x1="160" y1="14" x2="160" y2="80" stroke="${C.a}" stroke-width="3">${A("x1", "160;100;100;230;230;160", 8)}${A("x2", "160;100;100;230;230;160", 8)}</line>
      <g>${A("opacity", "0;1;1;0;0;0", 8, 'calcMode="discrete"')}${T(160, 120, "slider LOW → catches almost every cancer 🚨", C.l, 11, 'font-weight="700"')}${T(160, 138, "…but many more false alarms ⚠️", C.a, 11)}</g>
      <g opacity="0">${A("opacity", "0;0;0;1;1;0", 8, 'calcMode="discrete"')}${T(160, 120, "slider HIGH → few false alarms ✓", C.l, 11, 'font-weight="700"')}${T(160, 138, "…but it misses real cancers 🚨", C.r, 11)}</g>
      ${T(160, 168, "no setting makes zero mistakes — people choose the trade-off", C.i, 11, 'font-weight="600"')}`),

    // two measurements, a boundary, a new patient
    scatter: () => svg("Patients plotted by two measurements; the AI draws a boundary; a new patient gets a risk", `
      <path d="M30 18 V146 H304" fill="none" stroke="${C.m}" stroke-opacity=".5"/>
      ${cloud(110, 104, 22, 130, 60, C.c, 51)}${cloud(220, 56, 18, 130, 60, C.p, 53, "tri")}
      <path d="M90 22 L260 146" stroke="${C.a}" stroke-width="2.5" stroke-dasharray="6 4"/>
      <g><animateTransform attributeName="transform" type="translate" values="0 0;60 -40;120 -20;0 0" dur="6s" repeatCount="indefinite"/>
        <circle cx="120" cy="104" r="9" fill="none" stroke="${C.i}" stroke-width="2"/>${T(120, 108, "?", C.i, 11, 'font-weight="700"')}</g>
      ${T(60, 164, "cell size →", C.m, 10)}${T(240, 30, "▲ malignant", C.p, 10)}${T(70, 30, "● benign", C.c, 10)}
      ${T(200, 164, "which side of the line?", C.i, 11, 'font-weight="600"')}`),

    // words counted in a bag, each word has a score
    bag: () => svg("Each word has a happy or sad score learned from labelled sentences; the scores are added up", glow + `
      ${[["I", 30, 0], ["love", 92, 2.2], ["this", 160, -.1], ["song", 226, -.3]].map(([w, x, sc], i) => `
        <g>${A("opacity", "0;1;1", 4, `begin="${i * .2}s"`)}
          <rect x="${x - 22}" y="22" width="${w.length * 9 + 26}" height="24" rx="12" fill="${sc > 1 ? "rgba(182,255,59,.2)" : "rgba(255,255,255,.08)"}" stroke="${sc > 1 ? C.l : C.m}" stroke-opacity=".7"/>
          ${T(x - 22 + (w.length * 9 + 26) / 2, 38, w, C.i, 12)}
          ${T(x - 22 + (w.length * 9 + 26) / 2, 62, (sc > 0 ? "+" : "") + sc, sc > 1 ? C.l : C.m, 10)}</g>`).join("")}
      <path d="M160 72 L160 92" stroke="${C.m}" stroke-width="2"/>
      ${T(160, 108, "add up:  +2.2 −0.1 −0.3 … = happy", C.i, 11, 'font-weight="700"')}
      <rect x="40" y="128" width="240" height="10" rx="5" fill="url(#mg)"/>
      <defs><linearGradient id="mg"><stop offset="0" stop-color="${C.r}"/><stop offset=".5" stop-color="${C.a}"/><stop offset="1" stop-color="${C.l}"/></linearGradient></defs>
      <circle cy="133" r="8" fill="${C.i}" filter="url(#gl)">${A("cx", "160;250;250", 3)}</circle>
      ${T(48, 158, "😡", C.i, 14)}${T(272, 158, "😍", C.i, 14)}`),

    // word order is lost
    negation: () => svg("Counting words loses their order, so 'not good' looks happy", `
      ${T(160, 30, "“this movie was not good”", C.i, 13, 'font-weight="700"')}
      ${[["not", 110, "±0"], ["good", 210, "+2.0"]].map(([w, x, sc]) => `
        <g><animateTransform attributeName="transform" type="translate" values="0 0;${w === "not" ? -40 : 40} 40;${w === "not" ? -40 : 40} 40" dur="4s" repeatCount="indefinite"/>
          <rect x="${x - 26}" y="44" width="52" height="24" rx="12" fill="rgba(255,255,255,.08)" stroke="${w === "good" ? C.l : C.m}"/>
          ${T(x, 60, w, C.i, 12)}${T(x, 82, sc, w === "good" ? C.l : C.m, 10)}</g>`).join("")}
      ${T(160, 140, "→ “happy” 🙂 … wrong!", C.a, 13, 'font-weight="700"')}
      ${T(160, 164, "it counts words but ignores their ORDER", C.i, 11, 'font-weight="600"')}`),

    // next-word probabilities
    nextword: () => svg("Given the last words, the model lists possible next words with probabilities and picks one", `
      ${T(70, 34, "Alice was", C.c, 15, 'font-weight="700"')}
      <rect x="128" y="20" width="58" height="22" rx="6" fill="none" stroke="${C.l}" stroke-dasharray="4 3">${A("opacity", ".3;1;.3", 1.2)}</rect>${T(157, 36, "???", C.l, 12)}
      ${[["not", 18, C.c], ["beginning", 12, C.p], ["very", 12, C.v], ["so", 6, C.a]].map(([w, pct, col], i) => `
        ${T(64, 72 + i * 22, w, C.i, 11, 'text-anchor="end"')}
        <rect x="72" y="${62 + i * 22}" width="0" height="13" rx="6" fill="${col}">${A("width", `0;${pct * 9};${pct * 9}`, 3)}</rect>
        ${T(84 + pct * 9, 72 + i * 22, pct + "%", C.m, 10, 'text-anchor="start"')}`).join("")}
      ${T(160, 170, "pick one, add it, repeat — that's writing", C.i, 11, 'font-weight="600"')}`),

    // how many words it looks back
    window: () => svg("The model only looks at the last one or two words", `
      ${[["the", 44], ["Rabbit", 100], ["took", 162], ["a", 212]].map(([w, x]) => T(x, 70, w, C.i, 15)).join("")}
      <rect x="196" y="50" width="32" height="30" rx="8" fill="none" stroke="${C.c}" stroke-width="2.5">
        <animate attributeName="x" values="196;140;140;196" dur="6s" repeatCount="indefinite" calcMode="discrete"/>
        <animate attributeName="width" values="32;88;88;32" dur="6s" repeatCount="indefinite" calcMode="discrete"/>
        <animate attributeName="stroke" values="${C.c};${C.p};${C.p};${C.c}" dur="6s" repeatCount="indefinite" calcMode="discrete"/></rect>
      <path d="M236 65 H258" stroke="${C.m}" stroke-width="2"/><path d="M252 59 L260 65 L252 71" fill="none" stroke="${C.m}" stroke-width="2"/>
      <rect x="264" y="50" width="46" height="30" rx="8" fill="rgba(182,255,59,.12)" stroke="${C.l}" stroke-dasharray="4 3"/>${T(287, 70, "?", C.l, 15, 'font-weight="700"')}
      <text x="160" y="112" fill="${C.c}" font-size="11" text-anchor="middle">1 word back: “a …” → hundreds of choices, wobbly${A("opacity", "1;0;0;1", 6, 'calcMode="discrete"')}</text>
      <text x="160" y="112" fill="${C.p}" font-size="11" text-anchor="middle" opacity="0">2 words back: “took a …” → much better guesses${A("opacity", "0;1;1;0", 6, 'calcMode="discrete"')}</text>
      ${T(160, 160, "ChatGPT looks back thousands of words", C.i, 11, 'font-weight="600"')}`),

    // a person labels data
    labeller: () => svg("A person puts the right label on each example — that is the training data", `
      ${[0, 1, 2].map((i) => `<rect x="${60 + i * 80}" y="40" width="60" height="60" rx="10" fill="rgba(255,255,255,.06)" stroke="${C.m}" stroke-opacity=".4"/>${T(90 + i * 80, 80, ["☀️", "🏠", "🌙"][i], C.i, 26)}`).join("")}
      ${[0, 1, 2].map((i) => `<g><animateTransform attributeName="transform" type="translate" values="${20 - i * 80} 90;0 0;0 0" dur="3.6s" begin="${i * .5}s" repeatCount="indefinite"/>
        <rect x="${66 + i * 80}" y="104" width="48" height="16" rx="8" fill="${[C.c, C.p, C.a][i]}"/>${T(90 + i * 80, 116, ["sun", "house", "moon"][i], "#000", 10)}</g>`).join("")}
      ${T(28, 150, "🧑‍💻", C.i, 24)}
      ${T(170, 160, "you are the data labeller — the AI learns your labels", C.i, 11, 'font-weight="600"')}`),

    // doodles compared with saved examples
    doodle: () => svg("A doodle is shrunk to a small grid of pixels and compared with the saved examples", glow + `
      <rect x="14" y="30" width="80" height="80" rx="8" fill="rgba(0,0,0,.4)" stroke="${C.m}" stroke-opacity=".4"/>
      <circle cx="54" cy="70" r="16" fill="none" stroke="${C.a}" stroke-width="3" stroke-dasharray="110" stroke-dashoffset="110">${A("stroke-dashoffset", "110;0;0", 3)}</circle>
      ${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const r = a * Math.PI / 180; return `<line x1="${54 + Math.cos(r) * 22}" y1="${70 + Math.sin(r) * 22}" x2="${54 + Math.cos(r) * 30}" y2="${70 + Math.sin(r) * 30}" stroke="${C.a}" stroke-width="2.5">${A("opacity", "0;0;1;1", 3)}</line>`; }).join("")}
      <path d="M100 70 H120" stroke="${C.m}" stroke-width="2"/>
      ${(() => { let g = ""; for (let y = 0; y < 6; y++) for (let x = 0; x < 6; x++) { const on = Math.hypot(x - 2.5, y - 2.5) < 2.2 && Math.hypot(x - 2.5, y - 2.5) > 1.2; g += `<rect x="${126 + x * 9}" y="${44 + y * 9}" width="8" height="8" fill="${on ? C.a : "rgba(255,255,255,.08)"}"/>`; } return g; })()}
      ${T(152, 112, "a few numbers", C.m, 10)}
      ${[["☀️", 92, C.c], ["🏠", 34, C.p], ["🌙", 51, C.a]].map(([e, s, col], i) => `${T(212, 50 + i * 30, e, C.i, 16)}
        <rect x="228" y="${40 + i * 30}" width="0" height="12" rx="6" fill="${col}">${A("width", `0;${s * .7};${s * .7}`, 3)}</rect>`).join("")}
      ${T(160, 160, "most similar saved drawings → the guess", C.i, 11, 'font-weight="600"')}`),

    // lots of data
    data: () => svg("AI needs huge numbers of labelled examples", `
      ${Array.from({ length: 60 }, (_, i) => `<rect x="${16 + (i % 15) * 19}" y="${24 + Math.floor(i / 15) * 22}" width="16" height="16" rx="3" fill="${[C.c, C.p, C.a, C.v][i % 4]}" fill-opacity=".55">${A("opacity", `0;0;1;1`, 4, `keyTimes="0;${(i / 70).toFixed(3)};${(i / 70 + .02).toFixed(3)};1"`)}</rect>`).join("")}
      ${T(160, 136, "COCO dataset: 200 000+ photos", C.a, 13, 'font-weight="700"')}${T(160, 154, "1.5 million boxes drawn by people", C.m, 11)}`),

    // your box vs the expert's: overlap score
    iou: () => svg("Your box and the expert's box overlap; the overlap is the score", `
      <rect x="20" y="20" width="170" height="130" rx="10" fill="#1d1650"/>${T(104, 110, "🚗", C.i, 54)}
      <rect x="54" y="52" width="104" height="76" fill="none" stroke="${C.l}" stroke-width="2.5"/>
      ${T(106, 46, "expert", C.l, 10)}
      <rect x="66" y="62" width="104" height="76" fill="${C.c}" fill-opacity=".18" stroke="${C.c}" stroke-width="2.5" stroke-dasharray="5 3">
        <animateTransform attributeName="transform" type="translate" values="22 16;0 0;0 0;22 16" dur="5s" repeatCount="indefinite"/></rect>
      ${T(118, 152, "you", C.c, 10)}
      <rect x="208" y="54" width="96" height="36" rx="10" fill="rgba(182,255,59,.12)" stroke="${C.l}"/>
      <text x="256" y="77" fill="${C.l}" font-size="13" text-anchor="middle" font-weight="700">overlap 58%${A("opacity", "1;0;0;1", 5, 'calcMode="discrete"')}</text>
      <text x="256" y="77" fill="${C.l}" font-size="13" text-anchor="middle" font-weight="700" opacity="0">overlap 85% ✓${A("opacity", "0;1;1;0", 5, 'calcMode="discrete"')}</text>
      ${T(256, 112, "box = x, y, w, h", C.m, 10, 'font-family="JetBrains Mono, monospace"')}${T(256, 126, "+ “car”", C.m, 10, 'font-family="JetBrains Mono, monospace"')}
      ${T(160, 172, "careful boxes → a careful AI", C.i, 11, 'font-weight="600"')}`),

    // something it never learned
    unknown: () => svg("Shown something it was never trained on, the detector still picks one of its 80 known things", `
      <rect x="16" y="22" width="130" height="110" rx="10" fill="#1d1650"/>${T(81, 96, "🦖", C.i, 56)}
      <rect x="30" y="40" width="102" height="78" fill="none" stroke="${C.a}" stroke-width="2" stroke-dasharray="4 3"/>
      <text x="34" y="36" fill="${C.a}" font-size="11">dog? 54%${A("opacity", ".4;1;.4", 1.6)}</text>
      <rect x="164" y="22" width="140" height="110" rx="10" fill="rgba(255,255,255,.04)" stroke="${C.m}" stroke-opacity=".3"/>
      ${T(234, 40, "the 80 things it knows", C.m, 10)}
      ${["🧑", "🚗", "🚲", "🐶", "🐱", "🐦", "🍌", "☕", "📱", "💻", "📖", "✂️", "🎒", "🪑", "⚽", "🍕"].map((e, i) => T(186 + (i % 4) * 32, 64 + Math.floor(i / 4) * 20, e, C.i, 14)).join("")}
      ${T(160, 160, "no 🦖 in its list → it guesses the closest thing it knows", C.i, 11, 'font-weight="600"')}
      ${T(160, 176, "an AI doesn't know what it doesn't know", C.a, 10)}`),

    // a sentence → mood meter
    mood: () => svg("A sentence goes in; a mood comes out", glow + `
      <rect x="20" y="24" width="280" height="34" rx="17" fill="rgba(255,255,255,.07)" stroke="${C.m}" stroke-opacity=".4"/>
      <text x="40" y="46" fill="${C.i}" font-size="13">I love this song${A("opacity", "1;1;0;0;1", 6, 'calcMode="discrete"')}</text>
      <text x="40" y="46" fill="${C.i}" font-size="13" opacity="0">school was so boring${A("opacity", "0;0;1;1;0", 6, 'calcMode="discrete"')}</text>
      <text x="160" y="112" font-size="40" text-anchor="middle">😀${A("opacity", "1;1;0;0;1", 6, 'calcMode="discrete"')}</text>
      <text x="160" y="112" font-size="40" text-anchor="middle" opacity="0">😞${A("opacity", "0;0;1;1;0", 6, 'calcMode="discrete"')}</text>
      <rect x="40" y="128" width="240" height="10" rx="5" fill="url(#mg2)"/>
      <defs><linearGradient id="mg2"><stop offset="0" stop-color="${C.r}"/><stop offset=".5" stop-color="${C.a}"/><stop offset="1" stop-color="${C.l}"/></linearGradient></defs>
      <circle cy="133" r="8" fill="${C.i}" filter="url(#gl)">${A("cx", "250;250;80;80;250", 6)}</circle>
      ${T(160, 164, "it learned which words sound happy or sad", C.i, 11, 'font-weight="600"')}`),

    // a story writes itself one word at a time
    story: () => svg("The model writes a story one predicted word at a time", `
      ${["Alice", "was", "beginning", "to", "get", "very", "tired"].map((w, i) => `
        <text x="${[24, 70, 104, 186, 210, 244, 282][i]}" y="${i < 4 ? 60 : 60}" fill="${i < 2 ? C.c : C.i}" font-size="14" opacity="${i < 2 ? 1 : 0}">${w}${i < 2 ? "" : A("opacity", "0;0;1;1", 7, `keyTimes="0;${(.1 + (i - 2) * .14).toFixed(2)};${(.12 + (i - 2) * .14).toFixed(2)};1"`)}</text>`).join("")}
      <rect x="20" y="78" width="280" height="2" fill="${C.m}" opacity=".3"/>
      ${T(160, 108, "each word = the model's pick for “what comes next?”", C.m, 11)}
      ${T(160, 132, "🔁 predict → add → predict → add …", C.l, 13, 'font-weight="700"')}
      ${T(160, 164, "the same loop that powers ChatGPT", C.i, 11, 'font-weight="600"')}`),

    // same device, rule-based vs learned
    twins: () => svg("A basic thermostat follows one rule; a smart one learns your weekly routine", `
      <rect x="12" y="22" width="140" height="118" rx="12" fill="rgba(255,197,61,.06)" stroke="${C.a}" stroke-width="1.5"/>
      ${T(82, 42, "🌡️ basic", C.a, 12, 'font-weight="700"')}
      <text x="26" y="78" fill="${C.i}" font-size="11" font-family="JetBrains Mono, monospace">IF &lt; 20 °C</text>
      <text x="26" y="96" fill="${C.i}" font-size="11" font-family="JetBrains Mono, monospace">THEN heat ON</text>
      ${T(82, 128, "⚙️ NOT AI — a rule", C.a, 11, 'font-weight="700"')}
      <rect x="168" y="22" width="140" height="118" rx="12" fill="rgba(34,228,255,.06)" stroke="${C.c}" stroke-width="1.5"/>
      ${T(238, 42, "🏠 smart", C.c, 12, 'font-weight="700"')}
      ${["M", "T", "W", "T", "F", "S", "S"].map((d, i) => { const h = [22, 24, 21, 25, 23, 10, 8][i]; return `
        <rect x="${182 + i * 17}" y="${104 - h}" width="11" height="${h}" rx="2" fill="${C.c}" opacity=".2">${A("opacity", ".2;.2;.9;.9", 4, `keyTimes="0;${(i * .1).toFixed(1)};${(i * .1 + .05).toFixed(2)};1"`)}</rect>
        ${T(187 + i * 17, 116, d, C.m, 8)}`; }).join("")}
      ${T(238, 132, "🧠 AI — learned your week", C.c, 11, 'font-weight="700"')}
      ${T(160, 164, "same job — different way of deciding", C.i, 11, 'font-weight="600"')}`),

    // confidence bars
    confidence: () => svg("The AI gives a confidence for every possible answer", `
      ${[["✋ hand", 78, C.c], ["👍 thumb", 15, C.p], ["🙂 face", 7, C.a]].map(([w, pct, col], i) => `
        ${T(70, 58 + i * 34, w, C.i, 12, 'text-anchor="end"')}
        <rect x="80" y="${46 + i * 34}" width="200" height="16" rx="8" fill="rgba(255,255,255,.08)"/>
        <rect x="80" y="${46 + i * 34}" width="0" height="16" rx="8" fill="${col}">${A("width", `0;${pct * 2};${pct * 2}`, 3)}</rect>
        ${T(296, 59 + i * 34, pct + "%", C.m, 11)}`).join("")}
      ${T(160, 160, "it never just knows — it gives probabilities", C.i, 11, 'font-weight="600"')}`),
  };

  const ACTS = {
    "ai-or-not": {
      emoji: "🤖", title: "AI or Not?",
      what: { art: "rules", text: "You sort everyday tech into “AI” and “not AI”. The test is simple: did the behaviour come from rules a person wrote, or was it learned from examples?" },
      how: { art: "examples", list: ["A normal program follows instructions written line by line.", "An AI is shown thousands of examples with answers.", "It finds the pattern itself — and uses it on new things."] },
      why: { art: "data", text: "Knowing which is which tells you what can go wrong: rules break when nobody wrote a rule for the situation; AI breaks when its examples were missing or unfair." },
      steps: [
        { at: ".zone.ai h2 > span:first-child", where: "append", label: "The AI box", art: "examples",
          do: "Drop a card here if you think it learned from data.", happens: "Its behaviour came from examples: emails, photos, voices, clicks.", why: "That's the definition of machine learning: learning from examples instead of following written rules." },
        { at: ".zone.not h2 > span:first-child", where: "append", label: "The Not-AI box", art: "rules",
          do: "Drop a card here if it just follows fixed rules.", happens: "A programmer wrote every rule: IF this THEN that.", why: "Rules are perfect for clear jobs (a calculator). They fail on fuzzy ones like “is this a cat?”." },
        { at: "#poolNote", where: "before", label: "Tricky cards", art: "twins",
          do: "Watch for tricky cards: smart vs. basic thermostat, GPS route vs. traffic time.", happens: "The same kind of device can be rule-based or AI-based — it depends on how it decides.", why: "“Smart” in the name doesn't make it AI. Ask: where did the decision come from?" },
      ],
    },

    teach: {
      emoji: "🎯", title: "Teach the Computer",
      what: { art: "examples", text: "You place labelled examples. The computer colours the whole board with its guess for every spot — without anyone writing a rule." },
      how: { art: "knn", list: ["Every spot on the board looks for its K nearest examples.", "Those neighbours vote.", "The winning label colours the spot. Repeat for every spot."] },
      why: { art: "outlier", text: "Similar things are usually near each other. That simple idea — called K-Nearest Neighbours — powers real recommendation and search systems." },
      steps: [
        { at: "aside h3", n: 0, where: "append", label: "Labels", art: "examples",
          do: "Pick a label (cat, dog, hamster) and tap the board.", happens: "Each tap is one training example: a position plus the right answer.", why: "AI learns from examples with answers. More, and more varied, examples → better guesses." },
        { at: "aside h3", n: 1, where: "append", label: "K", art: "kchoice",
          do: "Slide K from 1 to 15.", happens: "K is how many nearest neighbours get a vote.", why: "Small K follows every example (even mistakes); big K is calmer but can blur real details. You pick K — the AI can't." },
        { at: "#outlier", where: "before", label: "The weird one", art: "outlier",
          do: "Add a weird example in the wrong place.", happens: "With K = 1 it grabs its own little island. With bigger K its neighbours outvote it.", why: "Real data has mistakes. Looking at more neighbours makes the AI more robust to noise." },
      ],
    },

    doodle: {
      emoji: "✏️", title: "Doodle Trainer",
      what: { art: "labeller", text: "You draw and label sketches. The computer guesses what a new drawing is by comparing it with yours." },
      how: { art: "doodle", list: ["Your drawing is shrunk to a small grid of pixels — just numbers.", "It is compared with every saved drawing.", "The most similar ones decide the guess, with a confidence."] },
      why: { art: "confidence", text: "You were the data labeller — the most important (and most human) job in AI. A wrong label teaches the AI the wrong thing." },
      steps: [
        { at: "#save0", where: "before", label: "Save examples", art: "labeller",
          do: "Draw, then save it as ☀️, 🏠 or 🌙. Three of each is enough to start.", happens: "Each saved drawing becomes a labelled example.", why: "No examples → no learning. Varied examples (big, small, messy) → a smarter guesser." },
        { at: "main h3", n: 0, where: "append", label: "The live guess", art: "doodle",
          do: "Draw something new and watch the guess.", happens: "Your new drawing is compared with all saved ones; the closest win.", why: "It doesn't “understand” a sun — it only measures how similar the pixels are." },
        { at: "main h3", n: 1, where: "append", label: "Training data", art: "data",
          do: "If it guesses wrong, save the drawing with the right label.", happens: "The new example fixes that spot of confusion.", why: "That's how real AI improves: collect the mistakes, label them, train again." },
      ],
    },

    annotate: {
      emoji: "🔲", title: "Box Labeller",
      what: { art: "boxes", text: "You draw boxes around objects and name them — exactly how datasets for self-driving cars and object detectors are made." },
      how: { art: "iou", list: ["Draw a tight box around each object and pick its label.", "Each box is saved as 4 numbers (x, y, width, height) plus a name.", "Quality check: how much does your box overlap the expert's?"] },
      why: { art: "data", text: "Before an AI can find things in photos, people must label hundreds of thousands of them. Careful labels → a careful AI." },
      steps: [
        { at: "aside h3", n: 0, where: "append", label: "Your job", art: "boxes",
          do: "Drag a box around every object, then choose its label.", happens: "You create the “answer key” for this photo.", why: "A detector learns where things are by copying thousands of human-drawn boxes." },
        { at: "#compare", where: "before", label: "Compare with expert", art: "iou",
          do: "Compare your boxes with the expert's.", happens: "Your boxes are scored by how much they overlap.", why: "Labellers disagree! Sloppy or inconsistent boxes confuse the AI that learns from them." },
        { at: "aside h3", n: 1, where: "append", label: "What the AI receives", art: "boxes",
          do: "Look at the numbers under your boxes.", happens: "Each box is just x, y, width, height and a name.", why: "AI never sees “a car” — it sees numbers. Everything you did becomes data." },
      ],
    },

    pixels: {
      emoji: "👁️", title: "How a Computer Sees",
      what: { art: "pixels", text: "You see what a computer really receives from a camera: a grid of numbers. Then you apply the same filters the first layer of a neural network uses." },
      how: { art: "filter", list: ["Every pixel is three numbers: red, green, blue (0–255).", "A 3×3 filter multiplies the numbers around each pixel and adds them up.", "Different filters find edges, blur or sharpen."] },
      why: { art: "layers", text: "Neural networks for images stack hundreds of filters. Early layers find edges, later ones shapes, the last ones whole objects — and they learn the filter numbers themselves." },
      steps: [
        { at: "aside h3", n: 0, where: "append", label: "The picture", art: "pixels",
          do: "Use the camera, a sample or your own photo.", happens: "The image is cut into small squares — pixels.", why: "However clever the AI, its input is only this grid of numbers." },
        { at: "aside h3", n: 1, where: "append", label: "Filters", art: "filter",
          do: "Try Edges, Blur, Emboss, Sharpen.", happens: "A small 3×3 grid of numbers slides over the picture and makes a new one.", why: "Edges matter: outlines tell you what an object is. A network's first layer learns filters just like these." },
        { at: "aside h3", n: 2, where: "append", label: "Pixel size", art: "pixels",
          do: "Make the pixels bigger and smaller.", happens: "Fewer, bigger pixels = less detail = fewer numbers.", why: "AIs often shrink images to save work — but too small and the details that matter disappear." },
      ],
    },

    teachable: {
      emoji: "📸", title: "Train a Camera AI",
      what: { art: "confidence", text: "You teach a camera to recognise your own objects or gestures in seconds — by showing examples of each." },
      how: { art: "embedding", list: ["A big network (MobileNet), already trained on 1 million photos, turns each frame into a list of 1 280 numbers.", "Your recorded frames are saved as examples for each class.", "A new frame is compared with your examples; the closest class wins."] },
      why: { art: "bias", text: "Reusing a network trained by someone else is called transfer learning — it's why a few examples are enough. But it only knows what YOU showed it." },
      steps: [
        { at: "#start", where: "inline", label: "Camera", art: "pixels",
          do: "Start the camera (or test a photo).", happens: "Every frame becomes a grid of numbers.", why: "The AI never “sees” you — it sees numbers changing many times a second." },
        { at: "#classes", where: "before", label: "Record examples", art: "labeller",
          do: "Hold the button for each class while showing it different angles.", happens: "Each frame is saved as an example of that class.", why: "Variety beats quantity: different angles, distances and lights teach it what really matters." },
        { at: "#reset", where: "inline", label: "Live confidence", art: "confidence",
          do: "Show each thing and watch the bars.", happens: "It compares the live frame with your examples and shows how similar each class is.", why: "AI gives probabilities, not certainties. Low bars mean “I'm unsure”." },
        { at: ".notice[style*='--pink']", where: "append", label: "The bias experiment", art: "bias",
          do: "Train with one person in one spot, then test someone else or dim the lights.", happens: "It often fails: it learned the background and lighting too.", why: "This is how real AI becomes unfair: narrow training data. Who is in the data matters." },
      ],
    },

    detect: {
      emoji: "🔍", title: "Object Detector",
      what: { art: "detect", text: "A ready-trained AI finds and names objects in a live camera view, drawing a box around each one." },
      how: { art: "layers", list: ["A neural network looks at the whole picture through layers of filters: edges → shapes → objects.", "It proposes boxes and scores each one for 80 kinds of things.", "Boxes above your confidence threshold are kept and drawn."] },
      why: { art: "unknown", text: "It learned from 200 000+ photos boxed by people — the job you did in the Box Labeller. It can only name the 80 things it was trained on." },
      steps: [
        { at: "#start", where: "before", label: "Camera", art: "pixels",
          do: "Start the camera or use the sample photo.", happens: "Each frame goes through the detector several times a second.", why: "Speed matters: a self-driving car needs answers in milliseconds." },
        { at: "aside h3", n: 0, where: "append", label: "What it sees", art: "confidence",
          do: "Show it a phone, a cup, a book, a backpack.", happens: "It lists each object with a confidence.", why: "Show it something it never learned — it will guess one of its 80 things anyway. AI doesn't know what it doesn't know." },
        { at: "aside h3", n: 1, where: "append", label: "Threshold", art: "detect",
          do: "Move the confidence slider.", happens: "Low: more boxes, more mistakes. High: fewer boxes, but it misses things.", why: "Every AI system has this dial. Engineers choose it depending on what's worse: a miss or a false alarm." },
      ],
    },

    digits: {
      emoji: "🧠", title: "Build a Brain",
      what: { art: "mlp", text: "You design a real neural network, train it on 10 000 handwritten digits, and test it on your own handwriting." },
      how: { art: "neuron", list: ["Each pixel (784 of them) feeds the first layer.", "Each neuron multiplies inputs by weights, adds them up and squashes the result.", "Training nudges all the weights, round after round, to make fewer mistakes."] },
      why: { art: "loss", text: "Nobody tells the network what a “7” looks like. It discovers useful patterns in its hidden layers — that is deep learning." },
      steps: [
        { at: "main h3", n: 0, where: "append", label: "Design", art: "mlp",
          do: "Add or remove hidden layers and choose how many neurons each has.", happens: "More neurons = more numbers (weights) the network can tune.", why: "Bigger brains can learn more complex patterns — but train slower and can memorise instead of learn." },
        { at: "main h3", n: 1, where: "append", label: "Epochs", art: "loss",
          do: "Choose how many times it studies all 10 000 digits.", happens: "Each epoch: guess every digit, measure the error, adjust the weights.", why: "More study usually helps — until it starts memorising the training set." },
        { at: "main h3", n: 2, where: "append", label: "Watch it learn", art: "split",
          do: "Press Train and watch the chart.", happens: "The score is measured on 1 000 digits it never studied.", why: "An exam on unseen data is the only honest test. Memorising the answers isn't learning." },
        { at: "main h3", n: 3, where: "append", label: "Test it", art: "confidence",
          do: "Draw a digit and watch the 10 probabilities.", happens: "Your drawing is turned into 784 numbers and flows through your network.", why: "If your handwriting differs from the training digits, it struggles — the bias lesson again." },
      ],
    },

    medical: {
      emoji: "🩺", title: "AI Doctor's Assistant",
      what: { art: "scatter", text: "Using 569 real biopsies, you train an AI that estimates whether a tumour is benign or malignant — and decide how cautious it should be." },
      how: { art: "neuron", list: ["Each patient is two measurements of their cells.", "The AI multiplies each by a weight, adds them up and squashes the total into a risk from 0 to 100% (logistic regression).", "Training adjusts the weights until the risks match the real diagnoses — that draws the boundary line."] },
      why: { art: "threshold", text: "Two kinds of mistake — a missed cancer or a false alarm — are not equally bad. Choosing the trade-off is a human decision. The AI assists; a doctor decides." },
      steps: [
        { at: "aside h3", n: 0, where: "append", label: "Features", art: "scatter",
          do: "Choose which two measurements the AI looks at.", happens: "Some measurements separate the groups well, others barely.", why: "Choosing good features matters as much as the algorithm. Try “Use all 30”." },
        { at: "aside h3", n: 1, where: "append", label: "New patient", art: "scatter",
          do: "Drag the ❓ patient around the chart.", happens: "Its risk changes with its distance from the boundary.", why: "Close to the line = uncertain. That's where a doctor should look extra carefully." },
        { at: "aside h3", n: 2, where: "append", label: "Threshold", art: "threshold",
          do: "Move the threshold for saying “cancer”.", happens: "Lower → it catches more cancers but raises more false alarms. Higher → the reverse.", why: "There is no setting with zero mistakes. People must choose which mistake is worse." },
        { at: "aside h3", n: 3, where: "append", label: "Its mistakes", art: "split",
          do: "Read the four boxes: caught, missed, false alarm, cleared.", happens: "These are patients it never saw during training.", why: "Accuracy alone hides the dangerous error. Always ask: which mistakes, and how many?" },
      ],
    },

    sentiment: {
      emoji: "😀", title: "Mood Reader",
      what: { art: "mood", text: "Type a sentence and the AI guesses whether it's happy or sad, showing how much each word pushed the mood." },
      how: { art: "bag", list: ["It learned a score for each word from sentences people labelled happy or sad.", "Your sentence is split into words.", "The word scores are added up: the total is the mood."] },
      why: { art: "negation", text: "It only counts words, ignoring their order — so “not good” and sarcasm fool it. Big language models fix this by reading words in context." },
      steps: [
        { at: "main h3", n: 0, where: "append", label: "Word scores", art: "bag",
          do: "Look at the green and red words.", happens: "Each word's colour is its learned score.", why: "“love” is happy only because people used it in happy sentences — the AI learned it from data." },
        { at: "main h3", n: 1, where: "append", label: "Teach it", art: "labeller",
          do: "Label the sentence as happy or sad.", happens: "Every word in it gets nudged towards that mood. It retrains instantly.", why: "You are adding training data. Label it wrong on purpose and watch it learn the wrong thing!" },
        { at: "main h3", n: 2, where: "append", label: "Top words", art: "bag",
          do: "See which words it thinks are the most happy and sad.", happens: "These are the words with the biggest learned scores.", why: "Checking what a model learned is how people catch mistakes and bias in AI." },
      ],
    },

    nextword: {
      emoji: "💬", title: "Mini ChatGPT",
      what: { art: "story", text: "A tiny language model writes Alice-in-Wonderland-style text one word at a time, by predicting what usually comes next." },
      how: { art: "nextword", list: ["It counted which words follow which in the whole book.", "Given the last word(s), it lists the possible next words with probabilities.", "It picks one, adds it, and repeats."] },
      why: { art: "window", text: "That is exactly how ChatGPT writes — but it looks back thousands of words with a giant neural network trained on trillions. It picks LIKELY words, not TRUE ones — which is why chatbots can invent facts." },
      steps: [
        { at: "aside h3", n: 0, where: "append", label: "Look back", art: "window",
          do: "Switch between looking back 1 word and 2 words.", happens: "With 2 words it knows more context, so its choices fit better.", why: "More context = more sensible text. Modern models read thousands of words of context." },
        { at: "aside h3", n: 1, where: "append", label: "What it read", art: "data",
          do: "Use Alice in Wonderland, or paste your own text.", happens: "It counts word pairs in whatever you give it.", why: "A model can only sound like what it read. Feed it song lyrics and it writes lyrics." },
        { at: "#cands", where: "before", label: "Next-word bars", art: "nextword",
          do: "Click a word, or press Auto-write.", happens: "The bars are probabilities: how often each word came next in the book.", why: "The creativity slider (temperature) decides whether it always takes the top word or sometimes a surprising one." },
      ],
    },
  };

  window.INTUITION = { ART, ACTS };
})();
