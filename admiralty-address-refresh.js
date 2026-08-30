(() => {
  "use strict";

  const contentRoot = document.getElementById("content");
  if (!contentRoot) return;

  function buildPortraitPlaceholder() {
    const aside = document.createElement("aside");
    aside.className = "admiral-portrait-placeholder";
    aside.setAttribute("aria-label", "Portrait placeholder for Admiral Artemis Winstanley");
    aside.innerHTML = `
      <div class="admiral-portrait-frame">
        <div class="admiral-portrait-watermark" aria-hidden="true">
          <img src="assets/ufn-logo.webp" alt="" loading="lazy" decoding="async" />
        </div>
        <div class="admiral-portrait-silhouette" aria-hidden="true">
          <span class="admiral-silhouette-head"></span>
          <span class="admiral-silhouette-shoulders"></span>
        </div>
        <div class="admiral-portrait-status">
          <span>ADMIRAL OF THE FLEET</span>
          <strong>ARTEMIS WINSTANLEY</strong>
          <small>COMMISSIONED PORTRAIT<br />COMING SOON</small>
        </div>
      </div>
    `;
    return aside;
  }

  function enhanceAdmiraltyBriefing() {
    if (document.body.dataset.route !== "general") return;

    const panel = contentRoot.querySelector('.tab-panel[data-panel="briefing"]');
    if (!panel || panel.dataset.admiraltyRefreshApplied === "true") return;

    const banner = panel.querySelector(".document-banner");
    const directive = panel.querySelector(".directive-copy");
    if (!banner || !directive) return;

    panel.dataset.admiraltyRefreshApplied = "true";

    // Remove the three generic cards beneath the address.
    const meta = directive.nextElementSibling;
    if (meta?.classList.contains("meta-grid")) meta.remove();

    const communique = document.createElement("section");
    communique.className = "admiralty-communique";

    const routing = document.createElement("div");
    routing.className = "admiralty-routing-strip";
    routing.innerHTML = `
      <span><strong>OFFICIAL ADMIRALTY TRANSMISSION</strong> // UFN FLEET COMMAND</span>
      <span>PRIORITY: FLEET-WIDE</span>
    `;

    const body = document.createElement("div");
    body.className = "admiralty-communique-body";

    const messageColumn = document.createElement("div");
    messageColumn.className = "admiralty-message-column";

    banner.classList.add("admiralty-message-header");
    directive.classList.add("admiralty-address-copy");

    const auth = document.createElement("div");
    auth.className = "admiralty-authentication";
    auth.innerHTML = `
      <span>AUTHENTICATED // ADMIRALTY CHANNEL</span>
      <span>UFN-INT-BRF-01 // FRONTIER REGIONS</span>
    `;

    banner.parentNode.insertBefore(communique, banner);
    communique.appendChild(routing);
    communique.appendChild(body);
    body.appendChild(messageColumn);
    messageColumn.appendChild(banner);
    messageColumn.appendChild(directive);
    messageColumn.appendChild(auth);
    body.appendChild(buildPortraitPlaceholder());
  }

  let scheduled = false;
  function scheduleEnhancement() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      enhanceAdmiraltyBriefing();
    });
  }

  const observer = new MutationObserver(scheduleEnhancement);
  observer.observe(contentRoot, { childList: true, subtree: true });

  window.addEventListener("hashchange", scheduleEnhancement);
  window.addEventListener("load", scheduleEnhancement);
  scheduleEnhancement();
})();
