# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Project Overview

AI Kong is a Donkey Kong–inspired arcade platformer built with pure **HTML5 + CSS3 + JavaScript (ES6+)**. There is no build step, no npm, and no external dependencies. The canvas is fixed at 960×640 px. Entry point is `index.html`.

## Running the Game

```bash
# Recommended: local HTTP server to avoid CORS issues
python -m http.server 8000
# or
npx http-server
```

Then open `http://localhost:8000`. Alternatively, open `index.html` directly in the browser (most features work without a server).

## Architecture

### Script Loading Order (index.html)

Scripts are loaded as plain `<script>` tags in dependency order — there is no module bundler. The load order is:

1. `src/core/Constants.js` — all tunable values, frozen object
2. `src/core/EventBus.js` — singleton `eventBus` + frozen `EventNames`
3. `src/core/AssetLoader.js`, `StateMachine.js`, `GameLoop.js`
4. `src/utils/` — math helpers, AABB collision functions, object pool
5. `src/entities/` — Entity base class, then Player, AIStar, GreenOrb, Platform, Ladder, Switch, RebelAI
6. `src/systems/` — Physics, Collision, Spawn, Ladder, Protection, Score, Timer
7. `src/ui/` — HUD, MenuScreen, VictoryScreen, GameOverScreen, Renderer
8. `config/LevelData.js` — level geometry (depends on entity classes being defined)
9. `src/core/Game.js` — bootstrap; instantiates everything and starts the loop

All classes are globals. Adding a new file requires a `<script>` tag in `index.html` at the correct position in this chain.

### Communication Pattern

Modules never import each other directly — they communicate via the global `eventBus` (pub/sub). Game-level state changes (life lost, switch activated, orb collected) are emitted as `EventNames.*` events and handled in `Game.js`. When adding new cross-module behavior, define a new `EventNames` entry and emit/subscribe through `eventBus`.

### Game Loop and State Machine

`GameLoop` drives `requestAnimationFrame` and passes `dt` (seconds, capped at 50 ms) to `Game._update(dt)`. `StateMachine` in `Game.js` routes each tick: `LOADING → MENU → PLAYING → VICTORY | GAME_OVER`. Render is called unconditionally each frame; update logic is gated by state.

### Tuning Values

All physics, timing, scoring, color, and size constants live in `src/core/Constants.js` (frozen at runtime). Change gameplay feel there, not inline in systems or entities.

### Level Geometry

All platform positions, ladder positions, orb positions, and entity spawn points are defined in `config/LevelData.js`. Platforms are defined by `(x, y, width, holes[])` where `holes` is an array of `{ x, width }` offsets from the platform's left edge.

### Object Pool

`AIStar` enemies are managed through `ObjectPool` (in `src/utils/ObjectPool.js`) via `SpawnSystem`. Acquire with `spawnSystem.spawnStar()`, release with `spawnSystem.destroyStar(star)`. Do not `new AIStar()` directly in game code.

## Conventions

- Keep changes minimal and focused; match existing patterns in surrounding code.
- Tune gameplay values in `Constants.js`, not inline.
- Add cross-module behavior through `EventNames` + `eventBus`, not direct coupling.
- Register new scripts in `index.html` at the correct dependency position.

## Debugging

Enable event logging at runtime:

```javascript
// In browser console
window.game.getDebugInfo()   // returns state, FPS, lives, score, time, active stars
```

To enable verbose timer logging, change `if (false)` to `if (true)` in `Game._setupEventListeners()` ([src/core/Game.js:200](src/core/Game.js#L200)).
