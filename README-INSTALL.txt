UFN TRAINING PORTAL // MOBILE MENU LAYER FIX

Upload all three files to the repo root:
- index.html
- mobile-menu-layer-fix.css
- mobile-menu-layer-fix.js

Fixes:
- Mobile menu now sits above all page cards/banners/content.
- Menu starts below the ACTUAL rendered topbar rather than relying on a guessed 80/82px offset.
- Scrim also starts below the measured header.
- Works after font loading, orientation changes and viewport resizing.
- Topbar remains above the drawer.
- Page content is non-interactive while the drawer is open.
- No changes to navigation behaviour or menu contents.

This specifically addresses the phone screenshot where the first menu row was being
covered by the topbar / competing page layers.

Hard refresh after GitHub Pages deploys.
