// Particle Effects Manager
class ParticleManager {
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
  }

  createExplosion(x, y, color = 'red') {
    const count = Phaser.Math.Between(8, 16);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const velocity = {
        x: Math.cos(angle) * Phaser.Math.Between(150, 300),
        y: Math.sin(angle) * Phaser.Math.Between(150, 300),
      };

      const particle = {
        x,
        y,
        velocity,
        rotation: Math.random() * Math.PI * 2,
        rotationVelocity: Phaser.Math.Between(-10, 10),
        scale: 1,
        alpha: 1,
        life: 600,
        maxLife: 600,
        color,
      };

      this.particles.push(particle);
    }
  }

  createDust(x, y) {
    const count = Phaser.Math.Between(3, 8);
    for (let i = 0; i < count; i++) {
      const particle = {
        x,
        y,
        velocity: {
          x: Phaser.Math.Between(-100, 100),
          y: Phaser.Math.Between(-200, -50),
        },
        rotation: Math.random() * Math.PI * 2,
        rotationVelocity: Phaser.Math.Between(-5, 5),
        scale: Phaser.Math.Random.between(0.3, 0.8),
        alpha: 0.7,
        life: 800,
        maxLife: 800,
        color: 'gray',
      };

      this.particles.push(particle);
    }
  }

  createHeal(x, y) {
    const count = 5;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const particle = {
        x,
        y,
        velocity: {
          x: Math.cos(angle) * 100,
          y: Math.sin(angle) * 100,
        },
        rotation: 0,
        rotationVelocity: 5,
        scale: 0.6,
        alpha: 1,
        life: 700,
        maxLife: 700,
        color: 'green',
      };

      this.particles.push(particle);
    }
  }

  update(deltaTime) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      // Update physics
      p.x += p.velocity.x * (deltaTime / 1000);
      p.y += p.velocity.y * (deltaTime / 1000);
      p.velocity.y += 200 * (deltaTime / 1000); // gravity

      // Update appearance
      p.rotation += p.rotationVelocity * (deltaTime / 1000);
      p.life -= deltaTime;
      p.alpha = (p.life / p.maxLife) * 0.8;
      p.scale *= 0.99;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    this.particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      // Draw based on color
      const colorMap = {
        red: '#ff0000',
        green: '#00ff00',
        blue: '#0000ff',
        yellow: '#ffff00',
        gold: '#ffaa00',
        gray: '#aaaaaa',
      };

      ctx.fillStyle = colorMap[p.color] || '#ffffff';
      ctx.fillRect(-p.scale * 2, -p.scale * 2, p.scale * 4, p.scale * 4);

      ctx.restore();
    });
  }
}
