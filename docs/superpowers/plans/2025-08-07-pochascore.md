# Pochascore Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first web app for scoring the card game Pocha, with player management, round tracking, and localStorage persistence.

**Architecture:** Single-page Svelte app with component-based structure. State managed via Svelte stores, persisted to localStorage. Components handle specific game phases.

**Tech Stack:** Svelte 4, Vite, localStorage

## Global Constraints

- Mobile-first design (320px+ width)
- Dark theme (#1a1a2e background)
- No backend, 100% frontend
- Spanish language UI
- Support 2-10 players
- Classic Pocha variant only (32 rounds)

---

## File Structure

```
src/
├── App.svelte                    # Root component, game state routing
├── stores/
│   └── gameState.js              # Svelte store for game state
├── components/
│   ├── WelcomeScreen.svelte      # Start/resume game
│   ├── GameSetup.svelte          # Player count selection
│   ├── PlayerRegistration.svelte # Avatar, color, name
│   ├── TablePosition.svelte      # Circular table seating
│   ├── RoundSetup.svelte         # Trump + mano selection
│   ├── BiddingPhase.svelte       # Bid entry
│   ├── PlayingPhase.svelte       # Trick counting
│   ├── ScoringPhase.svelte       # Round scoring
│   └── ScoreBoard.svelte         # Final scores
├── lib/
│   ├── constants.js              # Suits, avatars, colors, rounds
│   └── scoring.js                # Scoring calculations
└── main.js                       # Entry point
```

---

### Task 1: Project Setup

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.js`
- Create: `src/App.svelte`

**Interfaces:**
- Produces: Working Svelte dev server

- [ ] **Step 1: Initialize project**

```bash
npm create vite@latest . -- --template svelte
```

- [ ] **Step 2: Install dependencies**

```bash
npm install
```

- [ ] **Step 3: Verify dev server starts**

```bash
npm run dev
```
Expected: Server starts on localhost:5173

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: initialize Svelte + Vite project"
```

---

### Task 2: Constants and Scoring Logic

**Files:**
- Create: `src/lib/constants.js`
- Create: `src/lib/scoring.js`

**Interfaces:**
- Produces: `SUITS`, `AVATARS`, `COLORS`, `ROUNDS`, `calculateScore()`

- [ ] **Step 1: Create constants.js**

```javascript
export const SUITS = {
  oros: { name: 'Oros', emoji: '🪙', color: '#FFD700' },
  copas: { name: 'Copas', emoji: '🏆', color: '#FF6B6B' },
  espadas: { name: 'Espadas', emoji: '⚔️', color: '#4ECDC4' },
  bastos: { name: 'Bastos', emoji: '🪵', color: '#45B7D1' }
};

export const AVATARS = [
  '👨', '👩', '🧑', '👴', '👵',
  '🎅', '🧛', '🤠', '🤴', '👸',
  '🦸', '🦹', '🧙', '🧝', '🧟'
];

export const PLAYER_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9'
];

export const ROUNDS = [
  1, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  10, 10, 10, 10, 'S', 'S', 'S', 'S',
  9, 8, 7, 6, 5, 4, 3, 2, 'I', 'I', 'I', 'I'
];

export const PHASES = {
  WELCOME: 'welcome',
  SETUP: 'setup',
  REGISTRATION: 'registration',
  POSITIONING: 'positioning',
  ROUND_SETUP: 'roundSetup',
  BIDDING: 'bidding',
  PLAYING: 'playing',
  SCORING: 'scoring',
  GAME_END: 'gameEnd'
};
```

- [ ] **Step 2: Create scoring.js**

```javascript
export function calculateScore(bid, taken) {
  if (bid === taken) {
    return 10 + (bid * 5);
  } else {
    return -5 * Math.abs(bid - taken);
  }
}

export function calculateRoundScores(players, bids, tricks) {
  return players.map((player, index) => {
    const bid = bids[index] || 0;
    const taken = tricks[index] || 0;
    const roundScore = calculateScore(bid, taken);
    return {
      playerId: player.id,
      bid,
      taken,
      roundScore,
      totalScore: player.score + roundScore
    };
  });
}

export function isPocha(playerTricks, totalTricksInRound, cardsDealt) {
  return cardsDealt >= 6 && playerTricks === totalTricksInRound;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/constants.js src/lib/scoring.js
git commit -m "feat: add constants and scoring logic"
```

---

### Task 3: Game State Store

**Files:**
- Create: `src/stores/gameState.js`

**Interfaces:**
- Produces: `gameStore`, `saveGame()`, `loadGame()`, `clearGame()`, `hasSavedGame()`

- [ ] **Step 1: Create gameState.js**

```javascript
import { writable } from 'svelte/store';
import { ROUNDS, PHASES } from '../lib/constants';

const STORAGE_KEY = 'pochascore_current_game';

function createInitialState() {
  return {
    gameId: crypto.randomUUID(),
    variant: 'classica',
    totalRounds: ROUNDS.length,
    players: [],
    currentRound: {
      number: 1,
      tricksInRound: ROUNDS[0],
      trump: null,
      mano: null,
      phase: PHASES.WELCOME,
      bids: [],
      tricks: [],
      currentTrick: 1,
      tricksPlayed: 0
    },
    history: [],
    lastSaved: null
  };
}

function createGameStore() {
  const { subscribe, set, update } = writable(createInitialState());

  return {
    subscribe,
    set,
    update,
    reset: () => set(createInitialState()),
    
    setPhase: (phase) => update(state => ({
      ...state,
      currentRound: { ...state.currentRound, phase }
    })),
    
    addPlayer: (player) => update(state => ({
      ...state,
      players: [...state.players, player]
    })),
    
    updatePlayer: (id, updates) => update(state => ({
      ...state,
      players: state.players.map(p => 
        p.id === id ? { ...p, ...updates } : p
      )
    })),
    
    setTrump: (trump) => update(state => ({
      ...state,
      currentRound: { ...state.currentRound, trump }
    })),
    
    setMano: (mano) => update(state => ({
      ...state,
      currentRound: { ...state.currentRound, mano }
    })),
    
    setBids: (bids) => update(state => ({
      ...state,
      currentRound: { ...state.currentRound, bids }
    })),
    
    setTricks: (tricks) => update(state => ({
      ...state,
      currentRound: { ...state.currentRound, tricks }
    })),
    
    nextRound: () => update(state => {
      const nextRoundNum = state.currentRound.number + 1;
      if (nextRoundNum > ROUNDS.length) {
        return { ...state, currentRound: { ...state.currentRound, phase: PHASES.GAME_END } };
      }
      return {
        ...state,
        currentRound: {
          number: nextRoundNum,
          tricksInRound: ROUNDS[nextRoundNum - 1],
          trump: null,
          mano: null,
          phase: PHASES.ROUND_SETUP,
          bids: [],
          tricks: [],
          currentTrick: 1,
          tricksPlayed: 0
        }
      };
    }),
    
    updateScores: (scores) => update(state => ({
      ...state,
      players: state.players.map(p => {
        const scoreData = scores.find(s => s.playerId === p.id);
        return scoreData ? { ...p, score: scoreData.totalScore } : p;
      }),
      history: [...state.history, {
        round: state.currentRound.number,
        trump: state.currentRound.trump,
        mano: state.currentRound.mano,
        bids: state.currentRound.bids,
        tricks: state.currentRound.tricks,
        scores
      }]
    }))
  };
}

export const gameStore = createGameStore();

export function saveGame(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...state,
      lastSaved: new Date().toISOString()
    }));
    return true;
  } catch (e) {
    console.error('Failed to save game:', e);
    return false;
  }
}

export function loadGame() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Failed to load game:', e);
    clearGame();
    return null;
  }
}

export function clearGame() {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasSavedGame() {
  return localStorage.getItem(STORAGE_KEY) !== null;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/stores/gameState.js
git commit -m "feat: add game state store with localStorage persistence"
```

---

### Task 4: WelcomeScreen Component

**Files:**
- Create: `src/components/WelcomeScreen.svelte`

**Interfaces:**
- Consumes: `hasSavedGame()`, `loadGame()`, `gameStore`
- Produces: Dispatches `newGame` or `resumeGame` events

- [ ] **Step 1: Create WelcomeScreen.svelte**

```svelte
<script>
  import { createEventDispatcher } from 'svelte';
  import { hasSavedGame } from '../stores/gameState';
  
  const dispatch = createEventDispatcher();
  
  $: canResume = hasSavedGame();
  
  function handleNewGame() {
    dispatch('newGame');
  }
  
  function handleResumeGame() {
    dispatch('resumeGame');
  }
</script>

<div class="welcome">
  <h1>🃏 Pochascore</h1>
  <p>Tu marcador de Pocha</p>
  
  <div class="buttons">
    <button class="primary" on:click={handleNewGame}>
      Nueva partida
    </button>
    
    {#if canResume}
      <button class="secondary" on:click={handleResumeGame}>
        Recuperar partida
      </button>
    {/if}
  </div>
</div>

<style>
  .welcome {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
    text-align: center;
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #a0a0a0;
    margin-bottom: 2rem;
  }
  
  .buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 300px;
  }
  
  button {
    padding: 1rem 2rem;
    font-size: 1.1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.1s, opacity 0.1s;
  }
  
  button:active {
    transform: scale(0.98);
  }
  
  .primary {
    background: #e94560;
    color: white;
  }
  
  .secondary {
    background: #16213e;
    color: white;
    border: 1px solid #0f3460;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/WelcomeScreen.svelte
git commit -m "feat: add WelcomeScreen component"
```

---

### Task 5: GameSetup Component

**Files:**
- Create: `src/components/GameSetup.svelte`

**Interfaces:**
- Consumes: `gameStore`
- Produces: Dispatches `startRegistration` with playerCount

- [ ] **Step 1: Create GameSetup.svelte**

```svelte
<script>
  import { createEventDispatcher } from 'svelte';
  import { gameStore } from '../stores/gameState';
  
  const dispatch = createEventDispatcher();
  
  let playerCount = 4;
  
  const minPlayers = 2;
  const maxPlayers = 10;
  
  function increment() {
    if (playerCount < maxPlayers) playerCount++;
  }
  
  function decrement() {
    if (playerCount > minPlayers) playerCount--;
  }
  
  function handleStart() {
    gameStore.reset();
    dispatch('startRegistration', { playerCount });
  }
</script>

<div class="setup">
  <h2>Nueva partida</h2>
  
  <div class="player-selector">
    <label>Nº de jugadores</label>
    
    <div class="counter">
      <button on:click={decrement} disabled={playerCount <= minPlayers}>
        −
      </button>
      <span class="count">{playerCount}</span>
      <button on:click={increment} disabled={playerCount >= maxPlayers}>
        +
      </button>
    </div>
  </div>
  
  <button class="primary" on:click={handleStart}>
    Comenzar
  </button>
</div>

<style>
  .setup {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
    gap: 2rem;
  }
  
  h2 {
    font-size: 1.8rem;
  }
  
  .player-selector {
    text-align: center;
  }
  
  label {
    display: block;
    margin-bottom: 1rem;
    color: #a0a0a0;
  }
  
  .counter {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
  
  button {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
    border: none;
    border-radius: 50%;
    background: #16213e;
    color: white;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  button:hover:not(:disabled) {
    background: #0f3460;
  }
  
  button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  .count {
    font-size: 3rem;
    font-weight: bold;
    min-width: 80px;
  }
  
  .primary {
    width: 100%;
    max-width: 300px;
    padding: 1rem;
    font-size: 1.1rem;
    border-radius: 8px;
    background: #e94560;
    color: white;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/GameSetup.svelte
git commit -m "feat: add GameSetup component"
```

---

### Task 6: PlayerRegistration Component

**Files:**
- Create: `src/components/PlayerRegistration.svelte`

**Interfaces:**
- Consumes: `gameStore`, `AVATARS`, `PLAYER_COLORS`
- Produces: Populates `gameStore.players`, dispatches `registrationComplete`

- [ ] **Step 1: Create PlayerRegistration.svelte**

```svelte
<script>
  import { createEventDispatcher } from 'svelte';
  import { gameStore } from '../stores/gameState';
  import { AVATARS, PLAYER_COLORS } from '../lib/constants';
  
  const dispatch = createEventDispatcher();
  
  let currentPlayerIndex = 0;
  let playerName = '';
  let selectedAvatar = AVATARS[0];
  let selectedColor = PLAYER_COLORS[0];
  
  $: totalPlayers = parseInt($gameStore.players.length) || 4;
  $: isLastPlayer = currentPlayerIndex >= totalPlayers;
  $: canProceed = playerName.length >= 2 && playerName.length <= 4;
  
  function handleRegister() {
    gameStore.addPlayer({
      id: currentPlayerIndex + 1,
      name: playerName,
      avatar: selectedAvatar,
      color: selectedColor,
      position: null,
      score: 0
    });
    
    playerName = '';
    selectedAvatar = AVATARS[(currentPlayerIndex + 1) % AVATARS.length];
    selectedColor = PLAYER_COLORS[(currentPlayerIndex + 1) % PLAYER_COLORS.length];
    currentPlayerIndex++;
    
    if (isLastPlayer) {
      dispatch('registrationComplete');
    }
  }
</script>

<div class="registration">
  <h2>Jugador {currentPlayerIndex + 1} de {totalPlayers}</h2>
  
  <div class="avatar-selector">
    <label>Elige tu avatar</label>
    <div class="avatar-grid">
      {#each AVATARS as avatar, i}
        <button 
          class="avatar" 
          class:selected={selectedAvatar === avatar}
          on:click={() => selectedAvatar = avatar}
        >
          {avatar}
        </button>
      {/each}
    </div>
  </div>
  
  <div class="color-selector">
    <label>Elige tu color</label>
    <div class="color-grid">
      {#each PLAYER_COLORS as color, i}
        <button 
          class="color" 
          class:selected={selectedColor === color}
          style="background: {color}"
          on:click={() => selectedColor = color}
        />
      {/each}
    </div>
  </div>
  
  <div class="name-input">
    <label>Tu nombre (2-4 letras)</label>
    <input 
      type="text" 
      bind:value={playerName}
      maxlength="4"
      placeholder="Nombre"
    />
  </div>
  
  <button 
    class="primary" 
    on:click={handleRegister}
    disabled={!canProceed}
  >
    {isLastPlayer ? 'Comenzar partida' : 'Siguiente jugador'}
  </button>
</div>

<style>
  .registration {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    gap: 1.5rem;
    min-height: 100vh;
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #a0a0a0;
    font-size: 0.9rem;
  }
  
  .avatar-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;
  }
  
  .avatar {
    width: 50px;
    height: 50px;
    font-size: 1.8rem;
    border: 2px solid transparent;
    border-radius: 8px;
    background: #16213e;
    cursor: pointer;
    transition: border-color 0.2s, transform 0.1s;
  }
  
  .avatar.selected {
    border-color: #e94560;
    transform: scale(1.1);
  }
  
  .color-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;
  }
  
  .color {
    width: 40px;
    height: 40px;
    border: 2px solid transparent;
    border-radius: 50%;
    cursor: pointer;
    transition: border-color 0.2s, transform 0.1s;
  }
  
  .color.selected {
    border-color: white;
    transform: scale(1.15);
  }
  
  .name-input {
    width: 100%;
    max-width: 300px;
  }
  
  input {
    width: 100%;
    padding: 0.8rem;
    font-size: 1.2rem;
    text-align: center;
    text-transform: uppercase;
    border: 1px solid #0f3460;
    border-radius: 8px;
    background: #16213e;
    color: white;
  }
  
  input:focus {
    outline: none;
    border-color: #e94560;
  }
  
  .primary {
    width: 100%;
    max-width: 300px;
    padding: 1rem;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    background: #e94560;
    color: white;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  
  .primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PlayerRegistration.svelte
git commit -m "feat: add PlayerRegistration component"
```

---

### Task 7: TablePosition Component

**Files:**
- Create: `src/components/TablePosition.svelte`

**Interfaces:**
- Consumes: `gameStore`
- Produces: Updates `player.position` in store, dispatches `positioningComplete`

- [ ] **Step 1: Create TablePosition.svelte**

```svelte
<script>
  import { createEventDispatcher } from 'svelte';
  import { gameStore } from '../stores/gameState';
  
  const dispatch = createEventDispatcher();
  
  $: players = $gameStore.players;
  $: totalPlayers = players.length;
  $: positionedPlayers = players.filter(p => p.position !== null);
  $: allPositioned = positionedPlayers.length === totalPlayers;
  
  function getPlayerAtPosition(pos) {
    return players.find(p => p.position === pos);
  }
  
  function handleSeatClick(position) {
    const existing = getPlayerAtPosition(position);
    if (existing) return;
    
    const unpositioned = players.find(p => p.position === null);
    if (unpositioned) {
      gameStore.updatePlayer(unpositioned.id, { position });
    }
  }
  
  function handleFinish() {
    dispatch('positioningComplete');
  }
  
  function getPositionStyle(index) {
    const angle = (index / totalPlayers) * 360 - 90;
    const radius = 40;
    const x = 50 + radius * Math.cos(angle * Math.PI / 180);
    const y = 50 + radius * Math.sin(angle * Math.PI / 180);
    return `left: ${x}%; top: ${y}%; transform: translate(-50%, -50%)`;
  }
</script>

<div class="positioning">
  <h2>Toca para sentarte</h2>
  <p class="info">{positionedPlayers.length} de {totalPlayers} jugadores</p>
  
  <div class="table-container">
    <div class="table">
      <span class="table-label">MESA</span>
    </div>
    
    {#each Array(totalPlayers) as _, i}
      {@const player = getPlayerAtPosition(i)}
      <button 
        class="seat" 
        class:occupied={player}
        class:empty={!player}
        style={getPositionStyle(i)}
        on:click={() => handleSeatClick(i)}
        disabled={player}
      >
        {#if player}
          <span class="seat-avatar">{player.avatar}</span>
          <span class="seat-name">{player.name}</span>
        {:else}
          <span class="seat-empty">👤</span>
        {/if}
      </button>
    {/each}
  </div>
  
  {#if allPositioned}
    <button class="primary" on:click={handleFinish}>
      Comenzar juego
    </button>
  {/if}
</div>

<style>
  .positioning {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
  }
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  .info {
    color: #a0a0a0;
    margin-bottom: 2rem;
  }
  
  .table-container {
    position: relative;
    width: 300px;
    height: 300px;
    margin-bottom: 2rem;
  }
  
  .table {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    height: 120px;
    background: #16213e;
    border-radius: 50%;
    border: 3px solid #0f3460;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .table-label {
    font-size: 0.8rem;
    color: #a0a0a0;
    letter-spacing: 2px;
  }
  
  .seat {
    position: absolute;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 2px solid #0f3460;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .seat.empty {
    background: #1a1a2e;
  }
  
  .seat.empty:hover {
    background: #16213e;
    border-color: #e94560;
  }
  
  .seat.occupied {
    background: #16213e;
    cursor: default;
  }
  
  .seat-avatar {
    font-size: 1.5rem;
  }
  
  .seat-name {
    font-size: 0.6rem;
    color: #a0a0a0;
    margin-top: 2px;
  }
  
  .seat-empty {
    font-size: 1.5rem;
    opacity: 0.3;
  }
  
  .primary {
    width: 100%;
    max-width: 300px;
    padding: 1rem;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    background: #e94560;
    color: white;
    cursor: pointer;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TablePosition.svelte
git commit -m "feat: add TablePosition component"
```

---

### Task 8: RoundSetup Component

**Files:**
- Create: `src/components/RoundSetup.svelte`

**Interfaces:**
- Consumes: `gameStore`, `SUITS`
- Produces: Updates `trump` and `mano` in currentRound

- [ ] **Step 1: Create RoundSetup.svelte**

```svelte
<script>
  import { createEventDispatcher } from 'svelte';
  import { gameStore } from '../stores/gameState';
  import { SUITS, ROUNDS } from '../lib/constants';
  
  const dispatch = createEventDispatcher();
  
  $: round = $gameStore.currentRound;
  $: players = $gameStore.players;
  $: tricksInRound = ROUNDS[round.number - 1];
  $: canStart = round.trump !== null && round.mano !== null;
  
  function handleStartRound() {
    gameStore.setPhase('bidding');
    dispatch('roundStarted');
  }
</script>

<div class="round-setup">
  <div class="round-header">
    <h2>Ronda {round.number}</h2>
    <p class="tricks">{tricksInRound} bazas</p>
  </div>
  
  <div class="section">
    <h3>Triunfo</h3>
    <div class="suit-selector">
      {#each Object.entries(SUITS) as [key, suit]}
        <button 
          class="suit-btn"
          class:selected={round.trump === key}
          style="border-color: {suit.color}"
          on:click={() => gameStore.setTrump(key)}
        >
          <span class="suit-emoji">{suit.emoji}</span>
          <span class="suit-name">{suit.name}</span>
        </button>
      {/each}
    </div>
  </div>
  
  <div class="section">
    <h3>Mano</h3>
    <div class="mano-selector">
      {#each players as player}
        <button 
          class="mano-btn"
          class:selected={round.mano === player.id}
          on:click={() => gameStore.setMano(player.id)}
        >
          <span class="player-avatar">{player.avatar}</span>
          <span class="player-name">{player.name}</span>
        </button>
      {/each}
    </div>
  </div>
  
  <button class="primary" on:click={handleStartRound} disabled={!canStart}>
    Empezar apuestas
  </button>
</div>

<style>
  .round-setup {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
    gap: 2rem;
  }
  
  .round-header {
    text-align: center;
  }
  
  h2 {
    font-size: 1.8rem;
    margin-bottom: 0.25rem;
  }
  
  .tricks {
    font-size: 1.2rem;
    color: #e94560;
  }
  
  .section {
    width: 100%;
    max-width: 400px;
  }
  
  h3 {
    font-size: 1rem;
    color: #a0a0a0;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .suit-selector {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .suit-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    background: #16213e;
    border: 2px solid #0f3460;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .suit-btn.selected {
    background: #0f3460;
    border-color: #e94560;
  }
  
  .suit-emoji {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .suit-name {
    font-size: 0.9rem;
  }
  
  .mano-selector {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
  }
  
  .mano-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.75rem 1rem;
    background: #16213e;
    border: 2px solid #0f3460;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .mano-btn.selected {
    background: #0f3460;
    border-color: #e94560;
  }
  
  .player-avatar {
    font-size: 1.5rem;
    margin-bottom: 0.25rem;
  }
  
  .player-name {
    font-size: 0.8rem;
  }
  
  .primary {
    width: 100%;
    max-width: 300px;
    padding: 1rem;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    background: #e94560;
    color: white;
    cursor: pointer;
    margin-top: auto;
  }
  
  .primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/RoundSetup.svelte
git commit -m "feat: add RoundSetup component"
```

---

### Task 9: BiddingPhase Component

**Files:**
- Create: `src/components/BiddingPhase.svelte`

**Interfaces:**
- Consumes: `gameStore`, `ROUNDS`
- Produces: Updates `bids` in currentRound

- [ ] **Step 1: Create BiddingPhase.svelte**

```svelte
<script>
  import { createEventDispatcher } from 'svelte';
  import { gameStore } from '../stores/gameState';
  import { ROUNDS } from '../lib/constants';
  
  const dispatch = createEventDispatcher();
  
  $: round = $gameStore.currentRound;
  $: players = $gameStore.players;
  $: tricksInRound = ROUNDS[round.number - 1];
  $: bids = round.bids || [];
  
  $: currentBidderIndex = bids.length;
  $: currentBidder = players[currentBidderIndex];
  $: allBidsPlaced = currentBidderIndex >= players.length;
  
  $: totalBids = bids.reduce((sum, b) => sum + b.bid, 0);
  $: bidsValid = totalBids !== tricksInRound;
  
  function placeBid(bid) {
    const newBids = [...bids, { playerId: currentBidder.id, bid }];
    gameStore.setBids(newBids);
  }
  
  function handleFinishBidding() {
    if (bidsValid) {
      gameStore.setPhase('playing');
      dispatch('biddingComplete');
    }
  }
</script>

<div class="bidding">
  <div class="header">
    <h2>Ronda {round.number}</h2>
    <p class="info">Triunfo: {round.trump} | Mano: {players.find(p => p.id === round.mano)?.name}</p>
    <p class="tricks">Bazas: {tricksInRound}</p>
  </div>
  
  {#if !allBidsPlaced}
    <div class="bidder">
      <h3>¿Cuántas bazas haces?</h3>
      <div class="current-player">
        <span class="avatar">{currentBidder.avatar}</span>
        <span class="name">{currentBidder.name}</span>
      </div>
      
      <div class="bid-buttons">
        {#each Array(tricksInRound + 1) as _, i}
          <button class="bid-btn" on:click={() => placeBid(i)}>
            {i}
          </button>
        {/each}
      </div>
    </div>
  {/if}
  
  <div class="bids-summary">
    <h3>Apuestas</h3>
    <div class="bids-list">
      {#each bids as bid}
        {@const player = players.find(p => p.id === bid.playerId)}
        <div class="bid-item">
          <span>{player.avatar} {player.name}</span>
          <span class="bid-value">{bid.bid}</span>
        </div>
      {/each}
    </div>
    
    {#if allBidsPlaced}
      <div class="total" class:invalid={!bidsValid}>
        <span>Total:</span>
        <span>{totalBids}</span>
        {#if !bidsValid}
          <span class="error">No puede ser {tricksInRound}</span>
        {/if}
      </div>
    {/if}
  </div>
  
  {#if allBidsPlaced && bidsValid}
    <button class="primary" on:click={handleFinishBidding}>
      Comenzar juego
    </button>
  {/if}
</div>

<style>
  .bidding {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
    gap: 1.5rem;
  }
  
  .header {
    text-align: center;
  }
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  .info {
    color: #a0a0a0;
    font-size: 0.9rem;
  }
  
  .tricks {
    color: #e94560;
    font-size: 1.1rem;
    margin-top: 0.5rem;
  }
  
  .bidder {
    text-align: center;
    width: 100%;
    max-width: 400px;
  }
  
  h3 {
    font-size: 1rem;
    color: #a0a0a0;
    margin-bottom: 1rem;
  }
  
  .current-player {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .avatar {
    font-size: 2rem;
  }
  
  .name {
    font-size: 1.2rem;
    font-weight: bold;
  }
  
  .bid-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }
  
  .bid-btn {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
    border: none;
    border-radius: 8px;
    background: #16213e;
    color: white;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .bid-btn:hover {
    background: #0f3460;
  }
  
  .bids-summary {
    width: 100%;
    max-width: 400px;
    background: #16213e;
    border-radius: 12px;
    padding: 1rem;
  }
  
  .bids-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .bid-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    background: #1a1a2e;
    border-radius: 8px;
  }
  
  .bid-value {
    font-weight: bold;
    color: #e94560;
  }
  
  .total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #0f3460;
    font-weight: bold;
  }
  
  .total.invalid {
    color: #e94560;
  }
  
  .error {
    font-size: 0.8rem;
    color: #e94560;
  }
  
  .primary {
    width: 100%;
    max-width: 300px;
    padding: 1rem;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    background: #e94560;
    color: white;
    cursor: pointer;
    margin-top: auto;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/BiddingPhase.svelte
git commit -m "feat: add BiddingPhase component"
```

---

### Task 10: PlayingPhase Component

**Files:**
- Create: `src/components/PlayingPhase.svelte`

**Interfaces:**
- Consumes: `gameStore`, `ROUNDS`
- Produces: Updates `tricks` in currentRound

- [ ] **Step 1: Create PlayingPhase.svelte**

```svelte
<script>
  import { createEventDispatcher } from 'svelte';
  import { gameStore } from '../stores/gameState';
  import { ROUNDS, SUITS } from '../lib/constants';
  
  const dispatch = createEventDispatcher();
  
  $: round = $gameStore.currentRound;
  $: players = $gameStore.players;
  $: tricksInRound = ROUNDS[round.number - 1];
  $: tricks = round.tricks || [];
  
  $: currentPlayerIndex = tricks.length;
  $: currentPlayer = players[currentPlayerIndex];
  $: allTricksCounted = currentPlayerIndex >= players.length;
  
  function countTricks(taken) {
    const newTricks = [...tricks, { playerId: currentPlayer.id, taken }];
    gameStore.setTricks(newTricks);
  }
  
  function handleFinishRound() {
    gameStore.setPhase('scoring');
    dispatch('playingComplete');
  }
</script>

<div class="playing">
  <div class="header">
    <h2>Fase de juego</h2>
    <div class="round-info">
      <span class="trump">{SUITS[round.trump]?.emoji} {SUITS[round.trump]?.name}</span>
      <span class="mano">Mano: {players.find(p => p.id === round.mano)?.name}</span>
    </div>
    <p class="tricks">Bazas: {tricksInRound}</p>
  </div>
  
  {#if !allTricksCounted}
    <div class="counter">
      <h3>¿Cuántas bazas has hecho?</h3>
      <div class="current-player">
        <span class="avatar">{currentPlayer.avatar}</span>
        <span class="name">{currentPlayer.name}</span>
      </div>
      
      <div class="trick-buttons">
        {#each Array(tricksInRound + 1) as _, i}
          <button class="trick-btn" on:click={() => countTricks(i)}>
            {i}
          </button>
        {/each}
      </div>
    </div>
  {/if}
  
  <div class="tricks-summary">
    <h3>Bazas contadas</h3>
    <div class="tricks-list">
      {#each tricks as trick}
        {@const player = players.find(p => p.id === trick.playerId)}
        <div class="trick-item">
          <span>{player.avatar} {player.name}</span>
          <span class="trick-value">{trick.taken}</span>
        </div>
      {/each}
    </div>
    
    {#if allTricksCounted}
      {@const totalTricks = tricks.reduce((sum, t) => sum + t.taken, 0)}
      <div class="total" class:invalid={totalTricks !== tricksInRound}>
        <span>Total bazas:</span>
        <span>{totalTricks}</span>
        {#if totalTricks !== tricksInRound}
          <span class="error">Debe ser {tricksInRound}</span>
        {/if}
      </div>
    {/if}
  </div>
  
  {#if allTricksCounted}
    <button class="primary" on:click={handleFinishRound}>
      Calcular puntos
    </button>
  {/if}
</div>

<style>
  .playing {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
    gap: 1.5rem;
  }
  
  .header {
    text-align: center;
  }
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  .round-info {
    display: flex;
    gap: 1rem;
    justify-content: center;
    font-size: 0.9rem;
  }
  
  .trump {
    color: #FFD700;
  }
  
  .mano {
    color: #a0a0a0;
  }
  
  .tricks {
    color: #e94560;
    font-size: 1.1rem;
    margin-top: 0.5rem;
  }
  
  .counter {
    text-align: center;
    width: 100%;
    max-width: 400px;
  }
  
  h3 {
    font-size: 1rem;
    color: #a0a0a0;
    margin-bottom: 1rem;
  }
  
  .current-player {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .avatar {
    font-size: 2rem;
  }
  
  .name {
    font-size: 1.2rem;
    font-weight: bold;
  }
  
  .trick-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }
  
  .trick-btn {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
    border: none;
    border-radius: 8px;
    background: #16213e;
    color: white;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .trick-btn:hover {
    background: #0f3460;
  }
  
  .tricks-summary {
    width: 100%;
    max-width: 400px;
    background: #16213e;
    border-radius: 12px;
    padding: 1rem;
  }
  
  .tricks-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .trick-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    background: #1a1a2e;
    border-radius: 8px;
  }
  
  .trick-value {
    font-weight: bold;
    color: #e94560;
  }
  
  .total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #0f3460;
    font-weight: bold;
  }
  
  .total.invalid {
    color: #e94560;
  }
  
  .error {
    font-size: 0.8rem;
    color: #e94560;
  }
  
  .primary {
    width: 100%;
    max-width: 300px;
    padding: 1rem;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    background: #e94560;
    color: white;
    cursor: pointer;
    margin-top: auto;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PlayingPhase.svelte
git commit -m "feat: add PlayingPhase component"
```

---

### Task 11: ScoringPhase Component

**Files:**
- Create: `src/components/ScoringPhase.svelte`

**Interfaces:**
- Consumes: `gameStore`, `calculateRoundScores()`
- Produces: Updates player scores, dispatches `nextRound`

- [ ] **Step 1: Create ScoringPhase.svelte**

```svelte
<script>
  import { createEventDispatcher } from 'svelte';
  import { gameStore } from '../stores/gameState';
  import { calculateRoundScores } from '../lib/scoring';
  import { ROUNDS } from '../lib/constants';
  
  const dispatch = createEventDispatcher();
  
  $: round = $gameStore.currentRound;
  $: players = $gameStore.players;
  $: bids = round.bids || [];
  $: tricks = round.tricks || [];
  
  $: roundScores = calculateRoundScores(
    players.map(p => ({ ...p, score: p.score })),
    bids.map(b => b.bid),
    tricks.map(t => t.taken)
  );
  
  $: isLastRound = round.number >= ROUNDS.length;
  
  function handleNextRound() {
    gameStore.updateScores(roundScores);
    
    if (isLastRound) {
      gameStore.setPhase('gameEnd');
      dispatch('gameEnd');
    } else {
      gameStore.nextRound();
      dispatch('nextRound');
    }
  }
</script>

<div class="scoring">
  <h2>Puntuación Ronda {round.number}</h2>
  
  <div class="scores-table">
    <div class="table-header">
      <span>Jugador</span>
      <span>Apuesta</span>
      <span>Bazas</span>
      <span>Puntos</span>
      <span>Total</span>
    </div>
    
    {#each roundScores as score}
      {@const player = players.find(p => p.id === score.playerId)}
      <div class="table-row" class:positive={score.roundScore > 0} class:negative={score.roundScore < 0}>
        <span class="player">{player.avatar} {player.name}</span>
        <span>{score.bid}</span>
        <span>{score.taken}</span>
        <span class="round-score">{score.roundScore > 0 ? '+' : ''}{score.roundScore}</span>
        <span class="total-score">{score.totalScore}</span>
      </div>
    {/each}
  </div>
  
  <button class="primary" on:click={handleNextRound}>
    {isLastRound ? 'Ver resultado final' : 'Siguiente ronda'}
  </button>
</div>

<style>
  .scoring {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
    gap: 2rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  .scores-table {
    width: 100%;
    max-width: 500px;
    background: #16213e;
    border-radius: 12px;
    overflow: hidden;
  }
  
  .table-header, .table-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
    padding: 0.75rem 1rem;
    text-align: center;
  }
  
  .table-header {
    background: #0f3460;
    font-weight: bold;
    font-size: 0.85rem;
    color: #a0a0a0;
  }
  
  .table-row {
    border-bottom: 1px solid #0f3460;
  }
  
  .table-row:last-child {
    border-bottom: none;
  }
  
  .player {
    text-align: left;
  }
  
  .round-score {
    font-weight: bold;
  }
  
  .positive .round-score {
    color: #4ECDC4;
  }
  
  .negative .round-score {
    color: #e94560;
  }
  
  .total-score {
    font-weight: bold;
  }
  
  .primary {
    width: 100%;
    max-width: 300px;
    padding: 1rem;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    background: #e94560;
    color: white;
    cursor: pointer;
    margin-top: auto;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ScoringPhase.svelte
git commit -m "feat: add ScoringPhase component"
```

---

### Task 12: ScoreBoard Component

**Files:**
- Create: `src/components/ScoreBoard.svelte`

**Interfaces:**
- Consumes: `gameStore`
- Produces: Displays final scores, dispatches `newGame`

- [ ] **Step 1: Create ScoreBoard.svelte**

```svelte
<script>
  import { createEventDispatcher } from 'svelte';
  import { gameStore } from '../stores/gameState';
  
  const dispatch = createEventDispatcher();
  
  $: players = $gameStore.players;
  $: sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  $: winner = sortedPlayers[0];
  
  function handleNewGame() {
    dispatch('newGame');
  }
</script>

<div class="scoreboard">
  <h1>🏆 Resultado Final</h1>
  
  <div class="winner">
    <span class="winner-avatar">{winner.avatar}</span>
    <span class="winner-name">{winner.name}</span>
    <span class="winner-score">{winner.score} puntos</span>
  </div>
  
  <div class="final-scores">
    {#each sortedPlayers as player, i}
      <div class="player-row" class:gold={i === 0} class:silver={i === 1} class:bronze={i === 2}>
        <span class="position">{i + 1}º</span>
        <span class="player-avatar">{player.avatar}</span>
        <span class="player-name">{player.name}</span>
        <span class="player-score">{player.score}</span>
      </div>
    {/each}
  </div>
  
  <button class="primary" on:click={handleNewGame}>
    Nueva partida
  </button>
</div>

<style>
  .scoreboard {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
    gap: 2rem;
  }
  
  h1 {
    font-size: 1.8rem;
  }
  
  .winner {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    background: linear-gradient(135deg, #FFD700, #FFA500);
    border-radius: 16px;
    text-align: center;
  }
  
  .winner-avatar {
    font-size: 4rem;
  }
  
  .winner-name {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0.5rem 0;
  }
  
  .winner-score {
    font-size: 1.2rem;
    color: #1a1a2e;
  }
  
  .final-scores {
    width: 100%;
    max-width: 400px;
    background: #16213e;
    border-radius: 12px;
    overflow: hidden;
  }
  
  .player-row {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #0f3460;
    gap: 1rem;
  }
  
  .player-row:last-child {
    border-bottom: none;
  }
  
  .position {
    font-weight: bold;
    min-width: 30px;
  }
  
  .player-avatar {
    font-size: 1.5rem;
  }
  
  .player-name {
    flex: 1;
  }
  
  .player-score {
    font-weight: bold;
    color: #e94560;
  }
  
  .gold {
    background: rgba(255, 215, 0, 0.1);
  }
  
  .silver {
    background: rgba(192, 192, 192, 0.1);
  }
  
  .bronze {
    background: rgba(205, 127, 50, 0.1);
  }
  
  .primary {
    width: 100%;
    max-width: 300px;
    padding: 1rem;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    background: #e94560;
    color: white;
    cursor: pointer;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ScoreBoard.svelte
git commit -m "feat: add ScoreBoard component"
```

---

### Task 13: Main App Component

**Files:**
- Modify: `src/App.svelte`

**Interfaces:**
- Consumes: All components, `gameStore`, `loadGame()`
- Produces: Game flow routing

- [ ] **Step 1: Update App.svelte**

```svelte
<script>
  import { onMount } from 'svelte';
  import { gameStore, loadGame, saveGame, hasSavedGame } from './stores/gameState';
  import { PHASES } from './lib/constants';
  
  import WelcomeScreen from './components/WelcomeScreen.svelte';
  import GameSetup from './components/GameSetup.svelte';
  import PlayerRegistration from './components/PlayerRegistration.svelte';
  import TablePosition from './components/TablePosition.svelte';
  import RoundSetup from './components/RoundSetup.svelte';
  import BiddingPhase from './components/BiddingPhase.svelte';
  import PlayingPhase from './components/PlayingPhase.svelte';
  import ScoringPhase from './components/ScoringPhase.svelte';
  import ScoreBoard from './components/ScoreBoard.svelte';
  
  let playerCount = 4;
  
  onMount(() => {
    const saved = loadGame();
    if (saved) {
      gameStore.set(saved);
    }
  });
  
  $: phase = $gameStore.currentRound.phase;
  $: if (phase !== PHASES.WELCOME) {
    saveGame($gameStore);
  }
  
  function handleNewGame() {
    gameStore.reset();
    gameStore.setPhase(PHASES.SETUP);
  }
  
  function handleResumeGame() {
    const saved = loadGame();
    if (saved) {
      gameStore.set(saved);
    }
  }
  
  function handleStartRegistration(event) {
    playerCount = event.detail.playerCount;
    gameStore.setPhase(PHASES.REGISTRATION);
  }
  
  function handleRegistrationComplete() {
    gameStore.setPhase(PHASES.POSITIONING);
  }
  
  function handlePositioningComplete() {
    gameStore.setPhase(PHASES.ROUND_SETUP);
  }
  
  function handleRoundStarted() {
    gameStore.setPhase(PHASES.BIDDING);
  }
  
  function handleBiddingComplete() {
    gameStore.setPhase(PHASES.PLAYING);
  }
  
  function handlePlayingComplete() {
    gameStore.setPhase(PHASES.SCORING);
  }
  
  function handleNextRound() {
    if ($gameStore.currentRound.phase === PHASES.GAME_END) {
      gameStore.setPhase(PHASES.GAME_END);
    } else {
      gameStore.setPhase(PHASES.ROUND_SETUP);
    }
  }
  
  function handleGameEnd() {
    gameStore.setPhase(PHASES.GAME_END);
  }
</script>

<main>
  {#if phase === PHASES.WELCOME}
    <WelcomeScreen on:newGame={handleNewGame} on:resumeGame={handleResumeGame} />
    
  {:else if phase === PHASES.SETUP}
    <GameSetup on:startRegistration={handleStartRegistration} />
    
  {:else if phase === PHASES.REGISTRATION}
    <PlayerRegistration on:registrationComplete={handleRegistrationComplete} />
    
  {:else if phase === PHASES.POSITIONING}
    <TablePosition on:positioningComplete={handlePositioningComplete} />
    
  {:else if phase === PHASES.ROUND_SETUP}
    <RoundSetup on:roundStarted={handleRoundStarted} />
    
  {:else if phase === PHASES.BIDDING}
    <BiddingPhase on:biddingComplete={handleBiddingComplete} />
    
  {:else if phase === PHASES.PLAYING}
    <PlayingPhase on:playingComplete={handlePlayingComplete} />
    
  {:else if phase === PHASES.SCORING}
    <ScoringPhase on:nextRound={handleNextRound} on:gameEnd={handleGameEnd} />
    
  {:else if phase === PHASES.GAME_END}
    <ScoreBoard on:newGame={handleNewGame} />
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background: #1a1a2e;
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  main {
    min-height: 100vh;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/App.svelte
git commit -m "feat: add main App component with game flow routing"
```

---

### Task 14: Update index.html

**Files:**
- Modify: `index.html`

**Interfaces:**
- Produces: Proper meta tags for mobile

- [ ] **Step 1: Update index.html**

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="theme-color" content="#1a1a2e" />
    <meta name="description" content="Tu marcador de Pocha" />
    <title>Pochascore</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: update index.html with mobile meta tags"
```

---

### Task 15: Final Testing

**Files:**
- None (testing only)

**Interfaces:**
- Consumes: Complete application
- Produces: Verified working application

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Test complete game flow**

1. Open app in mobile browser or dev tools mobile view
2. Click "Nueva partida"
3. Select number of players (e.g., 4)
4. Register all players with avatars, colors, names
5. Position players on table
6. Complete round setup (trump + mano)
7. Place bids for all players
8. Count tricks for all players
9. View scoring
10. Repeat for multiple rounds
11. View final scoreboard

- [ ] **Step 3: Test persistence**

1. Close browser during game
2. Reopen app
3. Click "Recuperar partida"
4. Verify game resumes correctly

- [ ] **Step 4: Commit final state**

```bash
git add .
git commit -m "feat: complete Pochascore application"
```
