// Boss Class
class Boss extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, null);
    scene.physics.world.enable(this);
    scene.add.existing(this);

    // Create boss graphics
    const graphics = scene.make.graphics({ x, y, add: false });
    graphics.fillStyle(GameConfig.COLORS.BOSS, 1);
    graphics.fillRect(-20, -25, 40, 50);
    graphics.lineStyle(2, 0xffff00);
    graphics.strokeRect(-20, -25, 40, 50);
    graphics.generateTexture('boss', 40, 50);
    graphics.destroy();

    this.setTexture('boss');
    this.setBounce(0.1);

    this.health = GameConfig.BOSS.HEALTH;
    this.maxHealth = GameConfig.BOSS.HEALTH;
    this.speed = GameConfig.BOSS.SPEED;
    this.damage = GameConfig.BOSS.DAMAGE;
    this.detectionRange = GameConfig.BOSS.DETECTION_RANGE;
    this.attackRange = GameConfig.BOSS.ATTACK_RANGE;
    this.attackCooldown = GameConfig.BOSS.ATTACK_COOLDOWN;
    this.lastAttackTime = 0;

    this.state = 'idle'; // idle, chasing, attacking, preparing
    this.phase = 1; // Boss phases (1, 2, 3)
    this.actionTimer = 0;
    this.actionDuration = 3000;
  }

  update(player, scene) {
    if (!this.active || !player.active) return;

    const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
    const now = Date.now();
    
    // Update phase
    const healthPercent = this.health / this.maxHealth;
    if (healthPercent < 0.33) this.phase = 3;
    else if (healthPercent < 0.66) this.phase = 2;

    // Adjust speed and aggression based on phase
    const phaseMultiplier = 1 + (this.phase - 1) * 0.3;

    if (distance < this.detectionRange) {
      this.state = 'chasing';

      // Boss attack patterns
      if (distance < this.attackRange && now - this.lastAttackTime > this.attackCooldown / phaseMultiplier) {
        this.performAttack(player, scene);
        this.lastAttackTime = now;
      } else {
        this.chase(player, phaseMultiplier);
      }
    } else {
      this.state = 'idle';
      this.body.setVelocity(0, 0);
    }

    if (!this.body.touching.down) {
      this.body.velocity.y += 5;
    }
  }

  chase(player, multiplier = 1) {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    this.body.setVelocity(
      Math.cos(angle) * this.speed * multiplier,
      Math.sin(angle) * this.speed * multiplier * 0.3
    );

    if (this.body.velocity.x > 0 && this.scaleX < 0) {
      this.scaleX *= -1;
    } else if (this.body.velocity.x < 0 && this.scaleX > 0) {
      this.scaleX *= -1;
    }
  }

  performAttack(player, scene) {
    // Multi-phase attack pattern
    if (this.phase === 1) {
      player.takeDamage(this.damage, scene);
    } else if (this.phase === 2) {
      // Stronger attack
      player.takeDamage(this.damage * 1.2, scene);
      // Secondary ranged attack
      this.performRangedAttack(player, scene);
    } else {
      // Phase 3: Triple attack
      player.takeDamage(this.damage * 1.5, scene);
      this.performRangedAttack(player, scene);
      this.performRangedAttack(player, scene);
    }
    
    AudioManager.playSound(scene, 'hit');
  }

  performRangedAttack(player, scene) {
    // Create projectiles (simple circles)
    const projectile = new Projectile(scene, this.x, this.y, player.x, player.y);
    scene.projectiles.add(projectile);
  }

  takeDamage(amount, scene) {
    this.health -= amount;
    
    // Screen shake on damage
    scene.cameras.main.shake(300, 0.015);
    
    if (this.health <= 0) {
      this.die(scene);
    }
  }

  die(scene) {
    if (scene.particleManager) {
      scene.particleManager.createExplosion(this.x, this.y, 'gold');
    }

    const xpReward = 500;
    const goldReward = 500;
    
    scene.player.addXp(xpReward, scene);
    gameState.inventory.addGold(goldReward);

    // Trigger level complete
    scene.scene.start('LevelComplete', { 
      level: gameState.currentLevel,
      xp: xpReward,
      gold: goldReward
    });
  }
}

// Projectile Class
class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, startX, startY, targetX, targetY) {
    super(scene, startX, startY, null);
    scene.physics.world.enable(this);
    scene.add.existing(this);

    const graphics = scene.make.graphics({ x: startX, y: startY, add: false });
    graphics.fillStyle(0xff6600, 1);
    graphics.fillCircle(0, 0, 6);
    graphics.generateTexture('projectile', 12, 12);
    graphics.destroy();

    this.setTexture('projectile');
    this.setScale(0.5);

    const angle = Phaser.Math.Angle.Between(startX, startY, targetX, targetY);
    const speed = 250;
    this.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    this.lifespan = 5000;
    this.createdAt = Date.now();
  }

  update() {
    if (Date.now() - this.createdAt > this.lifespan) {
      this.destroy();
    }
  }
}
