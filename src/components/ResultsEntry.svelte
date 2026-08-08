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
  $: tricks = round.tricks || [];

  $: currentPlayerIndex = tricks.length;
  $: currentPlayer = players[currentPlayerIndex];
  $: allTricksCounted = currentPlayerIndex >= players.length;

  $: totalTricks = tricks.reduce((sum, t) => sum + t.taken, 0);
  $: tricksValid = totalTricks === tricksInRound;

  $: needsRecount = allTricksCounted && !tricksValid;
  $: recounter = needsRecount ? players[players.length - 1] : null;

  $: canContinue = allTricksCounted && tricksValid;

  function countTricks(taken) {
    const newTricks = [...tricks, { playerId: currentPlayer.id, taken }];
    gameStore.setTricks(newTricks);
  }

  function recount(taken) {
    const newTricks = [...tricks.slice(0, -1), { playerId: recounter.id, taken }];
    gameStore.setTricks(newTricks);
  }

  function handleFinishRound() {
    if (canContinue) {
      gameStore.setPhase(PHASES.SCORING);
      dispatch('complete');
    }
  }

  $: if (currentPlayer && !allTricksCounted) {
    speak(`${currentPlayer.name}, ¿cuántas bazas has hecho?`);
  }

  $: if (needsRecount && recounter) {
    speak(`${recounter.name}, elige otra cantidad. El total debe ser ${tricksInRound}.`);
  }

  onMount(() => {
    speak(`Ronda ${round.number}. A contar bazas.`);
    
    const swipe = setupSwipe(screenEl, () => {
      if (canContinue) handleFinishRound();
    }, () => {});
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

  {#if !allTricksCounted && currentPlayer}
    <div class="tricks-section">
      <h3 class="section-title">¿Cuántas bazas has hecho?</h3>
      <div class="player-card">
        <span class="player-avatar">{currentPlayer.avatar}</span>
        <span class="player-name">{currentPlayer.name}</span>
      </div>
      <div class="tricks-grid">
        {#each Array(tricksInRound + 1) as _, i}
          <button class="trick-btn" on:click={() => countTricks(i)}>
            {i}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  {#if needsRecount && recounter}
    <div class="tricks-section">
      <div class="error-card">
        <p class="error-text">Total: {totalTricks} — Debe ser {tricksInRound}</p>
      </div>
      <h3 class="section-title">{recounter.name}, elige otra cantidad</h3>
      <div class="player-card">
        <span class="player-avatar">{recounter.avatar}</span>
        <span class="player-name">{recounter.name}</span>
      </div>
      <div class="tricks-grid">
        {#each Array(tricksInRound + 1) as _, i}
          <button class="trick-btn" on:click={() => recount(i)}>
            {i}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  {#if tricks.length > 0}
    <div class="tricks-summary">
      <h3 class="section-title">Bazas contadas</h3>
      <div class="tricks-list">
        {#each tricks as trick, index}
          {@const player = players.find(p => p.id === trick.playerId)}
          <div class="trick-row" class:highlight={needsRecount && index === tricks.length - 1}>
            <span class="trick-player">{player.avatar} {player.name}</span>
            <span class="trick-value">{trick.taken}</span>
          </div>
        {/each}
      </div>
      {#if allTricksCounted && !needsRecount}
        <div class="tricks-total">
          <span>Total:</span>
          <span class="total-value">{totalTricks}</span>
        </div>
      {/if}
    </div>
  {/if}

  {#if canContinue}
    <button class="continue-btn" on:click={handleFinishRound}>
      Calcular puntos
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

  .tricks-section {
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

  .player-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    background: #2a2a3e;
    border: 3px solid #444;
    border-radius: 16px;
    padding: 1.5rem 2rem;
  }

  .player-avatar {
    font-size: 3rem;
  }

  .player-name {
    font-size: 1.2rem;
    font-weight: 600;
    color: #f0f0f0;
  }

  .tricks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
    gap: 0.75rem;
    width: 100%;
  }

  .trick-btn {
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

  .trick-btn:hover {
    border-color: #f59e0b;
    background: #333;
  }

  .trick-btn:active {
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

  .tricks-summary {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    max-width: 320px;
  }

  .tricks-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  .trick-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #2a2a3e;
    border-radius: 10px;
    padding: 0.75rem 1rem;
  }

  .trick-row.highlight {
    border: 2px solid #f43f5e;
  }

  .trick-player {
    color: #f0f0f0;
    font-size: 1rem;
  }

  .trick-value {
    color: #f59e0b;
    font-weight: 700;
    font-size: 1.2rem;
  }

  .tricks-total {
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
