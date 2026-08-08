<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { gameStore } from '../stores/gameState';
  import { speak } from '../lib/voice';
  import { setupSwipe } from '../lib/swipe';
  import { SUITS, PHASES, getTricksForRound } from '../lib/constants';

  const dispatch = createEventDispatcher();

  let screenEl;

  $: round = $gameStore.currentRound;
  $: players = $gameStore.players;
  $: tricksInRound = getTricksForRound(round.number);
  $: bids = round.bids || [];

  $: currentBidderIndex = bids.length;
  $: currentBidder = players[currentBidderIndex];
  $: allBidsPlaced = currentBidderIndex >= players.length;

  $: totalBids = bids.reduce((sum, b) => sum + b.bid, 0);
  $: bidsValid = totalBids !== tricksInRound;

  $: needsRebid = allBidsPlaced && !bidsValid;
  $: rebidder = needsRebid ? players[players.length - 1] : null;

  $: canContinue = allBidsPlaced && bidsValid;

  function placeBid(bid) {
    const newBids = [...bids, { playerId: currentBidder.id, bid }];
    gameStore.setBids(newBids);
  }

  function rebid(bid) {
    const newBids = [...bids.slice(0, -1), { playerId: rebidder.id, bid }];
    gameStore.setBids(newBids);
  }

  function handleFinishBidding() {
    if (canContinue) {
      gameStore.setPhase(PHASES.PLAYING);
      dispatch('biddingComplete');
    }
  }

  function handleSwipeLeft() {
    if (canContinue) {
      handleFinishBidding();
    }
  }

  $: if (currentBidder && !allBidsPlaced) {
    speak(`${currentBidder.name}, ¿cuántas bazas haces?`);
  }

  $: if (needsRebid && rebidder) {
    speak(`${rebidder.name}, elige otra apuesta. El total no puede ser ${tricksInRound}.`);
  }

  onMount(() => {
    speak(`Ronda ${round.number}. Empiezan las apuestas.`);

    const swipe = setupSwipe(screenEl, handleSwipeLeft, () => dispatch('back'));
    return () => swipe.destroy();
  });
</script>

<div class="screen" bind:this={screenEl}>
  <div class="round-info">
    <span class="round-label">Ronda</span>
    <span class="round-number">{round.number}</span>
    <div class="round-meta">
      <span class="trump-suit">{SUITS[round.trump]?.emoji} {SUITS[round.trump]?.name}</span>
      <span class="tricks-count">{tricksInRound} bazas</span>
    </div>
  </div>

  {#if !allBidsPlaced && currentBidder}
    <div class="bidder-section">
      <h3 class="section-title">¿Cuántas bazas haces?</h3>
      <div class="bidder-card">
        <span class="bidder-avatar">{currentBidder.avatar}</span>
        <span class="bidder-name">{currentBidder.name}</span>
      </div>
      <div class="bid-grid">
        {#each Array(tricksInRound + 1) as _, i}
          <button class="bid-btn" on:click={() => placeBid(i)}>
            {i}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  {#if needsRebid && rebidder}
    <div class="bidder-section">
      <div class="error-card">
        <p class="error-text">Total: {totalBids} — No puede ser {tricksInRound}</p>
      </div>
      <h3 class="section-title">{rebidder.name}, elige otra apuesta</h3>
      <div class="bidder-card">
        <span class="bidder-avatar">{rebidder.avatar}</span>
        <span class="bidder-name">{rebidder.name}</span>
      </div>
      <div class="bid-grid">
        {#each Array(tricksInRound + 1) as _, i}
          <button class="bid-btn" on:click={() => rebid(i)}>
            {i}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  {#if bids.length > 0}
    <div class="bids-summary">
      <h3 class="section-title">Apuestas</h3>
      <div class="bids-list">
        {#each bids as bid, index}
          {@const player = players.find(p => p.id === bid.playerId)}
          <div class="bid-row" class:highlight={needsRebid && index === bids.length - 1}>
            <span class="bid-player">{player.avatar} {player.name}</span>
            <span class="bid-value">{bid.bid}</span>
          </div>
        {/each}
      </div>
      {#if allBidsPlaced && !needsRebid}
        <div class="bids-total">
          <span>Total:</span>
          <span class="total-value">{totalBids}</span>
        </div>
      {/if}
    </div>
  {/if}

  {#if canContinue}
    <button class="continue-btn" on:click={handleFinishBidding}>
      Comenzar juego
    </button>
  {/if}
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

  .round-info {
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

  .tricks-count {
    font-size: 1.1rem;
    color: #f43f5e;
    font-weight: 600;
  }

  .bidder-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
    max-width: 360px;
  }

  .section-title {
    font-size: 1rem;
    color: #aaa;
    text-align: center;
  }

  .bidder-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    background: #2a2a3e;
    border: 3px solid #444;
    border-radius: 16px;
    padding: 1.5rem 2rem;
  }

  .bidder-avatar {
    font-size: 3rem;
  }

  .bidder-name {
    font-size: 1.2rem;
    font-weight: 600;
    color: #f0f0f0;
  }

  .bid-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
    gap: 0.75rem;
    width: 100%;
  }

  .bid-btn {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #2a2a3e;
    border: 3px solid #444;
    border-radius: 12px;
    color: #f0f0f0;
    font-size: 1.8rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
  }

  .bid-btn:hover {
    border-color: #f59e0b;
    background: #333;
  }

  .bid-btn:active {
    transform: scale(0.95);
  }

  .error-card {
    background: #3b1525;
    border: 2px solid #f43f5e;
    border-radius: 12px;
    padding: 0.75rem 1.5rem;
    text-align: center;
  }

  .error-text {
    color: #f43f5e;
    font-weight: 700;
    font-size: 1rem;
  }

  .bids-summary {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    max-width: 320px;
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

  .bid-row.highlight {
    border: 2px solid #f43f5e;
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

  .bids-total {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding-top: 0.75rem;
    border-top: 2px solid #444;
    color: #aaa;
    font-size: 1rem;
  }

  .total-value {
    color: #f0f0f0;
    font-weight: 700;
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
</style>
