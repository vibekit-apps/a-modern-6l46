// Enemy Class
class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type = 'GRUNT') {
    super(scene, x, y, null);
    scene.physics.world.enable(this);
    scene.add.existing(this);

    // Create simple enemy graphics
    const graphics = scene.make.graphics({ x, y, add: false });
    graphics.fillStyle(GameConfig.COLORS.ENEMY, 1);
    graphics.fillRect(-10, -14, 20, 28);
    graphics.generateTexture('enemy', 20, 28);
    graphics.destroy();

    this.setTexture('enemy');
    this.setBounce(0.2);

    this.type = type;
    const config = GameConfig.ENEMY[type];
    
    this.health = config.HEALTH;
    this.maxHealth = config.HEALTH;
    this.speed = config.SPEED;
    this.damage = config.DAMAGE;
    this.detectionRange = config.DETECTION_RANGE;
    this.attackRange = config.ATTACK_RANGE;
    this.attackCooldown = config.ATTACK_COOLDOWN;
    this.lastAttackTime = 0;

    this.state = 'idle'; // idle, chasing, attacking
    this.facing = 'left';
  }

  update(player, scene) {
    if (!this.active || !player.active) return;

    const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
    const now = Date.now();

    // State machine
    if (distance < this.detectionRange) {
      this.state = 'chasing';
      
      if (distance < this.attackRange && now - this.lastAttackTime > this.attackCooldown) {
        this.attack(player, scene);
        this.lastAttackTime = now;
      } else {
        this.chase(player);
      }
    } else {
      this.state = 'idle';
      this.body.setVelocity(0, 0);
    }

    // Apply gravity
    if (!this.body.touching.down) {
      this.body.velocity.y += 5; // gravity
    }
  }

  chase(player) {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    this.body.setVelocity(
      Math.cos(angle) * this.speed,
      Math.sin(angle) * this.speed * 0.3
    );

    // Face direction
    if (this.body.velocity.x > 0 && this.scaleX < 0) {
      this.scaleX *= -1;
    } else if (this.body.velocity.x < 0 && this.scaleX > 0) {
      this.scaleX *= -1;
    }
  }

  attack(player, scene) {
    player.takeDamage(this.damage, scene);
    AudioManager.playSound(scene, 'hit');
  }

  takeDamage(amount, scene) {
    this.health -= amount;
    
    if (this.health <= 0) {
      this.die(scene);
    }
  }

  die(scene) {
    // Particle effect
    if (scene.particleManager) {
      scene.particleManager.createExplosion(this.x, this.y, 'red');
    }

    const xpReward = this.type === 'GRUNT' ? 25 : 50;
    const goldReward = this.type === 'GRUNT' ? 10 : 25;
    
    scene.player.addXp(xpReward, scene);
    gameState.inventory.addGold(goldReward);

    this.destroy();
  }
}
