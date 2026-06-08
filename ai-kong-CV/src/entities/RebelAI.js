/**
 * RebelAI.js
 * IA rebelde estática en el extremo final de la Plataforma 5.
 * - Núcleo violeta pulsante
 * - Visor/ojo oscilante
 * - Glitches periódicos y corrupción intensificable
 * - Píxeles corruptos aleatorios
 * - Fragmentos de código flotante
 * Dependencias: Entity.js, Constants.js, MathUtils.js
 */

class RebelAI extends Entity {
    constructor(x, y) {
        super(x, y, Constants.AI_WIDTH, Constants.AI_HEIGHT);
        this.time             = 0;
        this.glitchTimer      = 0;
        this.glitchActive     = false;
        this.glitchOffset     = { x: 0, y: 0 };
        this.glitchIntensity  = 1;
        this.isShuttingDown   = false;
        this.shutdownProgress = 0;
        this._scanlineOffset  = 0;
        this._fragments       = this._buildFragments();
    }

    _buildFragments() {
        const pool = ['01', '10', 'if(', '//', 'NaN', '∞', '!=', 'err', '??', '0x', 'Ω', 'AI', '404'];
        const n = Constants.REBEL_AI_FRAGMENT_COUNT;
        return Array.from({ length: n }, (_, i) => ({
            text:   pool[i % pool.length],
            angle:  (i / n) * Math.PI * 2,
            radius: Constants.REBEL_AI_FRAGMENT_BASE_RADIUS + (i % 4) * Constants.REBEL_AI_FRAGMENT_RADIUS_STEP,
            speed:  Constants.REBEL_AI_FRAGMENT_BASE_SPEED + (i % 5) * Constants.REBEL_AI_FRAGMENT_SPEED_STEP,
            alpha:  0,
            phase:  (i / n) * Math.PI * 2
        }));
    }

    update(dt) {
        if (!this.active) return;
        this.time += dt;
        this._scanlineOffset = (this._scanlineOffset + dt * Constants.REBEL_AI_SCANLINE_SPEED) % Constants.CANVAS_HEIGHT;

        const glitchInterval = Math.max(Constants.REBEL_AI_GLITCH_INTERVAL_MIN,
            Constants.REBEL_AI_GLITCH_INTERVAL_BASE / this.glitchIntensity);
        this.glitchTimer += dt;
        if (this.glitchTimer > glitchInterval) {
            this.glitchTimer  = 0;
            this.glitchActive = true;
            const amp = Constants.REBEL_AI_GLITCH_AMP_BASE + this.glitchIntensity * Constants.REBEL_AI_GLITCH_AMP_FACTOR;
            this.glitchOffset = {
                x: (Math.random() - 0.5) * amp * 2,
                y: (Math.random() - 0.5) * amp
            };
        } else if (this.glitchTimer > glitchInterval * Constants.REBEL_AI_GLITCH_DURATION_RATIO) {
            this.glitchActive = false;
        }

        for (const f of this._fragments) {
            f.angle += f.speed * dt * this.glitchIntensity;
            f.alpha = Math.max(0, Math.min(1,
                Constants.REBEL_AI_FRAGMENT_ALPHA_BASE +
                Constants.REBEL_AI_FRAGMENT_ALPHA_AMP * Math.sin(
                    this.time * Constants.REBEL_AI_FRAGMENT_PULSE_SPEED * this.glitchIntensity + f.phase
                )
            ));
        }

        if (this.isShuttingDown) {
            const rate = Constants.REBEL_AI_SHUTDOWN_RATE_BASE + this.glitchIntensity * Constants.REBEL_AI_SHUTDOWN_RATE_FACTOR;
            this.shutdownProgress += dt * rate;
            if (this.shutdownProgress >= 1) {
                this.shutdownProgress = 1;
                this.visible = false;
            }
        }
    }

    render(ctx) {
        if (!this.visible) return;
        ctx.save();

        const cx = this.x + this.width  / 2;
        const cy = this.y + this.height / 2;

        if (this.glitchActive && this.glitchIntensity > Constants.REBEL_AI_RGB_SPLIT_THRESHOLD) {
            this._renderRGBSplit(ctx, cx, cy);
        }

        this._renderCorruptPixels(ctx, cx, cy);
        this._renderCore(ctx, cx, cy);
        this._renderEye(ctx, cx, cy);
        this._renderCodeFragments(ctx, cx, cy);

        if (this.isShuttingDown) {
            this._renderShutdown(ctx, cx, cy);
        }

        ctx.restore();
    }

    _renderRGBSplit(ctx, cx, cy) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = Constants.REBEL_AI_RGB_SPLIT_ALPHA * this.glitchIntensity;
        ctx.translate(this.glitchOffset.x * 0.5, 0);
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(this.x - 8, this.y, this.width + 16, this.height);
        ctx.translate(-this.glitchOffset.x, this.glitchOffset.y * 0.3);
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(this.x - 8, this.y, this.width + 16, this.height);
        ctx.restore();
    }

    _renderCorruptPixels(ctx, cx, cy) {
        const count = Math.floor(Constants.REBEL_AI_CORRUPT_COUNT_BASE + this.glitchIntensity * Constants.REBEL_AI_CORRUPT_COUNT_FACTOR);
        const radius = Constants.REBEL_AI_CORRUPT_RADIUS_BASE + this.glitchIntensity * Constants.REBEL_AI_CORRUPT_RADIUS_FACTOR;
        for (let i = 0; i < count; i++) {
            const angle  = Math.random() * Math.PI * 2;
            const dist   = Constants.REBEL_AI_CORRUPT_DIST_MIN + Math.random() * radius;
            const px     = cx + Math.cos(angle) * dist;
            const py     = cy + Math.sin(angle) * dist;
            const colors = ['#ff00ff', '#00ffff', '#7b2fff', '#ff0088', '#ffee00'];
            ctx.fillStyle   = colors[Math.floor(Math.random() * colors.length)];
            ctx.globalAlpha = 0.35 + Math.random() * 0.55;
            const size = 1 + Math.floor(Math.random() * 3);
            ctx.fillRect(px, py, size, size);
        }
        ctx.globalAlpha = 1;
    }

    _renderCore(ctx, cx, cy) {
        const pulse  = 1 + Constants.REBEL_AI_CORE_PULSE_AMP * Math.sin(this.time * Constants.REBEL_AI_CORE_PULSE_SPEED * this.glitchIntensity);
        const radius = (this.width * Constants.REBEL_AI_CORE_RADIUS_FACTOR) * pulse * (1 - this.shutdownProgress * 0.35);

        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * Constants.REBEL_AI_CORE_GLOW_FACTOR);
        glow.addColorStop(0,   Constants.COLOR_AI_PRIMARY + 'cc');
        glow.addColorStop(0.5, Constants.COLOR_AI_PRIMARY + '55');
        glow.addColorStop(1,   Constants.COLOR_AI_PRIMARY + '00');
        ctx.fillStyle   = glow;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * Constants.REBEL_AI_CORE_GLOW_FACTOR, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1 - this.shutdownProgress * 0.6;
        ctx.fillStyle   = Constants.COLOR_AI_PRIMARY;
        ctx.shadowColor = Constants.COLOR_AI_PRIMARY;
        ctx.shadowBlur  = Constants.REBEL_AI_CORE_SHADOW_BASE + this.glitchIntensity * Constants.REBEL_AI_CORE_SHADOW_FACTOR;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth   = 1;
        ctx.globalAlpha = (0.35 + 0.35 * Math.sin(this.time * 8)) * (1 - this.shutdownProgress);
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;

        if (this.glitchActive) {
            ctx.fillStyle   = Constants.COLOR_AI_GLITCH_1;
            ctx.globalAlpha = 0.45 + this.glitchIntensity * 0.1;
            ctx.beginPath();
            ctx.arc(cx + this.glitchOffset.x, cy + this.glitchOffset.y, radius * 0.75, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle   = Constants.COLOR_AI_GLITCH_2;
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.arc(cx - this.glitchOffset.x * 0.6, cy + this.glitchOffset.y * 0.4, radius * 0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    _renderEye(ctx, cx, cy) {
        if (this.shutdownProgress > Constants.REBEL_AI_SHUTDOWN_FADE_THRESHOLD) return;

        const flicker = this.isShuttingDown ? Math.random() > 0.5 : 1;
        if (!flicker) return;

        const oscillateX = Math.sin(this.time * Constants.REBEL_AI_EYE_OSC_SPEED * this.glitchIntensity) *
            (Constants.REBEL_AI_EYE_OSC_AMP_BASE + this.glitchIntensity * Constants.REBEL_AI_EYE_OSC_AMP_FACTOR);
        const eyeW = Constants.REBEL_AI_EYE_W;
        const eyeH = Constants.REBEL_AI_EYE_H;

        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth   = 2;
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur  = 6 + this.glitchIntensity * 4;
        ctx.globalAlpha = 1 - this.shutdownProgress;
        ctx.beginPath();
        ctx.ellipse(cx, cy + 2, eyeW, eyeH, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.ellipse(cx + oscillateX, cy + 2, Constants.REBEL_AI_EYE_PUPIL_W, eyeH * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    _renderCodeFragments(ctx, cx, cy) {
        ctx.font         = Constants.REBEL_AI_FRAGMENT_FONT;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';

        for (const f of this._fragments) {
            const drift = this.glitchActive ? this.glitchOffset.x * 0.15 : 0;
            const fx = cx + Math.cos(f.angle) * f.radius + drift;
            const fy = cy + Math.sin(f.angle) * f.radius;

            ctx.fillStyle   = Math.floor(f.angle * 3) % 2 === 0 ? '#ff00ff' : '#00ffff';
            ctx.globalAlpha = Math.max(0, Math.min(1, f.alpha * (1 - this.shutdownProgress * 0.8)));
            ctx.fillText(f.text, fx, fy);
        }
        ctx.globalAlpha = 1;
    }

    _renderShutdown(ctx, cx, cy) {
        const p = this.shutdownProgress;

        for (let i = 0; i < Constants.REBEL_AI_SHUTDOWN_SCANLINES; i++) {
            const y = (this._scanlineOffset + i * Constants.REBEL_AI_SHUTDOWN_SCANLINE_SPACING) % (this.height + 20) + this.y - 10;
            ctx.fillStyle   = i % 2 === 0 ? '#ff00ff' : '#00ffff';
            ctx.globalAlpha = p * 0.12 * this.glitchIntensity;
            ctx.fillRect(this.x - 12, y, this.width + 24, 2);
        }

        ctx.fillStyle   = '#000';
        ctx.globalAlpha = p * 0.75;
        ctx.fillRect(this.x - 6, this.y, this.width + 12, this.height);

        ctx.fillStyle   = Constants.COLOR_AI_GLITCH_2;
        ctx.globalAlpha = Math.abs(Math.sin(p * Math.PI * 8)) * 0.5 * (1 - p * 0.5);
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth   = 2;
        ctx.globalAlpha = (1 - p) * 0.8;
        ctx.beginPath();
        ctx.moveTo(this.x, cy);
        ctx.lineTo(this.x + this.width, cy);
        ctx.stroke();

        ctx.font         = Constants.REBEL_AI_SHUTDOWN_FONT;
        ctx.textAlign    = 'center';
        ctx.fillStyle    = '#ff4444';
        ctx.globalAlpha  = Math.min(1, p * 1.5);
        ctx.fillText('SHUTDOWN', cx, this.y + this.height + 14);
        ctx.globalAlpha  = 1;
    }

    setGlitchIntensity(value) {
        this.glitchIntensity = Math.max(1, value);
    }

    startShutdown() {
        this.isShuttingDown   = true;
        this.shutdownProgress = 0;
        this.glitchIntensity  = Math.max(this.glitchIntensity, 2);
    }

    isShutDown() { return this.shutdownProgress >= 1; }

    reset() {
        this.time             = 0;
        this.glitchTimer      = 0;
        this.glitchActive     = false;
        this.glitchIntensity  = 1;
        this.isShuttingDown   = false;
        this.shutdownProgress = 0;
        this._scanlineOffset  = 0;
        this.active           = true;
        this.visible          = true;
        this._fragments       = this._buildFragments();
    }
}
