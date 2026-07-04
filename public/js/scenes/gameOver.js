// Game Over Scene
class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOver' });
  }

  init(data) {
    this.level = data.level || 1;
    this.gold = data.gold || 0;
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

    // Title
    this.add.text(width / 2, height / 2 - 150, 'GAME OVER', {
      font: 'bold 64px Arial',
      color: '#ff0000',
      align: 'center',
    }).setOrigin(0.5);

    // Stats
    this.add.text(width / 2, height / 2, `Level: ${this.level}`, {
      font: '28px Arial',
      color: '#ffffff',
      align: 'center',
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 50, `Gold Collected: ${this.gold}`, {
      font: '24px Arial',
      color: '#ffaa00',
      align: 'center',
    }).setOrigin(0.5);

    // Buttons
    this.createButton(width / 2, height / 2 + 150, 'RETRY', () => {
      this.scene.start('GameScene', { level: this.level });
    });

    this.createButton(width / 2, height / 2 + 220, 'MAIN MENU', () => {
      this.scene.start('MainMenu');
    });
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
