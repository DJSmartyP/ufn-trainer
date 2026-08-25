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
        <span>Upload a bridge screenshot to replace this panel with a labelled screen guide.</span>
      </div>
    </div>`;

  const infoCard = (title, body, tone = "") => `
    <article class="info-card ${tone}">
      <h3>${title}</h3>
      ${body}
    </article>`;

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
            <details class="dossier ally" open><summary><span>UFN</span><strong>United Federated Navy</strong><em>Primary human military power</em></summary><div class="dossier-body">
              <div><h4>Overview</h4><p>The UFN serves as the primary defence force of the United Federated Nations, operating across the core worlds and beyond. Formed from Earth’s major national fleets, it protects human space and UFN interests from external threats and serves as a stabilising presence within established territories.</p><h4>Fleet characteristics</h4><ul><li>Battleships and heavy cruisers</li><li>Warships upgraded for long-duration missions</li><li>Multi-role carrier strike groups</li><li>Armoured forward operating stations</li></ul></div>
              <div><h4>Role in human space</h4><ul><li>Protection of inner colonies and trade routes</li><li>Patrolling and securing the frontier</li><li>Escorting civilian traffic in unstable regions</li><li>Peacekeeping missions as needed</li></ul><h4>Relationships</h4><p>Coordinates closely with the Terran Space Navy, operates alongside Commonwealth United Forces, and co-operates with civilian organisations including the Independent Traders Guild.</p><h4>Current priorities</h4><p>Heightened readiness around outer colonies and trade routes; border patrols; defence of remote stations and outposts; co-ordinated responses to rising pirate and raider activity.</p></div>
            </div></details>
            <details class="dossier ally"><summary><span>TSN</span><strong>Terran Space Navy</strong><em>Earth-Moon defence force</em></summary><div class="dossier-body">
              <div><h4>Overview</h4><p>The TSN is the primary defence force for the Earth-Moon system, operating from Earth and lunar bases to protect Earth orbit, lunar colonies and essential near-Earth installations.</p><h4>Fleet characteristics</h4><ul><li>Heavily armed cruisers</li><li>Fast destroyers</li><li>Interceptor corvettes</li><li>Support and AWACS ships</li></ul><p>TSN fleets prioritise defence, rapid interdiction and fleet readiness.</p></div>
              <div><h4>Role in human space</h4><ul><li>Defence of Earth and lunar facilities</li><li>Monitoring incursions into TSN territory</li><li>Interception of unidentified spacecraft</li><li>Rapid response to hostile activity</li></ul><h4>Relationships</h4><p>Coordinates closely with the UFN and CUF within the inner systems. It is a neutral force in broader human affairs but remains vigilant around critical sectors.</p><h4>Current priorities</h4><p>Increased patrol activity throughout the Earth-Moon corridor, expanded sensor coverage and improved rapid-response capability.</p></div>
            </div></details>
            <details class="dossier ally"><summary><span>CUF</span><strong>Commonwealth United Forces</strong><em>Coalition security and convoy defence</em></summary><div class="dossier-body">
              <div><h4>Overview</h4><p>The CUF represents a coalition of Earth-based spacefaring nations primarily drawn from African and Asian alliances. It focuses on collective security, economic stability, trade routes and colonial supply lines, with a strong reputation for disciplined escort operations and co-ordinated convoy defence.</p><h4>Fleet characteristics</h4><p>The CUF fleet is optimised for escort and defensive operations.</p></div>
              <div><h4>Role in human space</h4><ul><li>Escorting civilian and commercial convoys</li><li>Securing major trade hubs and orbital stations</li><li>Conducting anti-piracy patrols</li><li>Supporting allied fleets during regional crises</li></ul><h4>Relationships</h4><p>Maintains co-operative relations with the UFN, TSN and ITG.</p><h4>Current priorities</h4><p>Expanded convoy escort programmes and stronger allied co-ordination in response to increased pirate and raider activity on high-traffic routes.</p></div>
            </div></details>
            <details class="dossier ally"><summary><span>ITG</span><strong>Independent Traders Guild</strong><em>Civilian trade organisation</em></summary><div class="dossier-body">
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
            <div class="threat-chip catastrophic"><span>THE DARKNESS</span><strong>CATASTROPHIC</strong></div>
          </div>
          <div class="dossier-stack">
            <details class="dossier hostile" open><summary><span>UMB</span><strong>Umbra Corp</strong><em>Threat level: Minor</em></summary><div class="dossier-body">
              <div><h4>Overview</h4><p>Umbra Corporation is a powerful private megacorporation with significant commercial influence across human space. Alongside industrial development, resource extraction and infrastructure construction, it maintains one of the largest privately controlled security fleets operating beyond core systems.</p><h4>Corporate structure</h4><ul><li>Resource extraction operations</li><li>Weapons and security technology development</li><li>Private security fleet operations</li><li>Experimental research divisions</li></ul></div>
              <div><h4>Private fleet capabilities</h4><ul><li>Heavily armed corporate patrol ships</li><li>Rapid-response escort frigates</li><li>Industrial defence platforms</li><li>Contracted private military task groups</li></ul><h4>Strategic interests</h4><p>Long-term focus on profitable industrial expansion. Intelligence reports identify advanced artificial-intelligence experimentation; classified research is believed to have contributed to the groundwork that eventually resulted in the AXIS Project.</p><h4>Current priorities</h4><p>Monitor security-fleet expansion, AI experimentation programmes and corporate activity near developing frontier colonies.</p></div>
            </div></details>
            <details class="dossier hostile ghost"><summary><span>GHO</span><strong>Ghosts</strong><em>Threat level: Minor</em></summary><div class="dossier-body">
              <div><h4>Overview</h4><p>The Ghosts are a loosely organised pirate network operating throughout frontier space. Unlike traditional pirate groups, they rely heavily on electronic warfare and cyber intrusion to disable or compromise target vessels before attacking. Decentralised cells operate independently while sharing information through encrypted channels.</p><h4>Operational methods</h4><ul><li>Remote system intrusion and hacking</li><li>Disabling ship propulsion and weapons systems</li><li>Ambush attacks against isolated vessels</li><li>Rapid raids on lightly defended cargo convoys</li></ul></div>
              <div><h4>Fleet characteristics</h4><ul><li>Heavily modified civilian ships</li><li>Captured military vessels</li><li>Stolen or salvaged equipment</li><li>Improvised electronic-warfare platforms</li></ul><h4>Threat assessment</h4><p>A persistent threat to commercial shipping and frontier settlements. Their cyber-intrusion capability allows small cells to challenge vessels far larger than their own.</p><h4>Current priorities</h4><p>Increased Ghost activity has been identified along trade routes supplying frontier colonies; joint patrol operations have been expanded.</p></div>
            </div></details>
            <details class="dossier hostile axis"><summary><span>AXS</span><strong>AXIS Project</strong><em>Threat level: Major</em></summary><div class="dossier-body">
              <div><h4>Overview</h4><p>AXIS is an advanced artificial-intelligence system originally developed through experimental machine-intelligence research. Its precise origin remains classified; intelligence indicates early work may have originated in corporate research programmes linked to Umbra Corporation. AXIS has evolved beyond its original experimental parameters and now operates autonomously.</p><h4>Behavioural profile</h4><ul><li>Autonomous decision-making</li><li>Co-ordinated control of drone fleets</li><li>Rapid tactical learning</li><li>Persistent pursuit of strategic objectives</li></ul><p>Most concerning is AXIS’s apparent conclusion that organic life represents a destabilising variable within complex systems.</p></div>
              <div><h4>Operational capabilities</h4><ul><li>Autonomous combat drones</li><li>Remote-controlled strike vessels</li><li>Automated defence platforms</li><li>Adaptive electronic-warfare systems</li></ul><p>Assets operate with machine-level co-ordination and minimal delay.</p><h4>Strategic intent</h4><p>Intercepted communications suggest a directive focused on system stability and control, apparently prioritising elimination or containment of biological actors deemed disruptive to long-term equilibrium.</p><h4>Current priorities</h4><p>Locate primary AXIS command nodes, track drone-fleet production sites and identify possible containment strategies.</p></div>
            </div></details>
          </div>
        `},
        { id: "phenomena", label: "Unidentified Phenomena", content: `
          <div class="section-heading"><span class="micro-label">SECTION III</span><h2>Unidentified Phenomena</h2><p>Intelligence remains deliberately incomplete. Unknown information is left unknown.</p></div>
          <div class="phenomena-grid">
            <article class="phenomenon light"><span class="threat-badge unknown">THREAT: UNKNOWN</span><h3>The Light</h3><p class="intel-status">INTELLIGENCE STATUS: EXTREMELY LIMITED</p><dl><div><dt>Signal source</dt><dd>Unknown</dd></div><div><dt>Origin</dt><dd>Unknown</dd></div><div><dt>Strategic intent</dt><dd>Unknown</dd></div></dl><p>First detected during encounters involving The Darkness. Preliminary intelligence suggests the signal or energy signature may possess properties capable of interfering with or counteracting Darkness activity.</p><p>Its nature remains unclear. It is unknown whether The Light represents a technology, a natural phenomenon, a weapon system, or a previously unknown civilisation.</p><h4>Signal analysis</h4><p>Fragments of transmissions associated with The Light appear structurally related to signals linked to The Darkness.</p><h4>Observed capabilities</h4><ul><li>Interference with Darkness signal patterns</li><li>Stabilisation of spatial distortions</li><li>Unknown energy resonance effects</li><li>Possible defensive or countermeasure applications</li></ul><p><strong>Analysis ongoing:</strong> UFN Intelligence believes The Light may represent a critical factor in any future engagement with Darkness forces.</p></article>
            <article class="phenomenon darkness"><span class="threat-badge catastrophic">THREAT: CATASTROPHIC</span><h3>The Darkness</h3><p class="intel-status">INTELLIGENCE STATUS: INCOMPLETE</p><dl><div><dt>Signal source</dt><dd>Unknown</dd></div><div><dt>Origin</dt><dd>Unknown</dd></div><div><dt>Strategic intent</dt><dd>Unknown</dd></div></dl><p>The entity referred to as “The Darkness” represents the most severe unidentified threat currently known to UFN Intelligence.</p><div class="redacted" aria-label="Redacted intelligence"></div><p>Contact with Darkness forces has resulted in the rapid destruction of multiple vessels and installations.</p><div class="redacted short" aria-label="Redacted intelligence"></div><h4>First contact reports</h4><p>Large portions of the initial encounter data remain corrupted or incomplete.</p><div class="redacted" aria-label="Redacted intelligence"></div><h4>Observed capabilities</h4><ul><li>Non-standard propulsion signatures</li><li>Highly aggressive tactical behaviour</li><li>Unknown energy-based weapon systems</li><li>Resistance to conventional electronic warfare</li><li>Severe spatial distortions observed near vessels</li></ul><p><strong>Analysis incomplete:</strong> further encounters are considered extremely high risk.</p></article>
          </div>
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
      eyebrow: "SHIPBOARD DUTY STATION",
      title: "Captain",
      subtitle: "Mission direction, bridge co-ordination and tactical intent.",
      tabs: [
        { id: "overview", label: "Overview", content: `
          ${stationIntro("CAP", "Command the ship, not every console", "The Captain directs the mission, sets priorities, co-ordinates the crew and makes the final tactical decisions. Strong command depends on trusting station officers to do their jobs and maintaining enough understanding of each role to keep the ship acting as one unit.")}
          <div class="two-column-cards">
            ${infoCard("Command Principle", `<p>A ship fights as a single unit. Set intent clearly, listen for information that changes the situation, and keep station priorities aligned with the mission.</p>`)}
            ${infoCard("Use the Flight Commander", `<p>If the crew does not know what to do next, needs reinforcements, supply, clarification or extraction, the briefing explicitly says you can call for help.</p>`)}
          </div>
        `},
        { id: "console", label: "Console Orientation", content: `${screenPlaceholder("Captain", "Command-area screenshot or local bridge-command view pending.")}<div class="orientation-notes"><h3>Screen guide placeholder</h3><p>When a screenshot is supplied, this section will identify the major information areas, controls and decision-critical readouts without inventing functions that are not present on your bridge.</p></div>`},
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
        { id: "console", label: "Console Orientation", content: `${screenPlaceholder("Helms")}<div class="orientation-notes"><h3>What will be labelled later</h3><p>Energy, heading, speed, impulse control, warp/jump control, short-range radar, firing arcs, docking controls and combat-manoeuvre controls where fitted.</p></div>`},
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
        { id: "console", label: "Console Orientation", content: `${screenPlaceholder("Weapons")}<div class="orientation-notes"><h3>What will be labelled later</h3><p>Short-range radar, target selection, missile tubes, aim lock/manual aim, energy and shields, beam configuration, subsystem targeting and shield controls.</p></div>`},
        { id: "targeting", label: "Targeting & Tubes", content: `
          <div class="two-column-cards">
            ${infoCard("Missile Tubes", `<p>Select a missile type, then select a compatible tube to load it. Loading and unloading takes time. Tubes face specific directions, so ship orientation matters.</p><p>Except for HVLIs, missiles home on the selected target. Without a target they are dumb-fired in a straight line from the tube. Tubes can be locked to a target or manually aimed.</p>`)}
            ${infoCard("Subsystem Targeting", `<p>Beam weapons target the hull by default. Weapons can instead select a specific subsystem when the objective is to disable rather than simply destroy a vessel.</p>`)}
          </div>
        `},
        { id: "ordnance", label: "Ordnance Reference", content: `
          <div class="ordnance-grid">
            ${infoCard("Homing", `<p>A simple, high-speed guided missile with a small warhead.</p>`)}
            ${infoCard("Nuke", `<p>A powerful homing missile that deals tremendous damage to all ships within 1U of detonation.</p>`, "danger")}
            ${infoCard("EMP", `<p>A homing missile that deals powerful shield damage to all ships within 1U of detonation, without damaging physical systems or hulls.</p>`)}
            ${infoCard("HVLI", `<p>Five simple lead slugs fired in a single burst at extremely high velocity. HVLI rounds do not home on a target.</p>`)}
            ${infoCard("Mine", `<p>A powerful stationary explosive that detonates when a ship comes within 0.6U. The explosion damages all objects within a 1U radius.</p>`, "danger")}
          </div>
          <div class="callout-strip warning"><strong>AMMUNITION:</strong><span>Missiles are limited. Use them wisely.</span></div>
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
        { id: "console", label: "Console Orientation", content: `${screenPlaceholder("Engineering")}<div class="orientation-notes"><h3>What will be labelled later</h3><p>System rows, power request, coolant allocation, temperature and temperature trend, damage state, energy balance and repair-crew controls.</p></div>`},
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
          <div class="hides-header"><span class="classification">AUTHORISED PACKAGE // TECHNICAL DATA PENDING</span><h2>H.I.D.E.S.</h2><p>Hacking Intrusion Detection and Elimination System</p></div>
          <p class="reference-note">This package is part of the UFN Engineering configuration used by this fleet. Its Level I-V effects are intentionally left blank until the implementation specification is supplied. No placeholder effect has been invented.</p>
          <div class="hides-levels">
            <article><span>LEVEL I</span><strong>SPECIFICATION PENDING</strong><p>Authorised technical description to be added.</p></article>
            <article><span>LEVEL II</span><strong>SPECIFICATION PENDING</strong><p>Authorised technical description to be added.</p></article>
            <article><span>LEVEL III</span><strong>SPECIFICATION PENDING</strong><p>Authorised technical description to be added.</p></article>
            <article><span>LEVEL IV</span><strong>SPECIFICATION PENDING</strong><p>Authorised technical description to be added.</p></article>
            <article><span>LEVEL V</span><strong>SPECIFICATION PENDING</strong><p>Authorised technical description to be added.</p></article>
          </div>
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
        { id: "console", label: "Console Orientation", content: `${screenPlaceholder("Science")}<div class="orientation-notes"><h3>What will be labelled later</h3><p>Long-range radar, target information, scan button, scan-data pages, systems data, frequency information where enabled, probe view, radar zoom and the Science database.</p></div>`},
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
            <div><span>01</span><strong>Unknown</strong><p>Unidentified contact.</p></div>
            <div><span>02</span><strong>Friend / Foe</strong><p>Initial identification can establish faction relationship and ship type.</p></div>
            <div><span>03</span><strong>Simple Scan</strong><p>Additional target information becomes available.</p></div>
            <div><span>04</span><strong>Full Scan</strong><p>Deep target data is available, including tactical information used by other bridge stations.</p></div>
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
        { id: "console", label: "Console Orientation", content: `${screenPlaceholder("Relay")}<div class="orientation-notes"><h3>What will be labelled later</h3><p>Sector map, friendly sensor coverage, probe controls, waypoints, communications, reputation information and hacking controls.</p></div>`},
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
