// Player Class
class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, null);
    scene.physics.world.enable(this);
    scene.add.existing(this);

    // Create simple player graphics
    const graphics = scene.make.graphics({ x, y, add: false });
    graphics.fillStyle(GameConfig.COLORS.PLAYER, 1);
    graphics.fillRect(-12, -16, 24, 32);
    graphics.generateTexture('player', 24, 32);
    graphics.destroy();

    this.setTexture('player');
    this.setScale(1);
    this.setBounce(0.1);

    // Stats
    this.health = GameConfig.PLAYER.MAX_HEALTH;
    this.maxHealth = GameConfig.PLAYER.MAX_HEALTH;
    this.stamina = GameConfig.PLAYER.MAX_STAMINA;
    this.maxStamina = GameConfig.PLAYER.MAX_STAMINA;
    this.xp = 0;
    this.level = 1;
    this.nextLevelXp = 100;

    // State
    this.isAttacking = false;
    this.attackCooldown = 0;
    this.dashCooldown = 0;
    this.facing = 'right';
    this.onGround = false;

    // Animation speed
    this.moveSpeed = GameConfig.PLAYER.SPEED;
  }

  update(cursors, scene) {
    if (!this.active) return;

    let velocityX = 0;
    let velocityY = this.body.velocity.y;

    // Keyboard input
    if (cursors.left.isDown || scene.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.A].isDown) {
      velocityX = -this.moveSpeed;
      this.facing = 'left';
      if (this.scaleX > 0) this.scaleX *= -1;
    } else if (cursors.right.isDown || scene.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.D].isDown) {
      velocityX = this.moveSpeed;
      this.facing = 'right';
      if (this.scaleX < 0) this.scaleX *= -1;
    }

    // Jumping
    if (cursors.up.isDown && this.onGround && this.body.touching.down) {
      velocityY = GameConfig.PLAYER.JUMP_VELOCITY;
      AudioManager.playSound(scene, 'jump');
      this.onGround = false;
    }

    // Dashing
    if (scene.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.SPACE].isDown && this.dashCooldown <= 0 && this.stamina >= 20) {
      velocityX = this.facing === 'right' ? GameConfig.PLAYER.DASH_SPEED : -GameConfig.PLAYER.DASH_SPEED;
      this.stamina -= 20;
      this.dashCooldown = 500;
    }

    // Attacking
    if (scene.input.activePointer.isDown && !this.isAttacking && this.attackCooldown <= 0) {
      this.attack(scene);
      AudioManager.playSound(scene, 'hit');
      this.attackCooldown = 600;
    }

    this.body.setVelocity(velocityX, velocityY);

    // Stamina regeneration
    if (!cursors.left.isDown && !cursors.right.isDown && !scene.input.activePointer.isDown) {
      this.stamina = Math.min(this.maxStamina, this.stamina + 0.5);
    }

    // Cooldown timers
    if (this.attackCooldown > 0) this.attackCooldown -= 16;
    if (this.dashCooldown > 0) this.dashCooldown -= 16;

    // Ground detection
    this.onGround = this.body.touching.down;
  }

  attack(scene) {
    this.isAttacking = true;
    const attackRange = 50;
    const enemies = scene.enemies.getChildren();
    
    enemies.forEach(enemy => {
      const distance = Phaser.Math.Distance.Between(
        this.x, this.y, enemy.x, enemy.y
      );
      if (distance < attackRange) {
        enemy.takeDamage(15, scene);
        // Knockback
        const angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
        enemy.body.velocity.x = Math.cos(angle) * 200;
        enemy.body.velocity.y = Math.sin(angle) * 200;
      }
    });

    this.isAttacking = false;
  }

  takeDamage(amount, scene) {
    this.health -= amount;
    AudioManager.playSound(scene, 'hit');
    
    // Screen shake
    scene.cameras.main.shake(200, 0.01);
    
    if (this.health <= 0) {
      this.health = 0;
      scene.scene.start('GameOver', { level: gameState.currentLevel, gold: gameState.inventory.gold });
    }
  }

  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  addXp(amount, scene) {
    this.xp += amount;
    if (this.xp >= this.nextLevelXp) {
      this.levelUp(scene);
    }
  }

  levelUp(scene) {
    this.level++;
    this.xp = 0;
    this.nextLevelXp = Math.floor(this.nextLevelXp * 1.5);
    this.maxHealth += 20;
    this.health = this.maxHealth;
    this.maxStamina += 10;
    this.stamina = this.maxStamina;
    AudioManager.playSound(scene, 'levelup');
  }

  serialize() {
    return {
      x: this.x,
      y: this.y,
      health: this.health,
      stamina: this.stamina,
      xp: this.xp,
      level: this.level,
    };
  }
}
