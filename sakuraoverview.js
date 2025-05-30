// Enhanced sakura animation with realistic petal shapes
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
    const petalCount = window.innerWidth < 768 ? 25 : 40;
    
    for (let i = 0; i < petalCount; i++) {
      this.petals.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height - this.canvas.height,
        size: Math.random() * 7 + 4,
        speedX: (Math.random() - 0.5) * 1.8,
        speedY: Math.random() * 1.8 + 1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 4,
        opacity: Math.random() * 0.6 + 0.3,
        color: this.getRandomPetalColor()
      });
    }
  }

  getRandomPetalColor() {
    const colors = ['#b8c5ff', '#d4b8ff'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  drawPetal(petal) {
    this.ctx.save();
    this.ctx.translate(petal.x, petal.y);
    this.ctx.rotate(petal.rotation * Math.PI / 180);
    this.ctx.globalAlpha = petal.opacity;
    
    // Draw realistic sakura petal shape
    this.ctx.fillStyle = petal.color;
    this.ctx.beginPath();
    
    // Create sakura petal shape using curves
    this.ctx.moveTo(0, -petal.size);
    this.ctx.quadraticCurveTo(petal.size * 0.8, -petal.size * 0.3, petal.size * 0.6, petal.size * 0.2);
    this.ctx.quadraticCurveTo(petal.size * 0.2, petal.size * 0.8, 0, petal.size * 0.4);
    this.ctx.quadraticCurveTo(-petal.size * 0.2, petal.size * 0.8, -petal.size * 0.6, petal.size * 0.2);
    this.ctx.quadraticCurveTo(-petal.size * 0.8, -petal.size * 0.3, 0, -petal.size);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Add subtle gradient for depth
    this.ctx.globalAlpha = petal.opacity * 0.3;
    const gradient = this.ctx.createLinearGradient(0, -petal.size, 0, petal.size);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, 'transparent');
    this.ctx.fillStyle = gradient;
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
