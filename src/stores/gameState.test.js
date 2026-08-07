import { describe, it, expect, beforeEach, vi } from 'vitest';
import { gameStore, saveGame, loadGame, clearGame, hasSavedGame } from './gameState.js';
import { ROUNDS, PHASES } from '../lib/constants.js';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value; }),
    removeItem: vi.fn(key => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn(index => Object.keys(store)[index] || null)
  };
})();

// Mock crypto.randomUUID
vi.stubGlobal('crypto', {
  randomUUID: vi.fn(() => 'test-uuid-123')
});

vi.stubGlobal('localStorage', localStorageMock);

describe('Game State Store', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    // Reset store to initial state
    gameStore.reset();
  });

  describe('createInitialState', () => {
    it('should create initial state with correct defaults', () => {
      const state = getStoreValue();
      expect(state.gameId).toBe('test-uuid-123');
      expect(state.variant).toBe('classica');
      expect(state.totalRounds).toBe(ROUNDS.length);
      expect(state.players).toEqual([]);
      expect(state.history).toEqual([]);
      expect(state.lastSaved).toBeNull();
    });

    it('should initialize currentRound correctly', () => {
      const state = getStoreValue();
      expect(state.currentRound.number).toBe(1);
      expect(state.currentRound.tricksInRound).toBe(ROUNDS[0]);
      expect(state.currentRound.trump).toBeNull();
      expect(state.currentRound.mano).toBeNull();
      expect(state.currentRound.phase).toBe(PHASES.WELCOME);
      expect(state.currentRound.bids).toEqual([]);
      expect(state.currentRound.tricks).toEqual([]);
      expect(state.currentRound.currentTrick).toBe(1);
      expect(state.currentRound.tricksPlayed).toBe(0);
    });
  });

  describe('Store methods', () => {
    it('should reset to initial state', () => {
      // Modify state
      gameStore.addPlayer({ id: '1', name: 'Player 1', score: 0 });
      gameStore.setPhase(PHASES.SETUP);
      
      // Reset
      gameStore.reset();
      
      const state = getStoreValue();
      expect(state.players).toEqual([]);
      expect(state.currentRound.phase).toBe(PHASES.WELCOME);
    });

    it('should set phase', () => {
      gameStore.setPhase(PHASES.BIDDING);
      const state = getStoreValue();
      expect(state.currentRound.phase).toBe(PHASES.BIDDING);
    });

    it('should add player', () => {
      const player = { id: '1', name: 'Player 1', score: 0 };
      gameStore.addPlayer(player);
      
      const state = getStoreValue();
      expect(state.players).toHaveLength(1);
      expect(state.players[0]).toEqual(player);
    });

    it('should add multiple players', () => {
      gameStore.addPlayer({ id: '1', name: 'Player 1', score: 0 });
      gameStore.addPlayer({ id: '2', name: 'Player 2', score: 0 });
      
      const state = getStoreValue();
      expect(state.players).toHaveLength(2);
    });

    it('should update player by id', () => {
      gameStore.addPlayer({ id: '1', name: 'Player 1', score: 0 });
      gameStore.updatePlayer('1', { name: 'Updated Name', score: 100 });
      
      const state = getStoreValue();
      expect(state.players[0].name).toBe('Updated Name');
      expect(state.players[0].score).toBe(100);
    });

    it('should set trump', () => {
      gameStore.setTrump('oros');
      const state = getStoreValue();
      expect(state.currentRound.trump).toBe('oros');
    });

    it('should set mano', () => {
      gameStore.setMano('1');
      const state = getStoreValue();
      expect(state.currentRound.mano).toBe('1');
    });

    it('should set bids', () => {
      const bids = [3, 2, 4, 1];
      gameStore.setBids(bids);
      const state = getStoreValue();
      expect(state.currentRound.bids).toEqual(bids);
    });

    it('should set tricks', () => {
      const tricks = [3, 2, 4, 1];
      gameStore.setTricks(tricks);
      const state = getStoreValue();
      expect(state.currentRound.tricks).toEqual(tricks);
    });

    it('should advance to next round', () => {
      // Set up first round
      gameStore.setPhase(PHASES.PLAYING);
      
      // Move to next round
      gameStore.nextRound();
      
      const state = getStoreValue();
      expect(state.currentRound.number).toBe(2);
      expect(state.currentRound.tricksInRound).toBe(ROUNDS[1]);
      expect(state.currentRound.trump).toBeNull();
      expect(state.currentRound.mano).toBeNull();
      expect(state.currentRound.phase).toBe(PHASES.ROUND_SETUP);
      expect(state.currentRound.bids).toEqual([]);
      expect(state.currentRound.tricks).toEqual([]);
      expect(state.currentRound.currentTrick).toBe(1);
      expect(state.currentRound.tricksPlayed).toBe(0);
    });

    it('should set GAME_END phase when advancing past last round', () => {
      // Advance to last round
      for (let i = 0; i < ROUNDS.length - 1; i++) {
        gameStore.nextRound();
      }
      
      // Should be on last round
      let state = getStoreValue();
      expect(state.currentRound.number).toBe(ROUNDS.length);
      
      // Try to advance past last round
      gameStore.nextRound();
      
      state = getStoreValue();
      expect(state.currentRound.phase).toBe(PHASES.GAME_END);
    });

    it('should update scores and add to history', () => {
      // Add players
      gameStore.addPlayer({ id: '1', name: 'Player 1', score: 0 });
      gameStore.addPlayer({ id: '2', name: 'Player 2', score: 0 });
      
      // Set up round
      gameStore.setTrump('oros');
      gameStore.setMano('1');
      gameStore.setBids([3, 2]);
      gameStore.setTricks([3, 2]);
      
      // Update scores
      const scores = [
        { playerId: '1', bid: 3, taken: 3, roundScore: 25, totalScore: 25 },
        { playerId: '2', bid: 2, taken: 2, roundScore: 20, totalScore: 20 }
      ];
      gameStore.updateScores(scores);
      
      const state = getStoreValue();
      expect(state.players[0].score).toBe(25);
      expect(state.players[1].score).toBe(20);
      expect(state.history).toHaveLength(1);
      expect(state.history[0].round).toBe(1);
      expect(state.history[0].trump).toBe('oros');
      expect(state.history[0].mano).toBe('1');
      expect(state.history[0].bids).toEqual([3, 2]);
      expect(state.history[0].tricks).toEqual([3, 2]);
      expect(state.history[0].scores).toEqual(scores);
    });
  });

  describe('localStorage persistence', () => {
    it('should save game to localStorage', () => {
      const state = gameStore.subscribe(v => v)();
      const result = saveGame(state);
      
      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'pochascore_current_game',
        expect.any(String)
      );
    });

    it('should load game from localStorage', () => {
      const mockData = {
        gameId: 'test-123',
        variant: 'classica',
        players: [{ id: '1', name: 'Player 1', score: 100 }],
        currentRound: { number: 5, phase: 'bidding' },
        history: []
      };
      
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockData));
      
      const loaded = loadGame();
      expect(loaded).toEqual(mockData);
    });

    it('should return null when no saved game exists', () => {
      localStorageMock.getItem.mockReturnValueOnce(null);
      
      const loaded = loadGame();
      expect(loaded).toBeNull();
    });

    it('should clear game from localStorage', () => {
      clearGame();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('pochascore_current_game');
    });

    it('should check if saved game exists', () => {
      localStorageMock.getItem.mockReturnValueOnce(null);
      expect(hasSavedGame()).toBe(false);
      
      localStorageMock.getItem.mockReturnValueOnce('some-data');
      expect(hasSavedGame()).toBe(true);
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('Storage full');
      });
      
      const state = gameStore.subscribe(v => v)();
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const result = saveGame(state);
      
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to save game:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });

    it('should handle load errors gracefully', () => {
      localStorageMock.getItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const loaded = loadGame();
      
      expect(loaded).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load game:', expect.any(Error));
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('pochascore_current_game');
      
      consoleSpy.mockRestore();
    });
  });
});

function getStoreValue() {
  let value;
  const unsubscribe = gameStore.subscribe(v => { value = v; });
  unsubscribe();
  return value;
}
