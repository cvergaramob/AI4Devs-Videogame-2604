/**
 * HUD.js
 * Head-Up Display: puntuación, vidas, temporizador, protección.
 * Responsabilidad: renderizar información de juego siempre visible en la UI.
 * Dependencias: Constants.js, EventBus.js
 */

class HUD {
    constructor() {
        this.score = 0;
        this.lives = Constants.LIVES_INITIAL;
        this.timeRemaining = Constants.TIMER_INITIAL;
        this.protectionActive = false;
        this.protectionTime = 0;
        this._setupEventListeners();
    }

    _setupEventListeners() {
        eventBus.on(EventNames.SCORE_UPDATED, (data) => {
            this.score = data.score;
        });
        eventBus.on(EventNames.TIMER_TICK, (data) => {
            this.timeRemaining = data.timeRemaining;
        });
        eventBus.on(EventNames.PROTECTION_ACTIVATED, () => {
            this.protectionActive = true;
            this.protectionTime = Constants.PROTECTION_DURATION;
        });
        eventBus.on(EventNames.PROTECTION_EXPIRED, () => {
            this.protectionActive = false;
            this.protectionTime = 0;
        });
        eventBus.on(EventNames.GAME_RESET, () => {
            this.score = 0;
            this.lives = Constants.LIVES_INITIAL;
            this.timeRemaining = Constants.TIMER_INITIAL;
            this.protectionActive = false;
            this.protectionTime = 0;
        });
        eventBus.on(EventNames.GAME_START, () => {
            this.lives = Constants.LIVES_INITIAL;
            this.timeRemaining = Constants.TIMER_INITIAL;
        });
    }

    update(dt) {
        if (this.protectionActive) {
            this.protectionTime -= dt;
            if (this.protectionTime <= 0) {
                this.protectionActive = false;
                this.protectionTime = 0;
            }
        }
    }

    render(ctx) {
        const pad = Constants.HUD_PAD;
        const barH = Constants.HUD_BAR_HEIGHT;

        ctx.fillStyle = Constants.HUD_BG_COLOR;
        ctx.fillRect(0, 0, Constants.CANVAS_WIDTH, barH + pad);

        ctx.strokeStyle = Constants.HUD_BORDER_COLOR;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, barH + pad);
        ctx.lineTo(Constants.CANVAS_WIDTH, barH + pad);
        ctx.stroke();

        const midY = (barH + pad) / 2;

        ctx.save();
        ctx.textBaseline = 'middle';

        ctx.font = Constants.HUD_SCORE_FONT;
        ctx.fillStyle = Constants.COLOR_TEXT_HUD;
        ctx.textAlign = 'left';
        const scoreStr = `SCORE: ${String(this.score).padStart(7, '0')}`;
        ctx.fillText(scoreStr, pad, midY);

        const livesCenterX = Constants.CANVAS_WIDTH / 2 + Constants.HUD_LIVES_CENTER_OFFSET;
        const iconW = Constants.HUD_LIVES_ICON_W;
        const iconH = Constants.HUD_LIVES_ICON_H;
        const iconGap = Constants.HUD_LIVES_GAP;
        const totalIconsW = Constants.LIVES_INITIAL * iconW + (Constants.LIVES_INITIAL - 1) * iconGap;
        const iconsStartX = livesCenterX - totalIconsW / 2;

        ctx.font = Constants.HUD_LABEL_FONT;
        ctx.fillStyle = Constants.HUD_LABEL_COLOR;
        ctx.textAlign = 'right';
        ctx.fillText('VIDAS', iconsStartX - Constants.HUD_LIVES_LABEL_GAP, midY);

        for (let i = 0; i < Constants.LIVES_INITIAL; i++) {
            const ix = iconsStartX + i * (iconW + iconGap);
            this._renderLifeIcon(ctx, ix, midY - iconH / 2, i < this.lives);
        }

        const timeDisplay = Math.ceil(Math.max(0, this.timeRemaining));
        const isUrgent = timeDisplay <= Constants.HUD_TIMER_URGENT_THRESHOLD;
        ctx.font = Constants.HUD_SCORE_FONT;
        ctx.fillStyle = isUrgent ? Constants.HUD_TIMER_URGENT_COLOR : Constants.HUD_TIMER_NORMAL_COLOR;
        ctx.textAlign = 'right';
        ctx.fillText(`TIME: ${String(timeDisplay).padStart(3, '0')}s`, Constants.CANVAS_WIDTH - pad, midY);

        ctx.restore();

        if (this.protectionActive) {
            this._renderProtectionBar(ctx, pad, barH + pad + Constants.HUD_PROTECTION_BAR_OFFSET);
        }
    }

    _renderLifeIcon(ctx, x, y, active) {
        ctx.save();
        const w = Constants.HUD_LIVES_ICON_W;
        const h = Constants.HUD_LIVES_ICON_H;

        if (active) {
            ctx.fillStyle = Constants.COLOR_PLAYER;
            ctx.shadowColor = Constants.COLOR_PLAYER;
            ctx.shadowBlur = Constants.HUD_LIFE_SHADOW_BLUR;
        } else {
            ctx.fillStyle = Constants.HUD_LIFE_INACTIVE_FILL;
            ctx.strokeStyle = Constants.HUD_LIFE_INACTIVE_STROKE;
            ctx.lineWidth = 1;
        }

        ctx.beginPath();
        ctx.arc(x + w / 2, y + 5, 4, 0, Math.PI * 2);
        if (active) ctx.fill();
        else { ctx.fill(); ctx.stroke(); }

        ctx.shadowBlur = 0;
        if (active) {
            ctx.fillStyle = Constants.COLOR_PLAYER;
            ctx.fillRect(x + 3, y + 10, w - 6, h - 12);
            ctx.fillStyle = Constants.COLOR_PLAYER_OUTLINE;
            ctx.fillRect(x + 2, y + h - 4, w - 4, 3);
        } else {
            ctx.strokeRect(x + 3, y + 10, w - 6, h - 12);
            ctx.strokeRect(x + 2, y + h - 4, w - 4, 3);
        }

        ctx.restore();
    }

    _renderProtectionBar(ctx, padRight, y) {
        const barW = Constants.HUD_PROTECTION_BAR_W;
        const barH = Constants.HUD_PROTECTION_BAR_H;
        const x = Constants.CANVAS_WIDTH - padRight - barW;

        const ratio = Math.max(0, this.protectionTime / Constants.PROTECTION_DURATION);
        const isBlinking = this.protectionTime < Constants.PROTECTION_BLINK_THRESHOLD;

        if (isBlinking && Math.floor(this.protectionTime * Constants.HUD_PROTECTION_BLINK_RATE) % 2 === 0) return;

        ctx.fillStyle = Constants.HUD_PROTECTION_BG;
        ctx.fillRect(x, y, barW, barH);

        const fillColor = isBlinking ? Constants.HUD_PROTECTION_BLINK_FILL : Constants.HUD_PROTECTION_FILL;
        ctx.fillStyle = fillColor;
        ctx.fillRect(x, y, barW * ratio, barH);

        ctx.save();
        ctx.font = Constants.HUD_PROTECTION_FONT;
        ctx.fillStyle = fillColor;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.fillText(Constants.HUD_PROTECTION_LABEL, Constants.CANVAS_WIDTH - padRight, y + barH + 2);
        ctx.restore();
    }

    getScore() { return this.score; }
    getLives() { return this.lives; }

    setLives(lives) {
        this.lives = lives;
    }

    reset() {
        this.score = 0;
        this.lives = Constants.LIVES_INITIAL;
        this.timeRemaining = Constants.TIMER_INITIAL;
        this.protectionActive = false;
        this.protectionTime = 0;
    }
}
