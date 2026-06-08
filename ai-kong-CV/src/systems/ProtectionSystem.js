/**
 * ProtectionSystem.js
 * Sistema de protección del jugador por esferas verdes.
 * Responsabilidad: gestionar timer de protección y parpadeo.
 * Dependencias: Constants.js, EventBus.js
 */

class ProtectionSystem {
    constructor() {
        this.protectionActive = false;
        this.protectionTimer = 0;
    }

    /**
     * Activar protección
     */
    activateProtection() {
        this.protectionActive = true;
        this.protectionTimer = Constants.PROTECTION_DURATION;
        eventBus.emit(EventNames.PROTECTION_ACTIVATED);
    }

    /**
     * Actualizar sistema de protección
     */
    update(dt) {
        if (this.protectionActive) {
            this.protectionTimer -= dt;
            if (this.protectionTimer <= 0) {
                this.protectionActive = false;
                this.protectionTimer = 0;
                eventBus.emit(EventNames.PROTECTION_EXPIRED);
            }
        }
    }

    /**
     * Consumir protección
     */
    consumeProtection() {
        if (this.protectionActive) {
            this.protectionActive = false;
            this.protectionTimer = 0;
            eventBus.emit(EventNames.PROTECTION_EXPIRED);
        }
    }

    /**
     * Verificar si está en fase de parpadeo
     */
    isBlinking() {
        return this.protectionActive && this.protectionTimer < Constants.PROTECTION_BLINK_THRESHOLD;
    }

    /**
     * Obtener tiempo restante de protección
     */
    getTimeRemaining() {
        return Math.max(0, this.protectionTimer);
    }

    /**
     * Verificar si hay protección activa
     */
    isActive() {
        return this.protectionActive;
    }

    /**
     * Resetear sistema
     */
    reset() {
        this.protectionActive = false;
        this.protectionTimer = 0;
    }
}
