(() => {
  "use strict";

  const content = window.UFN_CONTENT;
  const basicTraining = content?.general;
  if (!basicTraining) return;

  const missions = [
  {
    "code": "OP01",
    "title": "Operation: Narrow Gate",
    "image": "assets/deployments/op01-narrow-gate.webp",
    "briefing": "Three high-value cargo vessels are en route to Tradepost 21 carrying supplies critical to outer-sector operations. Intelligence confirms the route is heavily infested with pirate forces, including coordinated splinter groups operating from fortified defence platforms. Your assignment is to escort the convoy through hostile space and ensure all three ships arrive intact. Expect ambushes, cloaked attackers, and attempts to isolate individual freighters before they reach the final approach. Pirate infrastructure along the route may be scanned and neutralised to weaken their control of the sector. TSN forces are also known to operate nearby, and limited support or repairs may be available if contact can be established. Maintain convoy integrity, respond quickly to emerging threats, and prioritise cargo survival above secondary targets. Loss of the convoy would severely affect Tradepost 21 and the wider UFN supply chain. Command is watching closely."
  },
  {
    "code": "OP02",
    "title": "Operation: Among Ghosts",
    "image": "assets/deployments/op02-among-ghosts.webp",
    "briefing": "UFN Intelligence has identified a rare opportunity to infiltrate Ghost-controlled space under a disguised vessel profile. Your ship has been refitted to mimic a Ghost-class signature and will operate under the false callsign Blindspot. Move through the sector without drawing suspicion, establish contact with Ghost assets, and gather intelligence on their current operations. Enemy forces rely on layered authentication, including numeric handshakes, response phrases, and behavioural checks. These exchanges must be handled carefully; failure will expose your identity and trigger immediate hostility. Later in the mission, you may be required to deploy a UFN intrusion package against a ship with access to Ghost command systems. That action cannot be completed while disguised and will reveal your true allegiance. Balance deception, timing, and tactical judgement. Once exposed, expect every nearby Ghost vessel to respond. Use patience, discipline, and believable hesitation throughout."
  },
  {
    "code": "OP03",
    "title": "Operation: Groundhog",
    "image": "assets/deployments/op03-groundhog.webp",
    "briefing": "UFN Command has received fragmented distress traffic from a contested sector under heavy Axis activity. Reports describe repeated engagements, incomplete transmissions, and sensor records that contradict one another. Analysis suggests an unstable anomaly may be affecting local time, disrupting navigation, tracking, and communication systems. Enter the sector, assess the situation, and stabilise the area by eliminating Axis threats and securing key locations. Allied ships and installations may come under attack with little warning, and previous logs indicate events may not unfold in a normal sequence. Axis forces appear unusually coordinated, responding with precision beyond standard tactical prediction. Their behaviour may be linked to the anomaly itself. Maintain detailed awareness of ship status, location, and mission timing. Report any irregularities immediately and treat repeated or impossible events as operationally significant, not sensor error. If time repeats, learn faster than the enemy."
  },
  {
    "code": "OP04",
    "title": "Operation: Bright Minds",
    "image": "assets/deployments/op04-bright-minds.webp",
    "briefing": "You have been assigned to support UFN Mentor, a learning vessel currently hosting pupils from the nearby UFN School Skylane. The mission is officially classified as educational outreach, but it remains an active fleet deployment and must be handled with full professionalism. Mentor has requested a combat demonstration followed by escort to a nearby nebula, where the pupils will observe natural space phenomena under supervised conditions. Make contact with Sub-Lieutenant Grant aboard Mentor to coordinate the programme and confirm safety requirements. The children aboard represent the future of the UFN, and command expects the crew to provide a calm, disciplined, and inspiring example of fleet service. Remain alert throughout the escort. Civilian passengers, limited combat expectations, and nearby unknown traffic mean even a routine demonstration can become complicated quickly. Their safety is the mission; their confidence is the legacy here."
  },
  {
    "code": "OP05",
    "title": "Operation: Thin Ice",
    "image": "assets/deployments/op05-thin-ice.webp",
    "briefing": "Fleet Command has issued urgent diplomatic-priority orders after TSN Outpost Harrow was attacked by a vessel broadcasting UFN identification. TSN leadership is treating the incident as hostile action, and cooperative channels are deteriorating rapidly. Deploy to Harrow, secure the area, support survivors where possible, and establish a reliable timeline of events. UFN Intelligence has ordered a focused inquiry into command integrity, including the possibility of a rogue UFN captain or other unauthorised operation. Every conclusion must be supported by recoverable proof: station logs, witness statements, targeting records, and transponder data. The Diplomatic Corps will use your findings to demonstrate that the UFN remains accountable and trustworthy. Exercise restraint, preserve evidence, avoid unnecessary escalation, and report verified information without delay. The wrong action could turn suspicion into open conflict. Keep the peace by proving the facts before anyone starts shooting again."
  },
  {
    "code": "OP06",
    "title": "Operation: Common Ground",
    "image": "assets/deployments/op06-common-ground.webp",
    "briefing": "Umbra Regional Command has requested UFN assistance following escalating instability along local trade corridors. After review, Fleet Command has approved limited operational cooperation, and your vessel is assigned as the primary response unit. Enter the area, establish contact with Umbra authorities, assess the tactical situation, and provide support where required to stabilise civilian shipping. Expect mixed traffic, uncertain faction signatures, competing priorities, and possible hostile interference. Rules of engagement remain in force: identify contacts before firing, protect non-combatant vessels, and prioritise mission-critical assets. This deployment carries political weight. You are operating alongside a power that is not always aligned with UFN interests, and every transmission may affect future cooperation. Maintain disciplined communication, visible professionalism, and clear records of all decisions. The objective is not friendship; it is order, protection, and controlled response. Controlled cooperation today may prevent open conflict tomorrow."
  },
  {
    "code": "OP07",
    "title": "Operation: Counterfeit",
    "image": "assets/deployments/op07-counterfeit.webp",
    "briefing": "Two identical distress signals have been detected inside the E16 Nebula. Both carry valid UFN authentication credentials, both were received at exactly the same time, and both appear to originate from vessels claiming the same operational identity. Command cannot explain the duplication. Records confirm only one UFN ship should be present in the sector, which means at least one signal may be false, compromised, displaced, or part of a deliberate trap. Enter the nebula, locate both sources, and determine which contact represents the genuine UFN asset. Visibility, communications, and sensor reliability are expected to be poor. Do not assume friendly identification is proof of safety. Gather evidence before committing to action, protect surviving personnel where possible, and prevent hostile forces from exploiting UFN authentication systems. The truth may not announce itself cleanly. Trust evidence, not transponders, and verify every voice."
  },
  {
    "code": "OP08",
    "title": "Operation: Evaluation",
    "image": "assets/deployments/op08-evaluation.webp",
    "briefing": "Following a validated threat alert, Fleet Command has ordered an immediate emergency response in Sector 232. UFN Stalwart has begun evacuation traffic under unclear circumstances, but command has not yet confirmed the nature, origin, or scale of the danger. Your vessel is to proceed to the area, monitor all communications, assist evacuating ships where possible, and await further instruction from Fleet Command. Intelligence currently reports no active enemy presence, which makes the situation more concerning rather than less. The threat may involve environmental hazards, system failure, hidden attackers, or information not yet available to command. All departments should remain alert and avoid assumptions. Prioritise civilian survival, maintain clear traffic control, and preserve operational flexibility. Sector 232 may appear quiet on arrival, but something has forced Stalwart to run. Find the cause, hold the line, and bring every civilian home alive."
  },
  {
    "code": "OP09",
    "title": "Operation: Sentience",
    "image": "assets/deployments/op09-sentience.webp",
    "briefing": "AI-led attacks are increasing across the sector, and Colony 2784 has already suffered severe damage. Supply routes from the colony are disrupted, placing several outer-sector facilities under growing strain. Command believes AXIS is the most likely source of the activity, but Umbra involvement has not been ruled out. Crews should watch for evidence of either faction, including unusual command traffic, falsified transponders, or interference with automated systems. Your first priority is to investigate Colony 2784 and determine where the attacking force went next. CUF and TSN assets are operating nearby and may require assistance. The reclaimed UFN AI research station Gigantus is also in the region and should be treated as strategically sensitive. Identify the source of the attacks, defend allied assets where necessary, and report confirmed AXIS or Umbra involvement to Command. Sentience changes the battlefield; assumptions may fail."
  },
  {
    "code": "OP10",
    "title": "Operation: Patchwork",
    "image": "assets/deployments/op10-patchwork.webp",
    "briefing": "The UFN experimental cruiser assigned to this operation has been crippled by a violent attack in a remote sector. With fleet resources committed elsewhere, Command must recover the vessel before it falls into Ghost hands, using the nearest available crew: yours. The ship is confirmed clear of lifesigns; its crew escaped by emergency transport and is safe aboard UFN Stallion. Board the damaged cruiser, assess its condition, restore essential systems, and return it to a UFN drydock for permanent repair. Automated diagnostics indicate severe structural damage, and further repair guidance is available in the database under Emergency Repairs. Expect limited resources, difficult negotiations, and hostile forces moving through the sector. Time is critical. Every minute the ship remains adrift increases the chance that an enemy force claims it first. Bring her home before the enemy turns salvage into strategy tomorrow."
  },
  {
    "code": "OP11",
    "title": "Operation: Resonance",
    "image": "assets/deployments/op11-resonance.webp",
    "briefing": "Umbra Corporation has begun testing a new vessel with capabilities UFN Intelligence cannot explain. UMB Meridian has been observed crossing enormous distances in impossibly short periods, with no conventional warp activity detected. Command considers this technology a serious strategic threat, especially if Umbra can deploy it at scale. Meridian has now been located near UFN Omega, creating both a danger and an opportunity. Your crew will conduct the first operational trial of the new Enhanced EMP system. Engage Meridian and use the EMP to disable the vessel without destroying it. The ship, its systems, and any recoverable data must remain intact for analysis. Once Meridian is disabled, hold position and contact Fleet Command for further orders. Precision matters more than firepower. We need answers, not wreckage. Treat every shot as a decision about what survives for UFN Science to study."
  },
  {
    "code": "OP12",
    "title": "Operation: Continuum",
    "image": "assets/deployments/op12-continuum.webp",
    "added": "2026-08-29",
    "briefing": "UFN Science Corps has detected a temporal distortion wave moving toward Twin Pines, with estimated arrival in approximately thirty minutes. Analysis suggests the wave may represent a change to history propagating forward through spacetime. If it reaches the region, the present may be rewritten. Current databases cannot be trusted after impact, so UFN Science maintains a protected historical archive outside normal chronology: UFN History. Intelligence has authorised emergency use of temporal drive technology to retrieve that record and compare it against the present. ALF will assist with temporal navigation and anomaly analysis. Leave the area before the wave arrives, or you may lose all memory of the original timeline. Interfere with past events only where necessary to repair history. This operation is classified at the highest level. History is the objective, and restraint may be the only way home intact."
  }
];

  const campaign = {
    code: "CAMPAIGN",
    title: "Campaign Deployment: Light and Dark",
    image: "assets/deployments/campaign-light-dark.webp",
    briefing: "",
    campaign: true,
    campaignCount: 6
  };

  const records = [...missions, campaign];

  const NEW_DEPLOYMENT_DAYS = 28;
  const parseDeploymentDate = value => {
    if (!value) return null;
    const parts = String(value).split("-").map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
    return new Date(parts[0], parts[1] - 1, parts[2]);
  };
  const isNewDeployment = record => {
    const added = parseDeploymentDate(record.added);
    if (!added) return false;
    const expiry = new Date(added);
    expiry.setDate(expiry.getDate() + NEW_DEPLOYMENT_DAYS);
    const now = new Date();
    return now >= added && now < expiry;
  };
  const newExpiryLabel = record => {
    const added = parseDeploymentDate(record.added);
    if (!added) return "";
    const expiry = new Date(added);
    expiry.setDate(expiry.getDate() + NEW_DEPLOYMENT_DAYS);
    return expiry.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const tileMarkup = missions.map((mission, index) => {
    const isNew = isNewDeployment(mission);
    return `
    <button class="deployment-tile${isNew ? " deployment-tile-new" : ""}" type="button" data-deployment-index="${index}" aria-label="Open ${mission.title} mission record${isNew ? ", new deployment" : ""}">
      <span class="deployment-tile-art">
        <img src="${mission.image}" alt="" loading="eager" decoding="async" />
        <span class="deployment-tile-shade" aria-hidden="true"></span>
        ${isNew ? `<span class="deployment-new-badge" title="New deployment until ${newExpiryLabel(mission)}">NEW</span>` : ""}
        <span class="deployment-tile-copy">
          <span class="deployment-tile-code">${mission.code}</span>
          <strong>${mission.title}</strong>
          <span class="deployment-tile-type">Standalone Deployment</span>
        </span>
      </span>
    </button>
  `;
  }).join("");

  const campaignTileMarkup = `
    <button class="deployment-tile deployment-campaign-tile" type="button" data-deployment-index="${missions.length}" aria-label="Open Campaign Deployment: Light and Dark restricted record">
      <span class="deployment-tile-art">
        <img src="${campaign.image}" alt="" loading="eager" decoding="async" />
        <span class="deployment-tile-shade" aria-hidden="true"></span>
        <span class="deployment-campaign-grid" aria-hidden="true"></span>
        <span class="deployment-tile-copy">
          <span class="deployment-tile-code">CAMPAIGN // 06 MISSIONS</span>
          <strong>Campaign Deployment: Light and Dark</strong>
          <span class="deployment-tile-type deployment-restricted-label">Details Redacted</span>
        </span>
        <span class="deployment-redacted-stamp" aria-hidden="true">RESTRICTED</span>
      </span>
    </button>
  `;

  const deploymentPage = {
    id: "deployments",
    label: "Available Deployments",
    content: `
      <section class="deployment-register-head">
        <div>
          <span class="classification">UFN FLEET COMMAND // DEPLOYMENT REGISTER</span>
          <span class="micro-label">AUTHORISED CREW ACCESS</span>
          <h2>Available Deployments</h2>
          <p>Select an operation to open its Fleet Command mission record and authorised briefing.</p>
        </div>
        <div class="deployment-register-counts" aria-label="12 standalone missions and 6 campaign missions">
          <div><strong>12</strong><span>STANDALONE<br />MISSIONS</span></div>
          <div><strong>06</strong><span>CAMPAIGN<br />MISSIONS</span></div>
        </div>
      </section>

      <section class="deployment-register-section">
        <div class="deployment-section-heading">
          <span class="micro-label">DEPLOYMENT CLASS // STANDALONE</span>
          <h3>Standalone Missions <span>12</span></h3>
        </div>
        <div class="deployment-tile-grid" aria-label="Standalone mission deployments">
          ${tileMarkup}
        </div>
      </section>

      <section class="deployment-register-section deployment-campaign-section">
        <div class="deployment-section-heading">
          <span class="micro-label">DEPLOYMENT CLASS // CAMPAIGN</span>
          <h3>Campaign Missions <span>6</span></h3>
        </div>
        <div class="deployment-tile-grid">
          ${campaignTileMarkup}
        </div>
      </section>

      <dialog class="deployment-record-dialog" id="deployment-record-dialog" aria-labelledby="deployment-record-title">
        <div class="deployment-record-shell">
          <header class="deployment-record-toolbar">
            <button class="deployment-record-nav" type="button" data-record-action="previous" aria-label="Previous mission record">← PREVIOUS</button>
            <span class="deployment-record-position" id="deployment-record-position"></span>
            <button class="deployment-record-nav" type="button" data-record-action="next" aria-label="Next mission record">NEXT →</button>
            <button class="deployment-record-close" type="button" data-record-action="close" aria-label="Close mission record">×</button>
          </header>
          <div id="deployment-record-content"></div>
        </div>
      </dialog>
    `
  };

  const existingIndex = basicTraining.tabs?.findIndex(tab => tab.id === "deployments") ?? -1;
  if (existingIndex >= 0) {
    basicTraining.tabs.splice(existingIndex, 1, deploymentPage);
  } else {
    const briefingTabIndex = basicTraining.tabs.findIndex(tab => tab.id === "briefing");
    basicTraining.tabs.splice(Math.max(0, briefingTabIndex + 1), 0, deploymentPage);
  }

  const briefingGroup = basicTraining.tabGroups?.find(group => group.id === "briefing");
  if (briefingGroup && !briefingGroup.tabs.includes("deployments")) {
    const briefingIndex = briefingGroup.tabs.indexOf("briefing");
    briefingGroup.tabs.splice(Math.max(0, briefingIndex + 1), 0, "deployments");
  }

  let activeRecordIndex = 0;

  function recordMeta(record) {
    if (record.campaign) {
      return [
        ["RECORD", "CAMPAIGN-LD"],
        ["DEPLOYMENT", "CAMPAIGN"],
        ["SERIES", "6 MISSIONS"],
        ["ACCESS", "RESTRICTED"]
      ];
    }
    return [
      ["RECORD", record.code],
      ["DEPLOYMENT", "STANDALONE"],
      ["STATUS", "AVAILABLE"],
      ["ACCESS", "CREW AUTHORISED"]
    ];
  }

  function renderRecord(index) {
    const dialog = document.getElementById("deployment-record-dialog");
    const target = document.getElementById("deployment-record-content");
    const position = document.getElementById("deployment-record-position");
    if (!dialog || !target || !position) return;

    activeRecordIndex = (index + records.length) % records.length;
    const record = records[activeRecordIndex];
    const isCampaign = Boolean(record.campaign);
    const isNew = !isCampaign && isNewDeployment(record);

    position.textContent = isCampaign
      ? "CAMPAIGN RECORD // 6 MISSIONS"
      : `${String(activeRecordIndex + 1).padStart(2, "0")} / ${String(missions.length).padStart(2, "0")}`;

    const meta = recordMeta(record).map(([label, value]) => `
      <div class="deployment-record-meta-cell">
        <span>${label}</span>
        <strong>${value}</strong>
      </div>
    `).join("");

    const briefing = isCampaign ? `
      <section class="deployment-record-briefing deployment-record-redacted">
        <div class="deployment-record-section-title">
          <span class="micro-label">AUTHORISED BRIEFING</span>
          <h4>Campaign intelligence withheld</h4>
        </div>
        <div class="deployment-redaction-block">
          <span></span><span></span><span class="short"></span><span></span><span class="medium"></span>
        </div>
        <div class="deployment-classified-notice">
          <strong>DETAILS REDACTED</strong>
          <p>Six linked campaign deployments are recorded under the Light and Dark campaign file. Mission-specific briefings are unavailable at this clearance level.</p>
        </div>
      </section>
    ` : `
      <section class="deployment-record-briefing">
        <div class="deployment-record-section-title">
          <span class="micro-label">AUTHORISED CREW BRIEFING</span>
          <h4>Mission Briefing</h4>
        </div>
        <p>${record.briefing}</p>
      </section>
    `;

    target.innerHTML = `
      <article class="deployment-record ${isCampaign ? "deployment-record-campaign" : ""}">
        <div class="deployment-record-art">
          <img src="${record.image}" alt="Mission artwork for ${record.title}" />
          <div class="deployment-record-art-grid" aria-hidden="true"></div>
          <div class="deployment-record-art-copy">
            <span>${isCampaign ? "ADMIRALTY CAMPAIGN FILE" : "UFN FLEET COMMAND // MISSION RECORD"}</span>
            <strong>${record.code}</strong>
          </div>
          ${isCampaign ? '<span class="deployment-record-art-stamp">RESTRICTED</span>' : ''}
        </div>

        <div class="deployment-record-document">
          <div class="deployment-record-heading">
            <div>
              <span class="classification">${isCampaign ? "ADMIRALTY // RESTRICTED" : "UFN FLEET COMMAND // ACTIVE BRIEFING"}</span>
              <span class="micro-label">${isCampaign ? "CAMPAIGN DEPLOYMENT" : "AVAILABLE DEPLOYMENT"}</span>
              <div class="deployment-record-title-line">
                <h3 id="deployment-record-title">${record.title}</h3>
                ${isNew ? `<span class="deployment-record-new-badge" title="New deployment until ${newExpiryLabel(record)}">NEW DEPLOYMENT</span>` : ""}
              </div>
            </div>
            <div class="deployment-record-stamp ${isCampaign ? "restricted" : ""}" aria-hidden="true">
              ${isCampaign ? "REDACTED" : "AUTHORISED"}
            </div>
          </div>

          <div class="deployment-record-meta">${meta}</div>

          ${briefing}

          <footer class="deployment-record-footer">
            <div>
              <span class="micro-label">ISSUING AUTHORITY</span>
              <strong>UNITED FEDERATED NAVY // FLEET COMMAND</strong>
            </div>
            <div>
              <span class="micro-label">DOCUMENT CONTROL</span>
              <strong>${isCampaign ? "RESTRICTED CAMPAIGN RECORD" : `${record.code} // REVIEW BEFORE DEPLOYMENT`}</strong>
            </div>
          </footer>
        </div>
      </article>
    `;

    if (typeof dialog.showModal === "function" && !dialog.open) dialog.showModal();
    else if (!dialog.open) dialog.setAttribute("open", "");
  }

  function closeRecord() {
    const dialog = document.getElementById("deployment-record-dialog");
    if (!dialog) return;
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  document.addEventListener("click", event => {
    const tile = event.target.closest("[data-deployment-index]");
    if (tile) {
      renderRecord(Number(tile.dataset.deploymentIndex));
      return;
    }

    const action = event.target.closest("[data-record-action]")?.dataset.recordAction;
    if (!action) return;
    if (action === "close") closeRecord();
    if (action === "previous") renderRecord(activeRecordIndex - 1);
    if (action === "next") renderRecord(activeRecordIndex + 1);
  });

  document.addEventListener("keydown", event => {
    const dialog = document.getElementById("deployment-record-dialog");
    if (!dialog?.open) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      renderRecord(activeRecordIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      renderRecord(activeRecordIndex + 1);
    }
  });

  document.addEventListener("click", event => {
    const dialog = event.target.closest("#deployment-record-dialog");
    if (!dialog || event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!inside) closeRecord();
  });
})();
