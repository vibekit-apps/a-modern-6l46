// Main Game Scene
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {
    this.currentLevel = data.level || 1;
  }

  create() {
    const { width, height } = this.cameras.main;
    gameState.currentLevel = this.currentLevel;

    // Background
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0x2a4a5a, 1);
    graphics.fillRect(0, 0, width, height);
    graphics.generateTexture('levelBg', width, height);
    graphics.destroy();

    this.add.image(width / 2, height / 2, 'levelBg').setOrigin(0.5);

    // Create ground
    this.physics.add.staticGroup();
    this.ground = this.physics.add.staticGroup();
    this.ground.create(width / 2, height - 40, 'tile').setScale(width / 32, 2).refreshBody();

    // Create player
    this.player = new Player(this, 100, height - 150);
    this.physics.add.collider(this.player, this.ground);

    // Create enemies and groups
    this.enemies = this.physics.add.group();
    this.collectibles = this.physics.add.group();
    this.projectiles = this.physics.add.group();

    this.particleManager = new ParticleManager(this);

    // Spawn enemies
    const levelConfig = GameConfig.LEVELS[Math.min(this.currentLevel - 1, GameConfig.LEVELS.length - 1)];
    const enemyCount = levelConfig.enemies + (gameState.playerStats.level - 1);

    for (let i = 0; i < enemyCount; i++) {
      const x = Phaser.Math.Between(400, width - 100);
      const y = Phaser.Math.Between(100, height - 200);
      const type = i % 2 === 0 ? 'GRUNT' : 'SKELETON';
      const enemy = new Enemy(this, x, y, type);
      this.enemies.add(enemy);
      this.physics.add.collider(enemy, this.ground);
    }

    // Boss spawn
    if (levelConfig.boss) {
      this.boss = new Boss(this, width - 150, height - 200);
      this.physics.add.collider(this.boss, this.ground);
    }

    // Spawn collectibles
    for (let i = 0; i < 5; i++) {
      const coin = this.physics.add.image(
        Phaser.Math.Between(200, width - 200),
        Phaser.Math.Between(100, height - 150),
        null
      );

      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xffff00, 1);
      g.fillCircle(0, 0, 6);
      g.generateTexture('coin', 12, 12);
      g.destroy();

      coin.setTexture('coin').setScale(1.5);
      coin.coinValue = 10;
      this.collectibles.add(coin);
    }

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-P', () => this.scenePause());
    this.input.keyboard.on('keydown-ESC', () => this.scenePause());

    // Colliders
    this.physics.add.overlap(this.player, this.collectibles, this.collectItem, null, this);
    this.physics.add.overlap(this.player, this.projectiles, (p, proj) => {
      this.player.takeDamage(20, this);
      proj.destroy();
    });

    // Camera
    this.cameras.main.setBounds(0, 0, width, height);
    this.cameras.main.setBackgroundColor(0x2a4a5a);

    // UI
    this.createUI();
  }

  update(time, delta) {
    if (!this.player || !this.player.active) return;

    // Player update
    this.player.update(this.cursors, this);

    // Enemy update
    this.enemies.children.entries.forEach(enemy => {
      enemy.update(this.player, this);
    });

    // Boss update
    if (this.boss && this.boss.active) {
      this.boss.update(this.player, this);
    }

    // Projectile update
    this.projectiles.children.entries.forEach(proj => {
      proj.update();
    });

    // Particle update
    this.particleManager.update(delta);

    // Win condition
    if (
      this.enemies.children.entries.length === 0 &&
      (!this.boss || !this.boss.active)
    ) {
      this.scene.start('LevelComplete', {
        level: this.currentLevel,
        xp: 100,
        gold: 500,
      });
    }

    this.updateUI();
  }

  createUI() {
    // Health bar background
    this.healthBarBg = this.add.rectangle(100, 30, 200, 20, 0x333333);
    this.healthBarBg.setScrollFactor(0);

    // Health bar foreground
    this.healthBar = this.add.rectangle(100, 30, 200, 20, 0x00ff00);
    this.healthBar.setScrollFactor(0);

    // Health text
    this.healthText = this.add.text(20, 15, '', {
      font: '16px Arial',
      color: '#ffffff',
    }).setScrollFactor(0);

    // XP text
    this.xpText = this.add.text(20, 45, '', {
      font: '14px Arial',
      color: '#ffff00',
    }).setScrollFactor(0);

    // Level text
    this.levelText = this.add.text(20, 70, '', {
      font: '14px Arial',
      color: '#ffff00',
    }).setScrollFactor(0);

    // Gold text
    this.goldText = this.add.text(this.cameras.main.width - 200, 20, '', {
      font: '16px Arial',
      color: '#ffaa00',
      align: 'right',
    }).setScrollFactor(0).setOrigin(0);

    // Enemy count
    this.enemyCountText = this.add.text(
      this.cameras.main.width - 200,
      50,
      '',
      {
        font: '14px Arial',
        color: '#ff0000',
        align: 'right',
      }
    ).setScrollFactor(0).setOrigin(0);

    // Pause hint
    this.add.text(
      this.cameras.main.width - 200,
      this.cameras.main.height - 30,
      'Press P to pause',
      {
        font: '12px Arial',
        color: '#666666',
        align: 'right',
      }
    ).setScrollFactor(0).setOrigin(0, 1);
  }

  updateUI() {
    const healthPercent = this.player.health / this.player.maxHealth;
    this.healthBar.width = 200 * healthPercent;
    this.healthBar.setFillStyle(healthPercent > 0.3 ? 0x00ff00 : 0xff0000);

    this.healthText.setText(`HP: ${Math.ceil(this.player.health)} / ${this.player.maxHealth}`);
    this.xpText.setText(`XP: ${this.player.xp} / ${this.player.nextLevelXp}`);
    this.levelText.setText(`Level: ${this.player.level}`);
    this.goldText.setText(`Gold: ${gameState.inventory.gold}`);
    this.enemyCountText.setText(`Enemies: ${this.enemies.children.entries.length}`);
  }

  collectItem(player, item) {
    gameState.inventory.addGold(item.coinValue || 10);
    this.particleManager.createHeal(item.x, item.y);
    AudioManager.playSound(this, 'collect');
    item.destroy();
  }

  scenePause() {
    this.scene.pause('GameScene');
    this.scene.launch('PauseMenu');
  }
}
