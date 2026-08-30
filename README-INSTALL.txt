UFN TRAINING PORTAL — BASIC TRAINING TITLE ICON PATCH
30 August 2026

TARGET
DJSmartyP/ufn-trainer, main branch.

CHANGES
- Replaces the generic Basic Training title-bar image with a unique icon per page.
- Adds icons for Admiralty Briefing, Available Deployments, Tips from the Mess,
  Ranks, Medals of Service, Allied Forces, Threats, Phenomena, Supply Drops and
  Operational Protocols.
- H.I.D.E.S. deliberately remains unchanged and retains its dedicated branding.
- Existing responsive title-bar CSS is untouched.
- index.html bumps only the basic-training-ui.js cache key so the updated script
  is pulled immediately after GitHub Pages deploys it.

INSTALL
1. Unzip this package.
2. Upload the CONTENTS of the folder to the ROOT of the ufn-trainer repository.
3. Replace the existing index.html and basic-training-ui.js files.
4. Add the new assets/basic-training-icons/ folder and all 10 .webp files.
5. Commit to main. There is no build step.
