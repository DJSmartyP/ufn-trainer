# UFN Relay Hacking Practice

A lightweight, static web app for practising the two hacking mini-games used by **EmptyEpsilon**, themed as a United Federated Navy Relay Officer training terminal.

## Included games

### Binary Countermeasures (Lights Out)
Uses the EmptyEpsilon grid formula `difficulty × 2 + 3`:

- D0: 3 × 3
- D1: 5 × 5
- D2: 7 × 7
- D3: 9 × 9

Boards are generated from a solved state using the same EmptyEpsilon approach: apply a random number of valid moves from 3 to `3 × grid size`, retrying if the result happens to remain solved.

### Sensitive Node Mapping (Minesweeper)
Uses the EmptyEpsilon formulas `field size = difficulty × 2 + 6` and `mine count = difficulty × 2 + 6`:

- D0: 6 × 6, 6 sensitive nodes
- D1: 8 × 8, 8 sensitive nodes
- D2: 10 × 10, 10 sensitive nodes
- D3: 12 × 12, 12 sensitive nodes

As in EmptyEpsilon, the first sensitive node can be revealed without ending the attempt. Revealing a second sensitive node fails the intrusion. Zero-adjacent safe cells cascade open. Right-click flags on desktop; Flag mode provides the same function on touch devices.

## Controls

- **Reset Grid** restores the current puzzle to its initial state.
- **Restart Grid** generates a fresh puzzle at the currently selected EmptyEpsilon difficulty.
- Difficulty buttons select only grid parameters used by EmptyEpsilon.

## Run locally

No build step or server is required. Open `index.html` directly, or serve the directory with any static web server.

Example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## GitHub Pages

1. Push this repository to GitHub.
2. Open **Settings → Pages**.
3. Choose **Deploy from a branch**.
4. Select your default branch and `/ (root)`.
5. Save.

The site is entirely static and is ready for GitHub Pages as-is.

## Files

- `index.html` – application shell
- `styles.css` – UFN visual theme and responsive layout
- `app.js` – both puzzle engines and controls
- `assets/ufn-logo.jpg` – supplied UFN branding asset

## Notes

This project reimplements the game rules in browser JavaScript rather than copying EmptyEpsilon source code.
