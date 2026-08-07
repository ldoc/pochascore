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
