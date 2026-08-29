(() => {
  "use strict";

  const STYLE_ID = "ufn-hacking-outcome-style";
  const BOUND_ATTR = "data-outcome-enhanced";
  const ROMAN_GRADES = ["I", "II", "III", "IV"];

  function installStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #hacking-simulator-root .board {
        position: relative;
      }

      /* The old small result strip is replaced by the full-grid outcome panel. */
      #hacking-simulator-root #hack-result {
        display: none !important;
      }

      #hacking-simulator-root .hack-grid-outcome {
        position: absolute;
        inset: 0;
        z-index: 20;
        display: grid;
        place-items: center;
        padding: clamp(14px, 3vw, 30px);
        background: rgba(1, 6, 14, .84);
        backdrop-filter: blur(3px);
        -webkit-backdrop-filter: blur(3px);
        animation: hackOutcomeIn 160ms ease-out;
      }

      #hacking-simulator-root .hack-grid-outcome-panel {
        width: min(92%, 520px);
        padding: clamp(22px, 5vw, 38px);
        border: 1px solid rgba(105, 186, 255, .34);
        border-radius: 12px;
        background: linear-gradient(145deg, rgba(5, 17, 34, .97), rgba(1, 7, 16, .98));
        box-shadow: 0 22px 55px rgba(0, 0, 0, .55);
        text-align: center;
      }

      #hacking-simulator-root .hack-grid-outcome.success .hack-grid-outcome-panel {
        border-color: rgba(114, 240, 189, .62);
        box-shadow: 0 0 0 1px rgba(114, 240, 189, .09), 0 22px 55px rgba(0, 0, 0, .55), inset 0 0 42px rgba(40, 146, 102, .08);
      }

      #hacking-simulator-root .hack-grid-outcome.failure .hack-grid-outcome-panel {
        border-color: rgba(255, 99, 119, .62);
        box-shadow: 0 0 0 1px rgba(255, 99, 119, .09), 0 22px 55px rgba(0, 0, 0, .55), inset 0 0 42px rgba(146, 36, 51, .08);
      }

      #hacking-simulator-root .hack-outcome-kicker {
        display: block;
        margin-bottom: 8px;
        color: var(--blue-soft, #9adcfb);
        font-family: "Orbitron", "Rajdhani", sans-serif;
        font-size: clamp(.62rem, 1.8vw, .76rem);
        font-weight: 600;
        letter-spacing: .18em;
        text-transform: uppercase;
      }

      #hacking-simulator-root .hack-grid-outcome.success .hack-outcome-kicker,
      #hacking-simulator-root .hack-grid-outcome.success h2 {
        color: var(--success, #72f0bd);
      }

      #hacking-simulator-root .hack-grid-outcome.failure .hack-outcome-kicker,
      #hacking-simulator-root .hack-grid-outcome.failure h2 {
        color: var(--danger, #ff6377);
      }

      #hacking-simulator-root .hack-grid-outcome h2 {
        margin: 0;
        font-family: "Orbitron", "Rajdhani", sans-serif;
        font-size: clamp(1.45rem, 5vw, 2.7rem);
        line-height: 1.05;
        letter-spacing: .07em;
        text-transform: uppercase;
      }

      #hacking-simulator-root .hack-grid-outcome p {
        margin: 12px auto 0;
        max-width: 38rem;
        color: var(--muted, #91adbd);
        font-size: clamp(.88rem, 2vw, 1.02rem);
        line-height: 1.5;
      }

      #hacking-simulator-root .hack-outcome-actions {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 9px;
        margin-top: 20px;
      }

      #hacking-simulator-root .hack-outcome-actions .button {
        min-width: min(100%, 190px);
      }

      @keyframes hackOutcomeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @media (max-width: 520px) {
        #hacking-simulator-root .hack-grid-outcome {
          padding: 10px;
        }
        #hacking-simulator-root .hack-grid-outcome-panel {
          width: 96%;
          padding: 18px 14px;
        }
        #hacking-simulator-root .hack-outcome-actions {
          display: grid;
          grid-template-columns: 1fr;
        }
        #hacking-simulator-root .hack-outcome-actions .button {
          width: 100%;
          min-width: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function activeGame(root) {
    return root.querySelector('.practice-tab[data-game="mines"].active') ? "mines" : "lights";
  }

  function enforceAutoSolveRule(root) {
    const auto = root.querySelector("#hack-auto");
    const autoNote = root.querySelector("#hack-auto-note");
    if (!auto) return;

    const mines = activeGame(root) === "mines";
    if (mines) {
      auto.hidden = true;
      auto.disabled = true;
      if (autoNote) autoNote.hidden = true;
    }
  }

  function getGrade(root) {
    const options = [...root.querySelectorAll(".difficulty-option")];
    const activeIndex = options.findIndex(option => option.classList.contains("active"));
    return {
      options,
      activeIndex,
      gradeLabel: activeIndex >= 0 ? ROMAN_GRADES[activeIndex] : ""
    };
  }

  function clearOutcome(root) {
    root.querySelector(".hack-grid-outcome")?.remove();
  }

  function showOutcome(root, success) {
    const board = root.querySelector("#hack-board");
    const result = root.querySelector("#hack-result");
    if (!board || !result || result.hidden) {
      clearOutcome(root);
      return;
    }

    if (board.querySelector(".hack-grid-outcome")) return;

    const { options, activeIndex, gradeLabel } = getGrade(root);
    const hasAdjacentGrade = success
      ? activeIndex >= 0 && activeIndex < options.length - 1
      : activeIndex > 0;

    const overlay = document.createElement("div");
    overlay.className = `hack-grid-outcome ${success ? "success" : "failure"}`;
    overlay.setAttribute("role", "status");
    overlay.setAttribute("aria-live", "assertive");

    const panel = document.createElement("div");
    panel.className = "hack-grid-outcome-panel";

    const kicker = document.createElement("span");
    kicker.className = "hack-outcome-kicker";
    kicker.textContent = success ? "INTRUSION SUCCESS" : "INTRUSION FAILURE";

    const title = document.createElement("h2");
    title.textContent = success ? "ACCESS ESTABLISHED" : "CONNECTION TERMINATED";

    const message = document.createElement("p");
    if (success) {
      message.textContent = hasAdjacentGrade
        ? `Security Grade ${gradeLabel} cleared. Retry this grid or advance to the next security grade.`
        : `Security Grade ${gradeLabel} cleared. Maximum training grade completed.`;
    } else {
      message.textContent = hasAdjacentGrade
        ? `Security Grade ${gradeLabel} failed. Retry this grid or step back to the previous security grade.`
        : `Security Grade ${gradeLabel} failed. Retry the grid and re-establish the intrusion.`;
    }

    const actions = document.createElement("div");
    actions.className = "hack-outcome-actions";

    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "button secondary";
    retry.textContent = "Try Again";
    retry.addEventListener("click", event => {
      event.stopPropagation();
      root.querySelector("#hack-retry")?.click();
    });
    actions.appendChild(retry);

    if (hasAdjacentGrade) {
      const changeGrade = document.createElement("button");
      changeGrade.type = "button";
      changeGrade.className = "button primary";
      changeGrade.textContent = success ? "Try Next Grade" : "Try Previous Grade";
      changeGrade.addEventListener("click", event => {
        event.stopPropagation();
        const target = success ? options[activeIndex + 1] : options[activeIndex - 1];
        target?.click();
      });
      actions.appendChild(changeGrade);
    }

    panel.append(kicker, title, message, actions);
    overlay.appendChild(panel);
    board.appendChild(overlay);
  }

  function syncOutcome(root) {
    enforceAutoSolveRule(root);
    const result = root.querySelector("#hack-result");
    if (!result || result.hidden) {
      clearOutcome(root);
      return;
    }
    showOutcome(root, result.classList.contains("success"));
  }

  function enhance(root) {
    if (!root || root.getAttribute(BOUND_ATTR) === "true") return;
    const result = root.querySelector("#hack-result");
    if (!result) return;

    root.setAttribute(BOUND_ATTR, "true");
    enforceAutoSolveRule(root);

    const observer = new MutationObserver(() => {
      requestAnimationFrame(() => syncOutcome(root));
    });
    observer.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["class", "hidden", "aria-pressed"]
    });

    root.addEventListener("click", () => {
      requestAnimationFrame(() => syncOutcome(root));
    }, true);

    syncOutcome(root);
  }

  function scan() {
    installStyles();
    document.querySelectorAll("#hacking-simulator-root").forEach(enhance);
  }

  const pageObserver = new MutationObserver(scan);
  pageObserver.observe(document.documentElement, { subtree: true, childList: true });
  scan();
})();
