<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { gameStore } from '../stores/gameState';
  import { speak } from '../lib/voice';
  import { setupSwipe } from '../lib/swipe';

  const dispatch = createEventDispatcher();
  let screenEl;

  $: players = $gameStore.players;
  $: sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  $: winner = sortedPlayers[0];

  function handleNewGame() {
    gameStore.reset();
    dispatch('newGame');
  }

  onMount(() => {
    speak(`¡Partida terminada! ${winner.name} ha ganado con ${winner.score} puntos.`);
    
    const swipe = setupSwipe(screenEl, () => {
      handleNewGame();
    }, () => {});
    return () => swipe.destroy();
  });
</script>

<div class="screen" bind:this={screenEl}>
  <div class="winner-section">
    <span class="trophy">🏆</span>
    <h1 class="winner-title">¡Ganador!</h1>
    <div class="winner-card">
      <span class="winner-avatar">{winner.avatar}</span>
      <span class="winner-name">{winner.name}</span>
      <span class="winner-score">{winner.score} puntos</span>
    </div>
  </div>

  <div class="ranking-section">
    <h2 class="ranking-title">Clasificación</h2>
    <div class="ranking-list">
      {#each sortedPlayers as player, index}
        <div class="ranking-row" class:winner-row={index === 0}>
          <span class="rank">#{index + 1}</span>
          <span class="player-info">{player.avatar} {player.name}</span>
          <span class="player-score">{player.score}</span>
        </div>
      {/each}
    </div>
  </div>

  <button class="new-game-btn" on:click={handleNewGame}>
    Nueva partida
  </button>

  <p class="swipe-hint">← Desliza para nueva partida</p>
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

  .winner-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .trophy {
    font-size: 4rem;
  }

  .winner-title {
    font-size: 2rem;
    font-weight: 800;
    color: #f59e0b;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .winner-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    background: #22223a;
    border: 4px solid #f59e0b;
    border-radius: 20px;
    padding: 2rem 3rem;
    box-shadow: 0 0 30px rgba(245, 158, 11, 0.3);
  }

  .winner-avatar {
    font-size: 4rem;
  }

  .winner-name {
    font-size: 1.5rem;
    font-weight: 700;
    color: #f0f0f0;
  }

  .winner-score {
    font-size: 1.2rem;
    color: #f59e0b;
    font-weight: 600;
  }

  .ranking-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
    max-width: 360px;
  }

  .ranking-title {
    font-size: 1.2rem;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .ranking-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  .ranking-row {
    display: flex;
    align-items: center;
    background: #2a2a3e;
    border-radius: 12px;
    padding: 1rem;
    gap: 1rem;
  }

  .ranking-row.winner-row {
    background: #2a2a3e;
    border: 2px solid #f59e0b;
  }

  .rank {
    font-size: 1rem;
    font-weight: 700;
    color: #aaa;
    min-width: 2rem;
  }

  .player-info {
    flex: 1;
    font-size: 1rem;
    color: #f0f0f0;
  }

  .player-score {
    font-size: 1.1rem;
    font-weight: 700;
    color: #f59e0b;
  }

  .new-game-btn {
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

  .new-game-btn:hover {
    background: #d97706;
  }

  .new-game-btn:active {
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
