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
        this.pulsePhase += dt * Constants.GAMEOVER_PULSE_SPEED;
        if (this.pulsePhase >= Constants.GAMEOVER_INPUT_DELAY) {
            this._canAcceptInput = true;
        }
    }

    render(ctx) {
        if (!this.isShown) return;

        const CW = Constants.CANVAS_WIDTH;
        const CH = Constants.CANVAS_HEIGHT;

        ctx.save();
        ctx.fillStyle = Constants.GAMEOVER_OVERLAY_COLOR;
        ctx.fillRect(0, 0, CW, CH);

        const panelW = Constants.GAMEOVER_PANEL_W;
        const panelH = Constants.GAMEOVER_PANEL_H;
        const panelX = (CW - panelW) / 2;
        const panelY = (CH - panelH) / 2;

        ctx.fillStyle   = Constants.GAMEOVER_PANEL_BG;
        ctx.fillRect(panelX, panelY, panelW, panelH);
        ctx.strokeStyle = Constants.GAMEOVER_PANEL_BORDER;
        ctx.lineWidth   = 2;
        ctx.strokeRect(panelX, panelY, panelW, panelH);

        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';

        ctx.shadowColor = Constants.COLOR_TEXT_GAMEOVER;
        ctx.shadowBlur  = Constants.GAMEOVER_TITLE_SHADOW_BLUR;
        ctx.font        = Constants.GAMEOVER_TITLE_FONT;
        ctx.fillStyle   = Constants.COLOR_TEXT_GAMEOVER;
        ctx.fillText('GAME OVER', CW / 2, panelY + Constants.GAMEOVER_TITLE_Y_OFFSET);
        ctx.shadowBlur  = 0;

        ctx.font      = Constants.GAMEOVER_MSG_FONT;
        ctx.fillStyle = Constants.COLOR_TEXT_HUD;
        ctx.fillText(
            'La IA mantiene el control del sistema...',
            CW / 2, panelY + Constants.GAMEOVER_MSG_Y_OFFSET
        );

        ctx.strokeStyle = Constants.GAMEOVER_LINE_COLOR;
        ctx.beginPath();
        ctx.moveTo(panelX + Constants.GAMEOVER_LINE_MARGIN, panelY + Constants.GAMEOVER_LINE_Y_OFFSET);
        ctx.lineTo(panelX + panelW - Constants.GAMEOVER_LINE_MARGIN, panelY + Constants.GAMEOVER_LINE_Y_OFFSET);
        ctx.stroke();

        ctx.font      = Constants.GAMEOVER_SCORE_LABEL_FONT;
        ctx.fillStyle = Constants.COLOR_TEXT_MENU;
        ctx.fillText('Puntuación final', CW / 2, panelY + Constants.GAMEOVER_SCORE_LABEL_Y_OFFSET);

        ctx.font      = Constants.GAMEOVER_SCORE_FONT;
        ctx.fillStyle = Constants.GAMEOVER_SCORE_COLOR;
        ctx.fillText(String(this.finalScore).padStart(7, '0'), CW / 2, panelY + Constants.GAMEOVER_SCORE_Y_OFFSET);

        if (this._canAcceptInput) {
            const pulse = Math.sin(this.pulsePhase * 2) * Constants.GAMEOVER_PULSE_AMPLITUDE + Constants.GAMEOVER_PULSE_BASE;
            ctx.globalAlpha = pulse;
            ctx.font      = Constants.GAMEOVER_PROMPT_FONT;
            ctx.fillStyle = Constants.GAMEOVER_PROMPT_COLOR;
            ctx.fillText('PRESIONA ESPACIO PARA REINTENTAR', CW / 2, panelY + panelH + Constants.GAMEOVER_PROMPT_Y_OFFSET);
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
