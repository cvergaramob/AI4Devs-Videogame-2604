# AI Kong — Product Requirements Document

**Versión:** 1.0.0 · MVP  
**Estado:** DRAFT  
**Plataforma:** Web / Browser  
**Stack:** HTML + CSS + JavaScript puro (sin frameworks ni librerías)  
**Duración de partida:** 1–3 minutos  
**Scope:** 1 nivel · 1 enemigo · 1 objetivo

---

## 01 — Visión & Objetivos

### Declaración de visión

AI Kong es una experiencia arcade de plataformas de ciclo corto, inspirada en Donkey Kong, donde el jugador asciende por una estructura de plataformas y escaleras para apagar una IA rebelde antes de perder todas sus vidas. El juego debe ser inmediatamente comprensible, satisfactorio en la primera partida, y lo suficientemente desafiante para motivar reintentos.

### Objetivos de negocio / producto

| ID | Objetivo |
|----|----------|
| OBJ-01 | Entregar una versión completamente jugable (MVP) con un único nivel, un único enemigo y un único objetivo, estable y sin errores bloqueantes. |
| OBJ-02 | Lograr que cualquier jugador nuevo comprenda las reglas sin instrucciones externas en menos de 60 segundos de juego. |
| OBJ-03 | Establecer una base técnica limpia y extensible que permita incorporar nuevos niveles, enemigos y mecánicas en iteraciones futuras sin refactoring mayor. |
| OBJ-04 | Generar una identidad visual propia y memorable basada en la estética de IA corrupta, diferenciándose del Donkey Kong original. |

### Alcance del MVP

**Incluido en v1:**
- 1 nivel completo jugable
- 5 plataformas jugables + 1 plataforma de apagado (Plataforma 6) + 5 escaleras de progresión
- Estrellas IA como enemigo principal
- Esferas verdes (protección temporal)
- Escaleras inestables sincronizadas
- Sistema de vidas (3 vidas)
- Temporizador (90 segundos)
- Sistema de puntuación completo
- Condiciones de victoria y derrota
- Animación de apagado de IA
- Respawn en última plataforma alcanzada

**Excluido de v1:**
- Múltiples niveles
- Múltiples tipos de enemigo
- Power-ups adicionales
- Tabla de high scores global
- Audio / efectos de sonido
- Guardado de progreso
- Modo multijugador
- Dificultad seleccionable
- Versión móvil / touch
- Animaciones cinematográficas

---

## 02 — Requisitos Funcionales

### Jugador y controles

| ID | Requisito |
|----|-----------|
| RF-01 | El jugador debe poder moverse hacia la izquierda y derecha con las teclas de flecha o `A/D`. El movimiento debe ser fluido y responder en el mismo frame del input. |
| RF-02 | El jugador debe poder saltar con la tecla `Espacio` o flecha arriba (fuera de escalera activa). El salto es de altura fija y no puede iniciarse en el aire (no double-jump). El propósito del salto es esquivar Estrellas IA y desplazarse dentro de la plataforma actual. |
| RF-02A | El salto permite únicamente desplazarse dentro de la plataforma actual. La altura máxima del salto debe ser inferior a la distancia vertical existente entre dos plataformas consecutivas. Bajo ninguna circunstancia un salto puede permitir alcanzar, tocar, aterrizar en o acceder directamente a una plataforma superior. El salto no puede sustituir a las escaleras como mecanismo de ascenso. |
| RF-02B | El salto sigue una trayectoria parabólica compuesta por una fase de ascenso y una fase de descenso gobernadas por la gravedad del juego. La duración total del salto debe ser aproximadamente de 1 segundo (±20%). |
| RF-02C | El jugador puede ejecutar un salto sin desplazamiento horizontal. Si durante el salto mantiene presionada la flecha izquierda/derecha o las teclas A/D, conserva el control horizontal y continúa desplazándose en esa dirección mientras permanece en el aire. |
| RF-02D | Si el jugador vuelve a presionar el botón de salto mientras ya está en el aire, no debe iniciar un nuevo salto, no debe aumentar la altura alcanzada ni producir impulso vertical adicional. Como máximo puede prolongar levemente la fase de ascenso actual sin superar la altura máxima definida. |
| RF-03 | El jugador debe poder subir y bajar escaleras presionando las teclas de dirección vertical cuando se encuentra en la hitbox de una escalera activa. |

| RF-03A | Las escaleras constituyen el único mecanismo que permite ascender entre plataformas. No existe ninguna otra acción, combinación de teclas o mecánica que permita acceder a una plataforma superior. |
| RF-03B | Cuando el jugador se encuentra alineado con una escalera activa, la flecha arriba inicia o continúa el ascenso y la flecha abajo inicia o continúa el descenso. Fuera de una escalera activa, dichas teclas no producen desplazamiento vertical. |
| RF-03C | Si el jugador se encuentra dentro de la hitbox de una escalera activa, la flecha arriba debe interpretarse exclusivamente como acción de ascenso por escalera y no como salto. |
| RF-03D | El jugador puede regresar a una plataforma inferior utilizando una escalera activa mediante la flecha abajo o dejando que el personaje caiga por un hueco del escenario. |
| RF-04 | Al perder una vida, el juego se pausa brevemente (~2,5 s) mostrando un mensaje visual («VIDA PERDIDA» + «TE QUEDAN X VIDAS»). Tras la pausa, el jugador reaparece al **inicio** de la última plataforma alcanzada (punto de entrada natural de dicha plataforma), no en la posición exacta donde ocurrió la muerte, y debe volver a recorrerla. Si muere en Plataforma 1 → reaparece en el punto inicial del nivel. Si muere en Plataforma 2 → reaparece al inicio de Plataforma 2. Si muere en Plataforma 3 → reaparece al inicio de Plataforma 3. Si muere en Plataforma 4 → reaparece al inicio de Plataforma 4. Si muere en Plataforma 5 → reaparece al inicio de Plataforma 5. Si muere en Plataforma 6 → reaparece al inicio de Plataforma 6. |
| RF-05 | Al caer por un hueco, el jugador desciende a la plataforma inferior, pierde 100 puntos y no pierde vida. |

### Estrellas IA

| ID | Requisito |
|----|-----------|
| RF-06 | La primera Estrella IA debe generarse 2 segundos después del inicio de la partida. Las siguientes se generan cada 6 segundos de forma continua durante toda la partida. |
| RF-07 | Las Estrellas IA se desplazan en sentido descendente a velocidad constante y lenta. No utilizan escaleras, no caen por huecos, y desaparecen al llegar al límite inferior del escenario. |
| RF-08 | Cada Estrella IA se representa visualmente como un **proyectil energético**: grupo de 2 a 4 estrellas de cuatro puntas con núcleo luminoso, estela direccional, rastro energético y partículas de lanzamiento. El grupo actúa como una única entidad de colisión y movimiento. Los efectos visuales comunican dirección de movimiento y origen en la IA rebelde. |
| RF-09 | Si una Estrella IA impacta al jugador sin protección, el jugador pierde 1 vida y reaparece. Si el jugador tiene protección activa, la Estrella IA desaparece y se consume la protección sin perder vida. |
| RF-10 | Si el jugador salta sobre una Estrella IA (la estrella pasa por debajo durante el salto), se otorgan +100 puntos. Tres saltos consecutivos sobre Estrellas IA otorgan un bonus adicional de +500 puntos. |

### Esferas verdes y protección

| ID | Requisito |
|----|-----------|
| RF-11 | Las esferas verdes se ubican al inicio de las plataformas 2, 4 y 5 al comenzar la partida. Al ser recogidas desaparecen y otorgan protección temporal de 10 segundos + 250 puntos. |
| RF-12 | Durante la protección activa, el personaje muestra un aura verde visible. Los últimos 3 segundos, el aura parpadea como advertencia de expiración próxima. |
| RF-13 | La protección termina por expiración de tiempo (10s) o por impacto de una Estrella IA, lo que ocurra primero. Las esferas no reaparecen durante la partida. |

### Escaleras inestables

| ID | Requisito |
|----|-----------|
| RF-14 | Todas las escaleras comparten un ciclo sincronizado: 7s activas → 3s advertencia (parpadeo + glitch visual) → 3s desactivadas → reinicio. El ciclo es permanente durante toda la partida. |
| RF-15 | Si el jugador está en una escalera cuando esta se desactiva, cae al inicio (base) de esa escalera. No pierde vida ni puntos, pero pierde tiempo y progreso vertical. |
| RF-16 | Durante el estado desactivado, la hitbox de la escalera debe estar completamente inhabilitada — el jugador no puede iniciar ni continuar el ascenso. |
| RF-16A | Una escalera desactivada debe mostrarse visualmente como oculta o claramente inutilizable. Durante este estado no debe existir hitbox ni posibilidad de interacción. El estado visual de cada escalera debe reflejar inequívocamente si puede utilizarse o no. |

### Sistema de vidas y temporizador

| ID | Requisito |
|----|-----------|
| RF-17 | El jugador inicia con 3 vidas. El HUD muestra el conteo de vidas restantes en todo momento mediante **miniaturas del personaje** (siluetas cian neón): iconos rellenos = vidas disponibles; iconos atenuados = vidas perdidas. |
| RF-18 | El temporizador inicia en 90 segundos y cuenta regresivamente. Al llegar a 0, el jugador pierde 1 vida y el temporizador se reinicia. Si no quedan vidas, la partida termina. |
| RF-19 | Al perder la última vida se muestra la pantalla de derrota con el mensaje indicando que la IA mantiene el control del sistema y la puntuación final obtenida. Toda la información debe presentarse de forma legible, sin superposición de textos, con márgenes y alineación consistentes. |

### Victoria y puntuación

| ID | Requisito |
|----|-----------|
| RF-20 | Al activar el interruptor, se desencadena la secuencia de victoria: glitches intensos sobre la IA, píxeles corruptos, apagado progresivo de la IA, animación de celebración del jugador, pantalla de puntuación final. La pantalla de puntuación debe presentar cada línea de información (puntaje en partida, bonos, total, mensaje de victoria) de forma legible y sin superposición; el puntaje final (TOTAL) tiene prioridad visual. |
| RF-21 | La puntuación final incluye: puntos acumulados en partida + 1000 pts por vida restante + 10 pts por segundo restante en el temporizador al momento de activar el interruptor. |
| RF-22 | El sistema lleva registro de rachas de saltos consecutivos sobre Estrellas IA. Al alcanzar 3 saltos consecutivos se otorga el bonus de +500 pts. La racha se reinicia si el jugador toca suelo sin saltar sobre una estrella. |

---

## 03 — Requisitos Técnicos

### Stack y arquitectura

| ID | Requisito |
|----|-----------|
| RT-01 | El juego debe implementarse exclusivamente en HTML5, CSS3 y JavaScript puro (ES6+). Queda prohibido el uso de frameworks JS (React, Vue, Angular), game engines (Phaser, PixiJS) o librerías de terceros de cualquier tipo. |
| RT-02 | El rendering debe realizarse sobre un elemento `<canvas>` HTML5 usando la API 2D Context. Toda la lógica de juego debe encapsularse en un game loop basado en `requestAnimationFrame`. |
| RT-03 | El código debe organizarse en módulos lógicos separados: GameLoop, Player, EnemyManager, PlatformManager, UIManager, ScoreManager, CollisionManager. Cada módulo debe ser independiente y comunicarse mediante eventos o interfaces claras. |
| RT-04 | Se pueden incluir assets gráficos en formato PNG, SVG o WebP. Las imágenes deben cargarse de forma asíncrona antes del inicio del game loop mediante un Asset Loader. El juego no debe iniciar hasta que todos los assets estén cargados. |

### Rendimiento y compatibilidad

| ID | Requisito |
|----|-----------|
| RT-05 | El game loop debe mantener 60 FPS estables en hardware moderno (Chrome / Firefox / Safari, últimas 2 versiones). La lógica de física y movimiento debe estar desacoplada del framerate usando **delta time**. |
| RT-06 | La detección de colisiones debe implementarse como AABB (Axis-Aligned Bounding Box). Los hitboxes de jugador y enemigos deben ser más pequeños que su sprite visible para favorecer la sensación de juego justa. |
| RT-07 | El canvas debe escalar correctamente a diferentes resoluciones de pantalla desktop usando CSS `object-fit` o transformaciones, manteniendo el aspect ratio original del escenario (recomendado 800×600 o 960×640). |
| RT-08 | El juego debe funcionar completamente offline. Todos los assets deben estar alojados localmente o embebidos. No se permiten dependencias de red en runtime. |

### Física y mecánicas del motor

| ID | Requisito |
|----|-----------|
| RT-09 | La gravedad debe simularse como aceleración constante sobre el jugador cuando no está sobre una plataforma o escalera. El valor de gravedad debe ser una constante configurable en el código. |
| RT-09A | Los parámetros de salto (velocidad inicial vertical y gravedad) deben configurarse de forma que la altura máxima alcanzable sea siempre inferior a la separación vertical entre plataformas consecutivas. |
| RT-09B | Ninguna combinación de movimiento horizontal, salto o interacción simultánea de teclas debe permitir acceder a una plataforma superior sin utilizar una escalera activa. |
| RT-09C | El sistema de colisiones debe rechazar aterrizajes sobre plataformas de índice superior a la plataforma de origen del salto en curso. La progresión vertical solo se registra al salir de una escalera activa o al aterrizar tras una caída por hueco. |
| RT-10 | El movimiento de las Estrellas IA debe ser determinista y basado en delta time para garantizar consistencia a cualquier framerate. La velocidad debe ser una constante configurable. |
| RT-11 | Los huecos en plataformas deben implementarse como zonas sin colisión. Al detectar que el jugador está sobre un hueco, debe activarse la lógica de caída hacia la plataforma inferior. |
| RT-12 | El ciclo de escaleras inestables debe controlarse con un único timer global compartido. Todas las escaleras deben cambiar de estado de forma estrictamente sincronizada en cada ciclo. |

### Estados del juego

| ID | Requisito |
|----|-----------|
| RT-13 | El juego debe implementar una máquina de estados explícita con al menos los siguientes estados: `LOADING` → `MENU` → `PLAYING` → `PAUSED` → `VICTORY` / `GAME_OVER`. Las transiciones entre estados deben ser claras y reversibles donde corresponda. |
| RT-14 | Debe existir una pantalla de inicio (MENU) con el título del juego, instrucciones básicas de controles y un botón/tecla para iniciar la partida. |
| RT-15 | Las pantallas de VICTORY y GAME_OVER deben ofrecer la opción de reiniciar la partida, reseteando completamente el estado del juego (puntuación, vidas, posición, enemigos, timers). Toda la información en dichas pantallas debe presentarse de forma legible, sin superposición de textos, con márgenes y alineación consistentes. |

---

## 04 — Diseño Visual — Requisitos

| ID | Requisito |
|----|-----------|
| RV-01 | Las cinco plataformas jugables deben mostrar una **inclinación visual alternada** con pendiente absoluta idéntica (±12 px entre extremos) en sentidos opuestos consecutivos. Patrón obligatorio: Plataforma 1 (izq. baja → der. alta), Plataforma 2 (der. baja → izq. alta), Plataforma 3 (izq. baja → der. alta), Plataforma 4 (der. baja → izq. alta), Plataforma 5 (izq. baja → der. alta). La superficie transitable y las colisiones permanecen inalteradas; la inclinación alternada se aplica en la capa de renderizado del cuerpo de la plataforma y en indicadores direccionales (chevrons). Las Estrellas IA recorren el camino inverso descendente, coherente con la inclinación opuesta en cada tramo. |
| RV-02 | La IA rebelde debe estar presente visualmente en el **extremo final de la plataforma 5** durante toda la partida con animaciones de glitch, píxeles corruptos y fragmentos de código flotante activos en loop. La IA custodia el acceso a la escalera final (5→6) pero no bloquea físicamente el interruptor, que se encuentra en la plataforma 6. |
| RV-03 | Las Estrellas IA deben renderizarse como **proyectiles energéticos** lanzados por la IA rebelde: grupo de 2 a 4 estrellas de 4 puntas en violeta, magenta y azul eléctrico, con núcleo luminoso, estela direccional, rastro energético, partículas de lanzamiento y efecto glow pulsante. El efecto visual debe comunicar la dirección de movimiento y reforzar el origen en la IA, sin alterar velocidad, trayectoria ni colisiones. |
| RV-04 | El HUD debe mostrar permanentemente: puntuación actual, vidas restantes (miniaturas del personaje en cian neón), temporizador con cuenta regresiva y estado de protección activa. Ubicado en una zona que no interfiera con el escenario jugable. |
| RV-05 | La paleta cromática del juego debe priorizar tonos oscuros con acentos de violeta, cian y magenta para reforzar la estética de IA corrupta. Las plataformas deben diferenciarse claramente del fondo. **Las escaleras usan magenta/violeta neón (`#cc66ff`) y nunca tonos verdes**, para distinguirse inequívocamente de las esferas verdes de inmunidad (`#00ff00`). |
| RV-06 | El escenario completo (5 plataformas jugables + plataforma 6 de apagado + 5 escaleras de progresión + IA + interruptor) debe ser legible de un vistazo. El objetivo final (interruptor en plataforma 6) y la IA rebelde (extremo de plataforma 5) deben ser distinguibles visualmente desde la posición de inicio del jugador. |
| RV-07 | El interruptor de apagado de IA debe representarse como una **palanca física retro/neón** situada **exclusivamente sobre la plataforma 6** (mini plataforma de apagado). Solo es alcanzable tras: (1) subir la escalera 4→5, (2) recorrer completamente la plataforma 5 hasta la IA rebelde, (3) subir la escalera final 5→6. El interruptor **no puede activarse desde la plataforma 5** ni alcanzarse mediante salto. Debe renderizarse **completamente por debajo de la banda del HUD** (y ≥ 48 px), sin superposición con score, vidas ni temporizador. Estado inicial: palanca elevada (IA encendida, LED amarillo, etiqueta «IA ON»). Al activarse: la palanca desciende animadamente (IA apagada, LED rojo, etiqueta «IA OFF»), transmitiendo visualmente el corte de la IA. La lógica de activación y colisión no se modifica. |

### Escenario — Diseño del nivel

El nivel consta de **5 plataformas jugables** dispuestas en zig-zag ascendente, una **plataforma 6** (mini plataforma de apagado en la cima) y **5 escaleras** que conectan plataformas consecutivas (1→2, 2→3, 3→4, 4→5, **5→6**).

**Secuencia de finalización del nivel:**

1. Subir la escalera 4→5 (lado izquierdo) y llegar a la **Plataforma 5**.
2. Recorrer completamente la **Plataforma 5** hasta el extremo derecho, donde se encuentra la **IA rebelde**.
3. Subir la **escalera final 5→6** (extremo derecho de la Plataforma 5).
4. Llegar a la **Plataforma 6** (mini plataforma exclusiva del interruptor).
5. Activar la palanca para apagar la IA y completar el nivel.

Conceptualmente: **Plataforma 5** = zona final de enfrentamiento con la IA; **Plataforma 6** = plataforma de apagado con el interruptor. El interruptor no es accesible desde la Plataforma 5 ni mediante salto; la escalera 5→6 es obligatoria.

**Zona superior — separación del HUD:** el HUD ocupa una banda fija de **48 px** en la parte superior del canvas (`y = 0–48`). Ningún elemento jugable de la zona final (IA rebelde, Plataforma 6, interruptor, escalera 5→6) puede invadir esa banda. La Plataforma 6 se sitúa con su superficie en **y ≈ 118**, dejando margen suficiente para que la palanca y su resplandor queden completamente por debajo del HUD.

### Escenario — Geometría de la zona final

| Elemento | Posición (canvas 960×640) | Notas |
|----------|----------------------------|-------|
| **Plataforma 5** | x = 100, y = 220, ancho = 760 | Zona de enfrentamiento; entrada por escalera 4→5 (izquierda, x ≈ 60) |
| **IA rebelde** | Extremo derecho de Plataforma 5 (x ≈ 756) | Visible por completo; cuerpo entre y ≈ 138 y y ≈ 238 |
| **Escalera 5→6** | x = 816, y = 118, altura = 102 | Extremo derecho de Plataforma 5; único acceso a Plataforma 6 |
| **Plataforma 6** | x = 788, y = 118, ancho = 132 | Mini plataforma de apagado; superficie por debajo del HUD |
| **Interruptor** | Centrado sobre Plataforma 6 (x ≈ 828) | Resplandor y palanca con y mínimo ≈ 72; sin solapamiento con HUD |

Separación vertical entre Plataforma 5 y Plataforma 6: **102 px** (> `MAX_JUMP_HEIGHT` 100 px). Separación entre Plataforma 6 e interruptor respecto al HUD: **≥ 24 px** de margen visual.

### Escenario — Inclinación de plataformas

Cada plataforma muestra una inclinación visual sutil pero claramente perceptible que indica la dirección natural de avance del jugador en ese tramo. **Todas las plataformas comparten la misma pendiente absoluta (12 px de diferencia entre extremos)**, alternando el sentido:

| Plataforma | Signo visual | Inclinación visual | Sentido de avance del jugador |
|------------|-------------|-------------------|-------------------------------|
| 1 | +1 | Izquierda más baja → derecha más alta | Avance hacia la derecha (escalera derecha) |
| 2 | −1 | Derecha más baja → izquierda más alta | Avance hacia la izquierda (escalera izquierda) |
| 3 | +1 | Izquierda más baja → derecha más alta | Avance hacia la derecha |
| 4 | −1 | Derecha más baja → izquierda más alta | Avance hacia la izquierda |
| 5 | +1 | Izquierda más baja → derecha más alta | Avance hacia la derecha (zona de enfrentamiento con la IA rebelde) |
| 6 | −1 | Derecha más baja → izquierda más alta | Mini plataforma de apagado (interruptor exclusivo) |

La inclinación visual refuerza el recorrido ascendente en zig-zag. Las Estrellas IA realizan el recorrido inverso descendente, desplazándose en sentido opuesto al avance natural del jugador en cada plataforma. La superficie transitable, las hitboxes y las posiciones de colisión se mantienen idénticas; solo cambia la representación gráfica del cuerpo de la plataforma y los indicadores direccionales.

### Escaleras — Paleta visual

| Estado | Color | Descripción |
|--------|-------|-------------|
| **Activa** | `#cc66ff` (magenta/violeta neón) | Rieles y travesaños con glow `#ff44cc`. Estética retro/neón coherente con la IA corrupta. |
| **Advertencia** | `#ffaa00` (ámbar) | Parpadeo + glitch horizontal en travesaños. Sigue siendo usable. |
| **Desactivada** | Invisible | Sin hitbox ni interacción (RF-16A). |

**Regla de contraste:** las escaleras **nunca** utilizan tonos verdes. Las esferas de inmunidad conservan verde neón (`#00ff00` / `#00ff88`) para asociarse exclusivamente con la protección temporal.

### Interruptor de apagado — Palanca visual

| Aspecto | Especificación |
|---------|----------------|
| **Apariencia** | Palanca física montada sobre pedestal metálico retro. Empuñadura amarilla neón con brazo articulado. LED de estado y etiqueta «IA ON» / «IA OFF». Leyenda «PROTEGIDO POR IA» cuando está activa. Resplandor pulsante en amarillo cuando la IA está activa; resplandor rojo al apagar. |
| **Ubicación** | **Plataforma 6** (x ≈ 788, y ≈ 118; mini plataforma de apagado). Accesible **únicamente** tras subir la escalera final 5→6 (x ≈ 816), que requiere haber recorrido la Plataforma 5 hasta la IA rebelde. **No activable desde la Plataforma 5** ni alcanzable mediante salto. **Ningún píxel del interruptor ni su resplandor puede superponerse con el HUD superior** (banda y = 0–48). |
| **Estado inicial** | Palanca inclinada hacia arriba (IA encendida). LED amarillo/verde. Resplandor amarillo pulsante. |
| **Al activarse** | La palanca desciende con animación suave hacia posición inferior. LED rojo. Etiqueta «IA OFF». Resplandor rojo. Desencadena la secuencia de victoria existente sin cambios en la lógica. |

### HUD — Indicador de vidas

| Aspecto | Especificación |
|---------|----------------|
| **Representación** | Tres miniaturas del personaje (silueta cian neón, 14×22 px) alineadas en el centro del HUD. |
| **Estados** | Icono relleno con glow = vida disponible. Icono atenuado (contorno semitransparente) = vida perdida. |
| **Etiqueta** | Texto «VIDAS» a la izquierda del grupo de iconos. |

### Sistema de vidas — Flujo de pérdida de vida

Secuencia obligatoria al perder una vida (impacto de Estrella IA o agotamiento del temporizador):

1. **Detección** — Se emite el evento de pérdida de vida; el contador de vidas se decrementa y el HUD se actualiza de inmediato.
2. **Pausa temporal** — El gameplay y el temporizador se detienen durante **2,5 segundos** (`LIFE_LOST_PAUSE_DURATION`).
3. **Mensaje visual** — Overlay semitransparente con:
   - Título: **«VIDA PERDIDA»** (rojo neón)
   - Subtítulo: **«TE QUEDAN X VIDAS»** (cian) o **«TE QUEDA 1 VIDA»** / **«SIN VIDAS RESTANTES»** según corresponda.
4. **Comprensión** — Duración suficiente para leer el mensaje cómodamente.
5. **Respawn** — Tras la pausa, el jugador reaparece al inicio de la última plataforma alcanzada (RF-04) y el temporizador se reanuda. Si no quedan vidas, transición a pantalla GAME_OVER.

### Estrellas IA — Apariencia de proyectil

| Aspecto | Especificación |
|---------|----------------|
| **Apariencia base** | Grupo de 2–4 estrellas de cuatro puntas con núcleo energético central y resplandor radial. Colores: violeta, magenta y azul eléctrico. |
| **Estela y rastro** | Estela luminosa direccional que sigue el vector de movimiento (horizontal o vertical). Rastro de posiciones recientes con degradado de opacidad. Gradiente lineal magenta→cian en la dirección opuesta al avance. |
| **Efecto de lanzamiento** | Destello blanco inicial al aparecer. Partículas energéticas que se dispersan desde el punto de origen (IA rebelde), simulando un disparo. |
| **Objetivo visual** | Comunicar que las estrellas son proyectiles emitidos por la IA rebelde, indicar claramente la dirección de movimiento y aumentar la legibilidad del obstáculo móvil sin modificar velocidad, trayectoria, spawn, colisiones ni comportamiento. |

---

## 05 — Métricas de Éxito

### KPIs objetivo

| Métrica | Valor objetivo |
|---------|---------------|
| Curva de aprendizaje | ≤ 60 segundos |
| Rendimiento mínimo | 60 FPS constantes |
| Duración de partida | 1–3 minutos |
| Bugs bloqueantes en entrega | 0 |

### Métricas de experiencia de juego

| ID | Métrica |
|----|---------|
| MX-01 | Un jugador nuevo debe poder identificar el objetivo del juego (llegar al interruptor) sin instrucciones escritas en ≤60 segundos de primera sesión. |
| MX-02 | Al menos el 80% de los testers de QA deben reportar que la dificultad se percibe como "moderada" (ni trivial ni frustrante) en la segunda o tercera partida. |
| MX-03 | La duración promedio de una partida completa (victoria o derrota) debe situarse entre 1 y 3 minutos en el grupo de testers sin experiencia previa. |
| MX-04 | Al menos el 70% de los jugadores que alcanzan la derrota deben reiniciar la partida al menos una vez en la misma sesión (indicador de rejugabilidad). |
| MX-05 | Los controles deben recibir una valoración de "responsivos" o "muy responsivos" por al menos el 90% de los testers al ser consultados post-sesión. |

### Métricas de calidad técnica

| ID | Métrica |
|----|---------|
| MT-01 | El juego debe mantener ≥60 FPS constantes durante toda una sesión de 3 minutos en Chrome y Firefox en hardware desktop de gama media (CPU 4 cores, GPU integrada). |
| MT-02 | El tiempo de carga inicial desde apertura en browser hasta pantalla de MENU listo debe ser inferior a 3 segundos en conexión de 5 Mbps. |
| MT-03 | El juego no debe presentar ningún bug que impida completar una partida entera (victoria o derrota) en ninguno de los 3 browsers target tras 20 sesiones de QA. |
| MT-04 | La detección de colisiones no debe generar falsos positivos ni falsos negativos perceptibles — tolerancia ≤1 frame de latencia en resolución de colisión. |

---

## 06 — Criterios de Aceptación

### Jugabilidad core

| ID | Criterio |
|----|----------|
| CA-01 | **Movimiento:** El personaje responde al input de movimiento horizontal en el mismo frame. El salto desde plataforma funciona correctamente y no puede ejecutarse en el aire (no double-jump). El salto tiene trayectoria de ascenso y descenso, dura aproximadamente 1 segundo y nunca permite alcanzar ni aterrizar en una plataforma superior. Mantener pulsado el salto en ascenso solo prolonga levemente la fase actual sin superar la altura máxima. El jugador puede desplazarse horizontalmente durante el salto manteniendo presionadas las teclas izquierda/derecha o A/D. La velocidad de movimiento se percibe natural. |
| CA-02 | **Escaleras:** El jugador puede subir y bajar todas las escaleras en estado activo. La flecha arriba se utiliza para ascender y la flecha abajo para descender. Durante el estado de advertencia (parpadeo) las escaleras siguen siendo funcionales. En estado desactivado, el acceso está completamente bloqueado. Las escaleras constituyen el único mecanismo de ascenso entre plataformas. |
| CA-03 | **Huecos:** El jugador cae exactamente a la plataforma inferior al atravesar un hueco. La penalización de -100 puntos se aplica correctamente. No se pierde vida. |
| CA-03A | El jugador no puede alcanzar plataformas superiores mediante saltos, movimientos diagonales ni combinaciones de teclas. Toda progresión ascendente del nivel debe realizarse exclusivamente mediante escaleras activas. |
| CA-04 | **Estrellas IA:** La primera estrella aparece a los 2 segundos exactos. Las siguientes siguen el intervalo de 6 segundos. El movimiento descendente es visible y coherente con la inclinación de las plataformas. |
| CA-05 | **Protección:** Al recoger la esfera aparece el aura verde inmediatamente. La protección absorbe correctamente el impacto de una Estrella IA (la estrella desaparece, el jugador no pierde vida). El parpadeo de los últimos 3 segundos es visible y claro. |
| CA-06 | **Vidas y timer:** El contador de vidas se decrementa correctamente por impacto de Estrella IA y por agotamiento del temporizador. El timer se reinicia tras perder vida si quedan vidas disponibles. La derrota ocurre únicamente al llegar a 0 vidas. Tras perder una vida, se muestra la secuencia de pausa con mensaje («VIDA PERDIDA» + vidas restantes) durante 2,5 s antes del respawn. El jugador reaparece al inicio de la última plataforma alcanzada (no en el punto de muerte), con la posición X definida por el punto de entrada de esa plataforma en `LevelData`. |
| CA-07 | **Victoria:** Al activar el interruptor se ejecuta completa la secuencia de victoria (glitches → apagado → celebración → puntuación). La partida no continúa tras la victoria. La puntuación final incluye correctamente los bonos de vida y tiempo restante. El interruptor solo puede activarse desde la Plataforma 6 tras subir la escalera 5→6. |
| CA-07A | **Pantallas finales:** Las pantallas VICTORY y GAME_OVER presentan toda la información (puntaje, bonos, vidas, tiempo, mensajes) de forma legible, sin superposición de textos, con márgenes y alineación consistentes en la resolución base (960×640). El puntaje final (TOTAL) tiene prioridad visual en la pantalla de victoria. |

### Puntuación

| ID | Criterio |
|----|----------|
| CA-08 | Cada evento de puntuación debe reflejarse en el HUD de forma inmediata (mismo frame o siguiente). Valores exactos: salto estrella +100, esfera verde +250, combo x3 +500, vida restante +1000, segundo restante +10, caída hueco -100. |
| CA-09 | El contador de combo (saltos consecutivos) debe resetearse correctamente al aterrizar sin haber saltado una estrella. El bonus de +500 no debe acumularse más de una vez por combo de 3; cada nuevo múltiplo de 3 activa el bonus nuevamente. |

### Visual e identidad

| ID | Criterio |
|----|----------|
| CA-10 | La IA rebelde debe mostrar animaciones activas de glitch/corrupción durante toda la partida. Al activar el interruptor, la secuencia de apagado debe ser visualmente distinguible del estado normal de glitch. La palanca debe descender animadamente al activarse. |
| CA-11 | Las Estrellas IA deben mostrar estela direccional, rastro energético, efecto de lanzamiento y pulsación activa. El grupo de 2–4 estrellas debe percibirse como un proyectil coherente lanzado por la IA, no como objetos estáticos separados. |
| CA-12 | El HUD debe ser legible en todo momento sin superponerse al área de gameplay crítico. Las miniaturas de vida deben permitir identificar de un vistazo cuántas vidas quedan. El contador de tiempo y la puntuación deben ser distinguibles con una lectura de 0,5 segundos. |
| CA-12A | Las cinco plataformas jugables deben mostrar inclinación visual alternada con **pendiente absoluta idéntica (12 px)** en sentidos opuestos consecutivos (+1, −1, +1, −1, +1). La inclinación debe ser claramente perceptible sin alterar colisiones ni superficies transitables. |
| CA-12B | Las escaleras activas deben renderizarse en magenta/violeta neón, claramente distinguibles de las esferas verdes. El interruptor debe estar visible sobre la **Plataforma 6**. La IA rebelde debe estar visible en el extremo final de la **Plataforma 5**. |
| CA-12C | **Progresión final:** El jugador no puede activar el interruptor al llegar a la Plataforma 5 ni alcanzar la Plataforma 6 mediante salto. La Plataforma 6 solo es accesible mediante la escalera final 5→6. Ningún elemento de la zona final (IA, Plataforma 6, interruptor) se superpone visualmente con el HUD superior. |

### Estabilidad y reinicio

| ID | Criterio |
|----|----------|
| CA-13 | El reinicio de partida desde las pantallas de VICTORY o GAME_OVER debe restaurar completamente el estado inicial: puntuación en 0, 3 vidas, timer en 90s, jugador en posición inicial, esferas verdes presentes, ciclo de escaleras reiniciado. |
| CA-14 | El juego no debe producir errores en consola del browser durante una sesión normal de juego. Cualquier excepción JavaScript no capturada se considera bug bloqueante. |
| CA-15 | El juego debe ser completable de inicio a fin (victoria y derrota) al menos 5 veces consecutivas sin necesidad de recargar el browser. |

---

## 07 — Estrellas IA — Especificación de Movimiento

### Movimiento — definición completa

#### Patrón general

Las Estrellas IA siguen un patrón de descenso en zig-zag por el escenario, recorriendo cada plataforma de extremo a extremo antes de descender a la siguiente. Este ciclo se repite plataforma a plataforma desde la Plataforma 5 (la más alta, punto de aparición) hasta la Plataforma 1 (la más baja). Una vez que la estrella abandona el escenario por el extremo inferior del canvas, desaparece.

#### Recorrido por plataforma

Al aparecer, la estrella se posiciona en el extremo de la Plataforma 5 y comienza inmediatamente su recorrido horizontal. La estrella se desplaza a lo largo de toda la plataforma, de extremo a extremo, antes de iniciar el descenso a la plataforma siguiente. En ningún caso desciende antes de alcanzar el extremo opuesto de la plataforma en la que se encuentra. La estrella se mantiene sobre la superficie de la plataforma en todo momento, respetando su inclinación.

#### Dirección horizontal

La dirección de movimiento horizontal de cada estrella es opuesta a la dirección de avance natural del jugador en esa plataforma. Dado que el jugador asciende alternando la dirección horizontal en cada plataforma (zig-zag ascendente), las estrellas se desplazan siempre en el sentido contrario al avance esperado en cada plataforma, maximizando la probabilidad de encuentro frontal. La dirección horizontal se invierte en cada plataforma sucesiva al descender, produciendo el patrón de zig-zag descendente simétrico al recorrido ascendente del jugador.

#### Transición entre plataformas

Al alcanzar el extremo de una plataforma, la estrella desciende verticalmente hasta posicionarse sobre la superficie de la plataforma inmediatamente inferior. La transición es directa: no utiliza escaleras ni trayectoria diagonal. Una vez posicionada sobre la plataforma inferior, retoma inmediatamente el movimiento horizontal en la dirección opuesta a la que traía en la plataforma anterior.

#### Comportamiento ante huecos

Las Estrellas IA no caen por los huecos de las plataformas. Los huecos son atravesados flotando como si fueran superficie sólida: la estrella continúa su recorrido horizontal sin interrupciones ni cambios de altura sobre la zona del hueco.

#### Desaparición

Al alcanzar el extremo de la Plataforma 1 (la más baja) o al superar el límite inferior del canvas, la estrella desaparece del escenario y es devuelta al pool de objetos para su reutilización en el siguiente ciclo de spawn.

#### Rol como obstáculo

Las Estrellas IA son obstáculos móviles que bloquean físicamente el avance del jugador en cada plataforma. Su movimiento en sentido contrario al del jugador garantiza que ambos se aproximen frontalmente en cada plataforma, obligando al jugador a reaccionar de forma activa. La única forma de superar una Estrella IA sin perder una vida ni consumir protección es saltando sobre ella en el momento en que el jugador y la estrella se encuentran en la misma plataforma. No existe ningún otro mecanismo para evitar el impacto salvo la protección otorgada por la esfera verde.

#### Apariencia visual de proyectil

Visualmente, cada Estrella IA se presenta como un proyectil emitido por la IA rebelde:

- **Núcleo energético** central con resplandor radial pulsante.
- **Estela luminosa** que se extiende en dirección opuesta al movimiento, reforzando la lectura de velocidad y trayectoria.
- **Rastro de posiciones** recientes con degradado de opacidad (rastro energético).
- **Efecto de lanzamiento** al aparecer: destello inicial y partículas que simulan el disparo desde la plataforma de la IA.

Estos elementos son exclusivamente visuales. No modifican velocidad, trayectoria, spawn, colisiones ni comportamiento de las estrellas.

---

## 08 — Riesgos y Mitigaciones

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Colisiones imprecisas que resulten en hits injustos o misses frustrantes | ALTO | Implementar hitboxes más pequeños que el sprite visible (forgiving hitbox). Testear en condiciones límite desde el inicio. |
| Inconsistencia de física a distintos framerates (sin delta time) | ALTO | Implementar delta time desde el primer commit. No avanzar mecánicas hasta validar comportamiento a 30/60/120 FPS. |
| Escaleras inestables percibidas como injustas si la penalización no es clara | MEDIO | Asegurar que el estado de advertencia (3s) sea visualmente muy obvio. La caída al inicio de la escalera debe ser inmediata y sin ambigüedad. |
| Acumulación de objetos en canvas sin destruir (memory leak con Estrellas IA) | MEDIO | Implementar pool de objetos o destrucción explícita al salir del escenario. Monitorear uso de memoria en sesiones largas. |
| Dificultad mal calibrada: demasiado fácil o imposible en primeras sesiones | MEDIO | Configurar velocidad de estrellas e intervalo de aparición como constantes ajustables. Realizar playtests tempranos con al menos 5 personas externas. |
| Legibilidad del escenario: jugador no identifica escaleras o plataformas | BAJO | Contrastar colores de plataformas, escaleras y fondo. Testear con captura de pantalla en escala de grises para validar contraste. |

---

## 09 — Fases de Desarrollo

### Fase 1 — Motor base
Implementar canvas + `requestAnimationFrame` + delta time. Máquina de estados (`LOADING` → `MENU` → `PLAYING` → `VICTORY` / `GAME_OVER`). Física básica: gravedad, colisión con suelo. **Validar 60 FPS antes de continuar.**

### Fase 2 — Nivel y jugador
Diseñar y renderizar el nivel completo: 5 plataformas inclinadas + plataforma 6 de apagado, huecos, 5 escaleras, interruptor. Implementar ciclo de escaleras inestables. Input de jugador: movimiento, salto, subir/bajar escalera.

### Fase 3 — Mecánicas y sistemas
Sistema de Estrellas IA: generación, movimiento, colisión. Esferas verdes: recogida, protección, timer, parpadeo. Sistema de vidas, temporizador, puntuación completa con todos los eventos.

### Fase 4 — Polish y QA
Animaciones de IA (glitches, apagado), secuencia de victoria, pantallas de MENU / GAME_OVER / VICTORY. QA estructurado contra todos los criterios de aceptación. Ajuste de dificultad por playtest.

---

## Referencia rápida — Sistema de puntuación

| Evento | Puntos |
|--------|--------|
| Saltar sobre una Estrella IA | +100 |
| Recoger una esfera verde | +250 |
| Combo: 3 saltos consecutivos sobre Estrellas IA | +500 |
| Vida sobrante al finalizar | +1000 por vida |
| Tiempo restante al finalizar | +10 por segundo |
| Caer por un hueco | −100 |

## Referencia rápida — Ciclos y timers

| Elemento | Valor |
|----------|-------|
| Vidas iniciales | 3 |
| Temporizador inicial | 90 segundos |
| Primera Estrella IA | A los 2 segundos |
| Intervalo entre Estrellas IA | Cada 6 segundos |
| Duración protección esfera verde | 10 segundos |
| Advertencia fin de protección | Últimos 3 segundos (parpadeo) |
| Ciclo escaleras — estado activo | 7 segundos |
| Ciclo escaleras — advertencia | 3 segundos |
| Ciclo escaleras — desactivado | 3 segundos |
| Duración pausa pérdida de vida | 2,5 segundos |
| Color escalera activa | `#cc66ff` (magenta/violeta) |
| Color esfera inmunidad | `#00ff00` (verde neón) |

---

*AI Kong · PRD v1.0 · MVP · HTML + CSS + JavaScript puro*
