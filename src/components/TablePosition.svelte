<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { gameStore } from '../stores/gameState';
  import { speak } from '../lib/voice';
  import { setupSwipe } from '../lib/swipe';
  
  const dispatch = createEventDispatcher();
  
  let screenEl;
  let phase = 'seating';
  let selectedMano = null;
  
  $: players = $gameStore.players;
  $: totalPlayers = players.length;
  $: positionedPlayers = players.filter(p => p.position !== null);
  $: allPositioned = positionedPlayers.length === totalPlayers;
  $: currentPlayer = players.find(p => p.position === null);
  
  function getPlayerAtPosition(pos) {
    return players.find(p => p.position === pos);
  }
  
  function handleSeatClick(position) {
    if (phase !== 'seating') return;
    const existing = getPlayerAtPosition(position);
    if (existing) return;
    if (!currentPlayer) return;
    
    gameStore.updatePlayer(currentPlayer.id, { position });
    
    if (allPositioned) {
      speak('Todos sentados. Selecciona la mano');
    } else {
      const next = players.find(p => p.position === null);
      if (next) speak(`${next.name}, elige tu asiento`);
    }
  }
  
  function handlePlayerClick(player) {
    if (phase !== 'mano') return;
    selectedMano = player.id;
    gameStore.setMano(player.id);
    speak(`${player.name} es la mano`);
  }
  
  function handleRandomMano() {
    const randomIndex = Math.floor(Math.random() * totalPlayers);
    const player = players[randomIndex];
    selectedMano = player.id;
    gameStore.setMano(player.id);
    speak(`${player.name} es la mano aleatoria`);
  }
  
  function handleSwipeLeft() {
    if (allPositioned && selectedMano !== null) {
      dispatch('complete');
    }
  }
  
  $: if (allPositioned && phase === 'seating') {
    phase = 'mano';
  }
  
  onMount(() => {
    speak('Elige tu sitio. Toca un asiento vacío');
    
    const swipe = setupSwipe(screenEl, handleSwipeLeft, () => {});
    return () => swipe.destroy();
  });
  
  function getPositionStyle(index) {
    const angle = (index / totalPlayers) * 360 - 90;
    const radius = 40;
    const x = 50 + radius * Math.cos(angle * Math.PI / 180);
    const y = 50 + radius * Math.sin(angle * Math.PI / 180);
    return `left: ${x}%; top: ${y}%; transform: translate(-50%, -50%)`;
  }
</script>

<div class="screen" bind:this={screenEl}>
  <h2 class="title">Elige tu sitio</h2>
  
  {#if currentPlayer}
    <div class="current-player">
      <span class="avatar-large">{currentPlayer.avatar}</span>
      <span class="player-name">{currentPlayer.name}</span>
    </div>
  {/if}
  
  <div class="table-container">
    <div class="table-circle">
      {#if phase === 'mano'}
        <span class="clockwise-arrow">↻</span>
      {:else}
        <span class="table-label">MESA</span>
      {/if}
    </div>
    
    {#each Array(totalPlayers) as _, i}
      {@const player = getPlayerAtPosition(i)}
      <button 
        class="seat"
        class:occupied={player}
        class:mano={player && selectedMano === player.id}
        style={getPositionStyle(i)}
        style:border-color={player ? player.color : ''}
        on:click={() => player ? handlePlayerClick(player) : handleSeatClick(i)}
        disabled={!player && (!currentPlayer || phase !== 'seating')}
      >
        {#if player}
          <span class="seat-avatar">{player.avatar}</span>
          <span class="seat-name">{player.name}</span>
        {:else}
          <span class="seat-empty">💺</span>
        {/if}
      </button>
    {/each}
  </div>
  
  {#if phase === 'mano'}
    <button class="random-btn" on:click={handleRandomMano}>
      🎲 Mano aleatoria
    </button>
  {/if}
</div>

<style>
  .screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    gap: 16px;
    min-height: 100vh;
  }
  
  .title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #f8fafc;
  }
  
  .current-player {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .avatar-large {
    font-size: 3rem;
  }
  
  .player-name {
    font-size: 1.2rem;
    font-weight: 600;
    color: #f8fafc;
  }
  
  .table-container {
    position: relative;
    width: 280px;
    height: 280px;
  }
  
  .table-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 140px;
    height: 140px;
    background: #333;
    border: 3px solid #555;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .table-label {
    color: #94a3b8;
    font-size: 0.75rem;
    letter-spacing: 0.1em;
  }
  
  .clockwise-arrow {
    font-size: 2.5rem;
    color: #f59e0b;
  }
  
  .seat {
    position: absolute;
    width: 68px;
    height: 68px;
    border-radius: 50%;
    border: 2px dashed #555;
    background: #1e293b;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .seat:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .seat.occupied {
    border-style: solid;
    border-width: 3px;
  }
  
  .seat.mano {
    border-color: #f59e0b !important;
    box-shadow: 0 0 12px rgba(245, 158, 11, 0.6);
  }
  
  .seat-avatar {
    font-size: 1.5rem;
  }
  
  .seat-name {
    font-size: 0.6rem;
    color: #94a3b8;
    margin-top: 2px;
  }
  
  .seat-empty {
    font-size: 1.2rem;
    opacity: 0.3;
  }
  
  .random-btn {
    margin-top: 16px;
    padding: 12px 24px;
    background: #334155;
    border: 2px solid #f59e0b;
    border-radius: 12px;
    color: #f8fafc;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .random-btn:active {
    background: #475569;
  }
</style>
