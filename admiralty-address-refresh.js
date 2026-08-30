(() => {
  "use strict";

  const contentRoot = document.getElementById("content");
  if (!contentRoot) return;

  function ensurePortraitStyles() {
    if (document.getElementById("admiral-portrait-live-styles")) return;

    const style = document.createElement("style");
    style.id = "admiral-portrait-live-styles";
    style.textContent = `
      .admiral-portrait-frame.admiral-portrait-live {
        position: relative;
        overflow: hidden;
        aspect-ratio: 2 / 3;
        min-height: 0 !important;
        background: #020914;
      }

      .admiral-portrait-frame.admiral-portrait-live::before {
        content: "OFFICIAL ADMIRALTY PORTRAIT";
        z-index: 5;
        top: 12px;
        left: 12px;
        right: 12px;
        padding: 7px 8px 6px;
        border: 1px solid rgba(228,175,46,.30);
        border-bottom-color: rgba(228,175,46,.46);
        background: rgba(2,9,20,.62);
        color: #f0cf70;
        text-shadow: 0 1px 8px rgba(0,0,0,.9);
        backdrop-filter: blur(4px);
      }

      .admiral-portrait-frame.admiral-portrait-live::after {
        content: "";
        position: absolute;
        z-index: 4;
        inset: 8px;
        border: 1px solid rgba(228,175,46,.18);
        pointer-events: none;
      }

      .admiral-portrait-live .admiral-portrait-image {
        position: absolute;
        z-index: 1;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center top;
      }

      .admiral-portrait-live .admiral-portrait-status {
        position: absolute;
        z-index: 6;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 16px 14px 15px;
        border-top: 1px solid rgba(228,175,46,.42);
        background:
          linear-gradient(180deg, transparent, rgba(2,8,18,.76) 20%, rgba(2,8,18,.97));
        text-shadow: 0 2px 10px rgba(0,0,0,.95);
      }

      .admiral-portrait-live .admiral-portrait-status > span {
        color: #c4d2e1;
      }

      .admiral-portrait-live .admiral-portrait-status strong {
        color: var(--gold-bright);
      }

      .admiral-portrait-live .admiral-portrait-watermark,
      .admiral-portrait-live .admiral-portrait-silhouette {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  function buildPortrait() {
    ensurePortraitStyles();

    const aside = document.createElement("aside");
    aside.className = "admiral-portrait-placeholder";
    aside.setAttribute("aria-label", "Official portrait of Admiral Evelyn Artemis Calloway");
    aside.innerHTML = `
      <div class="admiral-portrait-frame admiral-portrait-live">
        <img
          class="admiral-portrait-image"
          src="assets/admiralty/admiral-artemis.webp"
          alt="Official portrait of Admiral Evelyn Artemis Calloway"
          loading="lazy"
          decoding="async"
        />
        <div class="admiral-portrait-status">
          <span>ADMIRAL</span>
          <strong>EVELYN ARTEMIS CALLOWAY</strong>
        </div>
      </div>
    `;
    return aside;
  }

  function normaliseAdmiralIdentity(root = document) {
    const replacements = [
      ["Admiral of the Fleet Artemis Winstanley", "Admiral Evelyn Artemis Calloway"],
      ["Admiral Artemis Winstanley", "Admiral Evelyn Artemis Calloway"],
      ["Artemis Winstanley", "Evelyn Artemis Calloway"],
      ["ARTEMIS WINSTANLEY", "EVELYN ARTEMIS CALLOWAY"],
      ["ADMIRAL OF THE FLEET", "ADMIRAL"],
      ["Admiral of the Fleet", "Admiral"]
    ];

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT
    );

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(node => {
      let value = node.nodeValue;
      replacements.forEach(([from, to]) => {
        value = value.split(from).join(to);
      });
      if (value !== node.nodeValue) node.nodeValue = value;
    });

    root.querySelectorAll?.("[aria-label], [alt], [title]").forEach(element => {
      ["aria-label", "alt", "title"].forEach(attribute => {
        if (!element.hasAttribute(attribute)) return;
        let value = element.getAttribute(attribute);
        replacements.forEach(([from, to]) => {
          value = value.split(from).join(to);
        });
        element.setAttribute(attribute, value);
      });
    });
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
    body.appendChild(buildPortrait());
  }

  let scheduled = false;
  function scheduleEnhancement() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      normaliseAdmiralIdentity(document);
      enhanceAdmiraltyBriefing();
      normaliseAdmiralIdentity(document);
    });
  }

  const observer = new MutationObserver(scheduleEnhancement);
  observer.observe(contentRoot, { childList: true, subtree: true });

  window.addEventListener("hashchange", scheduleEnhancement);
  window.addEventListener("load", scheduleEnhancement);
  scheduleEnhancement();
})();
