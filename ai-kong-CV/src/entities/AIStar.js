/**
 * AIStar.js
 * Estrellas IA: grupo de 2-4 estrellas con movimiento zig-zag descendente (PRD §07).
 * Dependencias: Entity.js, Constants.js
 */

class AIStar extends Entity {
    constructor() {
        super(0, 0, Constants.STAR_GROUP_SIZE, Constants.STAR_GROUP_SIZE);
        this.starCount = 0;
        this.platforms = [];
        this.platformIndex = 0;
        this.direction = -1;
        this.moveState = Constants.STAR_MOVE_STATE.HORIZONTAL;
        this.velocityX = 0;
        this.velocityY = 0;
        this.lifetime = 0;
        this.pulsePhase = 0;
        this._trail = [];
        this._launchFlash = 0;
        this._particles = [];
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} starCount
     * @param {Platform[]} platforms - Plataformas jugables (índices 0–4)
     * @param {number} platformIndex - Índice de plataforma actual (4 = plataforma 5)
     * @param {number} direction - -1 izquierda, +1 derecha
     */
    init(x, y, starCount, platforms, platformIndex, direction) {
        super.init();
        this.x = x;
        this.y = y;
        this.starCount = Math.max(Constants.STAR_COUNT_MIN, Math.min(Constants.STAR_COUNT_MAX, starCount));
        this.platforms = platforms;
        this.platformIndex = platformIndex;
        this.direction = direction;
        this.moveState = Constants.STAR_MOVE_STATE.HORIZONTAL;
        this.velocityX = direction * Constants.STAR_SPEED;
        this.velocityY = 0;
        this.lifetime = 0;
        this.pulsePhase = 0;
        this.width = Constants.STAR_GROUP_SIZE;
        this.height = Constants.STAR_GROUP_SIZE;
        this._trail = [];
        this._launchFlash = Constants.STAR_LAUNCH_FLASH;
        this._particles = this._buildLaunchParticles();
        this._snapToPlatformSurface();
    }

    _buildLaunchParticles() {
        const particles = [];
        for (let i = 0; i < Constants.STAR_PARTICLE_COUNT; i++) {
            particles.push({
                x: 0,
                y: 0,
                vx: (Math.random() - 0.5) * Constants.STAR_PARTICLE_VEL_X,
                vy: Math.random() * Constants.STAR_PARTICLE_VEL_Y_MAX + Constants.STAR_PARTICLE_VEL_Y_MIN,
                life: Constants.STAR_PARTICLE_LIFE_MIN + Math.random() * Constants.STAR_PARTICLE_LIFE_MAX,
                maxLife: Constants.STAR_PARTICLE_MAX_LIFE,
                size: Constants.STAR_PARTICLE_SIZE_MIN + Math.random() * Constants.STAR_PARTICLE_SIZE_MAX,
                color: i % 2 === 0 ? Constants.COLOR_STAR_1 : Constants.COLOR_STAR_3
            });
        }
        return particles;
    }

    update(dt) {
        if (!this.active || !this.platforms.length) return;

        this.lifetime += dt;
        this.pulsePhase += dt * Constants.STAR_PULSE_SPEED;
        this._launchFlash = Math.max(0, this._launchFlash - dt);
        this._updateVisualEffects(dt);

        const platform = this.platforms[this.platformIndex];
        if (!platform) {
            this.active = false;
            return;
        }

        if (this.moveState === Constants.STAR_MOVE_STATE.HORIZONTAL) {
            this._updateHorizontal(dt, platform);
        } else {
            this._updateDescending(dt, platform);
        }

        if (this.y > Constants.CANVAS_HEIGHT) {
            this.active = false;
        }
    }

    _updateVisualEffects(dt) {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        this._trail.push({ x: cx, y: cy, alpha: 1 });
        if (this._trail.length > Constants.STAR_TRAIL_MAX) this._trail.shift();
        for (const t of this._trail) {
            t.alpha -= dt * Constants.STAR_TRAIL_FADE_SPEED;
        }
        while (this._trail.length && this._trail[0].alpha <= 0) {
            this._trail.shift();
        }

        for (const p of this._particles) {
            p.life -= dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vy += Constants.STAR_PARTICLE_GRAVITY * dt;
        }
        this._particles = this._particles.filter(p => p.life > 0);
    }

    _updateHorizontal(dt, platform) {
        this.x += this.velocityX * dt;
        // Ignora escaleras: solo la superficie extrapolada de la plataforma define Y.
        this._snapToPlatformSurface();

        if (!this._reachedCanvasEdge(platform)) return;

        if (this.platformIndex <= 0) {
            this.active = false;
            return;
        }

        this._clampToCanvasEdge(platform);
        this.moveState = Constants.STAR_MOVE_STATE.DESCENDING;
        this.velocityX = 0;
        this.velocityY = Constants.STAR_SPEED;
    }

    _updateDescending(dt, platform) {
        this.y += this.velocityY * dt;

        const nextIndex = this.platformIndex - 1;
        const nextPlatform = this.platforms[nextIndex];
        if (!nextPlatform) {
            this.active = false;
            return;
        }

        const centerX = this.x + this.width / 2;
        const targetY = nextPlatform.getStarSurfaceY(centerX) - this.height;

        if (this.y < targetY) return;

        this.y = targetY;
        this.platformIndex = nextIndex;
        this.direction *= -1;
        this.velocityX = this.direction * Constants.STAR_SPEED;
        this.velocityY = 0;
        this.moveState = Constants.STAR_MOVE_STATE.HORIZONTAL;
    }

    _snapToPlatformSurface() {
        const platform = this.platforms[this.platformIndex];
        if (!platform) return;
        const centerX = this.x + this.width / 2;
        this.y = platform.getStarSurfaceY(centerX) - this.height;
    }

    /** Borde horizontal del canvas; las escaleras no participan en esta decisión. */
    _reachedCanvasEdge(platform) {
        const leftEdge  = platform.getTraversalLeftEdge();
        const rightEdge = platform.getTraversalRightEdge();
        if (this.direction > 0) {
            return this.x + this.width >= rightEdge;
        }
        return this.x <= leftEdge;
    }

    _clampToCanvasEdge(platform) {
        const leftEdge  = platform.getTraversalLeftEdge();
        const rightEdge = platform.getTraversalRightEdge();
        if (this.direction > 0) {
            this.x = rightEdge - this.width;
        } else {
            this.x = leftEdge;
        }
    }

    render(ctx) {
        if (!this.visible || !this.active) return;

        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
        const moveAngle = Math.atan2(this.velocityY, this.velocityX || this.direction);

        ctx.save();

        this._renderTrail(ctx, centerX, centerY, moveAngle);
        this._renderLaunchEffects(ctx, centerX, centerY);

        // Resplandor de proyectil
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Constants.STAR_GLOW_RADIUS);
        gradient.addColorStop(0, Constants.COLOR_STAR_GLOW + '66');
        gradient.addColorStop(0.5, Constants.COLOR_STAR_GLOW + '22');
        gradient.addColorStop(1, Constants.COLOR_STAR_GLOW + '00');
        ctx.fillStyle = gradient;
        const glowD = Constants.STAR_GLOW_RADIUS * 2;
        ctx.fillRect(centerX - Constants.STAR_GLOW_RADIUS, centerY - Constants.STAR_GLOW_RADIUS, glowD, glowD);

        // Núcleo energético (proyectil)
        ctx.fillStyle = Constants.COLOR_STAR_2;
        ctx.globalAlpha = pulse;
        ctx.shadowColor = Constants.COLOR_STAR_GLOW;
        ctx.shadowBlur = Constants.STAR_CORE_SHADOW_BLUR;
        ctx.beginPath();
        ctx.arc(centerX, centerY, Constants.STAR_CORE_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        const colors = [Constants.COLOR_STAR_1, Constants.COLOR_STAR_2, Constants.COLOR_STAR_3];
        const positions = this._getStarPositions(centerX, centerY, this.starCount);
        positions.forEach((pos, idx) => {
            ctx.fillStyle = colors[idx % colors.length];
            ctx.globalAlpha = pulse;
            this._drawStar(ctx, pos.x, pos.y, Constants.STAR_SIZE);
            ctx.globalAlpha = 1.0;
        });

        ctx.restore();
    }

    _renderTrail(ctx, centerX, centerY, moveAngle) {
        if (this._trail.length < 2) return;

        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = 1; i < this._trail.length; i++) {
            const prev = this._trail[i - 1];
            const curr = this._trail[i];
            const alpha = Math.max(0, curr.alpha) * Constants.STAR_TRAIL_ALPHA_FACTOR;
            const width = Constants.STAR_TRAIL_WIDTH_MIN + (i / this._trail.length) * Constants.STAR_TRAIL_WIDTH_MAX;

            ctx.strokeStyle = `rgba(255, 0, 255, ${alpha})`;
            ctx.lineWidth = width;
            ctx.shadowColor = '#0088ff';
            ctx.shadowBlur = Constants.STAR_TRAIL_SHADOW_BLUR;
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(curr.x, curr.y);
            ctx.stroke();
        }

        // Estela direccional principal
        const tailLen = Constants.STAR_STREAK_LEN_BASE +
            Math.abs(this.velocityX) * Constants.STAR_STREAK_VEL_FACTOR +
            Math.abs(this.velocityY) * Constants.STAR_STREAK_VEL_FACTOR;
        const tx = centerX - Math.cos(moveAngle) * tailLen;
        const ty = centerY - Math.sin(moveAngle) * tailLen;
        const streak = ctx.createLinearGradient(tx, ty, centerX, centerY);
        streak.addColorStop(0, 'rgba(0, 136, 255, 0)');
        streak.addColorStop(0.4, 'rgba(255, 0, 255, 0.35)');
        streak.addColorStop(1, 'rgba(255, 0, 136, 0.85)');
        ctx.strokeStyle = streak;
        ctx.lineWidth = Constants.STAR_STREAK_WIDTH;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(centerX, centerY);
        ctx.stroke();

        ctx.restore();
    }

    _renderLaunchEffects(ctx, centerX, centerY) {
        if (this._launchFlash > 0) {
            ctx.save();
            ctx.globalAlpha = this._launchFlash * Constants.STAR_LAUNCH_FLASH_ALPHA;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(centerX, centerY,
                Constants.STAR_LAUNCH_FLASH_RADIUS + (Constants.STAR_LAUNCH_FLASH - this._launchFlash) * Constants.STAR_LAUNCH_FLASH_RADIUS_SCALE,
                0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        const originX = centerX - this.direction * Constants.STAR_LAUNCH_ORIGIN_OFFSET;
        for (const p of this._particles) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = Constants.STAR_LAUNCH_PARTICLE_SHADOW;
            ctx.beginPath();
            ctx.arc(originX + p.x, centerY + p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    _getStarPositions(centerX, centerY, count) {
        const positions = [];
        const angle = (Math.PI * 2) / count;
        for (let i = 0; i < count; i++) {
            const a = angle * i;
            const distance = Constants.STAR_POSITION_DIST_BASE + i * Constants.STAR_POSITION_DIST_STEP;
            positions.push({
                x: centerX + Math.cos(a) * distance,
                y: centerY + Math.sin(a) * distance
            });
        }
        return positions;
    }

    _drawStar(ctx, x, y, size) {
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + size * 0.4, y - size * 0.4);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x + size * 0.4, y + size * 0.4);
        ctx.lineTo(x, y + size);
        ctx.lineTo(x - size * 0.4, y + size * 0.4);
        ctx.lineTo(x - size, y);
        ctx.lineTo(x - size * 0.4, y - size * 0.4);
        ctx.closePath();
        ctx.fill();
    }

    getBounds() {
        return {
            x: this.x + Constants.STAR_COLLISION_SHRINK,
            y: this.y + Constants.STAR_COLLISION_SHRINK,
            width: this.width - Constants.STAR_COLLISION_SHRINK * 2,
            height: this.height - Constants.STAR_COLLISION_SHRINK * 2
        };
    }

    reset() {
        super.reset();
        this.starCount = 0;
        this.platforms = [];
        this.platformIndex = 0;
        this.direction = -1;
        this.moveState = Constants.STAR_MOVE_STATE.HORIZONTAL;
        this.velocityX = 0;
        this.velocityY = 0;
        this.lifetime = 0;
        this.pulsePhase = 0;
        this._trail = [];
        this._launchFlash = 0;
        this._particles = [];
    }
}
