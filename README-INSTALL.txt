UFN TRAINING PORTAL // PERFORMANCE FIX

Upload all files in this folder to the ROOT of the ufn-trainer repository.
Replace index.html when prompted.

FILES
- index.html
- performance-optimisation.js
- connected-systems-placeholders.css

WHAT THIS CHANGES
- Stops the portal forcing every image to eager-load.
- Uses native lazy loading for non-critical artwork.
- Keeps the top UFN logo / Home hero emblem eager.
- Disables the old orientation routine that removed and re-added image src values.
- Removes the universal animated ASSET LOADING observer/treatment from the page.
- Temporarily removes the large Terminal/Intranet icon enhancement.
- Uses simple T / I placeholders until proper PNG icons are designed.
- Keeps the existing short-landscape menu fix in place.

TEST
1. Open the site in a fresh tab in portrait.
2. Visit Home, Basic Training, Deployments and a station page.
3. Rotate portrait -> landscape -> portrait.
4. Confirm already-loaded artwork does not visibly reload after rotation.
5. Confirm below-fold artwork loads as it approaches the viewport.
