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

<div class="round-setup">
  <div class="round-header">
    <h2>Ronda {round.number}</h2>
    <p class="tricks">{tricksInRound} bazas</p>
  </div>
  
  <div class="section">
    <h3>Triunfo</h3>
    <div class="suit-selector">
      {#each Object.entries(SUITS) as [key, suit]}
        <button 
          class="suit-btn"
          class:selected={round.trump === key}
          style="border-color: {suit.color}"
          on:click={() => gameStore.setTrump(key)}
        >
          <span class="suit-emoji">{suit.emoji}</span>
          <span class="suit-name">{suit.name}</span>
        </button>
      {/each}
    </div>
  </div>
  
  <div class="section">
    <h3>Mano</h3>
    <div class="mano-selector">
      {#each players as player}
        <button 
          class="mano-btn"
          class:selected={round.mano === player.id}
          on:click={() => gameStore.setMano(player.id)}
        >
          <span class="player-avatar">{player.avatar}</span>
          <span class="player-name">{player.name}</span>
        </button>
      {/each}
    </div>
  </div>
  
  <button class="primary" on:click={handleStartRound} disabled={!canStart}>
    Empezar apuestas
  </button>
</div>

<style>
  .round-setup {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
    gap: 2rem;
  }
  
  .round-header {
    text-align: center;
  }
  
  h2 {
    font-size: 1.8rem;
    margin-bottom: 0.25rem;
  }
  
  .tricks {
    font-size: 1.2rem;
    color: #e94560;
  }
  
  .section {
    width: 100%;
    max-width: 400px;
  }
  
  h3 {
    font-size: 1rem;
    color: #a0a0a0;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .suit-selector {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .suit-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    background: #16213e;
    border: 2px solid #0f3460;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .suit-btn.selected {
    background: #0f3460;
    border-color: #e94560;
  }
  
  .suit-emoji {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .suit-name {
    font-size: 0.9rem;
  }
  
  .mano-selector {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
  }
  
  .mano-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.75rem 1rem;
    background: #16213e;
    border: 2px solid #0f3460;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .mano-btn.selected {
    background: #0f3460;
    border-color: #e94560;
  }
  
  .player-avatar {
    font-size: 1.5rem;
    margin-bottom: 0.25rem;
  }
  
  .player-name {
    font-size: 0.8rem;
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
  
  .primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>