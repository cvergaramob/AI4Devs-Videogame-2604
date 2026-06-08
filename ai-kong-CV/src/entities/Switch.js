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
        this.leverAngle = -0.55;
        this._targetLeverAngle = -0.55;
    }

    update(dt) {
        if (!this.active) return;

        this.pulsePhase += dt * 2;

        const target = this.activated ? 0.72 : -0.55;
        this._targetLeverAngle = target;
        this.leverAngle += (target - this.leverAngle) * Math.min(1, dt * 12);
    }

    render(ctx) {
        if (!this.visible) return;

        ctx.save();

        const bx = this.x;
        const by = this.y;
        const bw = this.width;
        const bh = this.height;
        const baseX = bx + bw * 0.5;
        const baseY = by + bh - 10;

        // Resplandor de advertencia (IA encendida)
        if (!this.activated) {
            const glow = ctx.createRadialGradient(baseX, baseY - 8, 0, baseX, baseY - 8, 46);
            glow.addColorStop(0, 'rgba(255, 238, 0, 0.35)');
            glow.addColorStop(1, 'rgba(255, 238, 0, 0)');
            ctx.fillStyle = glow;
            ctx.globalAlpha = 0.45 + Math.sin(this.pulsePhase) * 0.2;
            ctx.fillRect(bx - 18, by - 12, bw + 36, bh + 24);
            ctx.globalAlpha = 1;
        } else {
            const glow = ctx.createRadialGradient(baseX, baseY - 8, 0, baseX, baseY - 8, 36);
            glow.addColorStop(0, 'rgba(255, 80, 120, 0.4)');
            glow.addColorStop(1, 'rgba(255, 80, 120, 0)');
            ctx.fillStyle = glow;
            ctx.globalAlpha = 0.55;
            ctx.fillRect(bx - 12, by - 8, bw + 24, bh + 16);
            ctx.globalAlpha = 1;
        }

        // Pedestal metálico retro
        ctx.fillStyle = '#1a2040';
        ctx.fillRect(bx + 6, baseY - 6, bw - 12, 14);
        ctx.strokeStyle = this.activated ? '#ff6688' : '#00ddff';
        ctx.lineWidth = 2;
        ctx.strokeRect(bx + 6, baseY - 6, bw - 12, 14);

        // Ranura de la palanca
        ctx.fillStyle = '#0a0e27';
        ctx.fillRect(baseX - 5, baseY - 10, 10, 8);
        ctx.strokeStyle = '#445566';
        ctx.lineWidth = 1;
        ctx.strokeRect(baseX - 5, baseY - 10, 10, 8);

        // Palanca
        ctx.save();
        ctx.translate(baseX, baseY - 6);
        ctx.rotate(this.leverAngle);

        const leverColor = this.activated ? '#ff4466' : '#ffee00';
        ctx.strokeStyle = leverColor;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.shadowColor = leverColor;
        ctx.shadowBlur = this.activated ? 10 : 6 + Math.sin(this.pulsePhase) * 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -28);
        ctx.stroke();

        // Empuñadura
        ctx.fillStyle = this.activated ? '#cc2244' : '#ccaa00';
        ctx.beginPath();
        ctx.arc(0, -30, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();

        // LED de estado
        const ledX = bx + bw - 14;
        const ledY = by + 8;
        ctx.fillStyle = this.activated ? '#ff2244' : '#00ff88';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(ledX, ledY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Etiqueta
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = this.activated ? '#ff8899' : '#88ffcc';
        ctx.fillText(this.activated ? 'IA OFF' : 'IA ON', baseX, by + 2);

        if (!this.activated) {
            ctx.font = '8px monospace';
            ctx.fillStyle = 'rgba(255, 238, 0, 0.75)';
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
        this.leverAngle = -0.55;
        this._targetLeverAngle = -0.55;
        this.active = true;
        this.visible = true;
    }
}
