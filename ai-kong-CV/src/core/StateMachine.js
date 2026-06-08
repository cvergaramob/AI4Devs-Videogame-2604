/**
 * StateMachine.js
 * Máquina de estados explícita con callbacks onEnter/onExit.
 * Dependencias: EventBus.js
 */

class StateMachine {
    constructor(initialState = null) {
        this.currentState = initialState;
        this.previousState = null;
        this.states = new Map();
    }

    /**
     * Definir un estado con callbacks
     * @param {string} stateName - Nombre del estado
     * @param {Object} config - { onEnter, onExit, onUpdate }
     */
    addState(stateName, config = {}) {
        this.states.set(stateName, {
            onEnter: config.onEnter || (() => {}),
            onExit: config.onExit || (() => {}),
            onUpdate: config.onUpdate || (() => {})
        });
    }

    /**
     * Cambiar de estado
     * @param {string} newState - Nuevo estado
     * @param {*} data - Datos opcionales a pasar
     * @returns {boolean} - true si la transición fue exitosa
     */
    setState(newState, data = null) {
        if (!this.states.has(newState)) {
            console.warn(`State "${newState}" not registered in StateMachine`);
            return false;
        }

        if (this.currentState === newState) {
            return false;
        }

        // Ejecutar callback de salida del estado anterior
        if (this.currentState && this.states.has(this.currentState)) {
            this.states.get(this.currentState).onExit();
        }

        this.previousState = this.currentState;
        this.currentState = newState;

        // Ejecutar callback de entrada del nuevo estado
        this.states.get(newState).onEnter(data);

        return true;
    }

    /**
     * Obtener el estado actual
     * @returns {string|null}
     */
    getState() {
        return this.currentState;
    }

    /**
     * Obtener el estado anterior
     * @returns {string|null}
     */
    getPreviousState() {
        return this.previousState;
    }

    /**
     * Verificar si estamos en un estado específico
     * @param {string} state - Nombre del estado
     * @returns {boolean}
     */
    isState(state) {
        return this.currentState === state;
    }

    /**
     * Ejecutar update del estado actual
     * @param {number} dt - Delta time
     */
    update(dt) {
        if (this.currentState && this.states.has(this.currentState)) {
            this.states.get(this.currentState).onUpdate(dt);
        }
    }

    /**
     * Verificar si un estado está registrado
     * @param {string} stateName - Nombre del estado
     * @returns {boolean}
     */
    hasState(stateName) {
        return this.states.has(stateName);
    }
}
