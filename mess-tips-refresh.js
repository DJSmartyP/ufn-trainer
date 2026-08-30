(() => {
  "use strict";

  const contentRoot = document.getElementById("content");
  if (!contentRoot) return;

  const NEW_TIPS = [
    {
      message: "If nobody scanned it, nobody knows what it is. ‘Probably fine’ is not a sensor classification.",
      person: "Lt. Priya Shah",
      role: "Science Officer"
    },
    {
      message: "A minefield is an obstacle, not a shortcut. If the route goes through the mines, find another route.",
      person: "Lt. Evan Rook",
      role: "Helms Officer"
    },
    {
      message: "Your cargo manifest is not public information. Especially not when the people asking are pirates.",
      person: "Sub Lt. Nia Clarke",
      role: "Relay Officer"
    },
    {
      message: "Before the jump, check the energy. The best destination in the sector is no use if the ship cannot reach it.",
      person: "Cmdr. Leila Morgan",
      role: "Engineering Officer"
    },
    {
      message: "An open channel is open. If you would not say it to the other ship directly, do not say it while the channel light is still on.",
      person: "Lt. Marcus Webb",
      role: "Communications Officer"
    },
    {
      message: "Arguments are rarely improved by incoming fire. Survive the crisis first; conduct the passionate debrief afterwards.",
      person: "Cmdr. Tessa Rowan",
      role: "Patrol Commander"
    },
    {
      message: "Remember: your Flight Controller can always hear you. Yes, even when you think you are talking quietly.",
      person: "Commodore Smarty",
      role: "Fleet Command"
    },
    {
      message: "Self-destruct is not a troubleshooting tool. Do not start thinking about it unless every less dramatic option has genuinely failed.",
      person: "Admiral Artemis Winstanley",
      role: "Admiralty"
    }
  ];

  function rankFromName(name = "") {
    const value = String(name).trim().toLowerCase();
    if (value.startsWith("admiral ")) return "admiral";
    if (value.startsWith("commodore ")) return "commodore";
    if (value.startsWith("cmdr.") || value.startsWith("commander ")) return "commander";
    if (value.startsWith("sub lt.") || value.startsWith("sub lieutenant ")) return "sub-lieutenant";
    if (value.startsWith("lt.") || value.startsWith("lieutenant ")) return "lieutenant";
    return "officer";
  }

  function applyRankColour(article) {
    const name = article?.querySelector("footer strong")?.textContent || "";
    article.dataset.rank = rankFromName(name);
  }

  function createTip({ message, person, role }) {
    const article = document.createElement("article");
    article.className = "mess-tip";

    const quote = document.createElement("p");
    quote.textContent = `“${message}”`;

    const footer = document.createElement("footer");
    const strong = document.createElement("strong");
    strong.textContent = person;
    const span = document.createElement("span");
    span.textContent = role;

    footer.append(strong, span);
    article.append(quote, footer);
    applyRankColour(article);
    return article;
  }

  function refreshMessTips() {
    if (document.body.dataset.route !== "general") return;

    const panel = contentRoot.querySelector('.tab-panel[data-panel="notices"]');
    if (!panel || panel.dataset.messRefreshApplied === "true") return;

    const board = panel.querySelector(".mess-board");
    if (!board) return;

    panel.dataset.messRefreshApplied = "true";

    // Rename the existing Science officer without changing the tip itself.
    board.querySelectorAll(".mess-tip footer strong").forEach(name => {
      if (name.textContent.trim() === "Lt. Amina Vale") {
        name.textContent = "Lt. Priya Shah";
      }
    });

    // Rank is the only visual hierarchy on the board. Every tip keeps the
    // same layout and weight; border/name colour changes with officer rank.
    board.querySelectorAll(".mess-tip").forEach(applyRankColour);

    // The old feature grid contained Lessons Heard Around the Fleet,
    // the Academy advert and the separate FC final word. Those are now
    // represented as officer tips in the main board.
    panel.querySelector(".mess-feature-grid")?.remove();

    NEW_TIPS.forEach(tip => board.appendChild(createTip(tip)));
  }

  let scheduled = false;
  function scheduleRefresh() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      refreshMessTips();
    });
  }

  const observer = new MutationObserver(scheduleRefresh);
  observer.observe(contentRoot, { childList: true, subtree: true });

  window.addEventListener("hashchange", scheduleRefresh);
  window.addEventListener("load", scheduleRefresh);
  scheduleRefresh();
})();
