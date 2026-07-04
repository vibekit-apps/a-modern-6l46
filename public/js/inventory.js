// Inventory System
class Inventory {
  constructor(maxSlots = 20) {
    this.maxSlots = maxSlots;
    this.items = [];
    this.gold = 0;
    this.selectedSlot = 0;
  }

  addItem(item) {
    // Stack similar items
    const existing = this.items.find(i => i.id === item.id);
    if (existing && existing.stackable) {
      existing.quantity += item.quantity || 1;
      return true;
    }

    if (this.items.length < this.maxSlots) {
      this.items.push({
        id: item.id,
        name: item.name,
        type: item.type, // 'weapon', 'armor', 'potion', 'key'
        stats: item.stats || {},
        quantity: item.quantity || 1,
        stackable: item.stackable || false,
        rarity: item.rarity || 'common', // common, rare, epic, legendary
      });
      return true;
    }
    return false;
  }

  removeItem(index, quantity = 1) {
    if (this.items[index]) {
      if (this.items[index].stackable) {
        this.items[index].quantity -= quantity;
        if (this.items[index].quantity <= 0) {
          this.items.splice(index, 1);
        }
      } else {
        this.items.splice(index, 1);
      }
      return true;
    }
    return false;
  }

  getItem(index) {
    return this.items[index] || null;
  }

  addGold(amount) {
    this.gold += amount;
  }

  useItem(index) {
    const item = this.items[index];
    if (!item) return null;

    let effect = null;
    if (item.type === 'potion') {
      effect = {
        type: item.id,
        value: item.stats.healing || 0,
      };
      this.removeItem(index, 1);
    }
    return effect;
  }

  serialize() {
    return {
      items: this.items,
      gold: this.gold,
    };
  }

  deserialize(data) {
    this.items = data.items || [];
    this.gold = data.gold || 0;
  }
}
