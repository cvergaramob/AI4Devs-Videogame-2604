# Historial de Prompts

---

## Prompt 1
**IA:** Claude  
**Modelo:** sonnet 4.6

### Contenido

```text
Actúa como un senior product manager con experiencia en juegos arcade.
Basándote en el siguiente contexto, genera un PRD que incluya: objetivos, requisitos técnicos, métricas de éxito y criterios de aceptación.

Descripción del juego y reglas: 

1. Visión General
AI Kong es un juego arcade de plataformas inspirado en Donkey Kong.
El jugador controla a un humano que debe ascender por una estructura compuesta por plataformas y escaleras para alcanzar un interruptor de emergencia capaz de apagar una Inteligencia Artificial rebelde.
La IA intentará impedir el avance del jugador generando alucinaciones digitales representadas por estrellas IA que recorren el escenario de forma descendente.
El juego está diseñado como una experiencia arcade rápida, simple de aprender y con alta rejugabilidad.

2. Objetivo del Juego
El objetivo es llegar hasta el interruptor ubicado en la parte superior del escenario y activarlo antes de perder todas las vidas.
Al activar el interruptor:
  1. La IA comienza a fallar.
  2. Aparecen efectos visuales de corrupción digital.
  3. La IA se apaga.
  4. El jugador celebra la victoria.
  5. Se muestra la puntuación final.

3. Personajes
3.1 Humano (Jugador)
Personaje controlado por el usuario.
Acciones disponibles
- Caminar hacia la izquierda.
- Caminar hacia la derecha.
- Subir escaleras.
- Bajar escaleras.
- Saltar.

3.2 IA Rebelde (Villano)
Entidad digital hostil ubicada en la parte superior del escenario.
Apariencia
La IA debe transmitir inteligencia y amenaza mediante:
- Núcleo luminoso, ojo/visor.
- Glitches permanentes.
- Píxeles corruptos.
- Fragmentos de código flotante.
- Interferencias digitales.
- Animaciones de corrupción visual.
Durante toda la partida debe sentirse como una presencia activa.
Función
La IA genera periódicamente Estrellas IA para impedir el avance del jugador.

4. Diseño del Nivel
4.1 Estructura General
El juego posee un único nivel.
Está compuesto por:
- 5 plataformas principales.
- 5 escaleras.
- Una plataforma final para el interruptor.
- Plataformas con una leve inclinación que permita identificar claramente el sentido descendente del recorrido de las Estrellas IA.

4.2 Distribución
Plataforma 1
- Punto de inicio del jugador.
- Sin huecos.
Plataforma 2
- 1 hueco.
- 1 esfera verde ubicada al comienzo de la plataforma.
Plataforma 3
- 2 huecos.
Plataforma 4
- 1 hueco.
- 1 esfera verde ubicada al comienzo de la plataforma.
Plataforma 5
- Sin huecos.
- 1 esfera verde ubicada al comienzo de la plataforma.
- La IA se encuentra al final de esta plataforma.
Plataforma del Interruptor
- Pequeña plataforma ubicada por encima de la IA.
- Accesible mediante una escalera adicional.
- Contiene únicamente el interruptor de apagado.

4.3 Escaleras
- Existe una escalera al final de cada plataforma.
- Existe una escalera adicional que conecta la Plataforma 5 con la Plataforma del Interruptor.
- Total de escaleras: 5.
La disposición debe recordar a la estructura clásica de Donkey Kong.

5. Sistema de Vidas
El jugador comienza con:
- 3 vidas.
Se pierde una vida cuando:
- Una Estrella IA impacta al jugador sin protección.
- El temporizador llega a cero.
Cuando aún quedan vidas disponibles:
- El jugador reaparece en la última plataforma alcanzada.
Cuando las vidas llegan a cero:
- La partida finaliza.
- El jugador pierde.

6. Temporizador
Duración inicial:
- 90 segundos.
Funcionamiento:
- El tiempo disminuye constantemente.
- Al llegar a cero se pierde una vida.
- Si quedan vidas disponibles:
  - El temporizador vuelve a iniciarse.
  - El jugador reaparece en la última plataforma alcanzada.

7. Estrellas IA
Descripción
Las Estrellas IA representan alucinaciones digitales generadas por la IA rebelde.
Visualmente deben utilizar el estilo de las estrellas de cuatro puntas comúnmente asociadas a herramientas modernas de Inteligencia Artificial.
Características visuales:
- Forma de estrella de cuatro puntas.
- Apariencia brillante y luminosa.
- Colores predominantes:
  - Violeta.
  - Magenta.
  - Azul eléctrico.
- Efecto glow.
- Leve animación de pulsación o brillo.
- Estética digital moderna.
Cada Estrella IA está representada visualmente por un pequeño grupo de entre 2 y 4 estrellas de distintos tamaños.
El grupo completo se comporta como una única entidad de juego.
Por lo tanto:
- Posee una única colisión.
- Se mueve como un único objeto.
- Otorga una única recompensa al ser saltada.
- Consume una única protección al impactar contra un jugador protegido.

Generación
- La primera Estrella IA aparece a los 2 segundos del inicio de la partida.
- Posteriormente se genera una nueva Estrella IA cada 6 segundos.

Movimiento
Todas las Estrellas IA:
- Utilizan la misma velocidad.
- Se desplazan a velocidad constante.
- Tienen una velocidad relativamente lenta.
- Recorren el escenario de forma descendente.
Las Estrellas IA:
- No utilizan escaleras.
- No caen por los huecos.
- Desaparecen al alcanzar la parte inferior del escenario.

Colisión
Si una Estrella IA impacta al jugador:
- El jugador pierde una vida.

8. Esferas Verdes
Ubicación
Existe una esfera verde en:
- Inicio de Plataforma 2.
- Inicio de Plataforma 4.
- Inicio de Plataforma 5.
Total:
- 3 esferas verdes.

Efecto
Al recoger una esfera:
- La esfera desaparece.
- El jugador obtiene protección temporal.
- Aparece un aura verde alrededor del personaje.
Duración máxima:
- 10 segundos.

Consumo de la Protección
La protección termina cuando ocurre cualquiera de estas situaciones:
Situación 1
Transcurren 10 segundos.
Situación 2
Una Estrella IA impacta al jugador.
En ese caso:
- La Estrella IA desaparece.
- La protección se consume.
- El jugador no pierde la vida.

Indicador Visual
Durante los últimos 3 segundos:
- El aura verde comienza a parpadear.

9. Huecos
Los huecos representan sectores dañados del sistema.
Distribución:
- Plataforma 2: 1 hueco.
- Plataforma 3: 2 huecos.
- Plataforma 4: 1 hueco.
Total:
- 4 huecos.

Consecuencia
Si el jugador cae:
- Desciende a la plataforma inferior.
- Pierde 100 puntos.
- Debe recuperar el progreso perdido.
No pierde vidas.

10. Escaleras Inestables
Las escaleras sufren interferencias provocadas por la IA.
Todas las escaleras comparten el mismo ciclo sincronizado.

Estado Normal
Duración:
- 7 segundos.
Características:
- Escalera completamente visible.
- Puede utilizarse normalmente.

Estado de Advertencia
Duración:
- 3 segundos.
Características:
- La escalera comienza a parpadear.
- Aparecen glitches visuales.
- Advierte que pronto desaparecerá.

Estado Desactivado
Duración:
- 3 segundos.
Características:
- La escalera desaparece.
- No puede utilizarse.

Reinicio
Finalizado el estado desactivado:
- Todas las escaleras reaparecen simultáneamente.
- El ciclo vuelve a comenzar.

Penalización
Si una escalera desaparece mientras el jugador la utiliza:
- El jugador cae al inicio de esa escalera.
- No pierde vidas.
- No recibe daño.
- Pierde tiempo y progreso.

11. Sistema de Puntuación
Recompensas
Saltar una Estrella IA:
- +100 puntos
Recoger una esfera verde:
- +250 puntos
Completar tres saltos consecutivos sobre Estrellas IA:
- +500 puntos
Vida sobrante al finalizar la partida:
- +1000 puntos por vida
Tiempo restante al finalizar:
- +10 puntos por segundo restante

Penalizaciones
Caer por un hueco:
- -100 puntos

12. Condición de Victoria
Para ganar la partida el jugador debe:
1. Alcanzar la Plataforma del Interruptor.
2. Activar el interruptor.
Al activarlo:
1. La IA entra en estado de fallo.
2. Aparecen glitches intensos.
3. Aparecen píxeles corruptos.
4. La IA se apaga progresivamente.
5. El jugador realiza una animación de celebración.
6. Se muestra la puntuación final.

13. Condición de Derrota
La partida termina cuando:
- El jugador pierde las tres vidas.
Se muestra una pantalla indicando que la IA mantiene el control del sistema.

14. Principios de Diseño
El MVP debe cumplir los siguientes objetivos:
- Fácil de aprender.
- Partidas cortas.
- Dificultad moderada.
- Rejugabilidad elevada.
- Controles simples.
- Una única mecánica principal de enemigo.
- Una mecánica secundaria de escaleras inestables.
- Clara inspiración en Donkey Kong.
- Identidad visual propia basada en una Inteligencia Artificial corrupta.
- Escenario fácilmente legible para jugadores nuevos.
- El jugador debe identificar visualmente el recorrido descendente de las Estrellas IA gracias a la inclinación de las plataformas.

15. Objetivo del MVP
Construir una versión completamente jugable con:
- Un único nivel.
- Un único enemigo.
- Un único objetivo.
- Reglas simples.
- Aprendizaje inmediato.
- Duración aproximada de partida entre 1 y 3 minutos.
La prioridad es lograr una experiencia divertida, clara y estable antes de incorporar nuevas mecánicas o niveles.


Restricciones conocidas: El juego tiene que ser desarrollado utilizando HTML + CSS + JavaScript puro, sin frameworks ni librerías. Se pueden incluir imágenes.
```

---

## Prompt 2
**IA:** Claude  
**Modelo:** Sonnet 4.6

### Contenido

```text
Actúa como un ingeniero de prompts y genera el prompt para pedirle a claude code el scaffolding para el juego AIKong.
```

---

## Prompt 3
**IA:** Claude  
**Modelo:** default

### Contenido

```text
Actúa como un Arquitecto de Software experto en desarrollo de videojuegos con HTML5 Canvas.

Genera el scaffolding completo para el juego AIKong: un arcade de plataformas inspirado en Donkey Kong, desarrollado en HTML + CSS + JavaScript puro (ES6+), sin frameworks ni librerías externas.

## Stack obligatorio
- HTML5 + CSS3 + JavaScript puro (ES6+)
- Rendering: <canvas> con API 2D Context
- Game loop: requestAnimationFrame + delta time
- Sin frameworks, sin game engines, sin librerías de terceros
- Resolución de canvas: 960x640

## Estructura de archivos a generar

aikong/
├── index.html                  # Entry point, carga scripts en orden correcto
├── style.css                   # Centrado del canvas, fondo oscuro, pixel-perfect
├── config/
│   └── LevelData.js            # Posiciones de plataformas, escaleras, huecos, esferas
├── src/
│   ├── core/
│   │   ├── Constants.js        # Todas las constantes del juego (velocidades, timers, puntos, colores)
│   │   ├── EventBus.js         # Sistema pub/sub desacoplado para comunicación entre módulos
│   │   ├── AssetLoader.js      # Carga asíncrona de assets, promesas, estado de carga
│   │   ├── StateMachine.js     # Estados: LOADING, MENU, PLAYING, PAUSED, VICTORY, GAME_OVER
│   │   ├── GameLoop.js         # requestAnimationFrame, delta time, update/render cycle
│   │   └── Game.js             # Bootstrap: instancia sistemas, arranca el loop
│   ├── entities/
│   │   ├── Entity.js           # Clase base: x, y, width, height, update(), render()
│   │   ├── Player.js           # Movimiento, salto, estados (idle/walking/jumping/climbing/dead/celebrating)
│   │   ├── AIStar.js           # Grupo de 2-4 estrellas, movimiento descendente, colisión única
│   │   ├── GreenOrb.js         # Esfera recogible, desaparece al contacto
│   │   ├── Platform.js         # Plataforma con inclinación, lista de huecos
│   │   ├── Ladder.js           # Escalera con estados: ACTIVE, WARNING, DISABLED (ciclo sincronizado)
│   │   ├── Switch.js           # Interruptor final, activable por el jugador
│   │   └── RebelAI.js          # Villano estático con animaciones de glitch y corrupción
│   ├── systems/
│   │   ├── PhysicsSystem.js    # Gravedad, velocidad, integración con delta time
│   │   ├── CollisionSystem.js  # AABB, plataformas, huecos, entidades
│   │   ├── SpawnSystem.js      # Generación periódica de AIStar (2s primera, luego cada 6s)
│   │   ├── LadderSystem.js     # Ciclo global sincronizado: 7s activa / 3s warning / 3s disabled
│   │   ├── ProtectionSystem.js # Timer de protección (10s), parpadeo últimos 3s, consumo por impacto
│   │   ├── ScoreSystem.js      # Puntos, combo de saltos, penalizaciones, bonos finales
│   │   └── TimerSystem.js      # Countdown 90s, pérdida de vida al llegar a 0, reinicio
│   ├── ui/
│   │   ├── HUD.js              # Puntuación, vidas (iconos), timer, estado de protección
│   │   ├── MenuScreen.js       # Pantalla de inicio con título, controles y botón de inicio
│   │   ├── VictoryScreen.js    # Secuencia de victoria: glitches, apagado IA, celebración, score
│   │   ├── GameOverScreen.js   # Pantalla de derrota con mensaje y opción de reinicio
│   │   └── Renderer.js         # Orquesta el render de todas las capas en orden correcto
│   └── utils/
│       ├── MathUtils.js        # Clamp, lerp, overlap, helpers matemáticos
│       ├── Collision.js        # Funciones AABB puras y reutilizables
│       └── ObjectPool.js       # Pool genérico para AIStar (evitar garbage collection)

## Reglas de arquitectura

1. Constants.js debe centralizar TODOS los valores configurables:
   - GRAVITY, PLAYER_SPEED, JUMP_FORCE, STAR_SPEED, STAR_SPAWN_INTERVAL
   - TIMER_INITIAL (90), PROTECTION_DURATION (10), PROTECTION_BLINK_THRESHOLD (3)
   - LADDER_ACTIVE (7), LADDER_WARNING (3), LADDER_DISABLED (3)
   - Puntos: JUMP_STAR (100), ORB (250), COMBO_BONUS (500), LIFE_BONUS (1000), TIME_BONUS (10)
   - Penalización: HOLE_PENALTY (-100)
   - Paleta de colores del juego

2. EventBus.js debe ser un singleton pub/sub:
   - Eventos clave: player:hit, player:jump, orb:collected, star:jumped, switch:activated,
     life:lost, game:victory, game:over, ladder:stateChanged, protection:expired

3. StateMachine.js debe gestionar transiciones explícitas y ejecutar callbacks onEnter/onExit

4. Entity.js como clase base con update(dt) y render(ctx) para ser extendida

5. Game.js instancia todos los sistemas y entidades, los conecta vía EventBus, y delega
   update/render al GameLoop

6. Cada archivo debe tener un comentario de cabecera con: nombre, responsabilidad y dependencias

## Contenido de cada archivo
Genera el código funcional completo de cada archivo, no stubs vacíos ni comentarios TODO.
Los sistemas deben estar conectados entre sí desde el inicio.
El juego debe poder abrirse en un browser y mostrar al menos la pantalla de MENU funcionando.

## Diseño del nivel (config/LevelData.js)
5 plataformas con leve inclinación descendente de izquierda a derecha.
Distribución aproximada en canvas 960x640:
- Plataforma 1 (inicio): y≈560, sin huecos
- Plataforma 2: y≈440, 1 hueco, esfera verde al inicio
- Plataforma 3: y≈330, 2 huecos
- Plataforma 4: y≈220, 1 hueco, esfera verde al inicio
- Plataforma 5: y≈120, sin huecos, esfera verde al inicio, IA al final
- Plataforma del interruptor: y≈50, pequeña, sobre la IA
Escaleras al final de cada plataforma + 1 adicional de plataforma 5 al interruptor.
```

---

## Prompt 4
**IA:** Claude  
**Modelo:** Sonnet 4.6

### Contenido

```text
Actúa como un ingeniero de prompts y genera un prompt para pedirle a claude code que implemente la Fase 1 — Motor base del documento prd.
```

---

## Prompt 5
**IA:** Claude  
**Modelo:** default

### Contenido

```text
Actúa como un desarrollador senior experto en videojuegos con HTML5 Canvas.

Implementa la Fase 1 — Motor base del juego AIKong sobre el scaffolding existente.

## Objetivo de la fase
El juego debe poder abrirse en el browser y mostrar la pantalla de MENU. Al presionar
ENTER o SPACE debe transicionar a PLAYING y renderizar al jugador sobre la plataforma 1
con física básica funcionando (gravedad + colisión con suelo). Al presionar ESC debe
pausar. Todo debe correr a 60 FPS estables con delta time.

## Archivos a implementar en esta fase

### 1. src/core/Constants.js
Todas las constantes del juego en un objeto global CONSTANTS:
- Canvas: CANVAS_WIDTH (960), CANVAS_HEIGHT (640)
- Física: GRAVITY (1800 px/s²), PLAYER_SPEED (200 px/s), JUMP_FORCE (-600 px/s)
- Jugador: PLAYER_WIDTH (32), PLAYER_HEIGHT (48)
- Estrellas IA: STAR_SPEED (90 px/s), STAR_SPAWN_INITIAL (2000 ms), STAR_SPAWN_INTERVAL (6000 ms)
- Timers: TIMER_INITIAL (90), PROTECTION_DURATION (10), PROTECTION_BLINK_THRESHOLD (3)
- Escaleras: LADDER_ACTIVE (7000 ms), LADDER_WARNING (3000 ms), LADDER_DISABLED (3000 ms)
- Puntuación: SCORE_JUMP_STAR (100), SCORE_ORB (250), SCORE_COMBO_BONUS (500),
  SCORE_LIFE_BONUS (1000), SCORE_TIME_BONUS (10), SCORE_HOLE_PENALTY (-100)
- Vidas: LIVES_INITIAL (3)
- Paleta de colores: COLOR_BG (#0a0010), COLOR_PLATFORM (#1a0a3a), COLOR_PLATFORM_EDGE (#7b2fff),
  COLOR_LADDER (#00ffcc), COLOR_PLAYER (#00eeff), COLOR_AI_PRIMARY (#7b2fff),
  COLOR_STAR_1 (#bf5fff), COLOR_STAR_2 (#ff3aff), COLOR_STAR_3 (#3a8fff),
  COLOR_ORB (#00ff88), COLOR_SWITCH (#ffee00), COLOR_HUD (#ffffff)
- Estados: STATE_LOADING, STATE_MENU, STATE_PLAYING, STATE_PAUSED, STATE_VICTORY, STATE_GAME_OVER

### 2. src/core/EventBus.js
Singleton pub/sub. Métodos: on(event, callback), off(event, callback), emit(event, data).
Eventos que debe soportar desde el inicio:
player:hit, player:jumped, player:landed, player:climbed, player:collected_orb,
star:jumped_over, switch:activated, life:lost, game:victory, game:over,
ladder:state_changed, protection:expired, score:changed, timer:tick, timer:expired

### 3. src/core/StateMachine.js
Gestiona transiciones entre estados. Cada estado puede tener: onEnter(prevState),
onExit(nextState), update(dt), render(ctx).
Métodos públicos: setState(newState), getState(), addState(name, handlers).
Debe loggear transiciones en consola para debugging.

### 4. src/core/GameLoop.js
Implementa el loop con requestAnimationFrame. Calcula delta time en segundos,
con un cap de 0.05s (para evitar espirales de muerte al perder foco).
Expone: start(), stop(), pause(), resume().
Llama a game.update(dt) y game.render() en cada frame.
Trackea y expone FPS actuales (promedio de últimos 60 frames).

### 5. src/core/AssetLoader.js
Carga assets de forma asíncrona. Métodos: loadImage(key, src), loadAll(manifest),
get(key). Retorna promesas. Muestra progreso (assets cargados / total).
En esta fase el manifest puede estar vacío (los sprites se dibujarán con canvas 2D).

### 6. src/utils/MathUtils.js
Funciones puras: clamp(val, min, max), lerp(a, b, t), randomInt(min, max),
randomFloat(min, max), randomChoice(array).

### 7. src/utils/Collision.js
Funciones AABB puras:
- rectsOverlap(a, b): boolean
- getOverlap(a, b): {x, y, width, height}
- rectContainsPoint(rect, px, py): boolean
Cada rect tiene forma {x, y, width, height}.

### 8. src/utils/ObjectPool.js
Pool genérico. Constructor: ObjectPool(createFn, resetFn, initialSize).
Métodos: acquire(), release(obj), releaseAll(), getActiveCount().

### 9. src/entities/Entity.js
Clase base. Constructor(x, y, width, height).
Propiedades: x, y, width, height, velX, velY, active, id (autoincremental).
Métodos: update(dt) {}, render(ctx) {}, getBounds() → {x,y,width,height},
getCenter() → {x,y}, destroy().

### 10. src/entities/Player.js
Extiende Entity. Estados internos del jugador como constantes de clase:
IDLE, WALKING, JUMPING, FALLING, CLIMBING, DEAD, CELEBRATING.
Propiedades: state, facingRight, onGround, onLadder, isProtected, protectionTimer,
lives (inicializa desde CONSTANTS.LIVES_INITIAL), lastPlatformY.
Métodos:
- update(dt): aplica física si no está en escalera, gestiona animación
- render(ctx): dibuja el personaje con canvas 2D (sin sprites, formas geométricas por ahora)
  Cuerpo: rectángulo COLOR_PLAYER. Aura verde si isProtected (parpadeo en últimos 3s).
- handleInput(keys): procesa el estado actual del teclado
- jump(): ejecuta el salto si onGround es true
- takeDamage(): reduce vida, emite player:hit
- respawn(x, y): reposiciona al jugador

### 11. src/ui/HUD.js
Dibuja sobre el canvas (capa de UI, siempre encima del juego).
Método render(ctx, gameState) donde gameState = {score, lives, timeLeft, isProtected, protectionTime}.
Elementos:
- Puntuación (arriba izquierda): "SCORE: 000000"
- Vidas (arriba centro): iconos de corazón × N
- Timer (arriba derecha): "TIME: 90" en rojo si < 15s
- Barra de protección (debajo del timer) visible solo cuando isProtected es true

### 12. src/ui/MenuScreen.js
Pantalla de MENU dibujada en canvas. Debe mostrar:
- Título "AI KONG" con efecto glow en violeta/magenta
- Subtítulo "Apaga la IA antes de que sea tarde"
- Controles: flechas para moverse, SPACE para saltar, arriba/abajo en escaleras
- "PRESIONA ENTER PARA COMENZAR" parpadeando
Todo dibujado con canvas 2D, estética dark con acentos neón.

### 13. src/ui/Renderer.js
Orquesta el render de todas las capas en orden:
1. Fondo (COLOR_BG fill)
2. Entidades del nivel (plataformas, escaleras, switch)
3. Entidades dinámicas (jugador, estrellas, esferas)
4. Efectos visuales
5. HUD (siempre al tope)
Método principal: render(ctx, gameObjects, gameState).

### 14. src/core/Game.js
Bootstrap y coordinador central. Responsabilidades:
- Obtener referencia al canvas y ctx
- Instanciar: EventBus, AssetLoader, StateMachine, GameLoop, HUD, Renderer, Player
- Definir los 6 estados en StateMachine con sus handlers update/render
- Estado MENU: renderiza MenuScreen, escucha ENTER para ir a PLAYING
- Estado PLAYING: update física del Player, render básico (jugador sobre plataforma hardcodeada
  en y=560 para esta fase), escucha ESC para ir a PAUSED
- Estado PAUSED: render del juego congelado + overlay "PAUSADO", ESC para reanudar
- Método start(): carga assets → setState(MENU) → gameLoop.start()
- Input: un único KeyboardHandler que trackea qué teclas están presionadas (Set),
  expone isDown(key) y se limpia en keyup

## Comportamiento esperado al terminar la fase

1. `index.html` se abre en el browser sin errores en consola
2. Se muestra la pantalla de MENU con título y controles
3. ENTER inicia el juego → se ve el jugador (rectángulo celeste) sobre una plataforma
   hardcodeada (rectángulo violeta) en la parte inferior del canvas
4. El jugador cae desde el centro superior y aterriza en la plataforma (gravedad activa)
5. Flechas izquierda/derecha: el jugador camina
6. SPACE: el jugador salta
7. ESC: pausa con overlay, ESC de nuevo: reanuda
8. FPS visibles en esquina inferior derecha del canvas durante PLAYING
9. No hay errores en consola en ningún momento del flujo anterior

## Restricciones
- Sin sprites en esta fase, todo se dibuja con formas geométricas (rect, arc, fillText)
- Sin audio
- El delta time debe estar capado en 0.05s
- Los hitboxes del jugador deben ser ligeramente más pequeños que el sprite visible
- Todos los valores numéricos deben leerse desde CONSTANTS, nunca hardcodeados
- Cada archivo debe tener comentario de cabecera con: nombre, responsabilidad, dependencias
```

---

## Prompt 6
**IA:** Claude  
**Modelo:** Sonnet 4.6

### Contenido

```text
Actúa como un ingeniero de prompts y genera un prompt para pedirle a claude code que implemente la Fase 2 del documento prd.
```

---

## Prompt 7
**IA:** Claude  
**Modelo:** default

### Contenido

```text
Implementa la Fase 2 — Nivel y jugador del juego AIKong sobre el código existente de la Fase 1.

## Objetivo de la fase
Al terminar esta fase el juego debe mostrar el nivel completo jugable: 5 plataformas
inclinadas, huecos, 5 escaleras con su ciclo de inestabilidad, interruptor, IA rebelde
estática y el jugador capaz de recorrer todo el escenario de inicio a fin usando
movimiento, salto y escaleras. Sin enemigos aún.

## Archivos a implementar o completar

### 1. config/LevelData.js
Objeto global LEVEL_DATA con la definición completa del nivel.
Canvas 960x640. Las plataformas tienen leve inclinación: el extremo derecho es ~12px
más bajo que el izquierdo (simular con un trapecio o línea inclinada al renderizar).

Plataformas (cada una con x, y, width, height, gaps[], hasOrb, orbX):
- Plataforma 1: x=0, y=570, width=960, height=14. Sin huecos. Sin esfera. Punto de inicio del jugador.
- Plataforma 2: x=0, y=450, width=860, height=14. Gap en x=400, width=60. Esfera en x=60.
- Plataforma 3: x=100, y=335, width=860, height=14. Gaps en x=280 y x=580, width=60 cada uno. Sin esfera.
- Plataforma 4: x=0, y=220, width=860, height=14. Gap en x=500, width=60. Esfera en x=60.
- Plataforma 5: x=100, y=110, width=760, height=14. Sin huecos. Esfera en x=160. IA en x=780.
- Plataforma Interruptor: x=720, y=40, width=160, height=14. Sin huecos. Switch en centro.

Escaleras (cada una con x, y, width, height, connectsFrom, connectsTo):
- Escalera 1→2: x=890, y=450, width=28, height=120. De plataforma 1 a plataforma 2.
- Escalera 2→3: x=60, y=335, width=28, height=115. De plataforma 2 a plataforma 3.
- Escalera 3→4: x=890, y=220, width=28, height=115. De plataforma 3 a plataforma 4.
- Escalera 4→5: x=60, y=110, width=28, height=110. De plataforma 4 a plataforma 5.
- Escalera 5→Switch: x=750, y=40, width=28, height=70. De plataforma 5 a plataforma interruptor.

### 2. src/entities/Platform.js
Extiende Entity. Constructor recibe config de LEVEL_DATA.
Propiedades: gaps (array de {x, width}), hasOrb, tiltOffset (12px diferencia derecha vs izquierda).
Métodos:
- render(ctx): dibuja la plataforma como un trapecio inclinado. Borde superior COLOR_PLATFORM_EDGE
  (línea brillante de 2px). Cuerpo relleno COLOR_PLATFORM. Renderiza cada hueco como zona
  oscura/transparente sobre la plataforma (visualmente dañada, efecto digital).
- getTopY(atX): retorna la Y exacta de la superficie en una posición X dada (interpolación
  lineal considerando la inclinación). Necesario para colisión correcta con plataforma inclinada.
- isHoleAt(atX, width): retorna true si el rango [atX, atX+width] cae sobre un hueco.
- getSolidSegments(): retorna array de segmentos sólidos {x, width} (plataforma sin huecos).

### 3. src/entities/Ladder.js
Extiende Entity. Estados: ACTIVE, WARNING, DISABLED.
El estado es global y sincronizado (todas las escaleras comparten el mismo timer externo
controlado por LadderSystem — Ladder solo debe recibir el estado y renderizar en consecuencia).
Propiedades: state (setter que dispara re-render), connectsFrom, connectsTo.
Métodos:
- setState(newState): actualiza estado interno
- isUsable(): retorna true solo si state === ACTIVE o WARNING
- render(ctx):
  - ACTIVE: escalera con travesaños, color COLOR_LADDER con opacidad plena
  - WARNING: igual pero parpadea (alternar opacidad cada 200ms usando Date.now())
    y muestra glitch visual (desplazamiento horizontal aleatorio de ±3px en algunos travesaños)
  - DISABLED: no renderiza nada (invisible)
- getEntryBounds(): retorna hitbox de la base de la escalera para detectar si el jugador puede entrar

### 4. src/systems/LadderSystem.js
Controla el ciclo global sincronizado de todas las escaleras.
Estados del ciclo: ACTIVE (7000ms) → WARNING (3000ms) → DISABLED (3000ms) → repeat.
Propiedades: currentState, elapsed, ladders (array de referencias a Ladder).
Métodos:
- init(ladders): recibe el array de entidades Ladder
- update(dt): avanza el timer, cambia estado cuando corresponde, llama setState() en todas
  las escaleras simultáneamente, emite ladder:state_changed vía EventBus con el nuevo estado
- getCurrentState(): retorna el estado actual del ciclo
- getTimeUntilChange(): retorna ms restantes hasta próximo cambio de estado (útil para HUD futuro)

### 5. src/entities/Switch.js
Extiende Entity. Propiedades: activated (bool), animFrame.
Render: un rectángulo amarillo COLOR_SWITCH con ícono de power (dibujado con arc y líneas).
Cuando activated: cambia a color rojo, emite switch:activated vía EventBus.
Método activate(): solo ejecutable si !activated. Inicia animación de activación.

### 6. src/entities/RebelAI.js
Extiende Entity. Entidad estática en Plataforma 5. No se mueve.
Debe transmitir presencia amenazante durante toda la partida mediante animaciones en canvas:
- Núcleo: círculo violeta brillante (COLOR_AI_PRIMARY) con pulso de escala senoidal
- Ojo/visor: elipse interior que "mira" (oscila horizontalmente)
- Glitches permanentes: cada ~800ms desplaza aleatoriamente fragmentos del cuerpo ±4px
- Píxeles corruptos: puntos de colores aleatorios alrededor del cuerpo (nueva posición cada frame)
- Fragmentos de código flotante: strings cortos ("01", "if(", "//", "NaN", "∞") que flotan
  y desvanecen en un radio de 60px alrededor del núcleo
Método update(dt): avanza todos los timers de animación internos.
Método startShutdown(): activa secuencia de apagado (para Fase 4, dejar como stub por ahora).

### 7. src/entities/Player.js — completar con lógica de escaleras y huecos
Ampliar el Player de Fase 1 con:
- Lógica de entrada/salida de escaleras:
  - Al presionar arriba/abajo sobre la base de una escalera usable → estado CLIMBING
  - En CLIMBING: desactivar gravedad, mover verticalmente con PLAYER_SPEED * 0.7
  - Si la escalera pasa a DISABLED mientras está trepando → caer a la base de la escalera
    (setear posición a ladder.getEntryBounds(), state = FALLING)
  - Al llegar a la cima de la escalera → state = IDLE, posicionar en plataforma superior
- Lógica de huecos:
  - En update(), si onGround y platform.isHoleAt(this.x, this.width) → iniciar caída
  - Al caer por hueco: emitir score:hole_penalty vía EventBus, state = FALLING
  - Colisión con plataforma inferior detiene la caída normalmente
- Hitbox de colisión: 6px más pequeño en cada lado que el sprite visible (forgiving hitbox)
- Método getCollisionBounds(): retorna bounds reducidos para colisión

### 8. src/systems/CollisionSystem.js
Sistema centralizado de colisiones. Método principal: update(player, platforms, ladders).
Responsabilidades:
- Colisión jugador ↔ plataformas sólidas:
  - Usar platform.getTopY(playerCenterX) para superficie inclinada
  - Solo colisionar desde arriba (no atravesar plataforma subiendo)
  - Setear player.onGround = true cuando corresponda
- Detección de huecos:
  - Si player.onGround y platform.isHoleAt(player.x + 6, player.width - 12):
    activar caída, emitir evento, penalizar score
- Colisión jugador ↔ escaleras:
  - Detectar si el jugador está sobre la entrada de una escalera usable
  - Exponer al Player si puede interactuar con alguna escalera (player.nearLadder)
- Separación de responsabilidades: CollisionSystem detecta y notifica vía EventBus,
  no modifica directamente el estado del jugador salvo posición y velocidad

### 9. src/systems/PhysicsSystem.js
Aplica física al jugador cada frame. Método: update(player, dt).
- Si player.state !== CLIMBING: aplicar gravedad (velY += GRAVITY * dt)
- Aplicar velocidad: x += velX * dt, y += velY * dt
- Limitar velY a un máximo de caída (terminal velocity: 800 px/s)
- Si player está en CLIMBING: velX = 0, no aplicar gravedad

### 10. src/ui/Renderer.js — ampliar con render del nivel completo
Orden de capas de render:
1. Fondo: fill COLOR_BG + efecto de grid digital sutil (líneas muy tenues cada 40px)
2. Plataformas (render de cada Platform)
3. Escaleras (render de cada Ladder según su estado)
4. Switch (render del interruptor)
5. RebelAI (render con animaciones)
6. Esferas verdes (render de GreenOrb — stub por ahora)
7. Estrellas IA (render de AIStar — stub por ahora)
8. Jugador (render de Player)
9. HUD (siempre al tope)

### 11. src/core/Game.js — integrar todos los sistemas de Fase 2
En el estado PLAYING:
- Instanciar todas las entidades desde LEVEL_DATA en initLevel():
  platforms[], ladders[], switch, rebelAI, player (posición inicial: plataforma 1)
- Instanciar y conectar LadderSystem, PhysicsSystem, CollisionSystem
- En update(dt): PhysicsSystem → CollisionSystem → LadderSystem → Player → RebelAI → Switch
- En render: llamar Renderer.render() con todas las entidades
- Al detectar switch:activated via EventBus → setState(VICTORY) [stub, Fase 4]
- Método resetLevel(): destruye todas las entidades y vuelve a ejecutar initLevel()
  (necesario para reintentos)

## Comportamiento esperado al terminar la fase

1. El nivel completo se renderiza: 5 plataformas inclinadas con huecos visibles,
   5 escaleras visibles, IA rebelde animada en plataforma 5, interruptor en la cima
2. El jugador aparece en la plataforma 1 y puede caminar por toda su longitud
3. El jugador llega al final de la plataforma 1, sube la escalera 1→2 y llega a plataforma 2
4. Si el jugador camina sobre un hueco en plataforma 2, cae a la plataforma 1
5. El jugador puede recorrer todas las plataformas subiendo escaleras hasta llegar
   al interruptor en la cima
6. El ciclo de escaleras funciona: cada 7s comienzan a parpadear (3s), luego desaparecen (3s),
   luego reaparecen — todas sincronizadas
7. Si el jugador está trepando cuando la escalera desaparece, cae a su base
8. La IA rebelde en plataforma 5 muestra animaciones de glitch y código flotante
9. El interruptor es visible. Al llegar a él (colisión), se activa (sin secuencia aún)
10. Sin errores en consola en ningún momento del flujo

## Restricciones
- Sin sprites todavía, todo en canvas 2D con formas geométricas
- Sin estrellas IA ni esferas todavía (se implementan en Fase 3)
- La inclinación de plataformas debe ser funcional para la colisión, no solo visual
- Todos los valores desde CONSTANTS y LEVEL_DATA, nunca hardcodeados inline
- LadderSystem es el único responsable de cambiar el estado de las escaleras
- CollisionSystem no debe modificar score ni vidas directamente, solo emitir eventos
```

---

## Prompt 8
**IA:** Claude  
**Modelo:** Sonnet 4.6

### Contenido

```text
Revisá el PRD y verificá si está explícitamente definida la lógica de movimiento de las "estrellas IA".
Confirmá si el documento especifica todos los siguientes comportamientos:

Las estrellas IA se desplazan recorriendo completamente cada plataforma horizontal.
Su movimiento horizontal es en sentido contrario al avance del jugador humano.
Cuando una estrella llega al extremo de una plataforma, desciende automáticamente al nivel inferior.
Una vez en la plataforma inferior, continúa recorriéndola completamente.
Este patrón se repite hasta alcanzar el nivel más bajo del escenario.
Las estrellas IA actúan como enemigos móviles que bloquean el paso del jugador.
La única forma de que el jugador humano pueda superar una estrella IA es saltándola.
El contacto entre una estrella IA y el jugador provoca la pérdida de una vida o una derrota (según las reglas definidas).
Para cada punto indicá:

✅ Definido explícitamente.
⚠️ Implícito pero ambiguo.
❌ No definido. Si algún aspecto falta o resulta ambiguo, proponé el prompt para corregir el PRD de forma que se corrija y elimine cualquier diferencia de implementación.
```

---

## Prompt 9
**IA:** Claude  
**Modelo:** default

### Contenido

```text
Actúa como un senior product manager con experiencia en juegos arcade.

Tenés el PRD del juego AIKong. La sección 7 — Estrellas IA tiene ambigüedades y
omisiones críticas en la descripción del movimiento. Necesito que la reescribas
completamente para eliminar toda ambigüedad de implementación.

## Sección a reemplazar
Reemplazá el bloque "Movimiento" dentro de la Sección 7 — Estrellas IA por
una versión corregida y ampliada que cubra explícitamente los siguientes puntos:

### 7.X Movimiento — definición completa

**Patrón general**
Las Estrellas IA siguen un patrón de descenso en zig-zag por el escenario,
recorriendo cada plataforma de extremo a extremo antes de descender a la siguiente.
Este patrón continúa hasta que la estrella abandona el escenario por el extremo
inferior, momento en que desaparece.

**Recorrido por plataforma**
Especificá que:
- Al aparecer, la estrella se posiciona en el extremo de la plataforma más alta
  (Plataforma 5) y comienza a recorrerla horizontalmente en su totalidad.
- La estrella se desplaza de extremo a extremo de cada plataforma antes de
  descender a la siguiente. No descenderá antes de alcanzar el extremo.
- La estrella se mantiene sobre la superficie de la plataforma en todo momento,
  respetando su inclinación.

**Dirección horizontal**
Especificá que:
- La dirección de movimiento horizontal de cada estrella es opuesta a la dirección
  de avance del jugador en esa plataforma.
- Dado que el jugador asciende recorriendo las plataformas de derecha a izquierda
  (o de izquierda a derecha alternadamente según la estructura del nivel), las
  estrellas se mueven siempre en la dirección contraria al avance esperado,
  maximizando la probabilidad de encuentro frontal.
- La dirección se invierte en cada plataforma al descender (zig-zag).

**Transición entre plataformas**
Especificá que:
- Al alcanzar el extremo de una plataforma, la estrella desciende verticalmente
  hasta la superficie de la plataforma inmediatamente inferior.
- La transición es directa: no usa escaleras ni trayectoria diagonal.
- Una vez posicionada sobre la plataforma inferior, retoma inmediatamente el
  movimiento horizontal en la dirección opuesta a la plataforma anterior.

**Comportamiento ante huecos**
Mantener lo ya definido: las estrellas no caen por los huecos, los atraviesan
flotando como si fueran superficie sólida.

**Desaparición**
Mantener lo ya definido: al alcanzar el extremo inferior de la Plataforma 1 o
al salir del límite inferior del canvas, la estrella desaparece.

**Rol como obstáculo**
Agregá un párrafo que establezca explícitamente que:
- Las Estrellas IA son obstáculos móviles que bloquean físicamente el avance
  del jugador en cada plataforma.
- El movimiento en sentido contrario al jugador garantiza que ambos se aproximen
  frontalmente, obligando al jugador a reaccionar.
- La única forma de superar una Estrella IA sin perder una vida ni consumir
  protección es saltando sobre ella en el momento en que el jugador y la estrella
  se encuentran en la misma plataforma. No existe ningún otro mecanismo para
  evitar el impacto salvo la protección de la esfera verde.

## Instrucciones adicionales
- Mantené el estilo y el formato del PRD original.
- No modifiques ninguna otra sección del documento.
- No agregues mecánicas nuevas, solo clarificá las existentes.
- El resultado debe ser suficientemente preciso para que dos desarrolladores
  independientes implementen exactamente el mismo comportamiento sin necesidad
  de consultar fuentes externas.
```

---

## Prompt 10
**IA:** ChatGPT  
**Modelo:** GPT-5.5

### Contenido

```text
Actúa como un ingeniero de prompts y genera un prompt para pedirle a cursor que revise la definición del proyecto en el archivo ai_kong_prd.md y que revise toda la estructura de la solución para verificar el avance (están desarrolladas las etapas 1 y 2), sin hacer ningún cambio.
```

---

## Prompt 11
**IA:** Cursor  
**Modelo:** Agent Auto

### Contenido

```text
Necesito que realices una revisión exhaustiva del proyecto AI Kong antes de recibir nuevas instrucciones.

## Objetivo de esta tarea

Tu objetivo NO es modificar código, crear archivos ni proponer implementaciones todavía.

Primero debes comprender completamente:

1. La definición funcional del juego.
2. La arquitectura actual del proyecto.
3. El estado real de avance de la implementación.
4. Las diferencias entre lo especificado y lo implementado.

## Documentación a revisar

Lee completamente:

* `ai_kong_prd.md`

Debes considerar este documento como la fuente de verdad del proyecto.

## Alcance de la revisión

Analiza toda la estructura de la solución:

* carpetas
* archivos
* módulos
* clases
* assets
* configuración
* documentación
* código fuente

Recorre el proyecto completo para entender cómo está construido actualmente.

## Estado esperado

Según el plan de desarrollo del PRD:

### Fase 1 — Motor base

Implementar:

* Canvas
* requestAnimationFrame
* delta time
* máquina de estados
* física básica
* colisiones básicas

### Fase 2 — Nivel y jugador

Implementar:

* nivel completo
* plataformas
* huecos
* escaleras
* interruptor
* ciclo de escaleras inestables
* movimiento del jugador
* salto
* subida y bajada de escaleras

Asume que el objetivo actual es tener desarrolladas únicamente las Fases 1 y 2.

## Qué debes verificar

### 1. Comprensión del PRD

Resume:

* objetivo del juego
* mecánicas principales
* flujo de juego
* restricciones importantes
* reglas de movimiento
* comportamiento de escaleras
* comportamiento de estrellas IA

### 2. Revisión de arquitectura

Identifica:

* módulos existentes
* responsabilidades de cada módulo
* dependencias entre módulos
* organización general del código

### 3. Estado de implementación

Indica para cada funcionalidad relevante:

* ✅ Implementado
* ⚠️ Parcialmente implementado
* ❌ No implementado

Comparándolo contra el PRD.

### 4. Validación de Fase 1

Determina si realmente está terminada.

Justifica cada conclusión con evidencia encontrada en el código.

### 5. Validación de Fase 2

Determina si realmente está terminada.

Justifica cada conclusión con evidencia encontrada en el código.

### 6. Desviaciones respecto del PRD

Identifica:

* funcionalidades implementadas que no están en el PRD
* funcionalidades del PRD que faltan
* comportamientos ambiguos
* posibles errores de diseño
* inconsistencias entre documentación y código

## Restricciones importantes

NO modificar código.

NO crear archivos.

NO eliminar archivos.

NO refactorizar.

NO corregir bugs.

NO generar parches.

NO hacer cambios automáticos.

Tu única tarea es analizar y reportar.

## Formato esperado de la respuesta

Genera un informe estructurado con las siguientes secciones:

# Resumen ejecutivo

# Comprensión del PRD

# Arquitectura actual

# Estado de implementación

# Validación Fase 1

# Validación Fase 2

# Desviaciones respecto del PRD

# Riesgos detectados

# Recomendaciones para la siguiente etapa

No realices ningún cambio hasta recibir nuevas instrucciones explícitas.
```

---

## Prompt 12
**IA:** ChatGPT  
**Modelo:** GPT-5.5

### Contenido

```text
Actúa como un ingeniero de prompts y genera un prompt para corregir las inconsistencias detectadas en la etapa 2. Sin avanzar con otras etapas.
```

---

## Prompt 13
**IA:** Cursor  
**Modelo:** Agent Auto

### Contenido

```text
Revisa el informe de auditoría que acabas de generar y aplica únicamente las correcciones necesarias para resolver las inconsistencias detectadas en la Fase 2 respecto de `ai_kong_prd.md`.

Restricciones:

* No implementes funcionalidades de Fase 3 o posteriores.
* No agregues nuevas mecánicas.
* No realices refactorizaciones innecesarias.
* Mantén la arquitectura actual siempre que sea posible.
* Modifica únicamente lo necesario para que la implementación cumpla completamente con los requisitos de Fase 2 definidos en el PRD.

Al finalizar:

1. Enumera las inconsistencias corregidas.
2. Indica qué archivos fueron modificados.
3. Confirma que no se implementó ninguna funcionalidad fuera del alcance de Fase 2.
```

---

## Prompt 14
**IA:** ChatGPT  
**Modelo:** GPT-5.5

### Contenido

```text
Actúa como un ingeniero de prompts y genera un prompt para implementar la etapa 3 del documento prd.
```

---

## Prompt 15
**IA:** Cursor  
**Modelo:** Agent Auto

### Contenido

```text
Implementa completamente la **Fase 3 — Mecánicas y Sistemas** definida en `ai_kong_prd.md`.

Antes de realizar cambios:

1. Lee completamente el PRD actualizado.
2. Revisa la implementación actual.
3. Verifica que las funcionalidades de Fase 1 y Fase 2 existentes continúen funcionando correctamente.
4. Reutiliza la arquitectura y módulos existentes siempre que sea posible.

## Alcance de esta tarea

Implementar exclusivamente las funcionalidades de Fase 3:

### Estrellas IA

* Sistema de generación (spawn).
* Temporización de aparición.
* Movimiento completo según la sección:

  * "07 — Estrellas IA — Especificación de Movimiento".
* Colisiones con el jugador.
* Desaparición al abandonar el escenario.
* Reutilización mediante pool de objetos si corresponde.
* Salto sobre estrella para evitar daño.
* Detección de salto exitoso sobre estrella.

### Esferas verdes

* Aparición inicial en plataformas definidas por el PRD.
* Recolección por parte del jugador.
* Eliminación al ser recogidas.
* No reaparecen durante la partida.

### Protección temporal

* Activación al recoger esfera.
* Duración exacta definida en el PRD.
* Indicador visual correspondiente.
* Parpadeo durante los últimos segundos.
* Consumo de protección al recibir impacto.

### Sistema de vidas

* Cantidad inicial de vidas según PRD.
* Pérdida de vida por colisión con Estrella IA.
* Respawn en la última plataforma alcanzada.
* Conservación del estado requerido por el PRD.

### Temporizador

* Cuenta regresiva.
* Reinicio cuando corresponde.
* Integración con el sistema de vidas.
* Comportamiento exacto definido en el PRD.

### Sistema de puntuación

Implementar todos los eventos de puntuación especificados:

* Saltar sobre Estrella IA.
* Recolectar esfera verde.
* Caer por hueco.
* Bonus por combo.
* Cualquier otro evento definido en el PRD para esta etapa.

### Sistema de combos

* Seguimiento de saltos consecutivos sobre Estrellas IA.
* Reinicio de combo según reglas del PRD.
* Otorgamiento del bonus correspondiente.

## Restricciones

NO implementar funcionalidades de Fase 4.

NO implementar:

* Pantalla de victoria final.
* Pantalla de derrota final.
* Secuencia de apagado de la IA.
* Animaciones finales.
* Polish visual no requerido para Fase 3.
* Ajustes cosméticos fuera de alcance.

Implementa únicamente la lógica y sistemas pertenecientes a Fase 3.

## Validación obligatoria

Al finalizar:

1. Verifica cada requisito implementado contra el PRD.
2. Corrige cualquier inconsistencia detectada.
3. Asegúrate de que las mecánicas de Fase 2 continúen funcionando correctamente.

## Entregable

Genera un informe final indicando:

* Requisitos de Fase 3 implementados.
* Archivos creados.
* Archivos modificados.
* Decisiones de diseño relevantes.
* Posibles pendientes que correspondan exclusivamente a Fase 4.
```

---

## Prompt 16
**IA:** ChatGPT  
**Modelo:** GPT-5.5

### Contenido

```text
Actúa como un ingeniero de prompts y genera un prompt para implementar la etapa 4 del documento prd.
```

---

## Prompt 17
**IA:** Cursor  
**Modelo:** Agent Auto

### Contenido

```text
Implementa completamente la **Fase 4 — Polish y QA** definida en `ai_kong_prd.md`.

Antes de realizar cambios:

1. Lee completamente el PRD actualizado.
2. Revisa la implementación existente.
3. Verifica que las Fases 1, 2 y 3 funcionen correctamente antes de comenzar.
4. Mantén la arquitectura actual del proyecto.

## Alcance de esta tarea

Implementar exclusivamente las funcionalidades de Fase 4.

### IA rebelde

Implementar la representación visual permanente de la IA rebelde según el PRD:

* Presencia constante en la plataforma superior.
* Animaciones de glitch.
* Corrupción visual.
* Píxeles corruptos.
* Fragmentos de código flotante.
* Comportamiento visual coherente con la estética definida.

### Secuencia de victoria

Implementar completamente la secuencia descrita en el PRD:

* Activación del interruptor.
* Glitches intensificados.
* Corrupción progresiva.
* Apagado visual de la IA.
* Celebración del jugador.
* Pantalla de resultado final.
* Cálculo correcto de puntuación final.

### Pantalla de derrota

Implementar:

* Detección de pérdida de la última vida.
* Pantalla de Game Over.
* Mensaje definido en el PRD.
* Visualización de puntuación final.

### Pantallas del juego

Completar y ajustar:

* MENU
* PLAYING
* VICTORY
* GAME_OVER

Verificar que las transiciones respeten la máquina de estados definida en el PRD.

### Reinicio de partida

Implementar reinicio completo desde:

* VICTORY
* GAME_OVER

El reinicio debe restaurar exactamente:

* Puntuación.
* Vidas.
* Temporizador.
* Posición del jugador.
* Estado de escaleras.
* Esferas verdes.
* Estrellas IA.
* Timers globales.
* Cualquier otro estado persistente.

### HUD

Completar y validar:

* Puntuación.
* Vidas.
* Temporizador.
* Estado de protección.
* Legibilidad visual.
* Actualización inmediata de todos los valores.

### QA y cumplimiento del PRD

Verificar exhaustivamente:

* Requisitos funcionales.
* Requisitos técnicos.
* Criterios de aceptación.
* Reglas de movimiento.
* Reglas de escaleras.
* Reglas de Estrellas IA.
* Sistema de puntuación.
* Sistema de protección.
* Máquina de estados.

Corregir cualquier inconsistencia encontrada respecto del PRD.

## Restricciones

No agregar funcionalidades que no estén definidas en el PRD.

No introducir nuevas mecánicas.

No modificar reglas de juego ya definidas.

No alterar valores de balance salvo que sea necesario para cumplir el PRD.

## Validación final obligatoria

Al finalizar:

1. Ejecuta una revisión completa contra todos los criterios de aceptación del PRD.
2. Lista cada criterio indicando:

   * ✅ Cumple
   * ⚠️ Parcial
   * ❌ No cumple
3. Corrige cualquier incumplimiento detectado que esté dentro del alcance de Fase 4.

## Entregable

Genera un informe final con:

* Funcionalidades implementadas.
* Archivos creados.
* Archivos modificados.
* Criterios de aceptación validados.
* Problemas encontrados y resueltos.
* Pendientes restantes (si existieran).
* Confirmación explícita de cumplimiento del PRD.
```

---

## Prompt 18
**IA:** ChatGPT  
**Modelo:** GPT-5.5

### Contenido

```text
detecté algunas fallas en mi testeo:
- Error: el salto me permite alcanzar la plataforma superior. El salto debería ser un movimiento de subida y bajada a la plataforma actual, no debe permitir subir una plataforma. Si el botón de salto se apreta mientras se está completando un salto, lo que hace es mantener la duración del salto, pero no lo eleva más.
- Error: al perder una vida el humano reaparece en el lugar de la plataforma donde estaba, debe aparecer al inicio de la plataforma donde se encontraba y debe recorrer esa plataforma nuevamente

Actúa como un ingeniero de prompts y genera un prompt para corregir esos errores en el juego y reflejarlos en el prd.
```

---

## Prompt 19
**IA:** Cursor  
**Modelo:** Agent Auto

### Contenido

```text
He detectado dos inconsistencias entre el comportamiento actual del juego y la intención del PRD. Necesito que actualices tanto la implementación como el PRD para reflejar correctamente las reglas deseadas.

## Corrección 1 — Salto

### Problema detectado

Actualmente el salto permite alcanzar o aterrizar sobre una plataforma superior.

Esto es incorrecto.

### Comportamiento correcto

El salto debe servir únicamente para:

* esquivar Estrellas IA
* desplazarse dentro de la misma plataforma

Bajo ninguna circunstancia debe permitir:

* alcanzar una plataforma superior
* aterrizar en una plataforma superior
* evitar la mecánica de escaleras

La altura máxima del salto debe ser siempre inferior a la separación vertical entre plataformas.

### Salto mantenido

Si el jugador vuelve a presionar el botón de salto mientras ya se encuentra en el aire:

* NO debe iniciar un nuevo salto
* NO debe aumentar la altura alcanzada
* NO debe producir double-jump
* NO debe producir impulso vertical adicional

Como máximo puede prolongar levemente la fase actual del salto sin incrementar la altura máxima definida.

### Acciones requeridas

1. Corregir la implementación.
2. Ajustar la física del salto.
3. Revisar colisiones con plataformas.
4. Actualizar el PRD para que esta regla quede explícitamente definida.
5. Verificar que no exista ninguna combinación de teclas que permita acceder a plataformas superiores sin usar escaleras.

---

## Corrección 2 — Respawn tras perder una vida

### Problema detectado

Actualmente el jugador reaparece en la posición exacta donde se encontraba al perder la vida.

Esto es incorrecto.

### Comportamiento correcto

Cuando el jugador pierde una vida:

* debe reaparecer al inicio de la última plataforma alcanzada
* debe volver a recorrer dicha plataforma
* no debe reaparecer en la posición exacta donde ocurrió la muerte

Ejemplos:

* Si muere en Plataforma 1 → reaparece en el punto inicial del nivel.
* Si muere en Plataforma 2 → reaparece al inicio de Plataforma 2.
* Si muere en Plataforma 3 → reaparece al inicio de Plataforma 3.
* Si muere en Plataforma 4 → reaparece al inicio de Plataforma 4.
* Si muere en Plataforma 5 → reaparece al inicio de Plataforma 5.

### Acciones requeridas

1. Corregir la lógica de respawn.
2. Definir claramente el punto de inicio de cada plataforma.
3. Actualizar el PRD para reflejar este comportamiento.
4. Revisar cualquier sistema relacionado que dependa de la posición de respawn.

---

## Restricciones

* No modificar otras mecánicas.
* No alterar puntuación.
* No alterar Estrellas IA.
* No alterar esferas verdes.
* No alterar temporizadores.
* No realizar refactorizaciones innecesarias.

## Entregable

Al finalizar:

1. Indica los cambios realizados en el código.
2. Indica las secciones del PRD actualizadas.
3. Explica cómo verificaste que el salto ya no permite acceder a plataformas superiores.
4. Explica cómo verificaste que el respawn ocurre al inicio de la plataforma correspondiente.
```

---

## Prompt 20
**IA:** ChatGPT  
**Modelo:** GPT-5.5

### Contenido

```text
detecté algunas fallas:
- necesito que revise la inclinación de las lineas impares, debe ser igual que la de las lineas pares pero en sentido opuesto 
- el interruptor de la ia debe estar sobre la ia, hay que subir una escalera para alcanzarlo 
- el color de las escaleras no debe ser verde para que se distinga de las esferas de inmunidad. 
- cuando se pierde una vida se tiene que hacer una pausa y mostrar un mensaje de perdida de vida antes de reiniciar la vida siguiente 
- el humano puede tener algún indicador de cantidad de vidas disponibles

Actúa como un ingeniero de prompts y genera un prompt para corregir esos errores en el juego y reflejarlos en el prd.
```

---

## Prompt 21
**IA:** Cursor  
**Modelo:** Agent Auto

### Contenido

```text
Necesito aplicar los siguientes ajustes visuales y de UX al proyecto AI Kong y reflejarlos también en `ai_kong_prd.md`.

## Restricción principal

No modificar mecánicas existentes salvo donde se indique explícitamente.

Mantener intactos:

* movimiento
* físicas
* colisiones
* comportamiento de Estrellas IA
* escaleras inestables
* puntuación
* temporizador
* protección
* flujo general de juego

---

## 1. Revisar inclinación de plataformas

La inclinación de las plataformas impares no está respetando el patrón esperado.

Validar y corregir para que cada plataforma tenga exactamente la misma pendiente absoluta que la plataforma adyacente, pero en sentido opuesto.

Patrón requerido:

* Plataforma 1: asciende de izquierda a derecha.
* Plataforma 2: asciende de derecha a izquierda.
* Plataforma 3: asciende de izquierda a derecha.
* Plataforma 4: asciende de derecha a izquierda.
* Plataforma 5: asciende de izquierda a derecha.

La diferencia de altura entre extremos debe ser consistente en todas las plataformas.

Actualizar el PRD para documentar claramente este patrón.

---

## 2. Reubicar interruptor de apagado de IA

Actualmente el interruptor está separado de la progresión natural del nivel.

Necesito que:

* el interruptor quede ubicado físicamente sobre la IA rebelde.
* el jugador deba subir la última escalera para alcanzarlo.
* el interruptor forme parte del objetivo final del recorrido.

Visualmente debe quedar claro que:

* la IA protege el interruptor.
* el interruptor es el mecanismo para apagarla.

Actualizar el PRD para reflejar esta ubicación definitiva.

---

## 3. Diferenciar visualmente las escaleras

Actualmente las escaleras utilizan un color muy similar al de las esferas verdes.

Necesito mejorar la legibilidad visual.

Requisitos:

* las escaleras no deben utilizar tonos verdes.
* conservar estética retro/neón.
* diferenciar claramente:

  * escaleras
  * esferas de inmunidad

Proponer una paleta coherente con el resto del juego.

Actualizar el PRD si existe referencia visual a los colores de las escaleras.

---

## 4. Secuencia de pérdida de vida

Actualmente la transición entre vidas es demasiado inmediata.

Implementar una pausa breve cuando el jugador pierde una vida.

Comportamiento esperado:

1. Se detecta la pérdida de vida.
2. El juego se pausa temporalmente.
3. Se muestra un mensaje visual claro.

Ejemplo:

* "VIDA PERDIDA"
* "TE QUEDAN 2 VIDAS"

4. El jugador puede comprender lo ocurrido.
5. Finalizada la pausa, se realiza el respawn normal.

La duración debe ser suficiente para que el mensaje pueda leerse cómodamente.

Actualizar el PRD para documentar esta secuencia.

---

## 5. Indicador visual de vidas del jugador

Mejorar la representación visual de vidas disponibles.

Objetivos:

* que sea fácilmente visible.
* que se identifique rápidamente cuántas vidas quedan.
* que mantenga coherencia con la estética del juego.

Se puede utilizar:

* icono del jugador
* miniaturas del personaje
* corazones
* otro indicador visual coherente

Mantener la información actual de vidas pero mejorar su presentación visual.

Actualizar el PRD para reflejar la solución elegida.

---

## Actualización obligatoria del PRD

Incorporar estos cambios en las secciones correspondientes del documento:

* Diseño del escenario.
* Plataformas.
* Escaleras.
* Interruptor de apagado.
* HUD.
* Sistema de vidas.
* Flujo de pérdida de vida.

---

## Entregable

Al finalizar:

1. Listar archivos modificados.
2. Explicar cada ajuste realizado.
3. Indicar qué secciones del PRD fueron actualizadas.
4. Confirmar que no se alteró la lógica principal del juego fuera de los cambios solicitados.
```

---

## Prompt 22
**IA:** ChatGPT  
**Modelo:** GPT-5.5

### Contenido

```text
detecté algunas fallas:
- si salto al subir al 5to plataforma, apago la ia. la ia debería ubicarse al final del 5ta plataforma, la tengo que recorrer toda para poder subir la ultima escalera y apagarla, o sea, el interruptor es como que estuviera en una mimniplataforma 6 
- cuando muestra los puntajes finales amontona leyendas con puntuaciones y no se puede leer el puntaje
Actúa como un ingeniero de prompts y genera un prompt para corregir esos errores en el juego y reflejarlos en el prd.
```

---

## Prompt 23
**IA:** Cursor  
**Modelo:** Agent Auto

### Contenido

```text
He detectado dos problemas funcionales y de UX que deben corregirse tanto en la implementación como en `ai_kong_prd.md`.

## 1. Corrección del objetivo final (IA e interruptor)

### Problema detectado

Actualmente es posible alcanzar el interruptor y apagar la IA apenas se llega a la Plataforma 5.

Incluso puede ocurrir al saltar cerca de la zona final.

Esto rompe la progresión esperada del nivel.

### Comportamiento correcto

La IA rebelde debe ubicarse al final de la Plataforma 5.

El jugador debe:

1. Llegar a la Plataforma 5.
2. Recorrer completamente la Plataforma 5.
3. Alcanzar la posición de la IA.
4. Subir una última escalera.
5. Llegar a una pequeña plataforma final exclusiva para el interruptor.
6. Activar la palanca para apagar la IA.

Conceptualmente:

* Plataforma 5 = zona final de enfrentamiento con la IA.
* Plataforma 6 = mini plataforma superior que contiene únicamente el interruptor.

### Requisitos

Implementar:

* una mini plataforma final superior.
* una escalera final entre Plataforma 5 y Plataforma 6.
* reubicación visual de la IA al extremo final de Plataforma 5.
* reubicación del interruptor a Plataforma 6.

Validar que:

* el interruptor no pueda activarse desde Plataforma 5.
* el salto no permita alcanzar la Plataforma 6.
* el jugador deba utilizar obligatoriamente la última escalera.

### Actualización del PRD

Actualizar las secciones correspondientes para reflejar:

* ubicación definitiva de la IA.
* existencia de Plataforma 6 (plataforma de apagado).
* escalera final.
* secuencia correcta de finalización del nivel.

---

## 2. Corrección de pantalla de puntuación final

### Problema detectado

La pantalla final muestra múltiples textos y valores superpuestos.

Las leyendas se amontonan y el puntaje final resulta difícil o imposible de leer.

### Comportamiento correcto

La pantalla final debe tener una distribución clara y legible.

Requisitos:

* evitar cualquier superposición de textos.
* separar visualmente cada línea de información.
* asegurar márgenes adecuados.
* mantener alineación consistente.
* garantizar lectura clara en todas las resoluciones soportadas.

### Validar especialmente

* puntaje final
* bonus
* vidas restantes
* tiempo restante
* total final
* mensajes de victoria o derrota

### Actualización del PRD

Agregar una aclaración en la sección de pantallas finales indicando que:

* toda la información debe presentarse de forma legible.
* no puede existir superposición de textos.
* el puntaje final debe tener prioridad visual.

---

## Restricciones

No modificar:

* sistema de puntuación.
* reglas de victoria.
* reglas de derrota.
* comportamiento de Estrellas IA.
* físicas.
* controles.
* escaleras existentes.

Realizar únicamente los cambios necesarios para corregir estos problemas.

---

## Entregable

Al finalizar:

1. Enumerar archivos modificados.
2. Explicar cómo quedó la nueva secuencia final del nivel.
3. Mostrar qué se modificó en el PRD.
4. Confirmar que la Plataforma 6 solo puede alcanzarse mediante la última escalera.
5. Confirmar que la pantalla final ya no presenta textos superpuestos.
```
---

## Prompt 24
**IA:** ChatGPT  
**Modelo:** GPT-5.5

### Contenido

```text
Actúa como ingeniero de prompts experto y generá un prompt para solucionar los siguientes bugs del juego: 
- cuando se pierde una vida las estrellas ia siguen corriendo y al volver al juego puedo chocar otra antes de poder moverme. Al volver a reiniciar despues de perder una vida, las estrellas ia del tablero se limpian y comienzan a lanzarse como al iniciar la partida. 
- sólo se puede saltar usando la barra espaciadora, no se salta con la flecha hacia arriba. 
- las estrellitas ia recorren la plataforma hasta el final de la línea y caen por detrás de la escalera. Esto es para que la parte de atrás de la escalera no sirva como escondite para que el humano evite las estrellas. 
Generá el prompt para hacer estas tres correcciones y que queden reflejadas en el archivo prd.
```

---

## Prompt 25
**IA:** Cursor  
**Modelo:** Agent Auto

### Contenido

```text
Actúa como un desarrollador senior de videojuegos HTML5/Canvas y como analista funcional responsable de mantener sincronizados el código y el PRD.

Tu tarea es corregir los siguientes bugs de gameplay y actualizar el PRD para que refleje exactamente el comportamiento esperado.

IMPORTANTE
Analiza primero la arquitectura actual.
Identifica todos los módulos afectados.
Implementa las correcciones en código.
Actualiza el PRD en todas las secciones necesarias.
Verifica que no existan contradicciones entre requisitos funcionales, criterios de aceptación y comportamiento real.
Entrega un resumen detallado de los cambios realizados.
BUG 1 – Reinicio incorrecto de Estrellas IA al perder una vida
Problema actual

Cuando el jugador pierde una vida:

aparece el mensaje de vida perdida,
se realiza el respawn,
pero las Estrellas IA continúan existiendo y moviéndose durante la pausa.

Como consecuencia, al reaparecer el jugador puede colisionar inmediatamente con una estrella antes de poder reaccionar o moverse.

Esto genera muertes injustas y rompe la experiencia de juego.

Comportamiento requerido

Al perder una vida:

Descontar la vida correspondiente.
Mostrar el mensaje "VIDA PERDIDA".
Pausar el gameplay durante la duración configurada.
Antes del respawn:
eliminar todas las Estrellas IA activas,
limpiar completamente el pool/lista de estrellas,
reiniciar el sistema de spawn,
reiniciar el timer interno de generación.
Reposicionar al jugador en el punto de respawn correspondiente.
Reanudar el juego.
La primera Estrella IA debe volver a generarse 2 segundos después del respawn.
Las siguientes deben continuar apareciendo cada 6 segundos.

El comportamiento debe ser equivalente al estado inicial de una partida nueva respecto a las Estrellas IA.

Criterio de aceptación

Después de perder una vida:

no debe quedar ninguna Estrella IA en pantalla,
el jugador debe reaparecer en un entorno limpio,
debe existir una ventana segura mínima de 2 segundos antes de la aparición de la primera nueva estrella.
BUG 2 – Control de salto incorrecto
Problema actual

El personaje puede saltar usando:

barra espaciadora,
flecha arriba.

Esto entra en conflicto con el sistema de escaleras.

Comportamiento requerido

La barra espaciadora debe ser la única tecla válida para saltar.

Reglas
ESPACIO = saltar.
FLECHA ARRIBA = subir escaleras.
FLECHA ABAJO = bajar escaleras.
A/D o IZQUIERDA/DERECHA = movimiento horizontal.

Fuera de una escalera activa:

la flecha arriba no debe producir salto,
la flecha arriba no debe producir ninguna otra acción.

Eliminar cualquier lógica existente que permita iniciar un salto mediante ArrowUp.

Criterio de aceptación
Presionar flecha arriba fuera de una escalera no hace nada.
Presionar flecha arriba dentro de una escalera inicia el ascenso.
El salto solo puede iniciarse con barra espaciadora.
BUG 3 – Recorrido incorrecto de Estrellas IA cerca de escaleras
Problema actual

Las Estrellas IA están descendiendo antes de completar totalmente algunas plataformas.

Esto genera una zona segura detrás de determinadas escaleras.

El jugador puede quedarse escondido en esa zona y evitar completamente las estrellas.

Ese comportamiento contradice el diseño previsto.

Comportamiento requerido

Las Estrellas IA deben recorrer SIEMPRE la plataforma completa.

La lógica correcta es:

Recorrer toda la longitud de la plataforma actual.
Llegar al extremo real de la plataforma.
Sobrepasar visualmente la zona de escalera.
Descender únicamente cuando alcancen el extremo definido para esa plataforma.
Continuar hacia la siguiente plataforma.

Las escaleras:

no alteran la trayectoria,
no alteran el punto de descenso,
no funcionan como waypoint,
no funcionan como punto de cambio de dirección.
Regla adicional obligatoria

La parte posterior de una escalera nunca debe convertirse en un escondite seguro.

Toda superficie transitable de una plataforma debe poder ser alcanzada por una Estrella IA durante su recorrido.

No debe existir ninguna posición donde el jugador pueda permanecer indefinidamente sin riesgo únicamente aprovechando la ubicación de una escalera.

Criterio de aceptación

Para cada plataforma:

la estrella recorre el 100% de su longitud,
alcanza el borde extremo,
recién entonces inicia el descenso,
la zona detrás de la escalera sigue siendo alcanzada por las estrellas.
ACTUALIZACIÓN DEL PRD

Modificar el PRD para reflejar exactamente estos cambios.

Actualizar todas las secciones afectadas:

Requisitos Funcionales

Actualizar:

RF-02
RF-03
RF-04
RF-06
RF-07

o cualquier otro requisito relacionado.

Requisitos Técnicos

Agregar reglas explícitas sobre:

reinicio del sistema de spawn al perder una vida,
limpieza de enemigos activos durante respawn,
control exclusivo de salto mediante barra espaciadora,
recorrido completo de plataformas por parte de las Estrellas IA.
Sistema de vidas

Actualizar el flujo de pérdida de vida para indicar que:

las Estrellas IA activas se eliminan,
el sistema de spawn se reinicia,
el jugador reaparece en un entorno limpio.
Especificación de Movimiento de Estrellas IA

Actualizar la sección completa para dejar explícito que:

las estrellas recorren la plataforma completa,
las escaleras no afectan su trayectoria,
el descenso ocurre únicamente en los extremos definidos de cada plataforma,
no pueden generarse zonas seguras detrás de escaleras.
Criterios de Aceptación

Agregar criterios verificables para los tres cambios anteriores.

VALIDACIÓN FINAL

Antes de finalizar:

Buscar contradicciones en el PRD.
Corregir referencias obsoletas a salto con flecha arriba.
Verificar que el flujo de respawn y el flujo de generación de estrellas sean consistentes.
Verificar que el comportamiento descrito para las Estrellas IA coincida con la implementación real.
Generar un resumen de cambios realizados en código y documentación.
```

---

## Prompt 26
**IA:** ChatGPT  
**Modelo:** GPT-5.5

### Contenido

```text
Actúa como ingeniero de prompt experto y genera un prompt para comprender y solucionar el bug del recorrido de las estrellas. Se mantuvo el bug de que el humano puede esconderse de las estrellas ia atrás de una escalera porque las estrellas ia bajan antes de la escalera. La solucion es que las estrellas ia recorran hasta el final del canvas aunque se haya terminado la plataforma, pueden pasar sobre las escaleras de la misma forma que atraviesan los huecos de la plataforma y caigan pegadas al borde del canvas para tener una cobertura completa de la linea. 
Generá el prompt para corregir el bug y que quede reflejado en el archivo prd.
```

---

## Prompt 27
**IA:** Cursor  
**Modelo:** Agent Auto

### Contenido

```text
Eres un engineer senior en gameplay systems y game design técnico. Tu tarea es analizar y corregir un bug crítico en la lógica de movimiento de enemigos (estrellas IA) en un juego tipo plataforma.

🎯 CONTEXTO DEL PROBLEMA

En el juego, las “estrellas IA” son enemigos que recorren plataformas horizontales y caen por huecos o escaleras, similar a un comportamiento tipo Donkey Kong simplificado.

Actualmente existe el siguiente bug:

El jugador puede “esconderse” detrás de una escalera.
Esto ocurre porque las estrellas IA bajan por la escalera antes de llegar al final de la plataforma.
Como resultado, la escalera actúa como un punto de “corte de recorrido” en lugar de ser solo un elemento atravesable.
Esto genera una zona segura no intencionada, rompiendo la lógica de persecución/recorrido continuo.
❌ COMPORTAMIENTO ACTUAL INCORRECTO
Las estrellas IA detectan escaleras como punto de cambio de nivel.
Abandonan la plataforma antes de recorrer toda su longitud.
No garantizan cobertura completa del borde del canvas.
Permiten exploit del jugador: esconderse detrás de escaleras.
✅ COMPORTAMIENTO ESPERADO (CORRECCIÓN)

Debes modificar la lógica de movimiento de las estrellas IA con estas reglas:

Las estrellas IA deben recorrer siempre toda la plataforma hasta el final del canvas horizontal, independientemente de la presencia de escaleras.
Las escaleras NO deben interrumpir el recorrido horizontal.
Las estrellas IA pueden:
Atravesar escaleras sin interactuar con ellas.
Atravesar huecos de plataforma como ya ocurre actualmente.
Solo al llegar al final real de la plataforma/canvas horizontal, pueden:
Cambiar de nivel
O caer al siguiente nivel según la lógica existente del juego
Visualmente y físicamente:
Deben poder “pisar encima” de escaleras (no colisionar ni desviarse por ellas)
Deben mantener continuidad de trayectoria horizontal sin cortes
🧠 REGLA CLAVE DE DISEÑO

Las escaleras son elementos de tránsito del jugador, no decisiones de navegación de la IA.

La IA debe priorizar:

Cobertura completa del nivel
Recorrido determinista de borde a borde
Eliminación de zonas seguras explotables
🛠️ TAREAS DEL AGENTE
Analizar la lógica actual de movimiento de las estrellas IA.
Identificar dónde las escaleras están afectando la decisión de pathing.
Refactorizar la lógica para que:
Las escaleras sean ignoradas en el eje horizontal
Solo los bordes del nivel afecten el cambio de dirección o caída
Asegurar que no se rompa la lógica existente de huecos en plataformas.
Verificar que el jugador no pueda crear zonas seguras detrás de escaleras.
📄 ACTUALIZACIÓN DEL PRD

Debes además actualizar el PRD del juego agregando una sección:

“Comportamiento de enemigos (estrellas IA) – reglas de recorrido”

Incluir explícitamente:

Las estrellas IA recorren plataformas de extremo a extremo del canvas.
Las escaleras no afectan el path horizontal de la IA.
La IA ignora escaleras para navegación.
El diseño evita zonas seguras explotables por el jugador.
Las transiciones de nivel ocurren solo en bordes o lógica de caída, nunca por escaleras.
🚨 CRITERIO DE VALIDACIÓN

El bug se considera resuelto si:

El jugador NO puede evitar contacto con estrellas escondiéndose detrás de escaleras.
Las estrellas recorren toda la línea horizontal completa.
No hay interrupciones de movimiento causadas por escaleras.
El comportamiento es consistente en todos los niveles.
🎯 SALIDA ESPERADA
Explicación del fix aplicado
Cambios en lógica de movimiento
Actualización del PRD con la nueva regla de IA
Confirmación de eliminación del exploit

```