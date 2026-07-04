// Save/Load System
class SaveData {
  constructor() {
    this.currentLevel = 1;
    this.playerStats = {
      health: GameConfig.PLAYER.MAX_HEALTH,
      maxHealth: GameConfig.PLAYER.MAX_HEALTH,
      stamina: GameConfig.PLAYER.MAX_STAMINA,
      maxStamina: GameConfig.PLAYER.MAX_STAMINA,
      xp: 0,
      level: 1,
      nextLevelXp: 100,
      x: 100,
      y: 100,
    };
    this.inventory = new Inventory();
    this.settings = {
      musicVolume: 0.7,
      sfxVolume: 0.8,
      difficulty: 'normal',
      controllerEnabled: true,
    };
  }

  save(slotIndex = 0) {
    const key = `rpg_save_${slotIndex}`;
    const data = {
      timestamp: Date.now(),
      level: this.currentLevel,
      playerStats: this.playerStats,
      inventory: this.inventory.serialize(),
      settings: this.settings,
    };
    localStorage.setItem(key, JSON.stringify(data));
  }

  load(slotIndex = 0) {
    const key = `rpg_save_${slotIndex}`;
    const data = localStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      this.currentLevel = parsed.level || 1;
      this.playerStats = parsed.playerStats || this.playerStats;
      this.inventory.deserialize(parsed.inventory);
      this.settings = parsed.settings || this.settings;
      return true;
    }
    return false;
  }

  deleteSave(slotIndex = 0) {
    const key = `rpg_save_${slotIndex}`;
    localStorage.removeItem(key);
  }

  getSaveSlots() {
    const slots = [];
    for (let i = 0; i < 3; i++) {
      const key = `rpg_save_${i}`;
      const data = localStorage.getItem(key);
      slots.push(data ? JSON.parse(data) : null);
    }
    return slots;
  }
}

const gameState = new SaveData();
