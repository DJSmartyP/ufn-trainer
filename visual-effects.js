(() => {
  "use strict";

  const activeTimers = new WeakMap();

  function isActivatable(element) {
    if (!element) return false;
    if (element.matches(":disabled, [aria-disabled='true']")) return false;
    return true;
  }

  function flash(element) {
    if (!isActivatable(element)) return;

    const oldTimer = activeTimers.get(element);
    if (oldTimer) window.clearTimeout(oldTimer);

    element.classList.remove("ufn-activation-flash");

    requestAnimationFrame(() => {
      element.classList.add("ufn-activation-flash");
      const timer = window.setTimeout(() => {
        element.classList.remove("ufn-activation-flash");
        activeTimers.delete(element);
      }, 220);
      activeTimers.set(element, timer);
    });
  }

  document.addEventListener("pointerdown", event => {
    const target = event.target.closest(
      "button, a.button, [role='button'], .station-card, .deployment-tile"
    );
    flash(target);
  }, { passive: true });
})();

/* ============================================================
   OP13 // OPERATION: COLUMBO
   Delta upgrade added 2026-09-10.
   - Adds OP13 to Available Deployments
   - Marks OP13 NEW and AVAILABLE NOW
   - Removes the NEW marker from OP12 Continuum
   - Updates standalone mission count 12 -> 13
   ============================================================ */
(() => {
  "use strict";

  const COLUMBO = {
    code: "OP13",
    title: "Operation: Columbo",
    image: "assets/deployments/op13-columbo.webp",
    briefing: "Your crew has been assigned to escort a convoy carrying highly classified cargo through UFN space. The nature of the cargo, its origin, and its final purpose are restricted on a need-to-know basis. Fleet Command has authorised only the information required to complete the assignment: the convoy must reach its destination intact, its movements must remain discreet, and unnecessary contact with other vessels should be avoided. This is not a routine freight escort. Communications concerning the convoy are restricted, detailed manifests are unavailable, and UFN Intelligence has requested unusually tight operational security throughout the deployment. Maintain close watch over the cargo vessels, challenge unexpected contacts, and report anything that does not match the information you have been given. Your initial orders are simple: collect the convoy, protect it, and keep its presence quiet."
  };

  const styleId = "op13-columbo-delta-style";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `

      @media (max-width: 680px) {
      }
    `;
    document.head.appendChild(style);
  }

  function buildColumboTile() {
    const tile = document.createElement("button");
    tile.className = "deployment-tile deployment-tile-new";
    tile.type = "button";
    tile.dataset.columboDeployment = "true";
    tile.setAttribute("aria-label", "Open Operation: Columbo mission record, new deployment");
    tile.innerHTML = `
      <span class="deployment-tile-art">
        <img src="${COLUMBO.image}" alt="" loading="lazy" decoding="async" fetchpriority="low" />
        <span class="deployment-tile-shade" aria-hidden="true"></span>
        <span class="deployment-new-badge">NEW</span>
        <span class="deployment-tile-copy">
          <span class="deployment-tile-code">${COLUMBO.code}</span>
          <strong>${COLUMBO.title}</strong>
          <span class="deployment-tile-type">Follow the evidence...</span>
        </span>
      </span>
    `;
    return tile;
  }

  const MISSION_HOOKS = {
    OP01: "Escort under pressure...",
    OP02: "Blend in, survive...",
    OP03: "Something feels wrong...",
    OP04: "Protect the future...",
    OP05: "Keep the peace...",
    OP06: "Trust the unlikely...",
    OP07: "Verify every identity...",
    OP08: "Respond to crisis...",
    OP09: "Intelligence is changing...",
    OP10: "Bring her home...",
    OP11: "Investigate dangerous technology...",
    OP12: "Protect the timeline...",
    OP13: "Follow the evidence..."
  };

  function updateMissionHooks(root) {
    if (!root) return;
    root.querySelectorAll(".deployment-tile").forEach(tile => {
      const code = tile.querySelector(".deployment-tile-code")?.textContent?.trim();
      const hook = MISSION_HOOKS[code];
      if (!hook) return;
      const subtitle = tile.querySelector(".deployment-tile-type");
      if (subtitle) subtitle.textContent = hook;
    });
  }

  function removeContinuumNew(root) {
    if (!root) return;
    const tiles = root.querySelectorAll(".deployment-tile");
    tiles.forEach(tile => {
      const code = tile.querySelector(".deployment-tile-code")?.textContent?.trim();
      if (code !== "OP12") return;
      tile.classList.remove("deployment-tile-new");
      tile.querySelector(".deployment-new-badge")?.remove();
      const label = tile.getAttribute("aria-label");
      if (label) tile.setAttribute("aria-label", label.replace(/,\s*new deployment/i, ""));
    });
  }

  function updateStandaloneCounts(root) {
    if (!root) return;

    const counts = root.querySelector(".deployment-register-counts");
    if (counts) {
      counts.setAttribute("aria-label", "13 standalone missions and 6 campaign missions");
      const firstCount = counts.querySelector("div:first-child strong");
      if (firstCount) firstCount.textContent = "13";
    }

    const standaloneSection = Array.from(root.querySelectorAll(".deployment-register-section"))
      .find(section => !section.classList.contains("deployment-campaign-section"));
    const headingCount = standaloneSection?.querySelector(".deployment-section-heading h3 span");
    if (headingCount) headingCount.textContent = "13";
  }

  function addColumboTile(root) {
    if (!root || root.querySelector("[data-columbo-deployment='true']")) return;

    const standaloneSection = Array.from(root.querySelectorAll(".deployment-register-section"))
      .find(section => !section.classList.contains("deployment-campaign-section"));
    const grid = standaloneSection?.querySelector(".deployment-tile-grid");
    if (grid) grid.appendChild(buildColumboTile());
  }

  function patchMarkupString() {
    const content = window.UFN_CONTENT;
    const basicTraining = content?.general;
    const deploymentTab = basicTraining?.tabs?.find(tab => tab.id === "deployments");
    if (!deploymentTab || typeof deploymentTab.content !== "string") return;

    const template = document.createElement("template");
    template.innerHTML = deploymentTab.content;

    removeContinuumNew(template.content);
    updateStandaloneCounts(template.content);
    addColumboTile(template.content);
    updateMissionHooks(template.content);

    deploymentTab.content = template.innerHTML;
  }

  function patchLivePage() {
    const live = document.getElementById("content");
    if (!live?.querySelector(".deployment-register-head")) return;
    removeContinuumNew(live);
    updateStandaloneCounts(live);
    addColumboTile(live);
    updateMissionHooks(live);
  }

  function showRecordNavigation(show) {
    const dialog = document.getElementById("deployment-record-dialog");
    if (!dialog) return;
    dialog.querySelectorAll("[data-record-action='previous'], [data-record-action='next']")
      .forEach(button => { button.hidden = !show; });
  }

  function renderColumboRecord() {
    const dialog = document.getElementById("deployment-record-dialog");
    const target = document.getElementById("deployment-record-content");
    const position = document.getElementById("deployment-record-position");
    if (!dialog || !target || !position) return;

    dialog.dataset.columbo = "true";
    showRecordNavigation(false);
    position.textContent = "13 / 13";

    target.innerHTML = `
      <article class="deployment-record">
        <div class="deployment-record-art">
          <img src="${COLUMBO.image}" alt="Mission artwork for ${COLUMBO.title}" />
          <div class="deployment-record-art-grid" aria-hidden="true"></div>
          <div class="deployment-record-art-copy">
            <span>UFN FLEET COMMAND // MISSION RECORD</span>
            <strong>${COLUMBO.code}</strong>
          </div>
        </div>

        <div class="deployment-record-document">
          <div class="deployment-record-heading">
            <div>
              <span class="classification">UFN FLEET COMMAND // ACTIVE BRIEFING</span>
              <span class="micro-label">AVAILABLE DEPLOYMENT</span>
              <div class="deployment-record-title-line">
                <h3 id="deployment-record-title">${COLUMBO.title}</h3>
                <span class="deployment-record-new-badge">NEW DEPLOYMENT</span>
              </div>
            </div>
            <div class="deployment-record-stamp" aria-hidden="true">AVAILABLE NOW</div>
          </div>

          <div class="deployment-record-meta">
            <div class="deployment-record-meta-cell"><span>RECORD</span><strong>${COLUMBO.code}</strong></div>
            <div class="deployment-record-meta-cell"><span>DEPLOYMENT</span><strong>STANDALONE</strong></div>
            <div class="deployment-record-meta-cell"><span>STATUS</span><strong>AVAILABLE NOW</strong></div>
            <div class="deployment-record-meta-cell"><span>ACCESS</span><strong>CREW AUTHORISED</strong></div>
          </div>

          <section class="deployment-record-briefing">
            <div class="deployment-record-section-title">
              <span class="micro-label">AUTHORISED CREW BRIEFING</span>
              <h4>Mission Briefing</h4>
            </div>
            <p>${COLUMBO.briefing}</p>
          </section>

          <footer class="deployment-record-footer">
            <div>
              <span class="micro-label">ISSUING AUTHORITY</span>
              <strong>UNITED FEDERATED NAVY // FLEET COMMAND</strong>
            </div>
            <div>
              <span class="micro-label">DOCUMENT CONTROL</span>
              <strong>${COLUMBO.code} // REVIEW BEFORE DEPLOYMENT</strong>
            </div>
          </footer>
        </div>
      </article>
    `;

    if (typeof dialog.showModal === "function" && !dialog.open) dialog.showModal();
    else if (!dialog.open) dialog.setAttribute("open", "");
  }

  function stripContinuumRecordBadge() {
    const title = document.getElementById("deployment-record-title");
    if (title?.textContent?.trim() !== "Operation: Continuum") return;
    document.querySelector(".deployment-record-new-badge")?.remove();
  }

  patchMarkupString();
  patchLivePage();

  document.addEventListener("click", event => {
    const columboTile = event.target.closest("[data-columbo-deployment='true']");
    if (columboTile) {
      event.preventDefault();
      renderColumboRecord();
      return;
    }

    const normalTile = event.target.closest("[data-deployment-index]");
    if (normalTile) {
      const dialog = document.getElementById("deployment-record-dialog");
      if (dialog) delete dialog.dataset.columbo;
      showRecordNavigation(true);
      queueMicrotask(stripContinuumRecordBadge);
      return;
    }

    const action = event.target.closest("[data-record-action]")?.dataset.recordAction;
    const dialog = document.getElementById("deployment-record-dialog");

    if (dialog?.dataset.columbo === "true" && (action === "previous" || action === "next")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    if (action === "previous" || action === "next") {
      queueMicrotask(stripContinuumRecordBadge);
    }
  }, true);

  document.addEventListener("keydown", event => {
    const dialog = document.getElementById("deployment-record-dialog");
    if (dialog?.open && dialog.dataset.columbo === "true" &&
        (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
})();
