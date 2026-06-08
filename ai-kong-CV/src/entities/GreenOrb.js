/**
 * GreenOrb.js
 * Entidad de la esfera verde recogible.
 * Responsabilidad: posición, colisión, renderizado.
 * Dependencias: Entity.js, Constants.js
 */

class GreenOrb extends Entity {
    constructor(x = 0, y = 0) {
        super(x, y, Constants.ORB_RADIUS * 2, Constants.ORB_RADIUS * 2);
        this.collected = false;
        this.pulsePhase = 0;
    }

    /**
     * Actualizar la esfera
     */
    update(dt) {
        if (!this.active) return;

        this.pulsePhase += dt * 3;
    }

    /**
     * Renderizar la esfera
     */
    render(ctx) {
        if (!this.visible || !this.active || this.collected) return;

        const centerX = this.x + Constants.ORB_RADIUS;
        const centerY = this.y + Constants.ORB_RADIUS;
        const radius = Constants.ORB_RADIUS;
        const pulse = Math.sin(this.pulsePhase) * 0.2 + 0.8;

        // Glow
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 2);
        gradient.addColorStop(0, Constants.COLOR_ORB_GLOW + '88');
        gradient.addColorStop(1, Constants.COLOR_ORB_GLOW + '00');
        ctx.fillStyle = gradient;
        ctx.fillRect(centerX - radius * 2, centerY - radius * 2, radius * 4, radius * 4);

        // Círculo principal
        ctx.fillStyle = Constants.COLOR_ORB;
        ctx.globalAlpha = pulse;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Contorno
        ctx.strokeStyle = Constants.COLOR_ORB_GLOW;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
    }

    /**
     * Marcar como recogida
     */
    collect() {
        this.collected = true;
        this.active = false;
    }

    /**
     * Obtener bounds para colisión (circular)
     */
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            isCircle: true,
            radius: Constants.ORB_RADIUS,
            centerX: this.x + Constants.ORB_RADIUS,
            centerY: this.y + Constants.ORB_RADIUS
        };
    }

    /**
     * Init para pool
     */
    init(x, y) {
        super.init();
        this.setPosition(x, y);
        this.collected = false;
        this.pulsePhase = 0;
    }

    /**
     * Reset para pool
     */
    reset() {
        super.reset();
        this.collected = false;
        this.pulsePhase = 0;
    }
}
