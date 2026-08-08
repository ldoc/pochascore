<script>
  import { createEventDispatcher, onMount, tick } from 'svelte';
  import { speak } from '../lib/voice';
  import { setupSwipe } from '../lib/swipe';

  const dispatch = createEventDispatcher();

  let playerCount = 4;
  let scrollContainer;
  let isDragging = false;
  let startY = 0;
  let scrollTop = 0;

  let screenEl;

  const minPlayers = 2;
  const maxPlayers = 10;
  const itemHeight = 56;

  $: items = Array.from({ length: maxPlayers - minPlayers + 1 }, (_, i) => i + minPlayers);

  onMount(async () => {
    speak('Selecciona el número de jugadores');
    
    await tick();
    scrollToValue(playerCount);

    const swipe = setupSwipe(
      screenEl,
      () => dispatch('select', { count: playerCount }),
      () => dispatch('back')
    );

    return () => swipe.destroy();
  });

  function scrollToValue(value) {
    const index = value - minPlayers;
    const containerHeight = scrollContainer.clientHeight;
    const offset = (containerHeight - itemHeight) / 2;
    scrollContainer.scrollTop = index * itemHeight - offset;
  }

  function handleMouseDown(e) {
    isDragging = true;
    startY = e.pageY;
    scrollTop = scrollContainer.scrollTop;
    scrollContainer.style.cursor = 'grabbing';
  }

  function handleMouseMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const y = e.pageY;
    const walk = startY - y;
    scrollContainer.scrollTop = scrollTop + walk;
  }

  function handleMouseUp() {
    if (!isDragging) return;
    isDragging = false;
    scrollContainer.style.cursor = 'grab';
    snapToNearest();
  }

  function handleTouchStart(e) {
    isDragging = true;
    startY = e.touches[0].pageY;
    scrollTop = scrollContainer.scrollTop;
  }

  function handleTouchMove(e) {
    if (!isDragging) return;
    const y = e.touches[0].pageY;
    const walk = startY - y;
    scrollContainer.scrollTop = scrollTop + walk;
  }

  function handleTouchEnd() {
    isDragging = false;
    snapToNearest();
  }

  function snapToNearest() {
    const containerHeight = scrollContainer.clientHeight;
    const offset = (containerHeight - itemHeight) / 2;
    const index = Math.round((scrollContainer.scrollTop + offset) / itemHeight);
    const clampedIndex = Math.max(0, Math.min(items.length - 1, index));
    
    playerCount = items[clampedIndex];
    scrollToValue(playerCount);
  }
</script>

<div class="screen" bind:this={screenEl}>
  <h2 class="title">Nº de jugadores</h2>

  <div class="picker-wrapper">
    <div class="highlight-zone top"></div>
    
    <div
      class="scroll-container"
      bind:this={scrollContainer}
      on:mousedown={handleMouseDown}
      on:mousemove={handleMouseMove}
      on:mouseup={handleMouseUp}
      on:mouseleave={handleMouseUp}
      on:touchstart={handleTouchStart}
      on:touchmove={handleTouchMove}
      on:touchend={handleTouchEnd}
      role="listbox"
      aria-label="Seleccionar número de jugadores"
    >
      <div class="spacer"></div>
        {#each items as item, index}
        <div
          class="scroll-item"
          class:selected={item === playerCount}
          class:nearby={Math.abs(item - playerCount) === 1}
          role="option"
          aria-selected={item === playerCount}
        >
          {item}
        </div>
      {/each}
      <div class="spacer"></div>
    </div>

    <div class="highlight-zone bottom"></div>
  </div>

  <p class="hint">Desliza para confirmar</p>
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
    gap: 2rem;
  }

  .title {
    font-size: clamp(1.5rem, 5vw, 2.2rem);
    font-weight: 700;
    color: #f8fafc;
    margin: 0;
  }

  .picker-wrapper {
    position: relative;
    width: 140px;
    height: 200px;
    overflow: hidden;
  }

  .scroll-container {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    scrollbar-width: none;
    -ms-overflow-style: none;
    cursor: grab;
    user-select: none;
    -webkit-user-select: none;
  }

  .scroll-container::-webkit-scrollbar {
    display: none;
  }

  .scroll-item {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: font-size 0.2s, font-weight 0.2s, color 0.2s, opacity 0.2s;
    font-variant-numeric: tabular-nums;
    font-size: 1.8rem;
    font-weight: 500;
    color: #444;
    opacity: 0.3;
  }

  .scroll-item.nearby {
    font-size: 1.8rem;
    font-weight: 500;
    color: #444;
    opacity: 0.7;
  }

  .scroll-item.selected {
    font-size: 3rem;
    font-weight: 800;
    color: #f0f0f0;
    opacity: 1;
  }

  .spacer {
    height: calc(50% - 28px);
  }

  .highlight-zone {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: rgba(255, 255, 255, 0.15);
    z-index: 10;
    pointer-events: none;
  }

  .highlight-zone.top {
    top: calc(50% - 28px);
  }

  .highlight-zone.bottom {
    bottom: calc(50% - 28px);
  }

  .hint {
    font-size: clamp(0.8rem, 2vw, 1rem);
    color: #aaa;
    animation: blink 1.5s infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
</style>
