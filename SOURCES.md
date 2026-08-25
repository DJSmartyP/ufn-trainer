# Source audit notes

This file is for maintainers, not the player-facing interface.

## Rules baseline

Checked against EmptyEpsilon release tag `EE-2024.12.08`.

Key source files:

- `scripts/tutorial/02_helm.lua`
- `scripts/tutorial/03_weapons.lua`
- `scripts/tutorial/04_engineering.lua`
- `scripts/tutorial/05_science.lua`
- `scripts/tutorial/06_relay.lua`
- `src/screens/crew6/helmsScreen.cpp`
- `src/screens/crew6/weaponsScreen.cpp`
- `src/screens/crew6/engineeringScreen.cpp`
- `src/screens/crew6/scienceScreen.cpp`
- `src/screens/crew6/relayScreen.cpp`
- `src/screenComponents/selfDestructButton.cpp`
- `src/screenComponents/scanningDialog.cpp`
- `src/screenComponents/scanningDialog.h`
- `src/screenComponents/hackingDialog.cpp`
- `src/spaceObjects/spaceship.cpp`
- `src/spaceObjects/spaceship.h`
- `src/spaceObjects/spaceshipParts/beamWeapon.cpp`
- `src/spaceObjects/spaceshipParts/weaponTube.cpp`

### Verified hacking rules

- Hacking is available against a non-friendly ship once friend/foe is identified.
- Reactor is omitted from standard hack targets.
- Each successful hack adds `0.5` hacked level, capped at `1.0`.
- Hacked level decays linearly using `unhack_time = 180.0` seconds.
- Hacking reduces effective power by `hacked_level * 0.75`; at 100% hack and 100% nominal power, the system begins at 25% effectiveness before damage/heat/low-energy modifiers.
- Maneuvering effectiveness scales turn rate.
- Impulse and Warp effectiveness scale their contributions to velocity.
- Missile System effectiveness scales weapon-tube delay countdown.
- Beam Weapons effectiveness scales cooldown recovery and turret rotation.
- Shield effectiveness scales recharge and affects the shield damage factor.
- Jump Drive effectiveness affects recharge rate.

### Verified hacking games

Binary Countermeasure Matrix / Lights:
- Grid sizes: 3, 5, 7, 9 for difficulty 0-3.
- Goal: all lights ON.
- Click toggles self + orthogonal neighbours.
- Generation starts solved and applies 3 to 3×grid-size valid moves; solved scrambles are regenerated.

Sensitive Node Mapping / Mines:
- Grid/mine counts: 6/6, 8/8, 10/10, 12/12 for difficulty 0-3.
- Two total bomb contacts are allowed; the second fails.
- Zero-neighbour safe cells recursively reveal.
- Right-click/touch marking is supported in the training site.

### Verified scan-practice rules

- Scan dialog supports up to four parameter sliders.
- Each stage generates hidden target values and initial slider values at least 0.2 away from the targets.
- Signal lock occurs when summed absolute slider error is below `0.05`.
- Lock must remain stable for `2.0` seconds to advance a stage.
- `LOCKED` appears after half the lock delay (1 second).
- Default ship scan complexity/depth for the 2024.12.08 profiles:
  - Simple: complexity 1, depth 1.
  - Normal: initial complexity 1, deep complexity 2, depth 2.
  - Advanced: initial complexity 2, deep complexity 3, depth 2.
- Scripted contacts can override scan complexity/depth.

## UFN briefing canon

General-sector lore and crew-reminder material comes from the user-supplied `UFN_SECTOR_BRIEFING_A4_booklet.pdf`. Redactions and unknown values remain unresolved rather than being filled from outside material.

## H.I.D.E.S.

User-supplied name only:

**H.I.D.E.S. — Hacking Intrusion Detection and Elimination System**

Levels I-V are placeholders until the custom package implementation/specification is supplied.

## Console play guides

The detailed Console Orientation cards use the user-supplied bridge screenshots as the visual reference and the 2024.12.08 tutorial/screen source files above for standard control behaviour. Custom UFN controls visible in the screenshots (for example H.I.D.E.S. status and Call FC) are described only at the level supported by the supplied UFN material; undocumented custom mechanics are not invented.
