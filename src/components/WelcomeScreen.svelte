<script>
  import { createEventDispatcher } from 'svelte';
  import { hasSavedGame } from '../stores/gameState';
  
  const dispatch = createEventDispatcher();
  
  $: canResume = hasSavedGame();
  
  function handleNewGame() {
    dispatch('newGame');
  }
  
  function handleResumeGame() {
    dispatch('resumeGame');
  }
</script>

<div class="welcome">
  <h1>🃏 Pochascore</h1>
  <p>Tu marcador de Pocha</p>
  
  <div class="buttons">
    <button class="primary" on:click={handleNewGame}>
      Nueva partida
    </button>
    
    {#if canResume}
      <button class="secondary" on:click={handleResumeGame}>
        Recuperar partida
      </button>
    {/if}
  </div>
</div>

<style>
  .welcome {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
    text-align: center;
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #a0a0a0;
    margin-bottom: 2rem;
  }
  
  .buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 300px;
  }
  
  button {
    padding: 1rem 2rem;
    font-size: 1.1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.1s, opacity 0.1s;
  }
  
  button:active {
    transform: scale(0.98);
  }
  
  .primary {
    background: #e94560;
    color: white;
  }
  
  .secondary {
    background: #16213e;
    color: white;
    border: 1px solid #0f3460;
  }
</style>
