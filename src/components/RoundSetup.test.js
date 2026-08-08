// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/svelte';
import RoundSetup from './RoundSetup.svelte';
import { gameStore } from '../stores/gameState';
import { SUITS, ROUNDS, PHASES } from '../lib/constants';

vi.mock('../lib/voice', () => ({
  speak: vi.fn(),
  isMuted: { subscribe: vi.fn(() => vi.fn()) },
  toggleMute: vi.fn()
}));

vi.mock('../lib/swipe', () => ({
  setupSwipe: vi.fn(() => ({ destroy: vi.fn() }))
}));

afterEach(() => {
  cleanup();
});

describe('RoundSetup', () => {
  beforeEach(() => {
    gameStore.reset();
    gameStore.addPlayer({ id: 1, name: 'Ana', avatar: '👩', color: '#FF6B6B', score: 0 });
    gameStore.addPlayer({ id: 2, name: 'Luis', avatar: '👨', color: '#4ECDC4', score: 0 });
    gameStore.addPlayer({ id: 3, name: 'Carmen', avatar: '🧑', color: '#45B7D1', score: 0 });
    gameStore.addPlayer({ id: 4, name: 'Pedro', avatar: '👴', color: '#96CEB4', score: 0 });
    gameStore.setMano(1);
  });

  it('displays the round label and number', () => {
    render(RoundSetup);
    expect(screen.getByText('Ronda')).toBeTruthy();
    expect(screen.getByText('1')).toBeTruthy();
  });

  it('displays the correct number of tricks for the round', () => {
    render(RoundSetup);
    expect(screen.getByText('1 baza')).toBeTruthy();
  });

  it('renders all suit options', () => {
    render(RoundSetup);
    Object.entries(SUITS).forEach(([key, suit]) => {
      expect(screen.getByText(suit.name)).toBeTruthy();
      expect(screen.getByText(suit.emoji)).toBeTruthy();
    });
  });

  it('displays the mano player with role', () => {
    render(RoundSetup);
    expect(screen.getByText('Ana')).toBeTruthy();
    expect(screen.getByText('👩')).toBeTruthy();
    expect(screen.getByText('Tú repartes')).toBeTruthy();
  });

  it('selects a trump suit on click', async () => {
    render(RoundSetup);
    const suitButton = screen.getByText('Oros');
    await fireEvent.click(suitButton);

    const state = getStoreValue();
    expect(state.currentRound.trump).toBe('oros');
  });

  it('marks selected trump suit visually', async () => {
    render(RoundSetup);
    const suitButton = screen.getByText('Oros').closest('.suit-btn');
    await fireEvent.click(suitButton);

    expect(suitButton.classList.contains('selected')).toBe(true);
  });
});

function getStoreValue() {
  let value;
  const unsubscribe = gameStore.subscribe(v => { value = v; });
  unsubscribe();
  return value;
}
