// Custom lightweight sakura animation
class SakuraAnimation {
  constructor() {
    this.canvas = document.getElementById('sakura-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.petals = [];
    this.init();
  }

  init() {
    this.resize();
    this.createPetals();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createPetals() {
    const petalCount = window.innerWidth < 768 ? 15 : 25; // Fewer petals on mobile
    
    for (let i = 0; i < petalCount; i++) {
      this.petals.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height - this.canvas.height,
        size: Math.random() * 8 + 4,
        speedX: (Math.random() - 0.5) * 2,
        speedY: Math.random() * 2 + 1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 4,
        opacity: Math.random() * 0.6 + 0.2
      });
    }
  }

  drawPetal(petal) {
    this.ctx.save();
    this.ctx.translate(petal.x, petal.y);
    this.ctx.rotate(petal.rotation * Math.PI / 180);
    this.ctx.globalAlpha = petal.opacity;
    
    // Simple petal shape
    this.ctx.fillStyle = '#ffb3d9';
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, petal.size, petal.size * 0.6, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let petal of this.petals) {
      petal.x += petal.speedX;
      petal.y += petal.speedY;
      petal.rotation += petal.rotationSpeed;
      
      // Reset petal when it goes off screen
      if (petal.y > this.canvas.height + 20) {
        petal.y = -20;
        petal.x = Math.random() * this.canvas.width;
      }
      
      if (petal.x > this.canvas.width + 20) {
        petal.x = -20;
      } else if (petal.x < -20) {
        petal.x = this.canvas.width + 20;
      }
      
      this.drawPetal(petal);
    }
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize sakura animation when page loads
window.addEventListener('load', function() {
  new SakuraAnimation();
});
