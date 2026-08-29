UFN TRAINING PORTAL — AVAILABLE DEPLOYMENTS RECORD UPDATE
=========================================================

Upload these files/folders over the current GitHub Pages repository:

- index.html
- deployments-records.js
- deployments-records.css
- assets/deployments/ (all supplied mission artwork, including campaign-light-dark.webp)

WHAT THIS UPDATE DOES
---------------------
- Adds Basic Training > Briefing > Available Deployments.
- Shows 12 standalone missions as compact 16:9 art tiles.
- Uses three mission tiles per row on normal landscape layouts.
- Keeps mission briefing text hidden until a tile is opened.
- Opens an in-world UFN Fleet Command mission record with large art, briefing, record metadata and document styling.
- Adds Previous / Next navigation in the open record, plus left/right arrow-key navigation.
- Shows the Light and Dark campaign as one full-width campaign record representing 6 linked campaign missions.
- Uses the supplied Light and Dark artwork and keeps campaign details redacted.
- Does not include an admin editor or JSON data workflow.

CONTENT CHECK
-------------
- OP01–OP12 briefing copy is unchanged from the supplied copy.
- All 12 standalone briefings remain 140 words each.
- No campaign mission names/details have been invented; the campaign remains deliberately redacted.

NOTE
----
No separate mission map artwork was supplied for these records, so the detail view uses the supplied mission art only. Map panels can be added later if map assets are provided.

NEW DEPLOYMENT MARKER
---------------------
- A standalone mission can include an `added: "YYYY-MM-DD"` field in deployments-records.js.
- The portal automatically displays a cyan NEW badge and highlighted tile border for 28 days from that date.
- The marker disappears automatically after the 28-day window; no follow-up edit is required.
- Operation: Continuum is currently marked with added date 2026-08-29, so its NEW state expires automatically on 2026-09-26.
- Future missions can use the same `added` field when they are added.
