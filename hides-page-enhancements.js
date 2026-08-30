(() => {
  "use strict";

  const ROUTE_LABELS = Object.freeze({
    captain: "Captain",
    helms: "Helms",
    weapons: "Weapons",
    engineering: "Engineering",
    science: "Science",
    relay: "Relay"
  });

  const contentRoot = document.getElementById("content");
  if (!contentRoot) return;

  function currentRoute() {
    return document.body?.dataset?.route || "";
  }

  function isStationRoute(route) {
    return Object.prototype.hasOwnProperty.call(ROUTE_LABELS, route);
  }

  function currentPanel() {
    return contentRoot.querySelector(".tab-panel");
  }

  function findTitlebar(panel) {
    if (!panel) return null;
    return panel.querySelector(
      ":scope > .hides-main-titlebar, :scope > .section-heading, :scope > .document-banner, :scope > .deployment-register-head, :scope > [class*='titlebar']"
    );
  }

  function uniqueNames(values) {
    const seen = new Set();
    return values.filter(value => {
      const key = value.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function hackNames(panel) {
    if (!panel) return [];
    const names = Array.from(panel.querySelectorAll("details.hides-incident summary .hides-summary-copy strong, details.hides-incident summary strong"))
      .map(node => node.textContent.trim())
      .filter(Boolean);
    return uniqueNames(names);
  }

  function buildNotice(route, names) {
    const wrap = document.createElement("section");
    wrap.className = "hides-vulnerability-banner";
    wrap.dataset.hidesVulnerabilityBanner = "true";

    const station = ROUTE_LABELS[route] || "This station";
    const label = document.createElement("span");
    label.className = "micro-label";
    label.textContent = "H.I.D.E.S. SECURITY NOTE";

    const title = document.createElement("p");
    title.className = "hides-vulnerability-copy";
    title.innerHTML = `<strong>${station}</strong> is vulnerable to the following hacks:`;

    const list = document.createElement("div");
    list.className = "hides-vulnerability-list";
    names.forEach(name => {
      const chip = document.createElement("span");
      chip.className = "hides-vulnerability-chip";
      chip.textContent = name;
      list.appendChild(chip);
    });

    wrap.append(label, title, list);
    return wrap;
  }

  function enhanceGeneralHides(panel) {
    const route = currentRoute();
    if (route !== "general" || !panel) return;
    if (panel.dataset.panel !== "hides-guide" && !panel.querySelector(":scope > .hides-main-titlebar")) return;

    const titlebar = findTitlebar(panel);
    if (!titlebar) return;
    titlebar.classList.add("hides-unified-titlebar");
  }

  function enhanceStationHides(panel) {
    const route = currentRoute();
    if (!isStationRoute(route) || !panel) return;

    const names = hackNames(panel);
    if (!names.length) return;

    let existing = panel.querySelector(":scope > [data-hides-vulnerability-banner='true']");
    if (existing) {
      const existingNames = Array.from(existing.querySelectorAll('.hides-vulnerability-chip')).map(node => node.textContent.trim());
      if (existingNames.join("|") === names.join("|")) return;
      existing.remove();
    }

    const titlebar = findTitlebar(panel);
    const notice = buildNotice(route, names);
    if (titlebar) titlebar.insertAdjacentElement("afterend", notice);
    else panel.prepend(notice);
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
