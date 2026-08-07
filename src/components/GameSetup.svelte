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