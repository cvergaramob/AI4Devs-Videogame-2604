/**
 * Game.js
 * Bootstrap y orquestador principal del juego.
 * Dependencias: todos los módulos anteriores.
 */

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) throw new Error('Canvas element not found');

        // Renderer
        this.renderer = new Renderer(this.canvas);

        // Entidades y sistemas (se instancian vacíos; initLevel() los rellena)
        this.platforms    = [];
        this.ladders      = [];
        this.orbs         = [];
        this.player       = new Player(0, 0);
        this.ai           = new RebelAI(0, 0);
        this.switchEntity = new Switch(0, 0);

        // Sistemas
        this.physicsSystem    = new PhysicsSystem();
        this.collisionSystem  = new CollisionSystem();
        this.spawnSystem      = new SpawnSystem();
        this.ladderSystem     = new LadderSystem();
        this.protectionSystem = new ProtectionSystem();
        this.scoreSystem      = new ScoreSystem();
        this.timerSystem      = new TimerSystem();

        // UI
        this.hud            = new HUD();
        this.menuScreen     = new MenuScreen();
        this.victoryScreen  = new VictoryScreen();
        this.gameOverScreen = new GameOverScreen();

        // Game Loop (render recibe dt almacenado en _update)
        this.gameLoop = new GameLoop(
            (dt) => this._update(dt),
            () => this._render(this._dt)
        );

        // State Machine
        this.stateMachine = new StateMachine();
        this._setupStateMachine();

        // Estado de partida
        this.lives      = Constants.LIVES_INITIAL;
        this.gameActive = false;
        this._dt        = 0;

        // Secuencia de victoria in-game (RF-20)
        this.victorySequence = {
            active:  false,
            elapsed: 0
        };

        // Secuencia de pausa al perder vida (RF-04 / UX)
        this.lifeLostSequence = {
            active:          false,
            elapsed:         0,
            pendingGameOver: false
        };

        // Input global
        this._pressedKeys = new Set();
        this._setupKeyboardHandler();

        // Event listeners
        this._setupEventListeners();

        // Iniciar
        this.stateMachine.setState(Constants.GAME_STATE.MENU);
        this.gameLoop.start();
    }

    // ══════════════════════════════════════════════════════════════════════════
    // NIVEL
    // ══════════════════════════════════════════════════════════════════════════

    /** Instanciar todas las entidades del nivel desde LevelData */
    initLevel() {
        this.platforms    = LevelData.createPlatforms();
        this.ladders      = LevelData.createLadders();
        this.orbs         = LevelData.createOrbs();

        // Escaleras → LadderSystem
        this.ladderSystem.init(this.ladders);

        // Jugador en posición de spawn
        const spawn = LevelData.getPlayerSpawnPosition(this.platforms);
        this.player.init(spawn.x, spawn.y);
        this.player.lastPlatformReached = this.platforms[0];
        this.player.active  = true;
        this.player.visible = true;

        // IA rebelde
        const aiPos = LevelData.getAIPosition();
        this.ai.setPosition(aiPos.x, aiPos.y);
        this.ai.reset();

        // Interruptor
        const swPos = LevelData.getSwitchPosition();
        this.switchEntity.setPosition(swPos.x, swPos.y);
        this.switchEntity.reset();

        // Checkpoint
        this.lastCheckpointPlatform = this.platforms[0];

        // Estrellas IA necesitan referencia a plataformas para movimiento zig-zag
        this.spawnSystem.setPlatforms(this.platforms);
    }

    /** Reiniciar nivel (para retry) */
    resetLevel() {
        this.initLevel();
    }

    // ══════════════════════════════════════════════════════════════════════════
    // INPUT
    // ══════════════════════════════════════════════════════════════════════════

    _setupKeyboardHandler() {
        window.addEventListener('keydown', (e) => {
            this._pressedKeys.add(e.key);
            if (e.key === 'Escape') {
                const s = this.stateMachine.getState();
                if      (s === Constants.GAME_STATE.PLAYING) this.stateMachine.setState(Constants.GAME_STATE.PAUSED);
                else if (s === Constants.GAME_STATE.PAUSED)  this.stateMachine.setState(Constants.GAME_STATE.PLAYING);
            }
        });
        window.addEventListener('keyup', (e) => this._pressedKeys.delete(e.key));
    }

    isDown(key) { return this._pressedKeys.has(key); }

    // ══════════════════════════════════════════════════════════════════════════
    // STATE MACHINE
    // ══════════════════════════════════════════════════════════════════════════

    _setupStateMachine() {
        this.stateMachine.addState(Constants.GAME_STATE.LOADING, {
            onEnter:  () => console.log('[Game] → LOADING'),
            onUpdate: () => setTimeout(() => this.stateMachine.setState(Constants.GAME_STATE.MENU), 100)
        });

        this.stateMachine.addState(Constants.GAME_STATE.MENU, {
            onEnter:  () => { console.log('[Game] → MENU'); this.menuScreen.reset(); },
            onUpdate: (dt) => {
                this.menuScreen.update(dt);
                if (this.menuScreen.hasStarted()) this.stateMachine.setState(Constants.GAME_STATE.PLAYING);
            }
        });

        this.stateMachine.addState(Constants.GAME_STATE.PLAYING, {
            onEnter: () => {
                console.log('[Game] → PLAYING');
                if (this.stateMachine.getPreviousState() !== Constants.GAME_STATE.PAUSED) {
                    this._startGame();
                }
            },
            onUpdate: (dt) => {
                if (this.lifeLostSequence.active) {
                    this._updateLifeLostSequence(dt);
                } else if (this.victorySequence.active) {
                    this._updateVictorySequence(dt);
                } else {
                    this._updateGameplay(dt);
                }
            }
        });

        this.stateMachine.addState(Constants.GAME_STATE.PAUSED, {
            onEnter: () => { console.log('[Game] → PAUSED'); this.timerSystem.pause(); },
            onExit:  () => this.timerSystem.resume()
        });

        this.stateMachine.addState(Constants.GAME_STATE.VICTORY, {
            onEnter: () => {
                console.log('[Game] → VICTORY');
                const timeRemaining = this.timerSystem.getTimeRemaining();
                const bonuses = this.scoreSystem.getFinalBonuses(this.lives, timeRemaining);
                const baseScore = this.scoreSystem.getScore() - bonuses.total;
                const finalScore = this.scoreSystem.getScore();
                this.victoryScreen.start(
                    finalScore,
                    baseScore,
                    bonuses.lifeBonus,
                    bonuses.timeBonus,
                    this.lives,
                    timeRemaining
                );
            },
            onUpdate: (dt) => {
                this.victoryScreen.update(dt);
                if (this.victoryScreen.isSequenceComplete() && this.victoryScreen.wantsRestart()) {
                    this.victoryScreen.reset();
                    this._fullReset();
                    this.menuScreen.reset();
                    this.stateMachine.setState(Constants.GAME_STATE.MENU);
                }
            }
        });

        this.stateMachine.addState(Constants.GAME_STATE.GAME_OVER, {
            onEnter: () => {
                console.log('[Game] → GAME_OVER');
                this.gameOverScreen.show(this.scoreSystem.getScore());
            },
            onUpdate: (dt) => {
                this.gameOverScreen.update(dt);
                if (this.gameOverScreen.wantsRestart()) {
                    this.gameOverScreen.reset();
                    this._fullReset();
                    this.stateMachine.setState(Constants.GAME_STATE.PLAYING);
                }
            }
        });
    }

    // ══════════════════════════════════════════════════════════════════════════
    // EVENTOS
    // ══════════════════════════════════════════════════════════════════════════

    _setupEventListeners() {
        eventBus.on(EventNames.SWITCH_ACTIVATED, () => this._handleVictory());

        eventBus.on(EventNames.LIFE_LOST, () => this._handleLifeLost());

        // Penalización por hueco (emitida por CollisionSystem)
        eventBus.on(EventNames.PLAYER_HIT, (data) => {
            if (data && data.type === 'hole') {
                this.scoreSystem.addHolePenalty();
            }
        });

        eventBus.on(EventNames.LADDER_STATE_CHANGED, (data) => {
            // Si el jugador está trepando y la escalera pasa a DISABLED → caer a la base
            if (data.state === Constants.LADDER_STATE.DISABLED && this.player.isClimbing) {
                this._dropPlayerFromLadder();
            }
        });

        if (false) {
            eventBus.on(EventNames.TIMER_TICK, (d) => console.log(`Time: ${d.timeRemaining.toFixed(1)}`));
        }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // CICLO DE JUEGO
    // ══════════════════════════════════════════════════════════════════════════

    _startGame() {
        this.lives      = Constants.LIVES_INITIAL;
        this.gameActive = true;
        this.victorySequence.active  = false;
        this.victorySequence.elapsed = 0;
        this.lifeLostSequence.active          = false;
        this.lifeLostSequence.elapsed         = 0;
        this.lifeLostSequence.pendingGameOver = false;

        this.scoreSystem.reset();
        this.timerSystem.reset();
        this.protectionSystem.reset();
        this.spawnSystem.reset();

        this.initLevel();

        this.hud.reset();
        this.hud.setLives(this.lives);
        this.timerSystem.start();
        eventBus.emit(EventNames.GAME_START);
    }

    /** Restaura completamente el estado inicial (CA-13, RT-15) */
    _fullReset() {
        this.lives      = Constants.LIVES_INITIAL;
        this.gameActive = false;
        this.victorySequence.active  = false;
        this.victorySequence.elapsed = 0;
        this.lifeLostSequence.active          = false;
        this.lifeLostSequence.elapsed         = 0;
        this.lifeLostSequence.pendingGameOver = false;

        this.scoreSystem.reset();
        this.timerSystem.reset();
        this.protectionSystem.reset();
        this.spawnSystem.reset();

        this.player.stopCelebrating();
        this.ai.reset();
        this.switchEntity.reset();
        this.victoryScreen.reset();
        this.gameOverScreen.reset();
        this.hud.reset();

        eventBus.emit(EventNames.GAME_RESET);
    }

    _updateGameplay(dt) {
        if (!this.gameActive) return;

        // ── Sistemas globales ─────────────────────────────────────────────────
        this.timerSystem.update(dt);
        this.spawnSystem.update(dt);
        this.ladderSystem.update(dt);

        // ── Proximidad a escaleras (antes del input del jugador, RF-03C) ─────
        this.collisionSystem.updateLadderProximity(this.player, this.ladders);

        // ── Entidades ────────────────────────────────────────────────────────
        this.player.update(dt);
        this.ai.update(dt);
        this.switchEntity.update(dt);

        for (const orb  of this.orbs)                      orb.update(dt);
        for (const star of this.spawnSystem.getActiveStars()) star.update(dt);

        // ── Física → posición ────────────────────────────────────────────────
        this.physicsSystem.update(this.player, dt);

        // ── Colisión jugador ↔ mundo (plataformas + huecos + ladder proximity)
        this.collisionSystem.updateWorld(this.player, this.platforms, this.ladders);

        // ── Interacción con escaleras ────────────────────────────────────────
        this._handleLadderInteraction();

        // ── Caída fuera del canvas ───────────────────────────────────────────
        if (this.physicsSystem.isOutOfBounds(this.player)) {
            eventBus.emit(EventNames.LIFE_LOST);
        }

        // ── Saltos sobre estrellas (antes de colisión de daño, RF-10) ────────
        for (const star of this.spawnSystem.getActiveStars().slice()) {
            if (this.collisionSystem.checkPlayerJumpOverStar(this.player, star)) {
                this.player.markStarJumpedWhileAirborne();
                eventBus.emit(EventNames.STAR_JUMPED, { star });
                this.spawnSystem.destroyStar(star);
            }
        }

        // ── Colisiones con entidades ─────────────────────────────────────────
        this.collisionSystem.checkPlayerStarCollisions(this.player, this.spawnSystem.getActiveStars());
        this.collisionSystem.checkPlayerOrbCollisions(this.player, this.orbs);

        // RF-22: reiniciar combo al aterrizar sin saltar estrella en ese vuelo
        if (this.player.consumeLandingWithoutStarJump()) {
            this.scoreSystem.resetCombo();
        }

        // Interruptor
        if (this.collisionSystem.checkPlayerSwitchCollision(this.player, this.switchEntity)) {
            this.switchEntity.activate();
        }

        // Limpiar estrellas inactivas
        for (const star of this.spawnSystem.getActiveStars().slice()) {
            if (!star.active) this.spawnSystem.destroyStar(star);
        }

        // ── HUD ──────────────────────────────────────────────────────────────
        this.hud.update(dt);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // INTERACCIÓN CON ESCALERAS
    // ══════════════════════════════════════════════════════════════════════════

    _handleLadderInteraction() {
        if (this.player.isClimbing) {
            const ladder = this.player.currentLadder;
            if (!ladder) { this.player.stopClimbing(); return; }

            // Escalera se volvió inutilizable → caer a la base
            if (!ladder.isUsable()) {
                this._dropPlayerFromLadder();
                return;
            }

            // Llegó a la cima → salir a la plataforma superior
            if (this.player.y <= ladder.y) {
                // Ajustar posición a la superficie de la plataforma destino
                const destPlatform = this.platforms[ladder.connectsTo];
                if (destPlatform) {
                    const snapX  = MathUtils.clamp(
                        this.player.x,
                        destPlatform.x,
                        destPlatform.x + destPlatform.width - this.player.width
                    );
                    this.player.x = snapX;
                    this.player.y = destPlatform.getTopY(snapX + this.player.width / 2) - this.player.height;
                    this.player.setGrounded(destPlatform);
                } else {
                    this.player.y = ladder.y - this.player.height;
                }
                this.player.velocityY = 0;
                this.player.stopClimbing();
                return;
            }

            // Llegó a la base → salir a la plataforma inferior (solo al BAJAR)
            if (this.player.velocityY >= 0 &&
                this.player.y + this.player.height >= ladder.y + ladder.height + 8) {
                this.player.stopClimbing();
                return;
            }

            // Mantener al jugador centrado horizontalmente en la escalera
            this.player.x = MathUtils.clamp(
                ladder.x + ladder.width / 2 - this.player.width / 2,
                0, Constants.CANVAS_WIDTH - this.player.width
            );
            return;
        }

        // ── No está trepando: detectar inicio de escalada ───────────────────
        const wantsToClimb = this.player.inputClimbUp || this.player.inputClimbDown;
        if (!wantsToClimb) return;

        // Usar player.nearLadder seteado por CollisionSystem, o buscar manualmente
        const candidate = this.player.nearLadder || this._findNearbyLadder();
        if (!candidate || !candidate.isUsable()) return;

        this.player.setClimbing(candidate);
        // Centrar horizontalmente en la escalera
        this.player.x = MathUtils.clamp(
            candidate.x + candidate.width / 2 - this.player.width / 2,
            0, Constants.CANVAS_WIDTH - this.player.width
        );
        // Ajustar y al punto de entrada (base de la escalera) para evitar salida inmediata
        const ladderEntryY = candidate.y + candidate.height - this.player.height;
        if (this.player.y > ladderEntryY) this.player.y = ladderEntryY;
    }

    /** Busca manualmente una escalera cercana a la base (fallback) */
    _findNearbyLadder() {
        const pb = this.player.getBounds();
        for (const ladder of this.ladders) {
            if (!ladder.isUsable()) continue;
            const entry = ladder.getEntryBounds();
            if (Collision.rectOverlap(pb.x, pb.y, pb.width, pb.height,
                                       entry.x, entry.y, entry.width, entry.height)) {
                return ladder;
            }
        }
        return null;
    }

    /** Deja caer al jugador a la base de la escalera actual */
    _dropPlayerFromLadder() {
        const ladder = this.player.currentLadder;
        this.player.stopClimbing();
        if (ladder) {
            this.player.x = MathUtils.clamp(
                ladder.x + ladder.width / 2 - this.player.width / 2,
                0, Constants.CANVAS_WIDTH - this.player.width
            );
            this.player.y = ladder.y + ladder.height - this.player.height;
            this.player.velocityY = 0;
        }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // SECUENCIA DE VICTORIA IN-GAME
    // ══════════════════════════════════════════════════════════════════════════

    _startVictorySequence() {
        this.victorySequence.active  = true;
        this.victorySequence.elapsed = 0;
        this.gameActive = false;
        this.timerSystem.pause();
        this.spawnSystem.reset();

        this.ai.setGlitchIntensity(1.5);
        this.player.stopCelebrating();
        eventBus.emit(EventNames.GAME_VICTORY);
    }

    _updateVictorySequence(dt) {
        this.victorySequence.elapsed += dt;

        const t = this.victorySequence.elapsed;
        const glitchEnd = Constants.VICTORY_GLITCH_DURATION;
        const shutdownEnd = glitchEnd + Constants.VICTORY_SHUTDOWN_DURATION;
        const total = shutdownEnd + Constants.VICTORY_CELEBRATION_DURATION;

        if (t < glitchEnd) {
            this.ai.setGlitchIntensity(1.5 + (t / glitchEnd) * 2.5);
        } else if (!this.ai.isShuttingDown) {
            this.ai.startShutdown();
            this.ai.setGlitchIntensity(4);
        }

        if (t >= shutdownEnd && !this.player.isCelebrating) {
            this.player.startCelebrating();
        }

        this.ai.update(dt);
        this.switchEntity.update(dt);
        this.hud.update(dt);

        if (t >= total) {
            this.victorySequence.active = false;
            this._enterVictoryScreen();
        }
    }

    _enterVictoryScreen() {
        const timeRemaining = this.timerSystem.getTimeRemaining();
        this.scoreSystem.applyFinalBonuses(this.lives, timeRemaining);
        this.hud.update(0);
        this.stateMachine.setState(Constants.GAME_STATE.VICTORY);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // VICTORIA / DERROTA
    // ══════════════════════════════════════════════════════════════════════════

    _handleVictory() {
        if (this.victorySequence.active) return;
        this._startVictorySequence();
    }

    _handleLifeLost() {
        if (!this.gameActive || this.lifeLostSequence.active || this.victorySequence.active) return;

        this.lives--;
        this.hud.setLives(this.lives);

        this.lifeLostSequence.active          = true;
        this.lifeLostSequence.elapsed         = 0;
        this.lifeLostSequence.pendingGameOver = this.lives <= 0;
        this.timerSystem.pause();
    }

    _updateLifeLostSequence(dt) {
        this.lifeLostSequence.elapsed += dt;
        this.hud.update(dt);

        if (this.lifeLostSequence.elapsed >= Constants.LIFE_LOST_PAUSE_DURATION) {
            this._finishLifeLostSequence();
        }
    }

    _finishLifeLostSequence() {
        this.lifeLostSequence.active = false;

        if (this.lifeLostSequence.pendingGameOver) {
            this.gameActive = false;
            setTimeout(() => this.stateMachine.setState(Constants.GAME_STATE.GAME_OVER), 500);
            return;
        }

        const platform = this.player.lastPlatformReached || this.platforms[0];
        const spawn    = LevelData.getPlatformRespawnPosition(platform, this.platforms);
        this.player.setPosition(spawn.x, spawn.y);
        this.player.setGrounded(platform);
        this.player.velocityX = this.player.velocityY = 0;
        this.player.stopClimbing();
        this.timerSystem.resume();
    }

    // ══════════════════════════════════════════════════════════════════════════
    // RENDER
    // ══════════════════════════════════════════════════════════════════════════

    _update(dt) {
        this._dt = dt;
        if (this.stateMachine) this.stateMachine.update(dt);
    }

    _render(dt) {
        const ctx   = this.renderer.getContext();
        const state = this.stateMachine.getState();

        if (state === Constants.GAME_STATE.MENU) {
            this.renderer.clear(dt);
            this.menuScreen.render(ctx);

        } else if (state === Constants.GAME_STATE.PLAYING || state === Constants.GAME_STATE.PAUSED) {
            this.renderer.renderGameScene(
                this.platforms, this.ladders, this.player, this.orbs,
                this.spawnSystem.getActiveStars(), this.switchEntity, this.ai, this.hud, dt
            );

            if (this.victorySequence.active) {
                const intensity = 1 + this.victorySequence.elapsed / 2;
                this.renderer.renderVictoryCorruptionOverlay(
                    ctx, intensity, this.victorySequence.elapsed
                );
                this._renderVictoryBanner(ctx);
            }

            if (this.lifeLostSequence.active) {
                this._renderLifeLostOverlay(ctx);
            }

            this._renderFPS(ctx);
            if (state === Constants.GAME_STATE.PAUSED) this._renderPauseOverlay(ctx);

        } else if (state === Constants.GAME_STATE.VICTORY) {
            this.renderer.clear(dt);
            this.victoryScreen.render(ctx);

        } else if (state === Constants.GAME_STATE.GAME_OVER) {
            this.renderer.renderGameScene(
                this.platforms, this.ladders, this.player, this.orbs,
                this.spawnSystem.getActiveStars(), this.switchEntity, this.ai, this.hud, dt
            );
            this.gameOverScreen.render(ctx);

        } else {
            this.renderer.clear(dt);
        }
    }

    _renderLifeLostOverlay(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 10, 0.72)';
        ctx.fillRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);

        const bw = 420;
        const bh = 130;
        const bx = (Constants.CANVAS_WIDTH - bw) / 2;
        const by = (Constants.CANVAS_HEIGHT - bh) / 2;

        ctx.fillStyle   = 'rgba(10, 0, 20, 0.92)';
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeStyle = '#ff3aff';
        ctx.lineWidth   = 2;
        ctx.strokeRect(bx, by, bw, bh);

        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.font         = 'bold 36px monospace';
        ctx.fillStyle    = '#ff4466';
        ctx.fillText('VIDA PERDIDA', Constants.CANVAS_WIDTH / 2, Constants.CANVAS_HEIGHT / 2 - 22);

        ctx.font      = 'bold 18px monospace';
        ctx.fillStyle = this.lives > 0 ? '#00eeff' : '#ff8888';
        const livesMsg = this.lives === 1
            ? 'TE QUEDA 1 VIDA'
            : this.lives > 1
                ? `TE QUEDAN ${this.lives} VIDAS`
                : 'SIN VIDAS RESTANTES';
        ctx.fillText(livesMsg, Constants.CANVAS_WIDTH / 2, Constants.CANVAS_HEIGHT / 2 + 24);
        ctx.restore();
    }

    _renderPauseOverlay(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,10,0.65)';
        ctx.fillRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);

        const bw = 360, bh = 140;
        const bx = (Constants.CANVAS_WIDTH - bw) / 2;
        const by = (Constants.CANVAS_HEIGHT - bh) / 2;
        ctx.fillStyle   = 'rgba(10,0,20,0.9)';
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeStyle = '#7b2fff';
        ctx.lineWidth   = 2;
        ctx.strokeRect(bx, by, bw, bh);

        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.font         = 'bold 40px monospace';
        ctx.fillStyle    = '#00eeff';
        ctx.fillText('PAUSADO', Constants.CANVAS_WIDTH / 2, Constants.CANVAS_HEIGHT / 2 - 22);
        ctx.font      = '16px monospace';
        ctx.fillStyle = '#7b2fff';
        ctx.fillText('Presiona ESC para continuar', Constants.CANVAS_WIDTH / 2, Constants.CANVAS_HEIGHT / 2 + 24);
        ctx.restore();
    }

    _renderFPS(ctx) {
        const fps = this.gameLoop.getFPS();
        ctx.save();
        ctx.font          = '11px monospace';
        ctx.fillStyle     = fps >= 55 ? '#00ff88' : '#ff4444';
        ctx.textAlign     = 'right';
        ctx.textBaseline  = 'bottom';
        ctx.fillText(`${fps} FPS`, Constants.CANVAS_WIDTH - 8, Constants.CANVAS_HEIGHT - 6);
        ctx.restore();
    }

    _renderVictoryBanner(ctx) {
        const t = this.victorySequence.elapsed;
        ctx.save();
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.font         = 'bold 22px monospace';

        if (t < Constants.VICTORY_GLITCH_DURATION) {
            ctx.fillStyle = Constants.COLOR_AI_GLITCH_2;
            ctx.globalAlpha = 0.7 + Math.sin(t * 12) * 0.3;
            ctx.fillText('CORRUPCIÓN CRÍTICA', Constants.CANVAS_WIDTH / 2, 56);
        } else if (t < Constants.VICTORY_GLITCH_DURATION + Constants.VICTORY_SHUTDOWN_DURATION) {
            ctx.fillStyle = '#ff4444';
            ctx.globalAlpha = 0.85;
            ctx.fillText('APAGANDO IA...', Constants.CANVAS_WIDTH / 2, 56);
        } else {
            ctx.fillStyle = Constants.COLOR_TEXT_VICTORY;
            ctx.globalAlpha = 0.9;
            ctx.fillText('¡OBJETIVO CUMPLIDO!', Constants.CANVAS_WIDTH / 2, 56);
        }

        ctx.globalAlpha = 1;
        ctx.restore();
    }

    // ══════════════════════════════════════════════════════════════════════════
    // DEBUG
    // ══════════════════════════════════════════════════════════════════════════

    getDebugInfo() {
        return {
            gameState:    this.stateMachine.getState(),
            fps:          this.gameLoop.getFPS(),
            lives:        this.lives,
            score:        this.scoreSystem.getScore(),
            time:         this.timerSystem.getTimeRemaining().toFixed(1),
            activeStars:  this.spawnSystem.getActiveStars().length,
            ladderState:  this.ladderSystem.getCurrentState(),
            timeToChange: (this.ladderSystem.getTimeUntilChange() / 1000).toFixed(1) + 's',
            playerState:  this.player.state,
            playerPos:    `(${Math.round(this.player.x)}, ${Math.round(this.player.y)})`
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        window.game = new Game();
        console.log('AI Kong Phase 4 initialized');
    } catch (err) {
        console.error('Failed to initialize AI Kong:', err);
    }
});
