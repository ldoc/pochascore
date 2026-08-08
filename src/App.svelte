<script>
  import { onMount } from 'svelte';
  import { gameStore, loadGame, saveGame, hasSavedGame } from './stores/gameState';
  import { PHASES } from './lib/constants';
  
  import WelcomeScreen from './components/WelcomeScreen.svelte';
  import GameOptions from './components/GameOptions.svelte';
  import PlayerCount from './components/PlayerCount.svelte';
  import PlayerRegistration from './components/PlayerRegistration.svelte';
  import TablePosition from './components/TablePosition.svelte';
  import RoundSetup from './components/RoundSetup.svelte';
  import BiddingPhase from './components/BiddingPhase.svelte';
  import InGame from './components/InGame.svelte';
  import ResultsEntry from './components/ResultsEntry.svelte';
  import ScoringPhaseNew from './components/ScoringPhaseNew.svelte';
  import FinalResults from './components/FinalResults.svelte';
  import MuteButton from './components/MuteButton.svelte';
  import Toast from './components/Toast.svelte';
  
  let playerCount = 4;
  let toastComponent;
  
  onMount(() => {
    const saved = loadGame();
    if (saved) {
      gameStore.set(saved);
    }
    
    const handleBeforeUnload = (e) => {
      const currentState = $gameStore;
      if (currentState.players.length > 0) {
        saveGame(currentState);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  });
  
  $: phase = $gameStore.currentRound.phase;
  $: if (phase !== PHASES.WELCOME && $gameStore.players.length > 0) {
    saveGame($gameStore);
  }
  
  function showToast(msg) {
    if (toastComponent) {
      toastComponent.show(msg);
    }
  }
  
  function handleContinue() {
    gameStore.setPhase(PHASES.SETUP);
  }
  
  function handleNewGame() {
    gameStore.reset();
    gameStore.setPhase(PHASES.REGISTRATION);
    showToast('Nueva partida creada');
  }
  
  function handleResumeGame() {
    const saved = loadGame();
    if (saved) {
      gameStore.set(saved);
      showToast('Partida cargada');
    }
  }
  
  function handleSelectPlayerCount(event) {
    playerCount = event.detail.count;
    gameStore.setPhase(PHASES.POSITIONING);
  }
  
  function handleRegistrationComplete() {
    gameStore.setPhase(PHASES.ROUND_SETUP);
  }
  
  function handleBackFromRegistration() {
    gameStore.update(state => ({ ...state, players: [] }));
    gameStore.setPhase(PHASES.REGISTRATION);
  }
  
  function handlePositioningComplete() {
    gameStore.setPhase(PHASES.ROUND_SETUP);
  }
  
  function handleRoundStarted() {
    gameStore.setPhase(PHASES.BIDDING);
  }
  
  function handleBiddingComplete() {
    gameStore.setPhase(PHASES.PLAYING);
  }
  
  function handleInGameComplete() {
    gameStore.setPhase(PHASES.SCORING);
  }
  
  function handleResultsComplete() {
    gameStore.setPhase(PHASES.SCORING);
  }
  
  function handleScoringNextRound() {
    if ($gameStore.currentRound.phase === PHASES.GAME_END) {
      gameStore.setPhase(PHASES.GAME_END);
    } else {
      gameStore.setPhase(PHASES.ROUND_SETUP);
    }
  }
  
  function handleScoringGameEnd() {
    gameStore.setPhase(PHASES.GAME_END);
  }
  
  function handleFinalNewGame() {
    gameStore.reset();
    gameStore.setPhase(PHASES.WELCOME);
    showToast('¡Hasta la próxima!');
  }
</script>

<div class="app-container">
  <main>
    {#if phase === PHASES.WELCOME}
      <WelcomeScreen on:continue={handleContinue} />
      
    {:else if phase === PHASES.SETUP}
      <GameOptions on:newGame={handleNewGame} on:continueGame={handleResumeGame} />
      
    {:else if phase === PHASES.REGISTRATION}
      <PlayerCount on:select={handleSelectPlayerCount} />
      
    {:else if phase === PHASES.POSITIONING}
      <PlayerRegistration totalPlayers={playerCount} on:complete={handleRegistrationComplete} on:back={handleBackFromRegistration} />
      
    {:else if phase === PHASES.ROUND_SETUP}
      <RoundSetup on:roundStarted={handleRoundStarted} />
      
    {:else if phase === PHASES.BIDDING}
      <BiddingPhase on:biddingComplete={handleBiddingComplete} />
      
    {:else if phase === PHASES.PLAYING}
      <InGame on:complete={handleInGameComplete} />
      
    {:else if phase === PHASES.SCORING}
      <ResultsEntry on:complete={handleResultsComplete} />
      
    {:else if phase === PHASES.GAME_END}
      <FinalResults on:newGame={handleFinalNewGame} />
    {/if}
  </main>
  
  <MuteButton />
  <Toast bind:this={toastComponent} />
</div>

<style>
  .app-container {
    min-height: 100vh;
    min-height: 100dvh;
    position: relative;
  }
  
  main {
    min-height: 100vh;
    min-height: 100dvh;
  }
</style>
