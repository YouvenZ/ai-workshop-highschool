# Can a Computer Learn? — Workshop Plan

| | |
|---|---|
| **Audience** | High-school students (≈14–18), no programming or maths needed |
| **Duration** | 60 minutes, no break |
| **Group size** | Works for 10–35. Above ~25, rely more on volunteers at the screen and on phones |
| **Format** | One presenter laptop + projector + webcam. Students come to the screen; optionally follow on phones via the QR code |
| **Goal** | Students leave able to say, in their own words: *AI learns from examples, the examples come from people, and AI can be wrong* |

## Design principles

| Principle | In practice |
|---|---|
| **Do before define** | Every idea is met in an activity first, then named. The game comes before the definition of AI. |
| **Their hands on it** | Seven activities; at least two different students touch every one. |
| **Always visible** | Nothing on a slide that could be a picture is text. Big type, neon on dark, readable from the back. |
| **Never a dead screen** | Every activity has a fallback (sample image, photo upload, offline activity). |
| **Honest about limits** | Bias, hallucinations and "it only knows its data" are shown live, not lectured. |

## Minute by minute

| Time | Slide | Activity | Do this | Land this |
|---|---|---|---|---|
| **0:00** | 1 — Title | — | Welcome; "in an hour you'll train three AIs yourselves". | Energy. |
| **0:01** | 2 — Who used AI today? | Hands up | Ask first, then reveal the four cards. | AI is everywhere, invisible. |
| **0:03** | 3 — **AI or Not?** | Drag & drop, 12 cards | Students come up or the room votes; read each explanation. | AI **learns from examples**; programs **follow rules**. |
| **0:09** | 4 — Rules vs learning | Animated diagram | Left panel, then click for the right. | ML flips it: data + answers → rules. |
| **0:11** | 5 — AI ⊃ ML ⊃ DL | Nested circles, 3 clicks | One ring per click. | The words they'll hear, and how they nest. |
| **0:13** | 6 — **Teach the Computer** | KNN on a canvas | 1 cat + 1 dog → whole board splits. 🎲 starter data, hover to see neighbours vote. K=1 + 😈 weird one → island. K=7 → gone. | No one wrote the map. Change the examples, change the AI. |
| **0:21** | 7 — Where do examples come from? | — | 30 seconds. | People label data. |
| **0:21** | 8 — **Doodle Trainer** | Draw, label, train | 3 volunteers × 3 drawings each; a 4th student tests. Wrong? Save it with the right label. | Labelling = teaching. More, better data → better AI. |
| **0:25** | 9 — **Box Labeller** | Bounding boxes | Room calls out the 6 objects; 👁️ Compare with expert. | This is how self-driving car data is made. Sloppy boxes → sloppy AI. |
| **0:29** | 10 — **How a Computer Sees** | Webcam → pixels → filters | Pixel slider up: numbers appear. ✴️ Edges, wave a hand. | A picture is only numbers; filters find edges. |
| **0:36** | 11 — Layers of filters | Animated neural net | One sentence per layer. | "Deep" = many layers: edges → shapes → objects. |
| **0:37** | 12 — **Train a Camera AI** | MobileNet + KNN, 3 classes | One volunteer, ~30 pictures per class. Then swap person / move away / dim lights. Then add examples of the new person. | Deep learning in 30 s — and **bias** from narrow data. |
| **0:44** | 13 — An AI only knows its data | Gender Shades statistic | Link the demo to the real study. | Who builds AI matters. |
| **0:46** | 14 — **Object Detector** | COCO-SSD live | Phone, bottle, cup, book, backpack. Then something it doesn't know. Threshold down → nonsense. | Confidence ≠ correctness. It only knows its 80 things. |
| **0:49** | 15 — What can AI do? | 8 cards | Fast: 20–30 s each. "Which would you work on?" | Medicine, science, climate, accessibility… |
| **0:53** | 16 — Watch out for | 4 cards | Tie each to a moment from today. | Hallucinations, deepfakes, bias, privacy. |
| **0:55** | 17 — Three takeaways | — | Students say each one before you click. | Examples · data · critical thinking. |
| **0:57** | 18 — Keep playing | QR code | Leave it up while phones scan. | Where to go next. |
| **0:58** | 19 — Thank you | Confetti | Questions; "what would you teach an AI?" | — |

## Timing triage — cut in this order if running late

| Order | Cut | Saves |
|---|---|---|
| 1 | Slide 11 (neural net animation) — say one sentence on slide 10 instead | 1 min |
| 2 | Box Labeller: do 3 objects, not 6 | 2 min |
| 3 | "What can AI do?" — show 4 cards, not 8 | 2 min |
| 4 | Object detector: one object only | 2 min |
| **Never cut** | AI or Not, Teach the Computer, Train a Camera AI **with the bias moment** | — |

**Ahead of schedule?** Let students open the QR code and play *Box Labeller* or
*Doodle Trainer* on their phones; ask two to show their score.

## Materials

- Laptop with a recent Chrome or Edge (Firefox and Safari also work), webcam, charger
- Projector (1920×1080 or 1280×720 both fine — the deck is responsive)
- A few props for the detector: phone, bottle, cup, book, backpack, scissors
- Optional: a clicker; a second screen for the speaker view (press **S**)

## Room setup

- Laptop at the front, **webcam facing the volunteers** (not the audience) so the camera demos see one person clearly.
- Good, even light on the volunteer spot — then you can *switch it off* for the bias moment.
- A clear path to the screen for students coming up to drag cards and draw.

## Fallbacks

| Problem | What happens | What you do |
|---|---|---|
| Camera blocked / missing | A friendly message explains how to allow it; **pixels** switches to a sample picture, **camera AI** offers "📁 Add photos" per class, **detector** offers 🖼️ Sample and 📁 Photo | Use the fallback. On the detector sample, slide to 15%: it calls the sun a "sports ball". |
| Model slow to load | Spinner, then a message after 45 s; if the model arrives later the activity switches on by itself | Talk through the idea; come back to it. |
| No internet at all | Fonts and reveal.js come from CDNs, so the deck will look plain. **Doodle Trainer, Teach the Computer, Box Labeller and AI or Not are pure JS and still work once loaded** | See PREFLIGHT: open every slide once while online so the browser caches the libraries. |
| Clicker stops working after clicking into an activity | It shouldn't — activities forward arrow keys to the deck | Click on the slide title, then use the clicker. |

## Success criteria

| Measure | Target |
|---|---|
| Students who touched at least one activity at the screen or on their phone | > 50 % |
| Can answer "how is AI different from a normal program?" at the end | > 80 % (thumbs check on slide 17) |
| Can name one limit of AI | > 70 % |
