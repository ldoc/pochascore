<script>
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { speak } from '../lib/voice';
  import { setupSwipe } from '../lib/swipe';

  const dispatch = createEventDispatcher();

  let screenEl;

  function handleContinue() {
    dispatch('continue');
  }

  onMount(() => {
    speak('Bienvenido a PochaScore');
    const swipe = setupSwipe(screenEl, handleContinue, () => {});
    return () => swipe.destroy();
  });
</script>

<div
  class="screen"
  bind:this={screenEl}
  on:click={handleContinue}
  role="button"
  tabindex="0"
  on:keydown={(e) => e.key === 'Enter' && handleContinue()}
>
  <h1 class="title">PochaScore</h1>
  <p class="version">v1.0</p>
  <p class="blink">Pulse en la pantalla para continuar</p>
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
    cursor: pointer;
    user-select: none;
  }

  .title {
    font-size: clamp(4rem, 15vw, 7rem);
    font-weight: 800;
    color: white;
    margin: 0;
  }

  .version {
    font-size: clamp(1rem, 3vw, 1.3rem);
    color: #777;
    text-transform: uppercase;
    margin: 0.5rem 0 0;
  }

  .blink {
    font-size: clamp(1rem, 3vw, 1.4rem);
    color: #aaa;
    animation: blink 1.5s infinite;
    position: absolute;
    bottom: 2rem;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
</style>
