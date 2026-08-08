// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/svelte';
import BiddingPhase from './BiddingPhase.svelte';
import { gameStore } from '../stores/gameState';
import { ROUNDS, PHASES } from '../lib/constants';

afterEach(() => {
  cleanup();
});

describe('BiddingPhase', () => {
  beforeEach(() => {
    gameStore.reset();
    gameStore.addPlayer({ id: 1, name: 'Ana', avatar: '👩', color: '#FF6B6B', score: 0 });
    gameStore.addPlayer({ id: 2, name: 'Luis', avatar: '👨', color: '#4ECDC4', score: 0 });
    gameStore.addPlayer({ id: 3, name: 'Carmen', avatar: '🧑', color: '#45B7D1', score: 0 });
    gameStore.addPlayer({ id: 4, name: 'Pedro', avatar: '👴', color: '#96CEB4', score: 0 });
    gameStore.setTrump('oros');
    gameStore.setMano(1);
    gameStore.setPhase(PHASES.BIDDING);
  });

  it('displays the correct round number', () => {
    render(BiddingPhase);
    expect(screen.getByText('Ronda 1')).toBeTruthy();
  });

  it('displays the correct number of tricks', () => {
    render(BiddingPhase);
    expect(screen.getByText(`Bazas: ${ROUNDS[0]}`)).toBeTruthy();
  });

  it('displays trump and mano information', () => {
    render(BiddingPhase);
    expect(screen.getByText(/Oros/)).toBeTruthy();
    expect(screen.getByText(/Mano: Ana/)).toBeTruthy();
  });

  it('shows current bidder name and avatar', () => {
    render(BiddingPhase);
    expect(screen.getByText('Ana')).toBeTruthy();
    expect(screen.getByText('👩')).toBeTruthy();
  });

  it('renders bid buttons from 0 to tricksInRound', () => {
    render(BiddingPhase);
    const tricks = ROUNDS[0];
    for (let i = 0; i <= tricks; i++) {
      const buttons = screen.getAllByText(i.toString());
      expect(buttons.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('places a bid when button is clicked', async () => {
    render(BiddingPhase);
    const bidButtons = screen.getAllByText('1');
    const bidButton = bidButtons.find(el => el.tagName === 'BUTTON');
    await fireEvent.click(bidButton);
    
    const state = getStoreValue();
    expect(state.currentRound.bids).toHaveLength(1);
    expect(state.currentRound.bids[0]).toEqual({ playerId: 1, bid: 1 });
  });

  it('advances to next bidder after placing a bid', async () => {
    render(BiddingPhase);
    const bidButtons = screen.getAllByText('1');
    const bidButton = bidButtons.find(el => el.tagName === 'BUTTON');
    await fireEvent.click(bidButton);
    
    expect(screen.getByText('Luis')).toBeTruthy();
    expect(screen.getByText('👨')).toBeTruthy();
  });

  it('shows total after all bids are placed', async () => {
    render(BiddingPhase);
    
    const clickBid = async (value) => {
      const buttons = screen.getAllByText(value.toString());
      const btn = buttons.find(el => el.tagName === 'BUTTON');
      await fireEvent.click(btn);
    };
    
    await clickBid(0);
    await clickBid(0);
    await clickBid(0);
    await clickBid(1);
    
    expect(screen.getByText('Total:')).toBeTruthy();
  });

  it('shows error when total bids equals tricks in round', async () => {
    render(BiddingPhase);
    
    const clickBid = async (value) => {
      const buttons = screen.getAllByText(value.toString());
      const btn = buttons.find(el => el.tagName === 'BUTTON');
      await fireEvent.click(btn);
    };
    
    await clickBid(0);
    await clickBid(0);
    await clickBid(0);
    await clickBid(1);
    
    expect(screen.getByText('No puede ser 1')).toBeTruthy();
  });

  it('hides start button when total bids equals tricks', async () => {
    render(BiddingPhase);
    
    const clickBid = async (value) => {
      const buttons = screen.getAllByText(value.toString());
      const btn = buttons.find(el => el.tagName === 'BUTTON');
      await fireEvent.click(btn);
    };
    
    await clickBid(0);
    await clickBid(0);
    await clickBid(0);
    await clickBid(1);
    
    const startButton = screen.queryByRole('button', { name: /Comenzar juego/ });
    expect(startButton).toBeNull();
  });

  it('shows start button when total bids does not equal tricks', async () => {
    render(BiddingPhase);
    
    const clickBid = async (value) => {
      const buttons = screen.getAllByText(value.toString());
      const btn = buttons.find(el => el.tagName === 'BUTTON');
      await fireEvent.click(btn);
    };
    
    await clickBid(0);
    await clickBid(0);
    await clickBid(0);
    await clickBid(0);
    
    const startButton = screen.getByRole('button', { name: /Comenzar juego/ });
    expect(startButton).toBeTruthy();
  });

  it('changes phase to playing when start button is clicked', async () => {
    render(BiddingPhase);
    
    const clickBid = async (value) => {
      const buttons = screen.getAllByText(value.toString());
      const btn = buttons.find(el => el.tagName === 'BUTTON');
      await fireEvent.click(btn);
    };
    
    await clickBid(0);
    await clickBid(0);
    await clickBid(0);
    await clickBid(0);
    
    const startButton = screen.getByRole('button', { name: /Comenzar juego/ });
    await fireEvent.click(startButton);
    
    const state = getStoreValue();
    expect(state.currentRound.phase).toBe(PHASES.PLAYING);
  });

  it('hides bidder section when all bids are placed', async () => {
    render(BiddingPhase);
    
    const clickBid = async (value) => {
      const buttons = screen.getAllByText(value.toString());
      const btn = buttons.find(el => el.tagName === 'BUTTON');
      await fireEvent.click(btn);
    };
    
    await clickBid(0);
    await clickBid(0);
    await clickBid(0);
    await clickBid(0);
    
    const bidderSection = screen.queryByText('¿Cuántas bazas haces?');
    expect(bidderSection).toBeNull();
  });
});

function getStoreValue() {
  let value;
  const unsubscribe = gameStore.subscribe(v => { value = v; });
  unsubscribe();
  return value;
}
