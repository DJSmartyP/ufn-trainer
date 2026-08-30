
UFN TRAINING PORTAL // LANDSCAPE NAV NO-CUT FIX

Replace these two files in the repo root:
- index.html
- mobile-menu-layer-fix.css

What changed:
- On landscape phones/tablets, each nav tile now stacks the icon ABOVE the label.
- This gives every label the full tile width, so nothing gets cut off.
- Weapons and Engineering are specifically protected, but the rule applies to all items.
- Basic Training and Other Resources can wrap cleanly over two lines when needed.
- Portrait hamburger behaviour is unchanged.
- Light & Dark banner / red DETAILS CLASSIFIED stamp are unchanged.

Hard refresh after GitHub Pages deploys.
