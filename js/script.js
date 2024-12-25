const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();

let stars = [];
let textPositions = [];

const NUM_STARS = 800;
const STAR_RADIUS = 1;
const MOUSE_REPEL_RADIUS = 100;
const REPEL_FORCE = 8;
const FORMATION_SPEED = 0.01;

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

function assignTargets() {
  if (textPositions.length === 0) return;
  for (let i = 0; i < stars.length; i++) {
    const randPos = textPositions[Math.floor(Math.random() * textPositions.length)];
    stars[i].tx = randPos.x;
    stars[i].ty = randPos.y;
  }
}

let mouse = { x: -9999, y: -9999 };

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < stars.length; i++) {
    let s = stars[i];

    let dx = s.x - mouse.x;
    let dy = s.y - mouse.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < MOUSE_REPEL_RADIUS) {
      const force = (MOUSE_REPEL_RADIUS - dist) / MOUSE_REPEL_RADIUS;
      s.x += (dx / dist) * force * REPEL_FORCE;
      s.y += (dy / dist) * force * REPEL_FORCE;
    }

    s.x += (s.tx - s.x) * FORMATION_SPEED;
    s.y += (s.ty - s.y) * FORMATION_SPEED;

    ctx.beginPath();
    ctx.arc(s.x, s.y, STAR_RADIUS, 0, Math.PI * 2, false);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }

  requestAnimationFrame(animateStars);
}

window.addEventListener('load', () => {
  initStars();
  generateTextPositions();
  assignTargets();
  animateStars();
});

window.addEventListener('resize', () => {
  resizeCanvas();
  generateTextPositions();
  assignTargets();
});

const sections = document.querySelectorAll('.content-block');

function handleScrollAnimations() {
  const triggerBottom = window.innerHeight * 0.8;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top < triggerBottom) {
      section.classList.remove('section-hidden');
      section.classList.add('section-in-view');
    }
  });
}

window.addEventListener('scroll', handleScrollAnimations);
handleScrollAnimations();
