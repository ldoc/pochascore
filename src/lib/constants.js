export const SUITS = {
  oros: { name: 'Oros', emoji: '🪙', color: '#FFD700' },
  copas: { name: 'Copas', emoji: '🏆', color: '#FF6B6B' },
  espadas: { name: 'Espadas', emoji: '⚔️', color: '#4ECDC4' },
  bastos: { name: 'Bastos', emoji: '🪵', color: '#45B7D1' }
};

export const AVATARS = [
  '👨', '👩', '🧑', '👴', '👵',
  '🎅', '🧛', '🤠', '🤴', '👸',
  '🦸', '🦹', '🧙', '🧝', '🧟'
];

export const PLAYER_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9'
];

export const ROUNDS = [
  1, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  10, 10, 10, 10, 'S', 'S', 'S', 'S',
  9, 8, 7, 6, 5, 4, 3, 2, 'I', 'I', 'I', 'I'
];

export const PHASES = {
  WELCOME: 'welcome',
  SETUP: 'setup',
  REGISTRATION: 'registration',
  POSITIONING: 'positioning',
  ROUND_SETUP: 'roundSetup',
  BIDDING: 'bidding',
  PLAYING: 'playing',
  SCORING: 'scoring',
  GAME_END: 'gameEnd'
};
