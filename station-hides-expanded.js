(() => {
  "use strict";

  const STATION_ROUTES = new Set(["helms", "weapons", "engineering"]);

  function firstExistingTab(page, ids) {
    if (!page || !Array.isArray(page.tabs) || !Array.isArray(ids)) return null;
    return ids.find(id => page.tabs.some(tab => tab.id === id)) || page.tabs[0]?.id || null;
  }

  function reinforceGroupedMenuDefaults() {
    const route = document.body.dataset.route;
    const page = window.UFN_CONTENT?.[route];
    if (!page || !Array.isArray(page.tabGroups)) return;

    const buttons = document.querySelectorAll("#content .briefing-primary-tab");
    buttons.forEach((button, index) => {
      const group = page.tabGroups[index];
      const firstTab = firstExistingTab(page, group?.tabs);
      if (firstTab) button.dataset.tab = firstTab;
    });
  }

  function expandStationHides() {
    const route = document.body.dataset.route;
    if (!STATION_ROUTES.has(route)) return;

    const panel = document.querySelector('#content .tab-panel[data-panel="hides"]');
    if (!panel || panel.dataset.expandedHides === "true") return;

    const stack = panel.querySelector(".hides-incident-stack");
    if (!stack) return;

    panel.dataset.expandedHides = "true";
    panel.classList.add("station-hides-expanded-view");
    stack.classList.add("station-hides-expanded-list");

    [...stack.querySelectorAll(":scope > details.hides-incident")].forEach(details => {
      const summary = details.querySelector(":scope > summary");
      const body = details.querySelector(":scope > .hides-incident-body");
      if (!summary || !body) return;

      const section = document.createElement("section");
      section.className = "station-hides-record";

      const header = document.createElement("header");
      header.className = "station-hides-record-head";
      [...summary.childNodes].forEach(node => header.appendChild(node));
      header.querySelector(".hides-expand")?.remove();

      body.classList.add("station-hides-record-body");
      section.append(header, body);
      details.replaceWith(section);
    });
  }

  function apply() {
    reinforceGroupedMenuDefaults();
    expandStationHides();
  }

  const content = document.getElementById("content");
  if (content) {
    new MutationObserver(() => queueMicrotask(apply)).observe(content, { childList: true, subtree: true });
  }

  window.addEventListener("hashchange", () => queueMicrotask(apply));
  apply();
})();
