(() => {
  "use strict";

  const CONTENT = window.UFN_CONTENT || {};
  const els = {
    content: document.getElementById("content"),
    sidebar: document.getElementById("sidebar"),
    menu: document.getElementById("menu-button"),
    scrim: document.getElementById("nav-scrim")
  };

  const routeCodes = { home: "00", general: "GEN", captain: "CAP", helms: "HLM", weapons: "WPN", engineering: "ENG", science: "SCI", relay: "RLY" };
  const iconRoutes = new Set(["home", "general", "captain", "helms", "weapons", "engineering", "science", "relay"]);
  let activeRoute = "home";
  let activeTab = "";
  let hackingController = null;
  let scanController = null;

  function parseHash() {
    const raw = location.hash.replace(/^#\/?/, "");
    if (!raw) return { route: "home", tab: null };
    const [route, tab] = raw.split("/");
    return { route: CONTENT[route] ? route : "home", tab: tab || null };
  }

  function setHash(route, tab) {
    const next = `#/${route}${tab ? `/${tab}` : ""}`;
    if (location.hash === next) renderFromHash();
    else location.hash = next;
  }

  function closeNav() {
    els.sidebar.classList.remove("open");
    els.menu.setAttribute("aria-expanded", "false");
    els.scrim.hidden = true;
  }

  function openNav() {
    els.sidebar.classList.add("open");
    els.menu.setAttribute("aria-expanded", "true");
    els.scrim.hidden = false;
  }

  function navHandler(event) {
    const target = event.target.closest("[data-nav]");
    if (!target) return;
    if (target.tagName === "A") return;
    event.preventDefault();
    closeNav();
    setHash(target.dataset.nav, null);
  }

  function renderFromHash() {
    const { route, tab } = parseHash();
    renderRoute(route, tab);
  }

  function renderRoute(route, requestedTab) {
    if (hackingController?.destroy) hackingController.destroy();
    if (scanController?.destroy) scanController.destroy();
    hackingController = null;
    scanController = null;

    const page = CONTENT[route] || CONTENT.home;
    const validTab = page.tabs.find(item => item.id === requestedTab)?.id || page.tabs[0].id;
    activeRoute = route;
    activeTab = validTab;
    document.body.dataset.route = route;

    document.querySelectorAll(".nav-item").forEach(btn => btn.classList.toggle("active", btn.dataset.nav === route));

    let tabs = "";
    if (page.tabs.length > 1) {
      if (Array.isArray(page.tabGroups) && page.tabGroups.length) {
        const activeGroup = page.tabGroups.find(group => group.tabs.includes(validTab)) || page.tabGroups[0];
        const secondaryTabs = page.tabs.filter(item => activeGroup.tabs.includes(item.id));
        tabs = `
          <div class="briefing-tab-system">
            <nav class="briefing-nav-primary" aria-label="${page.title} categories">
              ${page.tabGroups.map(group => {
                const targetTab = group.tabs.find(id => page.tabs.some(item => item.id === id)) || page.tabs[0].id;
                return `<button class="briefing-primary-tab ${group.id === activeGroup.id ? "active" : ""}" type="button" data-tab="${targetTab}">${group.label}</button>`;
              }).join("")}
            </nav>
            <nav class="briefing-nav-secondary" aria-label="${activeGroup.label} sections">
              ${secondaryTabs.map(item => `<button class="section-tab ${item.id === validTab ? "active" : ""}" type="button" data-tab="${item.id}">${item.label}</button>`).join("")}
            </nav>
          </div>`;
      } else {
        tabs = `
          <nav class="section-tabs" aria-label="${page.title} sections">
            ${page.tabs.map(item => `<button class="section-tab ${item.id === validTab ? "active" : ""}" type="button" data-tab="${item.id}">${item.label}</button>`).join("")}
          </nav>`;
      }
    }

    const panel = page.tabs.find(item => item.id === validTab) || page.tabs[0];
    els.content.innerHTML = `
      <header class="page-head">
        <div><span class="eyebrow">${page.eyebrow}</span><h1>${page.title}</h1><p>${page.subtitle}</p></div>
        <div class="page-id ${iconRoutes.has(route) ? "station-icon-host" : ""}" aria-hidden="true">${iconRoutes.has(route) && window.UFN_STATION_ICON ? window.UFN_STATION_ICON(route) : (routeCodes[route] || "UFN")}</div>
      </header>
      ${tabs}
      <section class="tab-panel" data-panel="${panel.id}">${panel.content}</section>
    `;

    bindTabs(page);
    initialisePanel(route, validTab);
    els.content.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function bindTabs(page) {
    els.content.querySelectorAll("[data-tab]").forEach(btn => {
      btn.addEventListener("click", () => setHash(activeRoute, btn.dataset.tab));
    });
  }

  function initialisePanel(route, tab) {
    if (route === "relay" && tab === "hacking-lab") {
      hackingController = createHackingSimulator(document.getElementById("hacking-simulator-root"));
    }
    if (route === "science" && tab === "scan-practice") {
      scanController = createScanSimulator(document.getElementById("scan-simulator-root"));
    }
    if (route === "general" && tab === "medals") {
      initialiseMedalGallery(document.querySelector('[data-panel="medals"]'));
    }
    if (route === "general" && ["allies", "threats", "phenomena"].includes(tab)) {
      initialiseIntelTiles(document.querySelector(`[data-panel="${tab}"]`));
    }
  }


  function initialiseIntelTiles(root) {
    if (!root) return;
    const dialog = root.querySelector(".intel-dialog");
    const content = dialog?.querySelector(".intel-dialog-content");
    const close = dialog?.querySelector(".intel-dialog-close");
    if (!dialog || !content) return;

    const openRecord = tile => {
      const targetId = tile.dataset.intelTarget;
      const record = targetId ? root.querySelector(`#${CSS.escape(targetId)}`) : null;
      if (!record) return;
      content.innerHTML = record.innerHTML;
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    };

    root.querySelectorAll(".intel-tile").forEach(tile => {
      tile.addEventListener("click", () => openRecord(tile));
    });
    close?.addEventListener("click", () => {
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
    });
    dialog.addEventListener("click", event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (!inside) {
        if (typeof dialog.close === "function") dialog.close();
        else dialog.removeAttribute("open");
      }
    });
  }

  function initialiseMedalGallery(root) {
    if (!root) return;
    const dialog = root.querySelector("#medal-dossier");
    if (!dialog) return;
    const image = dialog.querySelector("#medal-dialog-image");
    const title = dialog.querySelector("#medal-dialog-title");
    const description = dialog.querySelector("#medal-dialog-description");
    const classification = dialog.querySelector("#medal-dialog-classification");
    const close = dialog.querySelector(".medal-dialog-close");

    const openRecord = card => {
      const art = card.querySelector(".medal-art-frame img");
      const name = card.querySelector(".medal-card-copy > strong")?.textContent?.trim() || "UFN Decoration";
      const detail = card.querySelector(".medal-detail-copy")?.textContent?.trim() || "";
      const restricted = card.dataset.medalRestricted === "true";

      image.src = art?.getAttribute("src") || "";
      image.alt = art?.getAttribute("alt") || name;
      title.textContent = name;
      dialog.classList.toggle("restricted-record", restricted);
      classification.textContent = restricted ? "UFN INTELLIGENCE // RESTRICTED RECORD" : "FLEET PERSONNEL // DECORATION RECORD";
      description.replaceChildren();

      if (restricted) {
        const stamp = document.createElement("div");
        stamp.className = "redacted-stamp";
        stamp.textContent = "REDACTED";
        const notice = document.createElement("p");
        notice.className = "redacted-notice";
        notice.textContent = detail;
        description.append(stamp, notice);
      } else {
        const copy = document.createElement("p");
        copy.textContent = detail;
        description.append(copy);
      }

      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    };

    root.querySelectorAll(".medal-card").forEach(card => card.addEventListener("click", () => openRecord(card)));
    close?.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (!inside) dialog.close();
    });
  }

  /* ------------------------- Relay hacking practice ------------------------- */
  function createHackingSimulator(root) {
    if (!root) return null;

    root.innerHTML = `
      <div class="hacking-console">
        <div class="section-heading"><span class="micro-label">RELAY CYBER OPERATIONS</span><h2>Hacking Practice Lab</h2><p>Practice the two authorised intrusion patterns used by the Relay console.</p></div>
        <section class="practice-switcher" aria-label="Choose intrusion pattern">
          <button class="practice-tab active" type="button" data-game="lights" aria-pressed="true"><span class="practice-code">01</span><span><strong>Binary Countermeasure Matrix</strong><small>Illuminate the complete matrix</small></span></button>
          <button class="practice-tab" type="button" data-game="mines" aria-pressed="false"><span class="practice-code">02</span><span><strong>Sensitive Node Mapping</strong><small>Map safe nodes without exhausting tolerance</small></span></button>
        </section>
        <section class="training-console">
          <aside class="control-panel">
            <div><p class="micro-label">SIMULATION PARAMETERS</p><h2 id="hack-game-title">Binary Countermeasure Matrix</h2><p id="hack-game-description" class="panel-copy">Fully illuminate the matrix. Activating a node also toggles its orthogonal neighbours.</p></div>
            <fieldset class="difficulty-fieldset"><legend>SECURITY GRADE</legend><div id="hack-difficulty-options" class="difficulty-options"></div></fieldset>
            <div class="controls"><button id="hack-retry" class="button secondary" type="button">Retry Grid</button><button id="hack-new" class="button primary" type="button">New Grid</button><button id="hack-auto" class="button secondary auto-solve" type="button">Auto Solve</button></div>
            <p class="control-note"><strong>Retry</strong> restores this exact training puzzle. <strong>New Grid</strong> generates a fresh puzzle.<span id="hack-auto-note"> <strong>Auto Solve</strong> demonstrates the required matrix inputs one move every 0.75 seconds.</span></p>
          </aside>
          <section class="simulator-panel" aria-live="polite">
            <div class="simulator-topline"><div><span class="micro-label">TRAINING ARRAY</span><strong id="hack-target-label">COUNTERMEASURE MATRIX</strong></div><div class="readout-group"><div><span class="micro-label">GRID</span><strong id="hack-grid">7 × 7</strong></div><div id="hack-attempts-wrap" hidden><span class="micro-label">TOLERANCE</span><strong id="hack-attempts">2 / 2</strong></div><div><span class="micro-label">INPUTS</span><strong id="hack-moves">0</strong></div></div></div>
            <div class="progress-shell"><div id="hack-progress" class="progress-bar"></div></div>
            <div class="status-line"><span id="hack-status">INTRUSION IN PROGRESS: 0%</span><span id="hack-timer">00:00.0</span></div>
            <div class="board-frame"><div id="hack-board" class="board lights-board" role="grid" aria-label="Intrusion puzzle grid"></div></div>
            <div id="hack-result" class="result-banner" hidden></div>
          </section>
        </section>
      </div>`;

    const GAMES = {
      lights: {
        title: "Binary Countermeasure Matrix",
        desc: "Fully illuminate the matrix. Activating a node also toggles its orthogonal neighbours.",
        target: "COUNTERMEASURE MATRIX",
        levels: [3,5,7,9].map((size, i) => ({ grade: i + 1, size }))
      },
      mines: {
        title: "Sensitive Node Mapping",
        desc: "Reveal every safe node. Numerical returns show the number of sensitive nodes in adjacent sectors. Two sensitive-node contacts exhaust intrusion tolerance.",
        target: "SENSITIVE NODE NETWORK",
        levels: [6,8,10,12].map((size, i) => ({ grade: i + 1, size, mines: size }))
      }
    };

    const q = id => root.querySelector(id);
    const e = {
      tabs: [...root.querySelectorAll(".practice-tab")], title: q("#hack-game-title"), desc: q("#hack-game-description"), target: q("#hack-target-label"), diff: q("#hack-difficulty-options"), retry: q("#hack-retry"), fresh: q("#hack-new"), auto: q("#hack-auto"), autoNote: q("#hack-auto-note"), attemptsWrap: q("#hack-attempts-wrap"), attempts: q("#hack-attempts"), grid: q("#hack-grid"), moves: q("#hack-moves"), progress: q("#hack-progress"), status: q("#hack-status"), timer: q("#hack-timer"), board: q("#hack-board"), result: q("#hack-result")
    };

    const state = { game: "lights", grades: { lights: 3, mines: 3 }, size: 7, mines: 0, initial: null, current: [], bombs: new Set(), revealed: new Set(), errors: 0, moves: 0, complete: false, start: null, elapsed: 0, timerHandle: null, autoHandle: null, autoSolving: false };
    const randomInt = (min,max) => Math.floor(Math.random() * (max-min+1)) + min;
    const indexOf = (x,y,size=state.size) => y * size + x;
    const coords = index => ({ x: index % state.size, y: Math.floor(index / state.size) });
    const selected = () => GAMES[state.game].levels[state.grades[state.game] - 1];

    function toggleCross(board,x,y,size) { [[x,y],[x-1,y],[x+1,y],[x,y-1],[x,y+1]].forEach(([px,py]) => { if (px>=0 && py>=0 && px<size && py<size) { const i=indexOf(px,py,size); board[i]=!board[i]; }}); }

    function solveLights(board, size) {
      const count = size * size;
      const rows = Array.from({ length: count }, (_, cell) => {
        const row = new Uint8Array(count + 1);
        const x = cell % size, y = Math.floor(cell / size);
        [[x,y],[x-1,y],[x+1,y],[x,y-1],[x,y+1]].forEach(([px,py]) => {
          if (px >= 0 && py >= 0 && px < size && py < size) row[py * size + px] = 1;
        });
        row[count] = board[cell] ? 0 : 1;
        return row;
      });
      const pivots = [];
      let pivotRow = 0;
      for (let col = 0; col < count && pivotRow < count; col++) {
        let found = pivotRow;
        while (found < count && rows[found][col] === 0) found++;
        if (found === count) continue;
        [rows[pivotRow], rows[found]] = [rows[found], rows[pivotRow]];
        for (let r = 0; r < count; r++) {
          if (r !== pivotRow && rows[r][col]) {
            for (let c = col; c <= count; c++) rows[r][c] ^= rows[pivotRow][c];
          }
        }
        pivots.push([pivotRow, col]);
        pivotRow++;
      }
      for (let r = pivotRow; r < count; r++) {
        let any = false;
        for (let c = 0; c < count; c++) if (rows[r][c]) { any = true; break; }
        if (!any && rows[r][count]) return null;
      }
      const solution = new Uint8Array(count);
      for (const [r, col] of pivots) solution[col] = rows[r][count];
      return [...solution].map((value, index) => value ? index : -1).filter(index => index >= 0);
    }

    function generateLights(size) { let board; do { board = Array(size*size).fill(true); const moves = randomInt(3,3*size); for(let i=0;i<moves;i++) toggleCross(board,randomInt(0,size-1),randomInt(0,size-1),size); } while(board.every(Boolean)); return board; }
    function generateBombs(size,count) { const bombs=new Set(); while(bombs.size<count) bombs.add(randomInt(0,size*size-1)); return bombs; }
    function adjacent(index) { const {x,y}=coords(index); const out=[]; for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){ if(!dx&&!dy)continue; const nx=x+dx,ny=y+dy; if(nx>=0&&ny>=0&&nx<state.size&&ny<state.size) out.push(indexOf(nx,ny)); } return out; }
    function bombCount(index) { return adjacent(index).filter(i=>state.bombs.has(i)).length; }

    function clearTimer(){ if(state.timerHandle) clearInterval(state.timerHandle); state.timerHandle=null; state.start=null; state.elapsed=0; e.timer.textContent="00:00.0"; }
    function elapsedMs(){ return state.elapsed + (state.start===null?0:performance.now()-state.start); }
    function updateTimer(){ const ms=elapsedMs(); const mins=Math.floor(ms/60000); const secs=(ms%60000)/1000; e.timer.textContent=`${String(mins).padStart(2,"0")}:${secs.toFixed(1).padStart(4,"0")}`; }
    function startTimer(){ if(state.start!==null||state.complete)return; state.start=performance.now(); state.timerHandle=setInterval(updateTimer,100); }
    function stopTimer(){ if(state.start!==null){state.elapsed+=performance.now()-state.start;state.start=null;} if(state.timerHandle)clearInterval(state.timerHandle);state.timerHandle=null;updateTimer(); }

    function cancelAutoSolve(){
      if(state.autoHandle) clearTimeout(state.autoHandle);
      state.autoHandle=null;state.autoSolving=false;
      if(e.auto) e.auto.disabled=state.game!=="lights";
    }
    function resetCommon(){ cancelAutoSolve();state.moves=0;state.complete=false;state.errors=0;state.revealed=new Set();e.moves.textContent="0";e.result.hidden=true;e.result.className="result-banner";clearTimer(); }
    function newPuzzle(){ const cfg=selected(); state.size=cfg.size;state.mines=cfg.mines||0;resetCommon(); if(state.game==="lights"){state.initial=generateLights(state.size);state.current=[...state.initial];state.bombs=new Set();}else{state.bombs=generateBombs(state.size,state.mines);state.initial=[...state.bombs];state.current=[];} render(); update(); }
    function retry(){ resetCommon(); if(state.game==="lights")state.current=[...state.initial]; else state.bombs=new Set(state.initial); render();update(); }

    function renderDiff(){ e.diff.innerHTML=""; GAMES[state.game].levels.forEach(item=>{ const b=document.createElement("button"); b.type="button"; b.className=`difficulty-option ${item.grade===state.grades[state.game]?"active":""}`; const params=state.game==="lights"?`${item.size} × ${item.size}`:`${item.size} × ${item.size} • ${item.mines} sensitive`; b.innerHTML=`<span class="diff">G${item.grade}</span><span>Security Grade ${["I","II","III","IV"][item.grade-1]}</span><span class="params">${params}</span>`; b.onclick=()=>{state.grades[state.game]=item.grade;renderDiff();newPuzzle();}; e.diff.appendChild(b); }); }
    function setGame(game){ cancelAutoSolve();state.game=game; e.tabs.forEach(t=>{const a=t.dataset.game===game;t.classList.toggle("active",a);t.setAttribute("aria-pressed",String(a));}); e.title.textContent=GAMES[game].title;e.desc.textContent=GAMES[game].desc;e.target.textContent=GAMES[game].target;e.attemptsWrap.hidden=game!=="mines";e.auto.hidden=game!=="lights";e.auto.disabled=game!=="lights";e.autoNote.hidden=game!=="lights";e.board.className=`board ${game==="lights"?"lights-board":"mines-board"}`;renderDiff();newPuzzle(); }

    function update(){ const total=state.size*state.size; let progress=0; if(state.game==="lights") progress=state.current.filter(Boolean).length/total; else {const safe=total-state.mines;const seen=[...state.revealed].filter(i=>!state.bombs.has(i)).length;progress=seen/safe;e.attempts.textContent=`${Math.max(0,2-state.errors)} / 2`;} const pct=Math.floor(progress*100);e.grid.textContent=`${state.size} × ${state.size}`;e.moves.textContent=String(state.moves);e.progress.style.width=`${pct}%`;if(!state.complete)e.status.textContent=`INTRUSION IN PROGRESS: ${pct}%`; }
    function finish(success){ if(state.autoHandle)clearTimeout(state.autoHandle);state.autoHandle=null;state.autoSolving=false;state.complete=true;stopTimer();e.status.textContent=success?"INTRUSION SUCCESS":"INTRUSION FAILURE";e.result.hidden=false;e.result.textContent=success?"ACCESS ESTABLISHED":"CONNECTION TERMINATED";e.result.classList.add(success?"success":"failure");if(success)e.progress.style.width="100%";e.auto.disabled=true;[...e.board.children].forEach(c=>c.disabled=true); }

    function render(){ e.board.innerHTML="";e.board.style.setProperty("--cols",String(state.size)); if(state.game==="lights")renderLights();else renderMines(); }
    function renderLights(){ state.current.forEach((on,index)=>{const {x,y}=coords(index);const c=document.createElement("button");c.type="button";c.className=`cell ${on?"on":"off"}`;c.setAttribute("role","gridcell");c.setAttribute("aria-label",`Node ${x+1}, ${y+1}: ${on?"illuminated":"dark"}`);c.disabled=state.autoSolving||state.complete;c.onclick=()=>{if(state.complete||state.autoSolving)return;startTimer();toggleCross(state.current,x,y,state.size);state.moves++;render();update();if(state.current.every(Boolean))finish(true);};e.board.appendChild(c);}); }

    function autoSolve(){
      if(state.game!=="lights"||state.complete||state.autoSolving)return;
      const solution=solveLights([...state.current],state.size);
      if(!solution){e.status.textContent="AUTO SOLVE UNAVAILABLE";return;}
      if(solution.length===0){finish(true);return;}
      startTimer();state.autoSolving=true;e.auto.disabled=true;render();
      let step=0;
      const applyNext=()=>{
        if(!state.autoSolving||state.complete)return;
        const cell=solution[step++];
        const {x,y}=coords(cell);
        toggleCross(state.current,x,y,state.size);state.moves++;render();update();
        if(state.current.every(Boolean)){finish(true);return;}
        if(step<solution.length) state.autoHandle=setTimeout(applyNext,750);
        else {state.autoSolving=false;e.auto.disabled=false;render();}
      };
      state.autoHandle=setTimeout(applyNext,750);
    }

    function revealSafe(start){const queue=[start],queued=new Set(queue);while(queue.length){const i=queue.shift();if(state.revealed.has(i)||state.bombs.has(i))continue;state.revealed.add(i);if(bombCount(i)===0)adjacent(i).forEach(a=>{if(!queued.has(a)&&!state.bombs.has(a)){queue.push(a);queued.add(a);}});}}
    function revealCell(i){if(state.complete||state.revealed.has(i))return;startTimer();state.moves++;if(state.bombs.has(i)){state.revealed.add(i);state.errors++;render();update();if(state.errors>1)finish(false);return;}revealSafe(i);render();update();const safe=state.size*state.size-state.mines;const seen=[...state.revealed].filter(x=>!state.bombs.has(x)).length;if(seen===safe)finish(true);}
    function renderMines(){for(let i=0;i<state.size*state.size;i++){const {x,y}=coords(i);const c=document.createElement("button");c.type="button";c.className="cell";c.setAttribute("role","gridcell");const revealed=state.revealed.has(i),bomb=state.bombs.has(i);if(revealed){c.classList.add("revealed");if(bomb){c.classList.add("mine-hit");c.textContent="X";}else{const n=bombCount(i);if(n){c.textContent=String(n);c.dataset.count=String(n);}}}c.onclick=()=>revealCell(i);c.setAttribute("aria-label",`Node ${x+1}, ${y+1}`);e.board.appendChild(c);}}

    e.tabs.forEach(t=>t.onclick=()=>setGame(t.dataset.game));
    e.retry.onclick=retry;e.fresh.onclick=newPuzzle;e.auto.onclick=autoSolve;
    setGame("lights");
    return { destroy(){ cancelAutoSolve();clearTimer(); } };
  }

  /* ------------------------- Science scan practice ------------------------- */
  function createScanSimulator(root) {
    if (!root) return null;
    root.innerHTML = `
      <div class="section-heading"><span class="micro-label">SCIENCE SENSOR OPERATIONS</span><h2>Scanning Practice Simulator</h2><p>Tune each sensor channel until every coloured waveform synchronises with the reference signal. The scan locks only when the complete signal is aligned.</p></div>
      <section class="scan-practice-shell">
        <aside class="scan-config">
          <span class="micro-label">TRAINING PARAMETERS</span><h2>Sensor Profile</h2><p>The built-in profiles reproduce the scan-complexity rules used by fleet systems. Scripted mission contacts can override these values in live operations.</p>
          <div class="select-grid">
            <label>Complexity profile<select id="scan-profile"><option value="simple">Simple</option><option value="normal" selected>Normal</option><option value="advanced">Advanced</option></select></label>
            <label>Scan pass<select id="scan-pass"><option value="initial" selected>Initial scan</option><option value="deep">Deep / full scan</option></select></label>
          </div>
          <button id="scan-new" class="button primary" type="button">Generate New Scan</button>
          <p class="control-note" id="scan-param-note"></p>
        </aside>
        <div class="scan-workspace">
          <div class="scan-topline"><div><span class="micro-label">ACTIVE SENSOR CHANNEL</span><h3 id="scan-label">Electric signature</h3></div><div><span class="micro-label">STAGE</span><strong id="scan-stage" class="scan-stage">1 / 2</strong></div></div>
          <div class="signal-display"><canvas id="signal-canvas" width="900" height="190"></canvas><div id="lock-indicator" class="lock-indicator">LOCKED</div></div>
          <div id="scan-sliders" class="scan-sliders"></div>
          <div class="signal-readouts"><div><span class="micro-label">SIGNAL ERROR</span><strong id="scan-error">0.000</strong></div><div><span class="micro-label">LOCK STATE</span><strong id="scan-lock">SEARCHING</strong></div><div><span class="micro-label">SCAN STATUS</span><strong id="scan-status">IN PROGRESS</strong></div></div>
        </div>
      </section>`;

    const q=id=>root.querySelector(id);
    const e={ profile:q("#scan-profile"), pass:q("#scan-pass"), fresh:q("#scan-new"), note:q("#scan-param-note"), label:q("#scan-label"), stage:q("#scan-stage"), canvas:q("#signal-canvas"), lockIndicator:q("#lock-indicator"), sliders:q("#scan-sliders"), error:q("#scan-error"), lock:q("#scan-lock"), status:q("#scan-status") };
    const ctx=e.canvas.getContext("2d");
    const labels=["Electric signature","Biomass frequency","Gravity well signature","Radiation halftime","Radio profile","Ionic phase shift","Infra-red color shift","Doppler stability","Raspberry jam prevention","Infinity impropability","Zerospace audio frequency"];
    const colours=["rgba(255,45,84,.98)","rgba(65,255,81,.98)","rgba(70,120,255,.98)","rgba(255,217,110,.98)"];
    const state={ complexity:1, depth:2, stage:0, targets:[], values:[], lockedAt:null, finished:false, timer:null, label:"", targetPeriod:3.5, phaseSeed:0 };

    function params(){const p=e.profile.value,deep=e.pass.value==="deep";if(p==="simple")return{complexity:1,depth:1};if(p==="advanced")return{complexity:deep?3:2,depth:2};return{complexity:deep?2:1,depth:2};}
    function randomValue(){return Math.random();}
    function totalError(){return state.values.reduce((sum,value,i)=>sum+Math.abs(state.targets[i]-value),0);}
    function fullyAligned(){return state.values.length>0&&totalError()<.05;}

    function newStage(){
      state.targets=[];state.values=[];
      for(let i=0;i<state.complexity;i++){
        const t=randomValue();let v=randomValue();
        while(Math.abs(t-v)<.2)v=randomValue();
        state.targets.push(t);state.values.push(v);
      }
      state.targetPeriod=2+Math.random()*3;
      state.phaseSeed=Math.random()*Math.PI*2;
      state.lockedAt=null;
      state.label=labels[Math.floor(Math.random()*labels.length)];
      e.label.textContent=`[${state.stage+1}/${state.depth}] ${state.label}`;
      e.stage.textContent=`${state.stage+1} / ${state.depth}`;
      e.lock.textContent="SEARCHING";
      e.lockIndicator.classList.remove("visible");
      renderSliders();
      updateSignal();
    }

    function reset(){
      const p=params();state.complexity=p.complexity;state.depth=p.depth;state.stage=0;state.finished=false;
      e.status.textContent="IN PROGRESS";e.status.classList.remove("scan-complete");
      e.note.textContent=`${state.complexity} active channel${state.complexity===1?"":"s"} • ${state.depth} stage${state.depth===1?"":"s"} • all channels must align • combined tolerance < 0.05`;
      newStage();
    }

    function renderSliders(){
      e.sliders.innerHTML="";
      state.values.forEach((value,i)=>{
        const row=document.createElement("div");row.className="scan-slider";
        const label=document.createElement("label");label.textContent=`Channel ${i+1}`;label.style.color=colours[i%colours.length];
        const input=document.createElement("input");input.type="range";input.min="0";input.max="1000";input.step="1";input.value=String(Math.round(value*1000));input.setAttribute("aria-label",`Sensor channel ${i+1}`);
        const out=document.createElement("output");out.textContent=value.toFixed(3);
        input.oninput=()=>{if(state.finished)return;state.values[i]=Number(input.value)/1000;out.textContent=state.values[i].toFixed(3);updateSignal();};
        row.append(label,input,out);e.sliders.appendChild(row);
      });
    }

    function drawWave(stroke,width,period,phase,noise=0,alpha=1){
      const w=e.canvas.width,h=e.canvas.height,amp=h*.34,centre=h/2,points=Math.floor(w/4)-1;
      ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.beginPath();
      for(let n=0;n<points;n++){
        const x=4+n*4;
        let f=Math.sin((n/points)*Math.PI*2*period+phase);
        if(noise>0){
          const deterministic=Math.sin(n*12.9898+phase*78.233)*43758.5453;
          const randomish=(deterministic-Math.floor(deterministic))*2-1;
          f=(1-noise)*f+noise*randomish;
        }
        const y=centre+f*amp;
        if(n===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }
      ctx.stroke();ctx.restore();
    }

    function drawSignal(){
      const w=e.canvas.width,h=e.canvas.height;
      ctx.clearRect(0,0,w,h);
      ctx.fillStyle="#020812";ctx.fillRect(0,0,w,h);
      ctx.strokeStyle="rgba(105,186,255,.10)";ctx.lineWidth=1;
      for(let x=0;x<w;x+=45){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
      for(let y=0;y<h;y+=38){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}

      const now=performance.now()/1000;
      const basePhase=now*1.8+state.phaseSeed;
      // Faint target waveform: the correct answer is this moving sine, never a flat line.
      drawWave("rgba(242,247,255,.24)",1.5,state.targetPeriod,basePhase,0,1);

      const hold=state.lockedAt===null?0:performance.now()-state.lockedAt;
      const settle=state.lockedAt===null?1:Math.max(0,1-Math.min(1000,hold)/1000);
      state.values.forEach((value,i)=>{
        const signed=(value-state.targets[i])*settle;
        const error=Math.abs(signed);
        // Each bar controls one waveform. As its value approaches target, period,
        // phase and noise all converge on the common reference waveform.
        const period=state.targetPeriod*(1+signed*1.8);
        const phase=basePhase+signed*(9+i*1.6);
        const noise=Math.min(.72,error*2.4);
        drawWave(colours[i%colours.length],2.7,period,phase,noise,1);
      });
    }

    function updateSignal(){
      const err=totalError();e.error.textContent=err.toFixed(3);
      if(fullyAligned()){
        if(state.lockedAt===null)state.lockedAt=performance.now();
      }else{
        state.lockedAt=null;e.lock.textContent="SEARCHING";e.lockIndicator.classList.remove("visible");
      }
      drawSignal();
    }

    function tick(){
      drawSignal();
      if(state.finished||state.lockedAt===null)return;
      const held=performance.now()-state.lockedAt;
      if(!fullyAligned()){state.lockedAt=null;e.lock.textContent="SEARCHING";e.lockIndicator.classList.remove("visible");return;}
      if(held>=1000){e.lock.textContent="LOCKED";e.lockIndicator.classList.add("visible");}else e.lock.textContent="ACQUIRING";
      if(held>=2000){
        state.stage++;
        if(state.stage>=state.depth){
          state.finished=true;e.status.textContent="SCAN COMPLETE";e.status.classList.add("scan-complete");e.lock.textContent="LOCKED";e.lockIndicator.classList.add("visible");
          [...e.sliders.querySelectorAll("input")].forEach(i=>i.disabled=true);
        }else newStage();
      }
    }

    e.profile.onchange=reset;e.pass.onchange=reset;e.fresh.onclick=reset;state.timer=setInterval(tick,50);reset();
    return { destroy(){clearInterval(state.timer);} };
  }

  document.addEventListener("click", navHandler);
  els.menu.addEventListener("click", () => els.sidebar.classList.contains("open") ? closeNav() : openNav());
  els.scrim.addEventListener("click", closeNav);
  window.addEventListener("hashchange", renderFromHash);
  if (!location.hash) history.replaceState(null, "", "#/home");
  renderFromHash();
})();
