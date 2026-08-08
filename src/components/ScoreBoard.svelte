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
