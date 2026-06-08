/**
 * GameOverScreen.js
 * Pantalla de derrota (RF-19).
 * Dependencias: Constants.js
 */

class GameOverScreen {
    constructor() {
        this.isShown          = false;
        this.pulsePhase       = 0;
        this.finalScore       = 0;
        this.restartRequested = false;
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

    show(finalScore) {
        this.isShown          = true;
        this.finalScore       = finalScore;
        this.pulsePhase       = 0;
        this.restartRequested = false;
        this._canAcceptInput  = false;
    }

    update(dt) {
        if (!this.isShown) return;
        this.pulsePhase += dt * 2;
        if (this.pulsePhase >= 0.8) {
            this._canAcceptInput = true;
        }
    }

    render(ctx) {
        if (!this.isShown) return;

        const CW = Constants.CANVAS_WIDTH;
        const CH = Constants.CANVAS_HEIGHT;

        ctx.save();
        ctx.fillStyle = 'rgba(5, 0, 15, 0.88)';
        ctx.fillRect(0, 0, CW, CH);

        const panelW = 520;
        const panelH = 260;
        const panelX = (CW - panelW) / 2;
        const panelY = (CH - panelH) / 2;

        ctx.fillStyle   = 'rgba(10, 0, 20, 0.92)';
        ctx.fillRect(panelX, panelY, panelW, panelH);
        ctx.strokeStyle = 'rgba(255, 68, 102, 0.55)';
        ctx.lineWidth   = 2;
        ctx.strokeRect(panelX, panelY, panelW, panelH);

        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';

        ctx.shadowColor = Constants.COLOR_TEXT_GAMEOVER;
        ctx.shadowBlur  = 24;
        ctx.font        = 'bold 48px monospace';
        ctx.fillStyle   = Constants.COLOR_TEXT_GAMEOVER;
        ctx.fillText('GAME OVER', CW / 2, panelY + 56);
        ctx.shadowBlur  = 0;

        ctx.font      = '16px monospace';
        ctx.fillStyle = Constants.COLOR_TEXT_HUD;
        ctx.fillText(
            'La IA mantiene el control del sistema...',
            CW / 2, panelY + 112
        );

        ctx.strokeStyle = 'rgba(255, 102, 102, 0.35)';
        ctx.beginPath();
        ctx.moveTo(panelX + 40, panelY + 140);
        ctx.lineTo(panelX + panelW - 40, panelY + 140);
        ctx.stroke();

        ctx.font      = 'bold 22px monospace';
        ctx.fillStyle = Constants.COLOR_TEXT_MENU;
        ctx.fillText('Puntuación final', CW / 2, panelY + 172);

        ctx.font      = 'bold 28px monospace';
        ctx.fillStyle = '#ffee00';
        ctx.fillText(String(this.finalScore).padStart(7, '0'), CW / 2, panelY + 208);

        if (this._canAcceptInput) {
            const pulse = Math.sin(this.pulsePhase * 2) * 0.3 + 0.7;
            ctx.globalAlpha = pulse;
            ctx.font      = 'bold 15px monospace';
            ctx.fillStyle = '#ff6666';
            ctx.fillText('PRESIONA ESPACIO PARA REINTENTAR', CW / 2, panelY + panelH + 36);
            ctx.globalAlpha = 1;
        }

        ctx.restore();
    }

    isVisible() { return this.isShown; }

    wantsRestart() {
        const req = this.restartRequested;
        this.restartRequested = false;
        return req;
    }

    reset() {
        this.isShown          = false;
        this.finalScore       = 0;
        this.pulsePhase       = 0;
        this.restartRequested = false;
        this._canAcceptInput  = false;
    }
}
