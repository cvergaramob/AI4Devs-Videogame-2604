/**
 * ScoreSystem.js
 * Sistema de puntuación: eventos, combo, bonos finales.
 * Responsabilidad: calcular puntos, gestionar racha de saltos.
 * Dependencias: Constants.js, EventBus.js
 */

class ScoreSystem {
    constructor() {
        this.score = 0;
        this.jumpCombo = 0;
        this.maxCombo = 0;
        this._setupEventListeners();
    }

    /**
     * Configurar listeners de eventos de puntuación
     */
    _setupEventListeners() {
        eventBus.on(EventNames.STAR_JUMPED, () => this.addStarJump());
        eventBus.on(EventNames.ORB_COLLECTED, () => this.addOrbCollection());
    }

    /**
     * Agregar puntos por saltar sobre una estrella
     */
    addStarJump() {
        this.score += Constants.POINTS_JUMP_STAR;
        this.jumpCombo++;
        if (this.jumpCombo > this.maxCombo) {
            this.maxCombo = this.jumpCombo;
        }

        // Bonus por combo
        if (this.jumpCombo % 3 === 0) {
            this.score += Constants.POINTS_COMBO_BONUS;
            eventBus.emit(EventNames.SCORE_UPDATED, { 
                score: this.score, 
                reason: 'combo',
                bonus: Constants.POINTS_COMBO_BONUS
            });
        } else {
            eventBus.emit(EventNames.SCORE_UPDATED, { 
                score: this.score, 
                reason: 'star_jump'
            });
        }
    }

    /**
     * Agregar puntos por recoger esfera verde
     */
    addOrbCollection() {
        this.score += Constants.POINTS_ORB;
        eventBus.emit(EventNames.SCORE_UPDATED, { 
            score: this.score, 
            reason: 'orb_collection'
        });
    }

    /**
     * Agregar penalización por caer en hueco
     */
    addHolePenalty() {
        this.score = Math.max(0, this.score + Constants.POINTS_HOLE_PENALTY);
        eventBus.emit(EventNames.SCORE_UPDATED, { 
            score: this.score, 
            reason: 'hole_penalty'
        });
    }

    /**
     * Resetear combo
     */
    resetCombo() {
        this.jumpCombo = 0;
    }

    /**
     * Obtener bonos finales
     */
    getFinalBonuses(livesRemaining, timeRemaining) {
        const lifeBonus = livesRemaining * Constants.POINTS_LIFE_BONUS;
        const timeBonus = Math.floor(timeRemaining) * Constants.POINTS_TIME_BONUS;
        return {
            lifeBonus,
            timeBonus,
            total: lifeBonus + timeBonus
        };
    }

    /**
     * Calcular puntuación final
     */
    calculateFinalScore(livesRemaining, timeRemaining) {
        const bonuses = this.getFinalBonuses(livesRemaining, timeRemaining);
        return this.score + bonuses.total;
    }

    /**
     * Aplicar bonos finales a la puntuación acumulada (RF-21)
     */
    applyFinalBonuses(livesRemaining, timeRemaining) {
        const bonuses = this.getFinalBonuses(livesRemaining, timeRemaining);
        this.score += bonuses.total;
        eventBus.emit(EventNames.SCORE_UPDATED, {
            score: this.score,
            reason: 'final_bonus',
            lifeBonus: bonuses.lifeBonus,
            timeBonus: bonuses.timeBonus
        });
        return this.score;
    }

    /**
     * Obtener puntuación actual
     */
    getScore() {
        return this.score;
    }

    /**
     * Obtener combo actual
     */
    getCombo() {
        return this.jumpCombo;
    }

    /**
     * Resetear sistema
     */
    reset() {
        this.score = 0;
        this.jumpCombo = 0;
        this.maxCombo = 0;
        eventBus.emit(EventNames.SCORE_UPDATED, { score: 0, reason: 'reset' });
    }

    /**
     * Obtener información de debug
     */
    getDebugInfo() {
        return {
            score: this.score,
            combo: this.jumpCombo,
            maxCombo: this.maxCombo
        };
    }
}
