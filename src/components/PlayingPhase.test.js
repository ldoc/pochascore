// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/svelte';
import PlayingPhase from './PlayingPhase.svelte';
import { gameStore } from '../stores/gameState';
import { ROUNDS, PHASES } from '../lib/constants';

afterEach(() => {
  cleanup();
});

describe('PlayingPhase', () => {
  beforeEach(() => {
    gameStore.reset();
    gameStore.addPlayer({ id: 1, name: 'Ana', avatar: '👩', color: '#FF6B6B', score: 0 });
    gameStore.addPlayer({ id: 2, name: 'Luis', avatar: '👨', color: '#4ECDC4', score: 0 });
    gameStore.addPlayer({ id: 3, name: 'Carmen', avatar: '🧑', color: '#45B7D1', score: 0 });
    gameStore.addPlayer({ id: 4, name: 'Pedro', avatar: '👴', color: '#96CEB4', score: 0 });
    gameStore.setTrump('oros');
    gameStore.setMano(1);
    gameStore.setPhase(PHASES.PLAYING);
  });

  it('displays the correct phase title', () => {
    render(PlayingPhase);
    expect(screen.getByText('Fase de juego')).toBeTruthy();
  });

  it('displays trump and mano information', () => {
    render(PlayingPhase);
    expect(screen.getByText(/Oros/)).toBeTruthy();
    expect(screen.getByText(/Mano: Ana/)).toBeTruthy();
  });

  it('displays the correct number of tricks', () => {
    render(PlayingPhase);
    expect(screen.getByText(`Bazas: ${ROUNDS[0]}`)).toBeTruthy();
  });

  it('shows current player name and avatar', () => {
    render(PlayingPhase);
    expect(screen.getByText('Ana')).toBeTruthy();
    expect(screen.getByText('👩')).toBeTruthy();
  });

  it('renders trick buttons from 0 to tricksInRound', () => {
    render(PlayingPhase);
    const tricks = ROUNDS[0];
    for (let i = 0; i <= tricks; i++) {
      const buttons = screen.getAllByText(i.toString());
      expect(buttons.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('records tricks when button is clicked', async () => {
    render(PlayingPhase);
    const trickButtons = screen.getAllByText('1');
    const trickButton = trickButtons.find(el => el.tagName === 'BUTTON');
    await fireEvent.click(trickButton);
    
    const state = getStoreValue();
    expect(state.currentRound.tricks).toHaveLength(1);
    expect(state.currentRound.tricks[0]).toEqual({ playerId: 1, taken: 1 });
  });

  it('advances to next player after recording tricks', async () => {
    render(PlayingPhase);
    const trickButtons = screen.getAllByText('1');
    const trickButton = trickButtons.find(el => el.tagName === 'BUTTON');
    await fireEvent.click(trickButton);
    
    expect(screen.getByText('Luis')).toBeTruthy();
    expect(screen.getByText('👨')).toBeTruthy();
  });

  it('shows recorded tricks in summary', async () => {
    render(PlayingPhase);
    const trickButtons = screen.getAllByText('1');
    const trickButton = trickButtons.find(el => el.tagName === 'BUTTON');
    await fireEvent.click(trickButton);
    
    expect(screen.getByText('Bazas contadas')).toBeTruthy();
    const trickValues = screen.getAllByText('1');
    expect(trickValues.length).toBeGreaterThanOrEqual(2);
  });

  it('hides counter section when all tricks are counted', async () => {
    render(PlayingPhase);
    
    const clickTrick = async (value) => {
      const buttons = screen.getAllByText(value.toString());
      const btn = buttons.find(el => el.tagName === 'BUTTON');
      await fireEvent.click(btn);
    };
    
    await clickTrick(0);
    await clickTrick(0);
    await clickTrick(0);
    await clickTrick(1);
    
    const counterSection = screen.queryByText('¿Cuántas bazas has hecho?');
    expect(counterSection).toBeNull();
  });

  it('shows finish button when all tricks are counted', async () => {
    render(PlayingPhase);
    
    const clickTrick = async (value) => {
      const buttons = screen.getAllByText(value.toString());
      const btn = buttons.find(el => el.tagName === 'BUTTON');
      await fireEvent.click(btn);
    };
    
    await clickTrick(0);
    await clickTrick(0);
    await clickTrick(0);
    await clickTrick(1);
    
    const finishButton = screen.getByRole('button', { name: /Calcular puntos/ });
    expect(finishButton).toBeTruthy();
  });

  it('shows total tricks after all players have counted', async () => {
    render(PlayingPhase);
    
    const clickTrick = async (value) => {
      const buttons = screen.getAllByText(value.toString());
      const btn = buttons.find(el => el.tagName === 'BUTTON');
      await fireEvent.click(btn);
    };
    
    await clickTrick(0);
    await clickTrick(0);
    await clickTrick(0);
    await clickTrick(1);
    
    expect(screen.getByText('Total bazas:')).toBeTruthy();
  });

  it('shows error when total tricks does not equal tricks in round', async () => {
    // Set up round 5 (tricksInRound = 2) to have enough buttons
    gameStore.update(state => ({
      ...state,
      currentRound: { ...state.currentRound, number: 5, tricksInRound: 2 }
    }));
    render(PlayingPhase);
    
    const clickTrick = async (value) => {
      const buttons = screen.getAllByText(value.toString());
      const btn = buttons.find(el => el.tagName === 'BUTTON');
      await fireEvent.click(btn);
    };
    
    await clickTrick(0);
    await clickTrick(0);
    await clickTrick(0);
    await clickTrick(0);
    
    expect(screen.getByText('Debe ser 2')).toBeTruthy();
  });

  it('changes phase to scoring when finish button is clicked', async () => {
    render(PlayingPhase);
    
    const clickTrick = async (value) => {
      const buttons = screen.getAllByText(value.toString());
      const btn = buttons.find(el => el.tagName === 'BUTTON');
      await fireEvent.click(btn);
    };
    
    await clickTrick(0);
    await clickTrick(0);
    await clickTrick(0);
    await clickTrick(1);
    
    const finishButton = screen.getByRole('button', { name: /Calcular puntos/ });
    await fireEvent.click(finishButton);
    
    const state = getStoreValue();
    expect(state.currentRound.phase).toBe(PHASES.SCORING);
  });

  it('allows recording different trick counts', async () => {
    render(PlayingPhase);
    
    const clickTrick = async (value) => {
      const buttons = screen.getAllByText(value.toString());
      const btn = buttons.find(el => el.tagName === 'BUTTON');
      await fireEvent.click(btn);
    };
    
    await clickTrick(0);
    await clickTrick(1);
    await clickTrick(0);
    await clickTrick(0);
    
    const state = getStoreValue();
    expect(state.currentRound.tricks).toEqual([
      { playerId: 1, taken: 0 },
      { playerId: 2, taken: 1 },
      { playerId: 3, taken: 0 },
      { playerId: 4, taken: 0 }
    ]);
  });
});

function getStoreValue() {
  let value;
  const unsubscribe = gameStore.subscribe(v => { value = v; });
  unsubscribe();
  return value;
}
