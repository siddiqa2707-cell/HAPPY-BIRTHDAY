# 🎂 Cute & Interactive Birthday Celebration Website 🎉

An ultra-cute, interactive, and customizable Happy Birthday website built with pure HTML, CSS, and JavaScript. Featuring the famous **"Impossible No Button"** game, blowable cake candles, interactive gift unwrapping, background music synthesizer, confetti explosions, and polaroid photo memory gallery!

---

## 🌟 Interactive Features

1. **🎮 Stage 1: The "Impossible No" Game**:
   - Asks the birthday person a cute question.
   - When hovering over or tapping the **"NO"** button, it dodges away franticly, shrinks, and changes text ("Nice try!", "Nope!", "Press YES!").
   - The **"YES"** button grows larger and glows until clicked!
   - Clicking **"YES"** triggers a confetti blast & unlocks Stage 2!

2. **🎂 Blowable Birthday Cake**:
   - Multi-tier SVG birthday cake with burning candles.
   - Tap/click candles to blow them out or use the **Microphone Blowing** feature!
   - Extinguishing all candles releases smoke particles & unlocks a golden wish!

3. **🎵 Synthesized Happy Birthday Music**:
   - Built-in Web Audio API chip-tune Happy Birthday melody (no broken external MP3 links!).

4. **🎁 Interactive Gift Boxes & Wishes**:
   - 3 Unwrapable Gift Boxes with secret custom note modals.
   - Heartwarming Wishes Carousel with dot navigation & auto-slide.

5. **📸 Polaroid Memory Gallery**:
   - Tilted polaroid frames with tape strips and customizable captions.

---

## 🛠️ How to Customize (Personalize for Your Friend)

You can easily change the Birthday Person's Name, Wishes, Photos, and Game Questions in **`config.js`**:

1. Open **`config.js`** in any text editor.
2. Edit the fields:
   ```javascript
   name: "Alex", // Change to your friend's name!
   
   // Edit wishes
   wishes: [ ... ],

   // Replace photo links with your own image URLs
   photos: [ ... ]
   ```
3. Save the file! (You can also click the **"Personalize ✏️"** button directly on the website while testing).

---

## 🚀 How to Upload to GitHub & Host for Free (GitHub Pages)

Follow these easy steps to host your website on GitHub and share the link with your birthday star:

### Method 1: Upload via GitHub Website (Simplest)
1. Go to [GitHub.com](https://github.com) and log in.
2. Click the **"+"** button at the top right -> **New repository**.
3. Name your repository (e.g. `happy-birthday-alex`).
4. Set visibility to **Public** and click **Create repository**.
5. On the new repository page, click **"uploading an existing file"**.
6. Drag and drop all the files from this folder (`index.html`, `style.css`, `script.js`, `config.js`, `README.md`) into the box.
7. Click **Commit changes**.
8. Go to **Settings** (top tab of your repository) -> Click **Pages** in the left sidebar.
9. Under **Build and deployment** -> **Branch**, select `main` (or `master`) and click **Save**.
10. Wait 1-2 minutes! GitHub will give you a live link like:  
    `https://yourusername.github.io/happy-birthday-alex/`

### Method 2: Upload via Git Command Line
```bash
git init
git add .
git commit -m "Initial commit for birthday website 🎂"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```
Then enable GitHub Pages in Repository Settings -> Pages!

---

## 📁 File Structure
```
happy-birthday-website/
├── index.html        # Main HTML structure
├── style.css         # Kawaii pastel styling & animations
├── script.js         # Game physics, cake candles, audio, confetti logic
├── config.js         # Configuration file for name, wishes & photos
└── README.md         # Instructions and guide
```

Made with ❤️ for unforgettable birthday celebrations! 🎂✨
