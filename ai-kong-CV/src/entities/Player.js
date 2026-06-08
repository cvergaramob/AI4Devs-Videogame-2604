/**
 * Player.js
 * Entidad del jugador: input → velocidad. La física (gravedad, posición) corre en PhysicsSystem.
 * Dependencias: Entity.js, Constants.js, EventBus.js
 */

class Player extends Entity {
    constructor(x, y) {
        super(x, y, Constants.PLAYER_WIDTH, Constants.PLAYER_HEIGHT);
        this.velocityX = 0;
        this.velocityY = 0;
        this.state = Constants.PLAYER_STATE.IDLE;

        // Colisión
        this.isGrounded   = false;
        this.isClimbing   = false;
        this.currentLadder = null;
        this.nearLadder    = null;    // Escalera usable en proximidad (seteada por CollisionSystem)

        // Progreso de nivel
        this.lastPlatformReached = null;
        this.jumpOriginPlatform  = null;  // Plataforma desde la que se inició el salto actual
        this.jumpMinFeetY        = null;  // Tope vertical (pies) del salto en curso

        // Protección
        this.protectionActive = false;
        this.protectionTimer  = 0;

        // Combo (RF-22): racha de saltos sobre estrellas en el mismo vuelo
        this.starJumpedWhileAirborne = false;
        this.pendingLandingCheck     = false;
        this.animTime     = 0;
        this.facingRight  = true;
        this.isCelebrating = false;
        this.celebrationTime = 0;

        // Input
        this.inputLeft      = false;
        this.inputRight     = false;
        this.inputJump      = false;
        this.inputClimbUp   = false;
        this.inputClimbDown = false;
        this._jumpConsumed  = false;   // Evitar doble salto en el mismo keydown

        this._setupInput();
    }

    _setupInput() {
        window.addEventListener('keydown', (e) => this._handleKeyDown(e));
        window.addEventListener('keyup',   (e) => this._handleKeyUp(e));
    }

    _handleKeyDown(e) {
        switch (e.key.toLowerCase()) {
            case 'arrowleft': case 'a':
                this.inputLeft = true; e.preventDefault(); break;
            case 'arrowright': case 'd':
                this.inputRight = true; e.preventDefault(); break;
            case ' ':
                this.inputJump = true; e.preventDefault(); break;
            case 'arrowup':
                this.inputClimbUp = true;
                e.preventDefault(); break;
            case 'w':
                this.inputClimbUp = true; e.preventDefault(); break;
            case 's': case 'arrowdown':
                this.inputClimbDown = true; e.preventDefault(); break;
        }
    }

    _handleKeyUp(e) {
        switch (e.key.toLowerCase()) {
            case 'arrowleft': case 'a':
                this.inputLeft = false; e.preventDefault(); break;
            case 'arrowright': case 'd':
                this.inputRight = false; e.preventDefault(); break;
            case ' ':
                this.inputJump = false; e.preventDefault(); break;
            case 'arrowup':
                this.inputClimbUp = false;
                if (this.isGrounded) this._jumpConsumed = false;
                e.preventDefault(); break;
            case 'w':
                this.inputClimbUp = false; e.preventDefault(); break;
            case 's': case 'arrowdown':
                this.inputClimbDown = false; e.preventDefault(); break;
        }
    }

    /**
     * update(): solo maneja INPUT → VELOCIDAD.
     * Gravedad y movimiento de posición los aplica PhysicsSystem.
     */
    update(dt) {
        if (!this.active) return;

        if (this.isCelebrating) {
            this.celebrationTime += dt;
            this.animTime += dt;
            return;
        }

        // Dirección visual
        if (this.inputLeft)  this.facingRight = false;
        if (this.inputRight) this.facingRight = true;

        if (this.isClimbing) {
            // ── CLIMBING: velocidad vertical, sin movimiento horizontal ────────
            const climbSpeed = Constants.PLAYER_SPEED * Constants.PLAYER_CLIMB_MULTIPLIER;
            if (this.inputClimbUp)        this.velocityY = -climbSpeed;
            else if (this.inputClimbDown) this.velocityY =  climbSpeed;
            else                          this.velocityY =  0;

            this.velocityX = 0;
            this.state = Constants.PLAYER_STATE.CLIMBING;

        } else {
            // ── LIBRE: movimiento horizontal y salto ───────────────────────────
            if (this.inputLeft && this.inputRight) this.velocityX = 0;
            else if (this.inputLeft)               this.velocityX = -Constants.PLAYER_SPEED;
            else if (this.inputRight)              this.velocityX =  Constants.PLAYER_SPEED;
            else                                   this.velocityX =  0;

            // RF-02: Espacio salta en suelo. RF-03C: flecha arriba solo salta fuera de escalera activa.
            const spaceJump   = this.inputJump && this.isGrounded && !this._jumpConsumed;
            const arrowUpJump = this.inputClimbUp && this.isGrounded && !this._jumpConsumed && !this.nearLadder;
            if (spaceJump || arrowUpJump) {
                const cb = this.getCollisionBounds();
                this.velocityY     = -Constants.JUMP_FORCE;
                this.isGrounded    = false;
                this._jumpConsumed = true;
                this.jumpOriginPlatform = this.lastPlatformReached;
                this.jumpMinFeetY = (cb.y + cb.height) - Constants.MAX_JUMP_HEIGHT;
                this.starJumpedWhileAirborne = false;
                eventBus.emit(EventNames.PLAYER_JUMP);
            }

            // Estado visual
            if (!this.isGrounded)       this.state = Constants.PLAYER_STATE.JUMPING;
            else if (this.velocityX !== 0) this.state = Constants.PLAYER_STATE.WALKING;
            else                           this.state = Constants.PLAYER_STATE.IDLE;
        }

        // Animación y protección
        this.animTime += dt;
        if (this.protectionActive) {
            this.protectionTimer -= dt;
            if (this.protectionTimer <= 0) {
                this.protectionActive = false;
                eventBus.emit(EventNames.PROTECTION_EXPIRED);
            }
        }
    }

    render(ctx) {
        if (!this.visible) return;

        const cb = this.getCollisionBounds();

        // ── Aura de protección ────────────────────────────────────────────────
        if (this.protectionActive) {
            const blink = this.protectionTimer < Constants.PROTECTION_BLINK_THRESHOLD &&
                          Math.floor(Date.now() / Constants.PLAYER_PROTECTION_BLINK_MS) % 2 === 0;
            if (!blink) {
                ctx.save();
                ctx.shadowColor = Constants.COLOR_PROTECTION_AURA;
                ctx.shadowBlur  = Constants.PLAYER_AURA_SHADOW_BLUR;
                ctx.fillStyle   = Constants.COLOR_PROTECTION_AURA;
                ctx.globalAlpha = Constants.PLAYER_AURA_ALPHA;
                const pad = Constants.PLAYER_AURA_PADDING;
                ctx.fillRect(cb.x - pad, cb.y - pad, cb.width + pad * 2, cb.height + pad * 2);
                ctx.globalAlpha = 1;
                ctx.shadowBlur  = 0;
                ctx.restore();
            }
        }

        ctx.save();

        const bounceY = this.isCelebrating
            ? Math.sin(this.celebrationTime * Constants.PLAYER_CELEBRATION_BOUNCE_SPEED) * Constants.PLAYER_CELEBRATION_BOUNCE_AMP
            : 0;
        if (bounceY !== 0) {
            ctx.translate(0, bounceY);
        }

        // ── Cuerpo ────────────────────────────────────────────────────────────
        ctx.fillStyle   = Constants.COLOR_PLAYER;
        ctx.strokeStyle = Constants.COLOR_PLAYER_OUTLINE;
        ctx.lineWidth   = 2;
        ctx.fillRect(cb.x, cb.y, cb.width, cb.height);
        ctx.strokeRect(cb.x, cb.y, cb.width, cb.height);

        // ── Ojos ──────────────────────────────────────────────────────────────
        ctx.fillStyle = Constants.PLAYER_EYE_COLOR;
        const eyeY   = cb.y + Constants.PLAYER_EYE_Y_OFFSET;
        const eyeSize = Constants.PLAYER_EYE_SIZE;
        if (this.facingRight) {
            ctx.fillRect(cb.x + cb.width - 10, eyeY, eyeSize, eyeSize);
            ctx.fillRect(cb.x + cb.width - 4,  eyeY, eyeSize, eyeSize);
        } else {
            ctx.fillRect(cb.x + 1, eyeY, eyeSize, eyeSize);
            ctx.fillRect(cb.x + 7, eyeY, eyeSize, eyeSize);
        }

        // ── Pies parpadeantes al correr ───────────────────────────────────────
        if (this.isCelebrating) {
            ctx.fillStyle = Constants.COLOR_PLAYER_OUTLINE;
            const armWave = Math.sin(this.celebrationTime * Constants.PLAYER_CELEBRATION_ARM_SPEED) * Constants.PLAYER_CELEBRATION_ARM_AMP;
            ctx.fillRect(cb.x - 6, cb.y + 6 + armWave, Constants.PLAYER_ARM_W, Constants.PLAYER_ARM_H);
            ctx.fillRect(cb.x + cb.width + 1, cb.y + 6 - armWave, Constants.PLAYER_ARM_W, Constants.PLAYER_ARM_H);
        } else if (this.isGrounded && this.velocityX !== 0) {
            const legPhase = Math.floor(this.animTime * Constants.PLAYER_LEG_ANIM_SPEED) % 2;
            const legSize = Constants.PLAYER_LEG_SIZE;
            ctx.fillStyle = Constants.COLOR_PLAYER_OUTLINE;
            ctx.fillRect(cb.x + (legPhase ? 2 : 8), cb.y + cb.height - legSize, legSize, legSize);
            ctx.fillRect(cb.x + (legPhase ? 8 : 2), cb.y + cb.height - legSize, legSize, legSize);
        }

        ctx.restore();
    }

    /**
     * Hitbox de colisión reducida 6 px por cada lado (forgiving hitbox).
     */
    getCollisionBounds() {
        const r = Constants.PLAYER_HITBOX_REDUCTION;
        return {
            x:      this.x + r,
            y:      this.y + r,
            width:  this.width  - 2 * r,
            height: this.height - 2 * r
        };
    }

    // ── API pública ────────────────────────────────────────────────────────────

    setClimbing(ladder) {
        this.isClimbing    = true;
        this.currentLadder = ladder;
        this.velocityY     = 0;
        this.state         = Constants.PLAYER_STATE.CLIMBING;
    }

    stopClimbing() {
        this.isClimbing    = false;
        this.currentLadder = null;
        // Evitar salto accidental si ArrowUp sigue presionado al salir de la escalera
        this._jumpConsumed = true;
    }

    setGrounded(platform = null) {
        const wasAirborne = !this.isGrounded;
        this.isGrounded = true;
        this.velocityY  = 0;
        if (platform) this.lastPlatformReached = platform;
        this.jumpOriginPlatform = null;
        this.jumpMinFeetY       = null;
        this._jumpConsumed      = false;
        if (wasAirborne) this.pendingLandingCheck = true;
    }

    setAirborne() {
        this.isGrounded = false;
    }

    markStarJumpedWhileAirborne() {
        this.starJumpedWhileAirborne = true;
    }

    /** RF-22: reinicia combo si aterriza sin haber saltado una estrella en ese vuelo */
    consumeLandingWithoutStarJump() {
        if (!this.pendingLandingCheck) return false;
        this.pendingLandingCheck = false;
        if (this.starJumpedWhileAirborne) {
            this.starJumpedWhileAirborne = false;
            return false;
        }
        return true;
    }

    activateProtection() {
        this.protectionActive = true;
        this.protectionTimer  = Constants.PROTECTION_DURATION;
        eventBus.emit(EventNames.PROTECTION_ACTIVATED);
    }

    hasProtection()    { return this.protectionActive; }

    startCelebrating() {
        this.isCelebrating = true;
        this.celebrationTime = 0;
        this.state = Constants.PLAYER_STATE.CELEBRATING;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isClimbing = false;
        this.currentLadder = null;
        this.inputLeft = this.inputRight = this.inputJump = false;
        this.inputClimbUp = this.inputClimbDown = false;
        eventBus.emit(EventNames.PLAYER_CELEBRATION);
    }

    stopCelebrating() {
        this.isCelebrating = false;
        this.celebrationTime = 0;
        this.state = Constants.PLAYER_STATE.IDLE;
    }

    consumeProtection() {
        this.protectionActive = false;
        this.protectionTimer  = 0;
        eventBus.emit(EventNames.PROTECTION_EXPIRED);
    }

    /** Reiniciar para nueva partida */
    init(x, y) {
        super.init();
        this.setPosition(x, y);
        this.velocityX = this.velocityY = 0;
        this.state = Constants.PLAYER_STATE.IDLE;
        this.isGrounded = true;
        this.isClimbing = false;
        this.currentLadder = null;
        this.nearLadder    = null;
        this.protectionActive = false;
        this.protectionTimer  = 0;
        this.starJumpedWhileAirborne = false;
        this.pendingLandingCheck     = false;
        this.animTime    = 0;
        this.facingRight = true;
        this.isCelebrating = false;
        this.celebrationTime = 0;
        this._jumpConsumed = false;
        this.jumpOriginPlatform = null;
        this.jumpMinFeetY       = null;
    }

    reset() {
        super.reset();
        this.velocityX = this.velocityY = 0;
        this.isClimbing = false;
        this.currentLadder = null;
        this.protectionActive = false;
    }
}
