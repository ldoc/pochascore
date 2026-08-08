<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { gameStore } from '../stores/gameState';
  import { speak } from '../lib/voice';
  import { setupSwipe } from '../lib/swipe';
  import { SUITS, getTricksForRound } from '../lib/constants';

  const dispatch = createEventDispatcher();
  let screenEl;

  $: round = $gameStore.currentRound;
  $: players = $gameStore.players;
  $: tricksInRound = getTricksForRound(round.number);
  $: bids = round.bids || [];

  onMount(() => {
    speak(`Ronda ${round.number}. ${SUITS[round.trump]?.name}, ${tricksInRound} bazas. ¡A jugar!`);
    
    const swipe = setupSwipe(screenEl, () => {
      dispatch('complete');
    }, () => {});
    return () => swipe.destroy();
  });
</script>

<div class="screen" bind:this={screenEl}>
  <div class="round-header">
    <span class="round-label">Ronda</span>
    <span class="round-number">{round.number}</span>
  </div>

  <div class="trump-card">
    <span class="trump-emoji">{SUITS[round.trump]?.emoji}</span>
    <span class="trump-name">{SUITS[round.trump]?.name}</span>
    <span class="tricks-info">{tricksInRound} bazas</span>
  </div>

  <div class="bids-section">
    <h3 class="section-title">Apuestas</h3>
    <div class="bids-list">
      {#each bids as bid}
        {@const player = players.find(p => p.id === bid.playerId)}
        <div class="bid-row">
          <span class="bid-player">{player.avatar} {player.name}</span>
          <span class="bid-value">{bid.bid}</span>
        </div>
      {/each}
    </div>
  </div>

  <p class="play-text">¡A jugar!</p>

  <p class="swipe-hint">← Desliza para resultados</p>
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
    font-size: 5rem;
    font-weight: 800;
    color: #f0f0f0;
    line-height: 1;
  }

  .trump-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    background: #22223a;
    border: 3px solid #444;
    border-radius: 20px;
    padding: 2rem 3rem;
  }

  .trump-emoji {
    font-size: 4rem;
  }

  .trump-name {
    font-size: 1.3rem;
    font-weight: 700;
    color: #f59e0b;
  }

  .tricks-info {
    font-size: 1.1rem;
    color: #f43f5e;
    font-weight: 600;
  }

  .bids-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    max-width: 320px;
  }

  .section-title {
    font-size: 1rem;
    color: #aaa;
    text-align: center;
  }

  .bids-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  .bid-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #2a2a3e;
    border-radius: 10px;
    padding: 0.75rem 1rem;
  }

  .bid-player {
    color: #f0f0f0;
    font-size: 1rem;
  }

  .bid-value {
    color: #f59e0b;
    font-weight: 700;
    font-size: 1.2rem;
  }

  .play-text {
    font-size: 1.5rem;
    font-weight: 700;
    color: #f59e0b;
    text-align: center;
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
