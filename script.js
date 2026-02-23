(() => {
  /* ==================== 1. Canvas Particle System ==================== */
  const hero = document.getElementById('hero') || document.body;
  const canvas = document.createElement('canvas');
  canvas.id = 'hero-canvas';
  canvas.style.position = 'absolute';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  hero.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const config = {
    particleCount: 120,
    maxVelocity: 0.6,
    linkDistance: 120,
    particleSize: { min: 1.5, max: 3 },
    color: '#9b59b6', // subtle purple
    mouseRadius: 100,
    mouseForce: 0.15,
  };

  let particles = [];
  let mouse = { x: null, y: null, active: false };

  const resizeCanvas = () => {
    canvas.width = hero.clientWidth;
    canvas.height = hero.clientHeight;
  };
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      const speed = Math.random() * config.maxVelocity;
      const angle = Math.random() * Math.PI * 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.radius = Math.random() * (config.particleSize.max - config.particleSize.min) + config.particleSize.min;
    }
    update() {
      // mouse repulsion
      if (mouse.active) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < config.mouseRadius && dist > 0) {
          const force = (config.mouseRadius - dist) / config.mouseRadius * config.mouseForce;
          this.vx += (dx / dist) * force;
          this.vy += (dy / dist) * force;
        }
      }

      this.x += this.vx;
      this.y += this.vy;

      // bounce off edges
      if (this.x <= 0 || this.x >= canvas.width) this.vx *= -1;
      if (this.y <= 0 || this.y >= canvas.height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = config.color;
      ctx.fill();
    }
  }

  const initParticles = () => {
    particles = [];
    for (let i = 0; i < config.particleCount; i++) particles.push(new Particle());
  };
  initParticles();

  const drawLines = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < config.linkDistance) {
          const opacity = 1 - dist / config.linkDistance;
          ctx.strokeStyle = `rgba(155,89,182,${opacity * 0.4})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
  };

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    drawLines();
    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);

  // mouse tracking
  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });
  hero.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  /* ==================== 2. Intersection Observer Scroll Reveal ==================== */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ==================== 3. Typing Effect ==================== */
  const typingEl = document.getElementById('typing-cmd');
  const typingTexts = [
    "building MIST v0.4 — gemini 3.1 pro",
    "55 endpoints live",
    "pr #22142 merged",
    "persona engine: speccing now",
    "deploying on railway...",
    "not waiting."
  ];
  let tIdx = 0, cIdx = 0, isDeleting = false;
  const typeSpeed = 80, pause = 1500;

  const typeLoop = () => {
    const current = typingTexts[tIdx];
    const displayed = isDeleting
      ? current.slice(0, cIdx - 1)
      : current.slice(0, cIdx + 1);
    typingEl.textContent = displayed;
    if (!isDeleting) {
      cIdx++;
      if (cIdx === current.length) {
        setTimeout(() => { isDeleting = true; }, pause);
      }
    } else {
      cIdx--;
      if (cIdx === 0) {
        isDeleting = false;
        tIdx = (tIdx + 1) % typingTexts.length;
      }
    }
    const delay = isDeleting ? typeSpeed / 2 : typeSpeed;
    setTimeout(typeLoop, delay);
  };
  if (typingEl) typeLoop();

  /* ==================== 4. Smooth Scroll ==================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ==================== 5. Nav Active State ==================== */
  const navLinks = document.querySelectorAll('#nav a[href^="#"], #nav-mobile a[href^="#"]');
  const sections = Array.from(document.querySelectorAll('section[id]'));

  const setActiveNav = () => {
    const scrollPos = window.scrollY + window.innerHeight / 2;
    let currentSection = sections[0];
    for (const sec of sections) {
      if (sec.offsetTop <= scrollPos) currentSection = sec;
    }
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href').slice(1) === currentSection.id));
  };
  window.addEventListener('scroll', setActiveNav);
  setActiveNav();

  /* ==================== 6. Mobile Nav Toggle ==================== */
  const navToggle = document.getElementById('nav-toggle');
  const navMobile = document.getElementById('nav-mobile');
  if (navToggle && navMobile) {
    navToggle.addEventListener('click', () => navMobile.classList.toggle('open'));
  }

  /* ==================== 7. Scroll‑Triggered Number Counters ==================== */
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target || el.textContent, 10);
        const duration = 2000;
        const start = performance.now();

        const animate = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          el.textContent = Math.floor(progress * target);
          if (progress < 1) requestAnimationFrame(animate);
          else el.textContent = target;
        };
        requestAnimationFrame(animate);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.counter').forEach(el => {
    // allow a data-target attribute to specify the final number; fallback to current text
    if (!el.dataset.target) el.dataset.target = el.textContent.trim();
    counterObserver.observe(el);
  });
})();