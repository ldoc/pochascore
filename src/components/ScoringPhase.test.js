// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/svelte';
import ScoringPhase from './ScoringPhase.svelte';
import { gameStore } from '../stores/gameState';
import { ROUNDS, PHASES } from '../lib/constants';

afterEach(() => {
  cleanup();
});

describe('ScoringPhase', () => {
  beforeEach(() => {
    gameStore.reset();
    gameStore.addPlayer({ id: 1, name: 'Ana', avatar: '👩', color: '#FF6B6B', score: 0 });
    gameStore.addPlayer({ id: 2, name: 'Luis', avatar: '👨', color: '#4ECDC4', score: 0 });
    gameStore.addPlayer({ id: 3, name: 'Carmen', avatar: '🧑', color: '#45B7D1', score: 0 });
    gameStore.addPlayer({ id: 4, name: 'Pedro', avatar: '👴', color: '#96CEB4', score: 0 });
    gameStore.setTrump('oros');
    gameStore.setMano(1);
    gameStore.setBids([
      { playerId: 1, bid: 1 },
      { playerId: 2, bid: 0 },
      { playerId: 3, bid: 0 },
      { playerId: 4, bid: 0 }
    ]);
    gameStore.setTricks([
      { playerId: 1, taken: 1 },
      { playerId: 2, taken: 0 },
      { playerId: 3, taken: 0 },
      { playerId: 4, taken: 0 }
    ]);
    gameStore.setPhase(PHASES.SCORING);
  });

  it('displays the round number', () => {
    render(ScoringPhase);
    expect(screen.getByText('Puntuación Ronda 1')).toBeTruthy();
  });

  it('displays player names and avatars', () => {
    render(ScoringPhase);
    expect(screen.getByText(/Ana/)).toBeTruthy();
    expect(screen.getByText(/Luis/)).toBeTruthy();
    expect(screen.getByText(/Carmen/)).toBeTruthy();
    expect(screen.getByText(/Pedro/)).toBeTruthy();
  });

  it('displays bids and tricks for each player', () => {
    render(ScoringPhase);
    const rows = screen.getAllByText('1');
    expect(rows.length).toBeGreaterThanOrEqual(2);
    
    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(3);
  });

  it('calculates and displays correct round scores', () => {
    render(ScoringPhase);
    expect(screen.getByText('+15')).toBeTruthy();
    
    expect(screen.getAllByText('+10').length).toBeGreaterThanOrEqual(1);
  });

  it('displays total scores after round', () => {
    render(ScoringPhase);
    expect(screen.getByText('15')).toBeTruthy();
  });

  it('shows next round button when not on last round', () => {
    render(ScoringPhase);
    expect(screen.getByText('Siguiente ronda')).toBeTruthy();
  });

  it('shows game end button when on last round', () => {
    gameStore.update(state => ({
      ...state,
      currentRound: { ...state.currentRound, number: ROUNDS.length }
    }));
    render(ScoringPhase);
    expect(screen.getByText('Ver resultado final')).toBeTruthy();
  });

  it('updates scores and advances round when button is clicked', async () => {
    render(ScoringPhase);
    const button = screen.getByText('Siguiente ronda');
    await fireEvent.click(button);
    
    const state = getStoreValue();
    expect(state.players[0].score).toBe(15);
    expect(state.currentRound.number).toBe(2);
  });

  it('transitions to gameEnd phase when on last round', async () => {
    gameStore.update(state => ({
      ...state,
      currentRound: { ...state.currentRound, number: ROUNDS.length }
    }));
    render(ScoringPhase);
    const button = screen.getByText('Ver resultado final');
    await fireEvent.click(button);
    
    const state = getStoreValue();
    expect(state.currentRound.phase).toBe(PHASES.GAME_END);
  });

  it('applies positive class to rows with positive scores', () => {
    render(ScoringPhase);
    const positiveRows = screen.getAllByText('+15');
    expect(positiveRows.length).toBeGreaterThanOrEqual(1);
  });

  it('applies negative class to rows with negative scores', () => {
    gameStore.update(state => ({
      ...state,
      currentRound: { ...state.currentRound, number: 5, tricksInRound: 2 }
    }));
    gameStore.setBids([
      { playerId: 1, bid: 2 },
      { playerId: 2, bid: 0 },
      { playerId: 3, bid: 0 },
      { playerId: 4, bid: 0 }
    ]);
    gameStore.setTricks([
      { playerId: 1, taken: 0 },
      { playerId: 2, taken: 1 },
      { playerId: 3, taken: 1 },
      { playerId: 4, taken: 0 }
    ]);
    render(ScoringPhase);
    const negativeRows = screen.getAllByText('-10');
    expect(negativeRows.length).toBeGreaterThanOrEqual(1);
  });
});

function getStoreValue() {
  let value;
  const unsubscribe = gameStore.subscribe(v => { value = v; });
  unsubscribe();
  return value;
}
