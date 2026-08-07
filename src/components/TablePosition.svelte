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
