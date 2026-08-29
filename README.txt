UFN Training Portal patch

Upload/replace these files in the repository root:
- index.html
- protocol-icons.css
- asset-loading.css (new)
- asset-loading.js (new)

Fixes:
- Protocol artwork now explicitly overrides the legacy 38x38 protocol badge rule.
- Icons are 245–315px in wide layouts, and 180–245px when the protocol area is narrower.
- Protocol responsiveness uses the available content width so foldable/landscape layouts do not squeeze the title.
- Images now display an in-world 'ASSET LOADING / UFN DATA LINK' placeholder until the real image loads.
- Failed images display 'ASSET UNAVAILABLE' instead of an unexplained blank area.
