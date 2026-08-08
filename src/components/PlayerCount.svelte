<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { speak } from '../lib/voice';
  import { setupSwipe } from '../lib/swipe';

  const dispatch = createEventDispatcher();

  let playerCount = 4;
  let scrollContainer;
  let isDragging = false;
  let startY = 0;
  let scrollTop = 0;

  const minPlayers = 2;
  const maxPlayers = 10;
  const itemHeight = 140;

  $: items = Array.from({ length: maxPlayers - minPlayers + 1 }, (_, i) => i + minPlayers);

  onMount(() => {
    speak('Selecciona el número de jugadores');
    
    scrollToValue(playerCount);

    const swipe = setupSwipe(
      scrollContainer,
      () => dispatch('select', { count: playerCount }),
      () => {}
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

  function getItemStyle(index) {
    const value = items[index];
    const containerHeight = scrollContainer?.clientHeight || 420;
    const offset = (containerHeight - itemHeight) / 2;
    const itemTop = index * itemHeight;
    const scrollPos = scrollContainer?.scrollTop || 0;
    const centerPos = scrollPos + offset;
    const distance = Math.abs(itemTop - centerPos);

    let fontSize, fontWeight, color, opacity;

    if (distance < itemHeight / 2) {
      fontSize = '8rem';
      fontWeight = 800;
      color = '#f0f0f0';
      opacity = 1;
    } else if (distance < itemHeight * 1.5) {
      fontSize = '5rem';
      fontWeight = 500;
      color = '#444';
      opacity = 0.7;
    } else {
      fontSize = '5rem';
      fontWeight = 500;
      color = '#444';
      opacity = 0.3;
    }

    return `font-size: ${fontSize}; font-weight: ${fontWeight}; color: ${color}; opacity: ${opacity};`;
  }
</script>

<div class="panel">
  <div class="panel-header">
    <h2 class="text-lg font-bold text-bone text-center">Nº de jugadores</h2>
  </div>

  <div class="panel-content flex flex-col items-center justify-center">
    <div class="scroll-wrapper">
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
            style={getItemStyle(index)}
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
  </div>
</div>

<style>
  .scroll-wrapper {
    position: relative;
    width: 100%;
    max-width: 200px;
    height: clamp(300px, 50vh, 420px);
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
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: font-size 0.2s, font-weight 0.2s, color 0.2s, opacity 0.2s;
    font-variant-numeric: tabular-nums;
  }

  .spacer {
    height: calc(50% - 70px);
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
    top: calc(50% - 70px);
  }

  .highlight-zone.bottom {
    bottom: calc(50% - 70px);
  }
</style>
