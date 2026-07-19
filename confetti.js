const Confetti = (() => {
  let canvas = null;
  let ctx = null;
  let animationFrameId = null;
  let particles = [];
  const colors = [
    '#f43f5e', // rose
    '#0ea5e9', // sky
    '#10b981', // emerald
    '#eab308', // yellow
    '#a855f7', // purple
    '#ff7849', // orange
    '#ec4899'  // pink
  ];

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      // Start slightly above the top of the canvas, or burst from bottom corners
      this.y = Math.random() * -canvas.height - 20;
      this.size = Math.random() * 8 + 6;
      this.speedX = Math.random() * 4 - 2;
      this.speedY = Math.random() * 5 + 4;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 4 - 2;
      this.opacity = 1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;
      // Fade out near the bottom
      if (this.y > canvas.height * 0.7) {
        this.opacity -= 0.015;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = this.color;
      // Draw rectangular confetti piece
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size / 2);
      ctx.restore();
    }
  }

  const init = (canvasElement) => {
    canvas = canvasElement;
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  };

  const resizeCanvas = () => {
    if (canvas) {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }
  };

  const loop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();
      
      // Remove dead particles
      if (p.opacity <= 0 || p.y > canvas.height) {
        particles.splice(i, 1);
      }
    }

    if (particles.length > 0) {
      animationFrameId = requestAnimationFrame(loop);
    } else {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };

  return {
    start(canvasElement, count = 120) {
      this.stop();
      init(canvasElement);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
      loop();
    },
    stop() {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      window.removeEventListener('resize', resizeCanvas);
    }
  };
})();