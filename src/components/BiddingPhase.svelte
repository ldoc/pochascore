<script>
  import { createEventDispatcher } from 'svelte';
  import { gameStore } from '../stores/gameState';
  import { SUITS, PHASES, getTricksForRound } from '../lib/constants';
  
  const dispatch = createEventDispatcher();
  
  $: round = $gameStore.currentRound;
  $: players = $gameStore.players;
  $: tricksInRound = getTricksForRound(round.number);
  $: bids = round.bids || [];
  
  $: currentBidderIndex = bids.length;
  $: currentBidder = players[currentBidderIndex];
  $: allBidsPlaced = currentBidderIndex >= players.length;
  
  $: totalBids = bids.reduce((sum, b) => sum + b.bid, 0);
  $: bidsValid = totalBids !== tricksInRound;
  
  function placeBid(bid) {
    const newBids = [...bids, { playerId: currentBidder.id, bid }];
    gameStore.setBids(newBids);
  }
  
  function handleFinishBidding() {
    if (bidsValid) {
      gameStore.setPhase(PHASES.PLAYING);
      dispatch('biddingComplete');
    }
  }
</script>

<div class="bidding">
  <div class="header">
    <h2>Ronda {round.number}</h2>
    <p class="info">Triunfo: {SUITS[round.trump]?.name || 'Ninguno'} | Mano: {players.find(p => p.id === round.mano)?.name}</p>
    <p class="tricks">Bazas: {tricksInRound}</p>
  </div>
  
  {#if !allBidsPlaced}
    <div class="bidder">
      <h3>¿Cuántas bazas haces?</h3>
      <div class="current-player">
        <span class="avatar">{currentBidder.avatar}</span>
        <span class="name">{currentBidder.name}</span>
      </div>
      
      <div class="bid-buttons">
        {#each Array(tricksInRound + 1) as _, i}
          <button class="bid-btn" on:click={() => placeBid(i)}>
            {i}
          </button>
        {/each}
      </div>
    </div>
  {/if}
  
  <div class="bids-summary">
    <h3>Apuestas</h3>
    <div class="bids-list">
      {#each bids as bid}
        {@const player = players.find(p => p.id === bid.playerId)}
        <div class="bid-item">
          <span>{player.avatar} {player.name}</span>
          <span class="bid-value">{bid.bid}</span>
        </div>
      {/each}
    </div>
    
    {#if allBidsPlaced}
      <div class="total" class:invalid={!bidsValid}>
        <span>Total:</span>
        <span>{totalBids}</span>
        {#if !bidsValid}
          <span class="error">No puede ser {tricksInRound}</span>
        {/if}
      </div>
    {/if}
  </div>
  
  {#if allBidsPlaced && bidsValid}
    <button class="primary" on:click={handleFinishBidding}>
      Comenzar juego
    </button>
  {/if}
</div>

<style>
  .bidding {
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
  
  .info {
    color: #a0a0a0;
    font-size: 0.9rem;
  }
  
  .tricks {
    color: #e94560;
    font-size: 1.1rem;
    margin-top: 0.5rem;
  }
  
  .bidder {
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
  
  .bid-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }
  
  .bid-btn {
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
  
  .bid-btn:hover {
    background: #0f3460;
  }
  
  .bids-summary {
    width: 100%;
    max-width: 400px;
    background: #16213e;
    border-radius: 12px;
    padding: 1rem;
  }
  
  .bids-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .bid-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    background: #1a1a2e;
    border-radius: 8px;
  }
  
  .bid-value {
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
