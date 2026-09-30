# Can a Computer Learn? — Workshop Plan

**Presenter:** Dr. Rachid Zeghlache — Associate Professor of Artificial Intelligence, American University in Dubai

| | |
|---|---|
| **Audience** | High-school students (≈14–18), no programming or maths needed |
| **Duration** | 60 minutes, no break |
| **Group size** | Works for 10–35. Above ~25, rely more on volunteers at the screen and on phones |
| **Format** | One presenter laptop + projector + webcam. Students come to the screen; optionally follow on phones via the QR code |
| **Goal** | Students leave able to say, in their own words: *AI learns from examples, the examples come from people, and AI can be wrong* — and know that every AI they saw is a few lines of Python |

## Design principles

| Principle | In practice |
|---|---|
| **Do before define** | Every idea is met in an activity first, then named. The game comes before the definition of AI. |
| **Their hands on it** | Eleven activities; at least two different students touch every one you run. |
| **Always visible** | Nothing on a slide that could be a picture is text. Big type, neon on dark, readable from the back. |
| **Never a dead screen** | Every activity has a fallback (sample image, photo upload, offline data). |
| **Honest about limits** | Bias, hallucinations, "it only knows its data" and "which mistake is worse?" are shown live, not lectured. |
| **The code is never hidden** | Every activity has a **🐍 Python** button: the same AI in 7–16 lines, every step explained, runnable in Colab. |

## The shape of the hour

Eleven activities do not fit in 60 minutes at full depth, so the deck has a
**core path** (⭐, what the timings below assume) and two **🎁 bonus stations**
that you skip with → unless the room is fast or students have devices.
The bonus slides carry a 🎁 badge in their header.

```
⭐ Hook · AI or Not? · Rules vs learning · AI ⊃ ML ⊃ DL        0:00 – 0:11   "what is AI?"
⭐ Teach the Computer · Doodle Trainer   (🎁 Box Labeller)      0:11 – 0:21   learning from labelled examples
⭐ How a Computer Sees · neural net · Build a Brain             0:21 – 0:33   deep learning, hands-on
⭐ Train a Camera AI · bias               (🎁 Object Detector)  0:33 – 0:40   computer vision + fairness
⭐ Can a computer read? · Mood Reader · Mini ChatGPT            0:40 – 0:49   language (NLP)
⭐ AI Doctor's Assistant                                        0:49 – 0:54   real data, real stakes
⭐ What can AI do · limits · takeaways · careers · tools · …    0:53 – 1:00   wrap
```

## Minute by minute

| Time | # | Slide | Activity | Do this | Land this |
|---|---|---|---|---|---|
| **0:00** | 1 | Title | — | Welcome; "in an hour you'll train seven AIs yourselves". | Energy. |
| **0:01** | 2 | Who used AI today? | Hands up | Ask first, then reveal the four cards. | AI is everywhere, invisible. |
| **0:03** | 3 | ⭐ **AI or Not?** | Drag & drop, 12 cards | Students come up or the room votes; read each explanation. | AI **learns from examples**; programs **follow rules**. |
| **0:08** | 4 | Rules vs learning | Animated diagram | Left panel, then click for the right. | ML flips it: data + answers → rules. |
| **0:10** | 5 | AI ⊃ ML ⊃ DL | Nested circles | One ring per click. | The words, and how they nest. |
| **0:11** | 6 | ⭐ **Teach the Computer** | KNN on a canvas | 1 cat + 1 dog → board splits. 🎲 starter data, hover. K=1 + 😈 weird one → island. K=7 → gone. | No one wrote the map. Change the examples, change the AI. |
| **0:17** | 7 | Where do examples come from? | — | 30 seconds. | People label data. |
| **0:17** | 8 | ⭐ **Doodle Trainer** | Draw, label, train | 3 volunteers × 3 drawings; a 4th student tests. | Labelling = teaching. |
| — | 9 | 🎁 **Box Labeller** | Bounding boxes | *Bonus (3–4 min).* Room calls out the 6 objects; compare with expert. | How self-driving-car data is made. |
| **0:21** | 10 | ⭐ **How a Computer Sees** | Webcam → pixels → filters | Pixel slider up: numbers. ✴️ Edges, wave a hand. Two filters is enough. | A picture is only numbers; filters find edges. |
| **0:25** | 11 | Layers of filters | Animated neural net | One sentence per layer. | "Deep" = many layers. |
| **0:26** | 12 | ⭐ **Build a Brain** | MLP on MNIST, trained live | Train 64 → 32 (~10 s, ~95 %). A student draws digits. Race: *no layers* (~91 %) vs *big brain* (~95 %) — the 🏆 table keeps score. Tap a digit it got wrong. | A neural network is layers of numbers that **learn**. More layers: more to learn, slower, still fallible. |
| **0:33** | 13 | ⭐ **Train a Camera AI** | MobileNet + KNN | One volunteer, ~30 pictures per class; then swap person / dim lights; then fix it with more examples. | Deep learning in 30 s — and **bias** from narrow data. |
| **0:38** | 14 | An AI only knows its data | Gender Shades | Link the demo to the real study. | Who builds AI matters. |
| — | 15 | 🎁 **Object Detector** | COCO-SSD live | *Bonus (3 min).* Phone, bottle, cup; then something it doesn't know. | Confidence ≠ correctness. |
| **0:40** | 16 | Can a computer read? | — | 30 seconds. | Words become numbers too. |
| **0:40** | 17 | ⭐ **Mood Reader** | Naive Bayes sentiment | Room suggests sentences; point at the green/red words. Then the pink traps: "not good", sarcasm. Teach it one sentence. | It counts words — it doesn't *understand*. |
| **0:44** | 18 | ⭐ **Mini ChatGPT** | n-gram next-word model | Click top words; ✨ Auto-write; 👀 1 vs 👀👀 2 words; 🥶↔🤪 creativity; paste their own text. | ChatGPT = predict the next word, again and again, with a giant brain. It picks *likely* words, not *true* ones. |
| **0:49** | 19 | ⭐ **AI Doctor's Assistant** | Logistic regression on 569 biopsies | 🧠 Train (the line swings in). Drag the ❓ patient. Threshold 50 % → 20 %: missed cancers ↓, false alarms ↑. 🔬 all 30 measurements. | Which mistake is worse? **People** choose the trade-off. The AI assists — a doctor decides. |
| **0:53** | 20 | What can AI do? | 8 cards | Pick 3–4 cards. | Medicine, science, climate, accessibility… |
| **0:54** | 21 | Watch out for | 4 cards | Tie each to a moment from today. | Hallucinations, deepfakes, bias, privacy. |
| **0:55** | 22 | Three takeaways | — | Students say each one before you click. | Examples · data · critical thinking. |
| **0:56** | 23 | Jobs in AI — and AI in every job | 8 career cards | "Which card would *you* pick?" | ML engineer, data scientist, researcher, vision, language AI, healthcare, robotics, ethics — plus AI + any field. |
| **0:57:30** | 24 | The tools to master, step by step | 8-step path | Don't read all eight — the order is the message. | Maths → Python/Colab → NumPy/pandas → scikit-learn → PyTorch/Keras → Hugging Face → Git/GitHub → Kaggle. One project a month. |
| **0:58:30** | 25 | Every AI in a few lines of Python | 11 cards | Tap *Build a Brain* to show the code. | You can build these. Colab link. |
| **0:59** | 26 | Keep playing | QR code | Leave it up while phones scan. | Where to go next. |
| **1:00** | 27 | Thank you | Confetti | Questions; "what would you teach an AI?" | — |

## 🐍 "Show me the Python"

Every activity slide has a **🐍 Python** button (and every activity page a
**🐍 Show me the Python** button). It opens the program that builds that AI:

- 7–16 real lines of code, every step numbered ❶ ❷ ❸ and explained in plain words;
  hover a step chip to spotlight its lines;
- the libraries real engineers use: scikit-learn, TensorFlow/Keras, Ultralytics YOLO, plain Python;
- **📋 Copy** and **▶ Run it in Colab** — the notebook
  [`notebooks/try-it-in-python.ipynb`](../notebooks/try-it-in-python.ipynb)
  holds all eleven programs, runs with no install, and needs no webcam.

Use it for 20 seconds on one or two activities (Build a Brain is the
crowd-pleaser), and point to slide 23 for the rest. The code shown and the
notebook are generated from one file, `tools/python_snippets.py` — edit that,
then run `python tools/build_python.py`.

## Timing triage — cut in this order if running late

| Order | Cut | Saves |
|---|---|---|
| 1 | Skip both 🎁 bonus slides (already the default) | — |
| 2 | Slide 11 (neural net animation) — one sentence on slide 10 instead | 1 min |
| 3 | Build a Brain: one training run, skip the race | 3 min |
| 4 | Mood Reader: two sentences + one trap only | 2 min |
| 5 | "What can AI do?" — 2 cards | 1 min |
| 6 | Tools slide: show it, name steps 2–4, move on | 30 s |
| **Never cut** | AI or Not · Teach the Computer · Train a Camera AI **with the bias moment** · Mini ChatGPT · the "which mistake is worse?" moment | — |

**Ahead of schedule?** Run a 🎁 bonus station, or let students open the QR code
and race each other on *Build a Brain* — best test score wins.

## Materials

- Laptop with a recent Chrome or Edge (Firefox and Safari also work), webcam, charger
- Projector (1920×1080 or 1280×720 both fine — the deck is responsive)
- A few props for the detector: phone, bottle, cup, book, backpack, scissors
- Optional: a clicker; a second screen for the speaker view (press **S**)

## Room setup

- Laptop at the front, **webcam facing the volunteers** so the camera demos see one person clearly.
- Good, even light on the volunteer spot — then you can *switch it off* for the bias moment.
- A clear path to the screen for students coming up to drag cards and draw digits and doodles.

## Fallbacks

| Problem | What happens | What you do |
|---|---|---|
| Camera blocked / missing | A friendly message explains how to allow it; **pixels** switches to a sample picture, **camera AI** offers "📁 Add photos" per class, **detector** offers 🖼️ Sample and 📁 Photo | Use the fallback. |
| Model slow to load | Spinner, then a message after 45 s; if the model arrives later the activity switches on by itself | Talk through the idea; come back to it. |
| TensorFlow.js (CDN) unreachable | **Build a Brain** shows a notice but students can still design layers and see how many numbers the brain would learn; the 🐍 button still works | Show the Python instead. |
| No internet at all | Fonts, reveal.js and TF.js come from CDNs. **Teach the Computer, Doodle Trainer, Box Labeller, AI or Not, Mood Reader, Mini ChatGPT and AI Doctor** are pure JS with their data bundled on the site, so they work once loaded | See PREFLIGHT: open every slide once while online so the browser caches the libraries. |
| Clicker stops working after clicking into an activity | It shouldn't — activities forward arrow keys to the deck | Click on the slide title, then use the clicker. |

## Data used

| Activity | Data | Source · licence |
|---|---|---|
| Build a Brain | 10,000 training + 1,000 test handwritten digits, balanced by digit | MNIST — LeCun, Cortes & Burges · CC BY-SA 3.0 (`tools/build_mnist.py`) |
| AI Doctor's Assistant | 569 biopsies, 30 measurements, 25 % held out for testing | Breast Cancer Wisconsin (Diagnostic), UCI · CC BY 4.0 (`tools/build_medical.py`) |
| Mini ChatGPT | *Alice's Adventures in Wonderland* (1865) | Project Gutenberg · public domain (`tools/build_corpus.py`) |
| Mood Reader | 179 short sentences written for this workshop | CC BY 4.0 |

## Success criteria

| Measure | Target |
|---|---|
| Students who touched at least one activity at the screen or on their phone | > 50 % |
| Can answer "how is AI different from a normal program?" at the end | > 80 % (thumbs check on slide 22) |
| Can name one limit of AI | > 70 % |
| Can say which mistake is worse in the medical demo, and why | > 60 % |
