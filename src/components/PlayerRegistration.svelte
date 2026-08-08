<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { speak } from '../lib/voice';
  import { setupSwipe } from '../lib/swipe';
  import { gameStore } from '../stores/gameState';
  import { AVATARS, PLAYER_COLORS } from '../lib/constants';

  const dispatch = createEventDispatcher();

  export let totalPlayers = 4;

  let screenEl;
  let currentIndex = 0;
  let nick = ['', '', '', ''];
  let selectedAvatar = AVATARS[0];
  let slotIndex = 0;

  $: playerNumber = currentIndex + 1;
  $: isLastPlayer = currentIndex >= totalPlayers - 1;
  $: canProceed = nick.every(l => l !== '');

  const keyboardRows = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L','Ñ'],
    ['Z','X','C','V','B','N','M']
  ];

  onMount(() => {
    speak('Introduce tu nombre');

    const swipe = setupSwipe(
      screenEl,
      handleSwipeLeft,
      () => {}
    );

    return () => swipe.destroy();
  });

  function handleKey(key) {
    if (slotIndex >= 4) return;
    nick[slotIndex] = key;
    slotIndex++;
    nick = nick;
  }

  function handleBackspace() {
    if (slotIndex <= 0) return;
    slotIndex--;
    nick[slotIndex] = '';
    nick = nick;
  }

  function handleSwipeLeft() {
    if (!canProceed) return;

    gameStore.addPlayer({
      id: currentIndex + 1,
      name: nick.join(''),
      avatar: selectedAvatar,
      color: PLAYER_COLORS[currentIndex % PLAYER_COLORS.length],
      position: null,
      score: 0
    });

    if (isLastPlayer) {
      dispatch('complete');
    } else {
      currentIndex++;
      nick = ['', '', '', ''];
      slotIndex = 0;
      selectedAvatar = AVATARS[currentIndex % AVATARS.length];
      speak(`Jugador ${currentIndex + 1}, introduce tu nombre`);
    }
  }
</script>

<div class="screen" bind:this={screenEl}>
  <div class="player-counter">
    <span>{playerNumber}</span>
    <span class="separator">/</span>
    <span>{totalPlayers}</span>
  </div>

  <div class="section">
    <span class="section-label">Avatar</span>
    <div class="avatar-grid">
      {#each AVATARS as avatar}
        <button
          class="avatar-btn"
          class:selected={selectedAvatar === avatar}
          on:click={() => selectedAvatar = avatar}
        >
          {avatar}
        </button>
      {/each}
    </div>
  </div>

  <div class="nick-display">
    {#each nick as letter, i}
      <div class="nick-slot" class:active={i === slotIndex}>
        {letter}
      </div>
    {/each}
  </div>

  <div class="keyboard">
    {#each keyboardRows as row}
      <div class="keyboard-row">
        {#each row as key}
          <button class="key-btn" on:click={() => handleKey(key)}>
            {key}
          </button>
        {/each}
      </div>
    {/each}
    <div class="keyboard-row">
      <button class="key-btn backspace-btn" on:click={handleBackspace}>
        ⌫
      </button>
    </div>
  </div>
</div>

<style>
  .screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 12px;
    gap: 16px;
    height: 100%;
    overflow-y: auto;
  }

  .player-counter {
    font-size: 3rem;
    font-weight: 800;
    color: #f8fafc;
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .separator {
    color: #64748b;
    font-size: 2rem;
  }

  .section {
    width: 100%;
    max-width: 320px;
  }

  .section-label {
    display: block;
    color: #94a3b8;
    font-size: 0.8rem;
    margin-bottom: 8px;
  }

  .avatar-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 6px;
  }

  .avatar-btn {
    aspect-ratio: 1;
    border-radius: 8px;
    border: 2px solid transparent;
    background: #1e293b;
    font-size: 1.4rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.15s;
  }

  .avatar-btn.selected {
    border-color: #f59e0b;
  }

  .nick-display {
    display: flex;
    gap: 8px;
    justify-content: center;
  }

  .nick-slot {
    width: 50px;
    height: 55px;
    background: #334155;
    border: 2px solid #475569;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
    font-weight: 700;
    color: #f8fafc;
    transition: border-color 0.15s;
  }

  .nick-slot.active {
    border-color: #f59e0b;
  }

  .keyboard {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
    max-width: 380px;
    margin-top: auto;
  }

  .keyboard-row {
    display: flex;
    gap: 4px;
    justify-content: center;
  }

  .key-btn {
    flex: 1;
    max-width: 38px;
    aspect-ratio: 0.85;
    background: #333;
    border: none;
    border-radius: 8px;
    color: #f8fafc;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.1s;
  }

  .key-btn:active {
    background: #555;
  }

  .backspace-btn {
    max-width: 80px;
    font-size: 1.2rem;
  }
</style>
