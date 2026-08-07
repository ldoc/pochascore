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

<div class="scoreboard">
  <h1>🏆 Resultado Final</h1>
  
  <div class="winner">
    <span class="winner-avatar">{winner.avatar}</span>
    <span class="winner-name">{winner.name}</span>
    <span class="winner-score">{winner.score} puntos</span>
  </div>
  
  <div class="final-scores">
    {#each sortedPlayers as player, i}
      <div class="player-row" class:gold={i === 0} class:silver={i === 1} class:bronze={i === 2}>
        <span class="position">{i + 1}º</span>
        <span class="player-avatar">{player.avatar}</span>
        <span class="player-name">{player.name}</span>
        <span class="player-score">{player.score}</span>
      </div>
    {/each}
  </div>
  
  <button class="primary" on:click={handleNewGame}>
    Nueva partida
  </button>
</div>

<style>
  .scoreboard {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
    gap: 2rem;
  }
  
  h1 {
    font-size: 1.8rem;
  }
  
  .winner {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    background: linear-gradient(135deg, #FFD700, #FFA500);
    border-radius: 16px;
    text-align: center;
  }
  
  .winner-avatar {
    font-size: 4rem;
  }
  
  .winner-name {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0.5rem 0;
  }
  
  .winner-score {
    font-size: 1.2rem;
    color: #1a1a2e;
  }
  
  .final-scores {
    width: 100%;
    max-width: 400px;
    background: #16213e;
    border-radius: 12px;
    overflow: hidden;
  }
  
  .player-row {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #0f3460;
    gap: 1rem;
  }
  
  .player-row:last-child {
    border-bottom: none;
  }
  
  .position {
    font-weight: bold;
    min-width: 30px;
  }
  
  .player-avatar {
    font-size: 1.5rem;
  }
  
  .player-name {
    flex: 1;
  }
  
  .player-score {
    font-weight: bold;
    color: #e94560;
  }
  
  .gold {
    background: rgba(255, 215, 0, 0.1);
  }
  
  .silver {
    background: rgba(192, 192, 192, 0.1);
  }
  
  .bronze {
    background: rgba(205, 127, 50, 0.1);
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