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
