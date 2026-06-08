/**
 * GameLoop.js
 * Loop principal del juego con requestAnimationFrame y delta time.
 * Responsabilidad: mantener 60 FPS, calcular dt, coordinar update/render.
 * Dependencias: Constants.js
 */

class GameLoop {
    constructor(updateCallback, renderCallback) {
        this.updateCallback = updateCallback;
        this.renderCallback = renderCallback;
        this.isRunning = false;
        this.lastTime = 0;
        this.deltaTime = 0;
        this.fps = Constants.TARGET_FPS;
        this.frameCount = 0;
        this.fpsCheckTime = 0;
        this.animationFrameId = null;
    }

    /**
     * Iniciar el loop
     */
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        this.fpsCheckTime = performance.now();
        this.frameCount = 0;
        this._loop();
    }

    /**
     * Pausar el loop
     */
    pause() {
        if (!this.isRunning) return;
        this.isRunning = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * Reanudar el loop
     */
    resume() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        this.animationFrameId = requestAnimationFrame(() => this._loop());
    }

    /**
     * Detener el loop completamente
     */
    stop() {
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * Obtener el delta time actual (en segundos)
     * @returns {number}
     */
    getDeltaTime() {
        return this.deltaTime;
    }

    /**
     * Obtener el FPS actual
     * @returns {number}
     */
    getFPS() {
        return this.fps;
    }

    /**
     * Loop privado
     */
    _loop() {
        if (!this.isRunning) return;

        const currentTime = performance.now();
        this.deltaTime = Math.min((currentTime - this.lastTime) / 1000, Constants.DELTA_TIME_CAP);
        this.lastTime = currentTime;

        // Calcular FPS cada segundo
        this.frameCount++;
        if (currentTime - this.fpsCheckTime >= Constants.FPS_CHECK_INTERVAL_MS) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.fpsCheckTime = currentTime;
        }

        if (this.updateCallback) {
            this.updateCallback(this.deltaTime);
        }
        if (this.renderCallback) {
            this.renderCallback();
        }

        this.animationFrameId = requestAnimationFrame(() => this._loop());
    }

    /**
     * Obtener información de debug del loop
     * @returns {Object}
     */
    getDebugInfo() {
        return {
            isRunning: this.isRunning,
            fps: this.fps,
            deltaTime: this.deltaTime,
            frameCount: this.frameCount
        };
    }
}
