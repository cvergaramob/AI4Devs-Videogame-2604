/**
 * PhysicsSystem.js
 * Aplica gravedad, velocidad y límites de canvas al jugador.
 * La resolución de colisiones (plataformas, huecos) corre en CollisionSystem.
 * Dependencias: Constants.js, MathUtils.js
 */

class PhysicsSystem {
    constructor() {
        // Dejamos platforms como referencia accesible pero no la usamos aquí
        this.platforms = [];
    }

    /**
     * Aplica gravedad, actualiza posición y limita velocidad de caída.
     * Debe llamarse DESPUÉS de Player.update() y ANTES de CollisionSystem.update().
     */
    update(player, dt) {
        if (!player.active) return;

        if (!player.isClimbing) {
            // Gravedad
            let gravity = Constants.GRAVITY;
            // RF-02D: mantener salto en ascenso prolonga la fase sin superar altura máxima
            if (!player.isGrounded && player.jumpOriginPlatform &&
                player.inputJump && player.velocityY < 0) {
                gravity *= (1 - Constants.JUMP_HOLD_GRAVITY_REDUCTION);
            }
            player.velocityY += gravity * dt;

            // Tope de altura: nunca superar MAX_JUMP_HEIGHT desde el punto de despegue
            if (player.jumpMinFeetY !== null) {
                const cb = player.getCollisionBounds();
                const feetY = cb.y + cb.height;
                if (feetY < player.jumpMinFeetY) {
                    player.y += player.jumpMinFeetY - feetY;
                    if (player.velocityY < 0) player.velocityY = 0;
                }
            }

            // Velocidad terminal de caída
            if (player.velocityY > Constants.TERMINAL_VELOCITY) {
                player.velocityY = Constants.TERMINAL_VELOCITY;
            }
        } else {
            // En escalera no hay movimiento horizontal externo
            player.velocityX = 0;
        }

        // Integrar posición
        player.x += player.velocityX * dt;
        player.y += player.velocityY * dt;

        // Limitar horizontalmente al canvas
        player.x = MathUtils.clamp(player.x, 0, Constants.CANVAS_WIDTH - player.width);
    }

    /**
     * Verificar si el jugador salió por la parte inferior del canvas (derrota / caída fatal).
     * Retorna true si cayó fuera.
     */
    isOutOfBounds(player) {
        return player.y > Constants.CANVAS_HEIGHT + 20;
    }

    // ── Métodos heredados de Fase 1 mantenidos como no-ops ──────────────────
    resolvePlayerGravity() {}
    resolveHoleFall()      {}
    constrainPlayer(player) {
        player.x = MathUtils.clamp(player.x, 0, Constants.CANVAS_WIDTH - player.width);
    }
}
