// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/svelte';
import PlayerRegistration from './PlayerRegistration.svelte';
import { gameStore } from '../stores/gameState';
import { AVATARS, PLAYER_COLORS } from '../lib/constants';

vi.mock('../lib/voice', () => ({
  speak: vi.fn()
}));

let swipeLeftCallback;
vi.mock('../lib/swipe', () => ({
  setupSwipe: vi.fn((element, onSwipeLeft, onSwipeRight) => {
    swipeLeftCallback = onSwipeLeft;
    return { destroy: vi.fn() };
  })
}));

afterEach(() => {
  cleanup();
});

describe('PlayerRegistration', () => {
  beforeEach(() => {
    gameStore.reset();
  });

  it('shows current player number and total players', () => {
    render(PlayerRegistration);
    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('/')).toBeTruthy();
    expect(screen.getByText('4')).toBeTruthy();
  });

  it('renders all avatar options', () => {
    render(PlayerRegistration);
    AVATARS.forEach(avatar => {
      expect(screen.getByText(avatar)).toBeTruthy();
    });
  });

  it('selects different avatar on click', async () => {
    render(PlayerRegistration);
    const secondAvatar = screen.getByText(AVATARS[1]);
    await fireEvent.click(secondAvatar);
    expect(secondAvatar.classList.contains('selected')).toBe(true);
  });

  it('renders color options', () => {
    render(PlayerRegistration);
    const colorButtons = document.querySelectorAll('.color-btn');
    expect(colorButtons.length).toBe(PLAYER_COLORS.length);
  });

  it('renders virtual keyboard with all letters', () => {
    render(PlayerRegistration);
    const allKeys = ['Q','W','E','R','T','Y','U','I','O','P',
                     'A','S','D','F','G','H','J','K','L','Ñ',
                     'Z','X','C','V','B','N','M'];
    allKeys.forEach(key => {
      expect(screen.getByRole('button', { name: key })).toBeTruthy();
    });
  });

  it('renders 4 nick slots', () => {
    render(PlayerRegistration);
    const slots = document.querySelectorAll('.nick-slot');
    expect(slots.length).toBe(4);
  });

  it('fills nick slot when key is pressed', async () => {
    render(PlayerRegistration);
    const slots = document.querySelectorAll('.nick-slot');
    const qKey = screen.getByRole('button', { name: 'Q' });
    await fireEvent.click(qKey);
    expect(slots[0].textContent.trim()).toBe('Q');
  });

  it('advances to next slot after key press', async () => {
    render(PlayerRegistration);
    const slots = document.querySelectorAll('.nick-slot');
    const qKey = screen.getByRole('button', { name: 'Q' });
    await fireEvent.click(qKey);
    expect(slots[0].classList.contains('active')).toBe(false);
    expect(slots[1].classList.contains('active')).toBe(true);
  });

  it('backspace clears last filled slot', async () => {
    render(PlayerRegistration);
    const slots = document.querySelectorAll('.nick-slot');
    const qKey = screen.getByRole('button', { name: 'Q' });
    const backspace = screen.getByText('⌫');
    
    await fireEvent.click(qKey);
    await fireEvent.click(backspace);
    
    expect(slots[0].textContent.trim()).toBe('');
    expect(slots[0].classList.contains('active')).toBe(true);
  });

  it('fills all 4 slots with keyboard', async () => {
    render(PlayerRegistration);
    const slots = document.querySelectorAll('.nick-slot');
    
    await fireEvent.click(screen.getByRole('button', { name: 'A' }));
    await fireEvent.click(screen.getByRole('button', { name: 'N' }));
    await fireEvent.click(screen.getByRole('button', { name: 'A' }));
    await fireEvent.click(screen.getByRole('button', { name: 'S' }));
    
    expect(slots[0].textContent.trim()).toBe('A');
    expect(slots[1].textContent.trim()).toBe('N');
    expect(slots[2].textContent.trim()).toBe('A');
    expect(slots[3].textContent.trim()).toBe('S');
  });

  it('does not fill beyond 4 slots', async () => {
    render(PlayerRegistration);
    const slots = document.querySelectorAll('.nick-slot');
    
    await fireEvent.click(screen.getByRole('button', { name: 'A' }));
    await fireEvent.click(screen.getByRole('button', { name: 'B' }));
    await fireEvent.click(screen.getByRole('button', { name: 'C' }));
    await fireEvent.click(screen.getByRole('button', { name: 'D' }));
    await fireEvent.click(screen.getByRole('button', { name: 'E' }));
    
    expect(slots[3].textContent.trim()).toBe('D');
  });

  it('first slot is highlighted by default', () => {
    render(PlayerRegistration);
    const slots = document.querySelectorAll('.nick-slot');
    expect(slots[0].classList.contains('active')).toBe(true);
  });

  it('registers player to store on swipe left when all slots filled and last player', async () => {
    render(PlayerRegistration, { totalPlayers: 1 });
    
    await fireEvent.click(screen.getByRole('button', { name: 'A' }));
    await fireEvent.click(screen.getByRole('button', { name: 'N' }));
    await fireEvent.click(screen.getByRole('button', { name: 'A' }));
    await fireEvent.click(screen.getByRole('button', { name: 'S' }));
    
    swipeLeftCallback();
    
    const state = getStoreValue();
    expect(state.players).toHaveLength(1);
    expect(state.players[0].name).toBe('ANAS');
  });
});

function getStoreValue() {
  let value;
  const unsubscribe = gameStore.subscribe(v => { value = v; });
  unsubscribe();
  return value;
}
