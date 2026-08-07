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
  $: isLastPlayer = currentPlayerIndex >= totalPlayers;
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

<div class="registration">
  <h2>Jugador {currentPlayerIndex + 1} de {totalPlayers}</h2>
  
  <div class="avatar-selector">
    <span class="selector-label">Elige tu avatar</span>
    <div class="avatar-grid">
      {#each AVATARS as avatar, i}
        <button 
          class="avatar" 
          class:selected={selectedAvatar === avatar}
          on:click={() => selectedAvatar = avatar}
        >
          {avatar}
        </button>
      {/each}
    </div>
  </div>
  
  <div class="color-selector">
    <span class="selector-label">Elige tu color</span>
    <div class="color-grid">
      {#each PLAYER_COLORS as color, i}
        <button 
          class="color" 
          class:selected={selectedColor === color}
          style="background: {color}"
          aria-label="Color {i + 1}"
          on:click={() => selectedColor = color}
        ></button>
      {/each}
    </div>
  </div>
  
  <div class="name-input">
    <label for="player-name">Tu nombre (2-4 letras)</label>
    <input 
      id="player-name"
      type="text" 
      bind:value={playerName}
      maxlength="4"
      placeholder="Nombre"
    />
  </div>
  
  <button 
    class="primary" 
    on:click={handleRegister}
    disabled={!canProceed}
  >
    {isLastPlayer ? 'Comenzar partida' : 'Siguiente jugador'}
  </button>
</div>

<style>
  .registration {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    gap: 1.5rem;
    min-height: 100vh;
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #a0a0a0;
    font-size: 0.9rem;
  }
  
  .selector-label {
    display: block;
    margin-bottom: 0.5rem;
    color: #a0a0a0;
    font-size: 0.9rem;
  }
  
  .avatar-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;
  }
  
  .avatar {
    width: 50px;
    height: 50px;
    font-size: 1.8rem;
    border: 2px solid transparent;
    border-radius: 8px;
    background: #16213e;
    cursor: pointer;
    transition: border-color 0.2s, transform 0.1s;
  }
  
  .avatar.selected {
    border-color: #e94560;
    transform: scale(1.1);
  }
  
  .color-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;
  }
  
  .color {
    width: 40px;
    height: 40px;
    border: 2px solid transparent;
    border-radius: 50%;
    cursor: pointer;
    transition: border-color 0.2s, transform 0.1s;
  }
  
  .color.selected {
    border-color: white;
    transform: scale(1.15);
  }
  
  .name-input {
    width: 100%;
    max-width: 300px;
  }
  
  input {
    width: 100%;
    padding: 0.8rem;
    font-size: 1.2rem;
    text-align: center;
    text-transform: uppercase;
    border: 1px solid #0f3460;
    border-radius: 8px;
    background: #16213e;
    color: white;
  }
  
  input:focus {
    outline: none;
    border-color: #e94560;
  }
  
  .primary {
    width: 100%;
    max-width: 300px;
    padding: 1rem;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    background: #e94560;
    color: white;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  
  .primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
