# Can a Computer Learn? — a 1-hour AI workshop for high schools

A hands-on, highly visual introduction to **AI and machine learning** for
students aged roughly 14–18. No coding, no maths, no installs: the slides and
all seven activities run in the browser, and students can open the activities
on their own phones via a QR code.

**▶ Live site:** `https://USER.github.io/ai-workshop-highschool/` (after the
first deploy — see below)

| | |
|---|---|
| **Audience** | High-school students, no background needed |
| **Duration** | 60 minutes |
| **Format** | Presenter drives a slide deck with live activities embedded; students come up to the screen or follow on their phones |
| **Needs** | A laptop with Chrome/Edge/Firefox, a webcam, a projector, internet for the fonts/libraries (the AI models ship with the site) |

## What students do

| Time | Activity | Idea it lands |
|---|---|---|
| 0:03 | 🤖 **AI or Not?** — drag everyday tech into two boxes | AI *learns from examples*; normal programs *follow rules* |
| 0:13 | 🎯 **Teach the Computer** — tap to place cats/dogs/hamsters, watch the decision map paint itself | Machine learning = generalising from examples; one weird example, K neighbours |
| 0:21 | ✏️ **Doodle Trainer** — draw, label, train, test | Humans label the data; more/better examples → better AI |
| 0:25 | 🔲 **Box Labeller** — draw bounding boxes, compare to the expert | How computer-vision datasets are made |
| 0:29 | 👁️ **How a Computer Sees** — webcam → pixels → numbers → edge filters | An image is numbers; neural nets learn filters |
| 0:37 | 📸 **Train a Camera AI** — Teachable-Machine-style, 3 classes, live bars | Deep learning in 30 s — and **bias** when the data is narrow |
| 0:46 | 🔍 **Object Detector** — COCO-SSD boxes on the live camera | A real model; it only knows what it was trained on |

Full minute-by-minute plan: **[docs/WORKSHOP-PLAN.md](docs/WORKSHOP-PLAN.md)**.
Before the session: **[docs/PREFLIGHT.md](docs/PREFLIGHT.md)**.

## Presenting

Open the site, press **F** for fullscreen and **S** for the speaker view
(timings and what to say are in the notes of every slide).

- **→ / ←** or a clicker changes slides — even after you clicked inside an
  activity (activities forward navigation keys to the deck).
- Each activity slide has a **⏱ timer** (click to start/pause, double-click to
  reset) and an **↗ open** button to pop the activity out in its own tab.
- Activities load only while their slide is showing, so the webcam light goes
  off when you move on.
- Nothing is sent anywhere: all AI runs locally in the browser.

## Run it locally

```bash
python -m http.server -d site 8000
# open http://localhost:8000
```

The camera only works on `https://` or `http://localhost` — opening
`site/index.html` as a file shows the friendly "no camera" fallbacks instead.

## Deploy (GitHub Pages)

1. Create an empty repository on GitHub, e.g. `ai-workshop-highschool`, then:
   ```bash
   git remote add origin git@github.com:USER/ai-workshop-highschool.git
   git push -u origin main
   ```
2. On GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` runs on every push to `main`:
   `tools/check_site.py` verifies every local link, that every CDN script is
   pinned to an exact version and that the bundled models are complete, then
   publishes `site/`. Pull requests run the check only.
4. Replace `USER` in this README with your GitHub username.

## Layout

```
site/
├── index.html            the deck (reveal.js 5, layout disabled → responsive CSS)
├── css/theme.css         design tokens + shared components (deck AND activities)
├── css/deck.css          slide layouts
├── js/fx.js              confetti, particles, camera helper, key forwarding
├── js/deck.js            reveal setup, lazy iframes, timers, QR, neural-net animation
├── play/                 the 7 activities + a hub page (index.html)
├── img/street.svg        original illustration for the labeller / fallbacks
└── models/               MobileNet v2 + COCO-SSD lite (TF.js), served locally
tools/check_site.py       the CI check
docs/                     workshop plan and preflight checklist
```

No build step. Edit a file, refresh the browser.

## License

Content **CC BY 4.0**, code **MIT**, bundled models Apache 2.0 — see [LICENSE](LICENSE).
