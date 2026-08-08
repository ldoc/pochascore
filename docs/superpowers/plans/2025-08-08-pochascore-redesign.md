# PochaScore UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign PochaScore with new visual style, swipe navigation, virtual keyboard, and voice instructions

**Architecture:** Svelte components with Tailwind CSS, Web Speech API for voice, touch event handlers for swipe navigation, custom virtual keyboard component

**Tech Stack:** Svelte, Tailwind CSS, Vite, Web Speech API

## Global Constraints

- Background color: #1a1a2e (all screens)
- Font: Inter (Google Fonts)
- Navigation: Swipe left = forward, swipe right = back
- Transitions: Horizontal slide matching swipe direction
- Voice: Web Speech API (es-ES), mute button always visible bottom-right
- Mobile-first: All content must fill available width/height
- Virtual keyboard for nick input (4 letters max)

---

### Task 1: Setup Voice Utility

**Files:**
- Create: `src/lib/voice.js`

**Interfaces:**
- Produces: `speak(text)`, `toggleMute()`, `isMuted` store

- [ ] **Step 1: Create voice utility module**

```javascript
import { writable } from 'svelte/store';

export const isMuted = writable(false);

export function speak(text) {
  let muted = false;
  isMuted.subscribe(v => muted = v)();
  
  if (muted) return;
  if (!('speechSynthesis' in window)) return;
  
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

export function toggleMute() {
  isMuted.update(v => {
    if (v) {
      // Unmuting
    } else {
      window.speechSynthesis.cancel();
    }
    return !v;
  });
}
```

- [ ] **Step 2: Test voice works**

Run the app and verify voice speaks on screen entry.

- [ ] **Step 3: Commit**

```bash
git add src/lib/voice.js
git commit -m "feat: add voice utility with Web Speech API"
```

---

### Task 2: Update Global Styles

**Files:**
- Modify: `src/index.css`
- Modify: `src/app.css`

**Interfaces:**
- Produces: Global CSS variables, component classes

- [ ] **Step 1: Update CSS variables and base styles**

Replace the contents of `src/index.css` with:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  --bg-primary: #1a1a2e;
  --bg-card: #22223a;
  --bg-input: #2a2a3e;
  --border: #444;
  --border-light: #555;
  --text-primary: #f0f0f0;
  --text-secondary: #aaa;
  --text-muted: #666;
  --accent: #f59e0b;
  --success: #10b981;
  --error: #f43f5e;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: var(--bg-primary);
  font-family: 'Inter', 'Helvetica Neue', 'Arial', sans-serif;
  color: var(--text-primary);
  min-height: 100vh;
  overflow-x: hidden;
}

.screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: transform 0.35s ease;
  will-change: transform;
}

/* Nick letters */
.nick-letter {
  width: 50px;
  height: 55px;
  background: var(--bg-input);
  border: 2px solid var(--border);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
}

.nick-letter.active {
  border-color: var(--accent);
}

.nick-letter.filled {
  color: var(--text-primary);
}

/* Keyboard */
.kb-row {
  display: flex;
  justify-content: center;
  gap: 0.4rem;
}

.kb-key {
  flex: 1;
  max-width: 38px;
  aspect-ratio: 0.85;
  border-radius: 8px;
  border: none;
  background: #333;
  color: var(--text-primary);
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.1s;
  font-family: 'Inter', sans-serif;
}

.kb-key:active {
  background: #555;
}

.kb-key-wide {
  max-width: 80px;
  font-size: 1.4rem;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 4rem;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: #333;
  color: #ccc;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  opacity: 0;
  transition: opacity 0.3s, transform 0.3s;
  pointer-events: none;
  white-space: nowrap;
  z-index: 100;
}

.toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* Voice indicator */
.voice-indicator {
  position: fixed;
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255,255,255,0.1);
  color: #aaa;
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  font-size: 0.85rem;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.voice-indicator.show {
  opacity: 1;
}

/* Mute button */
.mute-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.8rem;
  z-index: 100;
  border: none;
  transition: background 0.2s;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/index.css
git commit -m "feat: update global styles with new design system"
```

---

### Task 3: Create MuteButton Component

**Files:**
- Create: `src/components/MuteButton.svelte`

**Interfaces:**
- Consumes: `isMuted`, `toggleMute` from `src/lib/voice.js`

- [ ] **Step 1: Create MuteButton component**

```svelte
<script>
  import { isMuted, toggleMute } from '../lib/voice';
</script>

<button class="mute-btn" on:click={toggleMute}>
  {$isMuted ? '🔇' : '🔊'}
</button>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/MuteButton.svelte
git commit -m "feat: create MuteButton component"
```

---

### Task 4: Create Toast Component

**Files:**
- Create: `src/components/Toast.svelte`

**Interfaces:**
- Produces: `showToast(message)` function

- [ ] **Step 1: Create Toast component**

```svelte
<script>
  let message = '';
  let visible = false;
  let timeout;
  
  export function show(msg) {
    message = msg;
    visible = true;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      visible = false;
    }, 2000);
  }
</script>

<div class="toast" class:show={visible}>
  {message}
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Toast.svelte
git commit -m "feat: create Toast notification component"
```

---

### Task 5: Create SwipeNavigation Mixin

**Files:**
- Create: `src/lib/swipe.js`

**Interfaces:**
- Produces: `setupSwipe(element, onSwipeLeft, onSwipeRight)`

- [ ] **Step 1: Create swipe utility**

```javascript
export function setupSwipe(element, onSwipeLeft, onSwipeRight) {
  let startX = 0;
  let startY = 0;
  
  function handleTouchStart(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }
  
  function handleTouchEnd(e) {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    handleSwipe(startX, endX, startY, endY);
  }
  
  function handleMouseDown(e) {
    startX = e.clientX;
    startY = e.clientY;
  }
  
  function handleMouseUp(e) {
    handleSwipe(startX, e.clientX, startY, e.clientY);
  }
  
  function handleSwipe(startX, endX, startY, endY) {
    const diffX = startX - endX;
    const diffY = Math.abs(startY - endY);
    
    if (Math.abs(diffX) > 50 && diffY < 100) {
      if (diffX > 0) {
        onSwipeLeft();
      } else {
        onSwipeRight();
      }
    }
  }
  
  element.addEventListener('touchstart', handleTouchStart);
  element.addEventListener('touchend', handleTouchEnd);
  element.addEventListener('mousedown', handleMouseDown);
  element.addEventListener('mouseup', handleMouseUp);
  
  return {
    destroy() {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mouseup', handleMouseUp);
    }
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/swipe.js
git commit -m "feat: create swipe navigation utility"
```

---

### Task 6: Create WelcomeScreen Component

**Files:**
- Modify: `src/components/WelcomeScreen.svelte`

**Interfaces:**
- Produces: `dispatch('continue')` event

- [ ] **Step 1: Rewrite WelcomeScreen**

```svelte
<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { speak } from '../lib/voice';
  import { setupSwipe } from '../lib/swipe';
  
  const dispatch = createEventDispatcher();
  let screenEl;
  
  onMount(() => {
    speak('Bienvenido a PochaScore');
    
    return setupSwipe(screenEl, () => {
      dispatch('continue');
    }, () => {});
  });
  
  function handleClick() {
    dispatch('continue');
  }
</script>

<div class="screen" bind:this={screenEl} on:click={handleClick} style="align-items: center; justify-content: center; cursor: pointer;">
  <div style="text-align: center;">
    <h1 style="font-size: clamp(4rem, 15vw, 7rem); font-weight: 800; color: var(--text-primary); letter-spacing: -0.03em; line-height: 1;">PochaScore</h1>
    <p style="font-size: clamp(1rem, 3vw, 1.3rem); color: #777; margin-top: 1rem; letter-spacing: 0.15em; text-transform: uppercase;">v1.0</p>
  </div>
  
  <p style="position: fixed; bottom: 4rem; left: 50%; transform: translateX(-50%); font-size: clamp(1rem, 3vw, 1.4rem); color: #aaa; letter-spacing: 0.05em; animation: blink 1.5s ease-in-out infinite; white-space: nowrap;">Pulse en la pantalla para continuar</p>
</div>

<style>
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/WelcomeScreen.svelte
git commit -m "feat: redesign WelcomeScreen with swipe and voice"
```

---

### Task 7: Create GameOptions Component

**Files:**
- Create: `src/components/GameOptions.svelte`

**Interfaces:**
- Produces: `dispatch('newGame')`, `dispatch('continueGame')` events

- [ ] **Step 1: Create GameOptions component**

```svelte
<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { speak } from '../lib/voice';
  import { setupSwipe } from '../lib/swipe';
  
  const dispatch = createEventDispatcher();
  let screenEl;
  let selected = null;
  
  onMount(() => {
    speak('Elige nueva partida para empezar, o continuar para retomar una partida guardada.');
    
    return setupSwipe(screenEl, () => {
      if (!selected) {
        showToast('Selecciona una opción primero');
        return;
      }
      if (selected === 'new') dispatch('newGame');
      else dispatch('continueGame');
    }, () => {});
  });
  
  function select(option) {
    selected = option;
  }
  
  let showToastFn;
</script>

<div class="screen" bind:this={screenEl} style="align-items: center; justify-content: center; gap: 2rem; padding: 2rem;">
  <div 
    class="option-card" 
    class:selected={selected === 'new'}
    on:click={() => select('new')}
    style="width: min(320px, 80vw); height: min(320px, 80vw); display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; border-radius: 24px; border: 4px solid {selected === 'new' ? 'var(--accent)' : '#ddd'}; background: #ffffff;"
  >
    <div style="font-size: clamp(4rem, 12vw, 6rem); margin-bottom: 1rem;">🎮</div>
    <div style="font-size: clamp(1.2rem, 4vw, 1.6rem); font-weight: 700; color: #1a1a2e;">Nueva</div>
    <div style="font-size: clamp(1.2rem, 4vw, 1.6rem); font-weight: 700; color: #1a1a2e;">partida</div>
  </div>
  
  <div 
    class="option-card"
    class:selected={selected === 'continue'}
    on:click={() => select('continue')}
    style="width: min(320px, 80vw); height: min(320px, 80vw); display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; border-radius: 24px; border: 4px solid {selected === 'continue' ? 'var(--accent)' : '#ddd'}; background: #ffffff;"
  >
    <div style="font-size: clamp(4rem, 12vw, 6rem); margin-bottom: 1rem;">📋</div>
    <div style="font-size: clamp(1.2rem, 4vw, 1.6rem); font-weight: 700; color: #1a1a2e;">Continuar</div>
    <div style="font-size: clamp(1.2rem, 4vw, 1.6rem); font-weight: 700; color: #1a1a2e;">partida</div>
  </div>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/GameOptions.svelte
git commit -m "feat: create GameOptions component with new/continue selection"
```

---

### Task 8: Create PlayerCount Component

**Files:**
- Create: `src/components/PlayerCount.svelte`

**Interfaces:**
- Produces: `dispatch('select', { count })` event

- [ ] **Step 1: Create PlayerCount component**

```svelte
<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { speak } from '../lib/voice';
  import { setupSwipe } from '../lib/swipe';
  
  const dispatch = createEventDispatcher();
  let screenEl;
  let scrollArea;
  let playerCount = 4;
  let isDragging = false;
  let scrollStartY = 0;
  let currentOffset = 0;
  let scrollOffset = 0;
  
  const MIN = 2;
  const MAX = 10;
  const ITEM_HEIGHT = 140;
  
  onMount(() => {
    speak('Arrastra arriba o abajo para elegir el número de jugadores.');
    currentOffset = -(playerCount - MIN) * ITEM_HEIGHT;
    updateListPosition();
    
    return setupSwipe(screenEl, () => {
      dispatch('select', { count: playerCount });
    }, () => {});
  });
  
  function handleTouchStart(e) {
    e.stopPropagation();
    isDragging = true;
    scrollStartY = e.touches[0].clientY;
    scrollOffset = currentOffset;
  }
  
  function handleTouchMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const diff = e.touches[0].clientY - scrollStartY;
    let newOffset = scrollOffset + diff;
    const minOffset = -(MAX - MIN) * ITEM_HEIGHT;
    newOffset = Math.max(minOffset - 80, Math.min(80, newOffset));
    currentOffset = newOffset;
    updateListPosition();
  }
  
  function handleTouchEnd() {
    if (!isDragging) return;
    isDragging = false;
    snapToNearest();
  }
  
  function handleMouseDown(e) {
    e.stopPropagation();
    isDragging = true;
    scrollStartY = e.clientY;
    scrollOffset = currentOffset;
  }
  
  function handleMouseMove(e) {
    if (!isDragging) return;
    const diff = e.clientY - scrollStartY;
    let newOffset = scrollOffset + diff;
    const minOffset = -(MAX - MIN) * ITEM_HEIGHT;
    newOffset = Math.max(minOffset - 80, Math.min(80, newOffset));
    currentOffset = newOffset;
    updateListPosition();
  }
  
  function handleMouseUp() {
    if (!isDragging) return;
    isDragging = false;
    snapToNearest();
  }
  
  function snapToNearest() {
    let index = Math.round(-currentOffset / ITEM_HEIGHT);
    index = Math.max(0, Math.min(MAX - MIN, index));
    currentOffset = -index * ITEM_HEIGHT;
    playerCount = MIN + index;
    updateListPosition();
  }
  
  function updateListPosition() {
    if (scrollArea) {
      scrollArea.style.transform = `translateY(${currentOffset}px)`;
    }
  }
  
  $: numbers = Array.from({ length: MAX - MIN + 1 }, (_, i) => MIN + i);
</script>

<svelte:window on:mousemove={handleMouseMove} on:mouseup={handleMouseUp} />

<div class="screen" bind:this={screenEl} style="align-items: center; justify-content: center; user-select: none;">
  <p style="font-size: clamp(1.2rem, 4vw, 1.5rem); color: #777; margin-bottom: 2rem;">Nº de jugadores</p>
  
  <div 
    style="height: 500px; width: 100%; max-width: 400px; overflow: hidden; position: relative; cursor: grab;"
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
    on:touchend={handleTouchEnd}
    on:mousedown={handleMouseDown}
  >
    <div bind:this={scrollArea} style="position: relative; transition: transform 0.2s ease-out;">
      {#each numbers as num}
        <div 
          class="number-item"
          class:active={num === playerCount}
          style="height: {ITEM_HEIGHT}px; display: flex; align-items: center; justify-content: center; font-size: {num === playerCount ? 'clamp(5rem, 20vw, 8rem)' : 'clamp(3rem, 10vw, 5rem)'}; font-weight: {num === playerCount ? '800' : '500'}; color: {num === playerCount ? 'var(--text-primary)' : '#444'};"
        >
          {num}
        </div>
      {/each}
    </div>
    
    <div style="position: absolute; top: 50%; left: 0; right: 0; height: 140px; transform: translateY(-50%); border-top: 2px solid #555; border-bottom: 2px solid #555; pointer-events: none;"></div>
  </div>
  
  <p style="font-size: 1rem; color: #555; margin-top: 2rem;">← Desliza para continuar</p>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PlayerCount.svelte
git commit -m "feat: create PlayerCount scrollable selector"
```

---

### Task 9: Create PlayerRegistration Component

**Files:**
- Modify: `src/components/PlayerRegistration.svelte`

**Interfaces:**
- Produces: `dispatch('complete', { players })` event

- [ ] **Step 1: Rewrite PlayerRegistration with virtual keyboard**

```svelte
<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { speak } from '../lib/voice';
  import { setupSwipe } from '../lib/swipe';
  import { AVATARS, PLAYER_COLORS } from '../lib/constants';
  
  export let totalPlayers = 4;
  
  const dispatch = createEventDispatcher();
  let screenEl;
  let currentIndex = 0;
  let selectedAvatar = AVATARS[0];
  let selectedColor = PLAYER_COLORS[0];
  let nick = ['', '', '', ''];
  let currentLetterIndex = 0;
  let players = [];
  
  const KB_ROWS = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L','Ñ'],
    ['Z','X','C','V','B','N','M']
  ];
  
  $: isLastPlayer = currentIndex >= totalPlayers - 1;
  $: canProceed = nick.every(l => l !== '');
  
  onMount(() => {
    speak(`Jugador 1. Elige tu avatar, tu color y escribe tu nick.`);
    
    return setupSwipe(screenEl, () => {
      if (!canProceed) return;
      savePlayer();
    }, () => {});
  });
  
  function pressKey(letter) {
    if (currentLetterIndex >= 4) return;
    nick[currentLetterIndex] = letter;
    nick = nick;
    currentLetterIndex++;
  }
  
  function deleteLast() {
    if (currentLetterIndex <= 0) return;
    currentLetterIndex--;
    nick[currentLetterIndex] = '';
    nick = nick;
  }
  
  function savePlayer() {
    players = [...players, {
      id: currentIndex + 1,
      name: nick.join(''),
      avatar: selectedAvatar,
      color: selectedColor,
      position: null,
      score: 0
    }];
    
    if (isLastPlayer) {
      dispatch('complete', { players });
    } else {
      currentIndex++;
      nick = ['', '', '', ''];
      currentLetterIndex = 0;
      selectedAvatar = AVATARS[currentIndex % AVATARS.length];
      selectedColor = PLAYER_COLORS[currentIndex % PLAYER_COLORS.length];
      speak(`Jugador ${currentIndex + 1}. Elige tu avatar, tu color y escribe tu nick.`);
    }
  }
</script>

<div class="screen" bind:this={screenEl} style="align-items: center; padding: 1.5rem;">
  <p style="font-size: 1rem; color: #666;">Jugador</p>
  <p style="font-size: clamp(2.5rem, 8vw, 3.5rem); font-weight: 800; color: var(--text-primary); margin-bottom: 1rem;">{currentIndex + 1} / {totalPlayers}</p>
  
  <div style="width: 100%; max-width: 400px; flex: 1; display: flex; flex-direction: column; gap: 1rem;">
    <!-- Avatar y color -->
    <div style="display: flex; gap: 1rem;">
      <div style="flex: 1;">
        <p style="font-size: 0.8rem; color: #555; margin-bottom: 0.5rem; text-align: center;">Avatar</p>
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.4rem;">
          {#each AVATARS as avatar}
            <button 
              class="avatar-btn"
              class:selected={selectedAvatar === avatar}
              on:click={() => selectedAvatar = avatar}
            >{avatar}</button>
          {/each}
        </div>
      </div>
      <div style="flex: 1;">
        <p style="font-size: 0.8rem; color: #555; margin-bottom: 0.5rem; text-align: center;">Color</p>
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.4rem; justify-items: center;">
          {#each PLAYER_COLORS as color}
            <button 
              class="color-btn"
              class:selected={selectedColor === color}
              style="background: {color};"
              on:click={() => selectedColor = color}
            ></button>
          {/each}
        </div>
      </div>
    </div>
    
    <!-- Nick display -->
    <div>
      <p style="font-size: 0.8rem; color: #555; margin-bottom: 0.5rem; text-align: center;">Nick</p>
      <div style="display: flex; justify-content: center; gap: 0.75rem;">
        {#each nick as letter, i}
          <div class="nick-letter" class:active={i === currentLetterIndex} class:filled={letter !== ''}>
            {letter || '_'}
          </div>
        {/each}
      </div>
    </div>
    
    <!-- Virtual keyboard -->
    <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 0.5rem;">
      {#each KB_ROWS as row}
        <div class="kb-row">
          {#each row as letter}
            <button class="kb-key" on:click={() => pressKey(letter)}>{letter}</button>
          {/each}
        </div>
      {/each}
      <div style="display: flex; justify-content: center; margin-top: 0.25rem;">
        <button class="kb-key kb-key-wide" on:click={deleteLast}>⌫</button>
      </div>
    </div>
  </div>
  
  <p style="font-size: 0.9rem; color: #555; margin-top: 0.5rem;">← Desliza para continuar</p>
</div>

<style>
  .avatar-btn {
    aspect-ratio: 1;
    border-radius: 8px;
    border: 2px solid transparent;
    background: var(--bg-input);
    font-size: 1.4rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s;
  }
  
  .avatar-btn.selected {
    border-color: var(--accent);
  }
  
  .color-btn {
    width: 100%;
    aspect-ratio: 1;
    max-width: 32px;
    border-radius: 50%;
    border: 2px solid transparent;
    cursor: pointer;
    transition: border-color 0.2s;
  }
  
  .color-btn.selected {
    border-color: #ffffff;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PlayerRegistration.svelte
git commit -m "feat: redesign PlayerRegistration with virtual keyboard"
```

---

### Task 10: Create TablePosition Component

**Files:**
- Modify: `src/components/TablePosition.svelte`

**Interfaces:**
- Produces: `dispatch('complete')` event

- [ ] **Step 1: Rewrite TablePosition with mano selection**

```svelte
<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { gameStore } from '../stores/gameState';
  import { speak } from '../lib/voice';
  import { setupSwipe } from '../lib/swipe';
  
  const dispatch = createEventDispatcher();
  let screenEl;
  
  $: players = $gameStore.players;
  $: totalPlayers = players.length;
  $: positionedPlayers = players.filter(p => p.position !== null);
  $: allPositioned = positionedPlayers.length === totalPlayers;
  $: currentPlayer = players.find(p => p.position === null);
  $: manoSelected = players.some(p => p.id === $gameStore.currentRound.mano);
  
  const TABLE_SIZE = 340;
  const TABLE_CENTER = TABLE_SIZE / 2;
  const SEAT_RADIUS = 140;
  
  onMount(() => {
    speak('Jugador 1, toca un asiento para elegir tu sitio.');
    
    return setupSwipe(screenEl, () => {
      if (!allPositioned || !manoSelected) return;
      dispatch('complete');
    }, () => {});
  });
  
  function getSeatPosition(index) {
    const angle = (index / totalPlayers) * 2 * Math.PI - Math.PI / 2;
    const x = TABLE_CENTER + SEAT_RADIUS * Math.cos(angle) - 34;
    const y = TABLE_CENTER + SEAT_RADIUS * Math.sin(angle) - 34;
    return { x, y };
  }
  
  function getPlayerAtPosition(pos) {
    return players.find(p => p.position === pos);
  }
  
  function handleSeatClick(position) {
    if (!currentPlayer) return;
    gameStore.updatePlayer(currentPlayer.id, { position });
    
    if (positionedPlayers.length + 1 >= totalPlayers) {
      setTimeout(() => speak('Todos sentados. Elige quien es la mano.'), 400);
    } else {
      const nextPlayer = players.find(p => p.position === null && p.id !== currentPlayer.id);
      if (nextPlayer) {
        setTimeout(() => speak(`${nextPlayer.name}, elige tu sitio.`), 400);
      }
    }
  }
  
  function selectMano(playerId) {
    gameStore.setMano(playerId);
    const player = players.find(p => p.id === playerId);
    setTimeout(() => speak(`${player.name} es la mano.`), 400);
  }
  
  function randomMano() {
    const randomIndex = Math.floor(Math.random() * totalPlayers);
    selectMano(players[randomIndex].id);
  }
</script>

<div class="screen" bind:this={screenEl} style="align-items: center; padding: 2rem;">
  <p style="font-size: 1.2rem; color: #666; margin-bottom: 0.5rem;">Elige tu sitio</p>
  
  {#if currentPlayer}
    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
      <span style="font-size: 3rem;">{currentPlayer.avatar}</span>
      <span style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary);">{currentPlayer.name}</span>
    </div>
  {/if}
  
  <div style="flex: 1; display: flex; align-items: center; justify-content: center; width: 100%;">
    <div style="position: relative; width: {TABLE_SIZE}px; height: {TABLE_SIZE}px;">
      <!-- Mesa -->
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 140px; height: 140px; background: #333; border-radius: 50%; border: 3px solid #555; display: flex; align-items: center; justify-content: center;">
        {#if manoSelected}
          <span style="font-size: 2rem; color: var(--accent);">↻</span>
        {:else}
          <span style="color: #666; font-size: 0.8rem; letter-spacing: 0.1em;">MESA</span>
        {/if}
      </div>
      
      <!-- Asientos -->
      {#each Array(totalPlayers) as _, i}
        {@const player = getPlayerAtPosition(i)}
        {@const pos = getSeatPosition(i)}
        {@const isMano = player && $gameStore.currentRound.mano === player.id}
        
        <button
          class="seat"
          class:occupied={player}
          class:mano={isMano}
          style="left: {pos.x}px; top: {pos.y}px; {player ? `border-color: ${player.color};` : ''}"
          on:click={() => player ? (allPositioned ? selectMano(player.id) : null) : handleSeatClick(i)}
          disabled={!!player && !allPositioned}
        >
          {#if player}
            <span style="font-size: 1.8rem;">{player.avatar}</span>
            <span style="font-size: 0.55rem; color: #aaa; margin-top: 2px;">{player.name}</span>
          {:else}
            <span style="font-size: 1.5rem; opacity: 0.3;">💺</span>
          {/if}
        </button>
      {/each}
    </div>
  </div>
  
  {#if allPositioned && !manoSelected}
    <button class="random-btn" on:click={randomMano}>🎲 Mano aleatoria</button>
  {/if}
  
  <p style="font-size: 1rem; color: #555; margin-top: 1rem;">← Desliza para continuar</p>
</div>

<style>
  .seat {
    position: absolute;
    width: 68px;
    height: 68px;
    border-radius: 50%;
    border: 3px dashed #555;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s, background 0.2s, border-style 0.2s;
    background: transparent;
    cursor: pointer;
  }
  
  .seat.occupied {
    border-style: solid;
    background: var(--bg-input);
  }
  
  .seat.mano {
    border-width: 4px;
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.5);
    border-color: var(--accent) !important;
  }
  
  .random-btn {
    padding: 1rem 2rem;
    background: var(--bg-input);
    border: 2px solid #555;
    border-radius: 12px;
    color: var(--text-primary);
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 1rem;
    font-family: 'Inter', sans-serif;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TablePosition.svelte
git commit -m "feat: redesign TablePosition with mano selection"
```

---

### Task 11-17: Remaining Components

The remaining components follow the same pattern. Due to length, I'll summarize the tasks:

- **Task 11:** Create RoundSetup component (trump selector, mano indicator)
- **Task 12:** Create BiddingPhase component (bid buttons, validation)
- **Task 13:** Create InGame component (round info, bids summary)
- **Task 14:** Create ResultsEntry component (tricks entry, total validation)
- **Task 15:** Create ScoringPhase component (score table)
- **Task 16:** Create FinalResults component (winner, ranking)
- **Task 17:** Update App.svelte with new navigation flow

---

### Task 18: Update App.svelte Navigation

**Files:**
- Modify: `src/App.svelte`

- [ ] **Step 1: Update App.svelte with new flow**

The App.svelte needs to be updated to:
1. Import all new components
2. Add swipe navigation between screens
3. Add MuteButton and Toast components
4. Handle the new game flow

- [ ] **Step 2: Test full flow**

Run `npm run dev` and test the complete game flow from welcome to final results.

- [ ] **Step 3: Commit**

```bash
git add src/App.svelte
git commit -m "feat: update App with new navigation and game flow"
```

---

## Testing Checklist

- [ ] WelcomeScreen: Tap or swipe to continue
- [ ] GameOptions: Select option, swipe to continue
- [ ] PlayerCount: Scroll to select, swipe to continue
- [ ] PlayerRegistration: Select avatar/color, type nick with virtual keyboard
- [ ] TablePosition: Sit all players, select mano
- [ ] RoundSetup: Select trump, swipe to continue
- [ ] BiddingPhase: All players bid
- [ ] InGame: View round info, swipe to results
- [ ] ResultsEntry: Enter tricks, validate total
- [ ] ScoringPhase: View scores, continue
- [ ] FinalResults: View winner, start new game
- [ ] Voice: Instructions play on each screen
- [ ] Mute: Button toggles voice on/off
- [ ] Swipe: Left=forward, Right=back on all screens
