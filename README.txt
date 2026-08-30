UFN Training Portal — Basic Training UI pass

Upload/replace these files in the repository root:
- index.html
- basic-training-ui.css (new)
- basic-training-ui.js (new)

Changes:
1. Every Basic Training primary category now explicitly opens its first child page.
   Briefing -> Admiralty Briefing
   Personnel -> Ranks
   Fleet Intelligence -> Allied Forces
   Operations -> Protocols

2. The primary category row and secondary page row now have visibly different
   hierarchy. The child row is nested under the selected category and labelled
   'SELECTED GROUP // ...'.

3. Standard H.I.D.E.S.-inspired title rows are applied across ALL Basic Training
   pages, including Admiralty Briefing and Available Deployments.
   H.I.D.E.S. keeps its own dedicated system emblem/title treatment.

4. Existing page content is preserved. This is a UI/layout layer only.

This patch is based on the current tooltipcolour1 live build and preserves the
portrait intelligence fix, asset loading treatment, station colours and
station-orientation popup colours.
