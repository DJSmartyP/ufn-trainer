(() => {
  "use strict";

  const VULNERABILITIES = Object.freeze({
    helms: ["Drive Lock", "Drive Decay"],
    weapons: ["Fire Decay", "Missile Scramble", "Shield Collapse"],
    engineering: ["Heat Surge", "Grid Decay"]
  });

  const STATION_LABELS = Object.freeze({
    helms: "Helms",
    weapons: "Weapons",
    engineering: "Engineering"
  });

  const contentRoot = document.getElementById("content");
  if (!contentRoot) return;

  function currentRoute() {
    return document.body?.dataset?.route || "";
  }

  function currentPanel() {
    return contentRoot.querySelector(".tab-panel");
  }

  function buildVulnerabilityBanner(route) {
    const hacks = VULNERABILITIES[route] || [];
    if (!hacks.length) return null;

    const banner = document.createElement("section");
    banner.className = "hides-vulnerability-banner";
    banner.dataset.hidesVulnerabilityBanner = "true";

    const label = document.createElement("span");
    label.className = "micro-label";
    label.textContent = "H.I.D.E.S. SECURITY NOTE";

    const copy = document.createElement("p");
    copy.className = "hides-vulnerability-copy";
    copy.innerHTML = `<strong>${STATION_LABELS[route]}</strong> is vulnerable to the following hacks:`;

    const list = document.createElement("div");
    list.className = "hides-vulnerability-list";

    hacks.forEach(hack => {
      const chip = document.createElement("span");
      chip.className = "hides-vulnerability-chip";
      chip.textContent = hack;
      list.appendChild(chip);
    });

    banner.append(label, copy, list);
    return banner;
  }

  function enhanceGeneralHides(panel) {
    if (currentRoute() !== "general" || panel?.dataset.panel !== "hides-guide") return;
    const titlebar = panel.querySelector(":scope > .hides-main-titlebar, :scope > .hides-brand-titlebar");
    if (titlebar) titlebar.classList.add("hides-unified-titlebar");
  }

  function enhanceStationHides(panel) {
    const route = currentRoute();
    if (!VULNERABILITIES[route] || panel?.dataset.panel !== "hides") return;

    const titlebar = panel.querySelector(":scope > .hides-header.hides-brand-titlebar, :scope > .hides-header, :scope > .hides-brand-titlebar");
    if (!titlebar) return;

    const existing = panel.querySelector(":scope > [data-hides-vulnerability-banner='true']");
    if (existing) return;

    const banner = buildVulnerabilityBanner(route);
    if (banner) titlebar.insertAdjacentElement("afterend", banner);
  }

  function applyEnhancements() {
    const panel = currentPanel();
    if (!panel) return;
    enhanceGeneralHides(panel);
    enhanceStationHides(panel);
  }

  const observer = new MutationObserver(() => queueMicrotask(applyEnhancements));
  observer.observe(contentRoot, { childList: true, subtree: true });

  window.addEventListener("hashchange", () => queueMicrotask(applyEnhancements));
  window.addEventListener("load", applyEnhancements, { once: true });
  applyEnhancements();
})();
