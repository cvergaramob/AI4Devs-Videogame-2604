/**
 * ObjectPool.js
 * Pool genérico para reutilizar objetos y evitar garbage collection excesivo.
 * Útil para Estrellas IA que se crean y destruyen frecuentemente.
 * Dependencias: ninguna
 */

class ObjectPool {
    constructor(ObjectClass, initialSize = 10) {
        this.ObjectClass = ObjectClass;
        this.available = [];
        this.inUse = new Set();

        // Pre-crear objetos iniciales
        for (let i = 0; i < initialSize; i++) {
            this.available.push(new ObjectClass());
        }
    }

    /**
     * Obtener un objeto del pool
     * @param {...*} args - Argumentos a pasar al constructor
     * @returns {*}
     */
    acquire(...args) {
        let obj;
        if (this.available.length > 0) {
            obj = this.available.pop();
        } else {
            obj = new this.ObjectClass();
        }

        // Inicializar si el método existe
        if (obj.init && typeof obj.init === 'function') {
            obj.init(...args);
        }

        this.inUse.add(obj);
        return obj;
    }

    /**
     * Devolver un objeto al pool
     * @param {*} obj - Objeto a devolver
     */
    release(obj) {
        if (this.inUse.has(obj)) {
            this.inUse.delete(obj);
            this.available.push(obj);

            // Limpiar si el método existe
            if (obj.reset && typeof obj.reset === 'function') {
                obj.reset();
            }
        }
    }

    /**
     * Obtener cantidad de objetos disponibles
     * @returns {number}
     */
    getAvailableCount() {
        return this.available.length;
    }

    /**
     * Obtener cantidad de objetos en uso
     * @returns {number}
     */
    getInUseCount() {
        return this.inUse.size;
    }

    /**
     * Limpiar todos los objetos
     */
    clear() {
        this.available = [];
        this.inUse.clear();
    }

    /**
     * Devolver todos los objetos en uso al pool
     */
    releaseAll() {
        const inUseArray = Array.from(this.inUse);
        inUseArray.forEach(obj => this.release(obj));
    }

    /**
     * Obtener todos los objetos en uso
     * @returns {Array}
     */
    getInUseObjects() {
        return Array.from(this.inUse);
    }

    /**
     * Expandir el pool
     * @param {number} count - Cantidad de objetos a agregar
     */
    expand(count) {
        for (let i = 0; i < count; i++) {
            this.available.push(new this.ObjectClass());
        }
    }

    /**
     * Obtener información de debug
     * @returns {Object}
     */
    getDebugInfo() {
        return {
            available: this.available.length,
            inUse: this.inUse.size,
            total: this.available.length + this.inUse.size
        };
    }
}
