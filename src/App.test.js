// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/svelte';
import App from './App.svelte';
import { gameStore } from './stores/gameState';
import { PHASES } from './lib/constants';

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

vi.stubGlobal('localStorage', localStorageMock);

// Mock crypto.randomUUID
vi.stubGlobal('crypto', {
  randomUUID: vi.fn(() => 'test-uuid-123')
});

afterEach(() => {
  cleanup();
  localStorageMock.clear();
  vi.clearAllMocks();
});

describe('App', () => {
  beforeEach(() => {
    gameStore.reset();
  });

  it('shows WelcomeScreen on initial load', () => {
    render(App);
    expect(screen.getByText(/Pochascore/)).toBeTruthy();
  });

  it('shows new game button on WelcomeScreen', () => {
    render(App);
    expect(screen.getByText('Nueva partida')).toBeTruthy();
  });

  it('navigates to GameSetup when new game is clicked', async () => {
    render(App);
    const button = screen.getByText('Nueva partida');
    await fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByText('Comenzar')).toBeTruthy();
    });
  });

  it('navigates through full game flow', async () => {
    render(App);
    
    // Start from Welcome
    const newGameBtn = screen.getByText('Nueva partida');
    await fireEvent.click(newGameBtn);
    
    // Setup phase - GameSetup shows "Nueva partida" as h2 and "Comenzar" button
    await waitFor(() => {
      expect(screen.getByText('Comenzar')).toBeTruthy();
    });
    const startBtn = screen.getByText('Comenzar');
    await fireEvent.click(startBtn);
    
    // Registration phase - PlayerRegistration shows "Jugador 1 de 4"
    await waitFor(() => {
      expect(screen.getByText(/Jugador 1 de/)).toBeTruthy();
    });
  });

  it('sets correct phase in store after new game', async () => {
    render(App);
    const button = screen.getByText('Nueva partida');
    await fireEvent.click(button);
    
    await waitFor(() => {
      let state;
      gameStore.subscribe(v => { state = v; })();
      expect(state.currentRound.phase).toBe(PHASES.SETUP);
    });
  });

  it('saves game to localStorage when not on welcome screen', async () => {
    render(App);
    const button = screen.getByText('Nueva partida');
    await fireEvent.click(button);
    
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });
});
