(() => {
  "use strict";

  const stationRoutes = new Set([
    "captain", "helms", "weapons", "engineering", "science", "relay"
  ]);

  function applyStationLayout() {
    const route = document.body.dataset.route;
    if (!stationRoutes.has(route)) return;

    const tabs = document.querySelector("#content .section-tabs");
    if (!tabs) return;

    const count = tabs.querySelectorAll(":scope > .section-tab").length;
    if (count) tabs.style.setProperty("--station-tab-count", String(count));
    tabs.dataset.stationLayout = "standard";
  }

  const content = document.getElementById("content");
  if (content) {
    new MutationObserver(() => queueMicrotask(applyStationLayout))
      .observe(content, { childList: true, subtree: true });
  }

  window.addEventListener("hashchange", () => queueMicrotask(applyStationLayout));
  applyStationLayout();
})();
