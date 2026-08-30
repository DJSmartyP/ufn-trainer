UFN TRAINING PORTAL // ADMIRAL IDENTITY CONSISTENCY

Replace these two files in the repo root:
- admiralty-address-refresh.js
- mess-tips-refresh.js

Canonical identity now used throughout the rendered site:
- Name: Admiral Evelyn Artemis Calloway
- Rank: Admiral

Changes include:
- Admiralty address/signature wording is normalised when rendered.
- Official portrait aria/alt text updated.
- Portrait title now reads ADMIRAL only.
- Portrait name now reads EVELYN ARTEMIS CALLOWAY.
- Tips from the Mess entry updated.
- A lightweight global text/attribute normaliser removes any remaining:
  * Admiral of the Fleet
  * Admiral of the Fleet Artemis Winstanley
  * Admiral Artemis Winstanley
  * Artemis Winstanley

No image, CSS or index.html changes are required.
Hard refresh after GitHub Pages deploys.
