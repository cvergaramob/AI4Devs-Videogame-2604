/**
 * MenuScreen.js
 * Pantalla de inicio del juego.
 * Responsabilidad: renderizar menú con estética neon-dark, esperar input para iniciar.
 * Dependencias: Constants.js, EventBus.js
 */

class MenuScreen {
    constructor() {
        this.started = false;
        this.pulsePhase = 0;
        this._setupInput();
    }

    _setupInput() {
        window.addEventListener('keydown', (e) => {
            if (!window.game ||
                window.game.stateMachine.getState() !== Constants.GAME_STATE.MENU) {
                return;
            }
            if (e.key === ' ' || e.key === 'Enter') {
                this.started = true;
                e.preventDefault();
            }
        });
    }

    update(dt) {
        this.pulsePhase += dt * 2.5;
    }

    render(ctx) {
        const CW = Constants.CANVAS_WIDTH;
        const CH = Constants.CANVAS_HEIGHT;

        // Fondo oscuro
        ctx.fillStyle = '#0a0010';
        ctx.fillRect(0, 0, CW, CH);

        // Grid de fondo (decorativo)
        ctx.strokeStyle = 'rgba(123, 47, 255, 0.12)';
        ctx.lineWidth = 1;
        const gridSize = 40;
        for (let x = 0; x < CW; x += gridSize) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CH); ctx.stroke();
        }
        for (let y = 0; y < CH; y += gridSize) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CW, y); ctx.stroke();
        }

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // ── TÍTULO "AI KONG" con glow multicapa ──
        const titleY = 130;
        ctx.font = 'bold 72px monospace';

        // Glow exterior violeta
        ctx.shadowColor = '#bf5fff';
        ctx.shadowBlur = 40;
        ctx.fillStyle = '#bf5fff';
        ctx.fillText('AI KONG', CW / 2, titleY);

        // Glow interior magenta
        ctx.shadowColor = '#ff3aff';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#ff3aff';
        ctx.fillText('AI KONG', CW / 2, titleY);

        // Texto sólido cian
        ctx.shadowColor = '#00eeff';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#00eeff';
        ctx.fillText('AI KONG', CW / 2, titleY);

        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';

        // ── Subtítulo ──
        ctx.font = '20px monospace';
        ctx.fillStyle = '#bf5fff';
        ctx.fillText('Apaga la IA antes de que sea tarde', CW / 2, 185);

        // ── Separador decorativo ──
        ctx.strokeStyle = 'rgba(123, 47, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(CW / 2 - 220, 210);
        ctx.lineTo(CW / 2 + 220, 210);
        ctx.stroke();

        // ── Controles ──
        ctx.font = 'bold 14px monospace';
        ctx.fillStyle = '#00ffcc';
        ctx.fillText('CONTROLES', CW / 2, 245);

        const controls = [
            ['← → / A D',    'Moverse'],
            ['ESPACIO / ↑',   'Saltar'],
            ['↑ ↓ / W S',     'Subir / Bajar escalera'],
            ['ESC',           'Pausar / Reanudar'],
        ];

        ctx.font = '13px monospace';
        let y = 275;
        for (const [key, desc] of controls) {
            ctx.fillStyle = '#7b2fff';
            ctx.textAlign = 'left';
            ctx.fillText(key, CW / 2 - 160, y);
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'left';
            ctx.fillText(desc, CW / 2 - 10, y);
            y += 26;
        }

        // ── Objetivo ──
        ctx.textAlign = 'center';
        ctx.font = '14px monospace';
        ctx.fillStyle = '#ffee00';
        ctx.fillText('▲  Llega al interruptor y apaga a la IA  ▲', CW / 2, 420);

        // ── "PRESIONA ENTER PARA COMENZAR" parpadeando ──
        const alpha = Math.sin(this.pulsePhase) * 0.35 + 0.65;
        ctx.globalAlpha = alpha;
        ctx.font = 'bold 18px monospace';
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#00ff88';
        ctx.fillText('PRESIONA ESPACIO O ENTER PARA COMENZAR', CW / 2, 490);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        // ── Versión ──
        ctx.font = '11px monospace';
        ctx.fillStyle = 'rgba(123,47,255,0.5)';
        ctx.fillText('AI Kong · MVP v1.0', CW / 2, CH - 20);

        ctx.restore();
    }

    hasStarted() {
        return this.started;
    }

    reset() {
        this.started = false;
        this.pulsePhase = 0;
    }
}
