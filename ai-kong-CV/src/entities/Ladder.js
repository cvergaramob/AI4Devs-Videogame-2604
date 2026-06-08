/**
 * Ladder.js
 * Escalera con ciclo de estados ACTIVE → WARNING → DISABLED sincronizado por LadderSystem.
 * Dependencias: Entity.js, Constants.js
 */

class Ladder extends Entity {
    constructor(x, y, width = Constants.LADDER_WIDTH, height = Constants.LADDER_HEIGHT,
                connectsFrom = 0, connectsTo = 0) {
        super(x, y, width, height);
        this.state = Constants.LADDER_STATE.ACTIVE;
        this.connectsFrom = connectsFrom;
        this.connectsTo   = connectsTo;
    }

    /** Cambia el estado interno (llamado exclusivamente por LadderSystem) */
    setState(newState) {
        this.state = newState;
    }

    /**
     * Usable en ACTIVE y WARNING (en WARNING el jugador todavía puede trepar).
     * En DISABLED el acceso está completamente bloqueado.
     */
    isUsable() {
        return this.state === Constants.LADDER_STATE.ACTIVE ||
               this.state === Constants.LADDER_STATE.WARNING;
    }

    /**
     * Hitbox de la base de la escalera: zona donde el jugador puede iniciar el ascenso.
     * Más ancha que la escalera para facilitar la entrada.
     */
    getEntryBounds() {
        const eh = Constants.LADDER_ENTRY_ZONE;
        return {
            x:      this.x - 6,
            y:      this.y + this.height - eh,
            width:  this.width + 12,
            height: eh + 16   // Extiende un poco por debajo de la escalera
        };
    }

    render(ctx) {
        if (!this.visible) return;

        // DISABLED: invisible, sin render
        if (this.state === Constants.LADDER_STATE.DISABLED) return;

        ctx.save();

        const isWarning = this.state === Constants.LADDER_STATE.WARNING;

        // Parpadeo en WARNING usando Date.now()
        if (isWarning) {
            const blinkVisible = Math.floor(Date.now() / 200) % 2 === 0;
            if (!blinkVisible) {
                ctx.restore();
                return;
            }
        }

        const color = isWarning ? Constants.COLOR_LADDER_WARNING : Constants.COLOR_LADDER_ACTIVE;
        const glowColor = isWarning ? Constants.COLOR_LADDER_WARNING : Constants.COLOR_LADDER_ACTIVE_GLOW;

        // Rieles laterales
        ctx.strokeStyle = color;
        ctx.lineWidth   = 3;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.moveTo(this.x + 4, this.y);
        ctx.lineTo(this.x + 4, this.y + this.height);
        ctx.moveTo(this.x + this.width - 4, this.y);
        ctx.lineTo(this.x + this.width - 4, this.y + this.height);
        ctx.stroke();

        // Travesaños
        ctx.lineWidth = 2;
        const rungSpacing = 16;
        const numRungs    = Math.floor(this.height / rungSpacing);

        for (let i = 1; i <= numRungs; i++) {
            const ry = this.y + i * rungSpacing;

            // Glitch en WARNING: desplazamiento horizontal aleatorio por travesaño
            const glitchX = isWarning ? (Math.random() > 0.7 ? (Math.random() - 0.5) * 6 : 0) : 0;

            ctx.beginPath();
            ctx.moveTo(this.x + 4 + glitchX, ry);
            ctx.lineTo(this.x + this.width - 4 + glitchX, ry);
            ctx.stroke();
        }

        // Glow sutil en estado ACTIVE (magenta/violeta — distinto de esferas verdes)
        if (!isWarning) {
            ctx.shadowColor = glowColor;
            ctx.shadowBlur  = 8;
            ctx.globalAlpha = 0.35;
            ctx.fillStyle   = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.shadowBlur  = 0;
        }

        ctx.globalAlpha = 1.0;
        ctx.restore();
    }

    getDebugInfo() {
        return {
            state:    this.state,
            isUsable: this.isUsable(),
            connects: `${this.connectsFrom} → ${this.connectsTo}`
        };
    }
}
