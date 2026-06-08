/**
 * LadderSystem.js
 * Controla el ciclo global sincronizado de TODAS las escaleras.
 * Ciclo: ACTIVE (7 s) → WARNING (3 s) → DISABLED (3 s) → repeat.
 * Dependencias: Constants.js, Ladder.js, EventBus.js
 */

class LadderSystem {
    constructor() {
        this.ladders      = [];
        this.cycleTimer   = 0;
        this.currentState = Constants.LADDER_STATE.ACTIVE;
        this._prevState   = null;
    }

    /** Inicializar con el array de escaleras del nivel */
    init(ladders) {
        this.ladders = ladders;
        this.reset();
    }

    update(dt) {
        this.cycleTimer += dt;

        const active   = Constants.LADDER_ACTIVE_DURATION;
        const warning  = Constants.LADDER_WARNING_DURATION;
        const disabled = Constants.LADDER_DISABLED_DURATION;
        const total    = active + warning + disabled;

        const progress = this.cycleTimer % total;

        let newState;
        if (progress < active) {
            newState = Constants.LADDER_STATE.ACTIVE;
        } else if (progress < active + warning) {
            newState = Constants.LADDER_STATE.WARNING;
        } else {
            newState = Constants.LADDER_STATE.DISABLED;
        }

        if (newState !== this.currentState) {
            this.currentState = newState;
            this._applyStateToAll(newState);
            eventBus.emit(EventNames.LADDER_STATE_CHANGED, { state: newState });
        }
    }

    _applyStateToAll(state) {
        for (const ladder of this.ladders) {
            ladder.setState(state);
        }
    }

    /** Estado actual del ciclo */
    getCurrentState() { return this.currentState; }

    /** Ms restantes hasta el próximo cambio de estado */
    getTimeUntilChange() {
        const active   = Constants.LADDER_ACTIVE_DURATION;
        const warning  = Constants.LADDER_WARNING_DURATION;
        const disabled = Constants.LADDER_DISABLED_DURATION;
        const total    = active + warning + disabled;
        const progress = this.cycleTimer % total;

        if (progress < active)                   return (active - progress) * 1000;
        if (progress < active + warning)          return (active + warning - progress) * 1000;
        return (total - progress) * 1000;
    }

    /** Verificar si una escalera puede ser usada */
    canClimb(ladder) { return ladder.isUsable(); }

    reset() {
        this.cycleTimer   = 0;
        this.currentState = Constants.LADDER_STATE.ACTIVE;
        this._applyStateToAll(Constants.LADDER_STATE.ACTIVE);
    }

    getDebugInfo() {
        const total    = Constants.LADDER_ACTIVE_DURATION + Constants.LADDER_WARNING_DURATION + Constants.LADDER_DISABLED_DURATION;
        const progress = this.cycleTimer % total;
        return {
            currentState:    this.currentState,
            cycleTimer:      this.cycleTimer.toFixed(2),
            progressPct:     (progress / total * 100).toFixed(1) + '%',
            timeUntilChange: (this.getTimeUntilChange() / 1000).toFixed(2) + ' s'
        };
    }
}
