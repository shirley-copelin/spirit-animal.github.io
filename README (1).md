# 🦉 Meet Gus — The Spirit Animal Finder

A fun little web app for explaining what a Product Manager does to a 1st-grade classroom.

Built to showcase the three things product managers do every day:
- 🎯 **Set a vision** — "Wouldn't it be cool if kids could meet an avatar named Gus who finds their spirit animal?"
- 🎨 **Work with designers** — pick a playful look, choose colors and fonts, make it feel friendly
- 🔧 **Work with engineers** — make it actually *work* (the typing, the thinking, the animal matching)
- 💚 **Make something customers love** — the customers here are 1st graders!

## 🎬 How it works

1. **Gus says hi** and asks the kid their name
2. **Gus asks** them to share 3 things about themselves
3. **Gus "thinks"** (spinning disc animation!) while matching their description to an animal
4. **Gus reveals** their spirit animal with a real fun fact inspired by [Nat Geo Kids](https://www.natgeokids.com/ie/category/discover/animals/)

Under the hood: the app looks for keywords in the kid's description (e.g., "fast" → cheetah, "reading" → owl, "kind" → elephant) from a curated list of 15 kid-friendly animals.

## 🎨 Design

The aesthetic is inspired by [Back Market](https://www.backmarket.com/) — their signature mint green, warm cream backgrounds, chunky rounded buttons with hard drop-shadows, and a friendly-but-bold personality. Typography pairs **Fraunces** (a characterful display serif) with **Inter** for body text.

## 📂 Files

```
├── index.html    ← the structure
├── styles.css    ← all the styling
├── app.js        ← the interactive logic
└── README.md     ← you're reading it
```

No build step, no dependencies. Just open `index.html` in a browser and it works.

## 🚀 Deploy to GitHub Pages (step-by-step)

1. **Create a new repo on GitHub**
   - Go to https://github.com/new
   - Name it something like `spirit-animal-app` (or whatever you like)
   - Make it **Public** (GitHub Pages is free only for public repos on free accounts)
   - Click **Create repository**

2. **Push these files to your repo**

   From your terminal, inside this folder:
   ```bash
   git init
   git add .
   git commit -m "First version of Gus the spirit animal finder"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/spirit-animal-app.git
   git push -u origin main
   ```
   *(Replace `YOUR-USERNAME` with your actual GitHub username.)*

3. **Enable GitHub Pages**
   - Go to your repo on GitHub
   - Click **Settings** (top right tab)
   - Click **Pages** (left sidebar)
   - Under **Source**, select **Deploy from a branch**
   - Under **Branch**, select `main` and `/ (root)`, then click **Save**

4. **Visit your site** 🎉
   - GitHub will give you a URL like `https://YOUR-USERNAME.github.io/spirit-animal-app/`
   - It takes 1–2 minutes the first time. Refresh if needed.

## 🧒 Tips for the classroom demo

- **Try it out first** with Ada the night before so you know what keywords trigger which animals
- **Let a few kids volunteer** to type their own answers — they love seeing their name pop up on screen
- **Use it as a talking point**: "I had an IDEA (vision). I asked someone to make it LOOK fun (design). I asked someone to make it WORK (engineering). And now we're using it together — that's what a product manager does!"
- Have a backup: if the wifi is flaky, you can just open `index.html` locally

## 🛠️ Customizing

Want to add more animals? Open `app.js` and add to the `ANIMALS` object. Each one needs:
- `name`, `emoji`, `tag` (a short personality description)
- `fact` (a kid-friendly fun fact)
- `keywords` (words from the kid's description that would match this animal)

Want to change colors? They're all at the top of `styles.css` as CSS variables (the `--mint`, `--cream`, `--accent` things).

## 💚 Credits

- Animal facts inspired by [National Geographic Kids](https://www.natgeokids.com/ie/category/discover/animals/)
- Visual direction inspired by [Back Market](https://www.backmarket.com/)
- Built for Ada's 1st grade class
