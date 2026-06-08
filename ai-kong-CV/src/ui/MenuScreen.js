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
        this.pulsePhase += dt * Constants.MENU_PULSE_SPEED;
    }

    render(ctx) {
        const CW = Constants.CANVAS_WIDTH;
        const CH = Constants.CANVAS_HEIGHT;

        ctx.fillStyle = Constants.MENU_BG_COLOR;
        ctx.fillRect(0, 0, CW, CH);

        ctx.strokeStyle = Constants.MENU_GRID_COLOR;
        ctx.lineWidth = 1;
        const gridSize = Constants.MENU_GRID_SIZE;
        for (let x = 0; x < CW; x += gridSize) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CH); ctx.stroke();
        }
        for (let y = 0; y < CH; y += gridSize) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CW, y); ctx.stroke();
        }

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const titleY = Constants.MENU_TITLE_Y;
        ctx.font = Constants.MENU_TITLE_FONT;

        ctx.shadowColor = Constants.MENU_TITLE_GLOW_OUTER;
        ctx.shadowBlur = Constants.MENU_TITLE_SHADOW_BLUR_OUTER;
        ctx.fillStyle = Constants.MENU_TITLE_GLOW_OUTER;
        ctx.fillText('AI KONG', CW / 2, titleY);

        ctx.shadowColor = Constants.MENU_TITLE_GLOW_INNER;
        ctx.shadowBlur = Constants.MENU_TITLE_SHADOW_BLUR_INNER;
        ctx.fillStyle = Constants.MENU_TITLE_GLOW_INNER;
        ctx.fillText('AI KONG', CW / 2, titleY);

        ctx.shadowColor = Constants.MENU_TITLE_SOLID;
        ctx.shadowBlur = Constants.MENU_TITLE_SHADOW_BLUR_SOLID;
        ctx.fillStyle = Constants.MENU_TITLE_SOLID;
        ctx.fillText('AI KONG', CW / 2, titleY);

        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';

        ctx.font = Constants.MENU_SUBTITLE_FONT;
        ctx.fillStyle = Constants.MENU_SUBTITLE_COLOR;
        ctx.fillText('Apaga la IA antes de que sea tarde', CW / 2, Constants.MENU_SUBTITLE_Y);

        ctx.strokeStyle = Constants.MENU_SEPARATOR_COLOR;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(CW / 2 - Constants.MENU_SEPARATOR_HALF_W, Constants.MENU_SEPARATOR_Y);
        ctx.lineTo(CW / 2 + Constants.MENU_SEPARATOR_HALF_W, Constants.MENU_SEPARATOR_Y);
        ctx.stroke();

        ctx.font = Constants.MENU_CONTROLS_TITLE_FONT;
        ctx.fillStyle = Constants.MENU_CONTROLS_TITLE_COLOR;
        ctx.fillText('CONTROLES', CW / 2, Constants.MENU_CONTROLS_TITLE_Y);

        const controls = [
            ['← → / A D',    'Moverse'],
            ['ESPACIO / ↑',   'Saltar'],
            ['↑ ↓ / W S',     'Subir / Bajar escalera'],
            ['ESC',           'Pausar / Reanudar'],
        ];

        ctx.font = Constants.MENU_CONTROLS_FONT;
        let y = Constants.MENU_CONTROLS_START_Y;
        for (const [key, desc] of controls) {
            ctx.fillStyle = Constants.MENU_CONTROLS_KEY_COLOR;
            ctx.textAlign = 'left';
            ctx.fillText(key, CW / 2 + Constants.MENU_CONTROLS_KEY_X, y);
            ctx.fillStyle = Constants.MENU_CONTROLS_DESC_COLOR;
            ctx.fillText(desc, CW / 2 + Constants.MENU_CONTROLS_DESC_X, y);
            y += Constants.MENU_CONTROLS_LINE_H;
        }

        ctx.textAlign = 'center';
        ctx.font = Constants.MENU_OBJECTIVE_FONT;
        ctx.fillStyle = Constants.MENU_OBJECTIVE_COLOR;
        ctx.fillText('▲  Llega al interruptor y apaga a la IA  ▲', CW / 2, Constants.MENU_OBJECTIVE_Y);

        const alpha = Math.sin(this.pulsePhase) * Constants.MENU_PROMPT_ALPHA_AMP + Constants.MENU_PROMPT_ALPHA_MIN;
        ctx.globalAlpha = alpha;
        ctx.font = Constants.MENU_PROMPT_FONT;
        ctx.shadowColor = Constants.MENU_PROMPT_COLOR;
        ctx.shadowBlur = Constants.MENU_PROMPT_SHADOW_BLUR;
        ctx.fillStyle = Constants.MENU_PROMPT_COLOR;
        ctx.fillText('PRESIONA ESPACIO O ENTER PARA COMENZAR', CW / 2, Constants.MENU_PROMPT_Y);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        ctx.font = Constants.MENU_VERSION_FONT;
        ctx.fillStyle = Constants.MENU_VERSION_COLOR;
        ctx.fillText(Constants.MENU_VERSION_TEXT, CW / 2, CH - Constants.MENU_VERSION_Y_OFFSET);

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
