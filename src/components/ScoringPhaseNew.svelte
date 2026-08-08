<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { gameStore } from '../stores/gameState';
  import { speak } from '../lib/voice';
  import { setupSwipe } from '../lib/swipe';
  import { calculateRoundScores, isPocha } from '../lib/scoring';
  import { ROUNDS, PHASES, getTricksForRound, isSpecialRound, SUITS } from '../lib/constants';

  const dispatch = createEventDispatcher();
  let screenEl;

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
    const tricksInRound = getTricksForRound(round.number);
    const isSpecial = isSpecialRound(round.number);
    
    const adjustedScores = roundScores.map((score, index) => {
      if (isSpecial) {
        return { ...score, roundScore: 0 };
      }
      
      const playerTricks = tricks[index]?.taken || 0;
      const cardsDealt = tricksInRound;
      
      if (isPocha(playerTricks, tricksInRound, cardsDealt)) {
        return { ...score, roundScore: score.roundScore * 2 };
      }
      
      return score;
    });
    
    gameStore.updateScores(adjustedScores);
    
    if (isLastRound) {
      gameStore.setPhase(PHASES.GAME_END);
      dispatch('gameEnd');
    } else {
      gameStore.nextRound();
      dispatch('nextRound');
    }
  }

  onMount(() => {
    speak(`Puntuación ronda ${round.number}.`);
    
    const swipe = setupSwipe(screenEl, () => {
      handleNextRound();
    }, () => {});
    return () => swipe.destroy();
  });
</script>

<div class="screen" bind:this={screenEl}>
  <div class="round-header">
    <span class="round-label">Puntuación</span>
    <span class="round-number">Ronda {round.number}</span>
    <div class="round-meta">
      <span class="trump-suit">{SUITS[round.trump]?.emoji} {SUITS[round.trump]?.name}</span>
    </div>
  </div>

  <div class="score-table">
    <div class="table-header">
      <span class="col-player">Jugador</span>
      <span class="col-bid">Apuesta</span>
      <span class="col-taken">Bazas</span>
      <span class="col-points">Puntos</span>
      <span class="col-total">Total</span>
    </div>
    
    {#each roundScores as score}
      {@const player = players.find(p => p.id === score.playerId)}
      <div class="table-row">
        <span class="col-player">{player.avatar} {player.name}</span>
        <span class="col-bid">{score.bid}</span>
        <span class="col-taken">{score.taken}</span>
        <span class="col-points" class:positive={score.roundScore > 0} class:negative={score.roundScore < 0}>
          {score.roundScore > 0 ? '+' : ''}{score.roundScore}
        </span>
        <span class="col-total">{score.totalScore}</span>
      </div>
    {/each}
  </div>

  <button class="continue-btn" on:click={handleNextRound}>
    {isLastRound ? 'Ver resultado final' : 'Siguiente ronda'}
  </button>

  <p class="swipe-hint">← Desliza para continuar</p>
</div>

<style>
  .screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    gap: 2rem;
    min-height: 100vh;
    min-height: 100dvh;
  }

  .round-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .round-label {
    font-size: 1rem;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .round-number {
    font-size: 2.5rem;
    font-weight: 800;
    color: #f0f0f0;
    line-height: 1;
  }

  .round-meta {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .trump-suit {
    font-size: 1.1rem;
    color: #f59e0b;
    font-weight: 600;
  }

  .score-table {
    width: 100%;
    max-width: 480px;
    background: #22223a;
    border-radius: 16px;
    overflow: hidden;
    border: 2px solid #444;
  }

  .table-header {
    display: flex;
    padding: 0.75rem 1rem;
    background: #2a2a3e;
    border-bottom: 2px solid #444;
    font-size: 0.8rem;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .table-row {
    display: flex;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #333;
    font-size: 0.95rem;
    color: #f0f0f0;
  }

  .table-row:last-child {
    border-bottom: none;
  }

  .col-player {
    flex: 2;
    text-align: left;
  }

  .col-bid,
  .col-taken,
  .col-points,
  .col-total {
    flex: 1;
    text-align: center;
  }

  .col-total {
    font-weight: 700;
  }

  .positive {
    color: #10b981;
  }

  .negative {
    color: #f43f5e;
  }

  .continue-btn {
    background: #f59e0b;
    color: #1e293b;
    border: none;
    border-radius: 12px;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
    max-width: 320px;
  }

  .continue-btn:hover {
    background: #d97706;
  }

  .continue-btn:active {
    transform: scale(0.98);
  }

  .swipe-hint {
    position: fixed;
    bottom: 3rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.9rem;
    color: #555;
    white-space: nowrap;
  }
</style>
