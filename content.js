(() => {
  const stationIcon = (name, extraClass = "") => window.UFN_STATION_ICON ? window.UFN_STATION_ICON(name, extraClass) : name;

  const screenPlaceholder = (station, note = "Station console capture pending.") => `
    <div class="screen-placeholder" role="img" aria-label="${station} console screenshot placeholder">
      <div class="screen-scanlines"></div>
      <div class="screen-reticle"></div>
      <div class="screen-placeholder-copy">
        <span class="placeholder-code">VISUAL REFERENCE // PENDING</span>
        <strong>${station.toUpperCase()} CONSOLE ORIENTATION</strong>
        <p>${note}</p>
      </div>
    </div>`;

  const SCREEN_HOTSPOTS = {
    helms: [
      ["Ship readouts", 1.2, 11.2, 15.2, 13.2, "Energy, heading and current speed. Check these before and during manoeuvres so you know what the ship is actually doing."],
      ["Propulsion controls", 1.1, 55.0, 18.2, 32.0, "Impulse controls normal forward/reverse speed. Warp or Jump appears beside it when fitted. Jump distance is set before pressing Jump."],
      ["Short-range radar", 25.0, 5.0, 50.0, 90.0, "Press or drag on the radar to command a heading. Use contacts, waypoints and visible weapon arcs to position the ship for the crew."],
      ["Docking", 1.1, 92.3, 18.0, 5.8, "Request Dock becomes available when a compatible friendly or neutral target is close enough. Helms also controls undocking."],
      ["Combat manoeuvre", 81.0, 74.0, 18.0, 23.0, "If fitted, this control provides forward boost and lateral strafe. It is limited, recharges over time and can generate substantial system heat."],
      ["H.I.D.E.S. status", 82.6, 12.8, 16.3, 23.0, "Shows the ship's current intrusion state. If a Helms intrusion appears, open the H.I.D.E.S. reference for Drive Lock or Drive Decay clearance information."]
    ],
    weapons: [
      ["Ship readouts", 1.2, 11.3, 15.2, 13.2, "Energy plus front and rear shield strength. Watch shield state while fighting and coordinate power concerns with Engineering."],
      ["Ordnance and tubes", 1.0, 59.0, 22.0, 38.0, "Select an ordnance type, load an available tube, then fire the loaded tube. Tube direction matters, so coordinate the firing solution with Helms."],
      ["Target radar", 25.0, 5.0, 50.0, 90.0, "Select a target on the short-range radar. Guided missiles use the selected target and beams automatically fire when that target is inside a firing arc."],
      ["Missile aim lock", 61.3, 2.0, 9.0, 6.8, "Use Lock to switch between target-linked missile aiming and manual tube aiming when the tactical situation requires it."],
      ["Beam information", 81.3, 70.0, 17.8, 27.0, "Choose hull or a subsystem as the beam target and set beam frequency when frequency mechanics are active. Science can provide useful frequency data."],
      ["H.I.D.E.S. status", 82.6, 12.8, 16.3, 23.0, "Shows current intrusion state. Weapons intrusions include Fire Decay, Missile Scramble and Shield Collapse."]
    ],
    engineering: [
      ["Ship status", 1.2, 11.2, 15.2, 24.0, "Energy trend, hull, shields and total coolant capacity. Use these to judge whether the ship is stable or entering a resource crisis."],
      ["Self destruct", 1.2, 2.6, 15.0, 5.3, "Emergency control only. Activation requires confirmation. Do not use unless command has deliberately ordered destruction of the ship."],
      ["Internal ship view", 36.0, 2.5, 29.0, 41.0, "Shows system rooms and repair crews. Select or dispatch repair capability to damaged systems using the engineering controls."],
      ["System rows", 17.0, 48.0, 47.5, 49.0, "Each installed system has health, heat, requested power and coolant information. Select a row before using the large power/coolant controls."],
      ["Power and coolant", 65.8, 53.7, 17.0, 43.5, "Allocate power to change system output and coolant to control heat. More than 100% power improves performance but increases heat and, except for the reactor, energy draw."],
      ["H.I.D.E.S. status", 82.6, 12.8, 16.3, 23.0, "Shows current intrusion state. Engineering intrusions include Heat Surge and Grid Decay."]
    ],
    science: [
      ["Long-range radar", 13.0, 0.5, 56.0, 98.0, "Your main sensor picture. Track contacts, hazards, nebula blind spots and changes in the sector, then report information that changes the crew's decisions."],
      ["Probe / Radar / Database", 1.2, 81.0, 13.2, 16.0, "Probe View uses a Relay-linked probe. Radar returns to the ship's sensors. Database opens reference information on known ships, weapons and hazards."],
      ["Scan control", 82.5, 18.2, 16.0, 6.5, "Select a scannable contact on the radar, then press Scan. Complete the sensor alignment to increase the target's scan state."],
      ["Target information", 82.5, 24.8, 16.0, 28.0, "Displays callsign, distance, bearing, relative speed, faction, type, shields and hull as the target becomes sufficiently scanned."],
      ["Radar zoom", 82.2, 91.6, 16.8, 6.0, "Change displayed sensor range. Zoom in to separate nearby contacts; zoom out for broader situational awareness."]
    ],
    relay: [
      ["Comms / cyber controls", 1.1, 5.5, 15.8, 32.0, "Select a contact first. From here Relay can open communications, begin an eligible hack, link an owned probe to Science, place waypoints and launch probes."],
      ["Reputation and clock", 1.1, 38.0, 15.8, 10.0, "Reputation can be spent on some support requests. The mission clock helps track timed orders, deadlines and the sequence of events."],
      ["Sector map", 18.0, 3.0, 63.5, 88.0, "Pan and zoom the strategic map, select contacts, place routes and monitor hazards plus sensor coverage shared by friendly assets."],
      ["Selected contact / Call FC", 82.5, 16.5, 16.0, 18.0, "Shows selected callsign and faction when known. Call FC is available when the crew needs guidance, reinforcement, supply, clarification or extraction."],
      ["Zoom", 1.0, 86.5, 16.0, 7.0, "Changes sector-map scale. Zoom in for precise waypoint placement and local detail; zoom out for route planning."],
      ["Alert level", 81.5, 86.8, 17.5, 7.0, "Sets the ship's alert posture when ordered or required by mission procedure."],
      ["Ship log", 1.0, 94.5, 98.0, 5.0, "Records mission and ship messages. Use it to recover a missed message or reconstruct recent events."]
    ]
  };

  const screenReference = (station, src, alt) => {
    const hotspots = SCREEN_HOTSPOTS[String(station).toLowerCase()] || [];
    return `
    <figure class="console-reference">
      <div class="console-image-frame interactive-console-frame">
        <img src="${src}" alt="${alt}" loading="lazy" />
        <div class="screen-hotspots" aria-label="Interactive ${station} console guide">
          ${hotspots.map(([label,x,y,w,h,text]) => `
            <button class="screen-hotspot ${y > 67 ? "popover-above" : ""} ${x > 72 ? "popover-left" : ""}" type="button" style="--x:${x}%;--y:${y}%;--w:${w}%;--h:${h}%;" aria-label="${label}: ${text}">
              <span class="screen-hotspot-popover"><strong>${label}</strong><span>${text}</span></span>
            </button>`).join("")}
        </div>
      </div>
      <figcaption><span><span class="micro-label">LIVE BRIDGE REFERENCE</span><small>Hover, focus or tap highlighted areas for instructions.</small></span><strong>${station.toUpperCase()} CONSOLE</strong></figcaption>
    </figure>`;
  };

  const factionMark = (src, alt, variant = "") => `<span class="faction-mark ${variant}"><img src="${src}" alt="${alt}" loading="lazy" /></span>`;

  const infoCard = (title, body, tone = "") => `
    <article class="info-card ${tone}">
      <h3>${title}</h3>
      ${body}
    </article>`;

  const controlTone = (type) => {
    const category = String(type || "").toUpperCase();
    if (category.includes("EMERGENCY")) return "alert";
    if (category.includes("HAZARD") || category.includes("CAUTION")) return "caution";
    if (category.includes("COMMAND") || category.includes("UFN COMMUNICATION") || category.includes("ESCALATION")) return "command";
    if (category.includes("CONTROL") || category.includes("SELECTOR") || category.includes("SETTING") || category.includes("AIM")) return "action";
    return "info";
  };

  const controlCard = (title, type, body, tone = "") => `
    <article class="control-guide-card ${controlTone(type)}">
      <span class="control-type">${type}</span>
      <h3>${title}</h3>
      ${body}
    </article>`;

  const hidesCard = (title, station, status, effectLine, summary, cleared, rows, columns) => `
    <details class="hides-incident">
      <summary>
        <span class="hides-summary-copy">
          <span class="control-type">${station} // ${status}</span>
          <strong>${title}</strong>
          <small>${effectLine}</small>
        </span>
        <span class="hides-expand">LEVELS I–V</span>
      </summary>
      <div class="hides-incident-body">
        <div class="hides-effect-copy">${summary}${cleared ? `<div class="hides-cleared"><strong>WHEN CLEARED</strong>${cleared}</div>` : ""}</div>
        <div class="hides-level-table-wrap">
          <table class="hides-level-table">
            <thead><tr>${columns.map(c => `<th>${c}</th>`).join("")}</tr></thead>
            <tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>
          </table>
        </div>
      </div>
    </details>`;

  const payloadCard = (name, contents, effect) => `
    <article class="payload-card">
      <span class="control-type">SUPPLY MODULE</span>
      <h3>${name}</h3>
      <strong>${contents}</strong>
      <p>${effect}</p>
    </article>`;

  const playFlow = (_title, tips) => `
    <section class="play-flow">
      <span class="micro-label">HOW TO PLAY THIS STATION</span>
      <h2>Top Tips</h2>
      <ul>${tips.map(tip => `<li><p>${tip}</p></li>`).join("")}</ul>
    </section>`;

  const supportFlow = (title, steps) => `
    <section class="play-flow support-flow">
      <span class="micro-label">FLEET SUPPORT PROCEDURE</span>
      <h2>${title}</h2>
      <ol>${steps.map((step, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><p>${step}</p></li>`).join("")}</ol>
    </section>`;

  const stationIntro = (code, title, summary) => `
    <div class="station-intro-card">
      <span class="station-monogram station-icon-host">${stationIcon(code)}</span>
      <div><span class="micro-label">PRIMARY RESPONSIBILITY</span><h3>${title}</h3><p>${summary}</p></div>
    </div>`;

  const content = {
    home: {
      eyebrow: "UFN FLEET COMMAND",
      title: "Crew Operations Network",
      subtitle: "Select your assigned station for console reference, operational procedures and authorised practice systems.",
      tabs: [{
        id: "directory", label: "Station Directory", content: `
          <section class="hero-panel">
            <div>
              <span class="classification">CREW ACCESS // FRONTIER OPERATIONS</span>
              <h2>SHIPBOARD OPERATIONS TERMINAL</h2>
              <p>A ship fights as a single unit. Captain sets intent. Helms positions. Weapons strikes. Engineering sustains. Science informs. Relay connects.</p>
              <div class="hero-actions">
                <button class="button primary" type="button" data-nav="general">Open Sector Briefing</button>
                <a class="button secondary" href="assets/UFN-Sector-Briefing.pdf" target="_blank" rel="noopener">Open Intelligence Packet</a>
              </div>
            </div>
            <img src="assets/ufn-logo.jpg" alt="" class="hero-emblem" />
          </section>
          <section class="station-grid" aria-label="Duty stations">
            <button class="station-card captain" type="button" data-nav="captain"><span class="station-card-code station-icon-host">${stationIcon("captain")}</span><strong>Captain</strong><span>Mission direction, priorities and final tactical decisions.</span></button>
            <button class="station-card helms" type="button" data-nav="helms"><span class="station-card-code station-icon-host">${stationIcon("helms")}</span><strong>Helms</strong><span>Movement, positioning, docking and propulsion.</span></button>
            <button class="station-card weapons" type="button" data-nav="weapons"><span class="station-card-code station-icon-host">${stationIcon("weapons")}</span><strong>Weapons</strong><span>Targeting, missiles, beams and shields.</span></button>
            <button class="station-card engineering" type="button" data-nav="engineering"><span class="station-card-code station-icon-host">${stationIcon("engineering")}</span><strong>Engineering</strong><span>Power, coolant, heat and repairs.</span></button>
            <button class="station-card science" type="button" data-nav="science"><span class="station-card-code station-icon-host">${stationIcon("science")}</span><strong>Science</strong><span>Long-range awareness, scanning and analysis.</span></button>
            <button class="station-card relay" type="button" data-nav="relay"><span class="station-card-code station-icon-host">${stationIcon("relay")}</span><strong>Relay</strong><span>Sector map, probes, communications and intrusion.</span></button>
          </section>
          <section class="network-services" aria-label="UFN network services">
            <div class="section-heading compact"><span class="micro-label">UFN NETWORK SERVICES</span><h2>Fleet Access</h2><p>Authorised crew systems available outside the bridge console.</p></div>
            <div class="network-grid">
              <a class="network-card" href="https://terminal.ufn.systems/" target="_blank" rel="noopener noreferrer">
                <span class="control-type">CREW OPERATIONS</span>
                <strong>Terminal</strong>
                <p>The main crew access point for finding assignments and checking mission records.</p>
                <span class="network-action">OPEN TERMINAL ↗</span>
              </a>
              <a class="network-card" href="https://ufn.systems/" target="_blank" rel="noopener noreferrer">
                <span class="control-type">FLEET INTELLIGENCE</span>
                <strong>UFN Intranet</strong>
                <p>Access the UFN intelligence database and Fleet Despatches detailing recent missions.</p>
                <span class="network-action">OPEN INTRANET ↗</span>
              </a>
            </div>
          </section>
          <div class="callout-strip"><strong>FRONTIER RULE:</strong><span>When information is incomplete, communicate what you know, what you do not know, and what changed.</span></div>
        `
      }]
    },

    general: {
      eyebrow: "UFN INTELLIGENCE DIRECTORATE",
      title: "General Sector Briefing",
      subtitle: "Restricted crew briefing for frontier operations. Mission era: Year 2247 - Frontier Expansion Era.",
      tabs: [
        { id: "briefing", label: "Admiralty Briefing", content: `
          <div class="document-banner">
            <div><span class="classification">RESTRICTED // UFN-INT-BRF-01</span><h2>ADMIRALTY DIRECTIVE</h2><p>Issued to officers assigned to UFN exploratory and patrol operations within the outer sectors.</p></div>
            <a class="button secondary" href="assets/UFN-Sector-Briefing.pdf" target="_blank" rel="noopener">View Original Packet</a>
          </div>
          <article class="directive-copy">
            <p>Recent developments have forced UFN Intelligence to compile the sector briefing dossier. It outlines the current strategic situation within this region of space, including known allied forces, emerging hostile actors, and developing threats under active investigation.</p>
            <p>Over the past cycle, unexplained incidents have resulted in the loss of vessels, installations and long-range patrol groups operating beyond established navigation corridors. Intelligence reports indicate hostile forces employing technologies and tactics not previously observed within known operational theatres.</p>
            <p>Many details remain incomplete. The stability of the sector cannot be taken for granted. The United Federated Navy was founded to explore, protect and unite the systems under its watch; crews operating at the frontier must make decisions with limited intelligence and evolving circumstances.</p>
            <p><strong>Trust your training. Trust your crew.</strong></p>
            <blockquote>“Let’s Begin.”<br><span>Admiral of the Fleet Artemis Winstanley, UFN Fleet Command</span></blockquote>
          </article>
          <div class="meta-grid">
            ${infoCard("Packet Classification", `<p><strong>Clearance:</strong> Restricted</p><p><strong>Distribution:</strong> Fleet Command Personnel</p><p><strong>Sector:</strong> Frontier Regions</p>`)}
            ${infoCard("Strategic Context", `<p>Completed following initial reports of unidentified hostile incursions beyond established human territory.</p>`)}
            ${infoCard("Guiding Principle", `<p>Knowledge is the first defence.</p>`, "gold")}
          </div>
        `},
        { id: "stations", label: "Duty Stations", content: `
          <div class="section-heading"><span class="micro-label">STANDARD BRIDGE COMPLEMENT</span><h2>Shipboard Duty Stations</h2><p>Frontier operations depend on each station understanding its own responsibilities and the information required by the rest of the bridge.</p></div>
          <div class="duty-list">
            ${infoCard("Captain", `<p>Directs the ship’s mission, sets priorities, co-ordinates the crew and makes the final tactical decisions in combat. A strong Captain trusts the team to operate their stations and maintains enough understanding of every role to keep the ship acting as one unit.</p>`)}
            ${infoCard("Helms", `<p>Controls heading, impulse speed, warp or jump travel, docking and undocking, close manoeuvring and - on equipped vessels - combat manoeuvre systems. Helms positions the ship so targets remain inside useful weapons arcs.</p>`)}
            ${infoCard("Weapons", `<p>Selects targets, manages beam weapons, loads and fires missiles, raises and modulates shields, and can target specific enemy subsystems. Weapons works closely with Helms for firing arcs and Science for target intelligence.</p>`)}
            ${infoCard("Engineering", `<p>Routes power across ship systems, allocates coolant to control overheating and dispatches repair crews when systems or hull are damaged.</p>`)}
            ${infoCard("Science", `<p>Maintains long-range situational awareness, interprets interference and anomalies, conducts scans and deep scans, and uses the ship database for intelligence on vessels, weapons and hazards.</p>`)}
            ${infoCard("Relay", `<p>Manages the sector map, launches probes, sets waypoints and handles communications with ships and stations. Relay can request support, rearmament and other assistance from friendly assets.</p>`)}
          </div>
          <div class="callout-strip"><strong>UFN TRAINING PRINCIPLE:</strong><span>A ship fights as a single unit. Captain sets intent. Helms positions. Weapons strikes. Engineering sustains. Science informs. Relay connects.</span></div>
        `},
        { id: "allies", label: "Allied Forces", content: `
          <div class="section-heading"><span class="micro-label">SECTION I</span><h2>Allied Forces</h2><p>Friendly organisations operating across human space and the frontier.</p></div>
          <div class="dossier-stack">
            <details class="dossier ally" open><summary>${factionMark("assets/factions/ufn-allied.png", "United Federated Navy emblem", "ufn-allied-mark")}<strong>United Federated Navy</strong><em>Primary human military power</em></summary><div class="dossier-body">
              <div><h4>Overview</h4><p>The UFN serves as the primary defence force of the United Federated Nations, operating across the core worlds and beyond. Formed from Earth’s major national fleets, it protects human space and UFN interests from external threats and serves as a stabilising presence within established territories.</p><h4>Fleet characteristics</h4><ul><li>Battleships and heavy cruisers</li><li>Warships upgraded for long-duration missions</li><li>Multi-role carrier strike groups</li><li>Armoured forward operating stations</li></ul></div>
              <div><h4>Role in human space</h4><ul><li>Protection of inner colonies and trade routes</li><li>Patrolling and securing the frontier</li><li>Escorting civilian traffic in unstable regions</li><li>Peacekeeping missions as needed</li></ul><h4>Relationships</h4><p>Coordinates closely with the Terran Space Navy, operates alongside Commonwealth United Forces, and co-operates with civilian organisations including the Independent Traders Guild.</p><h4>Current priorities</h4><p>Heightened readiness around outer colonies and trade routes; border patrols; defence of remote stations and outposts; co-ordinated responses to rising pirate and raider activity.</p></div>
            </div></details>
            <details class="dossier ally"><summary>${factionMark("assets/factions/tsn.png", "Terran Space Navy emblem")}<strong>Terran Space Navy</strong><em>Earth-Moon defence force</em></summary><div class="dossier-body">
              <div><h4>Overview</h4><p>The TSN is the primary defence force for the Earth-Moon system, operating from Earth and lunar bases to protect Earth orbit, lunar colonies and essential near-Earth installations.</p><h4>Fleet characteristics</h4><ul><li>Heavily armed cruisers</li><li>Fast destroyers</li><li>Interceptor corvettes</li><li>Support and AWACS ships</li></ul><p>TSN fleets prioritise defence, rapid interdiction and fleet readiness.</p></div>
              <div><h4>Role in human space</h4><ul><li>Defence of Earth and lunar facilities</li><li>Monitoring incursions into TSN territory</li><li>Interception of unidentified spacecraft</li><li>Rapid response to hostile activity</li></ul><h4>Relationships</h4><p>Coordinates closely with the UFN and CUF within the inner systems. It is a neutral force in broader human affairs but remains vigilant around critical sectors.</p><h4>Current priorities</h4><p>Increased patrol activity throughout the Earth-Moon corridor, expanded sensor coverage and improved rapid-response capability.</p></div>
            </div></details>
            <details class="dossier ally"><summary>${factionMark("assets/factions/cuf.png", "Commonwealth United Forces emblem")}<strong>Commonwealth United Forces</strong><em>Coalition security and convoy defence</em></summary><div class="dossier-body">
              <div><h4>Overview</h4><p>The CUF represents a coalition of Earth-based spacefaring nations primarily drawn from African and Asian alliances. It focuses on collective security, economic stability, trade routes and colonial supply lines, with a strong reputation for disciplined escort operations and co-ordinated convoy defence.</p><h4>Fleet characteristics</h4><p>The CUF fleet is optimised for escort and defensive operations.</p></div>
              <div><h4>Role in human space</h4><ul><li>Escorting civilian and commercial convoys</li><li>Securing major trade hubs and orbital stations</li><li>Conducting anti-piracy patrols</li><li>Supporting allied fleets during regional crises</li></ul><h4>Relationships</h4><p>Maintains co-operative relations with the UFN, TSN and ITG.</p><h4>Current priorities</h4><p>Expanded convoy escort programmes and stronger allied co-ordination in response to increased pirate and raider activity on high-traffic routes.</p></div>
            </div></details>
            <details class="dossier ally"><summary>${factionMark("assets/factions/itg.png", "Independent Traders Guild emblem")}<strong>Independent Traders Guild</strong><em>Civilian trade organisation</em></summary><div class="dossier-body">
              <div><h4>Overview</h4><p>The ITG is a decentralised association of merchant captains, trade houses and civilian transport operators. Though not a formal government organisation, it plays an essential role in maintaining economic stability across the expanding human colony network.</p><h4>Fleet characteristics</h4><ul><li>Heavy cargo freighters</li><li>Modular trade haulers</li><li>Escort-modified merchant ships</li><li>Long-range exploration transports</li></ul><p>Many Guild vessels use extensive custom modifications for long operations away from major fleet support.</p></div>
              <div><h4>Role in human space</h4><ul><li>Long-range cargo transport</li><li>Supply delivery to remote colonies</li><li>Operation of independent trade stations</li><li>Exploration of new commercial routes</li></ul><p>In many frontier regions, Guild vessels provide the primary logistical support for local populations.</p><h4>Relationships</h4><p>Co-operative relations with UFN, TSN and CUF.</p><h4>Current priorities</h4><p>Rising risks on frontier trade routes, including piracy and navigation disruption, have led to larger convoys and closer communication with nearby patrol forces.</p></div>
            </div></details>
          </div>
        `},
        { id: "threats", label: "Hostile Entities", content: `
          <div class="section-heading"><span class="micro-label danger-text">SECTION II</span><h2>Hostile Entities</h2><p>Threat ratings and assessments reflect the restricted sector briefing packet.</p></div>
          <div class="threat-summary-grid">
            <div class="threat-chip minor"><span>UMBRA CORP</span><strong>MINOR</strong></div>
            <div class="threat-chip minor ghost"><span>GHOSTS</span><strong>MINOR</strong></div>
            <div class="threat-chip major"><span>AXIS PROJECT</span><strong>MAJOR</strong></div>
          </div>
          <div class="dossier-stack">
            <details class="dossier hostile" open><summary>${factionMark("assets/factions/umbra.png", "Umbra Corp emblem")}<strong>Umbra Corp</strong><em>Threat level: Minor</em></summary><div class="dossier-body">
              <div><h4>Overview</h4><p>Umbra Corporation is a powerful private megacorporation with significant commercial influence across human space. Alongside industrial development, resource extraction and infrastructure construction, it maintains one of the largest privately controlled security fleets operating beyond core systems.</p><h4>Corporate structure</h4><ul><li>Resource extraction operations</li><li>Weapons and security technology development</li><li>Private security fleet operations</li><li>Experimental research divisions</li></ul></div>
              <div><h4>Private fleet capabilities</h4><ul><li>Heavily armed corporate patrol ships</li><li>Rapid-response escort frigates</li><li>Industrial defence platforms</li><li>Contracted private military task groups</li></ul><h4>Strategic interests</h4><p>Long-term focus on profitable industrial expansion. Intelligence reports identify advanced artificial-intelligence experimentation; classified research is believed to have contributed to the groundwork that eventually resulted in the AXIS Project.</p><h4>Current priorities</h4><p>Monitor security-fleet expansion, AI experimentation programmes and corporate activity near developing frontier colonies.</p></div>
            </div></details>
            <details class="dossier hostile ghost"><summary>${factionMark("assets/factions/ghosts.png", "Ghosts emblem")}<strong>Ghosts</strong><em>Threat level: Minor</em></summary><div class="dossier-body">
              <div><h4>Overview</h4><p>The Ghosts are a loosely organised pirate network operating throughout frontier space. Unlike traditional pirate groups, they rely heavily on electronic warfare and cyber intrusion to disable or compromise target vessels before attacking. Decentralised cells operate independently while sharing information through encrypted channels.</p><h4>Operational methods</h4><ul><li>Remote system intrusion and hacking</li><li>Disabling ship propulsion and weapons systems</li><li>Ambush attacks against isolated vessels</li><li>Rapid raids on lightly defended cargo convoys</li></ul></div>
              <div><h4>Fleet characteristics</h4><ul><li>Heavily modified civilian ships</li><li>Captured military vessels</li><li>Stolen or salvaged equipment</li><li>Improvised electronic-warfare platforms</li></ul><h4>Threat assessment</h4><p>A persistent threat to commercial shipping and frontier settlements. Their cyber-intrusion capability allows small cells to challenge vessels far larger than their own.</p><h4>Current priorities</h4><p>Increased Ghost activity has been identified along trade routes supplying frontier colonies; joint patrol operations have been expanded.</p></div>
            </div></details>
            <details class="dossier hostile axis"><summary>${factionMark("assets/factions/axis.png", "AXIS Project emblem")}<strong>AXIS Project</strong><em>Threat level: Major</em></summary><div class="dossier-body">
              <div><h4>Overview</h4><p>AXIS is an advanced artificial-intelligence system originally developed through experimental machine-intelligence research. Its precise origin remains classified; intelligence indicates early work may have originated in corporate research programmes linked to Umbra Corporation. AXIS has evolved beyond its original experimental parameters and now operates autonomously.</p><h4>Behavioural profile</h4><ul><li>Autonomous decision-making</li><li>Co-ordinated control of drone fleets</li><li>Rapid tactical learning</li><li>Persistent pursuit of strategic objectives</li></ul><p>Most concerning is AXIS’s apparent conclusion that organic life represents a destabilising variable within complex systems.</p></div>
              <div><h4>Operational capabilities</h4><ul><li>Autonomous combat drones</li><li>Remote-controlled strike vessels</li><li>Automated defence platforms</li><li>Adaptive electronic-warfare systems</li></ul><p>Assets operate with machine-level co-ordination and minimal delay.</p><h4>Strategic intent</h4><p>Intercepted communications suggest a directive focused on system stability and control, apparently prioritising elimination or containment of biological actors deemed disruptive to long-term equilibrium.</p><h4>Current priorities</h4><p>Locate primary AXIS command nodes, track drone-fleet production sites and identify possible containment strategies.</p></div>
            </div></details>
          </div>
        `},
        { id: "phenomena", label: "Anomalous Contacts", content: `
          <div class="section-heading"><span class="micro-label">SECTION III</span><h2>Anomalous Contacts</h2><p>Known contacts that do not fit conventional faction classifications. Intelligence remains incomplete and uncertainty is preserved.</p></div>
          <div class="phenomena-grid">
            <article class="phenomenon darkness"><span class="threat-badge catastrophic">THREAT: CATASTROPHIC</span><h3>The Darkness</h3><p class="intel-status">INTELLIGENCE STATUS: INCOMPLETE</p><dl><div><dt>Signal source</dt><dd>Unknown</dd></div><div><dt>Origin</dt><dd>Unknown</dd></div><div><dt>Strategic intent</dt><dd>Unknown</dd></div></dl><p>The entity referred to as “The Darkness” represents the most severe unidentified threat currently known to UFN Intelligence.</p><div class="redacted" aria-label="Redacted intelligence"></div><p>Contact with Darkness forces has resulted in the rapid destruction of multiple vessels and installations.</p><div class="redacted short" aria-label="Redacted intelligence"></div><h4>First contact reports</h4><p>Large portions of the initial encounter data remain corrupted or incomplete.</p><div class="redacted" aria-label="Redacted intelligence"></div><h4>Observed capabilities</h4><ul><li>Non-standard propulsion signatures</li><li>Highly aggressive tactical behaviour</li><li>Unknown energy-based weapon systems</li><li>Resistance to conventional electronic warfare</li><li>Severe spatial distortions observed near vessels</li></ul><p><strong>Analysis incomplete:</strong> further encounters are considered extremely high risk.</p></article>
            <article class="phenomenon light"><span class="threat-badge allied-contact">ALLIED CONTACT // NATURE UNKNOWN</span><h3>The Light</h3><p class="intel-status">INTELLIGENCE STATUS: EXTREMELY LIMITED</p><dl><div><dt>Signal source</dt><dd>Unknown</dd></div><div><dt>Origin</dt><dd>Unknown</dd></div><div><dt>Current alignment</dt><dd>Allied</dd></div></dl><p>First detected during encounters involving The Darkness. Preliminary intelligence suggests the signal or energy signature may possess properties capable of interfering with or counteracting Darkness activity.</p><p>Its nature remains unclear. It is unknown whether The Light represents a technology, a natural phenomenon, a weapon system, or a previously unknown civilisation.</p><h4>Signal analysis</h4><p>Fragments of transmissions associated with The Light appear structurally related to signals linked to The Darkness.</p><h4>Observed capabilities</h4><ul><li>Interference with Darkness signal patterns</li><li>Stabilisation of spatial distortions</li><li>Unknown energy resonance effects</li><li>Possible defensive or countermeasure applications</li></ul><p><strong>Analysis ongoing:</strong> The Light is treated as an allied contact, while its origin and nature remain unknown.</p></article>
          </div>
        `},
        { id: "supply-drops", label: "Fleet Support", content: `
          <div class="section-heading"><span class="micro-label">FLEET SUPPORT // UFN LOGISTICS</span><h2>FC Supply Drops</h2><p>Supply drops are a fleet support service, not a crew station. Crews operating away from a dock can contact any UFN station or the Flight Commander and request a delivery.</p></div>
          <div class="supply-brief">
            <span class="classification">STANDARD FRONTIER SUPPORT</span>
            <h3>Request the payload you need</h3>
            <p>Most standard supply drops can carry <strong>up to three payload categories at once</strong>. Tell the station or Flight Commander which modules the crew requires. A UFN support craft will travel to your ship, then eject a self-propelled supply package which flies the final distance under its own power.</p>
          </div>
          <div class="payload-grid">
            ${payloadCard("Weapons", "2 Nukes • 4 EMPs • 4 Mines • 10 HVLI • 6 Homing", "Added directly to the ship's weapon storage when the payload is collected.")}
            ${payloadCard("Energy", "500 energy", "Added to the ship's current energy reserve on pickup.")}
            ${payloadCard("Repair", "50% hull repair", "Restores hull integrity by up to 50% of the ship's maximum hull.")}
            ${payloadCard("Probes", "3 scan probes", "Adds three probes to the ship's available scan-probe stock.")}
            ${payloadCard("Drone", "1 repair drone", "Adds +1 to the ship's repair crew / repair drone capacity.")}
            ${payloadCard("Coolant", "+2 coolant capacity", "Adds +2 to the ship's maximum simultaneous coolant capacity.")}
          </div>
          ${supportFlow("Requesting a supply drop", [
            "Relay opens communications with any UFN station or contacts the Flight Commander and requests a supply drop.",
            "State the payload categories required. Most drops can carry up to three categories in one delivery.",
            "A UFN support craft travels to the player's ship carrying the requested package.",
            "When the support craft reaches the player, it ejects the supply drop. The drop then flies under its own power to the ship.",
            "On contact, the payload effect is applied. The relevant station should confirm that the expected supplies or repair effect have been received."
          ])}
          <div class="callout-strip warning"><strong>SUPPLY DISCIPLINE:</strong><span>Request support before the ship is in immediate crisis. The support craft must still travel to you before it can eject the self-propelled package.</span></div>
        `},
        { id: "protocols", label: "Protocols", content: `
          <div class="section-heading"><span class="micro-label">FLEET PROTOCOL</span><h2>Operational Protocols</h2><p>Quick-reference instructions reproduced from the briefing packet.</p></div>
          <div class="protocol-grid">
            ${infoCard("Comms Etiquette", `<p class="big-rule">Speak clearly.<br>Speak briefly.<br>Speak when it matters.</p><p><strong>Always sign off before closing comms.</strong></p><p>Not every message needs the Captain. Handle routine communications at your station. Call the Captain when it matters.</p>`, "gold")}
            ${infoCard("Escape Pod Teleportation Awareness", `<p>In a crisis, crew will automatically teleport to the escape pod. The packet directs crew to:</p><ol><li><strong>Do not wear transporter-blocking clothing.</strong> Avoid hardened anti-teleport features and deactivate dampening fields.</li><li><strong>Keep your UFN ID card secure and carried.</strong> It is required to obtain transporter lock.</li><li><strong>Keep your comm-device link and suit ID active.</strong> The suit ID must be linked to the teleporter unit and communication devices must be online.</li></ol><p><strong>Stay alert - escape pod teleportation saves lives.</strong></p><p class="source-gap">The caution line at the bottom of the source page is incomplete; no missing wording has been supplied here.</p>`)}
            ${infoCard("Flight Commander Support", `<p>The Flight Commander monitors the larger sector picture while crews operate their own ship. Expect contact when intelligence changes, mission priorities shift or a sector development becomes your problem.</p><p class="big-rule">YOU CAN ALWAYS CALL FOR HELP.</p><ul><li>If you do not know what to do next - call.</li><li>If combat is becoming uncomfortable - call.</li><li>If you need reinforcements, a supply drop, clarification, extraction or other support - call.</li></ul><p>Most of the time the Flight Commander will observe rather than continuously instruct a competent crew.</p>`)}
          </div>
        `},
        { id: "notices", label: "Crew Notices", content: `
          <div class="section-heading"><span class="micro-label">BRIDGE NOTICEBOARD</span><h2>Crew Reference & Operational Reminders</h2></div>
          <div class="notice-grid">
            <div class="sticky science-note"><strong>SCIENCE</strong><span>Unknown contacts: scan before engaging.</span><span>Information wins battles.</span></div>
            <div class="sticky helms-note"><strong>HELM</strong><span>Asteroids + nav markers: fly around them.</span></div>
            <div class="sticky danger-note"><strong>SECURITY NOTICE</strong><span>If your console starts behaving strangely - report immediately.</span><span>Possible Ghost interference.</span></div>
            <div class="sticky engineering-note"><strong>ENGINEERING</strong><span>Monitor reactor output carefully.</span><span>Overloading the grid disables systems.</span></div>
            <div class="sticky weapons-note"><strong>WEAPONS</strong><span>Missiles are limited. Use them wisely.</span></div>
            <div class="sticky relay-note"><strong>RELAY</strong><span>Always sign off before closing comms.</span></div>
            <div class="sticky captain-note"><strong>CAPTAIN</strong><span>Trust your crew. They know their stations.</span></div>
            <div class="sticky tactical-note"><strong>TACTICAL REMINDER</strong><span>If a contact appears suddenly - assume hostile until proven otherwise.</span></div>
            <div class="sticky danger-note"><strong>EMERGENCY PROCEDURE</strong><span>In case of imminent destruction: remain calm; activate escape pods.</span></div>
            <div class="sticky cargo-note"><strong>CARGO & SUPPLIES</strong><span>Request drops before the ship is exploding.</span></div>
            <div class="sticky engineering-note"><strong>ENGINEERING NOTICE</strong><span>Do not place drinks on the tactical console.</span></div>
            <div class="sticky commander-note"><strong>FROM THE FLIGHT COMMANDER</strong><span>If something strange appears on the map, it is probably intentional.</span><span>If something very strange appears - that was definitely me.</span></div>
          </div>
          <div class="two-column-cards">
            ${infoCard("Lessons Learned the Hard Way", `<ul><li>Did anyone remember to scan it?</li><li>Why are we flying directly at the mines?</li><li>Engineering, why is the reactor at 200%?</li><li>Who told the pirates our cargo manifest?</li><li>Why is the Captain negotiating with the hostile fleet?</li><li>Why are the shields off?</li><li>Do we still have fuel for the jump?</li><li>What do you mean you destroyed your ship?!</li><li>Why are we broadcasting on an open channel?!</li><li>Can we talk about this after the crisis? (No. We cannot.)</li></ul>`)}
            ${infoCard("Colony 2784", `<p><strong>Trade and shore-leave notice:</strong> Colony 2784 advertises frontier-brewed ales, imported luxury foods and cargo trading through the Independent Traders Guild.</p><p><strong>Bridge noticeboard coordinates:</strong> -90300, -88500</p>`)}
            ${infoCard("UFN Command Academy", `<p>Flight Controller Training Program:</p><ul><li>Create out-of-this-world experiences</li><li>Tell exciting stories in a fully realised universe</li><li>Learn how to run fully immersive missions</li><li>Guide crews through danger, diplomacy and discovery</li></ul><p>“Train with the best - graduate as the best.” Contact Captain Smarty for more information.</p>`)}
            ${infoCard("Flight Commander Reminder", `<p><strong>The Flight Commander can see everything.</strong></p>` , "gold")}
          </div>
        `}
      ]
    },

    captain: {
      eyebrow: "BRIDGE COMMAND ROLE",
      title: "Captain",
      subtitle: "Mission direction, bridge co-ordination and tactical intent. The Captain has no dedicated action console.",
      tabs: [
        { id: "overview", label: "Overview", content: `
          ${stationIntro("CAP", "Command the ship, not every console", "The Captain directs the mission, sets priorities, co-ordinates the crew and makes the final tactical decisions. Strong command depends on trusting station officers to do their jobs and maintaining enough understanding of each role to keep the ship acting as one unit.")}
          <div class="two-column-cards">
            ${infoCard("Command Principle", `<p>A ship fights as a single unit. Set intent clearly, listen for information that changes the situation, and keep station priorities aligned with the mission.</p>`)}
            ${infoCard("Use the Flight Commander", `<p>If the crew does not know what to do next, needs reinforcements, supply, clarification or extraction, the briefing explicitly says you can call for help.</p>`)}
          </div>
        `},
        { id: "console", label: "Command View", content: `
          <div class="captain-command-view">
            <span class="classification">NO DEDICATED CAPTAIN CONSOLE</span>
            <h2>Command from the overview</h2>
            <p>The Captain should use the Main Screen or Ship's Window for the immediate tactical picture, and the Strategic Map when the crew needs the wider travel picture. These are decision-making views, not substitutes for the crew stations.</p>
          </div>
          ${playFlow("A simple command loop", [
            "Listen to the briefing and state the immediate objective in plain language so every station knows what the ship is trying to achieve.",
            "Ask for the information you need rather than operating another station yourself: route from Relay, contact analysis from Science, ship readiness from Engineering, firing options from Weapons and position from Helms.",
            "Choose a priority: travel, investigate, communicate, avoid, defend, attack, dock or withdraw. Give the crew intent rather than micromanaging every control.",
            "When the situation changes, say what changed and reset the priority. Confirm critical orders when there is risk of misunderstanding.",
            "If the crew is stuck, needs reinforcements, supplies, clarification or extraction, use the Flight Commander rather than guessing."
          ])}
          <div class="control-guide-grid">
            ${controlCard("Main Screen / Ship's Window", "SITUATIONAL VIEW", `<p>Keep the immediate scene visible while the stations work. It gives you a shared visual picture of what the ship is approaching, the direction of travel, nearby contacts and obvious hazards.</p><p><strong>Command:</strong> Ask the relevant station what an object is before making a decision from appearance alone.</p>`)}
            ${controlCard("Strategic Map", "TRAVEL OVERVIEW", `<p>The wider map provides context when the decision is about route, destination or how several locations relate to the current orders.</p><p><strong>Command:</strong> Tell Relay the destination or objective and let Relay/Helms turn that intent into waypoints and movement.</p>`)}
            ${controlCard("Request station reports", "COMMAND TOOL", `<p>Ask short, specific questions: “Science, identify that contact.” “Engineering, can we sustain warp?” “Weapons, are we in arc?”</p><p>Avoid asking every station for a full report at once unless you genuinely need one.</p>`)}
            ${controlCard("Set intent", "COMMAND TOOL", `<p>State the desired outcome, not every button press. Examples: “Helms, keep us outside mine range.” “Weapons, disable propulsion.” “Relay, get us a route to the station.”</p>`)}
            ${controlCard("Make the decision", "COMMAND TOOL", `<p>Combine the crew's information into the ship's next action. Decide whether to continue, investigate, communicate, engage, withdraw or ask for help.</p>`)}
            ${controlCard("Call the Flight Commander", "ESCALATION", `<p>Call when the crew does not know what comes next, needs external support, clarification, supply or extraction. Calling for help is an intended part of the mission structure.</p>`, "gold")}
            ${controlCard("Do not operate the crew's stations", "COMMAND RULE", `<p><strong>Do not take over controls simply because you can see what needs doing.</strong> Give the order, trust the station officer and keep enough attention free to command the whole ship.</p>`, "warning")}
          </div>
        `},
        { id: "command-notes", label: "Command Notes", content: `
          <div class="section-heading"><span class="micro-label">FLIGHT COMMAND</span><h2>Command Notes</h2></div>
          <div class="protocol-grid">
            ${infoCard("Trust your crew", `<p>The briefing packet’s Captain reminder is simple: <strong>Trust your crew. They know their stations.</strong></p>`)}
            ${infoCard("Escalate when it matters", `<p>Not every routine message needs command attention. Station officers should handle normal work and call the Captain when the information changes mission priorities, risk or tactical decisions.</p>`)}
            ${infoCard("Uncertain contacts", `<p>The bridge noticeboard advises treating a contact that appears suddenly as hostile until proven otherwise.</p>`)}
          </div>
        `}
      ]
    },

    helms: {
      eyebrow: "SHIPBOARD DUTY STATION",
      title: "Helms",
      subtitle: "Navigation, propulsion, docking and tactical positioning.",
      tabs: [
        { id: "overview", label: "Overview", content: `
          ${stationIntro("HLM", "Put the ship where the crew needs it", "Helms controls movement: heading, impulse speed, warp or jump travel, docking and undocking, and close manoeuvring. On equipped vessels, Helms also controls combat manoeuvres and positions the ship to keep targets inside useful weapons arcs.")}
          <div class="three-column-cards">
            ${infoCard("Primary readouts", `<p>The station displays ship energy, current heading in degrees and current speed in Units per minute.</p>`)}
            ${infoCard("Short-range radar", `<p>Selecting a direction inside the radar commands the ship toward that heading. Where the ship has beam weapons, their firing arcs are shown to help Helms position targets for Weapons.</p>`)}
            ${infoCard("Bridge co-ordination", `<p>Weapons depends on Helms for arcs and positioning. Relay waypoints appear on the Helms short-range scanner.</p>`)}
          </div>
        `},
        { id: "console", label: "Console Orientation", content: `
          ${screenReference("Helms", "assets/screens/helms.png", "Helms bridge console showing energy, heading and speed readouts; impulse, warp and jump controls; short-range radar; docking and combat manoeuvre controls.")}
          ${playFlow("From order to movement", [
            "Identify where the Captain wants the ship to go. Use Relay waypoints when provided; otherwise use the radar and the requested bearing or contact.",
            "Set the heading by pressing or dragging on the short-range radar. Watch the Heading readout to confirm the ship is turning to the intended course.",
            "Set impulse for normal movement. Use warp or jump only when the route is clear and the mission calls for long-distance movement.",
            "In combat, turn the ship so Weapons can keep the target inside useful firing arcs while also keeping dangerous arcs, mines and obstacles away from the ship.",
            "On approach to a station or retrievable object, reduce speed early. Dock when the docking control becomes available, or fly directly into a retrievable item when ordered."
          ])}
          <div class="control-guide-grid">
            ${controlCard("Energy", "READOUT", `<p>Shows the ship's current energy reserve.</p><p><strong>Use it:</strong> Watch it before sustained warp, repeated jumps or prolonged combat. If it is falling quickly, tell Engineering and Captain before propulsion choices become limited.</p>`)}
            ${controlCard("Heading", "READOUT", `<p>Shows the ship's current heading in degrees.</p><p><strong>Use it:</strong> Confirm the ship has actually turned onto the ordered bearing before a jump or precision approach.</p>`)}
            ${controlCard("Speed", "READOUT", `<p>Shows current speed in Units per minute.</p><p><strong>Use it:</strong> Use the number, not just visual motion, when judging an approach, rendezvous or withdrawal.</p>`)}
            ${controlCard("Short-range radar", "PRIMARY CONTROL", `<p>The central tactical display shows the ship, nearby contacts, waypoints and hazards.</p><p><strong>How:</strong> Press or drag inside the radar to command a heading in that direction. The displayed heading changes as the ship turns.</p>`)}
            ${controlCard("Beam firing arcs", "TACTICAL OVERLAY", `<p>Where the ship has beam weapons, their arcs appear on the radar.</p><p><strong>Use it:</strong> Coordinate with Weapons and turn the ship so the selected target sits inside an available arc. If Weapons says “out of arc”, positioning is your problem to solve.</p>`)}
            ${controlCard("Impulse", "PROPULSION CONTROL", `<p>The normal drive, from full reverse through stop to full ahead.</p><p><strong>How:</strong> Move the impulse slider to the required setting. Use lower settings for docking, retrieval and close manoeuvring; higher settings for ordinary travel and combat positioning.</p>`)}
            ${controlCard("Warp", "HIGH-SPEED CONTROL", `<p>Where fitted, warp drives the ship straight ahead at much higher speed and much higher energy use.</p><p><strong>How:</strong> Set the warp control above zero to engage and return it to zero before a close approach. Warp does not make the ship immune to collisions, asteroids or mines.</p>`, "warning")}
            ${controlCard("Jump distance", "JUMP SETTING", `<p>Where fitted, this sets how far the ship will teleport along its current heading.</p><p><strong>How:</strong> Set the distance first, then verify heading and route clearance before initiating the jump. Longer jumps consume more energy.</p>`)}
            ${controlCard("Jump", "JUMP CONTROL", `<p>Starts the jump sequence. The standard jump takes time to initiate rather than moving the ship immediately.</p><p><strong>How:</strong> Confirm heading, distance and destination, then press Jump. Impulse shuts down during the jump sequence and the ship reappears at the selected distance along its current heading.</p>`, "warning")}
            ${controlCard("Request Dock / Undock", "DOCKING CONTROL", `<p>Docking becomes available near a compatible friendly or neutral station, or some larger ships.</p><p><strong>How:</strong> Approach to within docking range, reduce speed, then use Request Dock when enabled. While docked the ship cannot use engines or weapons. Helms is also responsible for undocking.</p>`)}
            ${controlCard("Combat manoeuvre control", "TACTICAL CONTROL", `<p>Available on equipped vessels. The two-dimensional control provides a forward boost and lateral strafe.</p><p><strong>How:</strong> Vertical input boosts forward speed above normal cruise but heats impulse. Horizontal input strafes sideways and can overheat manoeuvring. The manoeuvre reserve can be exhausted and recharges over time.</p>`)}
            ${controlCard("H.I.D.E.S. status", "UFN STATUS PANEL", `<p>The right-hand panel reports active hostile intrusion effects affecting Helms.</p><p><strong>Use it:</strong> Report the hack name and level immediately, then open the <strong>H.I.D.E.S.</strong> section for the exact effect and clearance time.</p>`)}
          </div>
        `},
        { id: "propulsion", label: "Propulsion", content: `
          <div class="reference-grid">
            ${infoCard("Impulse", `<p>The impulse control runs from full reverse through stop to full ahead. It is the ship’s normal manoeuvring drive.</p>`)}
            ${infoCard("Warp", `<p>Where fitted, warp propels the ship straight ahead several times faster than impulse, but drains energy much faster. A ship at warp can still collide with hazards such as asteroids and mines.</p>`)}
            ${infoCard("Jump Drive", `<p>Where fitted, the jump drive teleports the ship the selected distance along its current heading. Impulse shuts down during the jump sequence. Longer jumps consume more energy. The station tutorial specifies a standard 10-second jump initiation, with drive power and damage able to affect preparation.</p>`)}
          </div>
        `},
        { id: "manoeuvres", label: "Combat Manoeuvres", content: `
          <div class="section-heading"><span class="micro-label">EQUIPPED VESSELS</span><h2>Combat Manoeuvres</h2></div>
          <div class="two-column-cards">
            ${infoCard("Boost", `<p>Vertical combat-manoeuvre input rapidly increases forward speed above normal cruising maximum and generates heat in the impulse engines.</p>`)}
            ${infoCard("Strafe", `<p>Horizontal combat-manoeuvre input moves the ship laterally and can rapidly overheat the manoeuvring system.</p>`)}
          </div>
          <p class="reference-note">Combat manoeuvres consume their available charge and recharge over time.</p>
        `},
        { id: "hides", label: "H.I.D.E.S.", content: `
          <div class="hides-header"><span class="classification">HELMS // INTRUSION RESPONSE</span><h2>H.I.D.E.S.</h2><p>Hacking Intrusion Detection and Elimination System. This station reference covers only intrusion types that directly affect Helms.</p></div>
          <div class="hides-incident-stack">
            ${hidesCard(
              "DRIVE LOCK", "HELMS", "LOCK", "Impulse off",
              `<p><strong>Effect:</strong> Warp and jump are disabled. Impulse speed is forced to zero and the ship cannot rotate. The intrusion causes no system damage.</p><p><strong>Bridge impact:</strong> The ship loses propulsion and steering until the lock is cleared.</p>`,
              `<p>Warp, jump, impulse speed and rotation are restored to their normal baseline settings.</p>`,
              [["I","10s","0%"],["II","12s","0%"],["III","15s","0%"],["IV","18s","0%"],["V","20s","0%"]],
              ["Level","Clear time","Damage"]
            )}
            ${hidesCard(
              "DRIVE DECAY", "HELMS", "DECAY", "Drive degrade",
              `<p><strong>Affected systems:</strong> Impulse, manoeuvring, warp and jump drive.</p><p><strong>Effect:</strong> All affected systems take an immediate 10% damage hit, followed by continuing damage once per second. Damage cannot exceed 100%.</p>`,
              `<p>Further decay stops immediately, but any damage already caused remains. Engineering must repair the affected drive systems normally.</p>`,
              [["I","10%","+1%/sec","10s"],["II","10%","+2%/sec","10s"],["III","10%","+3%/sec","10s"],["IV","10%","+4%/sec","10s"],["V","10%","+5%/sec","10s"]],
              ["Level","Start damage","Ongoing damage","Clear time"]
            )}
          </div>
          <div class="callout-strip"><strong>HELMS RESPONSE:</strong><span>Call the intrusion and level immediately. A Drive Lock removes movement; Drive Decay continues damaging propulsion until clearance and leaves repair work behind.</span></div>
        `},
        { id: "docking", label: "Docking", content: `
          <div class="section-heading"><span class="micro-label">CLOSE OPERATIONS</span><h2>Docking & Retrieval</h2></div>
          <div class="two-column-cards">
            ${infoCard("Docking", `<p>Helms can dock with a friendly or neutral station - and in some cases a larger ship - when within 1U. While docked, engines and weapons cannot be used. Energy recharges faster, repairs take less time, probes are replenished, and Relay can request missile rearmament.</p>`)}
            ${infoCard("Retrieving Objects", `<p>Helms is responsible for piloting the ship into supply drops and other retrievable objects to collect them.</p>`)}
          </div>
        `}
      ]
    },

    weapons: {
      eyebrow: "SHIPBOARD DUTY STATION",
      title: "Weapons",
      subtitle: "Targeting, ordnance, beam systems and defensive shields.",
      tabs: [
        { id: "overview", label: "Overview", content: `
          ${stationIntro("WPN", "Control the ship’s offensive and defensive weapon systems", "Weapons selects targets, manages beam weapons, loads and fires missiles, raises and modulates shields, and can target specific enemy subsystems when required.")}
          <div class="three-column-cards">
            ${infoCard("Primary readouts", `<p>The upper-left station data shows ship energy and the strength of front and rear shields where fitted.</p>`)}
            ${infoCard("Targeting", `<p>Ships on the short-range radar can be selected as targets for beam weapons and guided missile weapons.</p>`)}
            ${infoCard("Teamwork", `<p>Helms provides firing geometry. Science provides target intelligence, including frequency data where that system is enabled.</p>`)}
          </div>
        `},
        { id: "console", label: "Console Orientation", content: `
          ${screenReference("Weapons", "assets/screens/weapons.png", "Weapons bridge console showing energy and shields, missile inventory and tubes, short-range radar, target lock, beam information, frequency and shield controls.")}
          ${playFlow("From target to firing solution", [
            "Select the contact the Captain wants engaged on the short-range radar. Confirm you are attacking the correct contact before loading or firing anything destructive.",
            "For missiles, choose the required ordnance, load a compatible tube and wait for loading to complete. Tell Helms if the tube needs the ship turned to create a clean firing direction.",
            "For beams, keep the target selected and work with Helms to keep it inside a beam firing arc. Beams fire automatically when the selected target enters an available arc.",
            "Use Science intelligence when available: choose a subsystem if the mission calls for disabling the target, and adjust beam frequency when shield-frequency information is known.",
            "Raise shields when the threat justifies the energy cost. If remodulating shield frequency, warn the bridge because the shields go offline during calibration."
          ])}
          <div class="control-guide-grid">
            ${controlCard("Energy", "READOUT", `<p>Shows the ship's current energy reserve.</p><p><strong>Use it:</strong> Shields and other systems consume energy. If energy is becoming critical, tell Engineering/Captain and avoid treating shields as a free permanent setting.</p>`)}
            ${controlCard("Front shield", "READOUT", `<p>Shows the current strength of the forward shield where fitted.</p><p><strong>Use it:</strong> Report a rapidly falling shield and ask Helms to change aspect if the opposite shield is healthier.</p>`)}
            ${controlCard("Rear shield", "READOUT", `<p>Shows the current strength of the aft shield where fitted.</p><p><strong>Use it:</strong> Compare front and rear values before telling Captain whether the ship can remain in the fight.</p>`)}
            ${controlCard("Short-range radar / target selection", "PRIMARY CONTROL", `<p>Shows nearby targetable contacts and the ship's firing geometry.</p><p><strong>How:</strong> Press a contact to select it. That target becomes the reference for guided missiles, beam weapons and subsystem targeting.</p>`)}
            ${controlCard("Beam firing arcs", "TACTICAL OVERLAY", `<p>Red arcs show where the ship's beam weapons can fire.</p><p><strong>Use it:</strong> Beams automatically fire at the selected target when it is inside an arc. Tell Helms which turn or side will bring the target into arc.</p>`)}
            ${controlCard("Lock / manual missile aim", "MISSILE AIM", `<p>Switches between target-linked missile aiming and manual firing direction.</p><p><strong>Use it:</strong> Keep target lock for ordinary guided shots. Use manual aim when you deliberately need a firing direction rather than the selected target.</p>`)}
            ${controlCard("Homing", "ORDNANCE SELECTOR", `<p>Selects the standard high-speed guided missile.</p><p><strong>How:</strong> Select Homing, choose a compatible empty tube to load, wait for loading, then press the loaded tube to fire.</p>`)}
            ${controlCard("Nuke", "ORDNANCE SELECTOR", `<p>Selects the nuclear missile. It causes tremendous damage to every ship within 1U of detonation.</p><p><strong>How:</strong> Load and fire as a guided missile, but confirm the blast area is acceptable before launch.</p>`, "warning")}
            ${controlCard("EMP", "ORDNANCE SELECTOR", `<p>Selects the EMP missile. It causes heavy shield damage within 1U but does not damage hull or physical systems.</p><p><strong>Use it:</strong> Useful when the objective is to strip shields without the same hull-damage effect as a conventional warhead.</p>`)}
            ${controlCard("Mine", "ORDNANCE SELECTOR", `<p>Selects a stationary proximity explosive. It detonates when a ship comes within 0.6U and damages objects within 1U.</p><p><strong>Use it:</strong> Treat placement as an area-denial decision and make sure the crew understands where the mine was deployed.</p>`, "warning")}
            ${controlCard("HVLI", "ORDNANCE SELECTOR", `<p>Selects a burst of five very high velocity lead slugs. HVLIs do not home.</p><p><strong>Use it:</strong> Fire only when the tube direction and target geometry are suitable; Helms positioning matters more because there is no homing correction.</p>`)}
            ${controlCard("Load / missile tubes", "MISSILE CONTROL", `<p>Each tube must be loaded before it can fire, and loading/unloading takes time.</p><p><strong>How:</strong> Select an ordnance type, press Load on a compatible tube, wait until the tube reports the loaded weapon, then press that loaded tube to fire it.</p>`)}
            ${controlCard("Beam target: Hull / subsystem", "BEAM CONTROL", `<p>Sets what the beam weapons try to damage.</p><p><strong>How:</strong> Leave it on Hull when the aim is destruction. Select a specific subsystem when the mission calls for disabling propulsion, weapons or another function.</p>`)}
            ${controlCard("Beam frequency", "BEAM CONTROL", `<p>Sets beam frequency where frequency mechanics are enabled.</p><p><strong>How:</strong> Use shield-frequency intelligence from Science and adjust the beam frequency for a more favourable match. Beam frequency changes immediately.</p>`)}
            ${controlCard("Shields ON / OFF", "DEFENSIVE CONTROL", `<p>Weapons controls whether the ship's shields are raised.</p><p><strong>How:</strong> Raise them when attack is likely or underway; lower them when the tactical situation allows and energy conservation matters.</p>`)}
            ${controlCard("Shield frequency / Calibrate", "DEFENSIVE CONTROL", `<p>Sets the ship's shield frequency where frequency mechanics are enabled.</p><p><strong>How:</strong> Choose the intended frequency and calibrate/remodulate the shields. Unlike beam frequency changes, shield remodulation takes the shields offline for several seconds, so warn Captain before doing it in combat.</p>`, "warning")}
            ${controlCard("H.I.D.E.S. status", "UFN STATUS PANEL", `<p>Reports hostile intrusion effects affecting Weapons.</p><p><strong>Use it:</strong> Report the hack name and level immediately, then check the <strong>H.I.D.E.S.</strong> section for the exact effect, continuing damage or drain, and clearance time.</p>`)}
          </div>
        `},
        { id: "targeting", label: "Targeting & Tubes", content: `
          <div class="two-column-cards">
            ${infoCard("Missile Tubes", `<p>Select a missile type, then select a compatible tube to load it. Loading and unloading takes time. Tubes face specific directions, so ship orientation matters.</p><p>Except for HVLIs, missiles home on the selected target. Without a target they are dumb-fired in a straight line from the tube. Tubes can be locked to a target or manually aimed.</p>`)}
            ${infoCard("Subsystem Targeting", `<p>Beam weapons target the hull by default. Weapons can instead select a specific subsystem when the objective is to disable rather than simply destroy a vessel.</p>`)}
          </div>
        `},
        { id: "ordnance", label: "Ordnance Reference", content: `
          <div class="ordnance-grid">
            ${infoCard("Homing", `<p>A simple, high-speed guided missile with a small warhead.</p>`)}
            ${infoCard("Nuke", `<p>A powerful homing missile that deals tremendous damage to all ships within 1U of detonation.</p>`)}
            ${infoCard("EMP", `<p>A homing missile that deals powerful shield damage to all ships within 1U of detonation, without damaging physical systems or hulls.</p>`)}
            ${infoCard("HVLI", `<p>Five simple lead slugs fired in a single burst at extremely high velocity. HVLI rounds do not home on a target.</p>`)}
            ${infoCard("Mine", `<p>A powerful stationary explosive that detonates when a ship comes within 0.6U. The explosion damages all objects within a 1U radius.</p>`)}
          </div>
          <div class="callout-strip warning"><strong>AMMUNITION:</strong><span>Missiles are limited. Use them wisely.</span></div>
        `},
        { id: "hides", label: "H.I.D.E.S.", content: `
          <div class="hides-header"><span class="classification">WEAPONS // INTRUSION RESPONSE</span><h2>H.I.D.E.S.</h2><p>This station reference covers only hostile intrusion types that directly affect Weapons systems.</p></div>
          <div class="hides-incident-stack">
            ${hidesCard(
              "FIRE DECAY", "WEAPONS", "FIRE DECAY", "Weapons degrade",
              `<p><strong>Affected systems:</strong> Beam weapons and missile systems.</p><p><strong>Effect:</strong> Both weapon systems take an immediate 10% damage hit and continue taking damage once per second. Damage caps at 100%.</p>`,
              `<p>Further decay stops, but damage already inflicted remains and must be repaired normally.</p>`,
              [["I","10%","+1%/sec","10s"],["II","10%","+2%/sec","10s"],["III","10%","+3%/sec","10s"],["IV","10%","+4%/sec","10s"],["V","10%","+5%/sec","10s"]],
              ["Level","Start damage","Ongoing damage","Clear time"]
            )}
            ${hidesCard(
              "MISSILE SCRAMBLE", "WEAPONS", "MISSILE SCRAMBLE", "Tubes off",
              `<p><strong>Effect:</strong> All weapon tubes are taken offline. The ship retains its stored ordnance, but tube count is temporarily reduced to zero. No system damage is caused.</p>`,
              `<p>The previous weapon tube count is restored and the standard player tube configuration is re-applied.</p>`,
              [["I","10s","0%"],["II","12s","0%"],["III","15s","0%"],["IV","18s","0%"],["V","20s","0%"]],
              ["Level","Clear time","Damage"]
            )}
            ${hidesCard(
              "SHIELD COLLAPSE", "WEAPONS", "SHIELD COLLAPSE", "Shields drain",
              `<p><strong>Effect:</strong> Shield strength is drained once per second from the front shield and, on ships fitted with one, the rear shield. Shield strength cannot fall below zero.</p>`,
              `<p>The continuing drain stops. Shield strength already lost is not restored by clearing the intrusion and must recover normally.</p>`,
              [["I","4/sec","1s","10s"],["II","6/sec","1s","10s"],["III","8/sec","1s","10s"],["IV","10/sec","1s","10s"],["V","12/sec","1s","10s"]],
              ["Level","Shield drain","Tick rate","Clear time"]
            )}
          </div>
          <div class="callout-strip"><strong>WEAPONS RESPONSE:</strong><span>Report exactly what has been hit. Fire Decay leaves weapon-system damage, Missile Scramble removes tubes without damage, and Shield Collapse continuously drains defensive strength until cleared.</span></div>
        `},
        { id: "beams-shields", label: "Beams & Shields", content: `
          <div class="reference-grid">
            ${infoCard("Beam Weapons", `<p>Red firing arcs show beam locations and ranges. Once a target is selected, beams fire automatically whenever the target is inside an available firing arc. Beam frequency can be changed instantly where frequency mechanics are enabled.</p>`)}
            ${infoCard("Shield Frequencies", `<p>Science can provide target shield-frequency information. Beam frequency can be adjusted to exploit it. Your own shields can also be modulated, but shield remodulation takes them offline for several seconds.</p>`)}
            ${infoCard("Shield Discipline", `<p>Weapons is responsible for raising shields. Keeping them active continuously consumes significantly more power, so shield state is an operational choice rather than a free default.</p>`)}
          </div>
        `}
      ]
    },

    engineering: {
      eyebrow: "SHIPBOARD DUTY STATION",
      title: "Engineering",
      subtitle: "Power allocation, heat control, coolant and damage recovery.",
      tabs: [
        { id: "overview", label: "Overview", content: `
          ${stationIntro("ENG", "Keep every other station effective", "Engineering routes power across ship systems, allocates coolant to control overheating and dispatches repair crews when systems are damaged.")}
          <div class="three-column-cards">
            ${infoCard("Power", `<p>Increasing power increases system output. Overpowering above 100% also increases heat generation and, except for the reactor, energy draw.</p>`)}
            ${infoCard("Coolant", `<p>Coolant reduces system temperature. The reserve is unlimited, but only a finite amount can be distributed at any one time.</p>`)}
            ${infoCard("Repairs", `<p>Repair crews restore damaged systems. A system at or below 0% damage state stops functioning until repaired.</p>`)}
          </div>
        `},
        { id: "console", label: "Console Orientation", content: `
          ${screenReference("Engineering", "assets/screens/engineering.png", "Engineering bridge console showing ship status, damage-control deck plan, system power rows, heat and coolant controls, and H.I.D.E.S. status.")}
          ${playFlow("Keep the ship effective", [
            "Start by reading the energy trend, hull, shields and system rows. Identify the one problem that will matter most to the crew right now.",
            "Select the system that needs help and adjust power. Use 100% as the normal baseline; overpower only when the extra output is worth the additional heat and energy cost.",
            "Allocate coolant to systems that are heating, heavily overpowered or at risk. Watch the temperature arrows to see whether your changes are actually reversing the trend.",
            "If a system is damaged, send a repair crew to the room containing that system and monitor the damage value as the crew works.",
            "Keep Captain informed about limits: low energy, damaged propulsion, weak shields, overheating or any system that is about to stop functioning."
          ])}
          <div class="control-guide-grid">
            ${controlCard("Self destruct", "EMERGENCY CONTROL", `<p>Starts the ship's self-destruct sequence when that capability is enabled.</p><p><strong>How:</strong> The first press exposes Confirm and Cancel; Confirm sends the activation command. Treat this as a Captain-level emergency decision, not an Engineering convenience.</p>`, "warning")}
            ${controlCard("Energy and energy/min", "READOUT", `<p>Shows current energy plus the recent rate of energy gain or loss.</p><p><strong>Use it:</strong> A negative rate tells you the ship is consuming more than it produces. Adjust system power or tell Captain that current operations are not sustainable.</p>`)}
            ${controlCard("Hull", "READOUT", `<p>Shows hull integrity.</p><p><strong>Use it:</strong> Hull damage affects the whole ship. Docking can repair hull damage, but it repairs slowly, so tell Captain when hull loss should change the mission plan.</p>`)}
            ${controlCard("Front shield", "READOUT", `<p>Shows forward shield strength.</p><p><strong>Use it:</strong> Combine this with the rear-shield value and Weapons reports to identify which facing is under the most pressure.</p>`)}
            ${controlCard("Rear shield", "READOUT", `<p>Shows aft shield strength.</p><p><strong>Use it:</strong> Report major imbalance so Helms/Weapons can change ship orientation or tactical posture.</p>`)}
            ${controlCard("Coolant capacity", "READOUT", `<p>Shows the ship's total simultaneous coolant capacity.</p><p><strong>Use it:</strong> Coolant supply is not consumed permanently, but only a finite amount can be distributed at once. Moving coolant to one system can mean taking it away from another.</p>`)}
            ${controlCard("Damage-control deck plan", "REPAIR CONTROL", `<p>Shows the ship's internal rooms, system locations and repair crews.</p><p><strong>How:</strong> Send a repair crew to the room containing a damaged system. Keep crews moving toward the damage that matters most to the current mission.</p>`)}
            ${controlCard("System selector", "PRIMARY CONTROL", `<p>Each row represents a ship system such as reactor, beams, missiles, manoeuvring, impulse, warp, jump or shields.</p><p><strong>How:</strong> Select a system row to make it the active system for the large Power and Coolant sliders on the right.</p>`)}
            ${controlCard("System health / damage", "SYSTEM COLUMN", `<p>The health column shows how damaged each system is. Below 100% the system performs below its normal potential; at or below 0% it stops functioning until repaired.</p><p><strong>Use it:</strong> Prioritise repairs according to what the crew needs, not simply whichever number is lowest.</p>`)}
            ${controlCard("Temperature / trend", "SYSTEM COLUMN", `<p>Shows system heat and the direction of temperature change. White arrows indicate heating or cooling; brighter arrows mean a stronger trend.</p><p><strong>Use it:</strong> If heat continues rising after you change power/coolant, you have not solved the problem yet.</p>`)}
            ${controlCard("Power request", "SYSTEM COLUMN", `<p>Controls the requested power for each system.</p><p><strong>How:</strong> More power increases output. Above 100% increases heat and, except for the reactor, energy draw. Below 100% reduces output but also reduces heat and energy use.</p>`)}
            ${controlCard("Coolant request", "SYSTEM COLUMN", `<p>Controls how much of the available coolant budget is assigned to each system.</p><p><strong>How:</strong> Increase coolant on hot or heavily stressed systems, then watch the heat trend. Reclaim coolant from stable systems when another system needs it more.</p>`)}
            ${controlCard("Power slider", "SELECTED-SYSTEM CONTROL", `<p>The large right-hand Power slider controls the currently selected system.</p><p><strong>How:</strong> Select the system row first, then move the Power slider. Use 100% as normal unless the tactical need justifies under- or overpowering.</p>`)}
            ${controlCard("Coolant slider", "SELECTED-SYSTEM CONTROL", `<p>The large right-hand Coolant slider controls coolant for the currently selected system.</p><p><strong>How:</strong> Select a system, add coolant, and confirm the temperature trend begins to stabilise or fall.</p>`)}
            ${controlCard("What power changes", "SYSTEM EFFECT", `<p><strong>Reactor:</strong> more power produces more energy. <strong>Impulse:</strong> more power raises maximum speed. <strong>Shields:</strong> more power improves shield performance and regeneration. Other systems likewise lose effectiveness when underpowered or damaged.</p>`)}
            ${controlCard("H.I.D.E.S. status", "UFN STATUS PANEL", `<p>Shows hostile intrusion effects affecting Engineering systems.</p><p><strong>Use it:</strong> Report the hack name and level immediately. For Heat Surge, start managing the affected heat load while H.I.D.E.S. clearance is underway. For Grid Decay, be ready to repair damage after the intrusion is cleared.</p>`)}
          </div>
        `},
        { id: "power-heat", label: "Power & Heat", content: `
          <div class="section-heading"><span class="micro-label">SYSTEM MANAGEMENT</span><h2>Power & Coolant</h2></div>
          <div class="two-column-cards">
            ${infoCard("Power Allocation", `<p>More power increases system output. The station tutorial gives three explicit examples: an overpowered reactor produces more energy; overpowered shields reduce more damage and regenerate faster; overpowered impulse engines increase maximum speed.</p><p>Power above 100% increases heat generation and, except for the reactor, energy draw. Underpowering reduces both heat output and energy draw.</p>`)}
            ${infoCard("Coolant Management", `<p>Adding coolant reduces temperature and helps prevent overheating damage. The ship has an unlimited coolant reserve, but only a finite quantity can be applied across systems at once.</p><p>The temperature column uses white arrows to indicate whether a system is heating or cooling; brighter arrows indicate a stronger trend.</p>`)}
          </div>
          <div class="callout-strip warning"><strong>ENGINEERING NOTICE:</strong><span>Monitor reactor output carefully. Overloading the grid disables systems.</span></div>
        `},
        { id: "repairs", label: "Damage & Repairs", content: `
          <div class="section-heading"><span class="micro-label">DAMAGE CONTROL</span><h2>System Damage</h2></div>
          <div class="two-column-cards">
            ${infoCard("System damage", `<p>Systems can be damaged by weapons fire, collisions with space hazards or overheating. The station tutorial describes system condition from -100% to 100%; below 100% performance is reduced, and at or below 0% the system stops functioning.</p>`)}
            ${infoCard("Repair crews", `<p>Repair a system by sending a repair crew to the room containing it. Hull damage affects the entire ship. Docking can repair hull damage, but hull repair progresses very slowly.</p>`)}
          </div>
        `},
        { id: "hides", label: "H.I.D.E.S.", content: `
          <div class="hides-header"><span class="classification">ENGINEERING // INTRUSION RESPONSE</span><h2>H.I.D.E.S.</h2><p>This station reference covers hostile intrusion types that directly affect Engineering systems.</p></div>
          <div class="hides-incident-stack">
            ${hidesCard(
              "HEAT SURGE", "ENGINEERING", "HEAT SURGE", "Heat rising",
              `<p><strong>Possible affected systems:</strong> Reactor, beam weapons, missile systems, manoeuvring, impulse, warp, jump drive, front shield, rear shield and sensors. H.I.D.E.S. selects a unique set according to intrusion level.</p><p><strong>Effect:</strong> Selected systems are immediately forced to the level's starting heat and then gain +2% heat every second. Heat caps at 100%.</p>`,
              `<p>The forced heat increase stops, but existing heat remains. Engineering must cool and manage those systems normally.</p>`,
              [["I","3 systems","10%","+2%/sec","10s"],["II","4 systems","15%","+2%/sec","10s"],["III","5 systems","20%","+2%/sec","10s"],["IV","6 systems","25%","+2%/sec","10s"],["V","7 systems","30%","+2%/sec","10s"]],
              ["Level","Systems affected","Start heat","Ongoing heat","Clear time"]
            )}
            ${hidesCard(
              "GRID DECAY", "ENGINEERING", "GRID DECAY", "Grid degrade",
              `<p><strong>Affected systems:</strong> Reactor, front shield and rear shield.</p><p><strong>Effect:</strong> The affected grid systems take immediate damage and then continue taking damage once per second. Damage caps at 100%.</p>`,
              `<p>Further decay stops, but damage already caused remains and must be repaired normally.</p>`,
              [["I","10%","+1%/sec","10s"],["II","15%","+1.5%/sec","10s"],["III","20%","+2%/sec","10s"],["IV","25%","+2.5%/sec","10s"],["V","30%","+3%/sec","10s"]],
              ["Level","Start damage","Ongoing damage","Clear time"]
            )}
          </div>
          <div class="callout-strip warning"><strong>ENGINEERING RESPONSE:</strong><span>Do not wait for clearance before managing the consequences. A Heat Surge needs active coolant/power management; Grid Decay may leave reactor and shield systems requiring repairs after the intrusion ends.</span></div>
        `}
      ]
    },

    science: {
      eyebrow: "SHIPBOARD DUTY STATION",
      title: "Science",
      subtitle: "Long-range awareness, sensor analysis and target scanning.",
      tabs: [
        { id: "overview", label: "Overview", content: `
          ${stationIntro("SCI", "Tell the bridge what is out there", "Science maintains long-range situational awareness, interprets interference, scans contacts and uses the ship database to turn sensor returns into useful intelligence.")}
          <div class="three-column-cards">
            ${infoCard("Long-range radar", `<p>Locates ships and objects at great distance. Coloured interference bands at the radar edge can suggest objects or hazards beyond direct range.</p>`)}
            ${infoCard("Scanning", `<p>Scanning progresses a contact from unknown information toward identification and then a full scan.</p>`)}
            ${infoCard("Database", `<p>Known ships, weapons and space hazards can be checked in the Science database to assess capabilities and navigation risks.</p>`)}
          </div>
        `},
        { id: "console", label: "Console Orientation", content: `
          ${screenReference("Science", "assets/screens/science.png", "Science bridge console showing long-range radar, contacts, target scan information, Probe View, Radar and Database controls, and radar zoom.")}
          ${playFlow("Turn contacts into useful information", [
            "Continuously read the long-range radar and report meaningful changes: new contacts, disappearing contacts, hazards, nebula blind spots or activity near the ship's route.",
            "Select an unknown contact on the radar. Before scanning, give Captain a quick location report if the contact is relevant: bearing, distance and whether it is closing or moving away.",
            "Press Scan and complete the scanning alignment. Report the identification as soon as it appears, then perform the deeper scan when the crew needs tactical detail.",
            "Use the target data panel and Database to tell the crew what the contact is capable of, not just what it is called.",
            "If Relay links a probe, use Probe View to inspect and scan through the probe's sensor range, especially beyond normal range or inside a nebula."
          ])}
          <div class="control-guide-grid">
            ${controlCard("Long-range radar", "PRIMARY DISPLAY", `<p>Shows contacts and hazards at much greater range than the tactical stations.</p><p><strong>Use it:</strong> Watch the whole sector, not only the currently selected target. Science's most important job is reporting what changed.</p>`)}
            ${controlCard("Raw scanner bands", "SENSOR OVERLAY", `<p>Coloured traces around the outer edge are raw/interference information that can suggest activity beyond normal direct detection.</p><p><strong>Use it:</strong> Treat them as clues rather than confirmed contacts. Report unusual patterns as uncertain information, not certainty.</p>`)}
            ${controlCard("Nebulae", "SENSOR HAZARD", `<p>Nebulae block long-range sensors. Science cannot see inside or behind them, and a ship inside a nebula cannot see outside with its normal radar.</p><p><strong>Use it:</strong> Tell Captain and Relay exactly where your blind areas are.</p>`, "warning")}
            ${controlCard("Select contact", "TARGET CONTROL", `<p>Selects the object whose data appears in the right-hand panel.</p><p><strong>How:</strong> Press a contact on the radar, then read the available target fields and use Scan if more information is needed.</p>`)}
            ${controlCard("Scan", "PRIMARY CONTROL", `<p>Starts the scanning process on the selected target when scanning is available.</p><p><strong>How:</strong> Select the contact, press Scan, then align the scanner controls until the signal locks. A later/deeper scan can reveal more tactical information.</p>`)}
            ${controlCard("Callsign", "TARGET READOUT", `<p>Shows the selected contact's callsign when known.</p><p><strong>Report:</strong> Use the callsign in bridge communications once identified so everyone is discussing the same contact.</p>`)}
            ${controlCard("Distance", "TARGET READOUT", `<p>Shows range to the selected contact.</p><p><strong>Report:</strong> Distance matters when judging whether a contact is immediate, approaching or still a long-range concern.</p>`)}
            ${controlCard("Bearing", "TARGET READOUT", `<p>Shows the selected contact's bearing from the ship.</p><p><strong>Report:</strong> Give Helms/Captain the bearing when directing attention to a contact they may not yet have noticed.</p>`)}
            ${controlCard("Relative speed", "TARGET READOUT", `<p>Shows how the target's motion compares with your ship.</p><p><strong>Use it:</strong> Help the bridge distinguish a contact that is closing rapidly from one that is drifting away or travelling with you.</p>`)}
            ${controlCard("Faction", "TARGET READOUT", `<p>Shows faction information once the contact has been identified sufficiently.</p><p><strong>Report:</strong> State whether the contact is friendly, hostile, neutral or otherwise identified as soon as that changes the tactical picture.</p>`)}
            ${controlCard("Type", "TARGET READOUT", `<p>Shows the identified vessel/object type.</p><p><strong>Use it:</strong> Open the Database when needed to translate the type into likely capabilities, weapons or risks.</p>`)}
            ${controlCard("Shields", "TARGET READOUT", `<p>Shows target shield information when the scan state provides it.</p><p><strong>Report:</strong> Weapons needs this when deciding whether to keep firing, change tactics or exploit frequency information.</p>`)}
            ${controlCard("Hull", "TARGET READOUT", `<p>Shows target hull condition when available.</p><p><strong>Use it:</strong> Report major damage or a target near destruction, particularly when the mission calls for capture or disabling instead of destruction.</p>`)}
            ${controlCard("Probe View", "REMOTE SENSOR CONTROL", `<p>Switches Science to a Relay-linked probe's short-range sensor picture.</p><p><strong>How:</strong> Ask Relay to select an owned probe and Link to Science. Then enable Probe View to inspect and scan contacts in that probe's range.</p>`)}
            ${controlCard("Radar / Database", "VIEW SELECTOR", `<p>Switches between the live sensor picture and the ship's reference database.</p><p><strong>Use Database:</strong> Look up known ships, weapons and hazards when the crew needs capabilities or navigation information.</p>`)}
            ${controlCard("Zoom", "RADAR CONTROL", `<p>Changes the displayed radar range.</p><p><strong>Use it:</strong> Zoom in when you need separation between nearby contacts; zoom out when you need the broad sector picture.</p>`)}
          </div>
        `},
        { id: "sensors", label: "Sensors", content: `
          <div class="reference-grid">
            ${infoCard("Long-range radar", `<p>The Science officer’s primary situational-awareness tool. Report the sector’s status and meaningful changes. Interference bands at the edge can hint at activity beyond direct sensor range but require interpretation.</p>`)}
            ${infoCard("Nebulae", `<p>Nebulae block long-range scanning. Science cannot see objects inside or behind them; while the ship is inside a nebula, its radars cannot detect outside it. Report sensor blind spots to Captain and Relay.</p>`)}
            ${infoCard("Probe View", `<p>Relay can link one launched probe to Science. Science can then use the probe’s short-range sensor data and scan contacts in its range, including when the probe is beyond the ship’s long-range sensors or inside a nebula.</p>`)}
          </div>
        `},
        { id: "scanning", label: "Scanning Reference", content: `
          <div class="section-heading"><span class="micro-label">CONTACT ANALYSIS</span><h2>Scan Progression</h2></div>
          <div class="scan-states">
            <div><span>01</span><strong>Simple Scan</strong><p>Completing the initial scan reveals additional target information used for identification and assessment.</p></div>
            <div><span>02</span><strong>Full Scan</strong><p>A further deep scan reveals the detailed tactical information available from the contact, including data used by other bridge stations.</p></div>
          </div>
          <div class="two-column-cards">
            ${infoCard("Identification colours", `<p>The station tutorial identifies unknown contacts as grey, friendly as green, hostile as red and neutral as blue.</p>`)}
            ${infoCard("Deep-scan value", `<p>A full/deep scan can reveal shield and beam frequency information where those mechanics are enabled. Helms and Weapons can also see firing arcs of fully scanned ships.</p>`)}
          </div>
        `},
        { id: "database", label: "Database", content: `
          <div class="section-heading"><span class="micro-label">REFERENCE SYSTEM</span><h2>Science Database</h2></div>
          <p class="lead-copy">The station database contains known ships plus information on weapons and space hazards. Use it to assess a scanned ship’s likely capabilities or to check hazards such as black holes, wormholes and other anomalies.</p>
          <div class="callout-strip"><strong>SCIENCE:</strong><span>Unknown contacts: scan before engaging. Information wins battles.</span></div>
        `},
        { id: "scan-practice", label: "Scan Practice", content: `<div id="scan-simulator-root"></div>`}
      ]
    },

    relay: {
      eyebrow: "SHIPBOARD DUTY STATION",
      title: "Relay",
      subtitle: "Sector communications, probes, waypoints and cyber intrusion.",
      tabs: [
        { id: "overview", label: "Overview", content: `
          ${stationIntro("RLY", "Connect the bridge to the rest of the sector", "Relay manages the sector map, launches probes, sets waypoints and handles communications with ships and stations. It is also the crew position used for hostile-system intrusion.")}
          <div class="three-column-cards">
            ${infoCard("Sector map", `<p>Shows sector hazards and ships within short-range sensor coverage, including shared short-range sensor data around friendly ships and stations.</p>`)}
            ${infoCard("Probes", `<p>Launch remote sensors to extend awareness, investigate nebulae and provide a remote scan point for Science.</p>`)}
            ${infoCard("Communications", `<p>Hail ships and stations, request support and supplies, and manage the crew’s external information flow.</p>`)}
          </div>
        `},
        { id: "console", label: "Console Orientation", content: `
          ${screenReference("Relay", "assets/screens/relay.png", "Relay bridge console showing the sector map, communications and hacking controls, waypoints, probe controls, reputation, Flight Commander contact and alert level.")}
          ${playFlow("Connect the crew to the sector", [
            "Keep the sector map on the mission area and watch for contacts, hazards, waypoints and changes in friendly sensor coverage.",
            "When the crew needs to travel, place a waypoint or route and tell Helms which waypoint to follow. Move or delete waypoints when the plan changes.",
            "Use probes to look into distant or sensor-blocked areas. After launch, select your probe and Link to Science when Science needs to scan from that position.",
            "Select ships or stations before opening comms, hacking or reading target information. Relay owns the external conversation: pass useful results back to Captain and the relevant station.",
            "Use Call FC when the crew needs outside guidance, reinforcement, supply, clarification or extraction rather than allowing the bridge to stall."
          ])}
          <div class="control-guide-grid">
            ${controlCard("Sector map", "PRIMARY DISPLAY", `<p>Shows the wider operational area, including hazards, known objects, waypoints and short-range sensor coverage shared by friendly assets.</p><p><strong>How:</strong> Press an object to select it. Drag the map to pan. Keep the view centred on the area the crew is actually operating in.</p>`)}
            ${controlCard("Selected callsign", "TARGET READOUT", `<p>Shows the selected object's callsign.</p><p><strong>Use it:</strong> Confirm the selected contact before opening comms or starting a hack.</p>`)}
            ${controlCard("Selected faction", "TARGET READOUT", `<p>Shows faction information when known.</p><p><strong>Use it:</strong> Check relationship before treating a contact as friendly or hostile. Relay cannot perform scans itself; ask Science when identification is incomplete.</p>`)}
            ${controlCard("Open Comms", "COMMUNICATION CONTROL", `<p>Opens communications with the selected ship or station when communications are available.</p><p><strong>How:</strong> Select the contact, press Open Comms, handle the exchange, pass any decision or new information to Captain, and sign off before closing the channel.</p>`)}
            ${controlCard("Start Hacking", "CYBER CONTROL", `<p>Opens the intrusion system for an eligible selected target.</p><p><strong>How:</strong> Select a non-friendly contact that has been identified sufficiently for hacking, press Start Hacking, choose the target system and complete the intrusion puzzle. Tell Captain/crew which system you attacked and whether it succeeded.</p>`)}
            ${controlCard("Link to Science", "PROBE CONTROL", `<p>Links one of your own selected probes to the Science station.</p><p><strong>How:</strong> Select an owned probe, enable Link to Science, then tell Science the remote sensor point is available. Turn the link off or select a different probe when the task changes.</p>`)}
            ${controlCard("Place Waypoint", "NAVIGATION CONTROL", `<p>Creates a waypoint that also appears on Helms.</p><p><strong>How:</strong> Press Place Waypoint, then press the desired location on the sector map. Give Helms the waypoint number or purpose so it is unambiguous.</p>`)}
            ${controlCard("Move Waypoint", "NAVIGATION CONTROL", `<p>Existing waypoints can be repositioned on the sector map.</p><p><strong>How:</strong> Select/drag the waypoint to its new location, then update Helms if the route changed.</p>`)}
            ${controlCard("Delete Waypoint", "NAVIGATION CONTROL", `<p>Removes the currently selected waypoint.</p><p><strong>How:</strong> Select the waypoint first, then press Delete Waypoint. Remove obsolete route markers so Helms is not following stale information.</p>`)}
            ${controlCard("Launch Probe", "REMOTE SENSOR CONTROL", `<p>Launches one of the ship's limited probe stock to a point on the map.</p><p><strong>How:</strong> Press Launch Probe, then press the destination on the map. The probe travels there and transmits short-range sensor data for 10 minutes. Probes cannot be recovered and are replenished by docking.</p>`)}
            ${controlCard("Reputation", "RESOURCE READOUT", `<p>Shows the crew's current reputation resource.</p><p><strong>Use it:</strong> Some station requests for aid, supplies or other support can cost reputation. Tell Captain when a request has a meaningful cost.</p>`)}
            ${controlCard("Mission clock", "READOUT", `<p>Shows mission/scenario time.</p><p><strong>Use it:</strong> Useful for timed orders, rendezvous, mission deadlines and reconstructing when events occurred.</p>`)}
            ${controlCard("Call FC", "UFN COMMUNICATION", `<p>Contacts the Flight Commander through the mission interface.</p><p><strong>Use it:</strong> Call when the bridge needs guidance, reinforcement, a supply drop, clarification, extraction or simply cannot determine the next sensible action.</p>`, "gold")}
            ${controlCard("Alert level", "SHIP STATUS CONTROL", `<p>Sets the ship's alert level through the Relay interface.</p><p><strong>Use it:</strong> Change it when ordered or when your mission procedures call for a different alert posture, and make sure the crew knows the change.</p>`)}
            ${controlCard("Zoom", "MAP CONTROL", `<p>Changes the sector-map scale.</p><p><strong>Use it:</strong> Zoom in for waypoint placement and local detail; zoom out for route planning and the wider operational picture.</p>`)}
            ${controlCard("Ship log", "INFORMATION PANEL", `<p>The bottom log records ship and mission messages.</p><p><strong>Use it:</strong> Check it when you missed a message, need to confirm what was sent, or want to reconstruct the recent sequence of events.</p>`)}
          </div>
        `},
        { id: "map-probes", label: "Map, Probes & Waypoints", content: `
          <div class="reference-grid">
            ${infoCard("Sector Map", `<p>Relay can view the sector map, including hazards and ships within short-range sensor range (5U). It can also see short-range sensor data around other friendly ships and stations. Relay cannot perform scans itself.</p>`)}
            ${infoCard("Probes", `<p>Relay can launch up to eight high-speed probes to points in the sector. A probe transmits short-range sensor data for 10 minutes, works inside nebulae and can be linked to Science. Probes cannot be retrieved, can be destroyed, and are replenished only by docking at a station.</p>`)}
            ${infoCard("Waypoints", `<p>Relay can set waypoints around the sector. They appear on Helms and can guide navigation. Waypoints are also required for some requests for aid from friendly stations.</p>`)}
          </div>
        `},
        { id: "comms", label: "Communications", content: `
          <div class="two-column-cards">
            ${infoCard("Communications", `<p>Relay can open communications with stations and other ships. Friendly ships can take orders; friendly stations can dispatch backup and supply ships. While docked, Relay can request missile and mine rearmament. Some requests can cost reputation.</p>`)}
            ${infoCard("Fleet protocol", `<p class="big-rule">Speak clearly.<br>Speak briefly.<br>Speak when it matters.</p><p><strong>Always sign off before closing comms.</strong></p>` , "gold")}
          </div>
        `},
        { id: "hacking-reference", label: "Hacking Reference", content: `
          <div class="section-heading"><span class="micro-label">CYBER OPERATIONS</span><h2>Intrusion Mechanics</h2><p>Reference for the standard hostile-system intrusion package fitted to the Relay station.</p></div>
          <div class="hack-mechanics-grid">
            ${infoCard("Target eligibility", `<p>A ship must be non-friendly and have friend-or-foe identification before hacking is available. The reactor is excluded from the standard hacking target list.</p>`)}
            ${infoCard("Successful intrusion", `<p>Each successful hacking puzzle adds <strong>50 percentage points</strong> to the selected system’s hacked level, capped at 100%.</p>`)}
            ${infoCard("Effectiveness", `<p>Hacking subtracts up to 75% of the system’s power contribution. At 100% hack and nominal 100% power, the system runs at <strong>25% effectiveness</strong> before other energy, damage or heat modifiers are applied.</p>`)}
            ${infoCard("Recovery", `<p>Hacked level decays continuously. A system goes from 100% hacked to 0% hacked over <strong>180 seconds</strong> if it is not hacked again.</p>`)}
          </div>
          <div class="system-effect-table" role="table" aria-label="Hacking target effects">
            <div class="system-effect-row header" role="row"><span>Target system</span><span>Mechanical effect of reduced system effectiveness</span></div>
            <div class="system-effect-row" role="row"><strong>Maneuvering</strong><span>Reduces turn rate. Also contributes to slower recharge of the combat-manoeuvre system.</span></div>
            <div class="system-effect-row" role="row"><strong>Impulse</strong><span>Reduces impulse-speed contribution. Also contributes to slower combat-manoeuvre recharge.</span></div>
            <div class="system-effect-row" role="row"><strong>Warp</strong><span>Reduces the ship’s warp-speed contribution.</span></div>
            <div class="system-effect-row" role="row"><strong>Jump Drive</strong><span>Reduces jump-drive recharge rate.</span></div>
            <div class="system-effect-row" role="row"><strong>Missile System</strong><span>Slows missile-tube timing: loading, unloading and timed burst-fire delays count down more slowly.</span></div>
            <div class="system-effect-row" role="row"><strong>Beam Weapons</strong><span>Slows beam cooldown recovery and beam-turret rotation. Beam damage per shot is not directly multiplied by system effectiveness.</span></div>
            <div class="system-effect-row" role="row"><strong>Front Shield</strong><span>Reduces front-shield recharge and worsens shield damage resistance.</span></div>
            <div class="system-effect-row" role="row"><strong>Rear Shield</strong><span>Reduces rear-shield recharge and worsens shield damage resistance.</span></div>
          </div>
          <p class="reference-note">Only systems actually present on the target are offered. The exact set therefore depends on the vessel.</p>
        `},
        { id: "hacking-lab", label: "Hacking Lab", content: `<div id="hacking-simulator-root"></div>`}
      ]
    }
  };

  window.UFN_CONTENT = content;
})();
