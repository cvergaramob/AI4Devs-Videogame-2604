# AI Kong — Videojuego de Plataformas en HTML5 Canvas

Arcade de plataformas inspirado en Donkey Kong, desarrollado completamente en **HTML5 + CSS3 + JavaScript puro (ES6+)** sin frameworks ni librerías externas.

## 🎮 Cómo Jugar

### Controles
- **← / →** o **A / D**: Movimiento izquierda/derecha
- **ESPACIO**: Saltar
- **↑ / ↓** o **W / S**: Subir/Bajar escaleras

### Objetivo
1. Asciende por las 5 plataformas evitando las **Estrellas IA**
2. Recoge las **esferas verdes** para obtener protección temporal
3. Llega al **interruptor** en la cima para apagar la IA corrupta
4. ¡Victoria!

### Mecánicas
- **3 vidas**: Pierdes una al colisionar con una Estrella IA (sin protección) o al agotarse el temporizador
- **90 segundos por vida**: El timer se reinicia cada vez que pierdes una vida
- **Escaleras inestables**: Ciclo de 7s activas → 3s advertencia → 3s desactivadas
- **Puntuación**: Acumula puntos saltando sobre estrellas, recogiendo esferas, y completando el nivel
- **Combo**: 3 saltos consecutivos sobre estrellas = +500 bonus

## 📁 Estructura de Archivos

```text
ai-kong-CV/
├── index.html                  # Entry point
├── style.css                   # Estilos CSS
├── config/
│   └── LevelData.js            # Geometría del nivel
├── src/
│   ├── core/
│   │   ├── Constants.js        # Constantes del juego
│   │   ├── EventBus.js         # Sistema pub/sub
│   │   ├── AssetLoader.js      # Carga de assets
│   │   ├── StateMachine.js     # Máquina de estados
│   │   ├── GameLoop.js         # Loop con requestAnimationFrame + delta time
│   │   └── Game.js             # Bootstrap y orquestador
│   ├── entities/
│   │   ├── Entity.js           # Clase base
│   │   ├── Player.js           # Jugador (controles, física)
│   │   ├── AIStar.js           # Enemigos
│   │   ├── GreenOrb.js         # Items recogibles
│   │   ├── Platform.js         # Plataformas
│   │   ├── Ladder.js           # Escaleras
│   │   ├── Switch.js           # Interruptor final
│   │   └── RebelAI.js          # Villano con glitches
│   ├── systems/
│   │   ├── PhysicsSystem.js    # Gravedad y movimiento
│   │   ├── CollisionSystem.js  # Detección AABB
│   │   ├── SpawnSystem.js      # Generación de enemigos
│   │   ├── LadderSystem.js     # Ciclo sincronizado
│   │   ├── ProtectionSystem.js # Gestión de protección
│   │   ├── ScoreSystem.js      # Sistema de puntuación
│   │   └── TimerSystem.js      # Countdown
│   ├── ui/
│   │   ├── HUD.js              # Interfaz de juego
│   │   ├── MenuScreen.js       # Pantalla inicial
│   │   ├── VictoryScreen.js    # Pantalla de victoria
│   │   ├── GameOverScreen.js   # Pantalla de derrota
│   │   └── Renderer.js         # Orquestador de render
│   └── utils/
│       ├── MathUtils.js        # Utilidades matemáticas
│       ├── Collision.js        # Funciones AABB
│       └── ObjectPool.js       # Pool de objetos
└── docs/
    └── ai_kong_prd.md          # Requisitos del proyecto
```

## 🏗️ Arquitectura

### Patrón de Diseño
- **Modular**: Cada sistema y entidad es independiente
- **Pub/Sub**: EventBus desacoplado para comunicación entre módulos
- **Máquina de Estados**: Transiciones claras entre MENU → PLAYING → VICTORY/GAME_OVER
- **Object Pool**: Reutilización de Estrellas IA para minimizar garbage collection

### Flujo de Ejecución
1. **Carga**: `index.html` carga todos los scripts en orden de dependencias
2. **Inicialización**: `Game.js` instancia sistemas y entidades
3. **Game Loop**: `requestAnimationFrame` → `update(dt)` → `render()`
4. **Estados**: StateMachine gestiona transiciones y callbacks
5. **Render**: Cada capa se renderiza en orden (z-order correcto)

### Delta Time
- Física y lógica de juego desacopladas del framerate
- Soporte para 30/60/120 FPS sin cambio de comportamiento
- Máximo de 50ms por frame para evitar "jumps"

## ⚙️ Configuración

Todos los valores ajustables están centralizados en `Constants.js`:

```javascript
// Física
GRAVITY: 800
PLAYER_SPEED: 300
JUMP_FORCE: 600
STAR_SPEED: 150

// Timers
TIMER_INITIAL: 90
PROTECTION_DURATION: 10
LADDER_ACTIVE_DURATION: 7
LADDER_WARNING_DURATION: 3
LADDER_DISABLED_DURATION: 3

// Puntuación
POINTS_JUMP_STAR: 100
POINTS_ORB: 250
POINTS_COMBO_BONUS: 500
POINTS_LIFE_BONUS: 1000
POINTS_TIME_BONUS: 10
POINTS_HOLE_PENALTY: -100

// Colores
COLOR_PLAYER: '#00ffff'
COLOR_STAR_1: '#ff00ff'
COLOR_ORB: '#00ff00'
// ... más colores
```

## 🎨 Paleta de Colores

- **Fondo**: Oscuro (#0a0e27)
- **Jugador**: Cian (#00ffff)
- **Estrellas IA**: Magenta/Azul (#ff00ff, #0088ff)
- **Esferas**: Verde (#00ff00)
- **IA**: Rojo (#ff0000) con glitches cian/amarillo
- **Escaleras**: Magenta/violeta (activo), Naranja (advertencia), Gris (desactivo) — distintas de las esferas verdes de inmunidad

## 🚀 Cómo Ejecutar

### Opción 1: Servidor Local (recomendado)
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js + http-server
npx http-server

# Con Live Server en VS Code
# Botón derecho en index.html → "Open with Live Server"
```

Luego abre `http://localhost:8000` en el navegador.

### Opción 2: Abrir archivo directamente
Simplemente abre `index.html` directamente en el navegador. **Nota**: Algunos navegadores pueden bloquear ciertos accesos por CORS si no se usa un servidor.

## 📊 Requisitos Cumplidos

✅ HTML5 Canvas puro sin frameworks  
✅ 60 FPS estables con delta time  
✅ Máquina de estados: LOADING → MENU → PLAYING → VICTORY/GAME_OVER  
✅ Arquitectura modular: 5 plataformas, escaleras inestables sincronizadas, IA enemiga  
✅ Sistemas de física, colisiones AABB, spawn, protección, puntuación, timer  
✅ UI completa: HUD, menú, pantalla de victoria, game over  
✅ Animaciones: glitches IA, pulsación estrellas, parpadeo protección  
✅ Canvas fijo: 960×640 px (sin escalado responsive)  

## 🐛 Debug

Para activar modo debug, edita `Game.js`:
```javascript
if (false) { // Cambiar a true
    eventBus.on(EventNames.TIMER_TICK, (data) => {
        console.log(`Time: ${data.timeRemaining.toFixed(1)}`);
    });
}
```

Accede a info de debug en consola:
```javascript
window.game.getDebugInfo()
```

## 📝 Notas de Implementación

- **Hitboxes justas**: Reducidas 4px respecto al sprite para una experiencia "fair"
- **Combo reseteable**: Se reinicia al aterrizar sin saltar una estrella
- **Gravedad configurable**: Permite fácil ajuste de dificultad
- **Escaleras sincronizadas**: Un único timer global para todos los ciclos
- **Pool de objetos**: Reutilización de Estrellas IA (~20 por defecto)
- **Eventos desacoplados**: Cambios de score, vidas, protección sin acoplamiento directo

## 🎯 Futuras Mejoras

- [ ] Múltiples niveles con dificultad escalable
- [ ] Tipos de enemigos adicionales
- [ ] Sistema de high scores local (localStorage)
- [ ] Efectos de sonido
- [ ] Animaciones de celebración del jugador
- [ ] Control por teclado + gamepad
- [ ] Modo endless/arcade
- [ ] Física de lanzamiento (jumping en plataformas inclinadas)

---

**AI Kong v1.0** · MVP completamente funcional · HTML5 + CSS3 + JavaScript ES6+
