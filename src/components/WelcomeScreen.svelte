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
