// Boot Scene - Initialize assets
class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' });
  }

  preload() {
    // Create simple UI textures
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });

    // Button texture
    graphics.fillStyle(0x4444ff, 1);
    graphics.fillRect(0, 0, 200, 50);
    graphics.lineStyle(2, 0xffffff);
    graphics.strokeRect(0, 0, 200, 50);
    graphics.generateTexture('button', 200, 50);

    // Tile texture
    graphics.clear();
    graphics.fillStyle(0x888888, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.lineStyle(1, 0x666666);
    graphics.strokeRect(0, 0, 32, 32);
    graphics.generateTexture('tile', 32, 32);

    graphics.destroy();
  }

  create() {
    this.scene.start('MainMenu');
  }
}
