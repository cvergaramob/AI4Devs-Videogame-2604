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
            this.glitchPhase += dt * Constants.VICTORY_GLITCH_SPEED_IDLE;
            return;
        }

        this.sequenceProgress += dt;
        this.glitchPhase += dt * Constants.VICTORY_GLITCH_SPEED_INTRO;

        if (this.sequenceProgress >= Constants.VICTORY_SEQUENCE_DURATION) {
            this.isComplete      = true;
            this._canAcceptInput = true;
        }
    }

    render(ctx) {
        const CW = Constants.CANVAS_WIDTH;
        const CH = Constants.CANVAS_HEIGHT;

        ctx.fillStyle = Constants.COLOR_BACKGROUND;
        ctx.fillRect(0, 0, CW, CH);

        const progress = Math.min(1, this.sequenceProgress / Constants.VICTORY_SEQUENCE_DURATION);

        if (progress < Constants.VICTORY_INTRO_GLITCH_END) {
            this._renderIntroGlitch(ctx, progress);
        }

        ctx.save();
        ctx.textBaseline = 'middle';

        const alphaIn = Math.min(1, Math.max(0, (progress - Constants.VICTORY_ALPHA_IN_START) / Constants.VICTORY_ALPHA_IN_SCALE));
        ctx.globalAlpha = alphaIn;

        ctx.textAlign = 'center';
        ctx.shadowColor = Constants.COLOR_TEXT_VICTORY;
        ctx.shadowBlur  = Constants.VICTORY_TITLE_SHADOW_BLUR;
        ctx.fillStyle   = Constants.COLOR_TEXT_VICTORY;
        ctx.font        = Constants.VICTORY_TITLE_FONT;
        ctx.fillText('¡VICTORIA!', CW / 2, Constants.VICTORY_TITLE_Y);
        ctx.shadowBlur  = 0;

        ctx.font      = Constants.VICTORY_SUBTITLE_FONT;
        ctx.fillStyle = Constants.VICTORY_SUBTITLE_COLOR;
        ctx.fillText('La IA rebelde ha sido apagada', CW / 2, Constants.VICTORY_SUBTITLE_Y);

        const panelX = CW / 2 - Constants.VICTORY_PANEL_X_OFFSET;
        const panelY = Constants.VICTORY_PANEL_Y;
        const panelW = Constants.VICTORY_PANEL_W;
        const panelH = Constants.VICTORY_PANEL_H;

        ctx.fillStyle   = Constants.VICTORY_PANEL_BG;
        ctx.fillRect(panelX, panelY, panelW, panelH);
        ctx.strokeStyle = Constants.VICTORY_PANEL_BORDER;
        ctx.lineWidth   = 1;
        ctx.strokeRect(panelX, panelY, panelW, panelH);

        ctx.font      = Constants.VICTORY_HEADER_FONT;
        ctx.fillStyle = Constants.COLOR_TEXT_HUD;
        ctx.fillText('PUNTUACIÓN FINAL', CW / 2, panelY + Constants.VICTORY_HEADER_Y_OFFSET);

        const labelX = panelX + Constants.VICTORY_LABEL_X_OFFSET;
        const valueX = panelX + panelW - Constants.VICTORY_VALUE_X_OFFSET;
        const lineH  = Constants.VICTORY_LINE_H;
        let y        = panelY + Constants.VICTORY_ROW_START_Y_OFFSET;

        const rows = [
            { label: 'Puntos en partida', value: String(this.baseScore).padStart(7, '0'), accent: Constants.COLOR_TEXT_HUD },
            { label: `Vidas restantes (×${Constants.POINTS_LIFE_BONUS})`, value: `+${this.lifeBonus}`, accent: Constants.COLOR_TEXT_HUD },
            { label: `Tiempo restante (×${Constants.POINTS_TIME_BONUS}/s)`, value: `+${this.timeBonus}`, accent: Constants.COLOR_TEXT_HUD }
        ];

        ctx.font = Constants.VICTORY_ROW_FONT;
        for (const row of rows) {
            ctx.textAlign = 'left';
            ctx.fillStyle = Constants.VICTORY_ROW_LABEL_COLOR;
            ctx.fillText(row.label, labelX, y);

            ctx.textAlign = 'right';
            ctx.fillStyle = row.accent;
            ctx.fillText(row.value, valueX, y);
            y += lineH;
        }

        y += Constants.VICTORY_SEPARATOR_Y_GAP;
        ctx.strokeStyle = Constants.VICTORY_SEPARATOR_COLOR;
        ctx.beginPath();
        ctx.moveTo(labelX, y);
        ctx.lineTo(valueX, y);
        ctx.stroke();

        y += Constants.VICTORY_TOTAL_Y_GAP;
        ctx.textAlign = 'left';
        ctx.font      = Constants.VICTORY_TOTAL_FONT;
        ctx.fillStyle = Constants.VICTORY_TOTAL_COLOR;
        ctx.fillText('TOTAL', labelX, y);

        ctx.textAlign = 'right';
        ctx.fillStyle = Constants.COLOR_TEXT_VICTORY;
        ctx.fillText(String(this.finalScore).padStart(7, '0'), valueX, y);

        ctx.textAlign = 'center';
        ctx.font      = Constants.VICTORY_FOOTER_FONT;
        ctx.fillStyle = Constants.VICTORY_FOOTER_COLOR;
        ctx.fillText(
            `${this.livesRemaining} vida(s) · ${Math.floor(this.timeRemaining)}s restantes al activar el interruptor`,
            CW / 2, panelY + panelH + Constants.VICTORY_FOOTER_Y_OFFSET
        );

        if (this.isComplete) {
            const pulse = Math.sin(this.glitchPhase) * Constants.VICTORY_PULSE_AMPLITUDE + Constants.VICTORY_PULSE_BASE;
            ctx.globalAlpha = pulse * alphaIn;
            ctx.font      = Constants.VICTORY_PROMPT_FONT;
            ctx.fillStyle = Constants.VICTORY_PROMPT_COLOR;
            ctx.shadowColor = Constants.VICTORY_PROMPT_COLOR;
            ctx.shadowBlur  = Constants.VICTORY_PROMPT_SHADOW_BLUR;
            ctx.fillText('PRESIONA ESPACIO PARA CONTINUAR', CW / 2, CH - Constants.VICTORY_PROMPT_Y_OFFSET);
            ctx.shadowBlur  = 0;
        }

        ctx.globalAlpha = 1;
        ctx.restore();
    }

    _renderIntroGlitch(ctx, progress) {
        ctx.save();
        ctx.fillStyle = Constants.COLOR_AI_GLITCH_1;
        ctx.globalAlpha = (1 - progress) * Constants.VICTORY_INTRO_GLITCH_ALPHA;
        for (let i = 0; i < Constants.VICTORY_INTRO_GLITCH_LINES; i++) {
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
