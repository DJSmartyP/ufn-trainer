(() => {
  "use strict";

  const button = document.getElementById("other-resources-button");
  if (!button) return;

  const TARGET_SELECTOR = "#content .network-services";
  const HOME_HASH = "#/home";
  let pendingTimer = null;

  function closeMenu() {
    document.getElementById("sidebar")?.classList.remove("open");
    document.getElementById("menu-button")?.setAttribute("aria-expanded", "false");
    const scrim = document.getElementById("nav-scrim");
    if (scrim) scrim.hidden = true;
  }

  function scrollToResources() {
    const target = document.querySelector(TARGET_SELECTOR);
    if (!target) return false;
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
})();
