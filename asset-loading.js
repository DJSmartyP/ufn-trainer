(() => {
  "use strict";

  const watched = new WeakSet();

  function hasSource(img) {
    return Boolean(img.currentSrc || img.getAttribute("src") || img.getAttribute("srcset"));
  }

  function markPending(img) {
    if (!hasSource(img)) return;
    img.classList.remove("ufn-asset-error");

    if (img.complete && img.naturalWidth > 0) {
      img.classList.remove("ufn-asset-loading");
      return;
    }

    img.classList.add("ufn-asset-loading");
  }

  function attach(img) {
    if (!(img instanceof HTMLImageElement)) return;

    if (!watched.has(img)) {
      watched.add(img);

      img.addEventListener("load", () => {
        img.classList.remove("ufn-asset-loading", "ufn-asset-error");
      });

      img.addEventListener("error", () => {
        img.classList.remove("ufn-asset-loading");
        img.classList.add("ufn-asset-error");
      });
    }

    markPending(img);
  }

  function scan(root) {
    if (root instanceof HTMLImageElement) attach(root);
    root.querySelectorAll?.("img").forEach(attach);
  }

  const observer = new MutationObserver(records => {
    records.forEach(record => {
      if (record.type === "childList") {
        record.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) scan(node);
        });
      } else if (
        record.type === "attributes" &&
        record.target instanceof HTMLImageElement
      ) {
        markPending(record.target);
      }
    });
  });

  scan(document);

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["src", "srcset"]
  });
})();
