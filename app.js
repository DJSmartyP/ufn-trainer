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

    const tabs = page.tabs.length > 1 ? `
      <nav class="section-tabs" aria-label="${page.title} sections">
        ${page.tabs.map(item => `<button class="section-tab ${item.id === validTab ? "active" : ""}" type="button" data-tab="${item.id}">${item.label}</button>`).join("")}
      </nav>` : "";

    const panel = page.tabs.find(item => item.id === validTab) || page.tabs[0];
    els.content.innerHTML = `
      <header class="page-head">
        <div><span class="eyebrow">${page.eyebrow}</span><h1>${page.title}</h1><p>${page.subtitle}</p></div>
        <div class="page-id" aria-hidden="true">${routeCodes[route] || "UFN"}</div>
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
            <div class="controls"><button id="hack-retry" class="button secondary" type="button">Retry Grid</button><button id="hack-new" class="button primary" type="button">New Grid</button></div>
            <p class="control-note"><strong>Retry</strong> restores this exact training puzzle. <strong>New Grid</strong> generates a fresh puzzle at the selected security grade.</p>
            <div id="hack-mine-controls" class="mine-controls" hidden><button id="hack-flag-mode" class="flag-toggle" type="button" aria-pressed="false">⚑ Mark suspected node: OFF</button><p>Desktop: right-click to mark. Touch: enable marking mode.</p></div>
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
      tabs: [...root.querySelectorAll(".practice-tab")], title: q("#hack-game-title"), desc: q("#hack-game-description"), target: q("#hack-target-label"), diff: q("#hack-difficulty-options"), retry: q("#hack-retry"), fresh: q("#hack-new"), mineControls: q("#hack-mine-controls"), flag: q("#hack-flag-mode"), attemptsWrap: q("#hack-attempts-wrap"), attempts: q("#hack-attempts"), grid: q("#hack-grid"), moves: q("#hack-moves"), progress: q("#hack-progress"), status: q("#hack-status"), timer: q("#hack-timer"), board: q("#hack-board"), result: q("#hack-result")
    };

    const state = { game: "lights", grades: { lights: 3, mines: 3 }, size: 7, mines: 0, initial: null, current: [], bombs: new Set(), revealed: new Set(), flagged: new Set(), errors: 0, moves: 0, complete: false, flagMode: false, start: null, elapsed: 0, timerHandle: null };
    const randomInt = (min,max) => Math.floor(Math.random() * (max-min+1)) + min;
    const indexOf = (x,y,size=state.size) => y * size + x;
    const coords = index => ({ x: index % state.size, y: Math.floor(index / state.size) });
    const selected = () => GAMES[state.game].levels[state.grades[state.game] - 1];

    function toggleCross(board,x,y,size) { [[x,y],[x-1,y],[x+1,y],[x,y-1],[x,y+1]].forEach(([px,py]) => { if (px>=0 && py>=0 && px<size && py<size) { const i=indexOf(px,py,size); board[i]=!board[i]; }}); }
    function generateLights(size) { let board; do { board = Array(size*size).fill(true); const moves = randomInt(3,3*size); for(let i=0;i<moves;i++) toggleCross(board,randomInt(0,size-1),randomInt(0,size-1),size); } while(board.every(Boolean)); return board; }
    function generateBombs(size,count) { const bombs=new Set(); while(bombs.size<count) bombs.add(randomInt(0,size*size-1)); return bombs; }
    function adjacent(index) { const {x,y}=coords(index); const out=[]; for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){ if(!dx&&!dy)continue; const nx=x+dx,ny=y+dy; if(nx>=0&&ny>=0&&nx<state.size&&ny<state.size) out.push(indexOf(nx,ny)); } return out; }
    function bombCount(index) { return adjacent(index).filter(i=>state.bombs.has(i)).length; }

    function clearTimer(){ if(state.timerHandle) clearInterval(state.timerHandle); state.timerHandle=null; state.start=null; state.elapsed=0; e.timer.textContent="00:00.0"; }
    function elapsedMs(){ return state.elapsed + (state.start===null?0:performance.now()-state.start); }
    function updateTimer(){ const ms=elapsedMs(); const mins=Math.floor(ms/60000); const secs=(ms%60000)/1000; e.timer.textContent=`${String(mins).padStart(2,"0")}:${secs.toFixed(1).padStart(4,"0")}`; }
    function startTimer(){ if(state.start!==null||state.complete)return; state.start=performance.now(); state.timerHandle=setInterval(updateTimer,100); }
    function stopTimer(){ if(state.start!==null){state.elapsed+=performance.now()-state.start;state.start=null;} if(state.timerHandle)clearInterval(state.timerHandle);state.timerHandle=null;updateTimer(); }

    function resetCommon(){ state.moves=0;state.complete=false;state.errors=0;state.revealed=new Set();state.flagged=new Set();e.moves.textContent="0";e.result.hidden=true;e.result.className="result-banner";clearTimer(); }
    function newPuzzle(){ const cfg=selected(); state.size=cfg.size;state.mines=cfg.mines||0;resetCommon(); if(state.game==="lights"){state.initial=generateLights(state.size);state.current=[...state.initial];state.bombs=new Set();}else{state.bombs=generateBombs(state.size,state.mines);state.initial=[...state.bombs];state.current=[];} render(); update(); }
    function retry(){ resetCommon(); if(state.game==="lights")state.current=[...state.initial]; else state.bombs=new Set(state.initial); render();update(); }

    function renderDiff(){ e.diff.innerHTML=""; GAMES[state.game].levels.forEach(item=>{ const b=document.createElement("button"); b.type="button"; b.className=`difficulty-option ${item.grade===state.grades[state.game]?"active":""}`; const params=state.game==="lights"?`${item.size} × ${item.size}`:`${item.size} × ${item.size} • ${item.mines} sensitive`; b.innerHTML=`<span class="diff">G${item.grade}</span><span>Security Grade ${["I","II","III","IV"][item.grade-1]}</span><span class="params">${params}</span>`; b.onclick=()=>{state.grades[state.game]=item.grade;renderDiff();newPuzzle();}; e.diff.appendChild(b); }); }
    function setGame(game){ state.game=game; state.flagMode=false; e.flag.classList.remove("active");e.flag.setAttribute("aria-pressed","false");e.flag.textContent="⚑ Mark suspected node: OFF"; e.tabs.forEach(t=>{const a=t.dataset.game===game;t.classList.toggle("active",a);t.setAttribute("aria-pressed",String(a));}); e.title.textContent=GAMES[game].title;e.desc.textContent=GAMES[game].desc;e.target.textContent=GAMES[game].target;e.mineControls.hidden=game!=="mines";e.attemptsWrap.hidden=game!=="mines";e.board.className=`board ${game==="lights"?"lights-board":"mines-board"}`;renderDiff();newPuzzle(); }

    function update(){ const total=state.size*state.size; let progress=0; if(state.game==="lights") progress=state.current.filter(Boolean).length/total; else {const safe=total-state.mines;const seen=[...state.revealed].filter(i=>!state.bombs.has(i)).length;progress=seen/safe;e.attempts.textContent=`${Math.max(0,2-state.errors)} / 2`;} const pct=Math.floor(progress*100);e.grid.textContent=`${state.size} × ${state.size}`;e.moves.textContent=String(state.moves);e.progress.style.width=`${pct}%`;if(!state.complete)e.status.textContent=`INTRUSION IN PROGRESS: ${pct}%`; }
    function finish(success){ state.complete=true;stopTimer();e.status.textContent=success?"INTRUSION SUCCESS":"INTRUSION FAILURE";e.result.hidden=false;e.result.textContent=success?"ACCESS ESTABLISHED":"CONNECTION TERMINATED";e.result.classList.add(success?"success":"failure");if(success)e.progress.style.width="100%";[...e.board.children].forEach(c=>c.disabled=true); }

    function render(){ e.board.innerHTML="";e.board.style.setProperty("--cols",String(state.size)); if(state.game==="lights")renderLights();else renderMines(); }
    function renderLights(){ state.current.forEach((on,index)=>{const {x,y}=coords(index);const c=document.createElement("button");c.type="button";c.className=`cell ${on?"on":"off"}`;c.setAttribute("role","gridcell");c.setAttribute("aria-label",`Node ${x+1}, ${y+1}: ${on?"illuminated":"dark"}`);c.onclick=()=>{if(state.complete)return;startTimer();toggleCross(state.current,x,y,state.size);state.moves++;render();update();if(state.current.every(Boolean))finish(true);};e.board.appendChild(c);}); }
    function revealSafe(start){const queue=[start],queued=new Set(queue);while(queue.length){const i=queue.shift();if(state.revealed.has(i)||state.flagged.has(i)||state.bombs.has(i))continue;state.revealed.add(i);if(bombCount(i)===0)adjacent(i).forEach(a=>{if(!queued.has(a)&&!state.bombs.has(a)&&!state.flagged.has(a)){queue.push(a);queued.add(a);}});}}
    function toggleFlag(i){if(state.complete||state.revealed.has(i))return;startTimer();state.flagged.has(i)?state.flagged.delete(i):state.flagged.add(i);state.moves++;render();update();}
    function revealCell(i){if(state.complete||state.revealed.has(i)||state.flagged.has(i))return;startTimer();state.moves++;if(state.bombs.has(i)){state.revealed.add(i);state.errors++;render();update();if(state.errors>1)finish(false);return;}revealSafe(i);render();update();const safe=state.size*state.size-state.mines;const seen=[...state.revealed].filter(x=>!state.bombs.has(x)).length;if(seen===safe)finish(true);}
    function renderMines(){for(let i=0;i<state.size*state.size;i++){const {x,y}=coords(i);const c=document.createElement("button");c.type="button";c.className="cell";c.setAttribute("role","gridcell");const revealed=state.revealed.has(i),bomb=state.bombs.has(i),flagged=state.flagged.has(i);if(revealed){c.classList.add("revealed");if(bomb){c.classList.add("mine-hit");c.textContent="X";}else{const n=bombCount(i);if(n){c.textContent=String(n);c.dataset.count=String(n);}}}else if(flagged){c.classList.add("flagged");c.textContent="⚑";}c.onclick=()=>state.flagMode?toggleFlag(i):revealCell(i);c.oncontextmenu=ev=>{ev.preventDefault();toggleFlag(i);};c.setAttribute("aria-label",`Node ${x+1}, ${y+1}`);e.board.appendChild(c);}}

    e.tabs.forEach(t=>t.onclick=()=>setGame(t.dataset.game));
    e.retry.onclick=retry;e.fresh.onclick=newPuzzle;e.flag.onclick=()=>{state.flagMode=!state.flagMode;e.flag.classList.toggle("active",state.flagMode);e.flag.setAttribute("aria-pressed",String(state.flagMode));e.flag.textContent=`⚑ Mark suspected node: ${state.flagMode?"ON":"OFF"}`;};
    setGame("lights");
    return { destroy(){ clearTimer(); } };
  }

  /* ------------------------- Science scan practice ------------------------- */
  function createScanSimulator(root) {
    if (!root) return null;
    root.innerHTML = `
      <div class="section-heading"><span class="micro-label">SCIENCE SENSOR OPERATIONS</span><h2>Scanning Practice Simulator</h2><p>Align the hidden sensor channels by reducing signal error. Hold a stable lock for two seconds to complete each stage.</p></div>
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
          <div class="signal-display"><canvas id="signal-canvas" width="900" height="160"></canvas><div id="lock-indicator" class="lock-indicator">LOCKED</div></div>
          <div id="scan-sliders" class="scan-sliders"></div>
          <div class="signal-readouts"><div><span class="micro-label">SIGNAL ERROR</span><strong id="scan-error">0.000</strong></div><div><span class="micro-label">LOCK STATE</span><strong id="scan-lock">SEARCHING</strong></div><div><span class="micro-label">SCAN STATUS</span><strong id="scan-status">IN PROGRESS</strong></div></div>
        </div>
      </section>`;

    const q=id=>root.querySelector(id);
    const e={ profile:q("#scan-profile"), pass:q("#scan-pass"), fresh:q("#scan-new"), note:q("#scan-param-note"), label:q("#scan-label"), stage:q("#scan-stage"), canvas:q("#signal-canvas"), lockIndicator:q("#lock-indicator"), sliders:q("#scan-sliders"), error:q("#scan-error"), lock:q("#scan-lock"), status:q("#scan-status") };
    const ctx=e.canvas.getContext("2d");
    const labels=["Electric signature","Biomass frequency","Gravity well signature","Radiation halftime","Radio profile","Ionic phase shift","Infra-red color shift","Doppler stability","Raspberry jam prevention","Infinity impropability","Zerospace audio frequency"];
    const state={ complexity:1, depth:2, stage:0, targets:[], values:[], lockedAt:null, finished:false, timer:null, label:"" };

    function params(){const p=e.profile.value,deep=e.pass.value==="deep";if(p==="simple")return{complexity:1,depth:1};if(p==="advanced")return{complexity:deep?3:2,depth:2};return{complexity:deep?2:1,depth:2};}
    function randomValue(){return Math.random();}
    function newStage(){state.targets=[];state.values=[];for(let i=0;i<state.complexity;i++){const t=randomValue();let v=randomValue();while(Math.abs(t-v)<.2)v=randomValue();state.targets.push(t);state.values.push(v);}state.lockedAt=null;state.label=labels[Math.floor(Math.random()*labels.length)];e.label.textContent=`[${state.stage+1}/${state.depth}] ${state.label}`;e.stage.textContent=`${state.stage+1} / ${state.depth}`;e.lock.textContent="SEARCHING";e.lockIndicator.classList.remove("visible");renderSliders();updateSignal();}
    function reset(){const p=params();state.complexity=p.complexity;state.depth=p.depth;state.stage=0;state.finished=false;e.status.textContent="IN PROGRESS";e.status.classList.remove("scan-complete");e.note.textContent=`${state.complexity} active channel${state.complexity===1?"":"s"} • ${state.depth} stage${state.depth===1?"":"s"} • lock threshold 0.05`;newStage();}
    function renderSliders(){e.sliders.innerHTML="";state.values.forEach((value,i)=>{const row=document.createElement("div");row.className="scan-slider";const label=document.createElement("label");label.textContent=`Channel ${i+1}`;const input=document.createElement("input");input.type="range";input.min="0";input.max="1000";input.step="1";input.value=String(Math.round(value*1000));input.setAttribute("aria-label",`Sensor channel ${i+1}`);const out=document.createElement("output");out.textContent=(value).toFixed(3);input.oninput=()=>{if(state.finished)return;state.values[i]=Number(input.value)/1000;out.textContent=state.values[i].toFixed(3);updateSignal();};row.append(label,input,out);e.sliders.appendChild(row);});}
    function errorValue(){return state.values.reduce((sum,v,i)=>sum+Math.abs(state.targets[i]-v),0);}
    function drawSignal(error){const w=e.canvas.width,h=e.canvas.height;ctx.clearRect(0,0,w,h);ctx.strokeStyle="rgba(105,186,255,.14)";ctx.lineWidth=1;for(let x=0;x<w;x+=45){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}for(let y=0;y<h;y+=32){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}const amp=Math.min(1,error*2.2);ctx.strokeStyle=error<.05?"rgba(114,240,189,.95)":"rgba(112,232,255,.95)";ctx.lineWidth=2.5;ctx.beginPath();for(let x=0;x<w;x++){const t=x/18;const noise=(Math.sin(t*2.7)+Math.sin(t*.83)*.5+Math.sin(t*7.1)*.22)*amp;const clean=Math.sin(t*.38)*3;const y=h/2+noise*(h*.23)+clean;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();}
    function updateSignal(){const err=errorValue();e.error.textContent=err.toFixed(3);drawSignal(err);if(err<.05){if(state.lockedAt===null)state.lockedAt=performance.now();}else{state.lockedAt=null;e.lock.textContent="SEARCHING";e.lockIndicator.classList.remove("visible");}}
    function tick(){if(state.finished||state.lockedAt===null)return;const held=performance.now()-state.lockedAt;if(errorValue()>=.05){state.lockedAt=null;return;}if(held>=1000){e.lock.textContent="LOCKED";e.lockIndicator.classList.add("visible");}else e.lock.textContent="ACQUIRING";if(held>=2000){state.stage++;if(state.stage>=state.depth){state.finished=true;e.status.textContent="SCAN COMPLETE";e.status.classList.add("scan-complete");e.lock.textContent="LOCKED";e.lockIndicator.classList.add("visible");[...e.sliders.querySelectorAll("input")].forEach(i=>i.disabled=true);}else newStage();}}

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
