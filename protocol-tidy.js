(() => {
  "use strict";

  const content = window.UFN_CONTENT;
  const protocols = content?.general?.tabs?.find(tab => tab.id === "protocols");
  if (!protocols?.content) return;

  const headers = {
    "01": {
      category: "COMMUNICATIONS",
      title: "Comms Etiquette",
      icon: "assets/protocols/comms-etiquette.png",
      alt: "Communications protocol icon",
      tone: "comms"
    },
    "02": {
      category: "EMERGENCY SURVIVAL",
      title: "Escape Pod Teleportation",
      icon: "assets/protocols/escape-teleport.png",
      alt: "Emergency teleportation protocol icon",
      tone: "escape"
    },
    "03": {
      category: "FLIGHT COMMAND",
      title: "Flight Commander Support",
      icon: "assets/protocols/flight-command.png",
      alt: "Flight command support protocol icon",
      tone: "command"
    }
  };

  Object.entries(headers).forEach(([number, item]) => {
    const original = `<header><span>${number}</span><div><small>${item.category}</small><h3>${item.title}</h3></div></header>`;
    const replacement = `<header class="protocol-entry-head protocol-${item.tone}"><span class="protocol-icon-frame"><img class="protocol-icon" src="${item.icon}" alt="${item.alt}" loading="eager" decoding="async" /></span><div class="protocol-entry-title"><small>${item.category}</small><h3>${item.title}</h3></div></header>`;
    protocols.content = protocols.content.replace(original, replacement);
  });

  // Bring the Communications entry up to the same information density as the
  // other operational protocol records, using guidance already present in the
  // Relay training material.
  const originalComms = `<div class="protocol-entry-body"><p class="big-rule">Speak clearly. Speak briefly. Speak when it matters.</p><p><strong>Always sign off before closing comms.</strong> Closing the communications window will also close any active voice communications. Routine communications can be handled by the station officer. Escalate to the Captain when the information changes mission priorities, risk or tactical decisions.</p></div>`;
  const expandedComms = `<div class="protocol-entry-body"><p class="big-rule">Speak clearly. Speak briefly. Speak when it matters.</p><p>Routine communications can be handled by the station officer. Escalate to the Captain when an exchange changes mission priorities, risk or tactical decisions.</p><div class="protocol-checks"><p><strong>Confirm the contact:</strong> Check the selected callsign before opening communications so the channel is going to the intended ship or station.</p><p><strong>Pass on decisions:</strong> Relay any instruction, agreement or new operational information that affects the crew to the Captain promptly.</p><p><strong>Close correctly:</strong> Always sign off before closing comms. Closing the communications window will also close any active voice communications.</p></div><p><strong>Clear information is useful information.</strong></p></div>`;
  protocols.content = protocols.content.replace(originalComms, expandedComms);
})();
