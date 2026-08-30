
LIGHT & DARK ANIMATED BANNER PATCH

This patch adds a lightweight animated banner that cycles through all six Light & Dark artworks.

What it does:
- Uses all 6 campaign artworks in a slow crossfade rotation.
- Loads the first image immediately.
- Defers the other 5 images until after the page is usable.
- Uses only 2 image elements in the banner at any time.
- Pauses when the tab is not visible.
- Falls back safely to the first image if JavaScript is unavailable.
- Respects prefers-reduced-motion and stays static for those users.

Install:
1) Upload the whole assets/campaigns/light-dark folder into your repo.
2) Upload:
   - light-dark-banner-rotator.css
   - light-dark-banner-rotator.js
3) Add these to the relevant page/template:
   <link rel="stylesheet" href="light-dark-banner-rotator.css">
   <script src="light-dark-banner-rotator.js" defer></script>
4) On the existing Light & Dark hero/banner container, add:
   data-light-dark-banner

Notes:
- You do NOT need to place all six images in the HTML.
- The script injects the rotating image layers automatically.
- The overlay scrim is included so text remains readable.
- If the current banner has its own static image element or hard-coded background artwork,
  remove that old single-image layer first so the new animation is the only background.

Included helper file:
- light-dark-banner-snippet.html
  A small example showing the expected banner root markup.

Optimised assets:
    - 01-battlefront.webp: 1536x1024, 284.7 KB
    - 02-phoenix.webp: 1536x1024, 263.1 KB
    - 03-convoy-dock.webp: 1536x1024, 171.5 KB
    - 04-twin-pines.webp: 1536x1024, 247.5 KB
    - 05-wormhole.webp: 1536x1024, 147.5 KB
    - 06-patchwork.webp: 1536x1024, 288.8 KB
