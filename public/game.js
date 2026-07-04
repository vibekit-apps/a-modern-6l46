// Game initialization
const config = {
  type: Phaser.Auto,
  parent: 'gameContainer',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GameConfig.SCREEN_WIDTH,
    height: GameConfig.SCREEN_HEIGHT,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: [
    BootScene,
    MainMenuScene,
    SettingsScene,
    GameScene,
    PauseMenuScene,
    GameOverScene,
    LevelCompleteScene,
  ],
  render: {
    pixelArt: true,
    antialias: false,
  },
};

const game = new Phaser.Game(config);

// Keyboard controller support
window.addEventListener('gamepadconnected', (event) => {
  console.log('Gamepad connected:', event.gamepad.id);
});

window.addEventListener('gamepaddisconnected', (event) => {
  console.log('Gamepad disconnected:', event.gamepad.id);
});

// Gamepad polling for input
function pollGamepads() {
  const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
  if (!gamepads[0]) return;

  const gp = gamepads[0];
  
  // Buttons: 0=A, 1=B, 9=Start, 8=Select
  if (gp.buttons[0].pressed) {
    // A button action (attack/menu select)
  }
  
  // Axes: 0=left stick X, 1=left stick Y
  if (Math.abs(gp.axes[0]) > 0.5) {
    // Movement
  }
}

// Game loop with gamepad support
setInterval(pollGamepads, 1000 / 60);

// Touch input support for mobile
document.addEventListener('touchstart', (e) => {
  if (!game.scene.isActive('GameScene')) return;
  
  const scene = game.scene.get('GameScene');
  if (scene && scene.player) {
    const touch = e.touches[0];
    if (touch.clientY < scene.cameras.main.height / 3) {
      // Jump area
      scene.player.body.setVelocityY(GameConfig.PLAYER.JUMP_VELOCITY);
    } else if (touch.clientX < scene.cameras.main.width / 2) {
      // Left side - move left
      scene.player.body.setVelocityX(-GameConfig.PLAYER.SPEED);
    } else {
      // Right side - move right
      scene.player.body.setVelocityX(GameConfig.PLAYER.SPEED);
    }
  }
});

console.log('🎮 Game initialized. Press P to pause during gameplay.');
