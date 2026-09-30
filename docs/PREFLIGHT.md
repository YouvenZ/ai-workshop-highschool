# Pre-flight checklist

Run this. The camera permission and the venue wifi are the two things that bite.

## T−3 days

- [ ] Open the **live site** (not a local file) on the laptop you will present from.
- [ ] Click through all 25 slides. On each activity slide, wait for it to load.
- [ ] Slides 10, 13, 15: press **🎥 Start** and **allow the camera**. Tick "remember" if the browser offers it.
      Camera access needs `https://` (GitHub Pages) or `http://localhost` — never `file://`.
- [ ] Slide 12 (Build a Brain): press **🏋️ Train** — it should reach ~95 % in about 10–20 s on the presenting laptop. Draw a digit: the bars move.
- [ ] Slide 13 (Train a Camera AI): status shows **✅ AI brain ready** within ~10 s.
- [ ] Slide 15 (Object Detector, bonus): status shows **✅ Detector ready**; hold up a phone → it gets a box.
- [ ] Slides 17–19 (Mood Reader, Mini ChatGPT, AI Doctor): each shows its data straight away (they are small files on the site).
- [ ] Click **🐍 Python** on two or three slides: the code appears in colour. Click **▶ Run it in Colab** once to check the notebook opens.
- [ ] Press **S**: the speaker view opens with notes and timings. (Allow pop-ups for the site if blocked.)

## T−1 day

- [ ] Ask the venue: is there wifi for the presenter laptop? Are `cdn.jsdelivr.net` and `fonts.googleapis.com` reachable? (School networks sometimes filter CDNs.)
- [ ] If unsure, bring a phone hotspot.
- [ ] Pack props for the detector: phone, bottle, cup, book, backpack, scissors.
- [ ] Decide now whether you will run the 🎁 bonus slides (9 Box Labeller, 15 Object Detector). Default: skip.

## T−0 (at the venue, 15 minutes before)

- [ ] Connect the projector. Press **F** for fullscreen. Check the right edge of slide 3 and the bottom of slides 12 and 19 are visible.
- [ ] Open the site **while online** and step through every slide once — this caches reveal.js, TensorFlow.js, the models and the datasets (≈ 32 MB) so a wifi drop later is survivable.
- [ ] Camera: open slide 10, press 🎥 Camera, confirm the image appears. Close other apps that might hold the webcam (Teams, Zoom, OBS).
- [ ] Point the webcam at the volunteer spot, check the light. Know where the light switch is (bias moment, slide 13).
- [ ] Phones: scan the QR code on slide 24 with your own phone — it should open the activity hub.
- [ ] Turn off notifications / Do Not Disturb.

## If something fails live

| Symptom | Fix |
|---|---|
| "Camera permission was blocked" | Click the 🎥 icon in the address bar → Allow → reload the page. Or use the on-screen fallback (sample / photos). |
| "Another app is using the camera" | Close Zoom/Teams/OBS, press Start again. |
| Model "took too long" | Keep talking; it switches on by itself if it arrives. Otherwise skip to the next slide — the doodle trainer teaches the same idea offline. |
| Build a Brain trains slowly | An old laptop without a graphics chip is slower. Lower Epochs to 1–2, or use "1 × 16". Press ⏹ Stop at any time — the brain keeps what it learned so far. |
| Arrow keys do nothing | Click the slide title area, then use arrows/clicker. Close the 🐍 panel first (Esc). |
| Everything looks unstyled | CDN blocked. Hotspot, reload. |
