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
