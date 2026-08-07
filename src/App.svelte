<script>
  import { onMount } from 'svelte';
  import { gameStore, loadGame, saveGame, hasSavedGame } from './stores/gameState';
  import { PHASES } from './lib/constants';
  
  import WelcomeScreen from './components/WelcomeScreen.svelte';
  import GameSetup from './components/GameSetup.svelte';
  import PlayerRegistration from './components/PlayerRegistration.svelte';
  import TablePosition from './components/TablePosition.svelte';
  import RoundSetup from './components/RoundSetup.svelte';
  import BiddingPhase from './components/BiddingPhase.svelte';
  import PlayingPhase from './components/PlayingPhase.svelte';
  import ScoringPhase from './components/ScoringPhase.svelte';
  import ScoreBoard from './components/ScoreBoard.svelte';
  
  let playerCount = 4;
  let isFlipping = false;
  
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
  $: if (phase !== PHASES.WELCOME) {
    saveGame($gameStore);
  }
  
  function triggerFlip(callback) {
    isFlipping = true;
    setTimeout(() => {
      callback();
      setTimeout(() => {
        isFlipping = false;
      }, 50);
    }, 300);
  }
  
  function handleNewGame() {
    triggerFlip(() => {
      gameStore.reset();
      gameStore.setPhase(PHASES.SETUP);
    });
  }
  
  function handleResumeGame() {
    const saved = loadGame();
    if (saved) {
      gameStore.set(saved);
    }
  }
  
  function handleStartRegistration(event) {
    playerCount = event.detail.playerCount;
    triggerFlip(() => {
      gameStore.setPhase(PHASES.REGISTRATION);
    });
  }
  
  function handleRegistrationComplete() {
    triggerFlip(() => {
      gameStore.setPhase(PHASES.POSITIONING);
    });
  }
  
  function handlePositioningComplete() {
    triggerFlip(() => {
      gameStore.setPhase(PHASES.ROUND_SETUP);
    });
  }
  
  function handleRoundStarted() {
    triggerFlip(() => {
      gameStore.setPhase(PHASES.BIDDING);
    });
  }
  
  function handleBiddingComplete() {
    triggerFlip(() => {
      gameStore.setPhase(PHASES.PLAYING);
    });
  }
  
  function handlePlayingComplete() {
    triggerFlip(() => {
      gameStore.setPhase(PHASES.SCORING);
    });
  }
  
  function handleNextRound() {
    triggerFlip(() => {
      if ($gameStore.currentRound.phase === PHASES.GAME_END) {
        gameStore.setPhase(PHASES.GAME_END);
      } else {
        gameStore.setPhase(PHASES.ROUND_SETUP);
      }
    });
  }
  
  function handleGameEnd() {
    triggerFlip(() => {
      gameStore.setPhase(PHASES.GAME_END);
    });
  }
</script>

<div class="flip-container">
  <div class="flip-panel" class:flipped={isFlipping}>
    <main>
      {#if phase === PHASES.WELCOME}
        <WelcomeScreen on:newGame={handleNewGame} on:resumeGame={handleResumeGame} />
        
      {:else if phase === PHASES.SETUP}
        <GameSetup on:startRegistration={handleStartRegistration} />
        
      {:else if phase === PHASES.REGISTRATION}
        <PlayerRegistration totalPlayers={playerCount} on:registrationComplete={handleRegistrationComplete} />
        
      {:else if phase === PHASES.POSITIONING}
        <TablePosition on:positioningComplete={handlePositioningComplete} />
        
      {:else if phase === PHASES.ROUND_SETUP}
        <RoundSetup on:roundStarted={handleRoundStarted} />
        
      {:else if phase === PHASES.BIDDING}
        <BiddingPhase on:biddingComplete={handleBiddingComplete} />
        
      {:else if phase === PHASES.PLAYING}
        <PlayingPhase on:playingComplete={handlePlayingComplete} />
        
      {:else if phase === PHASES.SCORING}
        <ScoringPhase on:nextRound={handleNextRound} on:gameEnd={handleGameEnd} />
        
      {:else if phase === PHASES.GAME_END}
        <ScoreBoard on:newGame={handleNewGame} />
      {/if}
    </main>
  </div>
</div>

<style>
  main {
    min-height: 100vh;
    background: #1e293b;
  }
</style>
