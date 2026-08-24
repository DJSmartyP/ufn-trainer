(() => {
  "use strict";

  const GAME_CONFIG = {
    lights: {
      title: "Binary Countermeasures",
      description: "Illuminate every node. Selecting a node toggles it and its orthogonal neighbours.",
      difficulties: [
        { difficulty: 0, size: 3 },
        { difficulty: 1, size: 5 },
        { difficulty: 2, size: 7 },
        { difficulty: 3, size: 9 }
      ]
    },
    mines: {
      title: "Sensitive Node Mapping",
      description: "Reveal every safe node without disturbing two sensitive nodes. One error is survivable; the second ends the intrusion.",
      difficulties: [
        { difficulty: 0, size: 6, mines: 6 },
        { difficulty: 1, size: 8, mines: 8 },
        { difficulty: 2, size: 10, mines: 10 },
        { difficulty: 3, size: 12, mines: 12 }
      ]
    }
  };

  const els = {
    tabs: [...document.querySelectorAll(".game-tab")],
    title: document.getElementById("game-title"),
    description: document.getElementById("game-description"),
    difficultyOptions: document.getElementById("difficulty-options"),
    reset: document.getElementById("reset-button"),
    restart: document.getElementById("restart-button"),
    mineControls: document.getElementById("mine-controls"),
    flagMode: document.getElementById("flag-mode-button"),
    board: document.getElementById("board"),
    gridReadout: document.getElementById("grid-readout"),
    attemptsWrap: document.getElementById("attempts-readout-wrap"),
    attempts: document.getElementById("attempts-readout"),
    moves: document.getElementById("moves-readout"),
    progress: document.getElementById("progress-bar"),
    status: document.getElementById("status-text"),
    timer: document.getElementById("timer-text"),
    result: document.getElementById("result-banner")
  };

  const state = {
    game: "lights",
    difficulty: 2,
    size: 7,
    mineCount: 0,
    current: [],
    initial: [],
    bombs: new Set(),
    revealed: new Set(),
    flagged: new Set(),
    errors: 0,
    moves: 0,
    complete: false,
    flagMode: false,
    startedAt: null,
    elapsedBeforeStop: 0,
    timerHandle: null
  };

  function indexOf(x, y, size = state.size) {
    return y * size + x;
  }

  function coords(index, size = state.size) {
    return { x: index % size, y: Math.floor(index / size) };
  }

  function getSelectedConfig() {
    return GAME_CONFIG[state.game].difficulties.find(d => d.difficulty === state.difficulty);
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function formatTime(ms) {
    const tenths = Math.floor(ms / 100) % 10;
    const totalSeconds = Math.floor(ms / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;
  }

  function startTimerIfNeeded() {
    if (state.startedAt !== null || state.complete) return;
    state.startedAt = performance.now();
    state.timerHandle = window.setInterval(updateTimer, 100);
  }

  function updateTimer() {
    const elapsed = state.startedAt === null
      ? state.elapsedBeforeStop
      : state.elapsedBeforeStop + performance.now() - state.startedAt;
    els.timer.textContent = formatTime(elapsed);
  }

  function stopTimer() {
    if (state.startedAt !== null) {
      state.elapsedBeforeStop += performance.now() - state.startedAt;
      state.startedAt = null;
    }
    if (state.timerHandle !== null) {
      window.clearInterval(state.timerHandle);
      state.timerHandle = null;
    }
    updateTimer();
  }

  function clearTimer() {
    if (state.timerHandle !== null) window.clearInterval(state.timerHandle);
    state.timerHandle = null;
    state.startedAt = null;
    state.elapsedBeforeStop = 0;
    els.timer.textContent = "00:00.0";
  }

  function toggleCross(board, x, y, size) {
    const points = [[x, y], [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];
    for (const [px, py] of points) {
      if (px < 0 || py < 0 || px >= size || py >= size) continue;
      const i = indexOf(px, py, size);
      board[i] = !board[i];
    }
  }

  // Mirrors EmptyEpsilon's LightsOut generation: start solved, then apply
  // 3..(3*gridSize) valid moves, retrying if random toggles cancel to solved.
  function generateLightsBoard(size) {
    let board;
    do {
      board = Array(size * size).fill(true);
      const moves = randomInt(3, 3 * size);
      for (let i = 0; i < moves; i++) {
        const x = randomInt(0, size - 1);
        const y = randomInt(0, size - 1);
        toggleCross(board, x, y, size);
      }
    } while (board.every(Boolean));
    return board;
  }

  function generateBombs(size, count) {
    const bombs = new Set();
    while (bombs.size < count) {
      bombs.add(randomInt(0, size * size - 1));
    }
    return bombs;
  }

  function adjacentIndices(index) {
    const { x, y } = coords(index);
    const result = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < state.size && ny < state.size) {
          result.push(indexOf(nx, ny));
        }
      }
    }
    return result;
  }

  function adjacentBombCount(index) {
    return adjacentIndices(index).filter(i => state.bombs.has(i)).length;
  }

  function configureGame(game) {
    state.game = game;
    state.difficulty = 2;
    state.flagMode = false;
    els.flagMode.classList.remove("active");
    els.flagMode.setAttribute("aria-pressed", "false");
    els.flagMode.innerHTML = '<span aria-hidden="true">⚑</span> Flag mode: OFF';

    for (const tab of els.tabs) {
      const active = tab.dataset.game === game;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-pressed", String(active));
    }

    els.title.textContent = GAME_CONFIG[game].title;
    els.description.textContent = GAME_CONFIG[game].description;
    els.mineControls.hidden = game !== "mines";
    els.attemptsWrap.hidden = game !== "mines";
    els.board.className = `board ${game === "lights" ? "lights-board" : "mines-board"}`;

    renderDifficultyOptions();
    newPuzzle();
  }

  function renderDifficultyOptions() {
    els.difficultyOptions.innerHTML = "";
    for (const item of GAME_CONFIG[state.game].difficulties) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "difficulty-option";
      button.dataset.difficulty = String(item.difficulty);
      button.classList.toggle("active", item.difficulty === state.difficulty);
      const details = state.game === "lights"
        ? `${item.size} × ${item.size}`
        : `${item.size} × ${item.size} • ${item.mines} sensitive`;
      button.innerHTML = `
        <span class="diff">D${item.difficulty}</span>
        <span>EE difficulty ${item.difficulty}</span>
        <span class="params">${details}</span>
      `;
      button.addEventListener("click", () => {
        state.difficulty = item.difficulty;
        renderDifficultyOptions();
        newPuzzle();
      });
      els.difficultyOptions.appendChild(button);
    }
  }

  function resetCommonState() {
    state.moves = 0;
    state.complete = false;
    state.errors = 0;
    state.revealed = new Set();
    state.flagged = new Set();
    els.moves.textContent = "0";
    els.result.hidden = true;
    els.result.className = "result-banner";
    clearTimer();
  }

  function newPuzzle() {
    const config = getSelectedConfig();
    state.size = config.size;
    state.mineCount = config.mines || 0;
    resetCommonState();

    if (state.game === "lights") {
      state.initial = generateLightsBoard(state.size);
      state.current = [...state.initial];
      state.bombs = new Set();
    } else {
      state.bombs = generateBombs(state.size, state.mineCount);
      state.initial = [...state.bombs];
      state.current = [];
    }

    renderBoard();
    updateReadouts();
  }

  function resetPuzzle() {
    resetCommonState();
    if (state.game === "lights") {
      state.current = [...state.initial];
    } else {
      state.bombs = new Set(state.initial);
    }
    renderBoard();
    updateReadouts();
  }

  function updateReadouts() {
    const total = state.size * state.size;
    let progress = 0;

    if (state.game === "lights") {
      const lightsOn = state.current.filter(Boolean).length;
      progress = lightsOn / total;
    } else {
      const safeTotal = total - state.mineCount;
      const safeRevealed = [...state.revealed].filter(i => !state.bombs.has(i)).length;
      progress = safeRevealed / safeTotal;
      els.attempts.textContent = `${Math.max(0, 2 - state.errors)} / 2`;
    }

    const percent = Math.round(progress * 100);
    els.gridReadout.textContent = `${state.size} × ${state.size}`;
    els.moves.textContent = String(state.moves);
    els.progress.style.width = `${percent}%`;

    if (!state.complete) {
      els.status.textContent = `HACKING IN PROGRESS: ${percent}%`;
    }
  }

  function finish(success) {
    state.complete = true;
    stopTimer();
    els.status.textContent = success ? "HACKING SUCCESS!" : "HACKING FAILURE!";
    els.result.hidden = false;
    els.result.textContent = success ? "INTRUSION COMPLETE" : "INTRUSION DISCONNECTED";
    els.result.classList.add(success ? "success" : "failure");
    if (success) els.progress.style.width = "100%";
    [...els.board.children].forEach(cell => { cell.disabled = true; });
  }

  function renderBoard() {
    els.board.innerHTML = "";
    els.board.style.setProperty("--cols", String(state.size));

    if (state.game === "lights") {
      renderLightsBoard();
    } else {
      renderMinesBoard();
    }
  }

  function renderLightsBoard() {
    state.current.forEach((on, index) => {
      const { x, y } = coords(index);
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = `cell ${on ? "on" : "off"}`;
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-label", `Node ${x + 1}, ${y + 1}: ${on ? "illuminated" : "dark"}`);
      cell.addEventListener("click", () => {
        if (state.complete) return;
        startTimerIfNeeded();
        toggleCross(state.current, x, y, state.size);
        state.moves++;
        renderBoard();
        updateReadouts();
        if (state.current.every(Boolean)) finish(true);
      });
      els.board.appendChild(cell);
    });
  }

  function revealSafeArea(startIndex) {
    const queue = [startIndex];
    const queued = new Set(queue);

    while (queue.length) {
      const index = queue.shift();
      if (state.revealed.has(index) || state.flagged.has(index) || state.bombs.has(index)) continue;
      state.revealed.add(index);

      if (adjacentBombCount(index) === 0) {
        for (const adjacent of adjacentIndices(index)) {
          if (!queued.has(adjacent) && !state.bombs.has(adjacent) && !state.flagged.has(adjacent)) {
            queue.push(adjacent);
            queued.add(adjacent);
          }
        }
      }
    }
  }

  function toggleFlag(index) {
    if (state.complete || state.revealed.has(index)) return;
    startTimerIfNeeded();
    if (state.flagged.has(index)) state.flagged.delete(index);
    else state.flagged.add(index);
    state.moves++;
    renderBoard();
    updateReadouts();
  }

  function revealMineCell(index) {
    if (state.complete || state.revealed.has(index) || state.flagged.has(index)) return;
    startTimerIfNeeded();
    state.moves++;

    if (state.bombs.has(index)) {
      state.revealed.add(index);
      state.errors++;
      renderBoard();
      updateReadouts();
      if (state.errors > 1) finish(false);
      return;
    }

    revealSafeArea(index);
    renderBoard();
    updateReadouts();

    const safeTotal = state.size * state.size - state.mineCount;
    const safeRevealed = [...state.revealed].filter(i => !state.bombs.has(i)).length;
    if (safeRevealed === safeTotal) finish(true);
  }

  function renderMinesBoard() {
    for (let index = 0; index < state.size * state.size; index++) {
      const { x, y } = coords(index);
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "cell";
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-label", `Node ${x + 1}, ${y + 1}`);

      const revealed = state.revealed.has(index);
      const bomb = state.bombs.has(index);
      const flagged = state.flagged.has(index);

      if (revealed) {
        cell.classList.add("revealed");
        if (bomb) {
          cell.classList.add("mine-hit");
          cell.textContent = "X";
          cell.setAttribute("aria-label", `Node ${x + 1}, ${y + 1}: sensitive node triggered`);
        } else {
          const count = adjacentBombCount(index);
          if (count > 0) {
            cell.textContent = String(count);
            cell.dataset.count = String(count);
          }
          cell.setAttribute("aria-label", `Node ${x + 1}, ${y + 1}: ${count} adjacent sensitive nodes`);
        }
      } else if (flagged) {
        cell.classList.add("flagged");
        cell.textContent = "⚑";
        cell.setAttribute("aria-label", `Node ${x + 1}, ${y + 1}: flagged`);
      }

      cell.disabled = state.complete || revealed;
      cell.addEventListener("click", () => {
        if (state.flagMode) toggleFlag(index);
        else revealMineCell(index);
      });
      cell.addEventListener("contextmenu", event => {
        event.preventDefault();
        toggleFlag(index);
      });
      els.board.appendChild(cell);
    }
  }

  els.tabs.forEach(tab => tab.addEventListener("click", () => configureGame(tab.dataset.game)));
  els.reset.addEventListener("click", resetPuzzle);
  els.restart.addEventListener("click", newPuzzle);
  els.flagMode.addEventListener("click", () => {
    state.flagMode = !state.flagMode;
    els.flagMode.classList.toggle("active", state.flagMode);
    els.flagMode.setAttribute("aria-pressed", String(state.flagMode));
    els.flagMode.innerHTML = `<span aria-hidden="true">⚑</span> Flag mode: ${state.flagMode ? "ON" : "OFF"}`;
  });

  configureGame("lights");
})();
