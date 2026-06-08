/**
 * SpawnSystem.js
 * Generación periódica de Estrellas IA en la plataforma 5 (PRD RF-06).
 * Dependencias: ObjectPool, AIStar, Constants.js, EventBus.js, MathUtils.js
 */

class SpawnSystem {
    constructor() {
        this.starPool = new ObjectPool(AIStar, 20);
        this.platforms = [];
        this.timeSinceLastSpawn = 0;
        this.firstSpawn = true;
        this.initialDelay = Constants.STAR_SPAWN_INITIAL_DELAY;
        this.spawnInterval = Constants.STAR_SPAWN_INTERVAL;
        this.activeStars = [];
    }

    /** Referencia a plataformas del nivel (índices 0–4 = plataformas 1–5) */
    setPlatforms(platforms) {
        this.platforms = platforms;
    }

    update(dt) {
        this.timeSinceLastSpawn += dt;

        if (this.firstSpawn) {
            if (this.timeSinceLastSpawn >= this.initialDelay) {
                this._spawnStar();
                this.timeSinceLastSpawn = 0;
                this.firstSpawn = false;
            }
        } else if (this.timeSinceLastSpawn >= this.spawnInterval) {
            this._spawnStar();
            this.timeSinceLastSpawn = 0;
        }

        this.activeStars = this.activeStars.filter(star => star.active);
    }

    _spawnStar() {
        if (!this.platforms || this.platforms.length <= Constants.STAR_SPAWN_PLATFORM_INDEX) return;

        const platformIndex = Constants.STAR_SPAWN_PLATFORM_INDEX;
        const platform = this.platforms[platformIndex];
        const direction = Constants.STAR_DIRECTION_BY_PLATFORM[platformIndex];
        const starCount = MathUtils.randomInt(2, 4);
        const starWidth = 40;

        // Aparición en el extremo opuesto a la dirección de movimiento inicial
        const spawnX = direction < 0
            ? platform.x + platform.width - starWidth
            : platform.x;

        const centerX = spawnX + starWidth / 2;
        const spawnY = platform.getTopY(centerX) - starWidth;

        const star = this.starPool.acquire(
            spawnX, spawnY, starCount, this.platforms, platformIndex, direction
        );
        this.activeStars.push(star);
        eventBus.emit(EventNames.STAR_SPAWNED, { star });
    }

    getActiveStars() {
        return this.activeStars;
    }

    destroyStar(star) {
        this.starPool.release(star);
        const index = this.activeStars.indexOf(star);
        if (index > -1) {
            this.activeStars.splice(index, 1);
        }
        eventBus.emit(EventNames.STAR_DESTROYED, { star });
    }

    reset() {
        this.starPool.releaseAll();
        this.activeStars = [];
        this.timeSinceLastSpawn = 0;
        this.firstSpawn = true;
    }

    getDebugInfo() {
        return {
            activeStars: this.activeStars.length,
            poolAvailable: this.starPool.getAvailableCount(),
            poolInUse: this.starPool.getInUseCount(),
            timeSinceLastSpawn: this.timeSinceLastSpawn.toFixed(2)
        };
    }
}
