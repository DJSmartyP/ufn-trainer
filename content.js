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
      ["H.I.D.E.S. status", 82.6, 12.8, 16.3, 23.0, "Shows hostile intrusion activity detected by H.I.D.E.S. If a Helms hack is detected, open the H.I.D.E.S. reference for Drive Lock or Drive Decay effects and clearance information."]
    ],
    weapons: [
      ["Ship readouts", 1.2, 11.3, 15.2, 13.2, "Energy plus front and rear shield strength. Watch shield state while fighting and coordinate power concerns with Engineering."],
      ["Ordnance and tubes", 1.0, 59.0, 22.0, 38.0, "Select an ordnance type, load an available tube, then fire the loaded tube. Tube direction matters, so coordinate the firing solution with Helms."],
      ["Target radar", 25.0, 5.0, 50.0, 90.0, "Select a target on the short-range radar. Guided missiles use the selected target and beams automatically fire when that target is inside a firing arc."],
      ["Missile aim lock", 61.3, 2.0, 9.0, 6.8, "Use Lock to switch between target-linked missile aiming and manual tube aiming when the tactical situation requires it."],
      ["Beam information", 81.3, 70.0, 17.8, 27.0, "Choose hull or a subsystem as the beam target and set beam frequency when frequency mechanics are active. Science can provide useful frequency data."],
      ["H.I.D.E.S. status", 82.6, 12.8, 16.3, 23.0, "Shows hostile intrusion activity detected by H.I.D.E.S. Weapons may be targeted by Fire Decay, Missile Scramble or Shield Collapse."]
    ],
    engineering: [
      ["Ship status", 1.2, 11.2, 15.2, 24.0, "Energy trend, hull, shields and total coolant capacity. Use these to judge whether the ship is stable or entering a resource crisis."],
      ["Self destruct", 1.2, 2.6, 15.0, 5.3, "Emergency control only. Activation requires confirmation. Do not use unless command has deliberately ordered destruction of the ship."],
      ["Internal ship view", 36.0, 2.5, 29.0, 41.0, "Shows system rooms and repair crews. Select or dispatch repair capability to damaged systems using the engineering controls."],
      ["System rows", 17.0, 48.0, 47.5, 49.0, "Each installed system has health, heat, requested power and coolant information. Select a row before using the large power/coolant controls."],
      ["Power and coolant", 65.8, 53.7, 17.0, 43.5, "Allocate power to change system output and coolant to control heat. More than 100% power improves performance but increases heat and, except for the reactor, energy draw."],
      ["H.I.D.E.S. status", 82.6, 12.8, 16.3, 23.0, "Shows hostile intrusion activity detected by H.I.D.E.S. Engineering may be targeted by Heat Surge or Grid Decay."]
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
      <div class="console-image-frame">
        <div class="console-image-stage interactive-console-frame">
          <img src="${src}" alt="${alt}" loading="lazy" />
          <div class="screen-hotspots" aria-label="Interactive ${station} console guide">
            ${hotspots.map(([label,x,y,w,h,text]) => `
              <button class="screen-hotspot ${y > 67 ? "popover-above" : ""} ${x > 72 ? "popover-left" : ""}" type="button" style="--x:${x}%;--y:${y}%;--w:${w}%;--h:${h}%;" aria-label="${label}: ${text}">
                <span class="screen-hotspot-popover"><strong>${label}</strong><span>${text}</span></span>
              </button>`).join("")}
          </div>
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

  const rankCard = (name, image, note = "", tier = 1, tierStart = false) => `
    <article class="rank-card rank-tier-${tier}${tierStart ? " rank-tier-start" : ""}">
      <div class="rank-insignia-frame"><img src="assets/ranks/${image}" alt="${name} rank insignia" loading="lazy" /></div>
      <div class="rank-card-copy">
        <span class="control-type">UFN OFFICER RANK</span>
        <h3>${name}</h3>
        ${note ? `<p class="rank-approval">${note}</p>` : `<p class="rank-approval rank-approval-empty" aria-hidden="true">&nbsp;</p>`}
      </div>
    </article>`;

  const medalCard = (id, name, image, description, restricted = false) => `
    <button class="medal-card${restricted ? " medal-card-restricted" : ""}" type="button" data-medal-id="${id}" data-medal-restricted="${restricted ? "true" : "false"}">
      <span class="medal-art-frame"><img src="assets/medals/${image}" alt="${name}" loading="lazy" /></span>
      <span class="medal-card-copy">
        <span class="control-type">UFN SERVICE DECORATION</span>
        <strong>${name}</strong>
        <span class="medal-card-action">${restricted ? "VIEW RESTRICTED RECORD" : "VIEW CITATION"}</span>
        <span class="medal-detail-copy" hidden>${description}</span>
      </span>
    </button>`;

  const messTip = (message, person, role) => `
    <article class="mess-tip">
      <p>“${message}”</p>
      <footer><strong>${person}</strong><span>${role}</span></footer>
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
      tabGroups: [
        { id: "briefing", label: "Briefing", tabs: ["briefing", "notices"] },
        { id: "personnel", label: "Personnel", tabs: ["ranks", "medals"] },
        { id: "intelligence", label: "Fleet Intelligence", tabs: ["allies", "threats", "phenomena"] },
        { id: "operations", label: "Operations", tabs: ["protocols", "hides-guide", "supply-drops"] }
      ],
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
        { id: "ranks", label: "Ranks", content: `
          <div class="section-heading"><span class="micro-label">FLEET PERSONNEL // RANK STRUCTURE</span><h2>UFN Officer Ranks</h2><p>The rank insignia below are the recognised officer grades used across the United Federated Navy.</p></div>
          <div class="promotion-regulation">
            <span class="classification">PROMOTION AUTHORITY</span>
            <div>
              <h3>Rank progression and approval</h3>
              <p>All new UFN recruits begin service at the rank of <strong>Ensign</strong>. Promotion to <strong>Sub Lieutenant</strong> or <strong>Lieutenant</strong> is at the discretion of your <strong>Flight Controller</strong>.</p>
              <p>Promotion to <strong>Lieutenant Commander</strong> or <strong>Commander</strong> requires the sign-off of an Admiral.</p>
              <p>Promotion to <strong>Captain</strong> or any higher rank is subject to <strong>Admiralty sign-off</strong> and a <strong>full review by the Admirals</strong>.</p>
            </div>
          </div>
          <div class="rank-levels" aria-label="Promotion approval levels">
            <span class="rank-level rank-level-1">Flight Controller progression</span>
            <span class="rank-level rank-level-2">Admiral approval</span>
            <span class="rank-level rank-level-3">Admiralty review</span>
          </div>
          <div class="rank-grid">
            ${rankCard("Ensign", "ensign.png", "Starting rank for all new UFN recruits.", 1)}
            ${rankCard("Sub Lieutenant", "sub-lieutenant.png", "Promotion to this rank is at the discretion of your Flight Controller.", 1)}
            ${rankCard("Lieutenant", "lieutenant.png", "Promotion to this rank is at the discretion of your Flight Controller.", 1)}
            ${rankCard("Lieutenant Commander", "lieutenant-commander.png", "Admiral sign-off required for promotion to this rank.", 2, true)}
            ${rankCard("Commander", "commander.png", "Admiral sign-off required for promotion to this rank.", 2)}
            ${rankCard("Captain", "captain.png", "Admiralty sign-off and full review by the Admirals required.", 3, true)}
            ${rankCard("Commodore", "commodore.png", "Admiralty sign-off and full review by the Admirals required.", 3)}
            ${rankCard("Rear Admiral", "rear-admiral.png", "Admiralty sign-off and full review by the Admirals required.", 3)}
            ${rankCard("Vice Admiral", "vice-admiral.png", "Admiralty sign-off and full review by the Admirals required.", 3)}
            ${rankCard("Admiral", "admiral.png", "Admiralty sign-off and full review by the Admirals required.", 3)}
          </div>
        `},
        { id: "medals", label: "Medals of Service", content: `
          <div class="section-heading"><span class="micro-label">FLEET PERSONNEL // DECORATIONS</span><h2>Medals of Service</h2><p>Select a decoration to open its Fleet Personnel citation record.</p></div>
          <div class="medal-grid" aria-label="UFN medals of service">
            ${medalCard("command", "Star of Command", "star-of-command.png", "Awarded for exceptional leadership under pressure. Presented to officers who demonstrate decisive judgement, inspire confidence in their crew, and maintain effective command when circumstances demand clarity, courage and responsibility.")}
            ${medalCard("flight", "Citation for Flight Excellence", "flight-excellence.png", "Recognises outstanding helm control and flight performance. Presented for exceptional skill in navigation, manoeuvring and ship handling, particularly where precision, judgement and control have contributed significantly to mission success.")}
            ${medalCard("gunnery", "Tactical Gunnery Cross", "tactical-gunnery.png", "Awarded for precision, effectiveness and courage in combat. Recognises exceptional weapons performance where disciplined targeting, tactical judgement and decisive action have made a significant contribution to the protection of the crew or successful completion of a mission.")}
            ${medalCard("engineering", "Engineering Merit Medal", "engineering-merit.png", "Recognises exceptional technical skill and engineering service. Presented to personnel whose management of ship systems, power, damage or repairs has demonstrated outstanding ability and materially contributed to the survival or effectiveness of their vessel.")}
            ${medalCard("science", "Medal for Scientific Distinction", "scientific-distinction.png", "Awarded for outstanding scientific insight and analysis. Recognises personnel whose scanning, investigation or interpretation of scientific information has uncovered critical intelligence, solved a significant problem or directly contributed to mission success.")}
            ${medalCard("comms", "Fleet Communications Citation", "fleet-communications.png", "Recognises excellence in relay, coordination and communications support. Presented for exceptional management of information, communications and fleet coordination, ensuring that vital intelligence reaches the right people and that crews remain connected during demanding operations.")}
            ${medalCard("diplomacy", "Diplomatic Service Citation", "diplomatic-service.png", "Awarded for distinction in negotiation, diplomacy and peaceful resolution. Recognises personnel whose communication, judgement and restraint have strengthened relations, resolved conflict or achieved an operational objective without unnecessary escalation.")}
            ${medalCard("achievement", "Medal for Superior Achievement", "superior-achievement.png", "Recognises exceptional performance beyond normal duty expectations. Presented to personnel whose initiative, skill or determination has produced an outstanding result and whose contribution represents a particularly notable example of service to the United Federated Navy.")}
            ${medalCard("smarty", "The Smarty Special Medal", "smarty-special.png", "For a plan that definitely made sense... briefly. Presented to those who committed to a course of action that felt clever in the moment and questionable immediately after. A celebration of optimism over outcomes.")}
            ${medalCard("light-dark", "Light and Dark Campaign Medal", "light-dark-campaign.png", "Award citation and associated operational record withheld by order of UFN Intelligence. Access to further information requires appropriate security clearance.", true)}
          </div>
          <dialog class="medal-dialog" id="medal-dossier" aria-labelledby="medal-dialog-title">
            <div class="medal-dialog-shell">
              <button class="medal-dialog-close" type="button" aria-label="Close medal record">×</button>
              <div class="medal-dialog-art"><img id="medal-dialog-image" src="" alt="" /></div>
              <div class="medal-dialog-copy">
                <span class="classification" id="medal-dialog-classification">FLEET PERSONNEL // DECORATION RECORD</span>
                <span class="micro-label">OFFICIAL SERVICE CITATION</span>
                <h3 id="medal-dialog-title"></h3>
                <div id="medal-dialog-description" class="medal-dialog-description"></div>
              </div>
            </div>
          </dialog>
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
        { id: "hides-guide", label: "H.I.D.E.S.", content: `
          <div class="section-heading"><span class="micro-label">OPERATIONS // CYBER DEFENCE</span><h2>H.I.D.E.S.</h2><p><strong>Hacking Intrusion Detection and Elimination System</strong> is the ship's defence against hostile cyber intrusion. Enemy vessels may hack ship systems; H.I.D.E.S. detects the attack, identifies the hack and level, and works to eliminate it.</p></div>
          <div class="callout-strip"><strong>THE IMPORTANT DISTINCTION:</strong><span>H.I.D.E.S. does not cause these effects. The hostile hacker does. H.I.D.E.S. is the protection system working to detect and clear the intrusion.</span></div>
          <div class="hides-incident-stack">
            ${hidesCard(
              "DRIVE LOCK", "HELMS", "HOSTILE HACK", "Movement disabled",
              `<p><strong>Enemy effect:</strong> Warp and jump are disabled, impulse is forced to zero and the ship cannot rotate. No system damage is caused.</p><p><strong>What matters:</strong> Clearance time increases with hack level.</p>`,
              `<p>H.I.D.E.S. removes the lock and restores normal drive controls.</p>`,
              [["I","10s"],["II","12s"],["III","15s"],["IV","18s"],["V","20s"]],
              ["Level","H.I.D.E.S. clearance"]
            )}
            ${hidesCard(
              "DRIVE DECAY", "HELMS", "HOSTILE HACK", "Propulsion damage",
              `<p><strong>Enemy effect:</strong> Impulse, manoeuvring, warp and jump drive each take an immediate 10% damage hit, then continue taking damage once per second. Damage caps at 100%.</p><p><strong>H.I.D.E.S. clearance:</strong> 10 seconds at every level.</p>`,
              `<p>H.I.D.E.S. stops further decay. Damage already caused remains for Engineering to repair.</p>`,
              [["I","+1%/sec"],["II","+2%/sec"],["III","+3%/sec"],["IV","+4%/sec"],["V","+5%/sec"]],
              ["Level","Ongoing damage"]
            )}
            ${hidesCard(
              "FIRE DECAY", "WEAPONS", "HOSTILE HACK", "Weapons damaged",
              `<p><strong>Enemy effect:</strong> Beam weapons and missile systems each take an immediate 10% damage hit, then continue taking damage once per second. Damage caps at 100%.</p><p><strong>H.I.D.E.S. clearance:</strong> 10 seconds at every level.</p>`,
              `<p>H.I.D.E.S. stops further decay. Damage already caused remains for Engineering to repair.</p>`,
              [["I","+1%/sec"],["II","+2%/sec"],["III","+3%/sec"],["IV","+4%/sec"],["V","+5%/sec"]],
              ["Level","Ongoing damage"]
            )}
            ${hidesCard(
              "MISSILE SCRAMBLE", "WEAPONS", "HOSTILE HACK", "Tubes disabled",
              `<p><strong>Enemy effect:</strong> All weapon tubes are taken offline and the active tube count is reduced to zero. Stored ordnance is retained and no system damage is caused.</p><p><strong>What matters:</strong> Clearance time increases with hack level.</p>`,
              `<p>H.I.D.E.S. restores the previous weapon-tube count and standard player tube configuration.</p>`,
              [["I","10s"],["II","12s"],["III","15s"],["IV","18s"],["V","20s"]],
              ["Level","H.I.D.E.S. clearance"]
            )}
            ${hidesCard(
              "SHIELD COLLAPSE", "WEAPONS", "HOSTILE HACK", "Shields draining",
              `<p><strong>Enemy effect:</strong> Front shields and, where fitted, rear shields lose strength once per second. Shields cannot fall below zero.</p><p><strong>H.I.D.E.S. clearance:</strong> 10 seconds at every level.</p>`,
              `<p>H.I.D.E.S. stops the continuing drain. Shield strength already lost must recover normally.</p>`,
              [["I","4/sec"],["II","6/sec"],["III","8/sec"],["IV","10/sec"],["V","12/sec"]],
              ["Level","Shield drain"]
            )}
            ${hidesCard(
              "HEAT SURGE", "ENGINEERING", "HOSTILE HACK", "Heat forced upward",
              `<p><strong>Enemy effect:</strong> A unique selection of installed systems is forced to the level's starting heat, then gains +2% heat every second. Heat caps at 100%.</p><p><strong>Possible targets:</strong> Reactor, beam weapons, missile systems, manoeuvring, impulse, warp, jump drive, front shield, rear shield and sensors.</p><p><strong>H.I.D.E.S. clearance:</strong> 10 seconds at every level.</p>`,
              `<p>H.I.D.E.S. stops the forced heat increase. Existing heat remains for Engineering to manage.</p>`,
              [["I","3 systems","10%"],["II","4 systems","15%"],["III","5 systems","20%"],["IV","6 systems","25%"],["V","7 systems","30%"]],
              ["Level","Systems affected","Starting heat"]
            )}
            ${hidesCard(
              "GRID DECAY", "ENGINEERING", "HOSTILE HACK", "Grid systems damaged",
              `<p><strong>Enemy effect:</strong> Reactor, front shield and rear shield systems take immediate damage, then continue taking damage once per second. Damage caps at 100%.</p><p><strong>H.I.D.E.S. clearance:</strong> 10 seconds at every level.</p>`,
              `<p>H.I.D.E.S. stops further decay. Damage already caused remains for Engineering to repair.</p>`,
              [["I","10%","+1%/sec"],["II","15%","+1.5%/sec"],["III","20%","+2%/sec"],["IV","25%","+2.5%/sec"],["V","30%","+3%/sec"]],
              ["Level","Initial damage","Ongoing damage"]
            )}
          </div>
          <div class="callout-strip warning"><strong>CREW RESPONSE:</strong><span>Report the hack name and level. Let H.I.D.E.S. clear the intrusion while the affected station manages the immediate loss of capability and Engineering manages heat or lasting damage.</span></div>
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
          <div class="protocol-manual">
            <article class="protocol-entry">
              <header><span>01</span><div><small>COMMUNICATIONS</small><h3>Comms Etiquette</h3></div></header>
              <div class="protocol-entry-body"><p class="big-rule">Speak clearly. Speak briefly. Speak when it matters.</p><p><strong>Always sign off before closing comms.</strong> Closing the communications window will also close any active voice communications. Routine communications can be handled by the station officer. Escalate to the Captain when the information changes mission priorities, risk or tactical decisions.</p></div>
            </article>
            <article class="protocol-entry">
              <header><span>02</span><div><small>EMERGENCY SURVIVAL</small><h3>Escape Pod Teleportation</h3></div></header>
              <div class="protocol-entry-body"><p>In a crisis, crew will automatically teleport to the escape pod. Keep the transport path clear and your identification systems available.</p><div class="protocol-checks"><p><strong>Transport path:</strong> Do not wear transporter-blocking clothing. Avoid hardened anti-teleport features and deactivate dampening fields.</p><p><strong>UFN identification:</strong> Keep your UFN ID card secure and carried so the system can obtain a transporter lock.</p><p><strong>Suit and comms:</strong> Keep your suit ID linked to the teleporter unit and communication devices online.</p></div><p><strong>Stay alert. Escape pod teleportation saves lives.</strong></p></div>
            </article>
            <article class="protocol-entry">
              <header><span>03</span><div><small>FLEET SUPPORT</small><h3>Flight Commander Support</h3></div></header>
              <div class="protocol-entry-body"><p>The Flight Commander monitors the wider sector picture while the crew operates its own ship. Expect contact when intelligence changes, mission priorities shift or a wider sector development affects the mission.</p><p class="big-rule">You can always call for help.</p><div class="protocol-checks"><p>Call if the crew does not know what to do next.</p><p>Call if combat is becoming uncomfortable.</p><p>Call for reinforcements, supply, clarification, extraction or other external support.</p></div><p>Competent crews will usually be allowed to operate without continuous instruction.</p></div>
            </article>
          </div>
        `},
        { id: "notices", label: "Tips from the Mess", content: `
          <div class="section-heading"><span class="micro-label">OFF-DUTY WISDOM // CREW MESS</span><h2>Tips from the Mess</h2><p>Unofficial advice passed between UFN personnel. Useful, occasionally opinionated, and almost certainly learned the hard way.</p></div>
          <div class="mess-board">
            ${messTip("Scan it before you shoot it. You will save ammunition, paperwork, and at least one very awkward apology.", "Lt. Amina Vale", "Science Officer")}
            ${messTip("If Helms says the minefield is fine, ask whether they mean ‘fine’ as in safe or ‘fine’ as in interesting.", "Sub Lt. Owen Mercer", "Relay Officer")}
            ${messTip("The reactor being capable of 200% does not make 200% a lifestyle choice.", "Cmdr. Hana Okafor", "Engineering Officer")}
            ${messTip("Missiles are finite. Targets are usually not. Pick the one you actually need gone.", "Lt. Mara Chen", "Weapons Officer")}
            ${messTip("If you are about to close a channel, sign off first. Relay officers remember. Relay officers always remember.", "Sub Lt. Jamie Kaur", "Communications Officer")}
            ${messTip("Captains: tell us what you want to achieve. We know which controls make it happen.", "Lt. Daniel Price", "Helms Officer")}
            ${messTip("If something appears on the map that nobody understands, report it before deciding to fly directly at it.", "Cmdr. Sofia Reyes", "Patrol Commander")}
            ${messTip("Request the supply drop before Engineering starts describing the hull in the past tense.", "Lt. Idris Bennett", "Logistics Officer")}
            ${messTip("Shields work better when they are on. This concludes today's tactical seminar.", "Lt. Grace Mensah", "Weapons Officer")}
            ${messTip("When the bridge goes quiet after you ask ‘what could possibly go wrong?’, you have already made a mistake.", "Sub Lt. Alex Novak", "Science Officer")}
          </div>
          <div class="mess-feature-grid">
            ${infoCard("Lessons Heard Around the Fleet", `<ul><li>Did anyone remember to scan it?</li><li>Why are we flying directly at the mines?</li><li>Who told the pirates our cargo manifest?</li><li>Why are the shields off?</li><li>Do we still have enough energy for the jump?</li><li>What do you mean you destroyed your ship?!</li><li>Why are we broadcasting on an open channel?!</li><li>Can we talk about this after the crisis? No. Apparently we cannot.</li></ul>`)}
            ${infoCard("UFN Command Academy", `<p><strong>Flight Controller Training Program</strong></p><p>Create out-of-this-world experiences, tell exciting stories in a fully realised universe, and learn how to guide crews through danger, diplomacy and discovery.</p><p>“Train with the best - graduate as the best.”</p><p><strong>Contact Commodore Smarty for more information.</strong></p>`)}
            ${infoCard("A Final Word from Flight Command", `<p><strong>The Flight Commander can see everything.</strong></p><p>This is sometimes reassuring. It is sometimes not.</p>`, "gold")}
          </div>
        `}
      ]
    },

    captain: {
      eyebrow: "SHIPBOARD DUTY STATION",
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
            ${controlCard("H.I.D.E.S. status", "UFN STATUS PANEL", `<p>The right-hand panel reports hostile hacks detected by H.I.D.E.S. that are affecting Helms.</p><p><strong>Use it:</strong> Report the hack name and level immediately, then open the <strong>H.I.D.E.S.</strong> section for the effect and expected clearance time.</p>`)}
          </div>
        `},
        { id: "station-training", label: "Station Specific Training", content: `
          <div class="section-heading">
            <span class="micro-label">HELMS // CONSOLIDATED REFERENCE</span>
            <h2>Station Specific Training</h2>
            <p>Core reference material specific to the Helms station, grouped here to keep the station guide compact and easier to navigate.</p>
          </div>
          <section class="station-training-topic" aria-labelledby="helms-propulsion-heading">
            <div class="section-heading compact">
              <span class="micro-label">HELMS TRAINING</span>
              <h2 id="helms-propulsion-heading">Propulsion</h2>
            </div>
          <div class="reference-grid">
            ${infoCard("Impulse", `<p>The impulse control runs from full reverse through stop to full ahead. It is the ship’s normal manoeuvring drive.</p>`)}
            ${infoCard("Warp", `<p>Where fitted, warp propels the ship straight ahead several times faster than impulse, but drains energy much faster. A ship at warp can still collide with hazards such as asteroids and mines.</p>`)}
            ${infoCard("Jump Drive", `<p>Where fitted, the jump drive teleports the ship the selected distance along its current heading. Impulse shuts down during the jump sequence. Longer jumps consume more energy. The station tutorial specifies a standard 10-second jump initiation, with drive power and damage able to affect preparation.</p>`)}
          </div>
        
          </section>
          <section class="station-training-topic" aria-labelledby="helms-manoeuvres-heading">
            <div class="section-heading compact">
              <span class="micro-label">HELMS TRAINING</span>
              <h2 id="helms-manoeuvres-heading">Combat Manoeuvres</h2>
            </div>
<div class="two-column-cards">
            ${infoCard("Boost", `<p>Vertical combat-manoeuvre input rapidly increases forward speed above normal cruising maximum and generates heat in the impulse engines.</p>`)}
            ${infoCard("Strafe", `<p>Horizontal combat-manoeuvre input moves the ship laterally and can rapidly overheat the manoeuvring system.</p>`)}
          </div>
          <p class="reference-note">Combat manoeuvres consume their available charge and recharge over time.</p>
        
          </section>
          <section class="station-training-topic" aria-labelledby="helms-docking-heading">
            <div class="section-heading compact">
              <span class="micro-label">HELMS TRAINING</span>
              <h2 id="helms-docking-heading">Docking & Retrieval</h2>
            </div>
<div class="two-column-cards">
            ${infoCard("Docking", `<p>Helms can dock with a friendly or neutral station - and in some cases a larger ship - when within 1U. While docked, engines and weapons cannot be used. Energy recharges faster, repairs take less time, probes are replenished, and Relay can request missile rearmament.</p>`)}
            ${infoCard("Retrieving Objects", `<p>Helms is responsible for piloting the ship into supply drops and other retrievable objects to collect them.</p>`)}
          </div>
        
          </section>
        `},
        { id: "hides", label: "H.I.D.E.S.", content: `
          <div class="hides-header"><span class="classification">HELMS // CYBER DEFENCE</span><h2>H.I.D.E.S.</h2><p><strong>Hacking Intrusion Detection and Elimination System</strong> protects the ship against hostile cyber attacks. Enemies cause the hacks below; H.I.D.E.S. detects the intrusion, identifies its level and works to remove it.</p></div>
          <div class="hides-incident-stack">
            ${hidesCard(
              "DRIVE LOCK", "HELMS", "HOSTILE HACK", "Movement disabled",
              `<p><strong>Enemy effect:</strong> Warp and jump are disabled, impulse is forced to zero and the ship cannot rotate. Drive Lock causes no system damage.</p><p><strong>What matters:</strong> Clearance time increases with hack level.</p>`,
              `<p>H.I.D.E.S. removes the lock and restores warp, jump, impulse and rotation to their normal baseline settings.</p>`,
              [["I","10s"],["II","12s"],["III","15s"],["IV","18s"],["V","20s"]],
              ["Level","H.I.D.E.S. clearance"]
            )}
            ${hidesCard(
              "DRIVE DECAY", "HELMS", "HOSTILE HACK", "Propulsion damage",
              `<p><strong>Enemy effect:</strong> Impulse, manoeuvring, warp and jump drive each take an immediate 10% damage hit, then continue taking damage once per second. Damage caps at 100%.</p><p><strong>H.I.D.E.S. clearance:</strong> 10 seconds at every level. The level controls the ongoing damage rate.</p>`,
              `<p>H.I.D.E.S. stops further decay. Damage already caused remains and must be repaired by Engineering.</p>`,
              [["I","+1%/sec"],["II","+2%/sec"],["III","+3%/sec"],["IV","+4%/sec"],["V","+5%/sec"]],
              ["Level","Ongoing damage"]
            )}
          </div>
          <div class="callout-strip"><strong>HELMS RESPONSE:</strong><span>Report the hack and level immediately. H.I.D.E.S. handles removal; Helms manages the loss of movement while Engineering deals with any damage left by Drive Decay.</span></div>
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
            ${controlCard("H.I.D.E.S. status", "UFN STATUS PANEL", `<p>Reports hostile hacks detected by H.I.D.E.S. that are affecting Weapons.</p><p><strong>Use it:</strong> Report the hack name and level immediately, then check the <strong>H.I.D.E.S.</strong> section for the effect, continuing damage or drain, and expected clearance time.</p>`)}
          </div>
        `},
        { id: "station-training", label: "Station Specific Training", content: `
          <div class="section-heading">
            <span class="micro-label">WEAPONS // CONSOLIDATED REFERENCE</span>
            <h2>Station Specific Training</h2>
            <p>Core reference material specific to the Weapons station, grouped here to keep the station guide compact and easier to navigate.</p>
          </div>
          <section class="station-training-topic" aria-labelledby="weapons-targeting-heading">
            <div class="section-heading compact">
              <span class="micro-label">WEAPONS TRAINING</span>
              <h2 id="weapons-targeting-heading">Targeting & Tubes</h2>
            </div>
          <div class="two-column-cards">
            ${infoCard("Missile Tubes", `<p>Select a missile type, then select a compatible tube to load it. Loading and unloading takes time. Tubes face specific directions, so ship orientation matters.</p><p>Except for HVLIs, missiles home on the selected target. Without a target they are dumb-fired in a straight line from the tube. Tubes can be locked to a target or manually aimed.</p>`)}
            ${infoCard("Subsystem Targeting", `<p>Beam weapons target the hull by default. Weapons can instead select a specific subsystem when the objective is to disable rather than simply destroy a vessel.</p>`)}
          </div>
        
          </section>
          <section class="station-training-topic" aria-labelledby="weapons-ordnance-heading">
            <div class="section-heading compact">
              <span class="micro-label">WEAPONS TRAINING</span>
              <h2 id="weapons-ordnance-heading">Ordnance Reference</h2>
            </div>
          <div class="ordnance-grid">
            ${infoCard("Homing", `<p>A simple, high-speed guided missile with a small warhead.</p>`)}
            ${infoCard("Nuke", `<p>A powerful homing missile that deals tremendous damage to all ships within 1U of detonation.</p>`)}
            ${infoCard("EMP", `<p>A homing missile that deals powerful shield damage to all ships within 1U of detonation, without damaging physical systems or hulls.</p>`)}
            ${infoCard("HVLI", `<p>Five simple lead slugs fired in a single burst at extremely high velocity. HVLI rounds do not home on a target.</p>`)}
            ${infoCard("Mine", `<p>A powerful stationary explosive that detonates when a ship comes within 0.6U. The explosion damages all objects within a 1U radius.</p>`)}
          </div>
          <div class="callout-strip warning"><strong>AMMUNITION:</strong><span>Missiles are limited. Use them wisely.</span></div>
        
          </section>
          <section class="station-training-topic" aria-labelledby="weapons-beams-shields-heading">
            <div class="section-heading compact">
              <span class="micro-label">WEAPONS TRAINING</span>
              <h2 id="weapons-beams-shields-heading">Beams & Shields</h2>
            </div>
          <div class="reference-grid">
            ${infoCard("Beam Weapons", `<p>Red firing arcs show beam locations and ranges. Once a target is selected, beams fire automatically whenever the target is inside an available firing arc. Beam frequency can be changed instantly where frequency mechanics are enabled.</p>`)}
            ${infoCard("Shield Frequencies", `<p>Science can provide target shield-frequency information. Beam frequency can be adjusted to exploit it. Your own shields can also be modulated, but shield remodulation takes them offline for several seconds.</p>`)}
            ${infoCard("Shield Discipline", `<p>Weapons is responsible for raising shields. Keeping them active continuously consumes significantly more power, so shield state is an operational choice rather than a free default.</p>`)}
          </div>
        
          </section>
        `},
        { id: "hides", label: "H.I.D.E.S.", content: `
          <div class="hides-header"><span class="classification">WEAPONS // CYBER DEFENCE</span><h2>H.I.D.E.S.</h2><p><strong>Hacking Intrusion Detection and Elimination System</strong> protects the ship against hostile cyber attacks. Enemies cause the hacks below; H.I.D.E.S. detects the intrusion, identifies its level and works to remove it.</p></div>
          <div class="hides-incident-stack">
            ${hidesCard(
              "FIRE DECAY", "WEAPONS", "HOSTILE HACK", "Weapons damaged",
              `<p><strong>Enemy effect:</strong> Beam weapons and missile systems each take an immediate 10% damage hit, then continue taking damage once per second. Damage caps at 100%.</p><p><strong>H.I.D.E.S. clearance:</strong> 10 seconds at every level. The level controls the ongoing damage rate.</p>`,
              `<p>H.I.D.E.S. stops further decay. Damage already caused remains and must be repaired by Engineering.</p>`,
              [["I","+1%/sec"],["II","+2%/sec"],["III","+3%/sec"],["IV","+4%/sec"],["V","+5%/sec"]],
              ["Level","Ongoing damage"]
            )}
            ${hidesCard(
              "MISSILE SCRAMBLE", "WEAPONS", "HOSTILE HACK", "Tubes disabled",
              `<p><strong>Enemy effect:</strong> All weapon tubes are taken offline and the active tube count is reduced to zero. Stored ordnance is not lost and no system damage is caused.</p><p><strong>What matters:</strong> Clearance time increases with hack level.</p>`,
              `<p>H.I.D.E.S. restores the previous weapon-tube count and standard player tube configuration.</p>`,
              [["I","10s"],["II","12s"],["III","15s"],["IV","18s"],["V","20s"]],
              ["Level","H.I.D.E.S. clearance"]
            )}
            ${hidesCard(
              "SHIELD COLLAPSE", "WEAPONS", "HOSTILE HACK", "Shields draining",
              `<p><strong>Enemy effect:</strong> Front shields and, where fitted, rear shields lose strength once per second. Shields cannot fall below zero.</p><p><strong>H.I.D.E.S. clearance:</strong> 10 seconds at every level. The level controls the drain rate.</p>`,
              `<p>H.I.D.E.S. stops the continuing drain. Shield strength already lost is not restored by clearance and must recover normally.</p>`,
              [["I","4/sec"],["II","6/sec"],["III","8/sec"],["IV","10/sec"],["V","12/sec"]],
              ["Level","Shield drain"]
            )}
          </div>
          <div class="callout-strip"><strong>WEAPONS RESPONSE:</strong><span>Report the hack and level immediately. H.I.D.E.S. handles removal; Weapons adapts to lost tubes or shields while Engineering repairs any system damage left by Fire Decay.</span></div>
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
            ${controlCard("H.I.D.E.S. status", "UFN STATUS PANEL", `<p>Shows hostile hacks detected by H.I.D.E.S. that are affecting Engineering systems.</p><p><strong>Use it:</strong> Report the hack name and level immediately. For Heat Surge, manage the affected heat load while H.I.D.E.S. clears the intrusion. For Grid Decay, prepare to repair any damage left behind after clearance.</p>`)}
          </div>
        `},
        { id: "station-training", label: "Station Specific Training", content: `
          <div class="section-heading">
            <span class="micro-label">ENGINEERING // CONSOLIDATED REFERENCE</span>
            <h2>Station Specific Training</h2>
            <p>Core reference material specific to the Engineering station, grouped here to keep the station guide compact and easier to navigate.</p>
          </div>
          <section class="station-training-topic" aria-labelledby="engineering-power-heat-heading">
            <div class="section-heading compact">
              <span class="micro-label">ENGINEERING TRAINING</span>
              <h2 id="engineering-power-heat-heading">Power & Heat</h2>
            </div>
<div class="two-column-cards">
            ${infoCard("Power Allocation", `<p>More power increases system output. The station tutorial gives three explicit examples: an overpowered reactor produces more energy; overpowered shields reduce more damage and regenerate faster; overpowered impulse engines increase maximum speed.</p><p>Power above 100% increases heat generation and, except for the reactor, energy draw. Underpowering reduces both heat output and energy draw.</p>`)}
            ${infoCard("Coolant Management", `<p>Adding coolant reduces temperature and helps prevent overheating damage. The ship has an unlimited coolant reserve, but only a finite quantity can be applied across systems at once.</p><p>The temperature column uses white arrows to indicate whether a system is heating or cooling; brighter arrows indicate a stronger trend.</p>`)}
          </div>
          <div class="callout-strip warning"><strong>ENGINEERING NOTICE:</strong><span>Monitor reactor output carefully. Overloading the grid disables systems.</span></div>
        
          </section>
          <section class="station-training-topic" aria-labelledby="engineering-repairs-heading">
            <div class="section-heading compact">
              <span class="micro-label">ENGINEERING TRAINING</span>
              <h2 id="engineering-repairs-heading">Damage & Repairs</h2>
            </div>
<div class="two-column-cards">
            ${infoCard("System damage", `<p>Systems can be damaged by weapons fire, collisions with space hazards or overheating. The station tutorial describes system condition from -100% to 100%; below 100% performance is reduced, and at or below 0% the system stops functioning.</p>`)}
            ${infoCard("Repair crews", `<p>Repair a system by sending a repair crew to the room containing it. Hull damage affects the entire ship. Docking can repair hull damage, but hull repair progresses very slowly.</p>`)}
          </div>
        
          </section>
        `},
        { id: "hides", label: "H.I.D.E.S.", content: `
          <div class="hides-header"><span class="classification">ENGINEERING // CYBER DEFENCE</span><h2>H.I.D.E.S.</h2><p><strong>Hacking Intrusion Detection and Elimination System</strong> protects the ship against hostile cyber attacks. Enemies cause the hacks below; H.I.D.E.S. detects the intrusion, identifies its level and works to remove it.</p></div>
          <div class="hides-incident-stack">
            ${hidesCard(
              "HEAT SURGE", "ENGINEERING", "HOSTILE HACK", "Heat forced upward",
              `<p><strong>Enemy effect:</strong> A unique selection of installed systems is forced to the level's starting heat, then gains +2% heat every second. Heat caps at 100%.</p><p><strong>Possible targets:</strong> Reactor, beam weapons, missile systems, manoeuvring, impulse, warp, jump drive, front shield, rear shield and sensors.</p><p><strong>H.I.D.E.S. clearance:</strong> 10 seconds at every level.</p>`,
              `<p>H.I.D.E.S. stops the forced heat increase. Existing heat remains, so Engineering must cool and manage affected systems normally.</p>`,
              [["I","3 systems","10%"],["II","4 systems","15%"],["III","5 systems","20%"],["IV","6 systems","25%"],["V","7 systems","30%"]],
              ["Level","Systems affected","Starting heat"]
            )}
            ${hidesCard(
              "GRID DECAY", "ENGINEERING", "HOSTILE HACK", "Grid systems damaged",
              `<p><strong>Enemy effect:</strong> Reactor, front shield and rear shield systems take immediate damage, then continue taking damage once per second. Damage caps at 100%.</p><p><strong>H.I.D.E.S. clearance:</strong> 10 seconds at every level.</p>`,
              `<p>H.I.D.E.S. stops further decay. Damage already caused remains and must be repaired normally.</p>`,
              [["I","10%","+1%/sec"],["II","15%","+1.5%/sec"],["III","20%","+2%/sec"],["IV","25%","+2.5%/sec"],["V","30%","+3%/sec"]],
              ["Level","Initial damage","Ongoing damage"]
            )}
          </div>
          <div class="callout-strip warning"><strong>ENGINEERING RESPONSE:</strong><span>H.I.D.E.S. removes the hostile intrusion; Engineering manages its consequences. Start cooling during Heat Surge immediately and expect repair work after Grid Decay.</span></div>
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
        { id: "station-training", label: "Station Specific Training", content: `
          <div class="section-heading">
            <span class="micro-label">SCIENCE // CONSOLIDATED REFERENCE</span>
            <h2>Station Specific Training</h2>
            <p>Core reference material specific to the Science station, grouped here to keep the station guide compact and easier to navigate.</p>
          </div>
          <section class="station-training-topic" aria-labelledby="science-sensors-heading">
            <div class="section-heading compact">
              <span class="micro-label">SCIENCE TRAINING</span>
              <h2 id="science-sensors-heading">Sensors</h2>
            </div>
          <div class="reference-grid">
            ${infoCard("Long-range radar", `<p>The Science officer’s primary situational-awareness tool. Report the sector’s status and meaningful changes. Interference bands at the edge can hint at activity beyond direct sensor range but require interpretation.</p>`)}
            ${infoCard("Nebulae", `<p>Nebulae block long-range scanning. Science cannot see objects inside or behind them; while the ship is inside a nebula, its radars cannot detect outside it. Report sensor blind spots to Captain and Relay.</p>`)}
            ${infoCard("Probe View", `<p>Relay can link one launched probe to Science. Science can then use the probe’s short-range sensor data and scan contacts in its range, including when the probe is beyond the ship’s long-range sensors or inside a nebula.</p>`)}
          </div>
        
          </section>
          <section class="station-training-topic" aria-labelledby="science-scanning-heading">
            <div class="section-heading compact">
              <span class="micro-label">SCIENCE TRAINING</span>
              <h2 id="science-scanning-heading">Scanning Reference</h2>
            </div>
<div class="scan-states">
            <div><span>01</span><strong>Simple Scan</strong><p>Completing the initial scan reveals additional target information used for identification and assessment.</p></div>
            <div><span>02</span><strong>Full Scan</strong><p>A further deep scan reveals the detailed tactical information available from the contact, including data used by other bridge stations.</p></div>
          </div>
          <div class="two-column-cards">
            ${infoCard("Identification colours", `<p>The station tutorial identifies unknown contacts as grey, friendly as green, hostile as red and neutral as blue.</p>`)}
            ${infoCard("Deep-scan value", `<p>A full/deep scan can reveal shield and beam frequency information where those mechanics are enabled. Helms and Weapons can also see firing arcs of fully scanned ships.</p>`)}
          </div>
        
          </section>
          <section class="station-training-topic" aria-labelledby="science-database-heading">
            <div class="section-heading compact">
              <span class="micro-label">SCIENCE TRAINING</span>
              <h2 id="science-database-heading">Science Database</h2>
            </div>
<p class="lead-copy">The station database contains known ships plus information on weapons and space hazards. Use it to assess a scanned ship’s likely capabilities or to check hazards such as black holes, wormholes and other anomalies.</p>
          <div class="callout-strip"><strong>SCIENCE:</strong><span>Unknown contacts: scan before engaging. Information wins battles.</span></div>
        
          </section>
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
            ${controlCard("Open Comms", "COMMUNICATION CONTROL", `<p>Opens communications with the selected ship or station when communications are available.</p><p><strong>How:</strong> Select the contact, press Open Comms, handle the exchange, pass any decision or new information to Captain, and sign off before closing the channel. <strong>Closing the comms window also closes any active voice communications.</strong></p>`)}
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
        { id: "station-training", label: "Station Specific Training", content: `
          <div class="section-heading">
            <span class="micro-label">RELAY // CONSOLIDATED REFERENCE</span>
            <h2>Station Specific Training</h2>
            <p>Core reference material specific to the Relay station, grouped here to keep the station guide compact and easier to navigate.</p>
          </div>
          <section class="station-training-topic" aria-labelledby="relay-map-probes-heading">
            <div class="section-heading compact">
              <span class="micro-label">RELAY TRAINING</span>
              <h2 id="relay-map-probes-heading">Maps, Probes & Waypoints</h2>
            </div>
          <div class="reference-grid">
            ${infoCard("Sector Map", `<p>Relay can view the sector map, including hazards and ships within short-range sensor range (5U). It can also see short-range sensor data around other friendly ships and stations. Relay cannot perform scans itself.</p>`)}
            ${infoCard("Probes", `<p>Relay can launch up to eight high-speed probes to points in the sector. A probe transmits short-range sensor data for 10 minutes, works inside nebulae and can be linked to Science. Probes cannot be retrieved, can be destroyed, and are replenished only by docking at a station.</p>`)}
            ${infoCard("Waypoints", `<p>Relay can set waypoints around the sector. They appear on Helms and can guide navigation. Waypoints are also required for some requests for aid from friendly stations.</p>`)}
          </div>
        
          </section>
          <section class="station-training-topic" aria-labelledby="relay-comms-heading">
            <div class="section-heading compact">
              <span class="micro-label">RELAY TRAINING</span>
              <h2 id="relay-comms-heading">Communications</h2>
            </div>
          <div class="two-column-cards">
            ${infoCard("Communications", `<p>Relay can open communications with stations and other ships. Friendly ships can take orders; friendly stations can dispatch backup and supply ships. While docked, Relay can request missile and mine rearmament. Some requests can cost reputation.</p>`)}
            ${infoCard("Fleet protocol", `<p class="big-rule">Speak clearly.<br>Speak briefly.<br>Speak when it matters.</p><p><strong>Always sign off before closing comms.</strong> Closing the communications window will also end any active voice communications.</p>` , "gold")}
          </div>
        
          </section>
          <section class="station-training-topic" aria-labelledby="relay-hacking-reference-heading">
            <div class="section-heading compact">
              <span class="micro-label">RELAY TRAINING</span>
              <h2 id="relay-hacking-reference-heading">Hacking Reference</h2>
            </div>
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
        
          </section>
        `},
        { id: "hacking-lab", label: "Hacking Lab", content: `<div id="hacking-simulator-root"></div>`}
      ]
    }
  };

  window.UFN_CONTENT = content;
})();
