/**
 * Collision.js
 * Funciones de colisión AABB (Axis-Aligned Bounding Box) puras y reutilizables.
 * Dependencias: MathUtils.js
 */

const Collision = {
    /**
     * Verificar solapamiento de dos rectángulos AABB
     * @param {number} x1 - Posición X del primer rectángulo
     * @param {number} y1 - Posición Y del primer rectángulo
     * @param {number} w1 - Ancho del primer rectángulo
     * @param {number} h1 - Alto del primer rectángulo
     * @param {number} x2 - Posición X del segundo rectángulo
     * @param {number} y2 - Posición Y del segundo rectángulo
     * @param {number} w2 - Ancho del segundo rectángulo
     * @param {number} h2 - Alto del segundo rectángulo
     * @returns {boolean}
     */
    rectOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
        return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
    },

    /**
     * Verificar si un punto está dentro de un rectángulo
     * @param {number} px - Posición X del punto
     * @param {number} py - Posición Y del punto
     * @param {number} rx - Posición X del rectángulo
     * @param {number} ry - Posición Y del rectángulo
     * @param {number} rw - Ancho del rectángulo
     * @param {number} rh - Alto del rectángulo
     * @returns {boolean}
     */
    pointInRect(px, py, rx, ry, rw, rh) {
        return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
    },

    /**
     * Verificar si un punto está en un círculo
     * @param {number} px - Posición X del punto
     * @param {number} py - Posición Y del punto
     * @param {number} cx - Centro X del círculo
     * @param {number} cy - Centro Y del círculo
     * @param {number} radius - Radio del círculo
     * @returns {boolean}
     */
    pointInCircle(px, py, cx, cy, radius) {
        const dx = px - cx;
        const dy = py - cy;
        return dx * dx + dy * dy <= radius * radius;
    },

    /**
     * Verificar solapamiento entre un rectángulo y un círculo
     * @param {number} rx - Posición X del rectángulo
     * @param {number} ry - Posición Y del rectángulo
     * @param {number} rw - Ancho del rectángulo
     * @param {number} rh - Alto del rectángulo
     * @param {number} cx - Centro X del círculo
     * @param {number} cy - Centro Y del círculo
     * @param {number} radius - Radio del círculo
     * @returns {boolean}
     */
    rectCircleOverlap(rx, ry, rw, rh, cx, cy, radius) {
        const closestX = MathUtils.clamp(cx, rx, rx + rw);
        const closestY = MathUtils.clamp(cy, ry, ry + rh);
        const dx = cx - closestX;
        const dy = cy - closestY;
        return dx * dx + dy * dy <= radius * radius;
    },

    /**
     * Obtener los datos de solapamiento entre dos rectángulos (útil para resolución de colisiones)
     * @param {number} x1
     * @param {number} y1
     * @param {number} w1
     * @param {number} h1
     * @param {number} x2
     * @param {number} y2
     * @param {number} w2
     * @param {number} h2
     * @returns {Object|null} - { overlap, overlapX, overlapY, direction }
     */
    getOverlapInfo(x1, y1, w1, h1, x2, y2, w2, h2) {
        if (!this.rectOverlap(x1, y1, w1, h1, x2, y2, w2, h2)) {
            return null;
        }

        const centerX1 = x1 + w1 / 2;
        const centerY1 = y1 + h1 / 2;
        const centerX2 = x2 + w2 / 2;
        const centerY2 = y2 + h2 / 2;

        const overlapLeft = centerX1 < centerX2 ? (x1 + w1) - x2 : (x2 + w2) - x1;
        const overlapTop = centerY1 < centerY2 ? (y1 + h1) - y2 : (y2 + h2) - y1;

        let direction = 'none';
        if (overlapLeft < overlapTop) {
            direction = centerX1 < centerX2 ? 'right' : 'left';
        } else {
            direction = centerY1 < centerY2 ? 'down' : 'up';
        }

        return {
            overlap: Math.min(overlapLeft, overlapTop),
            overlapX: overlapLeft,
            overlapY: overlapTop,
            direction: direction
        };
    },

    /**
     * Verificar si un rectángulo se encuentra sobre otro (resting on top)
     * @param {number} x1 - Posición X del rectángulo superior
     * @param {number} y1 - Posición Y del rectángulo superior
     * @param {number} w1 - Ancho del rectángulo superior
     * @param {number} h1 - Alto del rectángulo superior
     * @param {number} x2 - Posición X del rectángulo inferior
     * @param {number} y2 - Posición Y del rectángulo inferior
     * @param {number} w2 - Ancho del rectángulo inferior
     * @param {number} h2 - Alto del rectángulo inferior
     * @param {number} tolerance - Tolerancia (default 2px)
     * @returns {boolean}
     */
    isResting(x1, y1, w1, h1, x2, y2, w2, h2, tolerance = 2) {
        // El bottom del rectángulo 1 debe estar cerca del top del rectángulo 2
        const bottomY1 = y1 + h1;
        const topY2 = y2;
        const distY = Math.abs(bottomY1 - topY2);

        // Debe haber solapamiento horizontal
        const horizontalOverlap = x1 < x2 + w2 && x1 + w1 > x2;

        return distY <= tolerance && horizontalOverlap;
    }
};
