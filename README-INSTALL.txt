UFN TRAINING PORTAL // CAMPAIGN BANNER TEXT FIX

Upload these two files to the repo root, replacing matching files:
- index.html
- light-dark-banner-rotator.css

What was wrong:
The Light & Dark overlay CSS was accidentally changing the existing campaign
title/copy layer from absolute positioning into normal page flow. That pushed
the title to the top edge and clipped the small CAMPAIGN // 06 MISSIONS line.

Fix:
- Restores the campaign tile's original text positioning.
- Keeps the existing banner height; no unnecessary resize needed.
- Keeps DETAILS CLASSIFIED centred over the artwork.
- Keeps the stronger high-contrast stamp styling.
- Keeps the 4-second hold / 1-second transition.
- Keeps the latest full-width landscape navigation patch.

Hard refresh after GitHub Pages deploys.
