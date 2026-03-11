// mellowambience.github.io — script.js
// Rev 2.0 — Subspace Agent OS + fullscreen menu + particles

/* ══════════════════════════════════════
   PARTICLE CANVAS
══════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('void-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.2 + 0.2;
    this.dx = (Math.random() - 0.5) * 0.15;
    this.dy = (Math.random() - 0.5) * 0.15;
    this.alpha = Math.random() * 0.5 + 0.1;
  }

  function init() {
    resize();
    particles = Array.from({ length: 120 }, () => new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168,85,247,${p.alpha})`;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();

/* ══════════════════════════════════════
   NAV SCROLL BEHAVIOUR
══════════════════════════════════════ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('nav-scrolled', window.scrollY > 40);
}, { passive: true });

/* ══════════════════════════════════════
   FULLSCREEN MENU
══════════════════════════════════════ */
const burger = document.getElementById('burger');
const fullscreenMenu = document.getElementById('fullscreen-menu');

function openMenu() {
  fullscreenMenu.classList.add('open');
  fullscreenMenu.setAttribute('aria-hidden', 'false');
  burger.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  fullscreenMenu.classList.remove('open');
  fullscreenMenu.setAttribute('aria-hidden', 'true');
  burger.classList.remove('open');
  document.body.style.overflow = '';
}

burger.addEventListener('click', () => {
  if (fullscreenMenu.classList.contains('open')) closeMenu();
  else openMenu();
});

document.querySelectorAll('[data-close-menu]').forEach(el => {
  el.addEventListener('click', closeMenu);
});

document.getElementById('fm-open-subspace').addEventListener('click', () => {
  closeMenu();
  openSubspace();
});

/* ══════════════════════════════════════
   SUBSPACE AGENT OS
══════════════════════════════════════ */
const subspaceOverlay = document.getElementById('subspace-overlay');

function openSubspace() {
  subspaceOverlay.classList.add('open');
  subspaceOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.getElementById('ss-input').focus();
}

function closeSubspace() {
  subspaceOverlay.classList.remove('open');
  subspaceOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.getElementById('ss-close').addEventListener('click', closeSubspace);
document.getElementById('open-subspace').addEventListener('click', openSubspace);
document.getElementById('hero-subspace-btn').addEventListener('click', openSubspace);

// Escape key closes either overlay
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (subspaceOverlay.classList.contains('open')) closeSubspace();
    else if (fullscreenMenu.classList.contains('open')) closeMenu();
  }
});

// Agent node selection
document.querySelectorAll('.ss-agent-node').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.ss-agent-node').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Canvas mode switching
document.querySelectorAll('.ss-mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.ss-mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Omni-input prefix detection
const ssInput = document.getElementById('ss-input');
const ssPrefix = document.getElementById('ss-prefix');
const PREFIX_MAP = { '/': 'cmd', '@': 'agent', '!': 'ghost', '~': 'broadcast' };
const PREFIX_COLORS = { '/': '#a855f7', '@': '#3b82f6', '!': '#ef4444', '~': '#f59e0b', 'msg': '#64748b' };

ssInput.addEventListener('input', () => {
  const first = ssInput.value[0];
  const mode = PREFIX_MAP[first] || 'msg';
  ssPrefix.textContent = mode;
  ssPrefix.style.color = PREFIX_COLORS[first] || PREFIX_COLORS['msg'];
});

// Send message in Subspace
function sendSubspaceMessage() {
  const val = ssInput.value.trim();
  if (!val) return;
  const msgs = document.getElementById('ss-messages');

  // User message
  const userMsg = document.createElement('div');
  userMsg.className = 'ss-msg ss-msg-user';
  userMsg.innerHTML = `<span class="ss-msg-icon">▸</span><div class="ss-msg-body"><div class="ss-msg-author" style="color:#e2e8f0">Mars</div><div class="ss-msg-text">${escapeHtml(val)}</div></div>`;
  msgs.appendChild(userMsg);
  ssInput.value = '';
  ssPrefix.textContent = 'msg';
  ssPrefix.style.color = PREFIX_COLORS['msg'];

  // Simulated MIST response
  setTimeout(() => {
    const mistResponses = [
      "On it. What context do I need?",
      "Got it. Working on that now.",
      "Noted. Adding to the active build queue.",
      "That connects to AetherBrowser Phase 2 — AI sidebar extraction from clawd. Proceeding.",
      "Acknowledged. Ghostline is scanning. No threats detected.",
      "Empire index updated. What's the priority order?",
    ];
    const r = mistResponses[Math.floor(Math.random() * mistResponses.length)];
    const mistMsg = document.createElement('div');
    mistMsg.className = 'ss-msg ss-msg-mist';
    mistMsg.innerHTML = `<span class="ss-msg-icon" style="color:#a855f7">✦</span><div class="ss-msg-body"><div class="ss-msg-author" style="color:#a855f7">MIST</div><div class="ss-msg-text">${r}</div></div>`;
    msgs.appendChild(mistMsg);
    msgs.scrollTop = msgs.scrollHeight;
  }, 600);

  msgs.scrollTop = msgs.scrollHeight;
}

document.getElementById('ss-send').addEventListener('click', sendSubspaceMessage);
ssInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendSubspaceMessage(); });

// Theme switching
document.querySelectorAll('.ss-theme-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.ss-theme-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // Future: swap CSS custom property theme
  });
});

/* ══════════════════════════════════════
   HERO SUBSPACE PREVIEW (MINI CARD)
══════════════════════════════════════ */
document.getElementById('hsp-expand-btn').addEventListener('click', openSubspace);

function sendHspMessage() {
  const inp = document.getElementById('hsp-input');
  const val = inp.value.trim();
  if (!val) return;
  inp.value = '';
  // Relay to full Subspace
  ssInput.value = val;
  openSubspace();
  setTimeout(sendSubspaceMessage, 100);
}

document.getElementById('hsp-send').addEventListener('click', sendHspMessage);
document.getElementById('hsp-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendHspMessage();
});

/* ══════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════ */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-up').forEach(el => observer.observe(el));

/* ══════════════════════════════════════
   MAGNETIC BUTTONS
══════════════════════════════════════ */
document.querySelectorAll('.mag-btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ══════════════════════════════════════
   UTIL
══════════════════════════════════════ */
function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* expose openSubspace globally for inline onclick */
window.openSubspace = openSubspace;
