# PochaScore - Rediseño UI/UX

## Visión General

Rediseño completo de la interfaz de PochaScore con un enfoque mobile-first, navegación por gestos (swipe), instrucciones de voz, y un estilo visual limpio y moderno sobre fondo oscuro.

## Paleta de Colores

```css
:root {
  --bg-primary: #1a1a2e;
  --bg-card: #22223a;
  --bg-input: #2a2a3e;
  --border: #444;
  --border-light: #555;
  --text-primary: #f0f0f0;
  --text-secondary: #aaa;
  --text-muted: #666;
  --accent: #f59e0b;
  --success: #10b981;
  --error: #f43f5e;
}
```

## Tipografía

- **Fuente:** Inter
- **Títulos grandes:** 5-8rem, weight 800
- **Títulos medios:** 2-3rem, weight 700
- **Textos:** 1-1.3rem, weight 400-600
- **Textos pequeños:** 0.85-0.95rem

## Navegación por Gestos

Todas las pantallas comparten esta mecánica:

- **Deslizar izquierda** → Avanzar a la siguiente pantalla
- **Deslizar derecha** → Volver a la pantalla anterior
- Si no se puede avanzar/volver → Aviso temporal (toast) que desaparece tras 2 segundos
- **Transición:** Slide horizontal en la dirección del gesto

## Instrucciones de Voz

- Cada pantalla tiene una instrucción de voz al entrar
- Usa Web Speech API (es-ES)
- **Botón de mute** siempre visible: esquina inferior derecha, círculo 56px, fondo semitransparente
- Icono: 🔊 (activo) / 🔇 (muteado)
- Indicador visual temporal en la parte superior mostrando lo que se dice

## Pantallas

### 1. WelcomeScreen

**Fondo:** #1a1a2e (oscuro)

**Contenido:**
- "PochaScore" centrado, font-size 7rem, weight 800, color #f0f0f0
- "v1.0" debajo, font-size 1.3rem, color #777, uppercase, letter-spacing 0.15em
- Texto parpadeante abajo: "Pulse en la pantalla para continuar"
  - font-size 1.4rem, color #aaa, animación blink 1.5s

**Interacción:** Cualquier toque avanza a la siguiente pantalla

**Animación al salir:** Slide hacia arriba (la pantalla sube y desaparece)

**Voz:** "Bienvenido a PochaScore"

---

### 2. Opciones (Nueva/Continuar partida)

**Fondo:** #1a1a2e

**Contenido:**
- Dos tarjetas cuadradas (320x320px), fondo blanco (#ffffff), border-radius 24px, border 4px solid #ddd
- Tarjeta 1: 🎮 + "Nueva partida"
- Tarjeta 2: 📋 + "Continuar partida"
- Icono 6rem, texto 1.6rem weight 700, color #1a1a2e
- Separadas por 2rem de gap

**Interacción:**
- Tocar una tarjeta → Se selecciona (borde cambia a #f59e0b)
- Deslizar izquierda → Avanza (si hay selección)
- Sin selección → Toast "Selecciona una opción primero"

**Continuar partida:** Carga estado guardado y va directamente a la pantalla donde se quedó

**Voz:** "Elige nueva partida para empezar, o continuar para retomar una partida guardada."

---

### 3. Número de Jugadores

**Fondo:** #1a1a2e

**Contenido:**
- Título: "Nº de jugadores", font-size 1.5rem, color #777
- Selector scrollable vertical (500px alto, ancho completo max 400px)
- Números del 2 al 10
- Número seleccionado: 8rem, weight 800, color #f0f0f0
- Números adyacentes: 5rem, weight 500, color #444
- Indicador de selección: líneas horizontales arriba/abajo del número central (140px de alto)

**Interacción:**
- Arrastrar arriba/abajo para cambiar el número
- Snap al número más cercano al soltar
- Deslizar izquierda para continuar

**Voz:** "Arrastra arriba o abajo para elegir el número de jugadores."

---

### 4. Registro de Jugadores

**Fondo:** #1a1a2e

**Se repite una vez por jugador**

**Contenido:**
- "Jugador" texto pequeño
- "1 / 4" grande (3.5rem, weight 800)
- Grid de avatares (5 columnas, aspect-ratio 1, border-radius 12px)
  - Seleccionado: border #f59e0b, scale 1.05
- Grid de colores (5 columnas, círculos, max-width 52px)
  - Seleccionado: border blanco, scale 1.15
- Input de nick (4 letras max)
  - font-size 2rem, weight 700, uppercase, letter-spacing 0.2em
  - Background #2a2a3e, border 2px solid #444, border-radius 12px
  - Placeholder "...."

**Interacción:**
- Tocar avatar/color para seleccionar
- Escribir nick
- Deslizar izquierda para siguiente jugador (o finalizar registro)

**Voz:** "Jugador 1. Elige tu avatar, tu color y escribe tu nick."

---

### 5. Elegir Sitio en Mesa

**Fondo:** #1a1a2e

**Contenido:**
- Título: "Elige tu sitio"
- Info del jugador actual (avatar 3rem + nombre)
- Mesa circular en el centro (140px diámetro, fondo #333, borde #555)
- Asientos alrededor en disposición circular (68px diámetro)
  - Vacíos: borde dashed #555, icono 💺
  - Ocupados: borde sólido con color del jugador, fondo #2a2a3e, avatar + nombre

**Fase 2 - Seleccionar Mano:**
- Cuando todos están sentados, aparece botón "🎲 Mano aleatoria"
- O tocar directamente en un jugador sentado para hacerlo mano
- Jugador mano: borde #f59e0b, box-shadow dorado
- Flechas curvas SVG mostrando sentido clockwise

**Interacción:**
- Tocar asiento vacío para sentarse
- Tocar jugador o botón aleatorio para seleccionar mano
- Deslizar izquierda para continuar

**Voz:** 
- "Jugador 1, toca un asiento para elegir tu sitio."
- "Todos sentados. Elige quien es la mano."
- "[Jugador] es la mano. Las agujas del reloj."

---

### 6. Configurar Ronda

**Fondo:** #1a1a2e

**Contenido:**
- "Ronda" texto pequeño
- Número de ronda grande (5rem, weight 800)
- Bazas (ej: "1 baza"), font-size 1.3rem, color #f59e0b
- Indicador de mano: tarjeta #2a2a3e con avatar, nombre, "Tú repartes"
- Selector de triunfo: grid 2x2
  - Cada palo: tarjeta #2a2a3e, border 3px solid #444, border-radius 16px
  - Emoji 3rem + nombre
  - Seleccionado: border #f59e0b, background #333

**Palos:**
- 🪙 Oros (#FFD700)
- 🏆 Copas (#FF6B6B)
- ⚔️ Espadas (#4ECDC4)
- 🪵 Bastos (#45B7D1)

**Interacción:**
- Tocar palo para seleccionar triunfo
- Deslizar izquierda para continuar

**Voz:** "Ronda 1. Jugador 2, tú repartes. Elige triunfo."

---

### 7. Fase de Apuestas

**Fondo:** #1a1a2e

**Contenido:**
- Header: ronda, triunfo, bazas
- Jugador actual: tarjeta #2a2a3e con avatar, nombre, "¿Cuántas bazas haces?"
- Grid de botones de apuesta (0 a bazas en juego)
  - Botones cuadrados, border-radius 12px, font-size 1.8rem
- Lista de apuestas realizadas
  - Cada fila: avatar + nombre | valor de apuesta (#f59e0b)

**Interacción:**
- Tocar número para apostar
- Avanza al siguiente jugador automáticamente
- Deslizar izquierda cuando todos han apostado

**Validación:**
- El último jugador no puede hacer una apuesta que iguale el total de bazas
- Si lo hace, se le pide reelegir

**Voz:** "[Jugador], ¿cuántas bazas haces?"

---

### 8. En Juego

**Fondo:** #1a1a2e

**Contenido:**
- "Ronda" + número grande (5rem)
- Tarjeta central: emoji del triunfo + nombre + bazas
- Resumen de apuestas de todos los jugadores
- "¡A jugar!" texto destacado (#f59e0b)
- Indicación: "← Desliza cuando terminéis"

**Interacción:**
- Solo informativa
- Deslizar izquierda para ir a resultados

**Voz:** "Ronda 1. [Triunfo], [X] bazas. ¡A jugar!"

---

### 9. Entrada de Resultados

**Fondo:** #1a1a2e

**Contenido:**
- Header: "Ronda 1 · [Triunfo] · [X] bazas"
- Título: "Resultados"
- Jugador actual con su apuesta mostrada
- Grid de botones (0 a bazas en juego)
- Lista de resultados:
  - Cada fila: avatar + nombre | apuesta | bazas hechas
  - Verde si acierta, rojo si falla, gris si pendiente
- Contador total: "X / Y"

**Validación:**
- Al completar todos, verifica que la suma = bazas en juego
- Si no coincide:
  - Banner rojo de error con el total real vs esperado
  - Se borran TODAS las selecciones
  - Se vuelve al primer jugador
  - Voz: "Error. La suma no coincide. Inténtalo de nuevo."

**Interacción:**
- Tocar número para registrar bazas
- Deslizar izquierda para ver puntuación (si validación OK)

**Voz:** "[Jugador], ¿cuántas bazas has hecho?"

---

### 10. Puntuación

**Fondo:** #1a1a2e

**Contenido:**
- "Puntuación" + "Ronda X"
- Tabla de puntuación:
  - Columnas: Jugador, Apuesta, Bazas, Puntos, Total
  - Puntos: verde (+), rojo (-), gris (0)
  - Totales acumulados
- Tarjeta del líder (opcional, si hay líder claro)

**Interacción:**
- Deslizar izquierda para siguiente ronda (o resultado final)

**Voz:** "Puntuación ronda X. [Jugador] lidera con [X] puntos."

---

### 11. Resultado Final

**Fondo:** #1a1a2e

**Contenido:**
- "Resultado Final" + 🏆
- Tarjeta ganadora: gradiente dorado (#f59e0b → #d97706), border-radius 20px
  - Avatar 5rem, nombre 2rem, puntuación
- Clasificación:
  - Fondo #22223a, border-radius 16px
  - Filas con posición (1º, 2º...), avatar, nombre, puntos
  - Oro: color #f59e0b
  - Plata: color #aaa
  - Bronce: color #cd7f32

**Interacción:**
- Tocar para nueva partida (vuelve a WelcomeScreen)

**Voz:** "¡Enhorabuena! [Jugador] gana con [X] puntos."

---

## Archivos a Modificar

```
src/
├── App.svelte                    # Navegación por swipe, transiciones, voz
├── index.css                     # Estilos globales actualizados
├── stores/gameState.js           # Adaptar a nuevas pantallas
├── lib/
│   ├── constants.js              # Palos, avatares, colores
│   └── scoring.js                # Lógica de puntuación
├── components/
│   ├── WelcomeScreen.svelte      # Rediseñar
│   ├── GameOptions.svelte        # Nueva: Nueva/Continuar partida
│   ├── PlayerCount.svelte        # Nueva: Selector scrollable
│   ├── PlayerRegistration.svelte # Rediseñar
│   ├── TablePosition.svelte      # Rediseñar con selección de mano
│   ├── RoundSetup.svelte         # Rediseñar
│   ├── BiddingPhase.svelte       # Rediseñar
│   ├── InGame.svelte             # Nueva: Pantalla en juego
│   ├── ResultsEntry.svelte       # Nueva: Entrada de resultados
│   ├── ScoringPhase.svelte       # Rediseñar
│   └── FinalResults.svelte       # Nueva: Resultado final
└── lib/
    └── voice.js                  # Nueva: Utilidad para Web Speech API
```

## Criterios de Éxito

- [ ] Navegación por swipe funcional en todas las pantallas
- [ ] Transiciones slide horizontales en la dirección correcta
- [ ] Instrucciones de voz en cada pantalla
- [ ] Botón de mute siempre visible y funcional
- [ ] Validación de suma de bazas en resultados
- [ ] Estilo visual consistente (fondo oscuro, tipografía Inter)
- [ ] Mobile-first responsive
- [ ] Accesibilidad básica
