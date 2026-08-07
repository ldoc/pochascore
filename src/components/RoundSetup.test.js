// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/svelte';
import RoundSetup from './RoundSetup.svelte';
import { gameStore } from '../stores/gameState';
import { SUITS, ROUNDS, PHASES } from '../lib/constants';

afterEach(() => {
  cleanup();
});

describe('RoundSetup', () => {
  beforeEach(() => {
    gameStore.reset();
    // Set up players for testing
    gameStore.addPlayer({ id: 1, name: 'Ana', avatar: '👩', color: '#FF6B6B', score: 0 });
    gameStore.addPlayer({ id: 2, name: 'Luis', avatar: '👨', color: '#4ECDC4', score: 0 });
    gameStore.addPlayer({ id: 3, name: 'Carmen', avatar: '🧑', color: '#45B7D1', score: 0 });
    gameStore.addPlayer({ id: 4, name: 'Pedro', avatar: '👴', color: '#96CEB4', score: 0 });
  });

  it('displays the correct round number', () => {
    render(RoundSetup);
    expect(screen.getByText('Ronda 1')).toBeTruthy();
  });

  it('displays the correct number of tricks for the round', () => {
    render(RoundSetup);
    expect(screen.getByText(`${ROUNDS[0]} bazas`)).toBeTruthy();
  });

  it('renders all suit options', () => {
    render(RoundSetup);
    Object.entries(SUITS).forEach(([key, suit]) => {
      expect(screen.getByText(suit.name)).toBeTruthy();
      expect(screen.getByText(suit.emoji)).toBeTruthy();
    });
  });

  it('renders all player options for mano selection', () => {
    render(RoundSetup);
    const players = getStoreValue().players;
    players.forEach(player => {
      expect(screen.getByText(player.name)).toBeTruthy();
      expect(screen.getByText(player.avatar)).toBeTruthy();
    });
  });

  it('disables start button when trump is not selected', () => {
    render(RoundSetup);
    const button = screen.getByRole('button', { name: /Empezar apuestas/ });
    expect(button.disabled).toBe(true);
  });

  it('selects a trump suit on click', async () => {
    render(RoundSetup);
    const suitButton = screen.getByText('Oros');
    await fireEvent.click(suitButton);
    
    const state = getStoreValue();
    expect(state.currentRound.trump).toBe('oros');
  });

  it('selects a mano player on click', async () => {
    render(RoundSetup);
    const playerButton = screen.getByText('Ana');
    await fireEvent.click(playerButton);
    
    const state = getStoreValue();
    expect(state.currentRound.mano).toBe(1);
  });

  it('enables start button when both trump and mano are selected', async () => {
    render(RoundSetup);
    
    // Select trump
    const suitButton = screen.getByText('Oros');
    await fireEvent.click(suitButton);
    
    // Select mano
    const playerButton = screen.getByText('Ana');
    await fireEvent.click(playerButton);
    
    const button = screen.getByRole('button', { name: /Empezar apuestas/ });
    expect(button.disabled).toBe(false);
  });

  it('changes phase to bidding when start button is clicked', async () => {
    render(RoundSetup);
    
    // Select trump
    const suitButton = screen.getByText('Oros');
    await fireEvent.click(suitButton);
    
    // Select mano
    const playerButton = screen.getByText('Ana');
    await fireEvent.click(playerButton);
    
    // Click start
    const button = screen.getByRole('button', { name: /Empezar apuestas/ });
    await fireEvent.click(button);
    
    const state = getStoreValue();
    expect(state.currentRound.phase).toBe(PHASES.BIDDING);
  });
});

function getStoreValue() {
  let value;
  const unsubscribe = gameStore.subscribe(v => { value = v; });
  unsubscribe();
  return value;
}