(() => {
  "use strict";

  const ICONS = Object.freeze({
    terminal: `
      <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <rect x="9" y="12" width="46" height="34" rx="4"></rect>
        <path d="M18 23l7 6-7 6"></path>
        <path d="M30 35h15"></path>
        <path d="M24 52h16"></path>
        <path d="M32 46v6"></path>
      </svg>`,
    intranet: `
      <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <circle cx="32" cy="32" r="21"></circle>
        <path d="M11 32h42M32 11c7 6 11 13 11 21S39 47 32 53M32 11c-7 6-11 13-11 21s4 15 11 21"></path>
        <circle cx="18" cy="22" r="3"></circle>
        <circle cx="46" cy="26" r="3"></circle>
        <circle cx="27" cy="44" r="3"></circle>
        <path d="M20.5 23.5l22.5 2M20 24l5.5 17.5M44 28l-14 14"></path>
      </svg>`
  });

  function fillIcon(host) {
    if (!host || host.dataset.connectedIconReady === "true") return;
    const key = host.dataset.connectedIcon;
    if (!ICONS[key]) return;
    host.innerHTML = ICONS[key];
    host.dataset.connectedIconReady = "true";
  }

  function identifyCard(card) {
    const href = card.getAttribute("href") || "";
    if (href.includes("terminal.ufn.systems")) return "terminal";
    if (href.includes("ufn.systems")) return "intranet";
    return null;
  }

  function enhanceHomeCards() {
    if (document.body.dataset.route !== "home") return;
    const section = document.querySelector("#content .network-services");
    if (!section) return;

    section.classList.add("connected-systems-showcase");
    const heading = section.querySelector(":scope > .section-heading");
    if (heading && heading.dataset.connectedHeading !== "true") {
      heading.dataset.connectedHeading = "true";
      const micro = heading.querySelector(".micro-label");
      const title = heading.querySelector("h2");
      const copy = heading.querySelector("p");
      if (micro) micro.textContent = "UFN NETWORK SERVICES // CONNECTED SYSTEMS";
      if (title) title.textContent = "Connected UFN Systems";
      if (copy) copy.textContent = "Direct access to live UFN operational and intelligence systems.";
    }

    section.querySelectorAll(".network-card").forEach(card => {
      if (card.dataset.connectedEnhanced === "true") return;
      const key = identifyCard(card);
      if (!key) return;

      card.dataset.connectedEnhanced = "true";
      card.dataset.connectedSystem = key;

      const copy = document.createElement("span");
      copy.className = "connected-system-card-copy";
      while (card.firstChild) copy.appendChild(card.firstChild);

      const icon = document.createElement("span");
      icon.className = "connected-system-card-icon";
      icon.dataset.connectedIcon = key;
      fillIcon(icon);

      const status = document.createElement("span");
      status.className = "connected-system-status";
      status.innerHTML = `<span aria-hidden="true"></span>${key === "terminal" ? "OPERATIONS ONLINE" : "INTRANET ONLINE"}`;

      card.append(icon, copy, status);
    });
  }

  function enhanceSidebar() {
    document.querySelectorAll("[data-connected-icon]").forEach(fillIcon);

    document.querySelectorAll(".connected-system-sidebar-link").forEach(link => {
      if (link.dataset.connectedBound === "true") return;
      link.dataset.connectedBound = "true";
      link.addEventListener("click", () => {
        document.getElementById("sidebar")?.classList.remove("open");
        document.getElementById("menu-button")?.setAttribute("aria-expanded", "false");
        const scrim = document.getElementById("nav-scrim");
        if (scrim) scrim.hidden = true;
      });
    });
  }

  function apply() {
    enhanceSidebar();
    enhanceHomeCards();
  }

  const content = document.getElementById("content");
  if (content) new MutationObserver(() => queueMicrotask(apply)).observe(content, { childList: true, subtree: true });
  window.addEventListener("hashchange", () => queueMicrotask(apply));
  apply();
})();
