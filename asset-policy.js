(() => {
  "use strict";

  /* UFN ASSET POLICY // CLEAN PERFORMANCE PASS
     Runs after content/deployments have registered their page markup but before
     app.js renders a route. This means heavy gallery/card images are marked as
     lazy + low priority before the browser ever sees them in the DOM.

     It also neutralises the legacy app.js behaviour that turns every image into
     eager loading and re-sets image src values after device rotation. */

  const CRITICAL_SELECTOR = [
    ".brand-mark",
    ".hero-emblem",
    "[fetchpriority='high']",
    "[data-ufn-eager='true']"
  ].join(",");

  const isCriticalImage = img => Boolean(img?.matches?.(CRITICAL_SELECTOR));

  /* These folders contain old PNG originals plus much smaller WebP copies.
     If an old PNG reference survives in authored markup, prefer the WebP.
     H.I.D.E.S. system emblem is excluded because no matching WebP currently
     exists in the repository. */
  const WEBP_FOLDERS = [
    "assets/screens/",
    "assets/stations/",
    "assets/supplies/",
    "assets/medals/",
    "assets/ranks/"
  ];

  const KNOWN_HIDES_WEBP = new Set([
    "drive-lock", "drive-decay", "fire-decay", "missile-scramble",
    "shield-collapse", "heat-surge", "grid-decay"
  ]);

  function preferWebp(src) {
    if (!src || typeof src !== "string" || !/\.png(?:[?#].*)?$/i.test(src)) return src;
    const clean = src.split(/[?#]/)[0];

    if (WEBP_FOLDERS.some(folder => clean.startsWith(folder))) {
      return src.replace(/\.png(?=([?#]|$))/i, ".webp");
    }

    if (clean.startsWith("assets/hides/")) {
      const name = clean.split("/").pop().replace(/\.png$/i, "");
      if (KNOWN_HIDES_WEBP.has(name)) {
        return src.replace(/\.png(?=([?#]|$))/i, ".webp");
      }
    }

    return src;
  }

  function normaliseImgTag(tag) {
    const critical = /class=(['"])[^'"]*\b(?:brand-mark|hero-emblem)\b[^'"]*\1/i.test(tag)
      || /fetchpriority=(['"])high\1/i.test(tag)
      || /data-ufn-eager=(['"])true\1/i.test(tag);

    let next = tag.replace(/src=(['"])([^'"]+)\1/i, (match, quote, src) => {
      return `src=${quote}${preferWebp(src)}${quote}`;
    });

    next = next.replace(/\sloading=(['"])(?:eager|lazy|auto)\1/ig, "");
    next = next.replace(/\sfetchpriority=(['"])(?:high|low|auto)\1/ig, "");
    next = next.replace(/\sdecoding=(['"])(?:sync|async|auto)\1/ig, "");

    const attrs = critical
      ? ' loading="eager" decoding="async" fetchpriority="high"'
      : ' loading="lazy" decoding="async" fetchpriority="low"';

    if (/\s*\/>$/.test(next)) return next.replace(/\s*\/>$/, `${attrs} />`);
    return next.replace(/>$/, `${attrs}>`);
  }

  function normaliseContentMarkup() {
    const content = window.UFN_CONTENT;
    if (!content || typeof content !== "object") return;

    Object.values(content).forEach(page => {
      if (!Array.isArray(page?.tabs)) return;
      page.tabs.forEach(tab => {
        if (typeof tab?.content !== "string") return;
        tab.content = tab.content.replace(/<img\b[^>]*>/gi, normaliseImgTag);
      });
    });
  }

  normaliseContentMarkup();

  /* app.js later performs img.loading = "eager" on every rendered image.
     Keep the assignment for critical imagery only. */
  try {
    const proto = HTMLImageElement.prototype;
    const loadingDescriptor = Object.getOwnPropertyDescriptor(proto, "loading");
    if (loadingDescriptor?.get && loadingDescriptor?.set && loadingDescriptor.configurable) {
      Object.defineProperty(proto, "loading", {
        configurable: true,
        enumerable: loadingDescriptor.enumerable,
        get() { return loadingDescriptor.get.call(this); },
        set(value) {
          const requested = String(value || "").toLowerCase();
          if (requested === "eager" && !isCriticalImage(this)) {
            try { this.fetchPriority = "low"; } catch (_) {}
            return loadingDescriptor.set.call(this, "lazy");
          }
          return loadingDescriptor.set.call(this, value);
        }
      });
    }
  } catch (_) {}

  /* Dynamically-created images (for example H.I.D.E.S. branding) can set src
     directly. Set a sensible loading/priority policy before their request is
     initiated. Also redirect known old PNG references to matching WebPs. */
  try {
    const proto = HTMLImageElement.prototype;
    const srcDescriptor = Object.getOwnPropertyDescriptor(proto, "src");
    const loadingDescriptor = Object.getOwnPropertyDescriptor(proto, "loading");
    if (srcDescriptor?.get && srcDescriptor?.set && srcDescriptor.configurable) {
      Object.defineProperty(proto, "src", {
        configurable: true,
        enumerable: srcDescriptor.enumerable,
        get() { return srcDescriptor.get.call(this); },
        set(value) {
          if (!isCriticalImage(this)) {
            try { loadingDescriptor?.set?.call(this, "lazy"); } catch (_) {}
            try { this.fetchPriority = "low"; } catch (_) {}
          }
          return srcDescriptor.set.call(this, preferWebp(String(value || "")));
        }
      });
    }
  } catch (_) {}

  /* Prevent app.js from registering only its legacy orientation image-reload
     callbacks. Normal resize/layout handling elsewhere remains untouched. */
  const nativeWindowAdd = window.addEventListener;
  window.addEventListener = function(type, listener, options) {
    const name = listener?.name || "";
    if (type === "resize" && name === "checkViewportOrientation") return;
    if (type === "orientationchange" && name === "recoverImagesAfterOrientationChange") return;
    return nativeWindowAdd.call(this, type, listener, options);
  };

  const orientation = window.screen?.orientation;
  let nativeOrientationAdd = null;
  if (orientation?.addEventListener) {
    nativeOrientationAdd = orientation.addEventListener;
    try {
      orientation.addEventListener = function(type, listener, options) {
        if (type === "change" && listener?.name === "recoverImagesAfterOrientationChange") return;
        return nativeOrientationAdd.call(this, type, listener, options);
      };
    } catch (_) {
      nativeOrientationAdd = null;
    }
  }

  /* app.js is the next synchronous script. Restore the public methods after it
     has registered its normal handlers. */
  setTimeout(() => {
    window.addEventListener = nativeWindowAdd;
    if (orientation && nativeOrientationAdd) {
      try { orientation.addEventListener = nativeOrientationAdd; } catch (_) {}
    }
  }, 0);
})();
