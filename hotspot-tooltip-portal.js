(() => {
  "use strict";

  let activeHotspot = null;
  let portal = null;
  let clickPinned = false;
  let raf = 0;

  const ensurePortal = () => {
    if (portal) return portal;
    portal = document.createElement("div");
    portal.id = "ufn-hotspot-tooltip-portal";
    portal.className = "ufn-hotspot-tooltip-portal";
    portal.setAttribute("role", "tooltip");
    portal.setAttribute("aria-hidden", "true");
    document.body.appendChild(portal);
    return portal;
  };

  const sourcePopover = hotspot => hotspot?.querySelector(".screen-hotspot-popover");

  const positionPortal = () => {
    raf = 0;
    if (!activeHotspot || !portal || !portal.classList.contains("visible") || !activeHotspot.isConnected) return;

    const rect = activeHotspot.getBoundingClientRect();
    const margin = 10;
    const gap = 8;

    /* Temporarily keep it measurable while not flashing at an old position. */
    portal.style.visibility = "hidden";
    portal.style.left = "0px";
    portal.style.top = "0px";
    const tip = portal.getBoundingClientRect();

    const preferAbove = activeHotspot.classList.contains("popover-above");
    const alignLeftEdge = !activeHotspot.classList.contains("popover-left");

    let left = alignLeftEdge ? rect.left : rect.right - tip.width;
    left = Math.max(margin, Math.min(left, window.innerWidth - tip.width - margin));

    let top = preferAbove ? rect.top - tip.height - gap : rect.bottom + gap;

    if (!preferAbove && top + tip.height > window.innerHeight - margin) {
      top = rect.top - tip.height - gap;
    } else if (preferAbove && top < margin) {
      top = rect.bottom + gap;
    }

    top = Math.max(margin, Math.min(top, window.innerHeight - tip.height - margin));

    portal.style.left = `${Math.round(left)}px`;
    portal.style.top = `${Math.round(top)}px`;
    portal.style.visibility = "visible";
  };

  const schedulePosition = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(positionPortal);
  };

  const show = (hotspot, pinned = false) => {
    const source = sourcePopover(hotspot);
    if (!source) return;

    const p = ensurePortal();
    activeHotspot = hotspot;
    clickPinned = pinned;
    p.innerHTML = source.innerHTML;
    p.setAttribute("aria-hidden", "false");
    p.classList.add("visible");
    schedulePosition();
  };

  const hide = (force = false) => {
    if (!portal) return;
    if (clickPinned && !force) return;
    clickPinned = false;
    activeHotspot = null;
    portal.classList.remove("visible");
    portal.setAttribute("aria-hidden", "true");
    portal.style.visibility = "hidden";
  };

  /* Hover support without changing the console card's stacking level. */
  document.addEventListener("pointerover", event => {
    if (event.pointerType === "touch") return;
    const hotspot = event.target.closest?.(".screen-hotspot");
    if (!hotspot || hotspot.contains(event.relatedTarget)) return;
    if (!clickPinned) show(hotspot, false);
  });

  document.addEventListener("pointerout", event => {
    if (event.pointerType === "touch") return;
    const hotspot = event.target.closest?.(".screen-hotspot");
    if (!hotspot || hotspot.contains(event.relatedTarget)) return;
    if (!clickPinned && document.activeElement !== hotspot) hide(true);
  });

  /* Keyboard focus support. */
  document.addEventListener("focusin", event => {
    const hotspot = event.target.closest?.(".screen-hotspot");
    if (hotspot) show(hotspot, false);
  });

  document.addEventListener("focusout", event => {
    const hotspot = event.target.closest?.(".screen-hotspot");
    if (!hotspot) return;
    if (!clickPinned) hide(true);
  });

  /* Tap/click pins the tooltip until the same hotspot or elsewhere is tapped. */
  document.addEventListener("click", event => {
    const hotspot = event.target.closest?.(".screen-hotspot");
    if (hotspot) {
      event.preventDefault();
      if (activeHotspot === hotspot && clickPinned) hide(true);
      else show(hotspot, true);
      return;
    }
    if (clickPinned) hide(true);
  });

  window.addEventListener("resize", schedulePosition, { passive: true });
  window.addEventListener("scroll", schedulePosition, { passive: true, capture: true });

  /* Hide a pinned tooltip if navigation replaces its console. */
  const observer = new MutationObserver(() => {
    if (activeHotspot && !activeHotspot.isConnected) hide(true);
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
