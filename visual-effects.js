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
