(() => {
  "use strict";

  /* PERFORMANCE PASS
     The portal previously forced every image to eager-load and then removed /
     restored image src values after orientation changes. On mobile browsers,
     especially foldables, that can cause unnecessary network/decode work and
     visible reloading. This guard keeps only genuinely critical images eager. */

  const isCriticalImage = img => Boolean(
    img?.matches?.('.brand-mark, .hero-emblem, [fetchpriority="high"], [data-ufn-eager="true"]')
  );

  /* Convert authored panel markup to native lazy loading before app.js renders
     it. Visible images still load immediately; images below the fold wait. */
  const content = window.UFN_CONTENT;
  if (content && typeof content === "object") {
    Object.values(content).forEach(page => {
      if (!Array.isArray(page?.tabs)) return;
      page.tabs.forEach(tab => {
        if (typeof tab?.content !== "string") return;
        tab.content = tab.content.replace(/\sloading=(['"])eager\1/g, ' loading="lazy"');
      });
    });

    const home = content.home?.tabs?.find(tab => tab.id === "directory");
    if (home?.content) {
      home.content = home.content.replace(
        /<img src="assets\/ufn-logo\.webp" alt="" class="hero-emblem"(?: loading="lazy")?\s*\/>/,
        '<img src="assets/ufn-logo.webp" alt="" class="hero-emblem" loading="eager" decoding="async" fetchpriority="high" />'
      );
    }
  }

  /* app.js assigns img.loading = "eager" after every route render. Preserve
     that call for critical assets only, and translate the rest to lazy. */
  try {
    const proto = HTMLImageElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(proto, "loading");
    if (descriptor?.get && descriptor?.set && descriptor.configurable) {
      Object.defineProperty(proto, "loading", {
        configurable: true,
        enumerable: descriptor.enumerable,
        get() {
          return descriptor.get.call(this);
        },
        set(value) {
          const requested = String(value || "").toLowerCase();
          const next = requested === "eager" && !isCriticalImage(this) ? "lazy" : value;
          return descriptor.set.call(this, next);
        }
      });
    }
  } catch (_) {
    /* Older browsers simply keep their native behaviour. */
  }

  /* Block only the legacy orientation image-recovery listeners registered by
     app.js. Layout resize/orientation CSS still works normally. */
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

  /* Restore the public event methods after the parser has executed the
     following scripts. The unwanted listeners have already been skipped. */
  setTimeout(() => {
    window.addEventListener = nativeWindowAdd;
    if (orientation && nativeOrientationAdd) {
      try { orientation.addEventListener = nativeOrientationAdd; } catch (_) {}
    }
  }, 0);
})();
