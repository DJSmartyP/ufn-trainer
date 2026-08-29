UFN TRAINING PORTAL - HACKING OUTCOME PATCH

This patch is designed for the current live DJSmartyP/ufn-trainer repository.
It changes only the hacking practice presentation and does not replace app.js,
content.js, styles.css, rank/medal assets, intelligence pages, or other recent work.

Upload/replace these two files in the repository root:
1. index.html
2. hacking-tweaks.js

Changes:
- Sensitive Node Mapping never shows Auto Solve.
- Both hacking games now display a large success/failure panel directly over the grid.
- Success: Try Again + Try Next Grade (when a higher grade exists).
- Failure: Try Again + Try Previous Grade (when a lower grade exists).
- Grade IV success and Grade I failure correctly omit an impossible next/previous option.
- Existing game generation, timers, scoring and Lights Out Auto Solve are untouched.
