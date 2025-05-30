// Colorful bubbles animation around panda - Natural floating bubbles
class PandaBubbles {
  constructor() {
    this.canvas = document.getElementById('panda-bubbles');
    this.ctx = this.canvas.getContext('2d');
    this.bubbles = [];
    this.init();
  }

  init() {
    this.resize();
    this.animate();
    
    // Create bubbles continuously
    this.bubbleInterval = setInterval(() => this.createBubble(), 800);
    
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = 200;
    this.canvas.height = 200;
  }

  createBubble() {
    // Start bubbles from bottom area (where panda would be blowing)
    const bubble = {
      x: 80 + Math.random() * 40, // Center area
      y: 180 + Math.random() * 20, // Bottom area
      size: Math.random() * 12 + 4,
      speedY: -(Math.random() * 1.5 + 0.8), // Always floating up
      speedX: (Math.random() - 0.5) * 0.8, // Gentle horizontal drift
      sway: Math.random() * 0.02 + 0.01, // Natural swaying motion
      swayOffset: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.8 + 0.3,
      life: 0, // Track bubble age for natural effects
      color: this.getRandomBubbleColor(),
      originalSpeedX: (Math.random() - 0.5) * 0.8
    };
    
    this.bubbles.push(bubble);
  }

  getRandomBubbleColor() {
    const colors = [
      '#9c27b0', // Purple
      '#673ab7', // Deep purple
      '#3f51b5', // Indigo
      '#2196f3', // Blue
      '#00bcd4', // Cyan
      '#ff4081', // Pink
      '#e91e63', // Pink
      '#8e24aa', // Medium purple
      '#5e35b1', // Deep purple-blue
      '#1e88e5'  // Medium blue
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  drawBubble(bubble) {
    this.ctx.save();
    
    // Fade out as bubble gets older and higher
    const fadeOpacity = bubble.opacity * (1 - bubble.life * 0.3);
    this.ctx.globalAlpha = Math.max(0.1, fadeOpacity);
    
    // Create radial gradient for realistic bubble effect
    const gradient = this.ctx.createRadialGradient(
      bubble.x, bubble.y, 0,
      bubble.x, bubble.y, bubble.size
    );
    gradient.addColorStop(0, bubble.color + '60');
    gradient.addColorStop(0.4, bubble.color + '40');
    gradient.addColorStop(0.8, bubble.color + '20');
    gradient.addColorStop(1, bubble.color + '10');
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Add realistic bubble highlight
    this.ctx.globalAlpha = fadeOpacity * 0.8;
    const highlightGradient = this.ctx.createRadialGradient(
      bubble.x - bubble.size * 0.3, 
      bubble.y - bubble.size * 0.3, 
      0,
      bubble.x - bubble.size * 0.3, 
      bubble.y - bubble.size * 0.3, 
      bubble.size * 0.4
    );
    highlightGradient.addColorStop(0, '#ffffff');
    highlightGradient.addColorStop(1, '#ffffff00');
    
    this.ctx.fillStyle = highlightGradient;
    this.ctx.beginPath();
    this.ctx.arc(
      bubble.x - bubble.size * 0.3, 
      bubble.y - bubble.size * 0.3, 
      bubble.size * 0.4, 
      0, Math.PI * 2
    );
    this.ctx.fill();
    
    // Add subtle rim light
    this.ctx.globalAlpha = fadeOpacity * 0.3;
    this.ctx.strokeStyle = '#ffffff40';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.arc(bubble.x, bubble.y, bubble.size - 0.5, 0, Math.PI * 2);
    this.ctx.stroke();
    
    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, 200, 200);
    
    // Update and draw bubbles
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const bubble = this.bubbles[i];
      
      // Natural floating motion
      bubble.y += bubble.speedY;
      bubble.life += 0.01;
      
      // Gentle swaying motion
      bubble.swayOffset += bubble.sway;
      bubble.x += Math.sin(bubble.swayOffset) * 0.3;
      
      // Slight horizontal drift with air currents
      bubble.x += bubble.speedX * (1 - bubble.life * 0.5);
      
      // Natural speed changes as bubble rises
      bubble.speedY *= 0.9995; // Slight deceleration
      
      // Size can grow slightly as bubble rises (like real bubbles)
      if (bubble.life < 0.5) {
        bubble.size += 0.005;
      }
      
      // Remove bubbles that are too old or off-screen
      if (bubble.y < -bubble.size - 10 || bubble.life > 3 || 
          bubble.x < -bubble.size || bubble.x > 200 + bubble.size) {
        this.bubbles.splice(i, 1);
        continue;
      }
      
      this.drawBubble(bubble);
    }
    
    requestAnimationFrame(() => this.animate());
  }
  
  // Clean up method
  destroy() {
    if (this.bubbleInterval) {
      clearInterval(this.bubbleInterval);
    }
  }
}

// Initialize bubble animation when page loads
window.addEventListener('load', function() {
  new PandaBubbles();
});
