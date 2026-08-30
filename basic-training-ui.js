(() => {
  "use strict";

  const content = window.UFN_CONTENT;
  const basicTraining = content?.general;
  const contentRoot = document.getElementById("content");
  if (!basicTraining || !contentRoot) return;

  const GROUPS = Array.isArray(basicTraining.tabGroups) ? basicTraining.tabGroups : [];
  const tabsById = new Map((basicTraining.tabs || []).map(tab => [tab.id, tab]));

  function currentTabId() {
    const raw = location.hash.replace(/^#\/?/, "");
    const [route, tab] = raw.split("/");
    if (route !== "general") return null;
    return tabsById.has(tab) ? tab : (basicTraining.tabs?.[0]?.id || null);
  }

  function groupForTab(tabId) {
    return GROUPS.find(group => group.tabs.includes(tabId)) || GROUPS[0] || null;
  }

  function groupFromButton(button) {
    const explicit = button.dataset.basicGroup;
    if (explicit) return GROUPS.find(group => group.id === explicit) || null;
    const label = button.textContent.trim();
    return GROUPS.find(group => group.label === label) || null;
  }

  function firstValidTab(group) {
    return group?.tabs?.find(id => tabsById.has(id)) || basicTraining.tabs?.[0]?.id || null;
  }

  function makeBasicIcon() {
    const figure = document.createElement("figure");
    figure.className = "basic-training-title-emblem";
    const img = document.createElement("img");
    img.src = "assets/stations/general.webp";
    img.alt = "";
    img.loading = "eager";
    img.decoding = "async";
    figure.appendChild(img);
    return figure;
  }

  function wrapCopy(candidate, selector = null) {
    if (selector) {
      const existing = candidate.querySelector(selector);
      if (existing) {
        existing.classList.add("basic-training-title-copy");
        return existing;
      }
    }

    const copy = document.createElement("div");
    copy.className = "basic-training-title-copy";
    while (candidate.firstChild) copy.appendChild(candidate.firstChild);
    candidate.appendChild(copy);
    return copy;
  }

  function makeFallbackTitle(panel, tab, group) {
    const header = document.createElement("div");
    header.className = "basic-training-titlebar basic-training-titlebar-fallback";
    header.dataset.basicTitlebar = "true";

    const copy = document.createElement("div");
    copy.className = "basic-training-title-copy";

    const small = document.createElement("span");
    small.className = "micro-label";
    small.textContent = `BASIC TRAINING // ${group?.label?.toUpperCase() || "REFERENCE"}`;

    const title = document.createElement("h2");
    title.textContent = tab?.label || "Basic Training";

    copy.append(small, title);
    header.append(makeBasicIcon(), copy);
    panel.prepend(header);
  }

  function brandPanel(panel, tabId, group) {
    if (!panel || panel.dataset.basicTitlebarApplied === "true") return;
    panel.dataset.basicGroup = group?.id || "";

    /* H.I.D.E.S. deliberately keeps its own authorised system emblem/titlebar. */
    if (tabId === "hides-guide") {
      panel.dataset.basicTitlebarApplied = "true";
      return;
    }

    const candidate = panel.querySelector(
      ":scope > .section-heading, :scope > .document-banner, :scope > .deployment-register-head"
    );

    if (!candidate) {
      makeFallbackTitle(panel, tabsById.get(tabId), group);
      panel.dataset.basicTitlebarApplied = "true";
      return;
    }

    candidate.classList.add("basic-training-titlebar");
    candidate.dataset.basicTitlebar = "true";
    candidate.dataset.basicGroup = group?.id || "";

    if (candidate.classList.contains("section-heading")) {
      wrapCopy(candidate);
      candidate.prepend(makeBasicIcon());
    } else if (candidate.classList.contains("document-banner")) {
      wrapCopy(candidate, ":scope > div");
      candidate.prepend(makeBasicIcon());
      candidate.classList.add("basic-training-titlebar-action");
    } else if (candidate.classList.contains("deployment-register-head")) {
      wrapCopy(candidate, ":scope > div");
      candidate.prepend(makeBasicIcon());
      candidate.classList.add("basic-training-titlebar-metrics");
    }

    panel.dataset.basicTitlebarApplied = "true";
  }

  function decorateNavigation() {
    if (document.body.dataset.route !== "general") return;

    const tabId = currentTabId();
    const group = groupForTab(tabId);
    if (!group) return;

    document.body.dataset.basicTrainingGroup = group.id;

    contentRoot.querySelectorAll(".briefing-primary-tab").forEach(button => {
      const buttonGroup = GROUPS.find(g => g.label === button.textContent.trim());
      if (!buttonGroup) return;
      button.dataset.basicGroup = buttonGroup.id;
      button.setAttribute("aria-current", buttonGroup.id === group.id ? "true" : "false");
    });

    const secondary = contentRoot.querySelector(".briefing-nav-secondary");
    if (secondary) {
      secondary.dataset.parentGroup = group.id;
      secondary.dataset.parentLabel = group.label.toUpperCase();
    }

    const panel = contentRoot.querySelector(".tab-panel");
    brandPanel(panel, tabId, group);
  }

  /* Primary category buttons always open their first child page.
     Capture phase prevents the generic tab click handler from retaining a
     previously selected child page. */
  document.addEventListener("click", event => {
    const button = event.target.closest?.("#content .briefing-primary-tab");
    if (!button) return;

    const group = groupFromButton(button);
    const firstTab = firstValidTab(group);
    if (!group || !firstTab) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const next = `#/general/${firstTab}`;
    if (location.hash === next) {
      window.dispatchEvent(new Event("hashchange"));
    } else {
      location.hash = next;
    }
  }, true);

  const observer = new MutationObserver(() => queueMicrotask(decorateNavigation));
  observer.observe(contentRoot, { childList: true, subtree: true });

  window.addEventListener("hashchange", () => queueMicrotask(decorateNavigation));
  decorateNavigation();
})();
