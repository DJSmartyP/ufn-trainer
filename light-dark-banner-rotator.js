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

  const TARGETS = [
    ".deployment-campaign-tile .deployment-tile-art",
    ".deployment-record-campaign .deployment-record-art",
    "[data-light-dark-banner]"
  ].join(",");

  const HOLD_MS = 4000;
  const TRANSITION_MS = 1000;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let states = [];
  let currentIndex = 0;
  let startTimeout = null;
  let loopTimer = null;
  let scanQueued = false;
  let preloadStarted = false;

  function directImage(root) {
    return Array.from(root.children).find(child => child.tagName === "IMG") || null;
  }

  function createState(root) {
    if (!root || root.dataset.ldBannerReady === "true") return null;

    root.dataset.ldBannerReady = "true";
    root.setAttribute("data-light-dark-banner", "");

    const fallback = directImage(root);
    if (fallback) fallback.classList.add("ld-banner-fallback");

    const stage = document.createElement("div");
    stage.className = "ld-banner-stage";
    stage.setAttribute("aria-hidden", "true");

    const imgA = document.createElement("img");
    imgA.className = "ld-banner-image is-active";
    imgA.alt = "";
    imgA.decoding = "async";
    imgA.fetchPriority = "low";
    imgA.src = sources[currentIndex];

    const imgB = document.createElement("img");
    imgB.className = "ld-banner-image";
    imgB.alt = "";
    imgB.decoding = "async";
    imgB.fetchPriority = "low";

    stage.append(imgA, imgB);
    root.prepend(stage);

    if (!root.querySelector(".ld-classified-stamp")) {
      const stamp = document.createElement("div");
      stamp.className = "ld-classified-stamp";
      stamp.setAttribute("aria-hidden", "true");
      stamp.textContent = "DETAILS CLASSIFIED";
      root.appendChild(stamp);
    }

    const state = {
      root,
      imgA,
      imgB,
      activeA: true,
      index: currentIndex,
      busy: false
    };

    const markReady = () => root.classList.add("ld-banner-ready");
    if (imgA.complete && imgA.naturalWidth > 0) markReady();
    else imgA.addEventListener("load", markReady, { once: true });

    return state;
  }

  function preloadRemaining() {
    if (preloadStarted || reduceMotion) return;
    preloadStarted = true;

    const queue = sources.slice(1);
    let index = 0;

    const loadNext = () => {
      if (index >= queue.length) return;
      const image = new Image();
      image.decoding = "async";
      image.src = queue[index++];

      if (image.decode) {
        image.decode().catch(() => {}).finally(loadNext);
      } else {
        image.onload = loadNext;
        image.onerror = loadNext;
      }
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(loadNext, { timeout: 1000 });
    } else {
      window.setTimeout(loadNext, 500);
    }
  }

  function swapState(state, nextIndex) {
    if (!state || state.busy || !document.contains(state.root)) return;

    const incoming = state.activeA ? state.imgB : state.imgA;
    const outgoing = state.activeA ? state.imgA : state.imgB;
    const nextSrc = sources[nextIndex];
    const absoluteNext = new URL(nextSrc, document.baseURI).href;

    state.busy = true;

    const completeSwap = () => {
      incoming.classList.add("is-active");
      outgoing.classList.remove("is-active");
      state.activeA = !state.activeA;
      state.index = nextIndex;
      state.busy = false;
    };

    if (incoming.src === absoluteNext && incoming.complete && incoming.naturalWidth > 0) {
      completeSwap();
      return;
    }

    const onLoad = () => {
      incoming.removeEventListener("load", onLoad);
      incoming.removeEventListener("error", onError);
      completeSwap();
    };
    const onError = () => {
      incoming.removeEventListener("load", onLoad);
      incoming.removeEventListener("error", onError);
      state.busy = false;
    };

    incoming.addEventListener("load", onLoad);
    incoming.addEventListener("error", onError);
    incoming.src = nextSrc;
  }

  function advance() {
    if (document.hidden || reduceMotion) return;

    currentIndex = (currentIndex + 1) % sources.length;
    states = states.filter(state => document.contains(state.root));
    states.forEach(state => swapState(state, currentIndex));
  }

  function stopTimer() {
    if (startTimeout) {
      window.clearTimeout(startTimeout);
      startTimeout = null;
    }
    if (loopTimer) {
      window.clearInterval(loopTimer);
      loopTimer = null;
    }
  }

  function startTimer() {
    if (reduceMotion || startTimeout || loopTimer || !states.length) return;
    startTimeout = window.setTimeout(() => {
      startTimeout = null;
      advance();
      loopTimer = window.setInterval(advance, HOLD_MS + TRANSITION_MS);
    }, HOLD_MS);
  }

  function scan() {
    scanQueued = false;

    const roots = Array.from(new Set(document.querySelectorAll(TARGETS)));
    roots.forEach(root => {
      if (root.dataset.ldBannerReady === "true") return;
      const state = createState(root);
      if (state) states.push(state);
    });

    states = states.filter(state => document.contains(state.root));

    if (states.length) {
      preloadRemaining();
      startTimer();
    } else {
      stopTimer();
    }
  }

  function scheduleScan() {
    if (scanQueued) return;
    scanQueued = true;
    requestAnimationFrame(scan);
  }

  const observer = new MutationObserver(scheduleScan);
  observer.observe(document.body, { childList: true, subtree: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopTimer();
    else {
      scheduleScan();
      startTimer();
    }
  });

  scheduleScan();
})();
