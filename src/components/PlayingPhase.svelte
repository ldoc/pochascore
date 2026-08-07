<script>
  import { createEventDispatcher } from 'svelte';
  import { gameStore } from '../stores/gameState';
  import { ROUNDS, SUITS } from '../lib/constants';
  
  const dispatch = createEventDispatcher();
  
  $: round = $gameStore.currentRound;
  $: players = $gameStore.players;
  $: tricksInRound = ROUNDS[round.number - 1];
  $: tricks = round.tricks || [];
  
  $: currentPlayerIndex = tricks.length;
  $: currentPlayer = players[currentPlayerIndex];
  $: allTricksCounted = currentPlayerIndex >= players.length;
  
  function countTricks(taken) {
    const newTricks = [...tricks, { playerId: currentPlayer.id, taken }];
    gameStore.setTricks(newTricks);
  }
  
  function handleFinishRound() {
    gameStore.setPhase('scoring');
    dispatch('playingComplete');
  }
</script>

<div class="playing">
  <div class="header">
    <h2>Fase de juego</h2>
    <div class="round-info">
      <span class="trump">{SUITS[round.trump]?.emoji} {SUITS[round.trump]?.name}</span>
      <span class="mano">Mano: {players.find(p => p.id === round.mano)?.name}</span>
    </div>
    <p class="tricks">Bazas: {tricksInRound}</p>
  </div>
  
  {#if !allTricksCounted}
    <div class="counter">
      <h3>¿Cuántas bazas has hecho?</h3>
      <div class="current-player">
        <span class="avatar">{currentPlayer.avatar}</span>
        <span class="name">{currentPlayer.name}</span>
      </div>
      
      <div class="trick-buttons">
        {#each Array(tricksInRound + 1) as _, i}
          <button class="trick-btn" on:click={() => countTricks(i)}>
            {i}
          </button>
        {/each}
      </div>
    </div>
  {/if}
  
  <div class="tricks-summary">
    <h3>Bazas contadas</h3>
    <div class="tricks-list">
      {#each tricks as trick}
        {@const player = players.find(p => p.id === trick.playerId)}
        <div class="trick-item">
          <span>{player.avatar} {player.name}</span>
          <span class="trick-value">{trick.taken}</span>
        </div>
      {/each}
    </div>
    
    {#if allTricksCounted}
      {@const totalTricks = tricks.reduce((sum, t) => sum + t.taken, 0)}
      <div class="total" class:invalid={totalTricks !== tricksInRound}>
        <span>Total bazas:</span>
        <span>{totalTricks}</span>
        {#if totalTricks !== tricksInRound}
          <span class="error">Debe ser {tricksInRound}</span>
        {/if}
      </div>
    {/if}
  </div>
  
  {#if allTricksCounted}
    <button class="primary" on:click={handleFinishRound}>
      Calcular puntos
    </button>
  {/if}
</div>

<style>
  .playing {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
    gap: 1.5rem;
  }
  
  .header {
    text-align: center;
  }
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  .round-info {
    display: flex;
    gap: 1rem;
    justify-content: center;
    font-size: 0.9rem;
  }
  
  .trump {
    color: #FFD700;
  }
  
  .mano {
    color: #a0a0a0;
  }
  
  .tricks {
    color: #e94560;
    font-size: 1.1rem;
    margin-top: 0.5rem;
  }
  
  .counter {
    text-align: center;
    width: 100%;
    max-width: 400px;
  }
  
  h3 {
    font-size: 1rem;
    color: #a0a0a0;
    margin-bottom: 1rem;
  }
  
  .current-player {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .avatar {
    font-size: 2rem;
  }
  
  .name {
    font-size: 1.2rem;
    font-weight: bold;
  }
  
  .trick-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }
  
  .trick-btn {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
    border: none;
    border-radius: 8px;
    background: #16213e;
    color: white;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .trick-btn:hover {
    background: #0f3460;
  }
  
  .tricks-summary {
    width: 100%;
    max-width: 400px;
    background: #16213e;
    border-radius: 12px;
    padding: 1rem;
  }
  
  .tricks-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .trick-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    background: #1a1a2e;
    border-radius: 8px;
  }
  
  .trick-value {
    font-weight: bold;
    color: #e94560;
  }
  
  .total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #0f3460;
    font-weight: bold;
  }
  
  .total.invalid {
    color: #e94560;
  }
  
  .error {
    font-size: 0.8rem;
    color: #e94560;
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
    margin-top: auto;
  }
</style>
