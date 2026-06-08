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
        this._gridT    = 0;
    }

    clear(dt = 0) {
        const ctx = this.ctx;
        this._gridT += dt || 0;

        ctx.fillStyle = Constants.COLOR_BACKGROUND;
        ctx.fillRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);

        const gridSize = Constants.RENDER_GRID_SIZE;
        const alpha    = Constants.RENDER_GRID_ALPHA_BASE +
            Constants.RENDER_GRID_ALPHA_AMP * Math.sin(this._gridT * Constants.RENDER_GRID_ANIM_SPEED);
        ctx.save();
        ctx.strokeStyle = Constants.RENDER_GRID_COLOR;
        ctx.lineWidth   = Constants.RENDER_GRID_LINE_WIDTH;
        ctx.globalAlpha = alpha;

        for (let x = 0; x <= Constants.CANVAS_WIDTH; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, Constants.CANVAS_HEIGHT);
            ctx.stroke();
        }
        for (let y = 0; y <= Constants.CANVAS_HEIGHT; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(Constants.CANVAS_WIDTH, y);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
        ctx.restore();
    }

    renderGameScene(platforms, ladders, player, orbs, stars, switchEntity, ai, hud, dt) {
        this.clear(dt);

        for (const p of platforms) p.render(this.ctx);
        for (const l of ladders) l.render(this.ctx);
        switchEntity.render(this.ctx);
        ai.render(this.ctx);
        for (const orb of orbs) orb.render(this.ctx);
        for (const star of stars) star.render(this.ctx);
        player.render(this.ctx);
        hud.render(this.ctx);

        if (this.debugMode) this._renderDebugInfo();
    }

    _renderDebugInfo() {
        this.ctx.fillStyle = Constants.RENDER_DEBUG_COLOR;
        this.ctx.font      = Constants.RENDER_DEBUG_FONT;
        this.ctx.fillText(
            'DEBUG MODE',
            Constants.RENDER_DEBUG_X,
            Constants.CANVAS_HEIGHT - Constants.RENDER_DEBUG_Y_OFFSET
        );
    }

    enableDebugMode()  { this.debugMode = true; }
    disableDebugMode() { this.debugMode = false; }
    getContext()       { return this.ctx; }
    getCanvas()        { return this.canvas; }

    renderVictoryCorruptionOverlay(ctx, intensity, time) {
        ctx.save();
        const alpha = Math.min(
            Constants.RENDER_CORRUPTION_ALPHA_MAX,
            intensity * Constants.RENDER_CORRUPTION_ALPHA_FACTOR
        );

        for (let i = 0; i < Math.floor(Constants.RENDER_CORRUPTION_LINES_BASE + intensity * Constants.RENDER_CORRUPTION_LINES_FACTOR); i++) {
            const y = (time * Constants.RENDER_CORRUPTION_LINE_SPEED + i * 47) % Constants.CANVAS_HEIGHT;
            ctx.fillStyle   = i % 2 === 0 ? '#ff00ff' : '#00ffff';
            ctx.globalAlpha = alpha * (0.4 + Math.random() * 0.6);
            ctx.fillRect(0, y, Constants.CANVAS_WIDTH, 1 + Math.random() * 3);
        }

        ctx.globalAlpha = alpha * 0.5;
        const block = Constants.RENDER_CORRUPTION_BLOCK_SIZE;
        for (let x = 0; x < Constants.CANVAS_WIDTH; x += block) {
            for (let y = 0; y < Constants.CANVAS_HEIGHT; y += block) {
                if (Math.random() > Constants.RENDER_CORRUPTION_BLOCK_CHANCE - intensity * Constants.RENDER_CORRUPTION_BLOCK_CHANCE_FACTOR) {
                    ctx.fillStyle = Math.random() > 0.5 ? '#7b2fff' : '#ffee00';
                    ctx.fillRect(x, y, block, block);
                }
            }
        }

        ctx.globalAlpha = 1;
        ctx.restore();
    }
}
