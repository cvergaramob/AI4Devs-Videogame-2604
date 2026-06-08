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
        const pad = 12;
        const barH = 36;

        // Banda de fondo semitransparente para toda la barra HUD
        ctx.fillStyle = 'rgba(0, 0, 10, 0.72)';
        ctx.fillRect(0, 0, Constants.CANVAS_WIDTH, barH + pad);

        // Borde inferior de la banda
        ctx.strokeStyle = 'rgba(123, 47, 255, 0.6)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, barH + pad);
        ctx.lineTo(Constants.CANVAS_WIDTH, barH + pad);
        ctx.stroke();

        const midY = (barH + pad) / 2;

        ctx.save();
        ctx.textBaseline = 'middle';

        // ── SCORE (arriba izquierda) ──
        ctx.font = 'bold 15px monospace';
        ctx.fillStyle = '#00ff88';
        ctx.textAlign = 'left';
        const scoreStr = `SCORE: ${String(this.score).padStart(7, '0')}`;
        ctx.fillText(scoreStr, pad, midY);

        // ── VIDAS (arriba centro) — miniaturas del jugador ──
        const livesCenterX = Constants.CANVAS_WIDTH / 2 + 8;
        const iconW = 14;
        const iconH = 22;
        const iconGap = 6;
        const totalIconsW = Constants.LIVES_INITIAL * iconW + (Constants.LIVES_INITIAL - 1) * iconGap;
        const iconsStartX = livesCenterX - totalIconsW / 2;

        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#aaaaaa';
        ctx.textAlign = 'right';
        ctx.fillText('VIDAS', iconsStartX - 10, midY);

        for (let i = 0; i < Constants.LIVES_INITIAL; i++) {
            const ix = iconsStartX + i * (iconW + iconGap);
            this._renderLifeIcon(ctx, ix, midY - iconH / 2, i < this.lives);
        }

        // ── TIMER (arriba derecha) ──
        const timeDisplay = Math.ceil(Math.max(0, this.timeRemaining));
        const isUrgent = timeDisplay <= 15;
        ctx.font = 'bold 15px monospace';
        ctx.fillStyle = isUrgent ? '#ff4444' : '#ffffff';
        ctx.textAlign = 'right';
        ctx.fillText(`TIME: ${String(timeDisplay).padStart(3, '0')}s`, Constants.CANVAS_WIDTH - pad, midY);

        ctx.restore();

        // ── BARRA DE PROTECCIÓN (debajo del timer, visible solo si activa) ──
        if (this.protectionActive) {
            this._renderProtectionBar(ctx, pad, barH + pad + 4);
        }
    }

    /** Miniatura del jugador para el contador de vidas (activa / perdida) */
    _renderLifeIcon(ctx, x, y, active) {
        ctx.save();
        const w = 14;
        const h = 22;

        if (active) {
            ctx.fillStyle = Constants.COLOR_PLAYER;
            ctx.shadowColor = Constants.COLOR_PLAYER;
            ctx.shadowBlur = 6;
        } else {
            ctx.fillStyle = 'rgba(0, 255, 255, 0.12)';
            ctx.strokeStyle = 'rgba(0, 136, 255, 0.35)';
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
        const barW = 160;
        const barH = 6;
        const x = Constants.CANVAS_WIDTH - padRight - barW;

        const ratio = Math.max(0, this.protectionTime / Constants.PROTECTION_DURATION);
        const isBlinking = this.protectionTime < Constants.PROTECTION_BLINK_THRESHOLD;

        // Parpadeo en últimos 3 segundos
        if (isBlinking && Math.floor(this.protectionTime * 8) % 2 === 0) return;

        // Fondo de barra
        ctx.fillStyle = 'rgba(0,255,136,0.15)';
        ctx.fillRect(x, y, barW, barH);

        // Relleno de barra
        const fillColor = isBlinking ? '#ffee00' : '#00ff88';
        ctx.fillStyle = fillColor;
        ctx.fillRect(x, y, barW * ratio, barH);

        // Etiqueta
        ctx.save();
        ctx.font = '10px monospace';
        ctx.fillStyle = fillColor;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.fillText('● PROTEGIDO', Constants.CANVAS_WIDTH - padRight, y + barH + 2);
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
