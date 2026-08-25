# UFN Crew Operations Network

Static, player-facing United Federated Navy crew reference and practice site.

## Player-facing structure

- Station Directory
- General Briefing
  - Admiralty Briefing
  - Duty Stations
  - Allied Forces
  - Hostile Entities
  - Unidentified Phenomena
  - Protocols
  - Crew Notices
- Captain
- Helms
- Weapons
- Engineering
  - H.I.D.E.S. placeholder, Levels I-V
- Science
  - Scan practice simulator
- Relay
  - Hacking mechanics reference
  - Binary Countermeasure Matrix practice
  - Sensitive Node Mapping practice

Every station includes a Console Orientation placeholder ready to be replaced by a real bridge screenshot and labelled guide.

## Accuracy baseline

Standard console mechanics and practice behaviour were checked against EmptyEpsilon tag `EE-2024.12.08`. The visible site deliberately stays in-world and does not name the underlying software.

The General Briefing section is grounded in the supplied `UFN_SECTOR_BRIEFING_A4_booklet.pdf`, also included in `assets/UFN-Sector-Briefing.pdf` so the original packet remains available from the site.

H.I.D.E.S. is intentionally incomplete: only the supplied name, **Hacking Intrusion Detection and Elimination System**, and Levels I-V are shown. No level effects have been invented.

## Deploy to GitHub Pages

This project has no build step.

1. Push the repository to GitHub.
2. Open **Settings → Pages**.
3. Select **Deploy from a branch**.
4. Choose the default branch and `/ (root)`.

## Files

- `index.html` - application shell and navigation
- `content.js` - station/reference content
- `app.js` - routing, Relay hacking practice and Science scan practice
- `styles.css` - responsive UFN interface
- `assets/ufn-logo.jpg` - supplied UFN logo
- `assets/UFN-Sector-Briefing.pdf` - supplied briefing packet
- `SOURCES.md` - implementation/source audit notes


## Detailed console play guides

Each active bridge station now includes a screenshot-led Console Orientation page with a step-by-step station workflow and separate control cards explaining how to use each visible control/readout in play. Captain remains a command role with Main Screen / Strategic Map guidance rather than a fabricated Captain console.
