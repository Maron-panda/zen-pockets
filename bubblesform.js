// Bubble animation system
function createBubble() {
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  
  const colors = [
    'rgba(255, 255, 255, 0.6)',
    'rgba(200, 220, 255, 0.5)',
    'rgba(240, 255, 250, 0.4)',
    'rgba(255, 255, 255, 0.7)'
  ];
  
  const glow = colors[Math.floor(Math.random() * colors.length)];
  bubble.style.background = glow;
  bubble.style.boxShadow = `0 0 4px rgba(255, 255, 255, 0.5)`;
  
  const size = 8 + Math.random() * 18;
  bubble.style.left = `${40 + Math.random() * 120}px`;
  bubble.style.width = bubble.style.height = `${size}px`;
  
  const duration = 5 + Math.random() * 5;
  bubble.style.animationDuration = `${duration}s`;
  
  document.body.appendChild(bubble);
  
  setTimeout(() => { 
    bubble.remove(); 
  }, duration * 1000 + 1000);
}

// Initialize bubble animation when page loads
window.addEventListener('load', function() {
  setInterval(createBubble, 700);
});
