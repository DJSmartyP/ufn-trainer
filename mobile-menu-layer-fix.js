(() => {
  "use strict";

  const root = document.documentElement;
  const topbar = document.querySelector(".topbar");
  const sidebar = document.getElementById("sidebar");
  if (!topbar || !sidebar) return;

  let raf = 0;

  function syncTopbarHeight() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const height = Math.ceil(topbar.getBoundingClientRect().height);
      if (height > 0) {
        root.style.setProperty("--ufn-topbar-height", `${height}px`);
      }
    });
  }

  function syncOpenState() {
    document.body.classList.toggle("ufn-nav-open", sidebar.classList.contains("open"));
  }

  const navObserver = new MutationObserver(syncOpenState);
  navObserver.observe(sidebar, { attributes: true, attributeFilter: ["class"] });

  window.addEventListener("resize", syncTopbarHeight, { passive: true });
  window.addEventListener("orientationchange", syncTopbarHeight, { passive: true });
  window.addEventListener("load", syncTopbarHeight, { once: true });

  if (document.fonts?.ready) {
    document.fonts.ready.then(syncTopbarHeight).catch(() => {});
  }

  syncOpenState();
  syncTopbarHeight();
  requestAnimationFrame(syncTopbarHeight);
})();
