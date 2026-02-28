// === CURSOR ===
const cursor = document.getElementById('cursor');
const dot = document.getElementById('cursor-dot');
let mx = -100, my = -100, cx = -100, cy = -100;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top = my + 'px';
  document.body.classList.add('cursor-ready');
});

// Smooth cursor follow
function animateCursor() {
  cx += (mx - cx) * 0.12;
  cy += (my - cy) * 0.12;
  cursor.style.left = cx + 'px';
  cursor.style.top = cy + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover state on interactive elements
document.querySelectorAll('a, button, .bento-card, .service-card, .connect-link').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// === NAV SCROLL ===
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// === MOBILE MENU ===
const burger = document.getElementById('burger');
const menu = document.getElementById('mobile-menu');
let menuOpen = false;
burger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  menu.classList.toggle('open', menuOpen);
  burger.style.opacity = menuOpen ? '0.5' : '1';
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    menu.classList.remove('open');
    burger.style.opacity = '1';
  });
});

// === SCROLL REVEAL ===
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

// Stagger bento cards
document.querySelectorAll('.bento-card').forEach((el, i) => {
  el.dataset.delay = i * 80;
});
document.querySelectorAll('.tl-item').forEach((el, i) => {
  el.dataset.delay = i * 100;
});
document.querySelectorAll('.service-card').forEach((el, i) => {
  el.dataset.delay = i * 100;
});

revealEls.forEach(el => revealObserver.observe(el));

// === PARTICLE CANVAS ===
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [], mouse = { x: null, y: null };

function resize() {
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    // ✦ Aetherverse particle palette
    const roll = Math.random();
    if (roll < 0.35) this.hue = 350;       // crimson #C41E3A
    else if (roll < 0.65) this.hue = 42;   // rose-gold #D4AF77
    else if (roll < 0.85) this.hue = 270;  // violet #7C6AF7
    else this.hue = 195;                   // aether cyan
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
    // Mouse repulsion
    if (mouse.x !== null) {
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        this.vx += dx / dist * 0.3;
        this.vy += dy / dist * 0.3;
        // clamp speed
        const speed = Math.sqrt(this.vx*this.vx + this.vy*this.vy);
        if (speed > 2) { this.vx /= speed * 0.5; this.vy /= speed * 0.5; }
      }
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.opacity})`;
    ctx.fill();
  }
}

function initParticles() {
  const count = Math.min(Math.floor(W * H / 10000), 120);
  particles = Array.from({ length: count }, () => new Particle());
}

function drawLines() {
  const maxDist = 130;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < maxDist) {
        const alpha = (1 - dist / maxDist) * 0.12;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(212, 175, 119, ${alpha})`; // rose-gold aether lines
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animate);
}

const heroSection = document.querySelector('.hero');
if (canvas && heroSection) {
  resize();
  initParticles();
  animate();
  window.addEventListener('resize', () => { resize(); initParticles(); });
  heroSection.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  heroSection.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
}

// === MAGNETIC BUTTONS ===
document.querySelectorAll('.mag-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.25;
    const dy = (e.clientY - cy) * 0.25;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// === NAV ACTIVE STATE ===
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => activeObserver.observe(s));

// === SMOOTH SCROLL ===
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ✦ AETHERVERSE — Phase 0 additions

// Inject Aetherverse cross-nav footer on all pages
(function injectAetherNav() {
  if (document.querySelector('.aether-nav')) return;
  const nav = document.createElement('nav');
  nav.className = 'aether-nav';
  nav.setAttribute('aria-label', 'Aetherverse');
  nav.innerHTML = `
    <a href="https://mellowambience.github.io" class="aether-nav__logo">
      <span aria-hidden="true">🌹</span>
      <span>AetherHaven</span>
    </a>
    <ul class="aether-nav__links">
      <li><a href="https://humanpalette.vercel.app">HumanPalette</a></li>
      <li><a href="https://discord.gg/chThdcdN">Discord</a></li>
      <li><a href="https://linktr.ee/1aether1rose1">✦ Links</a></li>
    </ul>
  `;
  document.body.appendChild(nav);
})();

// ✦ Hidden easter egg: click the nav logo rose → aether whisper
document.addEventListener('DOMContentLoaded', () => {
  const logo = document.querySelector('.nav-logo, .aether-nav__logo');
  if (!logo) return;
  let clicks = 0;
  logo.addEventListener('click', (e) => {
    clicks++;
    if (clicks === 3) {
      clicks = 0;
      // Flash fracture effect
      const flash = document.createElement('div');
      flash.style.cssText = 'position:fixed;inset:0;background:rgba(196,30,58,0.06);pointer-events:none;z-index:99998;animation:aether-flash 0.6s ease forwards;';
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 700);
      console.log('%c✦ you found the forge ✦', 'color:#D4AF77;font-family:serif;font-size:16px;');
    }
  });
});

// CSS for flash animation (injected once)
const aetherStyle = document.createElement('style');
aetherStyle.textContent = '@keyframes aether-flash { 0%{opacity:0} 30%{opacity:1} 100%{opacity:0} }';
document.head.appendChild(aetherStyle);
