# UFN Crew Operations Network

Static, player-facing United Federated Navy crew reference and practice site. The visible interface stays entirely in-world.

## Current structure

- Station Directory with links to the UFN Terminal and UFN Intranet
- General Briefing
  - Admiralty / sector briefing
  - Duty stations
  - Allied Forces
  - Hostile Entities
  - Anomalous Contacts
  - Fleet Support / FC Supply Drops
  - Protocols and crew notices
- Captain command guidance
- Helms
- Weapons
- Engineering
- Science
- Relay

## Console orientation

Helms, Weapons, Engineering, Science and Relay use the supplied 1920×1080 bridge screenshots. Their Console Orientation pages include interactive screen-map hotspots: hover, keyboard-focus or tap highlighted regions to see a concise explanation of that part of the console. Each page also contains unnumbered Top Tips and detailed control cards.

Captain has no dedicated action console. Captain guidance uses the Main Screen / Ship's Window and Strategic Map as decision-making views and explicitly tells Captains to command through their station crew rather than take over controls.

## Practice systems

- Relay: Binary Countermeasure Matrix and Sensitive Node Mapping
  - Binary Countermeasure Matrix includes an Auto Solve training demonstration that performs one required input every 0.75 seconds.
  - Sensitive Node Mapping deliberately has no flag/mark control because that interaction is not available consistently in live play.
- Science: waveform-based scanning practice matching the fleet scanning behaviour.

## Custom UFN systems

Station-specific H.I.D.E.S. references are included only where relevant:
- Helms: Drive Lock, Drive Decay
- Weapons: Fire Decay, Missile Scramble, Shield Collapse
- Engineering: Heat Surge, Grid Decay

Fleet Support includes FC Supply Drops. A support craft travels to the player's vessel, ejects the requested self-propelled package, and the package flies the final distance to the ship. Most standard drops can carry up to three payload categories.

## Accuracy baseline

Standard console mechanics were checked against EmptyEpsilon tag `EE-2024.12.08`. Custom UFN mechanics use user-supplied specifications.

## Deploy to GitHub Pages

This project has no build step. Push the repository, enable GitHub Pages, and deploy the default branch from `/ (root)`.
