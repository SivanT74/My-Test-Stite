/******************************************************
 * STARFIELD + TEXT FORMATION
 *****************************************************/
const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');

// Resize the canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();

let stars = [];
let textPositions = [];

// CONFIG
const NUM_STARS = 1000;
const STAR_RADIUS = 0.8;
const MOUSE_REPEL_RADIUS = 100;
const REPEL_FORCE = 8;
const FORMATION_SPEED = 0.01;

// Initialize random stars
function initStars() {
  stars = [];
  for (let i = 0; i < NUM_STARS; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      tx: Math.random() * canvas.width,
      ty: Math.random() * canvas.height
    });
  }
}

// Generate text positions for "LOREM IPSUM"
function generateTextPositions() {
  const offCanvas = document.createElement('canvas');
  const offCtx = offCanvas.getContext('2d');
  offCanvas.width = canvas.width;
  offCanvas.height = canvas.height;

  offCtx.fillStyle = '#fff';
  offCtx.font = 'bold 150px Arial';

  const text = 'SIVAN';
  const textWidth = offCtx.measureText(text).width;
  const textX = (canvas.width - textWidth) / 2;
  const textY = canvas.height / 2 + 50;
  offCtx.fillText(text, textX, textY);

  const imageData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height).data;
  textPositions = [];

  for (let y = 0; y < offCanvas.height; y += 5) {
    for (let x = 0; x < offCanvas.width; x += 5) {
      const idx = (y * offCanvas.width + x) * 4;
      if (imageData[idx + 3] > 128) {
        textPositions.push({ x, y });
      }
    }
  }
}

// Assign random text positions to stars
function assignTargets() {
  if (textPositions.length === 0) return;
  for (let i = 0; i < stars.length; i++) {
    const randPos = textPositions[Math.floor(Math.random() * textPositions.length)];
    stars[i].tx = randPos.x;
    stars[i].ty = randPos.y;
  }
}

// Mouse
let mouse = { x: -9999, y: -9999 };

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

// Animate
function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < stars.length; i++) {
    let s = stars[i];

    // Repel from mouse
    let dx = s.x - mouse.x;
    let dy = s.y - mouse.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < MOUSE_REPEL_RADIUS) {
      const force = (MOUSE_REPEL_RADIUS - dist) / MOUSE_REPEL_RADIUS;
      s.x += (dx / dist) * force * REPEL_FORCE;
      s.y += (dy / dist) * force * REPEL_FORCE;
    }

    // Move towards text target
    s.x += (s.tx - s.x) * FORMATION_SPEED;
    s.y += (s.ty - s.y) * FORMATION_SPEED;

    // Draw star
    ctx.beginPath();
    ctx.arc(s.x, s.y, STAR_RADIUS, 0, Math.PI * 2, false);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }

  requestAnimationFrame(animateStars);
}

// On load
window.addEventListener('load', () => {
  initStars();
  generateTextPositions();
  assignTargets();
  animateStars();
});

// On resize => recalc canvas & text positions => reassign star targets
window.addEventListener('resize', () => {
  resizeCanvas();
  generateTextPositions();
  assignTargets();
});

/******************************************************
 * SCROLL-BASED SECTION ANIMATIONS
 *****************************************************/
const sections = document.querySelectorAll('.content-block');

function handleScrollAnimations() {
  // We'll say it's "in view" if top < 80% of the viewport
  const triggerBottom = window.innerHeight * 0.8;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top < triggerBottom) {
      // Remove the .section-hidden, add .section-in-view
      section.classList.remove('section-hidden');
      section.classList.add('section-in-view');
    }
  });
}

// Listen for scroll, run once on load too
window.addEventListener('scroll', handleScrollAnimations);
handleScrollAnimations();
