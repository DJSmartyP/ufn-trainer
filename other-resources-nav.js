(() => {
  "use strict";

  const button = document.getElementById("other-resources-button");
  const TARGET_SELECTOR = "#content .network-services";
  const HOME_HASH = "#/home";
  const RESOURCE_ICONS = Object.freeze({
    terminal: "assets/portal-icons/terminal.webp",
    intranet: "assets/portal-icons/intranet.webp"
  });
  let pendingTimer = null;

  function closeMenu() {
    document.getElementById("sidebar")?.classList.remove("open");
    document.getElementById("menu-button")?.setAttribute("aria-expanded", "false");
    const scrim = document.getElementById("nav-scrim");
    if (scrim) scrim.hidden = true;
  }

  function identifyResource(card) {
    const href = card?.getAttribute("href") || "";
    if (href.includes("terminal.ufn.systems")) return "terminal";
    if (href.includes("ufn.systems")) return "intranet";
    return null;
  }

  function enhanceResourceCards() {
    if (document.body.dataset.route !== "home") return;
    document.querySelectorAll("#content .network-services .network-card").forEach(card => {
      if (card.dataset.portalResourceEnhanced === "true") return;
      const key = identifyResource(card);
      const src = RESOURCE_ICONS[key];
      if (!src) return;

      card.dataset.portalResourceEnhanced = "true";
      card.dataset.portalResource = key;

      const art = document.createElement("span");
      art.className = "portal-resource-art";

      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      img.fetchPriority = "low";
      img.draggable = false;

      art.appendChild(img);
      card.prepend(art);
    });
  }

  function scrollToResources() {
    const target = document.querySelector(TARGET_SELECTOR);
    if (!target) return false;
    enhanceResourceCards();
    target.scrollIntoView({ behavior: "auto", block: "start" });
    return true;
  }

  function waitForResources() {
    window.clearInterval(pendingTimer);
    let attempts = 0;
    pendingTimer = window.setInterval(() => {
      attempts += 1;
      if (scrollToResources() || attempts >= 40) {
        window.clearInterval(pendingTimer);
        pendingTimer = null;
      }
    }, 50);
  }

  if (button) {
    button.addEventListener("click", () => {
      closeMenu();

      if (document.body.dataset.route === "home") {
        requestAnimationFrame(() => requestAnimationFrame(scrollToResources));
        return;
      }

      if (location.hash === HOME_HASH) {
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      } else {
        location.hash = HOME_HASH;
      }
      waitForResources();
    });
  }

  window.addEventListener("hashchange", () => {
    requestAnimationFrame(enhanceResourceCards);
  });

  requestAnimationFrame(enhanceResourceCards);
})();
