UFN TRAINING PORTAL // CLEAN PERFORMANCE PATCH
30 AUG 2026

PURPOSE
This is the clean asset-loading pass. It replaces the earlier temporary
performance layer.

WHAT IT DOES
- Normalises every image in UFN_CONTENT before the current page is rendered.
- Makes gallery/card images loading="lazy", decoding="async" and low priority.
- Keeps the UFN logo/Home hero image eager/high priority.
- Catches Available Deployments as well because the policy runs after the
  deployment page has been registered but before app.js renders it.
- Prevents app.js from turning every image back to eager loading.
- Disables the old orientation routine that removed/re-added image src values.
- Redirects old PNG references to matching WebP copies in known asset folders.
- Leaves assets/hides/hides-system-emblem.png alone because the repo does not
  currently contain a matching WebP for that specific emblem.
- Adds content-visibility to large repeated grids/cards to reduce off-screen
  layout and painting work.
- Keeps temporary T / I Terminal and Intranet placeholders for now.
- Retains the compact landscape menu CSS.

INSTALL
1. Unzip this package.
2. Upload ALL files in this folder to the root of ufn-trainer.
3. Replace index.html.
4. Replace/add the CSS and JS files supplied here.
5. Commit and allow GitHub Pages to deploy.
6. Test first in a fresh/incognito tab, then test portrait/landscape rotation.

FILES
- index.html
- asset-policy.js
- performance-optimisation.css
- connected-systems-placeholders.css
- landscape-menu-fix.css

NOTE
The large original PNG files can remain in GitHub. Merely existing in the repo
does not cost page load time. The policy ensures known WebP equivalents are
preferred if an old PNG path accidentally appears in rendered content.
