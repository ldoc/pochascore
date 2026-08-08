<script>
  import { createEventDispatcher } from 'svelte';
  import { gameStore } from '../stores/gameState';
  import { calculateRoundScores, isPocha } from '../lib/scoring';
  import { ROUNDS, PHASES, getTricksForRound, isSpecialRound } from '../lib/constants';
  
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
</script>

<div class="panel">
  <div class="panel-header">
    <h2 class="text-lg font-bold text-bone text-center">Puntuación Ronda {round.number}</h2>
  </div>
  
  <div class="panel-content flex flex-col gap-4 animate-fade-in">
    <div class="card w-full max-w-md mx-auto overflow-hidden p-0">
      <div class="score-table">
        <div class="score-table-header flex">
          <span class="flex-1">Jugador</span>
          <span class="w-12">Apuesta</span>
          <span class="w-12">Bazas</span>
          <span class="w-14">Puntos</span>
          <span class="w-12">Total</span>
        </div>
        
        {#each roundScores as score}
          {@const player = players.find(p => p.id === score.playerId)}
          <div class="score-table-row flex">
            <span class="flex-1 text-left text-bone">{player.avatar} {player.name}</span>
            <span class="w-12 text-bone">{score.bid}</span>
            <span class="w-12 text-bone">{score.taken}</span>
            <span class="w-14 score-positive" class:score-negative={score.roundScore < 0}>
              {score.roundScore > 0 ? '+' : ''}{score.roundScore}
            </span>
            <span class="w-12 font-bold text-bone">{score.totalScore}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
  
  <div class="panel-footer">
    <button class="btn-primary" on:click={handleNextRound}>
      {isLastRound ? 'Ver resultado final' : 'Siguiente ronda'}
    </button>
  </div>
</div>
