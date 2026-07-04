// Main Menu Scene
class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenu' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

    // Title
    this.add.text(width / 2, 80, '⚔️ 2D ACTION RPG', {
      font: 'bold 48px Arial',
      color: '#ffff00',
      align: 'center',
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(width / 2, 140, 'Defeat the monsters and save the realm', {
      font: '24px Arial',
      color: '#cccccc',
      align: 'center',
    }).setOrigin(0.5);

    // Buttons
    this.createButton(width / 2, 280, 'NEW GAME', () => {
      gameState.currentLevel = 1;
      gameState.playerStats.health = gameState.playerStats.maxHealth;
      gameState.playerStats.xp = 0;
      gameState.playerStats.level = 1;
      gameState.inventory.gold = 0;
      gameState.inventory.items = [];
      this.scene.start('GameScene', { level: 1 });
    });

    this.createButton(width / 2, 360, 'CONTINUE', () => {
      if (gameState.load(0)) {
        this.scene.start('GameScene', { level: gameState.currentLevel });
      } else {
        this.add.text(width / 2, 450, 'No save found', {
          font: '20px Arial',
          color: '#ff0000',
        }).setOrigin(0.5);
      }
    });

    this.createButton(width / 2, 440, 'SETTINGS', () => {
      this.scene.start('Settings');
    });

    this.createButton(width / 2, 520, 'EXIT', () => {
      window.location.href = 'about:blank';
    });

    // Version info
    this.add.text(width - 20, height - 20, 'v1.0.0', {
      font: '12px Arial',
      color: '#666666',
      align: 'right',
    }).setOrigin(1, 1);
  }

  createButton(x, y, label, callback) {
    const button = this.add.rectangle(x, y, 220, 50, 0x4444ff);
    button.setInteractive({ useHandCursor: true });
    button.on('pointerdown', callback);
    button.on('pointerover', () => button.setFillStyle(0x6666ff));
    button.on('pointerout', () => button.setFillStyle(0x4444ff));

    this.add.text(x, y, label, {
      font: 'bold 22px Arial',
      color: '#ffffff',
    }).setOrigin(0.5);
  }
}
