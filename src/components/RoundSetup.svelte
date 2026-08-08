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
  $: manoPlayer = players.find(p => p.id === round.mano);
  $: canContinue = round.trump !== null;

  $: tricksLabel = tricksInRound === 1 ? '1 baza' : `${tricksInRound} bazas`;

  function handleSwipeLeft() {
    if (canContinue) {
      gameStore.setPhase(PHASES.BIDDING);
      dispatch('roundStarted');
    }
  }

  onMount(() => {
    const manoName = manoPlayer ? manoPlayer.name : 'Jugador';
    speak(`Ronda ${round.number}. ${manoName}, tú repartes. Elige triunfo.`);

    const swipe = setupSwipe(screenEl, handleSwipeLeft, () => dispatch('back'));
    return () => swipe.destroy();
  });
</script>

<div class="screen" bind:this={screenEl}>
  <div class="round-info">
    <span class="round-label">Ronda</span>
    <span class="round-number">{round.number}</span>
    <span class="tricks-count">{tricksLabel}</span>
  </div>

  {#if manoPlayer}
    <div class="mano-card">
      <span class="mano-avatar">{manoPlayer.avatar}</span>
      <span class="mano-name">{manoPlayer.name}</span>
      <span class="mano-role">Tú repartes</span>
    </div>
  {/if}

  <div class="trump-section">
    <h3 class="section-title">Elige triunfo</h3>
    <div class="suit-grid">
      {#each Object.entries(SUITS) as [key, suit]}
        <button
          class="suit-btn"
          class:selected={round.trump === key}
          on:click={() => gameStore.setTrump(key)}
        >
          <span class="suit-emoji">{suit.emoji}</span>
          <span class="suit-name">{suit.name}</span>
        </button>
      {/each}
    </div>
  </div>
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

  .tricks-count {
    font-size: 1.2rem;
    color: #f59e0b;
    font-weight: 600;
  }

  .mano-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    background: #2a2a3e;
    border: 3px solid #444;
    border-radius: 16px;
    padding: 1.5rem 2rem;
  }

  .mano-avatar {
    font-size: 3rem;
  }

  .mano-name {
    font-size: 1.2rem;
    font-weight: 600;
    color: #f0f0f0;
  }

  .mano-role {
    font-size: 0.9rem;
    color: #f59e0b;
  }

  .trump-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
    max-width: 320px;
  }

  .section-title {
    font-size: 1rem;
    color: #aaa;
    text-align: center;
  }

  .suit-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    width: 100%;
  }

  .suit-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    background: #2a2a3e;
    border: 3px solid #444;
    border-radius: 16px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .suit-btn.selected {
    border-color: #f59e0b;
    background: #333;
  }

  .suit-emoji {
    font-size: 3rem;
  }

  .suit-name {
    font-size: 1rem;
    color: #f0f0f0;
    font-weight: 600;
  }
</style>
