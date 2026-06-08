/**
 * AIStar.js
 * Estrellas IA: grupo de 2-4 estrellas con movimiento zig-zag descendente (PRD §07).
 * Dependencias: Entity.js, Constants.js
 */

class AIStar extends Entity {
    constructor() {
        super(0, 0, 40, 40);
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
        this.starCount = Math.max(2, Math.min(4, starCount));
        this.platforms = platforms;
        this.platformIndex = platformIndex;
        this.direction = direction;
        this.moveState = Constants.STAR_MOVE_STATE.HORIZONTAL;
        this.velocityX = direction * Constants.STAR_SPEED;
        this.velocityY = 0;
        this.lifetime = 0;
        this.pulsePhase = 0;
        this.width = 40;
        this.height = 40;
        this._trail = [];
        this._launchFlash = 0.35;
        this._particles = this._buildLaunchParticles();
        this._snapToPlatformSurface();
    }

    _buildLaunchParticles() {
        const particles = [];
        for (let i = 0; i < 8; i++) {
            particles.push({
                x: 0,
                y: 0,
                vx: (Math.random() - 0.5) * 120,
                vy: Math.random() * 80 + 40,
                life: 0.25 + Math.random() * 0.2,
                maxLife: 0.45,
                size: 2 + Math.random() * 3,
                color: i % 2 === 0 ? Constants.COLOR_STAR_1 : Constants.COLOR_STAR_3
            });
        }
        return particles;
    }

    update(dt) {
        if (!this.active || !this.platforms.length) return;

        this.lifetime += dt;
        this.pulsePhase += dt * 4;
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
        if (this._trail.length > 12) this._trail.shift();
        for (const t of this._trail) {
            t.alpha -= dt * 2.2;
        }
        while (this._trail.length && this._trail[0].alpha <= 0) {
            this._trail.shift();
        }

        for (const p of this._particles) {
            p.life -= dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vy += 200 * dt;
        }
        this._particles = this._particles.filter(p => p.life > 0);
    }

    _updateHorizontal(dt, platform) {
        this.x += this.velocityX * dt;
        this._snapToPlatformSurface();

        if (!this._reachedEdge(platform)) return;

        if (this.platformIndex <= 0) {
            this.active = false;
            return;
        }

        this._clampToEdge(platform);
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
        const targetY = nextPlatform.getTopY(centerX) - this.height;

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
        this.y = platform.getTopY(centerX) - this.height;
    }

    _reachedEdge(platform) {
        if (this.direction > 0) {
            return this.x + this.width >= platform.x + platform.width - 2;
        }
        return this.x <= platform.x + 2;
    }

    _clampToEdge(platform) {
        if (this.direction > 0) {
            this.x = platform.x + platform.width - this.width;
        } else {
            this.x = platform.x;
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
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 36);
        gradient.addColorStop(0, Constants.COLOR_STAR_GLOW + '66');
        gradient.addColorStop(0.5, Constants.COLOR_STAR_GLOW + '22');
        gradient.addColorStop(1, Constants.COLOR_STAR_GLOW + '00');
        ctx.fillStyle = gradient;
        ctx.fillRect(centerX - 36, centerY - 36, 72, 72);

        // Núcleo energético (proyectil)
        ctx.fillStyle = Constants.COLOR_STAR_2;
        ctx.globalAlpha = pulse;
        ctx.shadowColor = Constants.COLOR_STAR_GLOW;
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
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
            const alpha = Math.max(0, curr.alpha) * 0.55;
            const width = 2 + (i / this._trail.length) * 10;

            ctx.strokeStyle = `rgba(255, 0, 255, ${alpha})`;
            ctx.lineWidth = width;
            ctx.shadowColor = '#0088ff';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(curr.x, curr.y);
            ctx.stroke();
        }

        // Estela direccional principal
        const tailLen = 28 + Math.abs(this.velocityX) * 0.08 + Math.abs(this.velocityY) * 0.08;
        const tx = centerX - Math.cos(moveAngle) * tailLen;
        const ty = centerY - Math.sin(moveAngle) * tailLen;
        const streak = ctx.createLinearGradient(tx, ty, centerX, centerY);
        streak.addColorStop(0, 'rgba(0, 136, 255, 0)');
        streak.addColorStop(0.4, 'rgba(255, 0, 255, 0.35)');
        streak.addColorStop(1, 'rgba(255, 0, 136, 0.85)');
        ctx.strokeStyle = streak;
        ctx.lineWidth = 14;
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
            ctx.globalAlpha = this._launchFlash * 2.5;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(centerX, centerY, 18 + (0.35 - this._launchFlash) * 30, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        const originX = centerX - this.direction * 22;
        for (const p of this._particles) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 6;
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
            const distance = 8 + i * 2;
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
            x: this.x + 5,
            y: this.y + 5,
            width: this.width - 10,
            height: this.height - 10
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
