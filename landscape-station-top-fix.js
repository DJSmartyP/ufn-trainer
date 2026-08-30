(() => {
  "use strict";

  const STATIONS = new Set(["captain", "helms", "weapons", "engineering", "science", "relay"]);
  let lastRoute = null;
  let settleTimer = null;

  function routeFromHash() {
    const raw = location.hash.replace(/^#\/?/, "");
    return raw.split("/")[0] || "home";
  }

  function isShortLandscape() {
    return window.innerWidth > window.innerHeight && window.innerHeight <= 650;
  }

  function pinTop() {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  function settleStationRoute(force = false) {
    const route = routeFromHash();
    const routeChanged = route !== lastRoute;
    lastRoute = route;

    if (!STATIONS.has(route) || !isShortLandscape() || (!force && !routeChanged)) return;

    clearTimeout(settleTimer);
    pinTop();

    requestAnimationFrame(() => {
      pinTop();
      requestAnimationFrame(pinTop);
    });

    /* Lazy image decode/font/layout may complete just after the first paint. */
    settleTimer = window.setTimeout(pinTop, 140);
  }

  window.addEventListener("hashchange", () => settleStationRoute(false));
  window.addEventListener("orientationchange", () => window.setTimeout(() => settleStationRoute(true), 100), { passive: true });
  window.addEventListener("load", () => settleStationRoute(true), { once: true });

  /* Run after app.js has performed the initial render. */
  queueMicrotask(() => settleStationRoute(true));
})();
