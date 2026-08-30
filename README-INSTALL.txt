UFN TRAINING PORTAL // LANDSCAPE MENU + LIGHT & DARK FINAL TWEAK

Upload ALL files in this ZIP to the repo root, replacing matching files:

- index.html
- mobile-menu-layer-fix.css
- mobile-menu-layer-fix.js
- light-dark-banner-rotator.css
- light-dark-banner-rotator.js
- visual-effects.css
- visual-effects.js

What this fixes:

1) LANDSCAPE MENU BAR / DRAWER
- On phone/foldable landscape, the sidebar is now forced into a true off-canvas drawer.
- It will no longer sit in the page as a weird shallow horizontal strip.
- The drawer stays below the measured topbar and above page content.
- It remains scrollable vertically on short landscape screens if needed.

2) LIGHT & DARK ROTATION
- The Light & Dark artwork now stays visible for 4 seconds.
- Crossfade transition now lasts 1 second.
- Total image cadence is 5 seconds.
- The rotator still auto-attaches to the existing campaign tile and campaign dossier artwork.
- Reduced-motion users still get a static image.

3) DETAILS CLASSIFIED STAMP
- Adds a large white "DETAILS CLASSIFIED" stamp across the middle of the rotating artwork.
- Sits above the images and behind normal content overlays.

4) MICRO EFFECTS
- Keeps the station-colour hover pulse.
- Keeps the button/tap activation flash.

The Light & Dark image assets already in assets/campaigns/light-dark do not need re-uploading.
Hard refresh after GitHub Pages deploys.
