(() => {
  "use strict";

  const sources = [
    "assets/campaigns/light-dark/01-battlefront.webp",
    "assets/campaigns/light-dark/02-phoenix.webp",
    "assets/campaigns/light-dark/03-convoy-dock.webp",
    "assets/campaigns/light-dark/04-twin-pines.webp",
    "assets/campaigns/light-dark/05-wormhole.webp",
    "assets/campaigns/light-dark/06-patchwork.webp"
  ];

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const HOLD_MS = 7000;
  const TRANSITION_MS = 1000;

  function injectBannerLayers(root) {
    if (!root || root.dataset.ldBannerReady === "true") return null;
    root.dataset.ldBannerReady = "true";

    const stage = document.createElement("div");
    stage.className = "ld-banner-stage";
    stage.setAttribute("aria-hidden", "true");

    const imgA = document.createElement("img");
    imgA.className = "ld-banner-image is-active";
    imgA.alt = "";
    imgA.src = sources[0];
    imgA.decoding = "async";
    imgA.loading = "eager";
    imgA.fetchPriority = "high";

    const imgB = document.createElement("img");
    imgB.className = "ld-banner-image";
    imgB.alt = "";
    imgB.decoding = "async";
    imgB.loading = "lazy";
    imgB.fetchPriority = "low";

    const scrim = document.createElement("div");
    scrim.className = "ld-banner-scrim";
    scrim.setAttribute("aria-hidden", "true");

    stage.append(imgA, imgB);
    root.prepend(scrim);
    root.prepend(stage);

    return { root, stage, imgA, imgB, index: 0, activeA: true, timer: null, preloadIndex: 1 };
  }

  function preloadRemaining(state) {
    if (!state || reduceMotion) return;
    const queue = sources.slice(1);
    let i = 0;
    const loadNext = () => {
      if (i >= queue.length) return;
      const src = queue[i++];
      const img = new Image();
      img.decoding = "async";
      img.loading = "eager";
      img.src = src;
      if (img.decode) {
        img.decode().catch(() => {}).finally(loadNext);
      } else {
        img.onload = loadNext;
        img.onerror = loadNext;
      }
    };
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(loadNext, { timeout: 1500 });
    } else {
      window.setTimeout(loadNext, 800);
    }
  }

  function swapToNext(state) {
    if (!state || document.hidden) return;
    const nextIndex = (state.index + 1) % sources.length;
    const incoming = state.activeA ? state.imgB : state.imgA;
    const outgoing = state.activeA ? state.imgA : state.imgB;

    const doSwap = () => {
      incoming.classList.add("is-active");
      outgoing.classList.remove("is-active");
      state.activeA = !state.activeA;
      state.index = nextIndex;
    };

    if (incoming.src !== new URL(sources[nextIndex], document.baseURI).href) {
      incoming.onload = () => {
        incoming.onload = null;
        doSwap();
      };
      incoming.src = sources[nextIndex];
    } else {
      doSwap();
    }
  }

  function startRotation(state) {
    if (!state || reduceMotion || sources.length <= 1) return;
    if (state.timer) window.clearInterval(state.timer);
    state.timer = window.setInterval(() => swapToNext(state), HOLD_MS + TRANSITION_MS);
  }

  function stopRotation(state) {
    if (state?.timer) {
      window.clearInterval(state.timer);
      state.timer = null;
    }
  }

  function init() {
    const root = document.querySelector("[data-light-dark-banner]");
    const state = injectBannerLayers(root);
    if (!state) return;

    preloadRemaining(state);
    startRotation(state);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopRotation(state);
      } else {
        startRotation(state);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
