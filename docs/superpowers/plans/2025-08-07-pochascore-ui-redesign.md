# Pochascore UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar la UI de Pochascore con Tailwind CSS, colores oscuros elegantes, layout de panel por fase y animaciones flip entre transiciones.

**Architecture:** Se instalará Tailwind CSS con paleta personalizada, se crearán animaciones CSS para flip entre fases, y se actualizarán todos los componentes existentes con el nuevo estilo. No se cambia la lógica de negocio.

**Tech Stack:** Svelte 4, Vite, Tailwind CSS, CSS custom animations

## Global Constraints

- Mobile-first (diseño principal < 640px)
- Sin cambios a la lógica de scoring ni al store existente
- Todos los tests existentes deben pasar al final
- Commit frecuente después de cada tarea
- Usar emojis nativos para iconografía

---

## Task 1: Install and configure Tailwind CSS

- [ ] 1.1 Install Tailwind CSS and dependencies

```bash
npm install -D tailwindcss @tailwindcss/vite
```

- [ ] 1.2 Create `tailwind.config.js` at project root

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,svelte}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e293b',
        secondary: '#334155',
        surface: '#475569',
        gold: '#f59e0b',
        emerald: '#10b981',
        rose: '#f43f5e',
        bone: '#f8fafc',
        'gray-light': '#94a3b8',
        border: '#64748b',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

- [ ] 1.3 Create `postcss.config.js` at project root

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

- [ ] 1.4 Update `vite.config.js` to add Tailwind plugin

```js
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), svelte()],
  resolve: {
    conditions: ['browser', 'import', 'module'],
  },
  test: {
    environment: 'jsdom',
  },
})
```

- [ ] 1.5 Replace `src/app.css` content with Tailwind directives

```css
@import "tailwindcss";

@theme {
  --color-primary: #1e293b;
  --color-secondary: #334155;
  --color-surface: #475569;
  --color-gold: #f59e0b;
  --color-emerald: #10b981;
  --color-rose: #f43f5e;
  --color-bone: #f8fafc;
  --color-gray-light: #94a3b8;
  --color-border: #64748b;
}

body {
  margin: 0;
  padding: 0;
  background: #1e293b;
  color: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

- [ ] 1.6 Verify build works

```bash
npm run build
```

- [ ] 1.7 Commit: `feat: install and configure Tailwind CSS`

**Files:**
- Create: `tailwind.config.js`, `postcss.config.js`
- Modify: `vite.config.js`, `src/app.css`, `package.json`

**Interfaces:**
- Consumes: existing Vite config, existing `src/app.css`
- Produces: Tailwind-enabled build pipeline, custom color theme

---

## Task 2: Create CSS animations and panel layout system

- [ ] 2.1 Create `src/index.css` with flip animations, panel layout, button styles, card styles, avatar styles, score colors, and keyframe animations

```css
/* Flip Animation System */
.flip-container {
  perspective: 1000px;
  width: 100%;
  min-height: 100vh;
}

.flip-panel {
  transform-style: preserve-3d;
  transition: transform 0.6s ease-in-out;
  position: relative;
  width: 100%;
  min-height: 100vh;
}

.flip-panel.flipped {
  transform: rotateY(180deg);
}

.flip-front,
.flip-back {
  backface-visibility: hidden;
  position: absolute;
  width: 100%;
  min-height: 100vh;
}

.flip-back {
  transform: rotateY(180deg);
}

/* Panel Layout System */
.panel {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #1e293b;
}

.panel-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #334155;
  border-bottom: 1px solid #64748b;
  padding: 1rem;
}

.panel-content {
  flex: 1;
  padding: 1.5rem 1rem;
  overflow-y: auto;
}

.panel-footer {
  position: sticky;
  bottom: 0;
  background: #334155;
  border-top: 1px solid #64748b;
  padding: 1rem;
}

/* Button Styles */
.btn-primary {
  width: 100%;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: #1e293b;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.2s;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-secondary {
  width: 100%;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: 1px solid #64748b;
  border-radius: 0.5rem;
  background: #475569;
  color: #f8fafc;
  cursor: pointer;
  transition: transform 0.1s, background 0.2s;
}

.btn-secondary:hover {
  background: #64748b;
}

.btn-secondary:active {
  transform: translateY(0);
}

/* Card Style */
.card {
  background: #334155;
  border: 1px solid #64748b;
  border-radius: 0.75rem;
  padding: 1.25rem;
}

/* Avatar Styles */
.avatar-large {
  font-size: 3.5rem;
  line-height: 1;
}

.avatar-medium {
  font-size: 2rem;
  line-height: 1;
}

.avatar-small {
  font-size: 1.25rem;
  line-height: 1;
}

.avatar-btn {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  border: 2px solid transparent;
  border-radius: 0.5rem;
  background: #334155;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.1s;
}

.avatar-btn:hover {
  border-color: #64748b;
}

.avatar-btn.selected {
  border-color: #f59e0b;
  transform: scale(1.1);
  background: #475569;
}

/* Score Colors */
.score-positive {
  color: #10b981;
  font-weight: 600;
}

.score-negative {
  color: #f43f5e;
  font-weight: 600;
}

.score-neutral {
  color: #94a3b8;
  font-weight: 600;
}

/* Counter Button Styles */
.counter-btn {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  border: 1px solid #64748b;
  border-radius: 50%;
  background: #475569;
  color: #f8fafc;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.counter-btn:hover:not(:disabled) {
  background: #64748b;
}

.counter-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.counter-value {
  font-size: 3rem;
  font-weight: 700;
  min-width: 4rem;
  text-align: center;
  color: #f8fafc;
}

/* Suit Button Styles */
.suit-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.25rem;
  background: #334155;
  border: 2px solid #64748b;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.suit-btn:hover {
  border-color: #94a3b8;
}

.suit-btn.selected {
  border-color: #f59e0b;
  background: #475569;
}

/* Mano Button Styles */
.mano-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  background: #334155;
  border: 2px solid #64748b;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.mano-btn:hover {
  border-color: #94a3b8;
}

.mano-btn.selected {
  border-color: #f59e0b;
  background: #475569;
}

/* Bid/Trick Button Styles */
.bid-btn {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 600;
  border: 1px solid #64748b;
  border-radius: 0.5rem;
  background: #334155;
  color: #f8fafc;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.bid-btn:hover {
  background: #475569;
  transform: translateY(-1px);
}

/* List Item Styles */
.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #1e293b;
  border-radius: 0.5rem;
  gap: 0.75rem;
}

.list-item-value {
  font-weight: 700;
  color: #f59e0b;
  min-width: 2rem;
  text-align: center;
}

/* Table Styles */
.score-table {
  width: 100%;
  border-collapse: collapse;
}

.score-table-header {
  background: #475569;
}

.score-table-header span {
  padding: 0.75rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.score-table-row {
  border-bottom: 1px solid #334155;
}

.score-table-row:last-child {
  border-bottom: none;
}

.score-table-row span {
  padding: 0.75rem 0.5rem;
  font-size: 0.875rem;
  text-align: center;
}

/* Winner Highlight */
.winner-card {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  color: #1e293b;
}

/* Player Row Styles */
.player-row {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #334155;
  gap: 0.75rem;
}

.player-row:last-child {
  border-bottom: none;
}

.player-row.gold {
  background: rgba(245, 158, 11, 0.1);
}

.player-row.silver {
  background: rgba(148, 163, 184, 0.1);
}

.player-row.bronze {
  background: rgba(180, 83, 9, 0.1);
}

/* Keyframe Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes bounceIn {
  0% { opacity: 0; transform: scale(0.3); }
  50% { transform: scale(1.05); }
  70% { transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.4s ease-out;
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

.animate-bounce-in {
  animation: bounceIn 0.5s ease-out;
}

/* Table Position Specific */
.table-circle {
  width: 120px;
  height: 120px;
  background: #334155;
  border-radius: 50%;
  border: 3px solid #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.seat {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid #64748b;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #1e293b;
}

.seat:hover:not(.occupied) {
  border-color: #f59e0b;
  background: #334155;
}

.seat.occupied {
  cursor: default;
  background: #334155;
}

/* Input Styles */
.input-field {
  width: 100%;
  padding: 0.875rem;
  font-size: 1.125rem;
  text-align: center;
  text-transform: uppercase;
  border: 1px solid #64748b;
  border-radius: 0.5rem;
  background: #334155;
  color: #f8fafc;
  transition: border-color 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #f59e0b;
}

.input-field::placeholder {
  color: #94a3b8;
}

/* Color Selector */
.color-btn {
  width: 2.5rem;
  height: 2.5rem;
  border: 2px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.1s;
}

.color-btn:hover {
  transform: scale(1.1);
}

.color-btn.selected {
  border-color: #f8fafc;
  transform: scale(1.15);
}

/* Error/Invalid State */
.error-text {
  color: #f43f5e;
  font-size: 0.75rem;
}

.invalid-state {
  color: #f43f5e;
}
```

- [ ] 2.2 Update `src/main.js` to import `index.css`

```js
import { mount } from 'svelte'
import './app.css'
import './index.css'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app'),
})

export default app
```

- [ ] 2.3 Verify no CSS errors with `npm run build`

```bash
npm run build
```

- [ ] 2.4 Commit: `feat: add CSS animations and panel layout system`

**Files:**
- Create: `src/index.css`
- Modify: `src/main.js`

**Interfaces:**
- Consumes: Tailwind CSS setup from Task 1
- Produces: CSS classes for flip animation, panel layout, buttons, cards, avatars, score colors, keyframe animations

---

## Task 3: Update App.svelte with flip container structure

- [ ] 3.1 Replace `src/App.svelte` with new version using flip container

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
  let isFlipping = false;
  
  onMount(() => {
    const saved = loadGame();
    if (saved) {
      gameStore.set(saved);
    }
    
    const handleBeforeUnload = (e) => {
      const currentState = $gameStore;
      if (currentState.players.length > 0) {
        saveGame(currentState);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  });
  
  $: phase = $gameStore.currentRound.phase;
  $: if (phase !== PHASES.WELCOME) {
    saveGame($gameStore);
  }
  
  function triggerFlip(callback) {
    isFlipping = true;
    setTimeout(() => {
      callback();
      setTimeout(() => {
        isFlipping = false;
      }, 50);
    }, 300);
  }
  
  function handleNewGame() {
    triggerFlip(() => {
      gameStore.reset();
      gameStore.setPhase(PHASES.SETUP);
    });
  }
  
  function handleResumeGame() {
    const saved = loadGame();
    if (saved) {
      gameStore.set(saved);
    }
  }
  
  function handleStartRegistration(event) {
    playerCount = event.detail.playerCount;
    triggerFlip(() => {
      gameStore.setPhase(PHASES.REGISTRATION);
    });
  }
  
  function handleRegistrationComplete() {
    triggerFlip(() => {
      gameStore.setPhase(PHASES.POSITIONING);
    });
  }
  
  function handlePositioningComplete() {
    triggerFlip(() => {
      gameStore.setPhase(PHASES.ROUND_SETUP);
    });
  }
  
  function handleRoundStarted() {
    triggerFlip(() => {
      gameStore.setPhase(PHASES.BIDDING);
    });
  }
  
  function handleBiddingComplete() {
    triggerFlip(() => {
      gameStore.setPhase(PHASES.PLAYING);
    });
  }
  
  function handlePlayingComplete() {
    triggerFlip(() => {
      gameStore.setPhase(PHASES.SCORING);
    });
  }
  
  function handleNextRound() {
    triggerFlip(() => {
      if ($gameStore.currentRound.phase === PHASES.GAME_END) {
        gameStore.setPhase(PHASES.GAME_END);
      } else {
        gameStore.setPhase(PHASES.ROUND_SETUP);
      }
    });
  }
  
  function handleGameEnd() {
    triggerFlip(() => {
      gameStore.setPhase(PHASES.GAME_END);
    });
  }
</script>

<div class="flip-container">
  <div class="flip-panel" class:flipped={isFlipping}>
    <main>
      {#if phase === PHASES.WELCOME}
        <WelcomeScreen on:newGame={handleNewGame} on:resumeGame={handleResumeGame} />
        
      {:else if phase === PHASES.SETUP}
        <GameSetup on:startRegistration={handleStartRegistration} />
        
      {:else if phase === PHASES.REGISTRATION}
        <PlayerRegistration totalPlayers={playerCount} on:registrationComplete={handleRegistrationComplete} />
        
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
  </div>
</div>

<style>
  main {
    min-height: 100vh;
    background: #1e293b;
  }
</style>
```

- [ ] 3.2 Verify flip animation triggers on phase change by running dev server and clicking through

```bash
npm run dev
```

- [ ] 3.3 Commit: `feat: add flip container structure to App.svelte`

**Files:**
- Modify: `src/App.svelte`

**Interfaces:**
- Consumes: flip CSS classes from Task 2, game store phases
- Produces: flip animation on every phase transition

---

## Task 4: Redesign WelcomeScreen

- [ ] 4.1 Replace `src/components/WelcomeScreen.svelte` with redesigned version

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

<div class="panel">
  <div class="panel-content flex items-center justify-center">
    <div class="w-full max-w-sm mx-auto text-center animate-fade-in">
      <div class="mb-6">
        <span class="text-7xl block mb-4 animate-pulse">🃏</span>
        <h1 class="text-3xl font-bold text-bone mb-2">Pochascore</h1>
        <p class="text-gray-light">Tu marcador de Pocha</p>
      </div>
      
      <div class="flex flex-col gap-3">
        <button class="btn-primary" on:click={handleNewGame}>
          Nueva partida
        </button>
        
        {#if canResume}
          <button class="btn-secondary" on:click={handleResumeGame}>
            Recuperar partida
          </button>
        {/if}
      </div>
    </div>
  </div>
</div>
```

- [ ] 4.2 Verify WelcomeScreen renders with correct styles

```bash
npm run dev
```

- [ ] 4.3 Commit: `feat: redesign WelcomeScreen component`

**Files:**
- Modify: `src/components/WelcomeScreen.svelte`

**Interfaces:**
- Consumes: panel layout classes, button styles, animation classes from Task 2
- Produces: `on:newGame`, `on:resumeGame` events (unchanged)

---

## Task 5: Redesign GameSetup

- [ ] 5.1 Replace `src/components/GameSetup.svelte` with redesigned version

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

<div class="panel">
  <div class="panel-header">
    <h2 class="text-lg font-bold text-bone text-center">Nueva partida</h2>
  </div>
  
  <div class="panel-content flex flex-col items-center justify-center gap-8">
    <div class="w-full max-w-sm text-center animate-slide-up">
      <label class="block text-gray-light mb-4 text-sm">Nº de jugadores</label>
      
      <div class="flex items-center justify-center gap-6">
        <button 
          class="counter-btn" 
          on:click={decrement}
          disabled={playerCount <= minPlayers}
        >
          −
        </button>
        <span class="counter-value">{playerCount}</span>
        <button 
          class="counter-btn" 
          on:click={increment}
          disabled={playerCount >= maxPlayers}
        >
          +
        </button>
      </div>
    </div>
  </div>
  
  <div class="panel-footer">
    <button class="btn-primary" on:click={handleStart}>
      Comenzar
    </button>
  </div>
</div>
```

- [ ] 5.2 Verify GameSetup renders with counter animation and panel layout

```bash
npm run dev
```

- [ ] 5.3 Commit: `feat: redesign GameSetup component`

**Files:**
- Modify: `src/components/GameSetup.svelte`

**Interfaces:**
- Consumes: panel layout, counter styles, button styles from Task 2
- Produces: `on:startRegistration` event with `{ playerCount }` (unchanged)

---

## Task 6: Redesign PlayerRegistration

- [ ] 6.1 Replace `src/components/PlayerRegistration.svelte` with redesigned version

```svelte
<script>
  import { createEventDispatcher } from 'svelte';
  import { gameStore } from '../stores/gameState';
  import { AVATARS, PLAYER_COLORS } from '../lib/constants';
  
  const dispatch = createEventDispatcher();
  
  export let totalPlayers = 4;
  
  let currentPlayerIndex = 0;
  let playerName = '';
  let selectedAvatar = AVATARS[0];
  let selectedColor = PLAYER_COLORS[0];
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

<div class="panel">
  <div class="panel-header">
    <h2 class="text-lg font-bold text-bone text-center">
      Jugador {currentPlayerIndex + 1} de {totalPlayers}
    </h2>
  </div>
  
  <div class="panel-content flex flex-col gap-6 animate-fade-in">
    <div>
      <span class="block text-gray-light text-sm mb-3">Elige tu avatar</span>
      <div class="grid grid-cols-5 gap-2">
        {#each AVATARS as avatar, i}
          <button 
            class="avatar-btn" 
            class:selected={selectedAvatar === avatar}
            on:click={() => selectedAvatar = avatar}
          >
            {avatar}
          </button>
        {/each}
      </div>
    </div>
    
    <div>
      <span class="block text-gray-light text-sm mb-3">Elige tu color</span>
      <div class="grid grid-cols-5 gap-2 justify-items-center">
        {#each PLAYER_COLORS as color, i}
          <button 
            class="color-btn" 
            class:selected={selectedColor === color}
            style="background: {color}"
            aria-label="Color {i + 1}"
            on:click={() => selectedColor = color}
          ></button>
        {/each}
      </div>
    </div>
    
    <div class="w-full max-w-sm mx-auto">
      <label for="player-name" class="block text-gray-light text-sm mb-2">Tu nombre (2-4 letras)</label>
      <input 
        id="player-name"
        class="input-field"
        type="text" 
        bind:value={playerName}
        maxlength="4"
        placeholder="Nombre"
      />
    </div>
  </div>
  
  <div class="panel-footer">
    <button 
      class="btn-primary" 
      on:click={handleRegister}
      disabled={!canProceed}
    >
      {isLastPlayer ? 'Comenzar partida' : 'Siguiente jugador'}
    </button>
  </div>
</div>
```

- [ ] 6.2 Verify PlayerRegistration shows avatar grid, color grid, and input with correct styles

```bash
npm run dev
```

- [ ] 6.3 Commit: `feat: redesign PlayerRegistration component`

**Files:**
- Modify: `src/components/PlayerRegistration.svelte`

**Interfaces:**
- Consumes: panel layout, avatar styles, color selector, input styles from Task 2
- Produces: `on:registrationComplete` event (unchanged)

---

## Task 7: Redesign TablePosition

- [ ] 7.1 Replace `src/components/TablePosition.svelte` with redesigned version

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

<div class="panel">
  <div class="panel-header">
    <h2 class="text-lg font-bold text-bone text-center">Toca para sentarte</h2>
    <p class="text-gray-light text-sm text-center mt-1">
      {positionedPlayers.length} de {totalPlayers} jugadores
    </p>
  </div>
  
  <div class="panel-content flex items-center justify-center">
    <div class="relative w-72 h-72 animate-fade-in">
      <div class="table-circle">
        <span class="text-gray-light text-xs tracking-widest">MESA</span>
      </div>
      
      {#each Array(totalPlayers) as _, i}
        {@const player = getPlayerAtPosition(i)}
        <button 
          class="seat" 
          class:occupied={player}
          style={getPositionStyle(i)}
          style:border-color={player ? player.color : ''}
          on:click={() => handleSeatClick(i)}
          disabled={player}
        >
          {#if player}
            <span class="avatar-small">{player.avatar}</span>
            <span class="text-gray-light text-xs mt-1">{player.name}</span>
          {:else}
            <span class="avatar-small opacity-30">👤</span>
          {/if}
        </button>
      {/each}
    </div>
  </div>
  
  {#if allPositioned}
    <div class="panel-footer animate-slide-up">
      <button class="btn-primary" on:click={handleFinish}>
        Comenzar juego
      </button>
    </div>
  {/if}
</div>
```

- [ ] 7.2 Verify TablePosition shows circular table with colored seats

```bash
npm run dev
```

- [ ] 7.3 Commit: `feat: redesign TablePosition component`

**Files:**
- Modify: `src/components/TablePosition.svelte`

**Interfaces:**
- Consumes: panel layout, table circle, seat styles from Task 2
- Produces: `on:positioningComplete` event (unchanged)

---

## Task 8: Redesign RoundSetup

- [ ] 8.1 Replace `src/components/RoundSetup.svelte` with redesigned version

```svelte
<script>
  import { createEventDispatcher } from 'svelte';
  import { gameStore } from '../stores/gameState';
  import { SUITS, PHASES, getTricksForRound } from '../lib/constants';
  
  const dispatch = createEventDispatcher();
  
  $: round = $gameStore.currentRound;
  $: players = $gameStore.players;
  $: tricksInRound = getTricksForRound(round.number);
  $: canStart = round.trump !== null && round.mano !== null;
  
  function handleStartRound() {
    gameStore.setPhase(PHASES.BIDDING);
    dispatch('roundStarted');
  }
</script>

<div class="panel">
  <div class="panel-header">
    <h2 class="text-lg font-bold text-bone text-center">
      Ronda {round.number}
    </h2>
    <p class="text-gold text-sm text-center mt-1">{tricksInRound} bazas</p>
  </div>
  
  <div class="panel-content flex flex-col gap-6 animate-fade-in">
    <div class="w-full max-w-sm mx-auto">
      <h3 class="text-gray-light text-sm mb-3 text-center">Triunfo</h3>
      <div class="grid grid-cols-2 gap-3">
        {#each Object.entries(SUITS) as [key, suit]}
          <button 
            class="suit-btn"
            class:selected={round.trump === key}
            on:click={() => gameStore.setTrump(key)}
          >
            <span class="text-3xl">{suit.emoji}</span>
            <span class="text-sm text-bone">{suit.name}</span>
          </button>
        {/each}
      </div>
    </div>
    
    <div class="w-full max-w-sm mx-auto">
      <h3 class="text-gray-light text-sm mb-3 text-center">Mano</h3>
      <div class="flex flex-wrap justify-center gap-2">
        {#each players as player}
          <button 
            class="mano-btn"
            class:selected={round.mano === player.id}
            on:click={() => gameStore.setMano(player.id)}
          >
            <span class="avatar-medium">{player.avatar}</span>
            <span class="text-xs text-bone">{player.name}</span>
          </button>
        {/each}
      </div>
    </div>
  </div>
  
  <div class="panel-footer">
    <button class="btn-primary" on:click={handleStartRound} disabled={!canStart}>
      Empezar apuestas
    </button>
  </div>
</div>
```

- [ ] 8.2 Verify RoundSetup shows suit selector grid and mano player list

```bash
npm run dev
```

- [ ] 8.3 Commit: `feat: redesign RoundSetup component`

**Files:**
- Modify: `src/components/RoundSetup.svelte`

**Interfaces:**
- Consumes: panel layout, suit-btn, mano-btn styles from Task 2
- Produces: `on:roundStarted` event (unchanged)

---

## Task 9: Redesign BiddingPhase

- [ ] 9.1 Replace `src/components/BiddingPhase.svelte` with redesigned version

```svelte
<script>
  import { createEventDispatcher } from 'svelte';
  import { gameStore } from '../stores/gameState';
  import { SUITS, PHASES, getTricksForRound } from '../lib/constants';
  
  const dispatch = createEventDispatcher();
  
  $: round = $gameStore.currentRound;
  $: players = $gameStore.players;
  $: tricksInRound = getTricksForRound(round.number);
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
      gameStore.setPhase(PHASES.PLAYING);
      dispatch('biddingComplete');
    }
  }
</script>

<div class="panel">
  <div class="panel-header">
    <h2 class="text-lg font-bold text-bone text-center">Ronda {round.number}</h2>
    <div class="flex justify-center gap-4 mt-1 text-sm">
      <span class="text-gold">{SUITS[round.trump]?.emoji} {SUITS[round.trump]?.name}</span>
      <span class="text-gray-light">Mano: {players.find(p => p.id === round.mano)?.name}</span>
    </div>
    <p class="text-rose text-sm text-center mt-1">Bazas: {tricksInRound}</p>
  </div>
  
  <div class="panel-content flex flex-col gap-4 animate-fade-in">
    {#if !allBidsPlaced}
      <div class="w-full max-w-sm mx-auto text-center">
        <h3 class="text-gray-light text-sm mb-3">¿Cuántas bazas haces?</h3>
        <div class="flex items-center justify-center gap-3 mb-4">
          <span class="avatar-large">{currentBidder.avatar}</span>
          <span class="text-xl font-bold text-bone">{currentBidder.name}</span>
        </div>
        
        <div class="flex flex-wrap justify-center gap-2">
          {#each Array(tricksInRound + 1) as _, i}
            <button class="bid-btn" on:click={() => placeBid(i)}>
              {i}
            </button>
          {/each}
        </div>
      </div>
    {/if}
    
    <div class="card w-full max-w-sm mx-auto">
      <h3 class="text-gray-light text-sm mb-3">Apuestas</h3>
      <div class="flex flex-col gap-2">
        {#each bids as bid}
          {@const player = players.find(p => p.id === bid.playerId)}
          <div class="list-item">
            <span class="text-bone">{player.avatar} {player.name}</span>
            <span class="list-item-value">{bid.bid}</span>
          </div>
        {/each}
      </div>
      
      {#if allBidsPlaced}
        <div class="flex justify-between items-center mt-3 pt-3 border-t border-border">
          <span class="text-gray-light">Total:</span>
          <span class="font-bold" class:text-rose={!bidsValid} class:text-bone={bidsValid}>{totalBids}</span>
        </div>
        {#if !bidsValid}
          <p class="error-text mt-2 text-center">No puede ser {tricksInRound}</p>
        {/if}
      {/if}
    </div>
  </div>
  
  {#if allBidsPlaced && bidsValid}
    <div class="panel-footer animate-slide-up">
      <button class="btn-primary" on:click={handleFinishBidding}>
        Comenzar juego
      </button>
    </div>
  {/if}
</div>
```

- [ ] 9.2 Verify BiddingPhase shows bidder UI, bid buttons, and summary card

```bash
npm run dev
```

- [ ] 9.3 Commit: `feat: redesign BiddingPhase component`

**Files:**
- Modify: `src/components/BiddingPhase.svelte`

**Interfaces:**
- Consumes: panel layout, card, bid-btn, list-item styles from Task 2
- Produces: `on:biddingComplete` event (unchanged)

---

## Task 10: Redesign PlayingPhase

- [ ] 10.1 Replace `src/components/PlayingPhase.svelte` with redesigned version

```svelte
<script>
  import { createEventDispatcher } from 'svelte';
  import { gameStore } from '../stores/gameState';
  import { SUITS, PHASES, getTricksForRound } from '../lib/constants';
  
  const dispatch = createEventDispatcher();
  
  $: round = $gameStore.currentRound;
  $: players = $gameStore.players;
  $: tricksInRound = getTricksForRound(round.number);
  $: tricks = round.tricks || [];
  
  $: currentPlayerIndex = tricks.length;
  $: currentPlayer = players[currentPlayerIndex];
  $: allTricksCounted = currentPlayerIndex >= players.length;
  
  function countTricks(taken) {
    const newTricks = [...tricks, { playerId: currentPlayer.id, taken }];
    gameStore.setTricks(newTricks);
  }
  
  function handleFinishRound() {
    gameStore.setPhase(PHASES.SCORING);
    dispatch('playingComplete');
  }
</script>

<div class="panel">
  <div class="panel-header">
    <h2 class="text-lg font-bold text-bone text-center">Fase de juego</h2>
    <div class="flex justify-center gap-4 mt-1 text-sm">
      <span class="text-gold">{SUITS[round.trump]?.emoji} {SUITS[round.trump]?.name}</span>
      <span class="text-gray-light">Mano: {players.find(p => p.id === round.mano)?.name}</span>
    </div>
    <p class="text-rose text-sm text-center mt-1">Bazas: {tricksInRound}</p>
  </div>
  
  <div class="panel-content flex flex-col gap-4 animate-fade-in">
    {#if !allTricksCounted}
      <div class="w-full max-w-sm mx-auto text-center">
        <h3 class="text-gray-light text-sm mb-3">¿Cuántas bazas has hecho?</h3>
        <div class="flex items-center justify-center gap-3 mb-4">
          <span class="avatar-large">{currentPlayer.avatar}</span>
          <span class="text-xl font-bold text-bone">{currentPlayer.name}</span>
        </div>
        
        <div class="flex flex-wrap justify-center gap-2">
          {#each Array(tricksInRound + 1) as _, i}
            <button class="bid-btn" on:click={() => countTricks(i)}>
              {i}
            </button>
          {/each}
        </div>
      </div>
    {/if}
    
    <div class="card w-full max-w-sm mx-auto">
      <h3 class="text-gray-light text-sm mb-3">Bazas contadas</h3>
      <div class="flex flex-col gap-2">
        {#each tricks as trick}
          {@const player = players.find(p => p.id === trick.playerId)}
          <div class="list-item">
            <span class="text-bone">{player.avatar} {player.name}</span>
            <span class="list-item-value">{trick.taken}</span>
          </div>
        {/each}
      </div>
      
      {#if allTricksCounted}
        {@const totalTricks = tricks.reduce((sum, t) => sum + t.taken, 0)}
        <div class="flex justify-between items-center mt-3 pt-3 border-t border-border">
          <span class="text-gray-light">Total bazas:</span>
          <span class="font-bold" class:text-rose={totalTricks !== tricksInRound} class:text-bone={totalTricks === tricksInRound}>{totalTricks}</span>
        </div>
        {#if totalTricks !== tricksInRound}
          <p class="error-text mt-2 text-center">Debe ser {tricksInRound}</p>
        {/if}
      {/if}
    </div>
  </div>
  
  {#if allTricksCounted}
    {@const totalTricks = tricks.reduce((sum, t) => sum + t.taken, 0)}
    <div class="panel-footer animate-slide-up">
      <button class="btn-primary" on:click={handleFinishRound} disabled={totalTricks !== tricksInRound}>
        Calcular puntos
      </button>
    </div>
  {/if}
</div>
```

- [ ] 10.2 Verify PlayingPhase shows trick counter and summary card

```bash
npm run dev
```

- [ ] 10.3 Commit: `feat: redesign PlayingPhase component`

**Files:**
- Modify: `src/components/PlayingPhase.svelte`

**Interfaces:**
- Consumes: panel layout, card, bid-btn, list-item styles from Task 2
- Produces: `on:playingComplete` event (unchanged)

---

## Task 11: Redesign ScoringPhase

- [ ] 11.1 Replace `src/components/ScoringPhase.svelte` with redesigned version

```svelte
<script>
  import { createEventDispatcher } from 'svelte';
  import { gameStore } from '../stores/gameState';
  import { calculateRoundScores, isPocha } from '../lib/scoring';
  import { ROUNDS, PHASES, getTricksForRound, isSpecialRound } from '../lib/constants';
  
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
    const tricksInRound = getTricksForRound(round.number);
    const isSpecial = isSpecialRound(round.number);
    
    const adjustedScores = roundScores.map((score, index) => {
      if (isSpecial) {
        return { ...score, roundScore: 0 };
      }
      
      const playerTricks = tricks[index]?.taken || 0;
      const cardsDealt = tricksInRound;
      
      if (isPocha(playerTricks, tricksInRound, cardsDealt)) {
        return { ...score, roundScore: score.roundScore * 2 };
      }
      
      return score;
    });
    
    gameStore.updateScores(adjustedScores);
    
    if (isLastRound) {
      gameStore.setPhase(PHASES.GAME_END);
      dispatch('gameEnd');
    } else {
      gameStore.nextRound();
      dispatch('nextRound');
    }
  }
</script>

<div class="panel">
  <div class="panel-header">
    <h2 class="text-lg font-bold text-bone text-center">Puntuación Ronda {round.number}</h2>
  </div>
  
  <div class="panel-content flex flex-col gap-4 animate-fade-in">
    <div class="card w-full max-w-md mx-auto overflow-hidden p-0">
      <div class="score-table">
        <div class="score-table-header flex">
          <span class="flex-1">Jugador</span>
          <span class="w-12">Apuesta</span>
          <span class="w-12">Bazas</span>
          <span class="w-14">Puntos</span>
          <span class="w-12">Total</span>
        </div>
        
        {#each roundScores as score}
          {@const player = players.find(p => p.id === score.playerId)}
          <div class="score-table-row flex">
            <span class="flex-1 text-left text-bone">{player.avatar} {player.name}</span>
            <span class="w-12 text-bone">{score.bid}</span>
            <span class="w-12 text-bone">{score.taken}</span>
            <span class="w-14 score-positive" class:score-negative={score.roundScore < 0}>
              {score.roundScore > 0 ? '+' : ''}{score.roundScore}
            </span>
            <span class="w-12 font-bold text-bone">{score.totalScore}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
  
  <div class="panel-footer">
    <button class="btn-primary" on:click={handleNextRound}>
      {isLastRound ? 'Ver resultado final' : 'Siguiente ronda'}
    </button>
  </div>
</div>
```

- [ ] 11.2 Verify ScoringPhase shows score table with green/red colors

```bash
npm run dev
```

- [ ] 11.3 Commit: `feat: redesign ScoringPhase component`

**Files:**
- Modify: `src/components/ScoringPhase.svelte`

**Interfaces:**
- Consumes: panel layout, card, score-table, score-positive/negative styles from Task 2
- Produces: `on:nextRound`, `on:gameEnd` events (unchanged)

---

## Task 12: Redesign ScoreBoard

- [ ] 12.1 Replace `src/components/ScoreBoard.svelte` with redesigned version

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

<div class="panel">
  <div class="panel-header">
    <h2 class="text-lg font-bold text-bone text-center">🏆 Resultado Final</h2>
  </div>
  
  <div class="panel-content flex flex-col gap-4 animate-fade-in">
    <div class="winner-card animate-bounce-in">
      <span class="text-5xl block mb-2">{winner.avatar}</span>
      <span class="text-xl font-bold block">{winner.name}</span>
      <span class="text-lg">{winner.score} puntos</span>
    </div>
    
    <div class="card w-full max-w-md mx-auto overflow-hidden p-0">
      {#each sortedPlayers as player, i}
        <div class="player-row" class:gold={i === 0} class:silver={i === 1} class:bronze={i === 2}>
          <span class="font-bold text-gray-light w-8">{i + 1}º</span>
          <span class="avatar-medium">{player.avatar}</span>
          <span class="flex-1 text-bone">{player.name}</span>
          <span class="font-bold text-gold">{player.score}</span>
        </div>
      {/each}
    </div>
  </div>
  
  <div class="panel-footer">
    <button class="btn-primary" on:click={handleNewGame}>
      Nueva partida
    </button>
  </div>
</div>
```

- [ ] 12.2 Verify ScoreBoard shows winner card with gold gradient and player list

```bash
npm run dev
```

- [ ] 12.3 Commit: `feat: redesign ScoreBoard component`

**Files:**
- Modify: `src/components/ScoreBoard.svelte`

**Interfaces:**
- Consumes: panel layout, winner-card, player-row styles from Task 2
- Produces: `on:newGame` event (unchanged)

---

## Task 13: Final verification and testing

- [ ] 13.1 Run all existing tests to verify no regressions

```bash
npm test
```

- [ ] 13.2 Run build to verify production readiness

```bash
npm run build
```

- [ ] 13.3 Verify all components render correctly in dev mode

```bash
npm run dev
```

- [ ] 13.4 Verify flip animation works on all phase transitions

- [ ] 13.5 Verify mobile responsiveness (< 640px)

- [ ] 13.6 Verify all button states (enabled/disabled) work correctly

- [ ] 13.7 Commit: `test: final verification of UI redesign`

**Files:**
- No file changes (verification only)

**Interfaces:**
- Consumes: all tasks 1-12
- Produces: passing tests, working build

---

## Task 14: Documentation

- [ ] 14.1 Update README.md with new UI screenshots description (if README exists)

- [ ] 14.2 Add CSS class reference comment at top of `src/index.css`

```css
/* 
 * Pochascore UI Redesign - CSS Reference
 * 
 * Layout Classes:
 *   .panel          - Full-screen container (min-height: 100vh, flex column)
 *   .panel-header   - Sticky top header (bg-secondary, border-bottom)
 *   .panel-content  - Flexible content area (flex: 1, overflow-y: auto)
 *   .panel-footer   - Sticky bottom footer (bg-secondary, border-top)
 * 
 * Button Classes:
 *   .btn-primary    - Gold gradient button (primary action)
 *   .btn-secondary  - Surface background button (secondary action)
 *   .counter-btn    - Circular counter button (+/-)
 *   .bid-btn        - Bid/trick selection button
 *   .suit-btn       - Trump suit selector button
 *   .mano-btn       - Mano player selector button
 *   .avatar-btn     - Avatar selection button
 *   .color-btn      - Color selection button
 * 
 * Card Classes:
 *   .card           - Styled container (bg-secondary, border, rounded)
 *   .winner-card    - Gold gradient winner highlight
 * 
 * Score Classes:
 *   .score-positive - Green text for positive scores
 *   .score-negative - Red text for negative scores
 *   .score-neutral  - Gray text for neutral scores
 *   .score-table    - Score table layout
 * 
 * Animation Classes:
 *   .animate-fade-in    - Fade in from below
 *   .animate-slide-up   - Slide up animation
 *   .animate-pulse      - Pulsing animation (infinite)
 *   .animate-bounce-in  - Bounce in animation
 * 
 * Flip Animation:
 *   .flip-container - Perspective container (1000px)
 *   .flip-panel     - Rotating panel (rotateY 180deg)
 *   .flip-front     - Front face
 *   .flip-back      - Back face (rotated 180deg)
 * 
 * Color Palette:
 *   primary:    #1e293b (dark navy)
 *   secondary:  #334155 (charcoal gray)
 *   surface:    #475569 (elevated surfaces)
 *   gold:       #f59e0b (primary accent)
 *   emerald:    #10b981 (positive scores)
 *   rose:       #f43f5e (negative scores/errors)
 *   bone:       #f8fafc (primary text)
 *   gray-light: #94a3b8 (secondary text)
 *   border:     #64748b (borders)
 */
```

- [ ] 14.3 Commit: `docs: add CSS reference and documentation`

**Files:**
- Modify: `src/index.css` (add comment header)
- Optionally modify: `README.md`

**Interfaces:**
- Consumes: all CSS classes from Task 2
- Produces: documentation for future developers

---

## Self-Review Checklist

- [ ] **Spec coverage:** All 9 components from spec are redesigned (WelcomeScreen, GameSetup, PlayerRegistration, TablePosition, RoundSetup, BiddingPhase, PlayingPhase, ScoringPhase, ScoreBoard)
- [ ] **Spec coverage:** Tailwind CSS configured with custom palette matching spec
- [ ] **Spec coverage:** Flip animation implemented with perspective: 1000px, rotateY 180deg, 0.6s ease-in-out
- [ ] **Spec coverage:** Panel layout (header/content/footer) applied to all phase components
- [ ] **Spec coverage:** Mobile-first responsive design (all components use max-width containers)
- [ ] **Placeholder scan:** No TBD, TODO, "similar to task N", or "add appropriate error handling" in plan
- [ ] **Type consistency:** All event handlers match existing store API (no signature changes)
- [ ] **Type consistency:** All component props remain unchanged
- [ ] **Logic preservation:** No scoring logic, game state, or business rules modified
- [ ] **Test compatibility:** Existing test selectors (getByText) still match new HTML structure

## Execution Handoff

This plan is ready for execution. Choose one:

**Option A: Subagent-driven (recommended)**
- Use `superpowers:subagent-driven-development` skill
- Each task dispatched as independent subagent
- Built-in review checkpoints between tasks

**Option B: Inline execution**
- Use `superpowers:executing-plans` skill
- Execute tasks sequentially in current session
- Manual verification after each task
