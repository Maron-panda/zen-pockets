// Colorful bubbles animation around panda
class PandaBubbles {
  constructor() {
    this.canvas = document.getElementById('panda-bubbles');
    this.ctx = this.canvas.getContext('2d');
    this.bubbles = [];
    this.init();
  }

  init() {
    this.resize();
    this.createBubbles();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = 200;
    this.canvas.height = 200;
  }

  createBubbles() {
    const bubbleCount = 8;
    
    for (let i = 0; i < bubbleCount; i++) {
      this.bubbles.push({
        x: Math.random() * 200,
        y: Math.random() * 200,
        size: Math.random() * 8 + 3,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        opacity: Math.random() * 0.6 + 0.2,
        color: this.getRandomBubbleColor()
      });
    }
  }

  getRandomBubbleColor() {
    const colors = [
      '#ff1744', '#e91e63', '#9c27b0', '#673ab7',
      '#3f51b5', '#2196f3', '#00bcd4', '#ff4081'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  drawBubble(bubble) {
    this.ctx.save();
    this.ctx.globalAlpha = bubble.opacity;
    
    // Create radial gradient for bubble effect
    const gradient = this.ctx.createRadialGradient(
      bubble.x, bubble.y, 0,
      bubble.x, bubble.y, bubble.size
    );
    gradient.addColorStop(0, bubble.color);
    gradient.addColorStop(0.7, bubble.color + '80');
    gradient.addColorStop(1, bubble.color + '20');
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Add highlight
    this.ctx.globalAlpha = bubble.opacity * 0.6;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.arc(
      bubble.x - bubble.size * 0.3, 
      bubble.y - bubble.size * 0.3, 
      bubble.size * 0.3, 
      0, Math.PI * 2
    );
    this.ctx.fill();
    
    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, 200, 200);
    
    for (let bubble of this.bubbles) {
      bubble.x += bubble.speedX;
      bubble.y += bubble.speedY;
      
      // Bounce off edges
      if (bubble.x <= bubble.size || bubble.x >= 200 - bubble.size) {
        bubble.speedX *= -1;
      }
      if (bubble.y <= bubble.size || bubble.y >= 200 - bubble.size) {
        bubble.speedY *= -1;
      }
      
      // Keep within bounds
      bubble.x = Math.max(bubble.size, Math.min(200 - bubble.size, bubble.x));
      bubble.y = Math.max(bubble.size, Math.min(200 - bubble.size, bubble.y));
      
      this.drawBubble(bubble);
    }
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize bubble animation when page loads
window.addEventListener('load', function() {
  new PandaBubbles();
});
