import { writable } from 'svelte/store';
import { ROUNDS, PHASES, getTricksForRound } from '../lib/constants';

const STORAGE_KEY = 'pochascore_current_game';

function createInitialState() {
  return {
    gameId: crypto.randomUUID(),
    variant: 'classica',
    totalRounds: ROUNDS.length,
    players: [],
    currentRound: {
      number: 1,
      tricksInRound: getTricksForRound(1),
      trump: null,
      mano: null,
      phase: PHASES.WELCOME,
      bids: [],
      tricks: [],
      currentTrick: 1,
      tricksPlayed: 0
    },
    history: [],
    lastSaved: null
  };
}

function createGameStore() {
  const { subscribe, set, update } = writable(createInitialState());

  return {
    subscribe,
    set,
    update,
    reset: () => set(createInitialState()),
    
    setPhase: (phase) => update(state => ({
      ...state,
      currentRound: { ...state.currentRound, phase }
    })),
    
    addPlayer: (player) => update(state => ({
      ...state,
      players: [...state.players, player]
    })),
    
    updatePlayer: (id, updates) => update(state => ({
      ...state,
      players: state.players.map(p => 
        p.id === id ? { ...p, ...updates } : p
      )
    })),
    
    setTrump: (trump) => update(state => ({
      ...state,
      currentRound: { ...state.currentRound, trump }
    })),
    
    setMano: (mano) => update(state => ({
      ...state,
      currentRound: { ...state.currentRound, mano }
    })),
    
    setBids: (bids) => update(state => ({
      ...state,
      currentRound: { ...state.currentRound, bids }
    })),
    
    setTricks: (tricks) => update(state => ({
      ...state,
      currentRound: { ...state.currentRound, tricks }
    })),
    
    nextRound: () => update(state => {
      const nextRoundNum = state.currentRound.number + 1;
      if (nextRoundNum > ROUNDS.length) {
        return { ...state, currentRound: { ...state.currentRound, phase: PHASES.GAME_END } };
      }
      return {
        ...state,
        currentRound: {
          number: nextRoundNum,
          tricksInRound: getTricksForRound(nextRoundNum),
          trump: null,
          mano: null,
          phase: PHASES.ROUND_SETUP,
          bids: [],
          tricks: [],
          currentTrick: 1,
          tricksPlayed: 0
        }
      };
    }),
    
    updateScores: (scores) => update(state => ({
      ...state,
      players: state.players.map(p => {
        const scoreData = scores.find(s => s.playerId === p.id);
        return scoreData ? { ...p, score: scoreData.totalScore } : p;
      }),
      history: [...state.history, {
        round: state.currentRound.number,
        trump: state.currentRound.trump,
        mano: state.currentRound.mano,
        bids: state.currentRound.bids,
        tricks: state.currentRound.tricks,
        scores
      }]
    }))
  };
}

export const gameStore = createGameStore();

export function saveGame(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...state,
      lastSaved: new Date().toISOString()
    }));
    return true;
  } catch (e) {
    console.error('Failed to save game:', e);
    return false;
  }
}

export function loadGame() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Failed to load game:', e);
    clearGame();
    return null;
  }
}

export function clearGame() {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasSavedGame() {
  return localStorage.getItem(STORAGE_KEY) !== null;
}
