/**
 * Constants.js
 * Centralización de todas las constantes del juego.
 * Dependencias: ninguna
 */

const Constants = {
    // Canvas
    CANVAS_WIDTH: 960,
    CANVAS_HEIGHT: 640,

    // Physics
    GRAVITY: 800,
    PLAYER_SPEED: 300,
    // Altura máx. ≈100 px (< separación mín. entre plataformas ~110 px); duración total ≈1 s
    JUMP_FORCE: 400,
    // Techo de altura del salto (JUMP_FORCE² / 2·GRAVITY); no modificar sin recalcular gaps
    MAX_JUMP_HEIGHT: 100,
    // Reducción de gravedad al mantener salto en ascenso (sin superar MAX_JUMP_HEIGHT)
    JUMP_HOLD_GRAVITY_REDUCTION: 0.45,
    STAR_SPEED: 150,
    AIR_RESISTANCE: 0.99,

    // Spawn & Timing
    STAR_SPAWN_INITIAL_DELAY: 2.0,
    STAR_SPAWN_INTERVAL: 6.0,
    STAR_SPAWN_PLATFORM_INDEX: 4, // Plataforma 5 (índice 0-based en LevelData)

    // Dirección horizontal por plataforma (opuesta al avance natural del jugador)
    // Índices 0–4 = plataformas 1–5; -1 = izquierda, +1 = derecha
    STAR_DIRECTION_BY_PLATFORM: [-1, 1, -1, 1, -1],

    // Estados internos de movimiento de Estrella IA
    STAR_MOVE_STATE: {
        HORIZONTAL: 'HORIZONTAL',
        DESCENDING: 'DESCENDING'
    },

    // Player
    PLAYER_WIDTH: 24,
    PLAYER_HEIGHT: 40,
    PLAYER_HITBOX_REDUCTION: 6,
    TERMINAL_VELOCITY: 800,

    // Timer & Lives
    TIMER_INITIAL: 90,
    LIVES_INITIAL: 3,
    PROTECTION_DURATION: 10.0,
    PROTECTION_BLINK_THRESHOLD: 3.0,

    // Ladder cycle (all in seconds)
    LADDER_ACTIVE_DURATION: 7.0,
    LADDER_WARNING_DURATION: 3.0,
    LADDER_DISABLED_DURATION: 3.0,

    // Scoring
    POINTS_JUMP_STAR: 100,
    POINTS_ORB: 250,
    POINTS_COMBO_BONUS: 500,
    POINTS_LIFE_BONUS: 1000,
    POINTS_TIME_BONUS: 10,
    POINTS_HOLE_PENALTY: -100,

    // Victory sequence (seconds)
    VICTORY_GLITCH_DURATION: 2.0,
    VICTORY_SHUTDOWN_DURATION: 1.5,
    VICTORY_CELEBRATION_DURATION: 1.5,

    // Life lost pause (seconds) — tiempo legible para mensaje de feedback
    LIFE_LOST_PAUSE_DURATION: 2.5,

    // Colors
    COLOR_BACKGROUND: '#0a0e27',
    COLOR_PRIMARY_BG: '#0f0f23',
    COLOR_SECONDARY_BG: '#1a1a3f',
    COLOR_PLATFORM: '#2a3a5c',
    COLOR_PLATFORM_EDGE: '#00ddff',
    COLOR_PLATFORM_SHADOW: '#888888',
    COLOR_PLATFORM_OUTLINE: '#ffffff',
    COLOR_HOLE: '#000000',
    COLOR_LADDER_ACTIVE: '#cc66ff',
    COLOR_LADDER_ACTIVE_GLOW: '#ff44cc',
    COLOR_LADDER_WARNING: '#ffaa00',
    COLOR_LADDER_DISABLED: '#555577',
    COLOR_PLAYER: '#00ffff',
    COLOR_PLAYER_OUTLINE: '#0088ff',
    COLOR_PROTECTION_AURA: '#00ff00',
    COLOR_STAR_1: '#ff00ff',
    COLOR_STAR_2: '#ff0088',
    COLOR_STAR_3: '#0088ff',
    COLOR_STAR_GLOW: '#ff00ff',
    COLOR_ORB: '#00ff00',
    COLOR_ORB_GLOW: '#00ff88',
    COLOR_AI: '#ff0000',
    COLOR_AI_PRIMARY: '#7b2fff',
    COLOR_AI_GLITCH_1: '#00ffff',
    COLOR_AI_GLITCH_2: '#ffff00',
    COLOR_SWITCH: '#ffee00',
    COLOR_SWITCH_OFF: '#cccccc',
    COLOR_SWITCH_ON: '#ffaa00',
    COLOR_TEXT_HUD: '#00ff88',
    COLOR_TEXT_MENU: '#ffffff',
    COLOR_TEXT_VICTORY: '#00ff00',
    COLOR_TEXT_GAMEOVER: '#ff0000',

    // Platform sizes
    PLATFORM_HEIGHT: 14,
    PLATFORM_MIN_WIDTH: 150,
    PLATFORM_TILT_OFFSET: 12,

    // Ladder sizes
    LADDER_WIDTH: 28,
    LADDER_HEIGHT: 100,
    LADDER_ENTRY_ZONE: 32,

    // Switch & AI sizes
    SWITCH_WIDTH: 52,
    SWITCH_HEIGHT: 44,
    AI_WIDTH: 80,
    AI_HEIGHT: 100,

    // Orb size
    ORB_RADIUS: 12,

    // Star sizes (group will have 2-4 individual stars)
    STAR_SIZE: 8,

    // State strings
    GAME_STATE: {
        LOADING: 'LOADING',
        MENU: 'MENU',
        PLAYING: 'PLAYING',
        PAUSED: 'PAUSED',
        VICTORY: 'VICTORY',
        GAME_OVER: 'GAME_OVER'
    },

    // Player states
    PLAYER_STATE: {
        IDLE: 'IDLE',
        WALKING: 'WALKING',
        JUMPING: 'JUMPING',
        CLIMBING: 'CLIMBING',
        FALLING: 'FALLING',
        DEAD: 'DEAD',
        CELEBRATING: 'CELEBRATING'
    },

    // Ladder states
    LADDER_STATE: {
        ACTIVE: 'ACTIVE',
        WARNING: 'WARNING',
        DISABLED: 'DISABLED'
    }
};

// Congelar el objeto para evitar modificaciones accidentales
Object.freeze(Constants);
