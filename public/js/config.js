// Game configuration
const GameConfig = {
  SCREEN_WIDTH: 1280,
  SCREEN_HEIGHT: 720,
  TILE_SIZE: 32,
  
  PLAYER: {
    SPEED: 150,
    DASH_SPEED: 400,
    JUMP_VELOCITY: -300,
    HEALTH: 100,
    MAX_HEALTH: 100,
    STAMINA: 100,
    MAX_STAMINA: 100,
  },

  ENEMY: {
    GRUNT: {
      HEALTH: 20,
      SPEED: 80,
      DAMAGE: 10,
      DETECTION_RANGE: 200,
      ATTACK_RANGE: 40,
      ATTACK_COOLDOWN: 1000,
    },
    SKELETON: {
      HEALTH: 35,
      SPEED: 100,
      DAMAGE: 15,
      DETECTION_RANGE: 250,
      ATTACK_RANGE: 50,
      ATTACK_COOLDOWN: 1200,
    },
  },

  BOSS: {
    HEALTH: 200,
    SPEED: 100,
    DAMAGE: 25,
    DETECTION_RANGE: 400,
    ATTACK_RANGE: 80,
    ATTACK_COOLDOWN: 1500,
  },

  LEVELS: [
    { map: 1, difficulty: 1, enemies: 5, boss: false },
    { map: 2, difficulty: 1.5, enemies: 8, boss: false },
    { map: 3, difficulty: 2, enemies: 10, boss: true },
  ],

  COLORS: {
    PLAYER: 0x00ff00,
    ENEMY: 0xff0000,
    BOSS: 0xff6600,
    COLLECTIBLE: 0xffff00,
    POWERUP: 0x00ffff,
  },
};
