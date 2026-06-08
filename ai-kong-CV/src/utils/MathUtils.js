/**
 * MathUtils.js
 * Funciones matemáticas utilitarias reutilizables.
 * Dependencias: ninguna
 */

const MathUtils = {
    /**
     * Limitar un valor entre un mínimo y máximo
     * @param {number} value - Valor a limitar
     * @param {number} min - Mínimo
     * @param {number} max - Máximo
     * @returns {number}
     */
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    /**
     * Interpolación lineal
     * @param {number} a - Valor inicial
     * @param {number} b - Valor final
     * @param {number} t - Factor (0-1)
     * @returns {number}
     */
    lerp(a, b, t) {
        return a + (b - a) * this.clamp(t, 0, 1);
    },

    /**
     * Verificar si dos valores están cercanos
     * @param {number} a - Primer valor
     * @param {number} b - Segundo valor
     * @param {number} tolerance - Tolerancia
     * @returns {boolean}
     */
    approximately(a, b, tolerance = 0.01) {
        return Math.abs(a - b) < tolerance;
    },

    /**
     * Convertir grados a radianes
     * @param {number} degrees - Grados
     * @returns {number}
     */
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    },

    /**
     * Convertir radianes a grados
     * @param {number} radians - Radianes
     * @returns {number}
     */
    toDegrees(radians) {
        return radians * (180 / Math.PI);
    },

    /**
     * Distancia euclidiana entre dos puntos
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @returns {number}
     */
    distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    },

    /**
     * Obtener un número aleatorio entre min (inclusive) y max (exclusive)
     * @param {number} min - Mínimo
     * @param {number} max - Máximo
     * @returns {number}
     */
    random(min, max) {
        return Math.random() * (max - min) + min;
    },

    /**
     * Obtener un entero aleatorio entre min (inclusive) y max (inclusive)
     * @param {number} min - Mínimo
     * @param {number} max - Máximo
     * @returns {number}
     */
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Suavizar paso (smooth step)
     * @param {number} t - Factor (0-1)
     * @returns {number}
     */
    smoothstep(t) {
        t = this.clamp(t, 0, 1);
        return t * t * (3 - 2 * t);
    },

    /**
     * Obtener ángulo entre dos puntos (en radianes)
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @returns {number}
     */
    angle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    }
};
