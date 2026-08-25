(() => {
  "use strict";

  const aliases = {
    CAP: "captain", captain: "captain",
    HLM: "helms", helms: "helms",
    WPN: "weapons", weapons: "weapons",
    ENG: "engineering", engineering: "engineering",
    SCI: "science", science: "science",
    RLY: "relay", relay: "relay",
    home: "directory", directory: "directory",
    general: "briefing", briefing: "briefing"
  };

  const icons = {
    captain: "assets/stations/captain.png",
    helms: "assets/stations/helms.png",
    weapons: "assets/stations/weapons.png",
    engineering: "assets/stations/engineering.png",
    science: "assets/stations/science.png",
    relay: "assets/stations/relay.png",
    directory: "assets/stations/directory.png",
    briefing: "assets/stations/briefing.png"
  };

  function stationIcon(name, extraClass = "") {
    const key = aliases[name] || name;
    const src = icons[key];
    if (!src) return name || "";
    return `<span class="station-icon ${extraClass}" data-station="${key}"><img class="station-icon-image" src="${src}" alt="" loading="lazy" decoding="async"/></span>`;
  }

  function hydrateStationIcons(root = document) {
    root.querySelectorAll("[data-station-icon]").forEach(host => {
      const key = aliases[host.dataset.stationIcon] || host.dataset.stationIcon;
      if (!icons[key]) return;
      host.classList.add("station-icon-host");
      host.innerHTML = `<img class="station-icon-image" src="${icons[key]}" alt="" loading="lazy" decoding="async"/>`;
    });
  }

  window.UFN_STATION_ICON = stationIcon;
  window.UFN_HYDRATE_STATION_ICONS = hydrateStationIcons;
  hydrateStationIcons(document);
})();
