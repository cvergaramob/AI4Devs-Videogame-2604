/**
 * EventBus.js
 * Sistema pub/sub desacoplado para comunicación entre módulos.
 * Patrón Singleton.
 * Dependencias: ninguna
 */

class EventBus {
    constructor() {
        this.events = new Map();
    }

    /**
     * Suscribirse a un evento
     * @param {string} eventName - Nombre del evento
     * @param {Function} handler - Función callback
     */
    on(eventName, handler) {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }
        this.events.get(eventName).push(handler);
    }

    /**
     * Desuscribirse de un evento
     * @param {string} eventName - Nombre del evento
     * @param {Function} handler - Función callback
     */
    off(eventName, handler) {
        if (!this.events.has(eventName)) return;
        const handlers = this.events.get(eventName);
        const index = handlers.indexOf(handler);
        if (index > -1) {
            handlers.splice(index, 1);
        }
    }

    /**
     * Emitir un evento
     * @param {string} eventName - Nombre del evento
     * @param {*} data - Datos a pasar a los handlers
     */
    emit(eventName, data = null) {
        if (!this.events.has(eventName)) return;
        const handlers = [...this.events.get(eventName)];
        handlers.forEach(handler => {
            try {
                handler(data);
            } catch (error) {
                console.error(`Error en handler de evento '${eventName}':`, error);
            }
        });
    }

    /**
     * Suscribirse a un evento una única vez
     * @param {string} eventName - Nombre del evento
     * @param {Function} handler - Función callback
     */
    once(eventName, handler) {
        const wrappedHandler = (data) => {
            try {
                handler(data);
            } finally {
                this.off(eventName, wrappedHandler);
            }
        };
        this.on(eventName, wrappedHandler);
    }

    /**
     * Limpiar todos los eventos
     */
    clear() {
        this.events.clear();
    }

    /**
     * Limpiar un evento específico
     * @param {string} eventName - Nombre del evento
     */
    clearEvent(eventName) {
        this.events.delete(eventName);
    }
}

// Instancia singleton
const eventBus = new EventBus();

// Event names constants
const EventNames = {
    GAME_START: 'game:start',
    GAME_PAUSE: 'game:pause',
    GAME_RESUME: 'game:resume',
    GAME_VICTORY: 'game:victory',
    GAME_OVER: 'game:over',
    GAME_RESET: 'game:reset',

    PLAYER_MOVE_LEFT: 'player:moveLeft',
    PLAYER_MOVE_RIGHT: 'player:moveRight',
    PLAYER_JUMP: 'player:jump',
    PLAYER_CLIMB_UP: 'player:climbUp',
    PLAYER_CLIMB_DOWN: 'player:climbDown',
    PLAYER_HIT: 'player:hit',
    PLAYER_LANDED: 'player:landed',
    PLAYER_CELEBRATION: 'player:celebration',

    STAR_JUMPED: 'star:jumped',
    STAR_SPAWNED: 'star:spawned',
    STAR_DESTROYED: 'star:destroyed',

    ORB_COLLECTED: 'orb:collected',

    LIFE_LOST: 'life:lost',
    PROTECTION_ACTIVATED: 'protection:activated',
    PROTECTION_EXPIRED: 'protection:expired',

    SWITCH_ACTIVATED: 'switch:activated',

    LADDER_STATE_CHANGED: 'ladder:stateChanged',

    SCORE_UPDATED: 'score:updated',
    TIMER_TICK: 'timer:tick',
    TIMER_EXPIRED: 'timer:expired'
};

Object.freeze(EventNames);
