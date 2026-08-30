UFN TRAINING PORTAL // LANDSCAPE MENU + LIGHT & DARK FIX

Upload ALL files in this ZIP to the repo root, replacing matching files:

- index.html
- mobile-menu-layer-fix.css
- mobile-menu-layer-fix.js
- light-dark-banner-rotator.css
- light-dark-banner-rotator.js
- visual-effects.css
- visual-effects.js

FIX 1 — LANDSCAPE MENU
- Keeps the high z-index / measured-topbar fix.
- Removes the accidental horizontal scrollbar.
- Allows safe vertical scrolling on short landscape/foldable screens if the
  complete menu cannot fit.
- Keeps the compact two-column landscape menu.
- Prevents later menu sections (station training/resources) being clipped.
- Footer remains hidden in short landscape because the topbar already shows
  network status.

FIX 2 — LIGHT & DARK ROTATOR
- The six campaign WebP files are already present in GitHub.
- The live index.html was not loading the rotator CSS/JS; this ZIP wires them in.
- Auto-detects the Light & Dark campaign tile AND the campaign dossier artwork.
- Changes artwork every 2.5 seconds.
- 650ms crossfade.
- Pauses when the browser tab is hidden.
- Reduced-motion users see a static image.

FIX 3 — MICRO EFFECTS
- Restores the requested station-colour hover pulse.
- Restores the short button/tap activation flash.

No campaign image files need to be uploaded again.
Hard refresh after GitHub Pages deploys.
