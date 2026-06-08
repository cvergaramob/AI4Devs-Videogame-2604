/**
 * TimerSystem.js
 * Sistema de temporizador de partida.
 * Responsabilidad: countdown de 90 segundos, pérdida de vida al expirar.
 * Dependencias: Constants.js, EventBus.js
 */

class TimerSystem {
    constructor() {
        this.timeRemaining = Constants.TIMER_INITIAL;
        this.isRunning = false;
    }

    /**
     * Iniciar el temporizador
     */
    start() {
        this.isRunning = true;
    }

    /**
     * Pausar el temporizador
     */
    pause() {
        this.isRunning = false;
    }

    /**
     * Reanudar el temporizador
     */
    resume() {
        this.isRunning = true;
    }

    /**
     * Actualizar temporizador
     */
    update(dt) {
        if (!this.isRunning) return;

        this.timeRemaining -= dt;

        if (this.timeRemaining <= 0) {
            this.timeRemaining = Constants.TIMER_INITIAL;
            eventBus.emit(EventNames.TIMER_EXPIRED);
            eventBus.emit(EventNames.LIFE_LOST);
        }

        eventBus.emit(EventNames.TIMER_TICK, { 
            timeRemaining: this.timeRemaining 
        });
    }

    /**
     * Obtener tiempo restante
     */
    getTimeRemaining() {
        return Math.max(0, this.timeRemaining);
    }

    /**
     * Obtener tiempo restante redondeado
     */
    getTimeRounded() {
        return Math.ceil(this.getTimeRemaining());
    }

    /**
     * Resetear temporizador
     */
    reset() {
        this.timeRemaining = Constants.TIMER_INITIAL;
        this.isRunning = false;
    }

    /**
     * Verificar si está corriendo
     */
    isActive() {
        return this.isRunning;
    }

    /**
     * Obtener información de debug
     */
    getDebugInfo() {
        return {
            timeRemaining: this.timeRemaining.toFixed(2),
            isRunning: this.isRunning,
            timeRounded: this.getTimeRounded()
        };
    }
}
