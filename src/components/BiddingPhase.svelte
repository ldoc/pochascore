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

<div class="panel">
  <div class="panel-header">
    <h2 class="text-lg font-bold text-bone text-center">Ronda {round.number}</h2>
    <div class="flex justify-center gap-4 mt-1 text-sm">
      <span class="text-gold">{SUITS[round.trump]?.emoji} {SUITS[round.trump]?.name}</span>
      <span class="text-gray-light">Mano: {players.find(p => p.id === round.mano)?.name}</span>
    </div>
    <p class="text-rose text-sm text-center mt-1">Bazas: {tricksInRound}</p>
  </div>
  
  <div class="panel-content flex flex-col gap-4 animate-fade-in">
    {#if !allBidsPlaced}
      <div class="w-full max-w-sm mx-auto text-center">
        <h3 class="text-gray-light text-sm mb-3">¿Cuántas bazas haces?</h3>
        <div class="flex items-center justify-center gap-3 mb-4">
          <span class="avatar-large">{currentBidder.avatar}</span>
          <span class="text-xl font-bold text-bone">{currentBidder.name}</span>
        </div>
        
        <div class="flex flex-wrap justify-center gap-2">
          {#each Array(tricksInRound + 1) as _, i}
            <button class="bid-btn" on:click={() => placeBid(i)}>
              {i}
            </button>
          {/each}
        </div>
      </div>
    {/if}
    
    <div class="card w-full max-w-sm mx-auto">
      <h3 class="text-gray-light text-sm mb-3">Apuestas</h3>
      <div class="flex flex-col gap-2">
        {#each bids as bid}
          {@const player = players.find(p => p.id === bid.playerId)}
          <div class="list-item">
            <span class="text-bone">{player.avatar} {player.name}</span>
            <span class="list-item-value">{bid.bid}</span>
          </div>
        {/each}
      </div>
      
      {#if allBidsPlaced}
        <div class="flex justify-between items-center mt-3 pt-3 border-t border-border">
          <span class="text-gray-light">Total:</span>
          <span class="font-bold" class:text-rose={!bidsValid} class:text-bone={bidsValid}>{totalBids}</span>
        </div>
        {#if !bidsValid}
          <p class="error-text mt-2 text-center">No puede ser {tricksInRound}</p>
        {/if}
      {/if}
    </div>
  </div>
  
  {#if allBidsPlaced && bidsValid}
    <div class="panel-footer animate-slide-up">
      <button class="btn-primary" on:click={handleFinishBidding}>
        Comenzar juego
      </button>
    </div>
  {/if}
</div>
