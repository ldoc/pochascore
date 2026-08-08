<script>
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { speak } from '../lib/voice';
  import { setupSwipe } from '../lib/swipe';

  const dispatch = createEventDispatcher();

  let screenEl;
  let selectedOption = null;
  let toastMessage = '';
  let toastVisible = false;
  let toastTimeout;

  function showToast(msg) {
    toastMessage = msg;
    toastVisible = true;
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastVisible = false;
    }, 2000);
  }

  function selectOption(option) {
    selectedOption = option;
  }

  function handleSwipeLeft() {
    if (!selectedOption) {
      showToast('Selecciona una opción primero');
      return;
    }
    if (selectedOption === 'new') {
      dispatch('newGame');
    } else {
      dispatch('continueGame');
    }
  }

  onMount(() => {
    speak('Elige una opción');
    const swipe = setupSwipe(screenEl, handleSwipeLeft, () => dispatch('back'));
    return () => swipe.destroy();
  });
</script>

<div
  class="screen"
  bind:this={screenEl}
  role="button"
  tabindex="0"
  on:keydown={(e) => e.key === 'Enter' && handleSwipeLeft()}
>
  <h1 class="title">PochaScore</h1>

  <div class="options">
    <div
      class="card"
      class:selected={selectedOption === 'new'}
      on:click={() => selectOption('new')}
      role="button"
      tabindex="0"
      on:keydown={(e) => e.key === 'Enter' && selectOption('new')}
    >
      <span class="icon">🎮</span>
      <span class="text">Nueva partida</span>
    </div>

    <div
      class="card"
      class:selected={selectedOption === 'continue'}
      on:click={() => selectOption('continue')}
      role="button"
      tabindex="0"
      on:keydown={(e) => e.key === 'Enter' && selectOption('continue')}
    >
      <span class="icon">📋</span>
      <span class="text">Continuar partida</span>
    </div>
  </div>

  <p class="hint">Desliza para continuar</p>

  <div class="toast" class:show={toastVisible}>
    {toastMessage}
  </div>
</div>

<style>
  .screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    min-height: 100dvh;
    text-align: center;
    user-select: none;
    padding: 2rem;
  }

  .title {
    font-size: clamp(3rem, 10vw, 5rem);
    font-weight: 800;
    color: white;
    margin: 0 0 3rem;
  }

  .options {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .card {
    width: clamp(200px, 40vw, 320px);
    height: clamp(200px, 40vw, 320px);
    background: white;
    border-radius: 24px;
    border: 4px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    cursor: pointer;
    transition: border-color 0.2s ease;
  }

  .card:hover {
    border-color: #cbd5e1;
  }

  .card.selected {
    border-color: #f59e0b;
  }

  .icon {
    font-size: clamp(3rem, 8vw, 6rem);
  }

  .text {
    font-size: clamp(1.2rem, 3vw, 1.6rem);
    font-weight: 700;
    color: #1a1a2e;
  }

  .hint {
    font-size: clamp(0.9rem, 2.5vw, 1.2rem);
    color: #aaa;
    margin-top: 3rem;
    animation: blink 1.5s infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .toast {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: #ef4444;
    color: white;
    padding: 1rem 2rem;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 1000;
  }

  .toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
</style>
