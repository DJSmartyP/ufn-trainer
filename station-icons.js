(() => {
  "use strict";

  const aliases = {
    CAP: "captain", captain: "captain",
    HLM: "helms", helms: "helms",
    WPN: "weapons", weapons: "weapons",
    ENG: "engineering", engineering: "engineering",
    SCI: "science", science: "science",
    RLY: "relay", relay: "relay",
    home: "directory", directory: "directory", "00": "directory",
    general: "general", briefing: "general", "01": "general"
  };

  const icons = {
    captain: "assets/stations/captain.webp",
    helms: "assets/stations/helms.webp",
    weapons: "assets/stations/weapons.webp",
    engineering: "assets/stations/engineering.webp",
    science: "assets/stations/science.webp",
    relay: "assets/stations/relay.webp",
    directory: "assets/stations/directory.webp",
    general: "assets/stations/general.webp"
  };

  function iconMarkup(key) {
    const src = icons[key];
    if (!src) return "";
    return `<img class="station-icon-image" src="${src}" alt="" draggable="false" />`;
  }

  function stationIcon(name, extraClass = "") {
    const key = aliases[name] || name;
    if (!icons[key]) return name || "";
    return `<span class="station-icon ${extraClass}" data-station="${key}">${iconMarkup(key)}</span>`;
  }

  function hydrateStationIcons(root = document) {
    root.querySelectorAll("[data-station-icon]").forEach(host => {
      const key = aliases[host.dataset.stationIcon] || host.dataset.stationIcon;
      if (!icons[key]) return;
      host.classList.add("station-icon-host");
      host.innerHTML = iconMarkup(key);
    });
  }

  window.UFN_STATION_ICON = stationIcon;
  window.UFN_HYDRATE_STATION_ICONS = hydrateStationIcons;
  hydrateStationIcons(document);
})();
