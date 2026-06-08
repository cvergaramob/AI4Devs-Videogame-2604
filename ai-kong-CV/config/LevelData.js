/**
 * LevelData.js
 * Geometría completa del nivel. Canvas 960×640.
 * Huecos (gaps) se expresan como offset relativo al borde izquierdo de la plataforma.
 * Dependencias: Platform.js, Ladder.js, GreenOrb.js, Switch.js, RebelAI.js, Constants.js
 */

/** Zona reservada del HUD superior (HUD.js: barH 36 + pad 12 = 48 px). El gameplay no debe invadir y < 48. */
const HUD_RESERVE_Y = 48;

/** Separación vertical entre plataformas consecutivas (> MAX_JUMP_HEIGHT 100 px). */
const PLATFORM_VERTICAL_GAP = 102;

/** Inclinación visual alternada (plataformas 1–6): +1 = izq. baja → der. alta; -1 = der. baja → izq. alta */
const PLATFORM_TILT_PATTERN = [1, -1, 1, -1, 1, -1];

const LEVEL_DATA = {
    platforms: [
        // Plataforma 1 – inicio del jugador (suelo)
        { x: 0,   y: 628, width: 960, height: 14, gaps: [],                              hasOrb: false, orbX: 0,   respawnX: 80  },
        // Plataforma 2 – 1 hueco (entrada desde escalera derecha)
        { x: 0,   y: 526, width: 860, height: 14, gaps: [{ x: 400, width: 60 }],         hasOrb: true,  orbX: 60,  respawnX: 756 },
        // Plataforma 3 – 2 huecos (entrada desde escalera izquierda)
        { x: 100, y: 424, width: 860, height: 14, gaps: [{ x: 280, width: 60 }, { x: 580, width: 60 }], hasOrb: false, orbX: 0, respawnX: 180 },
        // Plataforma 4 – 1 hueco (entrada desde escalera derecha)
        { x: 0,   y: 322, width: 860, height: 14, gaps: [{ x: 500, width: 60 }],         hasOrb: true,  orbX: 60,  respawnX: 756 },
        // Plataforma 5 – zona final de enfrentamiento con la IA rebelde (extremo derecho)
        { x: 100, y: 220, width: 760, height: 14, gaps: [],                              hasOrb: true,  orbX: 160, respawnX: 180 },
        // Plataforma 6 – mini plataforma de apagado (solo interruptor; y ≥ HUD + margen)
        { x: 788, y: 118, width: 132, height: 14, gaps: [],                              hasOrb: false, orbX: 0,   respawnX: 824 }
    ],

    ladders: [
        // Escalera 1→2 (lado derecho)
        { x: 890, y: 526, width: 28, height: PLATFORM_VERTICAL_GAP, connectsFrom: 0, connectsTo: 1 },
        // Escalera 2→3 (lado izquierdo)
        { x: 60,  y: 424, width: 28, height: PLATFORM_VERTICAL_GAP, connectsFrom: 1, connectsTo: 2 },
        // Escalera 3→4 (lado derecho)
        { x: 890, y: 322, width: 28, height: PLATFORM_VERTICAL_GAP, connectsFrom: 2, connectsTo: 3 },
        // Escalera 4→5 (lado izquierdo)
        { x: 60,  y: 220, width: 28, height: PLATFORM_VERTICAL_GAP, connectsFrom: 3, connectsTo: 4 },
        // Escalera 5→6 (extremo derecho de plataforma 5) — único acceso al interruptor
        { x: 816, y: 118, width: 28, height: PLATFORM_VERTICAL_GAP, connectsFrom: 4, connectsTo: 5 }
    ],

    /** Instanciar plataformas */
    createPlatforms() {
        return LEVEL_DATA.platforms.map((cfg, idx) =>
            new Platform(
                cfg.x, cfg.y, cfg.width, cfg.height, cfg.gaps,
                PLATFORM_TILT_PATTERN[idx] ?? 1
            )
        );
    },

    /** Instanciar escaleras */
    createLadders() {
        return LEVEL_DATA.ladders.map(cfg =>
            new Ladder(cfg.x, cfg.y, cfg.width, cfg.height, cfg.connectsFrom, cfg.connectsTo)
        );
    },

    /** Instanciar esferas a partir de los metadatos de plataforma */
    createOrbs() {
        const orbs = [];
        LEVEL_DATA.platforms.forEach((cfg, idx) => {
            if (!cfg.hasOrb) return;
            const platform = new Platform(
                cfg.x, cfg.y, cfg.width, cfg.height, cfg.gaps,
                PLATFORM_TILT_PATTERN[idx] ?? 1
            );
            const orbX = cfg.orbX;
            const orbCenterY = platform.getTopY(orbX) - Constants.ORB_RADIUS;
            // Orb x/y stored as top-left of the bounding box
            orbs.push(new GreenOrb(orbX - Constants.ORB_RADIUS, orbCenterY - Constants.ORB_RADIUS));
        });
        return orbs;
    },

    /** Posición de spawn del jugador (sobre plataforma 1 cerca del lado izquierdo) */
    getPlayerSpawnPosition(platforms) {
        const p = platforms ? platforms[0] : null;
        return p
            ? LEVEL_DATA.getPlatformRespawnPosition(p, platforms)
            : { x: 80, y: 628 - Constants.PLAYER_HEIGHT };
    },

    /**
     * Punto de inicio de una plataforma para respawn (RF-04).
     * Usa respawnX definido en LEVEL_DATA: entrada natural al subir desde la escalera inferior.
     */
    getPlatformRespawnPosition(platform, platforms) {
        const idx = platforms ? platforms.indexOf(platform) : -1;
        const cfg = idx >= 0 && idx < LEVEL_DATA.platforms.length
            ? LEVEL_DATA.platforms[idx]
            : LEVEL_DATA.platforms[0];
        const respawnX = MathUtils.clamp(
            cfg.respawnX,
            cfg.x,
            cfg.x + cfg.width - Constants.PLAYER_WIDTH
        );
        const surfaceY = platform.getTopY(respawnX + Constants.PLAYER_WIDTH / 2);
        return { x: respawnX, y: surfaceY - Constants.PLAYER_HEIGHT };
    },

    /** Posición de la IA rebelde (plataforma 5, extremo derecho — zona de enfrentamiento final) */
    getAIPosition() {
        const cfg = LEVEL_DATA.platforms[4];
        const platform = new Platform(
            cfg.x, cfg.y, cfg.width, cfg.height, cfg.gaps,
            PLATFORM_TILT_PATTERN[4]
        );
        const aiX = cfg.x + cfg.width - Constants.AI_WIDTH - 24;
        const surfaceY = platform.getTopY(aiX + Constants.AI_WIDTH / 2);
        return { x: aiX, y: surfaceY - Constants.AI_HEIGHT + 6 };
    },

    /** Posición del interruptor — exclusivamente sobre la plataforma 6 (plataforma de apagado) */
    getSwitchPosition() {
        const cfg = LEVEL_DATA.platforms[5];
        const platform = new Platform(
            cfg.x, cfg.y, cfg.width, cfg.height, cfg.gaps,
            PLATFORM_TILT_PATTERN[5]
        );
        const switchX = cfg.x + (cfg.width - Constants.SWITCH_WIDTH) / 2;
        const centerX = switchX + Constants.SWITCH_WIDTH / 2;
        const surfaceY = platform.getTopY(centerX);
        return {
            x: switchX,
            y: surfaceY - Constants.SWITCH_HEIGHT + 4
        };
    },

    /** Límite inferior del HUD (px). Útil para validaciones de layout. */
    getHudReserveY() {
        return HUD_RESERVE_Y;
    }
};

// Alias de compatibilidad con el nombre usado en Game.js durante la Fase 1
const LevelData = LEVEL_DATA;
