(() => {
  "use strict";

  const aliases = {
    CAP: "captain", captain: "captain",
    HLM: "helms", helms: "helms",
    WPN: "weapons", weapons: "weapons",
    ENG: "engineering", engineering: "engineering",
    SCI: "science", science: "science",
    RLY: "relay", relay: "relay"
  };

  const icons = {
    captain: `
      <svg viewBox="0 0 64 64" class="station-icon-svg" aria-hidden="true" focusable="false">
        <path class="icon-gold-fill" d="M32 6.5l4.1 10.2 11 .7-8.4 7.1 2.7 10.7L32 29.3l-9.4 5.9 2.7-10.7-8.4-7.1 11-.7z"/>
        <path class="icon-gold-line" d="M17 40l15 10 15-10M17 49l15 10 15-10"/>
      </svg>`,
    helms: `
      <svg viewBox="0 0 64 64" class="station-icon-svg" aria-hidden="true" focusable="false">
        <circle class="icon-line-thin" cx="32" cy="32" r="23"/>
        <path class="icon-line-thin" d="M32 5v7M32 52v7M5 32h7M52 32h7"/>
        <path class="icon-blue-fill" d="M32 12l10 34-10-5-10 5z"/>
        <path class="icon-gold-fill" d="M32 16l3.2 19.5L32 33l-3.2 2.5z"/>
      </svg>`,
    weapons: `
      <svg viewBox="0 0 64 64" class="station-icon-svg" aria-hidden="true" focusable="false">
        <circle class="icon-line-thin" cx="32" cy="32" r="20"/>
        <path class="icon-line-thin" d="M32 5v10M32 49v10M5 32h10M49 32h10"/>
        <path class="icon-gold-fill" d="M32 13c4.8 5.6 7 12 7 18.5V44l-7 8-7-8V31.5C25 25 27.2 18.6 32 13z"/>
        <path class="icon-blue-fill" d="M25 36l-6 5v8l6-3M39 36l6 5v8l-6-3"/>
      </svg>`,
    engineering: `
      <svg viewBox="0 0 64 64" class="station-icon-svg" aria-hidden="true" focusable="false">
        <path class="icon-blue-fill" fill-rule="evenodd" d="M36.7 6l1.7 6.1c1.7.5 3.2 1.2 4.7 2l5.7-2.8 5 5-2.8 5.7c.8 1.5 1.5 3 2 4.7l6 1.7v7.1l-6 1.7c-.5 1.7-1.2 3.2-2 4.7l2.8 5.7-5 5-5.7-2.8c-1.5.8-3 1.5-4.7 2L36.7 58h-7.1l-1.7-6.1c-1.7-.5-3.2-1.2-4.7-2l-5.7 2.8-5-5 2.8-5.7c-.8-1.5-1.5-3-2-4.7l-6-1.7v-7.1l6-1.7c.5-1.7 1.2-3.2 2-4.7l-2.8-5.7 5-5 5.7 2.8c1.5-.8 3-1.5 4.7-2L29.6 6h7.1zM33.2 20a12 12 0 100 24 12 12 0 000-24z"/>
        <path class="icon-gold-line" d="M18 49l15-15M34 20a8 8 0 01-9 10l-8 8 9 9 8-8a8 8 0 0010-9l-6 6-7-7z"/>
      </svg>`,
    science: `
      <svg viewBox="0 0 64 64" class="station-icon-svg" aria-hidden="true" focusable="false">
        <circle class="icon-blue-fill" cx="32" cy="21" r="10"/>
        <path class="icon-line-thin" d="M17 21c4-5 10-8 18-8 6 0 11 1.6 14 4.3M15 25c6 4 13 6 21 6 7 0 12-1.6 16-4"/>
        <rect class="icon-line-thin" x="11" y="38" width="42" height="18" rx="3"/>
        <path class="icon-gold-line" d="M16 48h8l4-6 6 12 5-9 4 3h5"/>
      </svg>`,
    relay: `
      <svg viewBox="0 0 64 64" class="station-icon-svg" aria-hidden="true" focusable="false">
        <circle class="icon-gold-fill" cx="32" cy="16" r="5"/>
        <path class="icon-line" d="M32 21v8M24 55l8-26 8 26M27 44h10M24 55h16"/>
        <path class="icon-line-thin" d="M20 12c-5 4-8 9-8 15M44 12c5 4 8 9 8 15M15 7C8 12 4 19 4 27M49 7c7 5 11 12 11 20"/>
      </svg>`
  };

  function stationIcon(name, extraClass = "") {
    const key = aliases[name] || name;
    const svg = icons[key];
    if (!svg) return name || "";
    return `<span class="station-icon ${extraClass}" data-station="${key}">${svg}</span>`;
  }

  function hydrateStationIcons(root = document) {
    root.querySelectorAll("[data-station-icon]").forEach(host => {
      const key = aliases[host.dataset.stationIcon] || host.dataset.stationIcon;
      if (!icons[key]) return;
      host.classList.add("station-icon-host");
      host.innerHTML = icons[key];
    });
  }

  window.UFN_STATION_ICON = stationIcon;
  window.UFN_HYDRATE_STATION_ICONS = hydrateStationIcons;
  hydrateStationIcons(document);
})();
