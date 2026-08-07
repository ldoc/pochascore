<script>
  import { createEventDispatcher } from 'svelte';
  import { gameStore } from '../stores/gameState';
  import { calculateRoundScores } from '../lib/scoring';
  import { ROUNDS } from '../lib/constants';
  
  const dispatch = createEventDispatcher();
  
  $: round = $gameStore.currentRound;
  $: players = $gameStore.players;
  $: bids = round.bids || [];
  $: tricks = round.tricks || [];
  
  $: roundScores = calculateRoundScores(
    players.map(p => ({ ...p, score: p.score })),
    bids.map(b => b.bid),
    tricks.map(t => t.taken)
  );
  
  $: isLastRound = round.number >= ROUNDS.length;
  
  function handleNextRound() {
    gameStore.updateScores(roundScores);
    
    if (isLastRound) {
      gameStore.setPhase('gameEnd');
      dispatch('gameEnd');
    } else {
      gameStore.nextRound();
      dispatch('nextRound');
    }
  }
</script>

<div class="scoring">
  <h2>Puntuación Ronda {round.number}</h2>
  
  <div class="scores-table">
    <div class="table-header">
      <span>Jugador</span>
      <span>Apuesta</span>
      <span>Bazas</span>
      <span>Puntos</span>
      <span>Total</span>
    </div>
    
    {#each roundScores as score}
      {@const player = players.find(p => p.id === score.playerId)}
      <div class="table-row" class:positive={score.roundScore > 0} class:negative={score.roundScore < 0}>
        <span class="player">{player.avatar} {player.name}</span>
        <span>{score.bid}</span>
        <span>{score.taken}</span>
        <span class="round-score">{score.roundScore > 0 ? '+' : ''}{score.roundScore}</span>
        <span class="total-score">{score.totalScore}</span>
      </div>
    {/each}
  </div>
  
  <button class="primary" on:click={handleNextRound}>
    {isLastRound ? 'Ver resultado final' : 'Siguiente ronda'}
  </button>
</div>

<style>
  .scoring {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
    gap: 2rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  .scores-table {
    width: 100%;
    max-width: 500px;
    background: #16213e;
    border-radius: 12px;
    overflow: hidden;
  }
  
  .table-header, .table-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
    padding: 0.75rem 1rem;
    text-align: center;
  }
  
  .table-header {
    background: #0f3460;
    font-weight: bold;
    font-size: 0.85rem;
    color: #a0a0a0;
  }
  
  .table-row {
    border-bottom: 1px solid #0f3460;
  }
  
  .table-row:last-child {
    border-bottom: none;
  }
  
  .player {
    text-align: left;
  }
  
  .round-score {
    font-weight: bold;
  }
  
  .positive .round-score {
    color: #4ECDC4;
  }
  
  .negative .round-score {
    color: #e94560;
  }
  
  .total-score {
    font-weight: bold;
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
