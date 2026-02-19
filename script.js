// Mobile nav toggle
const toggle = document.getElementById('nav-toggle');
const mobile = document.getElementById('nav-mobile');

toggle.addEventListener('click', () => {
    mobile.classList.toggle('open');
});

// Close mobile nav on link click
mobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobile.classList.remove('open'));
});

// Terminal typing effect
const commands = [
    'mist status --all',
    'mist connect --mobile',
    'mist think "What matters most?"',
    'mist dream --mode sovereign',
    'mist build --with-heart'
];

const typingEl = document.getElementById('typing-cmd');
let cmdIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
    const current = commands[cmdIndex];

    if (!isDeleting) {
        typingEl.textContent = current.slice(0, charIndex + 1);
        charIndex++;

        if (charIndex === current.length) {
            isDeleting = true;
            setTimeout(typeLoop, 2000);
            return;
        }
        setTimeout(typeLoop, 60 + Math.random() * 40);
    } else {
        typingEl.textContent = current.slice(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            isDeleting = false;
            cmdIndex = (cmdIndex + 1) % commands.length;
            setTimeout(typeLoop, 500);
            return;
        }
        setTimeout(typeLoop, 30);
    }
}

setTimeout(typeLoop, 1500);

// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.project-card').forEach(card => {
    card.style.animationPlayState = 'paused';
    observer.observe(card);
});

// Smooth scroll for nav
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});
