UFN TRAINING PORTAL — LOADING + LANDSCAPE MENU FIX

This patch fixes two issues in the current live repository:

1. PORTRAIT / HOME PAGE LOADING HANG
The site was loading two separate Connected Systems implementations.
The older connected-systems.js rewrites its own Home cards inside a MutationObserver,
which immediately triggers another rewrite. The replacement index.html removes that
script and its duplicate CSS, keeping connected-systems-enhancements.js only.

2. LANDSCAPE MENU SCROLLBAR
Short-landscape navigation now uses a compact two-column drawer. Portal, Station
Training and Connected Systems remain visible without needing a vertical scrollbar.
The duplicate access-status footer is hidden only in short landscape.

INSTALL
- Upload index.html to the repository root and replace the existing file.
- Upload landscape-menu-fix.css to the repository root.
- Commit/push and wait for GitHub Pages to deploy.
- Hard refresh once after deployment.

The existing connected-systems.js and connected-systems.css files can remain in the
repository; they are no longer loaded by index.html.
