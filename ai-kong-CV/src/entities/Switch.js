/**
 * Switch.js
 * Palanca de apagado de IA (representación visual retro/neón).
 * Responsabilidad: renderizado, detección de activación.
 * Dependencias: Entity.js, Constants.js, EventBus.js
 */

class Switch extends Entity {
    constructor(x, y) {
        super(x, y, Constants.SWITCH_WIDTH, Constants.SWITCH_HEIGHT);
        this.activated = false;
        this.pulsePhase = 0;
        this.leverAngle = Constants.SWITCH_LEVER_ANGLE_OFF;
        this._targetLeverAngle = Constants.SWITCH_LEVER_ANGLE_OFF;
    }

    update(dt) {
        if (!this.active) return;

        this.pulsePhase += dt * Constants.SWITCH_PULSE_SPEED;

        const target = this.activated ? Constants.SWITCH_LEVER_ANGLE_ON : Constants.SWITCH_LEVER_ANGLE_OFF;
        this._targetLeverAngle = target;
        this.leverAngle += (target - this.leverAngle) * Math.min(1, dt * Constants.SWITCH_LEVER_LERP_SPEED);
    }

    render(ctx) {
        if (!this.visible) return;

        ctx.save();

        const bx = this.x;
        const by = this.y;
        const bw = this.width;
        const bh = this.height;
        const baseX = bx + bw * 0.5;
        const baseY = by + bh - Constants.SWITCH_BASE_Y_OFFSET;

        if (!this.activated) {
            const glow = ctx.createRadialGradient(baseX, baseY - 8, 0, baseX, baseY - 8, Constants.SWITCH_GLOW_RADIUS_OFF);
            glow.addColorStop(0, 'rgba(255, 238, 0, 0.35)');
            glow.addColorStop(1, 'rgba(255, 238, 0, 0)');
            ctx.fillStyle = glow;
            ctx.globalAlpha = Constants.SWITCH_GLOW_ALPHA_BASE + Math.sin(this.pulsePhase) * Constants.SWITCH_GLOW_ALPHA_AMP;
            ctx.fillRect(bx - 18, by - 12, bw + 36, bh + 24);
            ctx.globalAlpha = 1;
        } else {
            const glow = ctx.createRadialGradient(baseX, baseY - 8, 0, baseX, baseY - 8, Constants.SWITCH_GLOW_RADIUS_ON);
            glow.addColorStop(0, 'rgba(255, 80, 120, 0.4)');
            glow.addColorStop(1, 'rgba(255, 80, 120, 0)');
            ctx.fillStyle = glow;
            ctx.globalAlpha = Constants.SWITCH_GLOW_ALPHA_ON;
            ctx.fillRect(bx - 12, by - 8, bw + 24, bh + 16);
            ctx.globalAlpha = 1;
        }

        ctx.fillStyle = Constants.SWITCH_PEDESTAL_COLOR;
        ctx.fillRect(bx + Constants.SWITCH_PEDESTAL_PAD_X, baseY - Constants.SWITCH_PEDESTAL_Y_OFFSET,
            bw - Constants.SWITCH_PEDESTAL_PAD_X * 2, Constants.SWITCH_PEDESTAL_HEIGHT);
        ctx.strokeStyle = this.activated ? Constants.SWITCH_STROKE_ON : Constants.SWITCH_STROKE_OFF;
        ctx.lineWidth = 2;
        ctx.strokeRect(bx + Constants.SWITCH_PEDESTAL_PAD_X, baseY - Constants.SWITCH_PEDESTAL_Y_OFFSET,
            bw - Constants.SWITCH_PEDESTAL_PAD_X * 2, Constants.SWITCH_PEDESTAL_HEIGHT);

        ctx.fillStyle = Constants.SWITCH_SLOT_COLOR;
        ctx.fillRect(baseX - Constants.SWITCH_SLOT_W / 2, baseY - 10, Constants.SWITCH_SLOT_W, Constants.SWITCH_SLOT_H);
        ctx.strokeStyle = '#445566';
        ctx.lineWidth = 1;
        ctx.strokeRect(baseX - Constants.SWITCH_SLOT_W / 2, baseY - 10, Constants.SWITCH_SLOT_W, Constants.SWITCH_SLOT_H);

        ctx.save();
        ctx.translate(baseX, baseY - 6);
        ctx.rotate(this.leverAngle);

        const leverColor = this.activated ? '#ff4466' : '#ffee00';
        ctx.strokeStyle = leverColor;
        ctx.lineWidth = Constants.SWITCH_LEVER_WIDTH;
        ctx.lineCap = 'round';
        ctx.shadowColor = leverColor;
        ctx.shadowBlur = this.activated
            ? Constants.SWITCH_SHADOW_BLUR_ON
            : Constants.SWITCH_SHADOW_BLUR_OFF_BASE + Math.sin(this.pulsePhase) * Constants.SWITCH_SHADOW_BLUR_OFF_AMP;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -Constants.SWITCH_LEVER_LENGTH);
        ctx.stroke();

        ctx.fillStyle = this.activated ? '#cc2244' : '#ccaa00';
        ctx.beginPath();
        ctx.arc(0, -Constants.SWITCH_GRIP_Y, Constants.SWITCH_GRIP_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();

        // LED de estado
        const ledX = bx + bw - Constants.SWITCH_LED_X_OFFSET;
        const ledY = by + Constants.SWITCH_LED_Y;
        ctx.fillStyle = this.activated ? Constants.SWITCH_LED_COLOR_ON : Constants.SWITCH_LED_COLOR_OFF;
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = Constants.SWITCH_LED_SHADOW;
        ctx.beginPath();
        ctx.arc(ledX, ledY, Constants.SWITCH_LED_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Etiqueta
        ctx.font = Constants.SWITCH_LABEL_FONT;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = this.activated ? Constants.SWITCH_LABEL_COLOR_ON : Constants.SWITCH_LABEL_COLOR_OFF;
        ctx.fillText(this.activated ? 'IA OFF' : 'IA ON', baseX, by + 2);

        if (!this.activated) {
            ctx.font = Constants.SWITCH_HINT_FONT;
            ctx.fillStyle = Constants.SWITCH_HINT_COLOR;
            ctx.fillText('▲ PROTEGIDO POR IA', baseX, by - 14);
        }

        ctx.restore();
    }

    activate() {
        if (!this.activated) {
            this.activated = true;
            eventBus.emit(EventNames.SWITCH_ACTIVATED);
            return true;
        }
        return false;
    }

    isActivated() {
        return this.activated;
    }

    reset() {
        this.activated = false;
        this.pulsePhase = 0;
        this.leverAngle = Constants.SWITCH_LEVER_ANGLE_OFF;
        this._targetLeverAngle = Constants.SWITCH_LEVER_ANGLE_OFF;
        this.active = true;
        this.visible = true;
    }
}
