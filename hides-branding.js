(() => {
  "use strict";

  const ICON_SRC = "assets/hides/hides-system-emblem.png";
  const ICON_ALT = "H.I.D.E.S. — Hacking Intrusion Detection and Elimination System";

  function makeIcon() {
    const figure = document.createElement("figure");
    figure.className = "hides-brand-emblem";
    const img = document.createElement("img");
    img.src = ICON_SRC;
    img.alt = ICON_ALT;
    img.loading = "eager";
    img.decoding = "async";
    figure.appendChild(img);
    return figure;
  }

  function brandStationHeader(panel) {
    const header = panel?.querySelector(":scope .hides-header");
    if (!header || header.dataset.hidesBranded === "true") return;

    header.dataset.hidesBranded = "true";
    header.classList.add("hides-brand-titlebar");

    const copy = document.createElement("div");
    copy.className = "hides-brand-copy";
    while (header.firstChild) copy.appendChild(header.firstChild);
    header.append(makeIcon(), copy);
  }

  function brandMainHeader(panel) {
    const heading = panel?.querySelector(":scope > .section-heading");
    if (!heading || heading.dataset.hidesBranded === "true") return;

    heading.dataset.hidesBranded = "true";
    heading.classList.add("hides-brand-titlebar", "hides-main-titlebar");

    const copy = document.createElement("div");
    copy.className = "hides-brand-copy";
    while (heading.firstChild) copy.appendChild(heading.firstChild);
    heading.append(makeIcon(), copy);
  }

  function apply() {
    const stationPanel = document.querySelector('#content .tab-panel[data-panel="hides"]');
    if (stationPanel) brandStationHeader(stationPanel);

    const mainPanel = document.querySelector('#content .tab-panel[data-panel="hides-guide"]');
    if (mainPanel) brandMainHeader(mainPanel);
  }

  const content = document.getElementById("content");
  if (content) {
    new MutationObserver(() => queueMicrotask(apply)).observe(content, { childList: true, subtree: true });
  }
  window.addEventListener("hashchange", () => queueMicrotask(apply));
  apply();
})();
