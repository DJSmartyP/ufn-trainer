UFN TRAINING PORTAL // CLEAN PERFORMANCE + LANDSCAPE STATION TOP FIX

This package supersedes the previous clean performance patch.

Upload all files in this folder to the root of the ufn-trainer repo, replacing matching files.

New in this version:
- Prevents first station pages in short landscape from jumping to a mid-page position.
- Disables scroll anchoring for the portal content.
- Keeps visible station tab content fully laid out rather than estimated by content-visibility.
- Re-pins newly opened Captain/Helms/Weapons/Engineering/Science/Relay routes to the top after layout settles.

It retains the previous clean performance work:
- lazy/low-priority non-critical assets
- high-priority UFN logo/hero
- verified PNG -> WebP preference where an equivalent exists
- no legacy orientation src reset
- no global animated asset-loading observer
- simple Terminal/Intranet placeholders

After GitHub Pages updates, test in a fresh/incognito tab.
