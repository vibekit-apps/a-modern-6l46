// Pause Menu Scene
class PauseMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PauseMenu' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Semi-transparent overlay
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000).setAlpha(0.7).setScrollFactor(0);

    // Title
    this.add.text(width / 2, height / 2 - 150, 'PAUSED', {
      font: 'bold 48px Arial',
      color: '#ffff00',
      align: 'center',
    }).setOrigin(0.5).setScrollFactor(0);

    // Buttons
    this.createButton(width / 2, height / 2 - 50, 'RESUME', () => {
      this.scene.stop('PauseMenu');
      this.scene.resume('GameScene');
    });

    this.createButton(width / 2, height / 2 + 40, 'SAVE & QUIT', () => {
      gameState.playerStats.health = this.scene.get('GameScene').player.health;
      gameState.playerStats.xp = this.scene.get('GameScene').player.xp;
      gameState.playerStats.level = this.scene.get('GameScene').player.level;
      gameState.save(0);
      this.scene.stop('PauseMenu');
      this.scene.stop('GameScene');
      this.scene.start('MainMenu');
    });

    this.createButton(width / 2, height / 2 + 130, 'MAIN MENU', () => {
      this.scene.stop('PauseMenu');
      this.scene.stop('GameScene');
      this.scene.start('MainMenu');
    });

    this.input.keyboard.on('keydown-P', () => {
      this.scene.stop('PauseMenu');
      this.scene.resume('GameScene');
    });

    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.stop('PauseMenu');
      this.scene.resume('GameScene');
    });
  }

  createButton(x, y, label, callback) {
    const button = this.add.rectangle(x, y, 220, 50, 0x4444ff).setScrollFactor(0);
    button.setInteractive({ useHandCursor: true });
    button.on('pointerdown', callback);
    button.on('pointerover', () => button.setFillStyle(0x6666ff));
    button.on('pointerout', () => button.setFillStyle(0x4444ff));

    this.add.text(x, y, label, {
      font: 'bold 22px Arial',
      color: '#ffffff',
    }).setOrigin(0.5).setScrollFactor(0);
  }
}
