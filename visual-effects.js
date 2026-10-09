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
   OP13 / OP14 deployment records
   ============================================================ */
(() => {
  "use strict";

  const COLUMBO = {
    code: "OP13",
    title: "Operation: Columbo",
    image: "assets/deployments/op13-columbo.webp",
    briefing: "Your crew has been assigned to escort a convoy carrying highly classified cargo through UFN space. The nature of the cargo, its origin, and its final purpose are restricted on a need-to-know basis. Fleet Command has authorised only the information required to complete the assignment: the convoy must reach its destination intact, its movements must remain discreet, and unnecessary contact with other vessels should be avoided. This is not a routine freight escort. Communications concerning the convoy are restricted, detailed manifests are unavailable, and UFN Intelligence has requested unusually tight operational security throughout the deployment. Maintain close watch over the cargo vessels, challenge unexpected contacts, and report anything that does not match the information you have been given. Your initial orders are simple: collect the convoy, protect it, and keep its presence quiet."
  };
  const SPECIAL_DELIVERY = {
    code: "OP14",
    title: "Operation: Special Delivery",
    image: "assets/deployments/op14-special-delivery.webp",
    availableFrom: "2026-10-09T13:30:00+01:00",
    newDays: 14,
    briefing: "You have been given a quiet but vital transfer assignment - a sealed consignment of sensitive cargo must be carried to a designated UFNI contact for secure handover. The route is not being broadcast, and the nature of the shipment is restricted to those with an operational need to know. Maintain a low profile throughout the journey. Choose your approach, watch for unusual traffic, and avoid drawing attention to the cargo or your destination. Flight Control will provide updates as the situation develops, but the crew should be ready to adapt without compromising the assignment. Vanguard is also carrying an advanced directional beam system for field testing. Weapons officers should familiarise themselves with its controls and report its performance under conditions. Successful delivery depends on sound navigation, disciplined communications, and discretion from every station aboard."
  };

  const specialDeliveryNewUntil = Date.parse(SPECIAL_DELIVERY.availableFrom) +
    SPECIAL_DELIVERY.newDays * 24 * 60 * 60 * 1000;
  const isNewSpecialDelivery = () => Date.now() >= Date.parse(SPECIAL_DELIVERY.availableFrom) &&
    Date.now() < specialDeliveryNewUntil;
  const newUntilLabel = new Date(specialDeliveryNewUntil).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric", timeZone: "Europe/London"
  });

  function buildAddedTile(mission) {
    const isNew = mission.code === SPECIAL_DELIVERY.code && isNewSpecialDelivery();
    const tile = document.createElement("button");
    tile.className = `deployment-tile${isNew ? " deployment-tile-new" : ""}`;
    tile.type = "button";
    tile.dataset.addedDeployment = mission.code;
    tile.setAttribute("aria-label", `Open ${mission.title} mission record${isNew ? ", new deployment, now available" : ""}`);
    tile.innerHTML = `
      <span class="deployment-tile-art">
        <img src="${mission.image}" alt="" loading="lazy" decoding="async" fetchpriority="low" />
        <span class="deployment-tile-shade" aria-hidden="true"></span>
        ${isNew ? `<span class="deployment-new-badge" title="New deployment until ${newUntilLabel}">NEW</span>` : ""}
        <span class="deployment-tile-copy">
          <span class="deployment-tile-code">${mission.code}</span>
          <strong>${mission.title}</strong>
          <span class="deployment-tile-type">${mission.code === SPECIAL_DELIVERY.code ? "Deliver the package..." : "Follow the evidence..."}</span>
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
    OP13: "Follow the evidence...",
    OP14: "Deliver the package..."
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
      counts.setAttribute("aria-label", "14 standalone missions and 6 campaign missions");
      const firstCount = counts.querySelector("div:first-child strong");
      if (firstCount) firstCount.textContent = "14";
    }

    const standaloneSection = Array.from(root.querySelectorAll(".deployment-register-section"))
      .find(section => !section.classList.contains("deployment-campaign-section"));
    const headingCount = standaloneSection?.querySelector(".deployment-section-heading h3 span");
    if (headingCount) headingCount.textContent = "14";
  }

  function addDeploymentTiles(root) {
    if (!root) return;
    const standaloneSection = Array.from(root.querySelectorAll(".deployment-register-section"))
      .find(section => !section.classList.contains("deployment-campaign-section"));
    const grid = standaloneSection?.querySelector(".deployment-tile-grid");
    if (!grid) return;
    [COLUMBO, SPECIAL_DELIVERY].forEach(mission => {
      const existing = grid.querySelector(`[data-added-deployment='${mission.code}']`);
      const shouldBeNew = mission.code === SPECIAL_DELIVERY.code && isNewSpecialDelivery();
      if (existing && existing.classList.contains("deployment-tile-new") !== shouldBeNew) {
        existing.replaceWith(buildAddedTile(mission));
      } else if (!existing) {
        grid.appendChild(buildAddedTile(mission));
      }
    });
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
    addDeploymentTiles(template.content);
    updateMissionHooks(template.content);

    deploymentTab.content = template.innerHTML;
  }

  function patchLivePage() {
    const live = document.getElementById("content");
    if (!live?.querySelector(".deployment-register-head")) return;
    removeContinuumNew(live);
    updateStandaloneCounts(live);
    addDeploymentTiles(live);
    updateMissionHooks(live);
  }

  function showRecordNavigation(show) {
    const dialog = document.getElementById("deployment-record-dialog");
    if (!dialog) return;
    dialog.querySelectorAll("[data-record-action='previous'], [data-record-action='next']")
      .forEach(button => { button.hidden = !show; });
  }

  function renderAddedRecord(mission) {
    const dialog = document.getElementById("deployment-record-dialog");
    const target = document.getElementById("deployment-record-content");
    const position = document.getElementById("deployment-record-position");
    if (!dialog || !target || !position) return;

    dialog.dataset.addedDeployment = mission.code;
    showRecordNavigation(false);
    position.textContent = `${mission.code.slice(2)} / 14`;
    const briefingParagraphs = Array.isArray(mission.briefing) ? mission.briefing : [mission.briefing];
    const isNew = mission.code === SPECIAL_DELIVERY.code && isNewSpecialDelivery();

    target.innerHTML = `
      <article class="deployment-record">
        <div class="deployment-record-art">
          <img src="${mission.image}" alt="Mission artwork for ${mission.title}" />
          <div class="deployment-record-art-grid" aria-hidden="true"></div>
          <div class="deployment-record-art-copy">
            <span>UFN FLEET COMMAND // MISSION RECORD</span>
            <strong>${mission.code}</strong>
          </div>
        </div>

        <div class="deployment-record-document">
          <div class="deployment-record-heading">
            <div>
              <span class="classification">UFN FLEET COMMAND // ACTIVE BRIEFING</span>
              <span class="micro-label">AVAILABLE DEPLOYMENT</span>
              <div class="deployment-record-title-line">
                <h3 id="deployment-record-title">${mission.title}</h3>
                ${isNew ? `<span class="deployment-record-new-badge" title="New deployment until ${newUntilLabel}">NEW DEPLOYMENT</span>` : ""}
              </div>
            </div>
            <div class="deployment-record-stamp${isNew ? " new-available" : ""}" aria-hidden="true">${isNew ? "NOW AVAILABLE" : "AUTHORISED"}</div>
          </div>

          <div class="deployment-record-meta">
            <div class="deployment-record-meta-cell"><span>RECORD</span><strong>${mission.code}</strong></div>
            <div class="deployment-record-meta-cell"><span>DEPLOYMENT</span><strong>STANDALONE</strong></div>
            <div class="deployment-record-meta-cell"><span>STATUS</span><strong>${isNew ? "NOW AVAILABLE" : "AVAILABLE NOW"}</strong></div>
            <div class="deployment-record-meta-cell"><span>ACCESS</span><strong>CREW AUTHORISED</strong></div>
          </div>

          <section class="deployment-record-briefing">
            <div class="deployment-record-section-title">
              <span class="micro-label">AUTHORISED CREW BRIEFING</span>
              <h4>Mission Briefing</h4>
            </div>
            ${briefingParagraphs.map(paragraph => `<p>${paragraph}</p>`).join("")}
          </section>

          <footer class="deployment-record-footer">
            <div>
              <span class="micro-label">ISSUING AUTHORITY</span>
              <strong>UNITED FEDERATED NAVY // FLEET COMMAND</strong>
            </div>
            <div>
              <span class="micro-label">DOCUMENT CONTROL</span>
              <strong>${mission.code} // REVIEW BEFORE DEPLOYMENT</strong>
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

  function refreshSpecialDeliveryStatus() {
    patchMarkupString();
    patchLivePage();
    const dialog = document.getElementById("deployment-record-dialog");
    if (dialog?.open && dialog.dataset.addedDeployment === SPECIAL_DELIVERY.code) {
      renderAddedRecord(SPECIAL_DELIVERY);
    }
  }

  const timeUntilExpiry = specialDeliveryNewUntil - Date.now();
  if (timeUntilExpiry > 0) {
    window.setTimeout(refreshSpecialDeliveryStatus, timeUntilExpiry + 1000);
  }
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) refreshSpecialDeliveryStatus();
  });

  document.addEventListener("click", event => {
    const addedTile = event.target.closest("[data-added-deployment]");
    if (addedTile) {
      event.preventDefault();
      const mission = addedTile.dataset.addedDeployment === SPECIAL_DELIVERY.code ? SPECIAL_DELIVERY : COLUMBO;
      renderAddedRecord(mission);
      return;
    }

    const normalTile = event.target.closest("[data-deployment-index]");
    if (normalTile) {
      const dialog = document.getElementById("deployment-record-dialog");
      if (dialog) delete dialog.dataset.addedDeployment;
      showRecordNavigation(true);
      queueMicrotask(stripContinuumRecordBadge);
      return;
    }

    const action = event.target.closest("[data-record-action]")?.dataset.recordAction;
    const dialog = document.getElementById("deployment-record-dialog");

    if (dialog?.dataset.addedDeployment && (action === "previous" || action === "next")) {
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
    if (dialog?.open && dialog.dataset.addedDeployment &&
        (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
})();
