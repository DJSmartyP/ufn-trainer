(() => {
  "use strict";

  const contentRoot = document.getElementById("content");
  const sidebar = document.getElementById("sidebar");
  if (!contentRoot || !sidebar) return;

  const FALLBACKS = Object.freeze({
    terminal: {
      title: "UFN Terminal",
      href: "#",
      micro: "CONNECTED SYSTEM",
      blurb: "Access authorised shipboard tools and support systems.",
      state: "CONFIGURE LINK"
    },
    intranet: {
      title: "UFN Intranet",
      href: "#",
      micro: "INTERNAL ACCESS",
      blurb: "Access internal records, notices and support resources.",
      state: "CONFIGURE LINK"
    }
  });

  function svgIcon(type) {
    if (type === "terminal") {
      return `
        <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
          <rect x="10" y="13" width="44" height="30" rx="4"></rect>
          <path d="M17 22l8 6-8 6"></path>
          <path d="M30 34h12"></path>
          <rect x="22" y="47" width="20" height="4" rx="2"></rect>
        </svg>`;
    }
    return `
      <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <circle cx="20" cy="20" r="5"></circle>
        <circle cx="44" cy="16" r="5"></circle>
        <circle cx="46" cy="42" r="5"></circle>
        <circle cx="18" cy="46" r="5"></circle>
        <circle cx="32" cy="31" r="6"></circle>
        <path d="M24 22l5 5"></path>
        <path d="M40 19l-4 7"></path>
        <path d="M42 39l-5-4"></path>
        <path d="M22 42l6-6"></path>
      </svg>`;
  }

  function findExistingLink(type) {
    const matcher = type === "terminal" ? /\bterminal\b/i : /\bintranet\b/i;
    const elements = Array.from(document.querySelectorAll('a[href], [data-external-link], [data-system-link]'));
    for (const element of elements) {
      const text = [element.textContent || "", element.getAttribute("aria-label") || "", element.getAttribute("title") || "", element.getAttribute("href") || ""].join(" ");
      if (!matcher.test(text)) continue;
      const href = element.getAttribute("href") || element.dataset.externalLink || element.dataset.systemLink || "#";
      return {
        title: type === "terminal" ? "UFN Terminal" : "UFN Intranet",
        href,
        micro: FALLBACKS[type].micro,
        blurb: FALLBACKS[type].blurb,
        state: href && href !== "#" ? "ONLINE" : "CONFIGURE LINK"
      };
    }
    return { ...FALLBACKS[type] };
  }

  function getSystemLinks() {
    return {
      terminal: findExistingLink("terminal"),
      intranet: findExistingLink("intranet")
    };
  }

  function buildHomeCard(type, config) {
    const externalAttrs = config.href && config.href !== "#" ? 'target="_blank" rel="noopener"' : '';
    return `
      <a class="system-card ${type}" href="${config.href}" ${externalAttrs}>
        <span class="system-card-icon">${svgIcon(type)}</span>
        <span class="system-card-copy">
          <span class="micro-label">${config.micro}</span>
          <strong>${config.title}</strong>
          <span class="system-card-blurb">${config.blurb}</span>
          <span class="system-card-action">${config.href && config.href !== "#" ? `Open ${config.title}` : "Set link URL"}</span>
        </span>
        <span class="system-card-state">${config.state}</span>
      </a>`;
  }

  function ensureHomeCards() {
    if (document.body.dataset.route !== "home") return;
    const pageHead = contentRoot.querySelector(":scope > .page-head");
    if (!pageHead) return;

    const links = getSystemLinks();
    let section = contentRoot.querySelector(":scope > [data-connected-systems='true']");
    if (!section) {
      section = document.createElement("section");
      section.className = "connected-systems-panel";
      section.dataset.connectedSystems = "true";
      pageHead.insertAdjacentElement("afterend", section);
    }

    section.innerHTML = `
      <div class="connected-systems-head">
        <span class="micro-label">CONNECTED UFN SYSTEMS</span>
        <h2>Terminal and Intranet Access</h2>
        <p>Quick access to connected systems used alongside the training portal.</p>
      </div>
      <div class="connected-systems-grid">
        ${buildHomeCard("terminal", links.terminal)}
        ${buildHomeCard("intranet", links.intranet)}
      </div>
    `;
  }

  function ensureSidebarLinks() {
    const links = getSystemLinks();
    let section = sidebar.querySelector('[data-sidebar-systems="true"]');
    if (!section) {
      section = document.createElement("div");
      section.className = "side-section side-section-systems";
      section.dataset.sidebarSystems = "true";
      const footer = sidebar.querySelector('.sidebar-footer');
      if (footer) sidebar.insertBefore(section, footer);
      else sidebar.appendChild(section);
    }

    section.innerHTML = `
      <span class="side-label">EXTERNAL SYSTEMS</span>
      <a class="nav-item nav-item-external" href="${links.terminal.href}" ${links.terminal.href !== '#' ? 'target="_blank" rel="noopener"' : ''}>
        <span class="nav-code nav-code-system" aria-hidden="true">⌘</span>
        <span class="nav-copy"><span>UFN Terminal</span><small>${links.terminal.state}</small></span>
      </a>
      <a class="nav-item nav-item-external" href="${links.intranet.href}" ${links.intranet.href !== '#' ? 'target="_blank" rel="noopener"' : ''}>
        <span class="nav-code nav-code-system" aria-hidden="true">◎</span>
        <span class="nav-copy"><span>UFN Intranet</span><small>${links.intranet.state}</small></span>
      </a>
    `;
  }

  function apply() {
    ensureSidebarLinks();
    ensureHomeCards();
  }

  new MutationObserver(() => queueMicrotask(apply)).observe(contentRoot, { childList: true, subtree: true });
  window.addEventListener("hashchange", () => queueMicrotask(apply));
  window.addEventListener("load", apply, { once: true });
  apply();
})();
