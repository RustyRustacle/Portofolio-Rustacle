// ============================================
// RUSTY PORTFOLIO — CHARACTER EDITION SCRIPTS
// Bubble particles · Playful interactions
// ============================================

// ── Bubble Particle Canvas ──
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H;
const particles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// Character-palette colors
const PALETTE = [
  'rgba(245,184,50,',    // yellow
  'rgba(91,189,228,',    // blue
  'rgba(245,160,192,',   // pink
  'rgba(196,168,232,',   // lavender
  'rgba(130,224,192,',   // mint
  'rgba(255,214,165,',   // peach
];

class Bubble {
  constructor() { this.reset(true); }
  reset(initial = false) {
    this.x = Math.random() * W;
    this.y = initial ? Math.random() * H : H + 30;
    this.r = Math.random() * 18 + 6;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = -(Math.random() * 0.5 + 0.2);
    this.alpha = Math.random() * 0.3 + 0.08;
    this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * 0.03 + 0.01;
  }
  update() {
    this.wobble += this.wobbleSpeed;
    this.x += this.vx + Math.sin(this.wobble) * 0.3;
    this.y += this.vy;
    if (this.y < -this.r * 2) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    // Fill
    ctx.fillStyle = this.color + (this.alpha * 0.6) + ')';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    // Rim
    ctx.strokeStyle = this.color + (this.alpha * 1.2) + ')';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Shine
    ctx.globalAlpha = this.alpha * 0.6;
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath();
    ctx.arc(this.x - this.r * 0.3, this.y - this.r * 0.3, this.r * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < 55; i++) particles.push(new Bubble());

function animate() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animate);
}
animate();

// ── Navbar scroll ──
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);

  // Highlight active nav link
  const sections = document.querySelectorAll('[id]');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    const isActive = a.getAttribute('href') === `#${current}`;
    a.style.color = isActive ? 'var(--blue-dark)' : '';
    a.style.fontWeight = isActive ? '900' : '';
  });
});

// ── Hamburger ──
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const [s1, s2, s3] = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      s1.style.transform = 'rotate(45deg) translate(5px,5px)';
      s2.style.opacity = '0';
      s3.style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      s1.style.transform = s3.style.transform = '';
      s2.style.opacity = '';
    }
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => s.style.transform = s.style.opacity = '');
  }));
}

// ── Typed text effect ──
const typedEl = document.getElementById('typed-text');
if (typedEl) {
  const PHRASES = [
    'Web3 Ecosystem Builder',
    'AI & Blockchain Strategist',
    'Startup Founder',
    'MetaMask Country Lead ID',
    'Community Growth Leader',
    'Product Innovator',
  ];
  let pIdx = 0, cIdx = 0, deleting = false;

  function type() {
    const phrase = PHRASES[pIdx];
    typedEl.textContent = deleting
      ? phrase.substring(0, cIdx--)
      : phrase.substring(0, cIdx++);

    let delay = deleting ? 38 : 65;
    if (!deleting && cIdx === phrase.length + 1) { deleting = true; delay = 2000; }
    if (deleting && cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % PHRASES.length; delay = 350; }
    setTimeout(type, delay);
  }
  type();
}

// ── Scroll-reveal: timeline & award cards ──
const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1 }
);
document.querySelectorAll('.timeline-item, .award-card').forEach(el => observer.observe(el));

// ── Profile card: 3D tilt on mouse ──
const card = document.querySelector('.profile-card');
if (card) {
  document.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(800px) rotateY(${dx * 10}deg) rotateX(${-dy * 7}deg) translateY(-8px)`;
  });
  document.addEventListener('mouseleave', () => { card.style.transform = ''; });
}

// ── Smooth scroll ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ── Soft cursor glow ──
const glow = document.createElement('div');
Object.assign(glow.style, {
  position: 'fixed', width: '280px', height: '280px',
  borderRadius: '50%', pointerEvents: 'none', zIndex: '9999',
  background: 'radial-gradient(circle, rgba(245,184,50,0.07) 0%, transparent 70%)',
  transform: 'translate(-50%,-50%)',
  transition: 'opacity 0.3s',
});
document.body.appendChild(glow);
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

// ── Skill tag: random pastel bg on hover ──
const pastelHovers = [
  ['rgba(245,184,50,0.15)', '#8a5c00'],
  ['rgba(91,189,228,0.15)', '#3481a8'],
  ['rgba(245,160,192,0.15)', '#9a3060'],
  ['rgba(196,168,232,0.15)', '#5a3090'],
  ['rgba(130,224,192,0.15)', '#1a7055'],
];
document.querySelectorAll('.skill-tag').forEach(tag => {
  const [bg, color] = pastelHovers[Math.floor(Math.random() * pastelHovers.length)];
  tag.addEventListener('mouseenter', () => {
    tag.style.background = bg;
    tag.style.color = color;
  });
  tag.addEventListener('mouseleave', () => {
    tag.style.background = '';
    tag.style.color = '';
  });
});

// ── Projects Carousel Auto-Slide ──
const projectsCarousel = document.getElementById('projects-carousel');
if (projectsCarousel) {
  let isDown = false;
  let autoSlideInterval;

  const startAutoSlide = () => {
    autoSlideInterval = setInterval(() => {
      if (!isDown) {
        const itemWidth = projectsCarousel.querySelector('.project-card').offsetWidth + 30; // 30 is the gap
        if (projectsCarousel.scrollLeft + projectsCarousel.clientWidth >= projectsCarousel.scrollWidth - 10) {
          projectsCarousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          projectsCarousel.scrollBy({ left: itemWidth, behavior: 'smooth' });
        }
      }
    }, 3000); // Change slide every 3 seconds
  };

  const stopAutoSlide = () => clearInterval(autoSlideInterval);

  projectsCarousel.addEventListener('mouseenter', stopAutoSlide);
  projectsCarousel.addEventListener('mouseleave', startAutoSlide);

  // Touch support resets
  projectsCarousel.addEventListener('touchstart', stopAutoSlide, { passive: true });
  projectsCarousel.addEventListener('touchend', startAutoSlide);

  startAutoSlide();
}
