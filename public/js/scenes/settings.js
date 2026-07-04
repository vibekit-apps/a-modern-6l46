// Settings Scene
class SettingsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Settings' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

    // Title
    this.add.text(width / 2, 50, 'SETTINGS', {
      font: 'bold 40px Arial',
      color: '#ffff00',
      align: 'center',
    }).setOrigin(0.5);

    let yPos = 150;

    // Music Volume
    this.add.text(100, yPos, 'Music Volume:', {
      font: 'bold 20px Arial',
      color: '#ffffff',
    });

    this.createSlider(400, yPos, gameState.settings.musicVolume, (value) => {
      gameState.settings.musicVolume = value;
    });

    yPos += 80;

    // SFX Volume
    this.add.text(100, yPos, 'SFX Volume:', {
      font: 'bold 20px Arial',
      color: '#ffffff',
    });

    this.createSlider(400, yPos, gameState.settings.sfxVolume, (value) => {
      gameState.settings.sfxVolume = value;
    });

    yPos += 80;

    // Difficulty
    this.add.text(100, yPos, 'Difficulty:', {
      font: 'bold 20px Arial',
      color: '#ffffff',
    });

    const difficulties = ['EASY', 'NORMAL', 'HARD'];
    let currentDiff = difficulties.indexOf(gameState.settings.difficulty.toUpperCase());

    const diffText = this.add.text(400, yPos, difficulties[currentDiff], {
      font: '20px Arial',
      color: '#ffff00',
    }).setOrigin(0.5);

    this.add.text(320, yPos, '<', { font: '24px Arial', color: '#ffffff' })
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        currentDiff = (currentDiff - 1 + difficulties.length) % difficulties.length;
        gameState.settings.difficulty = difficulties[currentDiff].toLowerCase();
        diffText.setText(difficulties[currentDiff]);
      });

    this.add.text(480, yPos, '>', { font: '24px Arial', color: '#ffffff' })
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        currentDiff = (currentDiff + 1) % difficulties.length;
        gameState.settings.difficulty = difficulties[currentDiff].toLowerCase();
        diffText.setText(difficulties[currentDiff]);
      });

    yPos += 100;

    // Back Button
    this.createButton(width / 2, height - 100, 'BACK', () => {
      gameState.save(0);
      this.scene.start('MainMenu');
    });
  }

  createSlider(x, y, initialValue, callback) {
    const sliderWidth = 200;
    const sliderBg = this.add.rectangle(x, y, sliderWidth, 20, 0x333333);
    const sliderHandle = this.add.rectangle(x - sliderWidth / 2 + sliderWidth * initialValue, y, 20, 30, 0x4444ff);

    sliderHandle.setInteractive({ useHandCursor: true });
    let isDragging = false;

    sliderHandle.on('pointerdown', () => {
      isDragging = true;
    });

    this.input.on('pointermove', (pointer) => {
      if (isDragging) {
        const newX = Phaser.Math.Clamp(pointer.x, x - sliderWidth / 2, x + sliderWidth / 2);
        sliderHandle.x = newX;
        const value = (newX - (x - sliderWidth / 2)) / sliderWidth;
        callback(value);
      }
    });

    this.input.on('pointerup', () => {
      isDragging = false;
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
