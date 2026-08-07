// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/svelte';
import ScoreBoard from './ScoreBoard.svelte';
import { gameStore } from '../stores/gameState';

afterEach(() => {
  cleanup();
});

describe('ScoreBoard', () => {
  beforeEach(() => {
    gameStore.reset();
    gameStore.addPlayer({ id: 1, name: 'Ana', avatar: '👩', color: '#FF6B6B', score: 100 });
    gameStore.addPlayer({ id: 2, name: 'Luis', avatar: '👨', color: '#4ECDC4', score: 150 });
    gameStore.addPlayer({ id: 3, name: 'Carmen', avatar: '🧑', color: '#45B7D1', score: 75 });
    gameStore.addPlayer({ id: 4, name: 'Pedro', avatar: '👴', color: '#96CEB4', score: 120 });
  });

  it('displays the winner correctly', () => {
    render(ScoreBoard);
    expect(screen.getAllByText('Luis').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('150 puntos')).toBeTruthy();
  });

  it('displays all players sorted by score', () => {
    render(ScoreBoard);
    const playerNames = screen.getAllByText(/(Ana|Luis|Carmen|Pedro)/);
    expect(playerNames.length).toBeGreaterThanOrEqual(4);
    
    expect(screen.getByText('1º')).toBeTruthy();
    expect(screen.getByText('2º')).toBeTruthy();
    expect(screen.getByText('3º')).toBeTruthy();
    expect(screen.getByText('4º')).toBeTruthy();
  });

  it('applies gold class to first place', () => {
    render(ScoreBoard);
    const firstPlaceRow = screen.getByText('1º').closest('.player-row');
    expect(firstPlaceRow.classList.contains('gold')).toBe(true);
  });

  it('applies silver class to second place', () => {
    render(ScoreBoard);
    const secondPlaceRow = screen.getByText('2º').closest('.player-row');
    expect(secondPlaceRow.classList.contains('silver')).toBe(true);
  });

  it('applies bronze class to third place', () => {
    render(ScoreBoard);
    const thirdPlaceRow = screen.getByText('3º').closest('.player-row');
    expect(thirdPlaceRow.classList.contains('bronze')).toBe(true);
  });

  it('displays player scores', () => {
    render(ScoreBoard);
    expect(screen.getByText('150')).toBeTruthy();
    expect(screen.getByText('120')).toBeTruthy();
    expect(screen.getByText('100')).toBeTruthy();
    expect(screen.getByText('75')).toBeTruthy();
  });

  it('displays player avatars', () => {
    render(ScoreBoard);
    expect(screen.getAllByText('👩').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('👨').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('🧑').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('👴').length).toBeGreaterThanOrEqual(1);
  });

  it('shows new game button', () => {
    render(ScoreBoard);
    expect(screen.getByText('Nueva partida')).toBeTruthy();
  });

  it('allows clicking new game button', async () => {
    render(ScoreBoard);
    const button = screen.getByText('Nueva partida');
    expect(button).toBeTruthy();
    await fireEvent.click(button);
  });
});