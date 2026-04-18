# 🦉 Meet Gus — The Spirit Animal Finder

A fun little web app for explaining what a Product Manager does to a 1st-grade classroom.

Built to showcase the three things product managers do every day:
- 🎯 **Set a vision** — "Wouldn't it be cool if kids could meet an avatar named Gus who finds their spirit animal?"
- 🎨 **Work with designers** — pick a playful look, choose colors and fonts, make it feel friendly
- 🔧 **Work with engineers** — make it actually *work* (the typing, the talking, the thinking, the animal matching)
- 💚 **Make something customers love** — the customers here are 1st graders!

## 🎬 How it works

1. **Gus says hi** and asks the kid their name
2. **Gus asks** them to share 3 things about themselves — they can **type** OR tap the **🎙️ microphone** and just talk
3. **Gus "thinks"** (spinning disc animation!) while matching their description to an animal
4. **Gus reveals** their spirit animal with a real fun fact inspired by [Nat Geo Kids](https://www.natgeokids.com/ie/category/discover/animals/)

Under the hood: the app looks for keywords in the kid's description (e.g., "fast" → cheetah, "reading" → owl, "kind" → elephant) from a curated list of 15 kid-friendly animals.

## 🧭 Pages

- **`index.html`** — the main Gus experience
- **`animals.html`** — gallery of all 15 animals with visuals and fun facts
- **`about.html`** — why this app was designed for 1st graders
- **`pm.html`** — "Made by a PM" page with a family photo spot for Ada's crew

## 🎙️ About the microphone

Tapping the mic uses your browser's built-in **Web Speech API** — no account, no API key, no data stored. It works great in **Chrome** and **Safari** (desktop and mobile). Firefox support is more limited, and the app gracefully falls back to typing if speech isn't available.

The first time a kid taps the mic, the browser will ask for microphone permission — totally normal.

## 🎨 Design

The aesthetic is inspired by [Back Market](https://www.backmarket.com/) — their signature mint green, warm cream backgrounds, chunky rounded buttons with hard drop-shadows, and a friendly-but-bold personality. Typography pairs **Fraunces** (a characterful display serif) with **Inter** for body text.

## 📂 Files

```
├── index.html          ← main Gus experience
├── animals.html        ← the 15-animals gallery
├── about.html          ← "why this is built for kids" page
├── pm.html             ← "Made by a PM" + family photo page
├── styles.css          ← all the styling
├── app.js              ← main interactive logic + speech-to-text
├── animals-data.js     ← shared animal data (used by index + animals gallery)
└── README.md           ← you're reading it
```

No build step, no dependencies. Just open `index.html` in a browser and it works.

## 🖼️ Adding Ada's family photo

Open `pm.html` and follow the instructions in the comment near the top of the `<main>` section. The short version:

1. Drop your photo (e.g. `family.jpg`) in this folder
2. Find the `<div class="pm-photo-frame__placeholder">...</div>` block in `pm.html`
3. Replace it with: `<img class="pm-photo-frame__img" src="family.jpg" alt="Ada and her family" />`

## 🚀 Deploy to GitHub Pages (step-by-step)

1. **Push these files to your repo** (you likely already have one)
2. **Enable GitHub Pages**
   - Go to your repo on GitHub
   - Click **Settings** (top right tab)
   - Click **Pages** (left sidebar)
   - Under **Source**, select **Deploy from a branch**
   - Under **Branch**, select `main` and `/ (root)`, then click **Save**
3. **Visit your site** 🎉
   - Your URL will be `https://YOUR-USERNAME.github.io/REPO-NAME/`
   - It takes 1–2 minutes the first time. Refresh if needed.

## 🧒 Tips for the classroom demo

- **Try it out first** with Ada the night before so you know what keywords trigger which animals
- **Use a Chromebook or iPad** in class so the microphone works smoothly
- **Let a few kids volunteer** to talk to Gus — they love seeing their name pop up on screen
- **Use it as a talking point**: "I had an IDEA (vision). I asked someone to make it LOOK fun (design). I asked someone to make it WORK (engineering). And now we're using it together — that's what a product manager does!"
- Have a backup: if the wifi is flaky, you can just open `index.html` locally

## 🛠️ Customizing

Want to add more animals? Open `animals-data.js` and add to the `ANIMALS` object. Each one needs:
- `name`, `emoji`, `tag` (a short personality description)
- `fact` (a kid-friendly fun fact)
- `keywords` (words from the kid's description that would match this animal)

New animals automatically show up on the `animals.html` gallery page too — no extra work needed.

Want to change colors? They're all at the top of `styles.css` as CSS variables (the `--mint`, `--cream`, `--accent` things).

## 💚 Credits

- Animal facts inspired by [National Geographic Kids](https://www.natgeokids.com/ie/category/discover/animals/)
- Visual direction inspired by [Back Market](https://www.backmarket.com/)
- Built for Ada's 1st grade class
