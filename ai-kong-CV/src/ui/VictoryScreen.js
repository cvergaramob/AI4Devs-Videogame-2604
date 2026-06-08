/**
 * VictoryScreen.js
 * Pantalla de victoria con desglose de puntuación final (RF-20, RF-21).
 * Dependencias: Constants.js
 */

class VictoryScreen {
    constructor() {
        this.sequenceProgress = 0;
        this.isComplete       = false;
        this.restartRequested = false;
        this.finalScore       = 0;
        this.baseScore        = 0;
        this.lifeBonus        = 0;
        this.timeBonus        = 0;
        this.livesRemaining   = 0;
        this.timeRemaining    = 0;
        this.glitchPhase      = 0;
        this._canAcceptInput  = false;
        this._setupInput();
    }

    _setupInput() {
        window.addEventListener('keydown', (e) => {
            if (!this._canAcceptInput) return;
            if (e.key === ' ' || e.key === 'Enter') {
                this.restartRequested = true;
                e.preventDefault();
            }
        });
    }

    start(finalScore, baseScore, lifeBonus, timeBonus, livesRemaining, timeRemaining) {
        this.sequenceProgress = 0;
        this.isComplete       = false;
        this.restartRequested = false;
        this._canAcceptInput  = false;
        this.finalScore       = finalScore;
        this.baseScore        = baseScore;
        this.lifeBonus        = lifeBonus;
        this.timeBonus        = timeBonus;
        this.livesRemaining   = livesRemaining;
        this.timeRemaining    = timeRemaining;
        this.glitchPhase      = 0;
    }

    update(dt) {
        if (this.isComplete) {
            this.glitchPhase += dt * 3;
            return;
        }

        this.sequenceProgress += dt;
        this.glitchPhase += dt * 8;

        if (this.sequenceProgress >= 2.5) {
            this.isComplete      = true;
            this._canAcceptInput = true;
        }
    }

    render(ctx) {
        const CW = Constants.CANVAS_WIDTH;
        const CH = Constants.CANVAS_HEIGHT;

        ctx.fillStyle = Constants.COLOR_BACKGROUND;
        ctx.fillRect(0, 0, CW, CH);

        const progress = Math.min(1, this.sequenceProgress / 2.5);

        if (progress < 0.35) {
            this._renderIntroGlitch(ctx, progress);
        }

        ctx.save();
        ctx.textBaseline = 'middle';

        const alphaIn = Math.min(1, Math.max(0, (progress - 0.2) / 0.5));
        ctx.globalAlpha = alphaIn;

        // ── Encabezado ───────────────────────────────────────────────────────
        ctx.textAlign = 'center';
        ctx.shadowColor = Constants.COLOR_TEXT_VICTORY;
        ctx.shadowBlur  = 20;
        ctx.fillStyle   = Constants.COLOR_TEXT_VICTORY;
        ctx.font        = 'bold 48px monospace';
        ctx.fillText('¡VICTORIA!', CW / 2, 64);
        ctx.shadowBlur  = 0;

        ctx.font      = '15px monospace';
        ctx.fillStyle = '#bf5fff';
        ctx.fillText('La IA rebelde ha sido apagada', CW / 2, 104);

        // ── Panel de puntuación (columnas separadas, sin superposición) ─────
        const panelX = CW / 2 - 270;
        const panelY = 132;
        const panelW = 540;
        const panelH = 228;

        ctx.fillStyle   = 'rgba(10, 0, 28, 0.82)';
        ctx.fillRect(panelX, panelY, panelW, panelH);
        ctx.strokeStyle = 'rgba(123, 47, 255, 0.5)';
        ctx.lineWidth   = 1;
        ctx.strokeRect(panelX, panelY, panelW, panelH);

        ctx.font      = 'bold 17px monospace';
        ctx.fillStyle = Constants.COLOR_TEXT_HUD;
        ctx.fillText('PUNTUACIÓN FINAL', CW / 2, panelY + 28);

        const labelX = panelX + 32;
        const valueX = panelX + panelW - 32;
        const lineH  = 34;
        let y        = panelY + 68;

        const rows = [
            { label: 'Puntos en partida', value: String(this.baseScore).padStart(7, '0'), accent: '#00ff88' },
            { label: `Vidas restantes (×${Constants.POINTS_LIFE_BONUS})`, value: `+${this.lifeBonus}`, accent: '#00ff88' },
            { label: `Tiempo restante (×${Constants.POINTS_TIME_BONUS}/s)`, value: `+${this.timeBonus}`, accent: '#00ff88' }
        ];

        ctx.font = '15px monospace';
        for (const row of rows) {
            ctx.textAlign = 'left';
            ctx.fillStyle = '#aaaaaa';
            ctx.fillText(row.label, labelX, y);

            ctx.textAlign = 'right';
            ctx.fillStyle = row.accent;
            ctx.fillText(row.value, valueX, y);
            y += lineH;
        }

        y += 6;
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.35)';
        ctx.beginPath();
        ctx.moveTo(labelX, y);
        ctx.lineTo(valueX, y);
        ctx.stroke();

        y += 26;
        ctx.textAlign = 'left';
        ctx.font      = 'bold 20px monospace';
        ctx.fillStyle = '#ffee00';
        ctx.fillText('TOTAL', labelX, y);

        ctx.textAlign = 'right';
        ctx.fillStyle = Constants.COLOR_TEXT_VICTORY;
        ctx.fillText(String(this.finalScore).padStart(7, '0'), valueX, y);

        ctx.textAlign = 'center';
        ctx.font      = '12px monospace';
        ctx.fillStyle = '#7b2fff';
        ctx.fillText(
            `${this.livesRemaining} vida(s) · ${Math.floor(this.timeRemaining)}s restantes al activar el interruptor`,
            CW / 2, panelY + panelH + 22
        );

        if (this.isComplete) {
            const pulse = Math.sin(this.glitchPhase) * 0.3 + 0.7;
            ctx.globalAlpha = pulse * alphaIn;
            ctx.font      = 'bold 15px monospace';
            ctx.fillStyle = '#00ff88';
            ctx.shadowColor = '#00ff88';
            ctx.shadowBlur  = 10;
            ctx.fillText('PRESIONA ESPACIO PARA CONTINUAR', CW / 2, CH - 48);
            ctx.shadowBlur  = 0;
        }

        ctx.globalAlpha = 1;
        ctx.restore();
    }

    _renderIntroGlitch(ctx, progress) {
        ctx.save();
        ctx.fillStyle = Constants.COLOR_AI_GLITCH_1;
        ctx.globalAlpha = (1 - progress) * 0.35;
        for (let i = 0; i < 12; i++) {
            const gy = Math.random() * Constants.CANVAS_HEIGHT;
            ctx.fillRect(0, gy, Constants.CANVAS_WIDTH, 2 + Math.random() * 4);
        }
        ctx.globalAlpha = 1;
        ctx.restore();
    }

    isSequenceComplete() { return this.isComplete; }

    wantsRestart() {
        const req = this.restartRequested;
        this.restartRequested = false;
        return req;
    }

    reset() {
        this.sequenceProgress = 0;
        this.isComplete       = false;
        this.restartRequested = false;
        this._canAcceptInput  = false;
        this.finalScore       = 0;
        this.baseScore        = 0;
        this.lifeBonus        = 0;
        this.timeBonus        = 0;
        this.glitchPhase      = 0;
    }
}
