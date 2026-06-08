/**
 * Entity.js
 * Clase base para todas las entidades del juego.
 * Responsabilidad: posición, dimensiones, update/render básico.
 * Dependencias: ninguna
 */

class Entity {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.visible = true;
        this.active = true;
    }

    /**
     * Actualizar la entidad
     * @param {number} dt - Delta time en segundos
     */
    update(dt) {
        // Override en subclases
    }

    /**
     * Renderizar la entidad
     * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
     */
    render(ctx) {
        // Override en subclases
    }

    /**
     * Obtener el rectángulo de colisión
     * @returns {Object} - { x, y, width, height }
     */
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    /**
     * Obtener el centro de la entidad
     * @returns {Object} - { x, y }
     */
    getCenter() {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };
    }

    /**
     * Establecer la entidad en una posición específica
     * @param {number} x
     * @param {number} y
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Mover la entidad por un offset
     * @param {number} dx
     * @param {number} dy
     */
    translate(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    /**
     * Establecer las dimensiones de la entidad
     * @param {number} width
     * @param {number} height
     */
    setDimensions(width, height) {
        this.width = width;
        this.height = height;
    }

    /**
     * Inicializar la entidad (para pools de objetos)
     */
    init() {
        this.active = true;
        this.visible = true;
    }

    /**
     * Resetear la entidad (para pools de objetos)
     */
    reset() {
        this.active = false;
        this.visible = false;
    }
}
