# Pochascore - Design Document

## Overview

Pochascore es una aplicación web mobile-first para facilitar el juego de la Pocha. Guía a los jugadores en las distintas fases del juego y lleva el conteo de puntos por jugador.

**Objetivo:** Simplificar la experiencia de juego de Pocha en un solo dispositivo móvil en el centro de la mesa.

## Technical Stack

- **Framework:** Svelte + Vite
- **Persistencia:** localStorage
- **Backend:** Ninguno (100% frontend)
- **Diseño:** Mobile-first, tema oscuro

## Game Rules Summary

### Baraja
- Baraja española de 40 cartas (sin 8, 9 ni 10)
- 4 palos: Oros, Copas, Espadas, Bastos

### Objetivo
- Cada ronda, los jugadores apuestan el número de bazas que creen que van a realizar
- Se puntúa al final de cada ronda

### Puntuación
- **Acertar:** 10 + (bazas × 5) puntos
- **Fallar:** -5 × |apuesta - real| puntos
- **Pocha:** Si 6+ cartas y se hacen todas las bazas = doble puntuación
- **Renuncio:** -50 puntos (no seguir el palo cuando se puede)

### Rondas (variante clásica)
```
1,1,1,1,2,3,4,5,6,7,8,9,10,10,10,10,
S,S,S,S,9,8,7,6,5,4,3,2,I,I,I,I
```
- S = Subastadas (subasta de triunfo)
- I = India (carta en la frente)
- El número de rondas debe ser múltiplo de 4

## Architecture

### Component Structure

```
src/
├── App.svelte                    # Entry point, global state management
├── stores/
│   └── gameState.js              # Main game state store
├── components/
│   ├── WelcomeScreen.svelte      # Start screen (resume/new game)
│   ├── GameSetup.svelte          # Configure players (2-10)
│   ├── PlayerRegistration.svelte # Player identification (avatar, color, name)
│   ├── TablePosition.svelte      # Circular table, touch to sit
│   ├── RoundSetup.svelte         # Start round: trump + mano
│   ├── BiddingPhase.svelte       # Bidding phase
│   ├── PlayingPhase.svelte       # Play phase (count tricks)
│   ├── ScoringPhase.svelte       # Round scoring
│   └── ScoreBoard.svelte         # General scoreboard
```

### Game Flow

```
WelcomeScreen → GameSetup → PlayerRegistration → TablePosition → 
RoundSetup → BiddingPhase → PlayingPhase → ScoringPhase → (repeat) → ScoreBoard
```

## State Management

### Game State Structure

```javascript
{
  // Game configuration
  variant: 'classica',
  totalRounds: 32,  // ROUNDS.length
  
  // Players
  players: [
    {
      id: 1,
      name: 'Ana',
      avatar: '👩',
      color: '#FF6B6B',
      position: 0,        // Position on table (0-9)
      score: 0            // Accumulated score
    }
  ],
  
  // Current round
  currentRound: {
    number: 1,            // Round number (1-30)
    tricksInRound: 1,     // Tricks to play in this round
    trump: null,          // Selected trump suit
    mano: null,           // Mano player ID
    phase: 'setup',       // 'setup' | 'bidding' | 'playing' | 'scoring'
    
    // Bids
    bids: [
      { playerId: 1, bid: 1 },
      { playerId: 2, bid: 0 }
    ],
    
    // Tricks taken
    tricks: [
      { playerId: 1, taken: 1 },
      { playerId: 2, taken: 0 }
    ],
    
    // Game state
    currentTrick: 1,      // Current trick
    tricksPlayed: 0       // Completed tricks
  },
  
  // History
  history: [
    {
      round: 1,
      trump: 'oros',
      mano: 1,
      bids: [...],
      tricks: [...],
      scores: [...]
    }
  ],
  
  // Persistence
  lastSaved: '2025-08-07T10:30:00',
  gameId: 'abc123'
}
```

### Suits

```javascript
const SUITS = {
  oros: { name: 'Oros', emoji: '🪙', color: '#FFD700' },
  copas: { name: 'Copas', emoji: '🏆', color: '#FF6B6B' },
  espadas: { name: 'Espadas', emoji: '⚔️', color: '#4ECDC4' },
  bastos: { name: 'Bastos', emoji: '🪵', color: '#45B7D1' }
};
```

## Component Details

### WelcomeScreen
- Button: "Nueva partida"
- Button: "Recuperar partida" (if saved game exists)

### GameSetup
- Player count selector: 2-10
- "Comenzar" button

### PlayerRegistration
- For each player:
  - Avatar selection (emoji grid)
  - Color selection (preset palette)
  - Name input (2-4 characters)
- Confirmation when all registered

### TablePosition
- Circular table in center
- 2-10 seats around table
- Touch to claim seat
- Seats illuminate with player color
- Clockwise order

### RoundSetup
- Header: "Ronda X - Y bazas"
- Trump selector: 4 large buttons (🪙🏆⚔️🪵)
- Mano selector: player list with avatar

### BiddingPhase
- Header: "¿Cuántas bazas haces?"
- For each player: buttons 0-10
- Real-time bid summary
- Validation: sum ≠ tricks in round

### PlayingPhase
- Header: "Fase de juego"
- Info: current trump, mano, current trick
- Counter: tricks taken +/- per player

### ScoringPhase
- Scoring table
- Highlight round winner/loser
- "Siguiente ronda" button

### ScoreBoard
- Final scoreboard with all players
- Winner highlighted
- "Nueva partida" option

## UI/UX Design

### Color Palette

```javascript
const COLORS = {
  background: '#1a1a2e',    // Dark background
  surface: '#16213e',       // Surfaces
  primary: '#0f3460',       // Primary elements
  accent: '#e94560',        // Accents/alerts
  text: '#ffffff',          // Main text
  textSecondary: '#a0a0a0'  // Secondary text
};
```

### Avatars

```javascript
const AVATARS = [
  '👨', '👩', '🧑', '👴', '👵',
  '🎅', '🧛', '🤠', '🤴', '👸',
  '🦸', '🦹', '🧙', '🧝', '🧟'
];
```

### Layout

- Mobile-first, full screen
- Dark theme for game night atmosphere
- Large touch targets for table interaction
- Clear visual hierarchy

## Persistence Strategy

### Storage

```javascript
const STORAGE_KEY = 'pochascore_current_game';
const HISTORY_KEY = 'pochascore_game_history';
```

### Save Triggers
- Phase change (setup → bidding → playing → scoring)
- Round completion
- Manual save (if added)
- beforeunload event

### Functions

```javascript
function saveGame(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    ...state,
    lastSaved: new Date().toISOString()
  }));
}

function loadGame() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

function clearGame() {
  localStorage.removeItem(STORAGE_KEY);
}

function hasSavedGame() {
  return localStorage.getItem(STORAGE_KEY) !== null;
}
```

### Recovery Flow

```
WelcomeScreen
  │
  ├─→ "Nueva partida"
  │     → clearGame() → GameSetup
  │
  └─→ "Recuperar partida"
        → loadGame()
        → If exists: continue where left off
        → If not: show error → GameSetup
```

### Error Handling

| Situation | Behavior |
|-----------|----------|
| localStorage unavailable | No persistence mode, notify user |
| Corrupted data | Delete and start new game |
| Storage limit reached | Warn, offer to delete history |

## Validation Rules

| Phase | Validation |
|-------|------------|
| Bidding | Sum of bids ≠ tricks in round |
| Bidding | Bid ≤ tricks in round |
| Playing | Count tricks correctly |
| Scoring | Calculate points according to rules |

## Future Considerations

- Multiple game variants (subastadas, indias)
- Export/import game history
- Sound effects
- Dark/light theme toggle
- Multiplayer via WebSocket (future)
