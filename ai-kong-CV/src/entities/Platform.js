/**
 * Platform.js
 * Plataforma jugable con inclinación alternada (±12 px) y huecos.
 * Plataformas impares (1, 3, 5): más baja a la izquierda → más alta a la derecha.
 * Plataformas pares (2, 4): más baja a la derecha → más alta a la izquierda.
 * Los huecos (gaps) se expresan como offsets relativos al borde izquierdo de la plataforma.
 * Dependencias: Entity.js, Constants.js
 */

class Platform extends Entity {
    /**
     * @param {number} visualTiltSign - +1 o -1; inclinación visual alternada (sin afectar colisión)
     */
    constructor(x, y, width, height = Constants.PLATFORM_HEIGHT, gaps = [], visualTiltSign = 1) {
        super(x, y, width, height);
        this.gaps = gaps;
        this.tiltOffset = Constants.PLATFORM_TILT_OFFSET;
        this.visualTiltSign = visualTiltSign;
    }

    /**
     * Y exacta de la superficie superior transitable (colisión) en atX.
     * Siempre inclinada izq. baja → der. alta; no depende del signo visual.
     */
    getTopY(atX) {
        const ratio = this.width > 0 ? (atX - this.x) / this.width : 0;
        return this.y + ratio * this.tiltOffset;
    }

    /**
     * Y de la superficie visual alternada en atX.
     * ±tiltOffset según visualTiltSign: +1 = izq. baja → der. alta; -1 = der. baja → izq. alta.
     */
    getVisualTopY(atX) {
        const ratio = this.width > 0 ? (atX - this.x) / this.width : 0;
        return this.y + ratio * this.visualTiltSign * this.tiltOffset;
    }

    /** Alias de compatibilidad con Phase 1 */
    getHeightAtX(px) { return this.getTopY(px); }

    /**
     * Extremo izquierdo del recorrido horizontal de Estrellas IA.
     * Siempre el borde del canvas: las escaleras no acortan el patrol.
     */
    getTraversalLeftEdge() {
        return 0;
    }

    /**
     * Extremo derecho del recorrido horizontal de Estrellas IA.
     * Siempre el borde del canvas: cubre zonas de escalera más allá del ancho de plataforma.
     */
    getTraversalRightEdge() {
        return Constants.CANVAS_WIDTH;
    }

    /**
     * Y de superficie para Estrellas IA en atX (extrapola inclinación fuera del ancho sólido).
     * Ignora huecos y escaleras: la estrella flota sobre la línea de plataforma.
     */
    getStarSurfaceY(atX) {
        return this.getTopY(atX);
    }

    /**
     * Devuelve true si el rango horizontal [atX, atX+width] solapa algún hueco.
     * atX y width son coordenadas ABSOLUTAS del canvas.
     */
    isHoleAt(atX, width) {
        for (const gap of this.gaps) {
            const holeLeft  = this.x + gap.x;
            const holeRight = holeLeft + gap.width;
            if (atX < holeRight && atX + width > holeLeft) return true;
        }
        return false;
    }

    /** Alias de compatibilidad con Phase 1 (comprueba solo el punto central) */
    isOverHole(px) { return this.isHoleAt(px, 0); }

    /**
     * Devuelve los segmentos sólidos como array de { x, width } en coordenadas absolutas.
     */
    getSolidSegments() {
        const segments = [];
        const sortedGaps = [...this.gaps].sort((a, b) => a.x - b.x);
        let cursor = this.x;

        for (const gap of sortedGaps) {
            const holeLeft = this.x + gap.x;
            if (holeLeft > cursor) {
                segments.push({ x: cursor, width: holeLeft - cursor });
            }
            cursor = holeLeft + gap.width;
        }
        if (cursor < this.x + this.width) {
            segments.push({ x: cursor, width: this.x + this.width - cursor });
        }
        return segments;
    }

    render(ctx) {
        if (!this.visible) return;
        ctx.save();

        const { x, width, height } = this;
        const x2 = x + width;

        // Cuerpo visual: pendiente alternada con Δy constante = tiltOffset en ambos sentidos
        const bodyLeft  = this.getVisualTopY(x);
        const bodyRight = this.getVisualTopY(x2);

        ctx.fillStyle = Constants.COLOR_PLATFORM;
        ctx.beginPath();
        ctx.moveTo(x,  bodyLeft);
        ctx.lineTo(x2, bodyRight);
        ctx.lineTo(x2, bodyRight + height);
        ctx.lineTo(x,  bodyLeft + height);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = Constants.PLATFORM_BOTTOM_STROKE_COLOR;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x,  bodyLeft + height);
        ctx.lineTo(x2, bodyRight + height);
        ctx.stroke();

        for (const gap of this.gaps) {
            const gx  = x + gap.x;
            const gx2 = gx + gap.width;
            const gy1 = this.getTopY(gx)  - Constants.PLATFORM_GAP_OVERHANG;
            const gy2 = this.getTopY(gx2) - Constants.PLATFORM_GAP_OVERHANG;

            ctx.fillStyle = Constants.COLOR_BACKGROUND;
            ctx.beginPath();
            ctx.moveTo(gx,  gy1);
            ctx.lineTo(gx2, gy2);
            ctx.lineTo(gx2, gy2 + height + Constants.PLATFORM_GAP_BOTTOM_OVERHANG);
            ctx.lineTo(gx,  gy1 + height + Constants.PLATFORM_GAP_BOTTOM_OVERHANG);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = Constants.PLATFORM_GAP_STROKE_COLOR;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(gx,  gy1);
            ctx.lineTo(gx,  gy1 + height + Constants.PLATFORM_GAP_BOTTOM_OVERHANG);
            ctx.moveTo(gx2, gy2);
            ctx.lineTo(gx2, gy2 + height + Constants.PLATFORM_GAP_BOTTOM_OVERHANG);
            ctx.stroke();
        }

        // Borde superior brillante sobre la superficie transitable real
        ctx.strokeStyle = Constants.COLOR_PLATFORM_EDGE;
        ctx.lineWidth = 2;
        ctx.shadowColor = Constants.COLOR_PLATFORM_EDGE;
        ctx.shadowBlur  = Constants.PLATFORM_EDGE_SHADOW_BLUR;
        ctx.beginPath();
        for (const seg of this.getSolidSegments()) {
            const sx  = seg.x;
            const sx2 = seg.x + seg.width;
            ctx.moveTo(sx,  this.getTopY(sx));
            ctx.lineTo(sx2, this.getTopY(sx2));
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        this._renderDirectionCue(ctx, x, x2);

        ctx.restore();
    }

    /** Flechas de avance ascendente del jugador (solo decoración) */
    _renderDirectionCue(ctx, x, x2) {
        const sign = this.visualTiltSign;
        const step = Constants.PLATFORM_CUE_STEP;
        ctx.save();
        ctx.strokeStyle = Constants.PLATFORM_CUE_STROKE_COLOR;
        ctx.fillStyle   = Constants.PLATFORM_CUE_FILL_COLOR;
        ctx.lineWidth = Constants.PLATFORM_CUE_LINE_WIDTH;

        for (let px = x + Constants.PLATFORM_CUE_START_OFFSET; px < x2 - Constants.PLATFORM_CUE_END_MARGIN; px += step) {
            const py = this.getTopY(px) - Constants.PLATFORM_CUE_Y_OFFSET;
            const tipX = px + sign * Constants.PLATFORM_CUE_TIP_OFFSET;
            ctx.beginPath();
            ctx.moveTo(px - sign * Constants.PLATFORM_CUE_BASE_OFFSET, py + 3);
            ctx.lineTo(tipX, py - 4);
            ctx.lineTo(px - sign * Constants.PLATFORM_CUE_BASE_OFFSET, py - 1);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
    }
}
