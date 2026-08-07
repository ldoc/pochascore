# Pochascore - UI Redesign Design Document

## Overview

Rediseño de la interfaz de usuario de Pochascore para crear una experiencia visual más atractiva y moderna, con estilo "juego de mesa moderno", animaciones flip entre paneles y layout consistente por fases.

## Design Goals

- Estilo visual "juego de mesa moderno" (colores planos, gradientes sutiles)
- Colores oscuros elegantes (azul marino, gris carbón, dorado)
- Animaciones flip como cartas entre fases
- Un panel completo por fase del juego
- Mobile-first, optimizado para dispositivos táctiles

## Tech Stack

- **CSS Framework:** Tailwind CSS
- **Animations:** CSS custom animations (flip effect)
- **Icons:** Emojis nativos
- **Build:** Vite

## Color Palette

### Primary Colors
```css
:root {
  /* Fondos */
  --bg-primary: #1e293b;      /* Azul marino profundo */
  --bg-secondary: #334155;    /* Gris carbón */
  --bg-surface: #475569;      /* Superficies elevadas */
  
  /* Acentos */
  --accent-gold: #f59e0b;     /* Dorado - principal */
  --accent-emerald: #10b981;  /* Verde - éxito/puntos positivos */
  --accent-rose: #f43f5e;     /* Rojo - error/alerta/puntos negativos */
  
  /* Texto */
  --text-primary: #f8fafc;    /* Blanco hueso */
  --text-secondary: #94a3b8;  /* Gris claro */
  
  /* Bordes y sombras */
  --border: #64748b;          /* Bordes sutiles */
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
}
```

### Gradients
```css
--gradient-primary: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
--gradient-gold: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
```

### Color Usage
- **Puntos positivos:** accent-emerald (#10b981)
- **Puntos negativos:** accent-rose (#f43f5e)
- **Triunfo/mano:** accent-gold (#f59e0b)
- **Acciones principales:** accent-gold
- **Acciones secundarias:** bg-surface con borde

## Animation System

### Flip Animation
Cada transición entre fases utiliza un efecto flip horizontal:

```css
/* Contenedor con perspective */
.flip-container {
  perspective: 1000px;
}

/* Panel que gira */
.flip-panel {
  transform-style: preserve-3d;
  transition: transform 0.6s ease-in-out;
}

/* Girar 180° */
.flip-panel.flipped {
  transform: rotateY(180deg);
}

/* Frente y dorso */
.flip-front, .flip-back {
  backface-visibility: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
}

.flip-back {
  transform: rotateY(180deg);
}
```

### Animation Parameters
- **Duration:** 0.6 seconds
- **Easing:** ease-in-out (suave al inicio y final)
- **Eje:** Horizontal (rotateY)
- **Perspective:** 1000px (profundidad)

### Interaction Animations
- **Hover:** Transform ligero (rotateY 5deg)
- **Click:** Toggle flip
- **Transiciones de fase:** Flip completo 180°

## Layout System

### Panel Structure
Cada fase del juego es un panel completo que ocupa toda la pantalla:

```
┌─────────────────────────────┐
│          HEADER             │
│  Info de ronda, triunfo     │
├─────────────────────────────┤
│                             │
│         CONTENIDO           │
│  Interacción principal      │
│                             │
├─────────────────────────────┤
│          FOOTER             │
│  Acciones principales       │
└─────────────────────────────┘
```

### Panel Components

#### Header
- **Posición:** Fijo arriba
- **Contenido:** Info contextual (ronda, triunfo, mano)
- **Estilo:** bg-secondary con borde inferior

#### Contenido
- **Posición:** Flexible, ocupa espacio disponible
- **Contenido:** Interacción principal de la fase
- **Estilo:** bg-primary con padding

#### Footer
- **Posición:** Fijo abajo
- **Contenido:** Acciones (botones principales)
- **Estilo:** bg-secondary con borde superior

### Responsive Breakpoints
- **Mobile:** < 640px (diseño principal)
- **Tablet:** 640px - 1024px (adaptaciones menores)
- **Desktop:** > 1024px (no es prioridad)

## Component Designs

### WelcomeScreen
- Logo animado (🃏)
- Título "Pochascore"
- Subtítulo "Tu marcador de Pocha"
- Botón primario: "Nueva partida"
- Botón secundario: "Recuperar partida"

### GameSetup
- Selector de número de jugadores (2-10)
- Botones +/- con animación de conteo
- Botón "Comenzar"

### PlayerRegistration
- Grid de avatares (emojis)
- Selector de colores
- Input de nombre (2-4 caracteres)
- Botón "Siguiente jugador" / "Comenzar partida"

### TablePosition
- Mesa circular en centro
- Asientos alrededor (touch para sentarse)
- Asientos iluminados con color del jugador
- Orden horario

### RoundSetup
- Header: "Ronda X - Y bazas"
- Selector de triunfo (4 botones grandes con emojis)
- Selector de mano (lista de jugadores)
- Botón "Empezar apuestas"

### BiddingPhase
- Header: Info de ronda + triunfo
- Player actual con avatar grande
- Botones de apuesta (0 a Y bazas)
- Resumen de apuestas
- Botón "Siguiente jugador"

### PlayingPhase
- Header: Info de ronda + triunfo + mano
- Player actual con avatar grande
- Contador de bazas (+/-)
- Resumen de bazas
- Botón "Calcular puntos"

### ScoringPhase
- Header: "Puntuación Ronda X"
- Tabla de puntuación (jugador, apuesta, bazas, puntos, total)
- Colores por resultado (verde/rojo)
- Botón "Siguiente ronda" / "Ver resultado final"

### ScoreBoard
- Header: "🏆 Resultado Final"
- Ganador destacado (gradiente dorado)
- Lista ordenada de jugadores
- Botón "Nueva partida"

## Implementation Approach

### Phase 1: Setup Tailwind CSS
- Instalar Tailwind CSS
- Configurar colores personalizados
- Configurar dark mode

### Phase 2: Create CSS Animations
- Crear animación flip
- Crear animaciones de interacción
- Crear transiciones de fase

### Phase 3: Update Components
- Actualizar cada componente con Tailwind
- Aplicar layout de panel
- Integrar animaciones flip

### Phase 4: Testing
- Probar en dispositivos móviles
- Verificar accesibilidad
- Optimizar rendimiento

## Files to Modify

```
src/
├── App.svelte                    # Actualizar con transiciones flip
├── app.css                       # Agregar Tailwind + custom CSS
├── tailwind.config.js            # Configurar Tailwind
├── components/
│   ├── WelcomeScreen.svelte      # Rediseñar
│   ├── GameSetup.svelte          # Rediseñar
│   ├── PlayerRegistration.svelte # Rediseñar
│   ├── TablePosition.svelte      # Rediseñar
│   ├── RoundSetup.svelte         # Rediseñar
│   ├── BiddingPhase.svelte       # Rediseñar
│   ├── PlayingPhase.svelte       # Rediseñar
│   ├── ScoringPhase.svelte       # Rediseñar
│   └── ScoreBoard.svelte         # Rediseñar
```

## Success Criteria

- [ ] Tailwind CSS configurado correctamente
- [ ] Paleta de colores aplicada consistente
- [ ] Animaciones flip funcionando entre fases
- [ ] Layout de panel consistente en todas las fases
- [ ] Mobile-first responsive
- [ ] Accesibilidad básica (contraste, navegación)
- [ ] Rendimiento óptimo (sin lag en animaciones)
