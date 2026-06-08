/**
 * CollisionSystem.js
 * Resuelve todas las colisiones del jugador contra el mundo (plataformas, huecos, escaleras)
 * y contra entidades (estrellas, esferas, interruptor).
 * NO modifica score ni vidas directamente — emite eventos.
 * Dependencias: Collision.js, Constants.js, EventBus.js
 */

class CollisionSystem {

    // ══════════════════════════════════════════════════════════════════════════
    // WORLD COLLISION (Phase 2)
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * Actualiza proximidad a escaleras antes de procesar input del jugador.
     * Llamar ANTES de Player.update() para que RF-03C se evalúe en el frame actual.
     */
    updateLadderProximity(player, ladders) {
        if (!player.active) return;
        player.nearLadder = null;
        this._checkLadderProximity(player, ladders);
    }

    /**
     * Actualiza colisiones jugador ↔ mundo.
     * Llamar DESPUÉS de PhysicsSystem.update().
     */
    updateWorld(player, platforms, ladders) {
        if (!player.active || player.isClimbing) return;

        player.setAirborne();
        player.nearLadder = null;

        // 1. Colisión con plataformas (grounding + huecos)
        this._resolvePlatforms(player, platforms);

        // 2. Proximidad a escaleras
        this._checkLadderProximity(player, ladders);
    }

    _resolvePlatforms(player, platforms) {
        const cb       = player.getCollisionBounds();
        const feetY    = cb.y + cb.height;
        const centerX  = cb.x + cb.width / 2;
        const tolerance = 8;

        for (const platform of platforms) {
            // ¿El jugador cae sobre esta plataforma?
            if (!this._canLandOn(player, platform, platforms, centerX, feetY, tolerance)) continue;

            const topY = platform.getTopY(centerX);

            // Grounded en un hueco → caída
            if (platform.isHoleAt(cb.x, cb.width)) {
                this._triggerHoleFall(player, platform, platforms);
                return;
            }

            // Aterriza en segmento sólido
            player.y = topY - player.height;
            player.setGrounded(platform);
            return;
        }
    }

    _canLandOn(player, platform, platforms, centerX, feetY, tolerance) {
        // El jugador debe estar cayendo (o ya grounded)
        if (player.velocityY < -1) return false;

        const topY = platform.getTopY(centerX);

        // Pies cerca de la superficie
        if (feetY < topY - tolerance || feetY > topY + tolerance + 10) return false;

        // Dentro del ancho horizontal de la plataforma
        if (centerX < platform.x || centerX > platform.x + platform.width) return false;

        // RF-02A / RT-09B: un salto no puede aterrizar en plataforma superior
        if (player.jumpOriginPlatform) {
            const originIdx = platforms.indexOf(player.jumpOriginPlatform);
            const targetIdx = platforms.indexOf(platform);
            if (originIdx !== -1 && targetIdx !== -1 && targetIdx > originIdx) {
                return false;
            }
        }

        return true;
    }

    _triggerHoleFall(player, platform, platforms) {
        // Buscar la plataforma inmediatamente debajo
        const belowPlatform = this._findPlatformBelow(platform, platforms);
        if (belowPlatform) {
            const cx = player.x + player.width / 2;
            player.y = belowPlatform.getTopY(cx) - player.height;
            player.setGrounded(belowPlatform);
        }
        // Emitir evento de penalización
        eventBus.emit(EventNames.PLAYER_HIT, { type: 'hole', platform });
    }

    _findPlatformBelow(current, platforms) {
        const currentY = current.y;
        let best = null;
        let bestDist = Infinity;
        for (const p of platforms) {
            if (p === current) continue;
            const dist = p.y - currentY;
            if (dist > 0 && dist < bestDist) {
                bestDist = dist;
                best     = p;
            }
        }
        return best;
    }

    /** Detecta si el jugador está cerca de la base de alguna escalera usable */
    _checkLadderProximity(player, ladders) {
        const pb = player.getBounds();
        for (const ladder of ladders) {
            if (!ladder.isUsable()) continue;
            const entry = ladder.getEntryBounds();
            if (Collision.rectOverlap(pb.x, pb.y, pb.width, pb.height,
                                       entry.x, entry.y, entry.width, entry.height)) {
                player.nearLadder = ladder;
                break;
            }
        }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // ENTITY COLLISION (Phase 1 — sin cambios)
    // ══════════════════════════════════════════════════════════════════════════

    checkPlayerStarCollisions(player, stars) {
        if (!player.active) return;
        for (const star of stars) {
            if (!star.active) continue;
            const cb = player.getCollisionBounds();
            const sb = star.getBounds();
            if (!Collision.rectOverlap(cb.x, cb.y, cb.width, cb.height,
                                       sb.x, sb.y, sb.width, sb.height)) {
                continue;
            }
            if (this.checkPlayerJumpOverStar(player, star)) continue;
            this._handlePlayerStarCollision(player, star);
        }
    }

    _handlePlayerStarCollision(player, star) {
        if (player.hasProtection()) {
            player.consumeProtection();
            star.active = false;
            eventBus.emit(EventNames.STAR_DESTROYED, { star, protection: true });
        } else {
            eventBus.emit(EventNames.PLAYER_HIT, { type: 'star', star });
            eventBus.emit(EventNames.LIFE_LOST);
        }
    }

    /**
     * RF-10: el jugador salta sobre la estrella mientras esta pasa por debajo.
     */
    checkPlayerJumpOverStar(player, star) {
        if (!player.active || !star.active || player.isClimbing) return false;
        if (player.isGrounded) return false;

        const cb = player.getCollisionBounds();
        const sb = star.getBounds();

        const horizontalOverlap = cb.x < sb.x + sb.width && cb.x + cb.width > sb.x;
        if (!horizontalOverlap) return false;

        const playerFeet = cb.y + cb.height;
        const starTop = sb.y;
        const playerAboveStar = playerFeet <= starTop + sb.height * 0.55;

        return playerAboveStar;
    }

    checkPlayerOrbCollisions(player, orbs) {
        if (!player.active) return;
        for (const orb of orbs) {
            if (!orb.active || orb.collected) continue;
            const cb = player.getCollisionBounds();
            const ob = orb.getBounds();
            if (Collision.rectCircleOverlap(cb.x, cb.y, cb.width, cb.height,
                                             ob.centerX, ob.centerY, ob.radius)) {
                this._handlePlayerOrbCollision(player, orb);
            }
        }
    }

    _handlePlayerOrbCollision(player, orb) {
        orb.collect();
        player.activateProtection();
        eventBus.emit(EventNames.ORB_COLLECTED, { orb });
    }

    checkPlayerSwitchCollision(player, switchEntity) {
        if (!player.active || !switchEntity.active || switchEntity.activated) return false;
        const cb = player.getCollisionBounds();
        const sb = switchEntity.getBounds();
        return Collision.rectOverlap(cb.x, cb.y, cb.width, cb.height,
                                      sb.x, sb.y, sb.width, sb.height);
    }

    /** Compatibilidad Fase 1 — usado en Game._handleLadderInteraction */
    checkPlayerLadderOverlap(player, ladder) {
        if (!player.active || !ladder.active) return false;
        const pb = player.getBounds();
        const lb = ladder.getBounds();
        return Collision.rectOverlap(pb.x, pb.y, pb.width, pb.height,
                                      lb.x, lb.y, lb.width, lb.height);
    }

    updateComboCounter(player, starJumpedThisFrame) {
        if (starJumpedThisFrame) player.incrementJumpCombo();
    }
}
