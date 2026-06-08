/**
 * Renderer.js
 * Orquestador de render: fondo con grid digital, luego capas en z-order correcto.
 * Dependencias: Constants.js
 */

class Renderer {
    constructor(canvas) {
        this.canvas    = canvas;
        this.ctx       = canvas.getContext('2d');
        this.debugMode = false;
        this._gridT    = 0;   // Tiempo para animación del grid
    }

    /** Limpiar + dibujar fondo con grid digital tenue */
    clear(dt = 0) {
        const ctx = this.ctx;
        this._gridT += dt || 0;

        // Fondo sólido
        ctx.fillStyle = Constants.COLOR_BACKGROUND;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Grid digital: líneas cada 40 px, levemente animadas
        const gridSize = 40;
        const alpha    = 0.04 + 0.015 * Math.sin(this._gridT * 0.8);
        ctx.save();
        ctx.strokeStyle = '#00ffcc';
        ctx.lineWidth   = 0.5;
        ctx.globalAlpha = alpha;

        for (let x = 0; x <= this.canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y <= this.canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.canvas.width, y);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
        ctx.restore();
    }

    /**
     * Renderizar escena de juego en el z-order correcto:
     * 1 Fondo (ya hecho en clear)
     * 2 Plataformas
     * 3 Escaleras
     * 4 Interruptor
     * 5 IA rebelde
     * 6 Esferas verdes
     * 7 Estrellas IA
     * 8 Jugador
     * 9 HUD
     */
    renderGameScene(platforms, ladders, player, orbs, stars, switchEntity, ai, hud, dt) {
        this.clear(dt);

        // Capa 2: Plataformas
        for (const p of platforms) p.render(this.ctx);

        // Capa 3: Escaleras
        for (const l of ladders) l.render(this.ctx);

        // Capa 4: Interruptor
        switchEntity.render(this.ctx);

        // Capa 5: IA rebelde
        ai.render(this.ctx);

        // Capa 6: Esferas verdes
        for (const orb of orbs) orb.render(this.ctx);

        // Capa 7: Estrellas IA
        for (const star of stars) star.render(this.ctx);

        // Capa 8: Jugador
        player.render(this.ctx);

        // Capa 9: HUD (siempre al tope)
        hud.render(this.ctx);

        if (this.debugMode) this._renderDebugInfo();
    }

    _renderDebugInfo() {
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font      = '12px monospace';
        this.ctx.fillText('DEBUG MODE', 10, Constants.CANVAS_HEIGHT - 10);
    }

    enableDebugMode()  { this.debugMode = true; }
    disableDebugMode() { this.debugMode = false; }
    getContext()       { return this.ctx; }
    getCanvas()        { return this.canvas; }

    /**
     * Overlay de corrupción progresiva durante la secuencia de victoria in-game.
     */
    renderVictoryCorruptionOverlay(ctx, intensity, time) {
        ctx.save();
        const alpha = Math.min(0.55, intensity * 0.12);

        for (let i = 0; i < Math.floor(6 + intensity * 4); i++) {
            const y = (time * 180 + i * 47) % Constants.CANVAS_HEIGHT;
            ctx.fillStyle   = i % 2 === 0 ? '#ff00ff' : '#00ffff';
            ctx.globalAlpha = alpha * (0.4 + Math.random() * 0.6);
            ctx.fillRect(0, y, Constants.CANVAS_WIDTH, 1 + Math.random() * 3);
        }

        ctx.globalAlpha = alpha * 0.5;
        const block = 48;
        for (let x = 0; x < Constants.CANVAS_WIDTH; x += block) {
            for (let y = 0; y < Constants.CANVAS_HEIGHT; y += block) {
                if (Math.random() > 0.92 - intensity * 0.02) {
                    ctx.fillStyle = Math.random() > 0.5 ? '#7b2fff' : '#ffee00';
                    ctx.fillRect(x, y, block, block);
                }
            }
        }

        ctx.globalAlpha = 1;
        ctx.restore();
    }
}
