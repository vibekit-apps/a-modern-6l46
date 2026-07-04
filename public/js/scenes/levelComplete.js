// Level Complete Scene
class LevelCompleteScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelComplete' });
  }

  init(data) {
    this.level = data.level || 1;
    this.xpReward = data.xp || 0;
    this.goldReward = data.gold || 0;
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a3a2e);

    // Title
    this.add.text(width / 2, height / 2 - 150, 'LEVEL COMPLETE!', {
      font: 'bold 48px Arial',
      color: '#00ff00',
      align: 'center',
    }).setOrigin(0.5);

    // Rewards
    this.add.text(width / 2, height / 2 - 40, `XP Gained: +${this.xpReward}`, {
      font: '28px Arial',
      color: '#ffff00',
      align: 'center',
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 20, `Gold Earned: +${this.goldReward}`, {
      font: '28px Arial',
      color: '#ffaa00',
      align: 'center',
    }).setOrigin(0.5);

    // Buttons
    const totalLevels = GameConfig.LEVELS.length;
    const nextLevel = this.level < totalLevels ? this.level + 1 : totalLevels;

    this.createButton(width / 2, height / 2 + 120, nextLevel > this.level ? 'NEXT LEVEL' : 'RESTART', () => {
      if (nextLevel > this.level) {
        this.scene.start('GameScene', { level: nextLevel });
      } else {
        this.scene.start('GameScene', { level: 1 });
      }
    });

    this.createButton(width / 2, height / 2 + 190, 'MAIN MENU', () => {
      gameState.save(0);
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
