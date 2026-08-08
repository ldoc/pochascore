// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/svelte';
import PlayerRegistration from './PlayerRegistration.svelte';
import { gameStore } from '../stores/gameState';
import { AVATARS, PLAYER_COLORS } from '../lib/constants';

afterEach(() => {
  cleanup();
});

describe('PlayerRegistration', () => {
  beforeEach(() => {
    gameStore.reset();
  });

  it('shows current player number and total players', () => {
    render(PlayerRegistration);
    expect(screen.getByText(/Jugador 1 de 4/)).toBeTruthy();
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

  it('disables register button when name is empty', () => {
    render(PlayerRegistration);
    const button = screen.getByRole('button', { name: /Siguiente jugador/ });
    expect(button.disabled).toBe(true);
  });

  it('disables register button when name is too long', async () => {
    render(PlayerRegistration);
    const input = screen.getByPlaceholderText('Nombre');
    await fireEvent.input(input, { target: { value: 'ABCDE' } });
    const button = screen.getByRole('button', { name: /Siguiente jugador/ });
    expect(button.disabled).toBe(true);
  });

  it('enables register button with valid name (2-4 chars)', async () => {
    render(PlayerRegistration);
    const input = screen.getByPlaceholderText('Nombre');
    await fireEvent.input(input, { target: { value: 'Ana' } });
    const button = screen.getByRole('button', { name: /Siguiente jugador/ });
    expect(button.disabled).toBe(false);
  });

  it('registers player and resets for next', async () => {
    render(PlayerRegistration);
    const input = screen.getByPlaceholderText('Nombre');
    await fireEvent.input(input, { target: { value: 'Ana' } });
    const button = screen.getByRole('button', { name: /Siguiente jugador/ });
    await fireEvent.click(button);

    const state = getStoreValue();
    expect(state.players).toHaveLength(1);
    expect(state.players[0].name).toBe('Ana');
    expect(screen.getByText(/Jugador 2 de 4/)).toBeTruthy();
  });

  it('adds player with avatar and color from store', async () => {
    render(PlayerRegistration);
    const input = screen.getByPlaceholderText('Nombre');
    await fireEvent.input(input, { target: { value: 'Ana' } });
    const button = screen.getByRole('button', { name: /Siguiente jugador/ });
    await fireEvent.click(button);

    const state = getStoreValue();
    expect(state.players[0].avatar).toBe(AVATARS[0]);
    expect(state.players[0].color).toBe(PLAYER_COLORS[0]);
  });

  it('shows "Comenzar partida" on last player', async () => {
    render(PlayerRegistration);

    for (let i = 0; i < 3; i++) {
      const input = screen.getByPlaceholderText('Nombre');
      await fireEvent.input(input, { target: { value: `P${i + 1}` } });
      const button = screen.getByText('Siguiente jugador');
      await fireEvent.click(button);
    }

    // After 3 registrations, currentPlayerIndex=3, totalPlayers=4, isLastPlayer=false
    // Button still shows "Siguiente jugador"
    const input = screen.getByPlaceholderText('Nombre');
    await fireEvent.input(input, { target: { value: 'P4' } });
    const button = screen.getByText('Siguiente jugador');
    await fireEvent.click(button);

    // After 4th click, currentPlayerIndex=4, totalPlayers=4, isLastPlayer=true
    const nextButton = screen.getByText('Comenzar partida');
    expect(nextButton).toBeTruthy();
  });

  it('registers all players after completing registration', async () => {
    render(PlayerRegistration);

    for (let i = 0; i < 4; i++) {
      const input = screen.getByPlaceholderText('Nombre');
      await fireEvent.input(input, { target: { value: `P${i + 1}` } });
      const button = screen.getByText('Siguiente jugador');
      await fireEvent.click(button);
    }

    const state = getStoreValue();
    expect(state.players).toHaveLength(4);
    expect(state.players.map(p => p.name)).toEqual(['P1', 'P2', 'P3', 'P4']);
  });
});

function getStoreValue() {
  let value;
  const unsubscribe = gameStore.subscribe(v => { value = v; });
  unsubscribe();
  return value;
}
