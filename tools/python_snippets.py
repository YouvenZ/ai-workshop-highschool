"""The "🐍 Show me the Python" programs — ONE source for every activity.

tools/build_python.py turns this file into:
  • site/js/python-snippets.js          what the 🐍 button shows in the browser
  • notebooks/try-it-in-python.ipynb    the same programs, runnable in Colab

Rules for a snippet: a beginner reads it top to bottom, it is 10–25 lines,
every step is commented in plain words, and it RUNS as-is in Colab (no
webcam needed — camera apps use a sample photo instead, with a comment
saying where the webcam would go).
"""

SNIPPETS = [
    {
        "id": "ai-or-not",
        "emoji": "🤖",
        "title": "AI or Not?",
        "tagline": "A rule written by a person vs. a model that learns the rule",
        "steps": ["✍️ A person writes a rule", "📦 Give examples + answers", "🧠 The model learns its own rule"],
        "code": '''\
from sklearn.tree import DecisionTreeClassifier

# ❶ A NORMAL program: a person writes the rule by hand
def is_spam_rule(message):
    return "free money" in message.lower()

# ❷ MACHINE LEARNING: we only give examples + the right answers
#    each email = [how many "!", how many links, how many CAPITAL words]
emails  = [[5, 3, 10], [0, 0, 0], [8, 6, 12], [1, 0, 1], [6, 4, 7], [0, 1, 0]]
answers = ["spam", "ok", "spam", "ok", "spam", "ok"]

model = DecisionTreeClassifier()
model.fit(emails, answers)      # the computer works out the rule by itself

# ❸ A new email: "WIN A PRIZE NOW!!!" — 7 "!", 5 links, 9 capital words
print("Rule says spam? ", is_spam_rule("WIN A PRIZE NOW!!!"))  # False: nobody wrote that rule
print("Model says:     ", model.predict([[7, 5, 9]])[0])       # spam: it learned the pattern
''',
    },
    {
        "id": "teach",
        "emoji": "🎯",
        "title": "Teach the Computer",
        "tagline": "K-nearest neighbours: the new animal gets the label most of its neighbours have",
        "steps": ["📍 Examples with labels", "🗳️ Pick K voters", "❓ Classify a new animal"],
        "code": '''\
from sklearn.neighbors import KNeighborsClassifier

# ❶ Examples: [size, fluffiness] for each animal, and what it is
animals = [[3, 8], [4, 9], [3, 7],        # cats
           [8, 4], [9, 5], [7, 3],        # dogs
           [1, 6], [1, 5]]                # hamsters
labels  = ["cat", "cat", "cat", "dog", "dog", "dog", "hamster", "hamster"]

# ❷ K = how many nearest neighbours get a vote (try 1, then 5!)
model = KNeighborsClassifier(n_neighbors=3)
model.fit(animals, labels)

# ❸ A new animal: size 8, fluffiness 5 — who are its neighbours?
print(model.predict([[8, 5]]))            # ['dog']
print(model.predict_proba([[8, 5]]))      # the votes: cat, dog, hamster
''',
    },
    {
        "id": "doodle",
        "emoji": "✏️",
        "title": "Doodle Trainer",
        "tagline": "A drawing is just numbers — learn from labelled doodles, guess new ones",
        "steps": ["🖍️ Labelled drawings", "🧠 Learn", "❓ Guess drawings it never saw"],
        "code": '''\
from sklearn.datasets import load_digits
from sklearn.neighbors import KNeighborsClassifier

# ❶ 1,797 tiny 8×8 drawings of digits, each one labelled by a person
doodles  = load_digits()
pictures = doodles.data        # each drawing = 64 numbers (how dark each square is)
labels   = doodles.target      # what each drawing is

# ❷ Learn from every drawing except the last 10
model = KNeighborsClassifier(n_neighbors=3)
model.fit(pictures[:-10], labels[:-10])

# ❸ Guess the 10 drawings it has never seen
print("AI guesses: ", model.predict(pictures[-10:]))
print("Real answer:", labels[-10:])

# Bonus: print the last drawing as text art 🖍️
for row in pictures[-1].reshape(8, 8):
    print("".join("██" if v > 7 else "··" for v in row))
''',
    },
    {
        "id": "annotate",
        "emoji": "🔲",
        "title": "Box Labeller",
        "tagline": "A labelled box is four numbers and a word — and we can score how good it is",
        "steps": ["🔲 A box = 4 numbers + a label", "📏 Compare with the expert", "📦 Millions of these = a dataset"],
        "code": '''\
# ❶ A labelled box is just 4 numbers and a word
my_box     = {"label": "car", "x": 40, "y": 60, "w": 120, "h": 70}
expert_box = {"label": "car", "x": 50, "y": 55, "w": 115, "h": 75}

# ❷ How well do two boxes match? 0 = not at all, 1 = perfectly
#    (AI people call this "IoU": Intersection over Union)
def overlap(a, b):
    left,  top    = max(a["x"], b["x"]), max(a["y"], b["y"])
    right, bottom = min(a["x"] + a["w"], b["x"] + b["w"]), min(a["y"] + a["h"], b["y"] + b["h"])
    shared = max(0, right - left) * max(0, bottom - top)
    total  = a["w"] * a["h"] + b["w"] * b["h"] - shared
    return shared / total

print(f"Your box matches the expert's by {overlap(my_box, expert_box):.0%}")

# ❸ A self-driving car's training data is MILLIONS of lines like these
dataset = [my_box, {"label": "person", "x": 210, "y": 40, "w": 35, "h": 90}]
print(dataset)
''',
    },
    {
        "id": "pixels",
        "emoji": "👁️",
        "title": "How a Computer Sees",
        "tagline": "A photo is a grid of numbers, and a filter is a tiny grid that slides over it",
        "steps": ["📷 Photo → numbers", "🔍 Zoom in on the numbers", "✴️ Slide a filter over it"],
        "code": '''\
import numpy as np
from PIL import Image, ImageFilter
from sklearn.datasets import load_sample_image

# ❶ Load a photo — to the computer it is only a grid of numbers
photo  = Image.fromarray(load_sample_image("flower.jpg"))
pixels = np.array(photo)
print("Size:", pixels.shape)                 # (height, width, 3 colours: red, green, blue)
print("Top-left pixel (R, G, B):", pixels[0, 0])

# ❷ Shrink it to 8×6 in black & white to SEE the numbers
tiny = np.array(photo.convert("L").resize((8, 6)))
print(tiny)                                  # 0 = black … 255 = white

# ❸ A filter slides a little 3×3 grid of numbers over the picture.
#    This one keeps only the edges — like the first layer of a neural network
edges = photo.convert("L").filter(ImageFilter.FIND_EDGES)
edges.save("edges.png")                      # open edges.png: only the outlines! ✴️
''',
        "show": "edges",
    },
    {
        "id": "teachable",
        "emoji": "📸",
        "title": "Train a Camera AI",
        "tagline": "Borrow a network that can already see, then teach it your own classes",
        "steps": ["👀 Borrow trained 'eyes'", "📸 Record a few examples", "🧠 Teach a tiny classifier on top"],
        "code": '''\
import numpy as np
from tensorflow import keras
from sklearn.datasets import load_sample_image
from sklearn.neighbors import KNeighborsClassifier

# ❶ Borrow "eyes": a network already trained on 1.2 million photos
eyes = keras.applications.MobileNetV2(input_shape=(224, 224, 3), include_top=False, pooling="avg")

def look(picture):                           # a 224×224 picture → 1,280 numbers that describe it
    x = keras.applications.mobilenet_v2.preprocess_input(np.array(picture, dtype="float32"))
    return eyes.predict(x[None], verbose=0)[0]

# ❷ Record 5 examples of each class. (In the app these come from your webcam.)
flower, temple = load_sample_image("flower.jpg"), load_sample_image("china.jpg")
shots = [(0, 0), (60, 100), (120, 200), (180, 300), (200, 410)]
examples = [look(img[y:y+224, x:x+224]) for img in (flower, temple) for y, x in shots]
labels   = ["flower"] * 5 + ["temple"] * 5

# ❸ Teach a tiny classifier on top of the eyes, then test a NEW shot
model = KNeighborsClassifier(n_neighbors=3).fit(examples, labels)
print(model.predict([look(flower[150:374, 250:474])]))    # ['flower']
''',
    },
    {
        "id": "detect",
        "emoji": "🔍",
        "title": "Object Detector",
        "tagline": "A ready-trained detector finds and boxes 80 kinds of objects",
        "steps": ["⬇️ Download a trained detector", "📷 Give it a photo (or webcam)", "🔲 Read its boxes"],
        "pip": "ultralytics",
        "code": '''\
# In Colab or a terminal, first run:  pip install ultralytics
from ultralytics import YOLO

# ❶ A detector trained on 118,000 photos where people drew boxes (80 kinds of objects)
model = YOLO("yolov8n.pt")

# ❷ What's in this photo? (Put 0 instead of the link to use your webcam, with show=True)
results = model("https://ultralytics.com/images/bus.jpg", verbose=False)

# ❸ Every box = a label, how sure it is, and 4 numbers (left, top, right, bottom)
for box in results[0].boxes:
    name = model.names[int(box.cls)]
    print(f"{name:10} {float(box.conf):.0%}   at {box.xyxy[0].int().tolist()}")

results[0].save("detected.jpg")      # the photo with the boxes drawn on it
''',
        "show": "Image.open('detected.jpg')",
        "show_import": "from PIL import Image",
    },
    {
        "id": "digits",
        "emoji": "🧠",
        "title": "Build a Brain",
        "tagline": "A neural network with layers you choose learns to read handwritten digits",
        "steps": ["✍️ 70,000 labelled digits", "🧱 Stack layers of neurons", "🏋️ Train", "🎯 Test on new digits"],
        "code": '''\
from tensorflow import keras

# ❶ 70,000 handwritten digits (28×28 pixels), each labelled by a person
(train_x, train_y), (test_x, test_y) = keras.datasets.mnist.load_data()
train_x, test_x = train_x / 255, test_x / 255        # pixels: 0–255 → 0–1

# ❷ Build the brain: layers of neurons. Add, remove, resize — like in the app!
brain = keras.Sequential([
    keras.Input(shape=(28, 28)),
    keras.layers.Flatten(),                          # picture → a row of 784 numbers
    keras.layers.Dense(64, activation="relu"),       # hidden layer 1: 64 neurons
    keras.layers.Dense(32, activation="relu"),       # hidden layer 2: 32 neurons
    keras.layers.Dense(10, activation="softmax"),    # 10 outputs: one per digit 0–9
])
brain.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])

# ❸ Train: look at every picture 3 times, nudging ~52,000 numbers each time
brain.fit(train_x, train_y, epochs=3)

# ❹ Test on 10,000 digits it has never seen
brain.evaluate(test_x, test_y)
print("I think it's a", brain.predict(test_x[:1], verbose=0).argmax(), "— the answer is", test_y[0])
''',
    },
    {
        "id": "medical",
        "emoji": "🩺",
        "title": "AI Doctor's Assistant",
        "tagline": "Learn from 569 real biopsies — and count which mistakes the model makes",
        "steps": ["🔬 Real patient measurements", "🙈 Hide 25% for testing", "🧠 Train", "⚖️ Count the mistakes"],
        "code": '''\
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix

# ❶ 569 real patients: 30 measurements of cells seen under a microscope
data = load_breast_cancer()
X, y = data.data, data.target            # y: 0 = malignant (cancer), 1 = benign

# ❷ Hide 25% of the patients — the model never sees them until the test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)
model = LogisticRegression(max_iter=5000).fit(X_train, y_train)

# ❸ How did it do on patients it has never seen?
print(f"Correct: {model.score(X_test, y_test):.0%}")
print(confusion_matrix(y_test, model.predict(X_test)))
#   [[cancer caught,  MISSED cancer  ],
#    [false alarm,    correctly clear]]

# ❹ One new patient: the chance of cancer. ⚠️ The AI helps — a doctor decides.
print(f"Chance of cancer: {model.predict_proba(X_test[:1])[0][0]:.0%}")
''',
    },
    {
        "id": "sentiment",
        "emoji": "😀",
        "title": "Mood Reader",
        "tagline": "Count which words appear in happy and sad sentences, then read new ones",
        "steps": ["💬 Sentences + their mood", "🔢 Words → counts", "🧠 Learn word ↔ mood", "📖 Read new sentences"],
        "code": '''\
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

# ❶ Example sentences, each labelled with its mood by a person
sentences = ["I love this game", "what a great day", "this pizza is amazing", "best movie ever",
             "I hate mondays", "this is so boring", "the worst homework ever", "I feel sad today"]
moods     = ["😀", "😀", "😀", "😀", "😞", "😞", "😞", "😞"]

# ❷ Turn words into numbers: count how often each word appears
words  = CountVectorizer()
counts = words.fit_transform(sentences)

# ❸ Learn which words go with which mood
model = MultinomialNB().fit(counts, moods)

# ❹ Read sentences it has never seen
new = ["I love pizza", "mondays are boring", "this is not great"]
for sentence, mood in zip(new, model.predict(words.transform(new))):
    print(mood, sentence)             # 😅 "not great" fools it: it only counts words!
''',
    },
    {
        "id": "nextword",
        "emoji": "💬",
        "title": "Mini ChatGPT",
        "tagline": "Count which word follows which, then write by picking likely next words",
        "steps": ["📚 Read lots of text", "🔢 Count what comes next", "✍️ Write word by word"],
        "code": '''\
import random
from collections import Counter, defaultdict

# ❶ Text to learn from (the app reads all 26,000 words of Alice in Wonderland)
text = """alice was beginning to get very tired of sitting by her sister on the bank .
the white rabbit was late . alice was very curious and the rabbit was in a hurry .
the queen was very angry and the rabbit was very frightened ."""
words = text.split()

# ❷ Count which word comes after which
next_words = defaultdict(Counter)
for word, after in zip(words, words[1:]):
    next_words[word][after] += 1
print("After 'was':", next_words["was"])

# ❸ Write! Start with a word, then keep picking a likely next word
word, story = "alice", ["alice"]
for _ in range(15):
    options = next_words[word]
    word = random.choices(list(options), weights=list(options.values()))[0]
    story.append(word)
print(" ".join(story))    # ChatGPT does this too — with a HUGE brain and trillions of words
''',
    },
]
