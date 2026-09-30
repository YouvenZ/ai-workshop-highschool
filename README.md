# Can a Computer Learn? — a 1-hour AI workshop for high schools

A hands-on, highly visual introduction to **AI and machine learning** for
students aged roughly 14–18, presented by **Dr. Rachid Zeghlache**, Associate Professor of Artificial
Intelligence at the American University in Dubai. No coding,
no maths, no installs: the slides and all eleven activities run in the browser,
and students can open the activities on their own phones via a QR code.

Every activity has a **🐍 Show me the Python** button: the same AI as a short,
fully explained Python program (7–16 lines), which students can run for free in
[Google Colab](https://colab.research.google.com/github/YouvenZ/ai-workshop-highschool/blob/main/notebooks/try-it-in-python.ipynb).

**▶ Live site:** <https://youvenz.github.io/ai-workshop-highschool/> ·
**🧪 Activities:** <https://youvenz.github.io/ai-workshop-highschool/play/>

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
| 0:11 | 🎯 **Teach the Computer** — tap to place cats/dogs/hamsters, watch the decision map paint itself | Machine learning = generalising from examples; one weird example, K neighbours |
| 0:17 | ✏️ **Doodle Trainer** — draw, label, train, test | Humans label the data; more/better examples → better AI |
| 🎁 | 🔲 **Box Labeller** — draw bounding boxes, compare to the expert | How computer-vision datasets are made |
| 0:21 | 👁️ **How a Computer Sees** — webcam → pixels → numbers → edge filters | An image is numbers; neural nets learn filters |
| 0:26 | 🧠 **Build a Brain** — design a neural network (0–3 layers, 4–128 neurons), train it live on 10,000 handwritten digits, draw your own | Deep learning: layers of numbers that learn. Watch neurons light up |
| 0:33 | 📸 **Train a Camera AI** — Teachable-Machine-style, 3 classes, live bars | Deep learning in 30 s — and **bias** when the data is narrow |
| 🎁 | 🔍 **Object Detector** — COCO-SSD boxes on the live camera | A real model; it only knows what it was trained on |
| 0:40 | 😀 **Mood Reader** — type a sentence, every word votes happy or sad; teach it new ones | Language → numbers; it counts words, so "not good" and sarcasm fool it |
| 0:44 | 💬 **Mini ChatGPT** — a next-word model trained on *Alice in Wonderland* (or your own text) | How ChatGPT writes: predict the next word, repeat. Likely ≠ true |
| 0:49 | 🩺 **AI Doctor's Assistant** — 569 real biopsies, a live decision boundary, a threshold slider and a confusion matrix | Which mistake is worse? The AI assists — a doctor decides |

⭐ = core path (60 min). 🎁 = bonus stations, skipped unless the room is fast.

Full minute-by-minute plan: **[docs/WORKSHOP-PLAN.md](docs/WORKSHOP-PLAN.md)**.
Before the session: **[docs/PREFLIGHT.md](docs/PREFLIGHT.md)**.

## Presenting

Open the site, press **F** for fullscreen and **S** for the speaker view
(timings and what to say are in the notes of every slide).

- **→ / ←** or a clicker changes slides — even after you clicked inside an
  activity (activities forward navigation keys to the deck).
- Each activity slide has a **⏱ timer** (click to start/pause, double-click to
  reset), a **🐍 Python** button and an **↗ open** button to pop the activity
  out in its own tab.
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
   git remote add origin git@github.com:YouvenZ/ai-workshop-highschool.git
   git push -u origin main
   ```
2. On GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` runs on every push to `main`:
   `tools/check_site.py` verifies every local link, that every CDN script is
   pinned to an exact version, that the bundled models are complete and that
   every activity has its 🐍 Python panel; `tools/build_python.py --check`
   verifies the snippets and notebook are in sync. Then it publishes `site/`.
   Pull requests run the checks only.
4. Forking it to another account? Replace `YouvenZ` in this README.

## Layout

```
site/
├── index.html            the deck (reveal.js 5, layout disabled → responsive CSS)
├── css/theme.css         design tokens + shared components (deck AND activities)
├── css/deck.css          slide layouts
├── js/fx.js              confetti, particles, camera helper, key forwarding
├── js/deck.js            reveal setup, lazy iframes, timers, QR, neural-net animation, Python grid
├── js/python-panel.js    the 🐍 "Show me the Python" panel (one component, used everywhere)
├── js/python-snippets.js GENERATED — the Python programs the panel shows
├── play/                 the 11 activities + a hub page (index.html)
├── data/                 MNIST subset, breast-cancer data, Alice in Wonderland
├── img/street.svg        original illustration for the labeller / fallbacks
└── models/               MobileNet v2 + COCO-SSD lite (TF.js), served locally
notebooks/
└── try-it-in-python.ipynb   GENERATED — all eleven programs, runnable in Colab
tools/
├── python_snippets.py    ONE source for the 🐍 panel and the notebook — edit this
├── build_python.py       → site/js/python-snippets.js + the notebook (--check in CI)
├── build_mnist.py        → site/data/mnist_*          (downloads MNIST)
├── build_medical.py      → site/data/breast_cancer.json (from scikit-learn)
├── build_corpus.py       → site/data/alice.txt        (from Project Gutenberg)
└── check_site.py         the CI check
docs/                     workshop plan and preflight checklist
```

No build step for the site. Edit a file, refresh the browser. The only
generated files are the Python snippets/notebook (`python tools/build_python.py`)
and the bundled datasets (the three `tools/build_*.py` data scripts).

## License

Content **CC BY 4.0**, code **MIT**, bundled models Apache 2.0. Data: MNIST
(LeCun, Cortes & Burges, CC BY-SA 3.0), Breast Cancer Wisconsin (UCI, CC BY 4.0),
*Alice's Adventures in Wonderland* (public domain) — see [LICENSE](LICENSE).
