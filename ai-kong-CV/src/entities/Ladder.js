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

    setState(newState) {
        this.state = newState;
    }

    isUsable() {
        return this.state === Constants.LADDER_STATE.ACTIVE ||
               this.state === Constants.LADDER_STATE.WARNING;
    }

    getEntryBounds() {
        const eh = Constants.LADDER_ENTRY_ZONE;
        return {
            x:      this.x - Constants.LADDER_ENTRY_PAD_X,
            y:      this.y + this.height - eh,
            width:  this.width + Constants.LADDER_ENTRY_PAD_X * 2,
            height: eh + Constants.LADDER_ENTRY_EXTRA_HEIGHT
        };
    }

    render(ctx) {
        if (!this.visible) return;
        if (this.state === Constants.LADDER_STATE.DISABLED) return;

        ctx.save();

        const isWarning = this.state === Constants.LADDER_STATE.WARNING;

        if (isWarning) {
            const blinkVisible = Math.floor(Date.now() / Constants.LADDER_WARNING_BLINK_MS) % 2 === 0;
            if (!blinkVisible) {
                ctx.restore();
                return;
            }
        }

        const color = isWarning ? Constants.COLOR_LADDER_WARNING : Constants.COLOR_LADDER_ACTIVE;
        const glowColor = isWarning ? Constants.COLOR_LADDER_WARNING : Constants.COLOR_LADDER_ACTIVE_GLOW;

        ctx.strokeStyle = color;
        ctx.lineWidth   = Constants.LADDER_RAIL_WIDTH;
        ctx.globalAlpha = Constants.LADDER_RENDER_ALPHA;
        ctx.beginPath();
        ctx.moveTo(this.x + Constants.LADDER_RAIL_OFFSET, this.y);
        ctx.lineTo(this.x + Constants.LADDER_RAIL_OFFSET, this.y + this.height);
        ctx.moveTo(this.x + this.width - Constants.LADDER_RAIL_OFFSET, this.y);
        ctx.lineTo(this.x + this.width - Constants.LADDER_RAIL_OFFSET, this.y + this.height);
        ctx.stroke();

        ctx.lineWidth = Constants.LADDER_RUNG_WIDTH;
        const rungSpacing = Constants.LADDER_RUNG_SPACING;
        const numRungs    = Math.floor(this.height / rungSpacing);

        for (let i = 1; i <= numRungs; i++) {
            const ry = this.y + i * rungSpacing;
            const glitchX = isWarning && Math.random() > Constants.LADDER_GLITCH_CHANCE
                ? (Math.random() - 0.5) * Constants.LADDER_GLITCH_AMP
                : 0;

            ctx.beginPath();
            ctx.moveTo(this.x + Constants.LADDER_RAIL_OFFSET + glitchX, ry);
            ctx.lineTo(this.x + this.width - Constants.LADDER_RAIL_OFFSET + glitchX, ry);
            ctx.stroke();
        }

        if (!isWarning) {
            ctx.shadowColor = glowColor;
            ctx.shadowBlur  = Constants.LADDER_GLOW_BLUR;
            ctx.globalAlpha = Constants.LADDER_GLOW_ALPHA;
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
