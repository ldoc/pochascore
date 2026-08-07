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