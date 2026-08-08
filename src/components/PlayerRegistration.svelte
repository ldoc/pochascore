<script>
  import { createEventDispatcher } from 'svelte';
  import { gameStore } from '../stores/gameState';
  import { AVATARS, PLAYER_COLORS } from '../lib/constants';
  
  const dispatch = createEventDispatcher();
  
  export let totalPlayers = 4;
  
  let currentPlayerIndex = 0;
  let playerName = '';
  let selectedAvatar = AVATARS[0];
  let selectedColor = PLAYER_COLORS[0];
  $: isLastPlayer = currentPlayerIndex >= totalPlayers - 1;
  $: canProceed = playerName.length >= 2 && playerName.length <= 4;
  
  function handleRegister() {
    gameStore.addPlayer({
      id: currentPlayerIndex + 1,
      name: playerName,
      avatar: selectedAvatar,
      color: selectedColor,
      position: null,
      score: 0
    });
    
    playerName = '';
    selectedAvatar = AVATARS[(currentPlayerIndex + 1) % AVATARS.length];
    selectedColor = PLAYER_COLORS[(currentPlayerIndex + 1) % PLAYER_COLORS.length];
    currentPlayerIndex++;
    
    if (isLastPlayer) {
      dispatch('registrationComplete');
    }
  }
</script>

<div class="panel">
  <div class="panel-header">
    <h2 class="text-lg font-bold text-bone text-center">
      Jugador {currentPlayerIndex + 1} de {totalPlayers}
    </h2>
  </div>
  
  <div class="panel-content flex flex-col gap-6 animate-fade-in">
    <div>
      <span class="block text-gray-light text-sm mb-3">Elige tu avatar</span>
      <div class="grid grid-cols-5 gap-2">
        {#each AVATARS as avatar, i}
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
    
    <div>
      <span class="block text-gray-light text-sm mb-3">Elige tu color</span>
      <div class="grid grid-cols-5 gap-2 justify-items-center">
        {#each PLAYER_COLORS as color, i}
          <button 
            class="color-btn" 
            class:selected={selectedColor === color}
            style="background: {color}"
            aria-label="Color {i + 1}"
            on:click={() => selectedColor = color}
          ></button>
        {/each}
      </div>
    </div>
    
    <div class="w-full max-w-sm mx-auto">
      <label for="player-name" class="block text-gray-light text-sm mb-2">Tu nombre (2-4 letras)</label>
      <input 
        id="player-name"
        class="input-field"
        type="text" 
        bind:value={playerName}
        maxlength="4"
        placeholder="Nombre"
      />
    </div>
  </div>
  
  <div class="panel-footer">
    <button 
      class="btn-primary" 
      on:click={handleRegister}
      disabled={!canProceed}
    >
      {isLastPlayer ? 'Comenzar partida' : 'Siguiente jugador'}
    </button>
  </div>
</div>
