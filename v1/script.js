/* ════════════════════════════════════════════════
   NIKHIL BIKKANOORI — PORTFOLIO
   script.js
   ════════════════════════════════════════════════ */

'use strict';

/* ── 1. Theme Toggle ──────────────────────────── */
const html = document.documentElement;
const themeCheck = document.getElementById('themeCheck');

// Load saved theme (default: dark)
const savedTheme = localStorage.getItem('nb-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
themeCheck.checked = savedTheme === 'light';

themeCheck.addEventListener('change', () => {
    const newTheme = themeCheck.checked ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('nb-theme', newTheme);
});

/* ── 2. Navbar Scroll Behavior ────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ── 3. Hamburger Menu ────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
    });
});

/* ── 4. Smooth Scroll ─────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Button helper used inline (named to avoid conflict with window.scrollTo)
function smoothScrollTo(selector) {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ── 5. Typed Text Effect ──────────────────────── */
const phrases = [
    'scalable web apps.',
    'beautiful UIs.',
    'robust backends.',
    'clean TypeScript.',
    'elegant React apps.',
    'DSA solutions.',
];

const typedEl = document.getElementById('typedText');
let phraseIdx = 0, charIdx = 0, isDeleting = false;

function typeLoop() {
    const current = phrases[phraseIdx];

    if (isDeleting) {
        charIdx--;
        typedEl.textContent = current.slice(0, charIdx);
    } else {
        charIdx++;
        typedEl.textContent = current.slice(0, charIdx);
    }

    let delay = isDeleting ? 45 : 85;

    if (!isDeleting && charIdx === current.length) {
        delay = 1800; // pause at end
        isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        delay = 300;
    }

    setTimeout(typeLoop, delay);
}
setTimeout(typeLoop, 1400);

/* ── 6. Scroll Reveal ─────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const skillCategories = document.querySelectorAll('.skill-category');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Trigger stagger for skill pills
            if (entry.target.classList.contains('skill-category')) {
                entry.target.querySelectorAll('.pill').forEach((pill, i) => {
                    pill.style.animationDelay = `${i * 0.05}s`;
                });
            }
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));
skillCategories.forEach(el => revealObserver.observe(el));

/* ── 7. 3D Tilt Effect ────────────────────────── */
const tiltCards = document.querySelectorAll('.tilt-card');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);  // -1 to 1
        const dy = (e.clientY - cy) / (rect.height / 2); // -1 to 1

        const tiltX = dy * -12;  // degrees
        const tiltY = dx * 12;

        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;

        // Shine position
        const shine = card.querySelector('.card-shine');
        if (shine) {
            const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
            const mouseY = ((e.clientY - rect.top) / rect.height) * 100;
            shine.style.setProperty('--mouse-x', `${mouseX}%`);
            shine.style.setProperty('--mouse-y', `${mouseY}%`);
        }
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        setTimeout(() => { card.style.transition = ''; }, 500);
    });

    card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease';
    });
});

/* ── 8. Hero Parallax (hero card only, blobs removed) ── */
const heroContent = document.querySelector('.hero-content');
const heroCard = document.getElementById('heroCard');

document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    if (heroContent) heroContent.style.transform = `translate(${x * 8}px, ${y * 6}px)`;
    if (heroCard) heroCard.style.transform = `translate(${x * -12}px, ${y * -8}px)`;
}, { passive: true });

/* ── 9. Active Nav Link Highlighting ──────────── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navAnchors.forEach(a => a.classList.remove('active'));
            const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
            if (active) active.classList.add('active');
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ── 10. Stagger reveal delays ────────────────── */
document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
});

/* ════════════════════════════════════════════════
   11. FLOW FIELD CANVAS BACKGROUND
   Ported from NeuralBackground React component
   ════════════════════════════════════════════════ */
(function initFlowField() {
    const canvas = document.getElementById('flowCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const PARTICLE_COUNT = 600;
    const SPEED = 0.85;
    const TRAIL_OPACITY = 0.12;
    const INTERACTION_RADIUS = 160;

    let width, height, dpr, particles = [], rafId;
    let mouse = { x: -9999, y: -9999 };

    // Particle colour — matches accent; adapts with theme toggle
    function getColor() {
        const theme = document.documentElement.getAttribute('data-theme');
        return theme === 'light' ? '#5b52e8' : '#7c71f5';
    }

    class Particle {
        constructor() { this.reset(true); }
        reset(randomPos = false) {
            this.x = randomPos ? Math.random() * width : Math.random() * width;
            this.y = randomPos ? Math.random() * height : Math.random() * height;
            this.vx = 0; this.vy = 0;
            this.age = randomPos ? Math.random() * 300 : 0; // stagger start
            this.life = Math.random() * 220 + 120;
        }
        update() {
            // Flow field angle
            const angle = (Math.cos(this.x * 0.005) + Math.sin(this.y * 0.005)) * Math.PI;
            this.vx += Math.cos(angle) * 0.18 * SPEED;
            this.vy += Math.sin(angle) * 0.18 * SPEED;

            // Mouse repulsion
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < INTERACTION_RADIUS) {
                const force = (INTERACTION_RADIUS - dist) / INTERACTION_RADIUS;
                this.vx -= dx * force * 0.06;
                this.vy -= dy * force * 0.06;
            }

            this.x += this.vx;
            this.y += this.vy;
            this.vx *= 0.95;
            this.vy *= 0.95;
            this.age++;
            if (this.age > this.life) this.reset();
            // Wrap
            if (this.x < 0) this.x = width; if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height; if (this.y > height) this.y = 0;
        }
        draw() {
            const alpha = 1 - Math.abs((this.age / this.life) - 0.5) * 2;
            ctx.globalAlpha = Math.max(0, alpha);
            ctx.fillStyle = getColor();
            ctx.fillRect(this.x, this.y, 1.6, 1.6);
        }
    }

    function resize() {
        dpr = window.devicePixelRatio || 1;
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
    }

    function init() {
        resize();
        particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
    }

    function loop() {
        // Trail: semi-transparent fill instead of clearRect = streak effect
        const theme = document.documentElement.getAttribute('data-theme');
        ctx.globalAlpha = TRAIL_OPACITY;
        ctx.fillStyle = theme === 'light' ? '#f4f4fb' : '#070710';
        ctx.fillRect(0, 0, width, height);

        particles.forEach(p => { p.update(); p.draw(); });
        ctx.globalAlpha = 1;
        rafId = requestAnimationFrame(loop);
    }

    // Mouse tracking
    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX; mouse.y = e.clientY;
    }, { passive: true });
    window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
    window.addEventListener('resize', () => { resize(); }, { passive: true });

    // Re-colour when theme toggles
    document.getElementById('themeCheck').addEventListener('change', () => {
        // color is read live in draw() — no action needed
    });

    init();
    loop();
})();

/* ════════════════════════════════════════════════
   12. SECURE MESSAGE GATEWAY — Form Handler
   ════════════════════════════════════════════════ */
(function initSMG() {
    const form = document.getElementById('smgForm');
    if (!form) return;
    const btn = document.getElementById('smgBtn');
    const btnText = document.getElementById('smgBtnText');
    const statusTxt = document.getElementById('smgStatusText');
    const nameEl = document.getElementById('smgName');
    const emailEl = document.getElementById('smgEmail');
    const msgEl = document.getElementById('smgMsg');

    let pending = false;

    form.addEventListener('submit', e => {
        e.preventDefault();
        if (pending) return;
        if (!nameEl.value.trim() || !emailEl.value.trim() || !msgEl.value.trim()) {
            // Shake empty fields
            [nameEl, emailEl, msgEl].forEach(inp => {
                if (!inp.value.trim()) inp.closest('.smg-field').classList.add('shake');
                setTimeout(() => inp.closest('.smg-field').classList.remove('shake'), 500);
            });
            return;
        }

        // Enter sending state
        pending = true;
        btn.disabled = true;
        btn.classList.add('sending');
        btnText.textContent = 'SENDING...';
        const st = statusTxt;
        st.className = 'smg-sending';
        st.textContent = 'Establishing Handshake...';

        // Simulate send (replace with real fetch/emailjs as needed)
        setTimeout(() => {
            pending = false;
            btn.disabled = false;
            btn.classList.remove('sending');
            btnText.textContent = 'SENT ✓';
            st.className = 'smg-ready';
            st.textContent = 'Transmission Complete';
            nameEl.value = ''; emailEl.value = ''; msgEl.value = '';
            setTimeout(() => {
                btnText.textContent = 'SEND';
                st.textContent = 'Ready';
            }, 3500);
        }, 2000);
    });
})();

/* ════════════════════════════════════════════════
   13. CSS RIPPLE ON BUTTONS
   ════════════════════════════════════════════════ */
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const wave = document.createElement('span');
        wave.className = 'ripple-wave';
        wave.style.cssText = [
            `width:${size}px`, `height:${size}px`,
            `left:${e.clientX - rect.left - size / 2}px`,
            `top:${e.clientY - rect.top - size / 2}px`
        ].join(';');
        this.appendChild(wave);
        wave.addEventListener('animationend', () => wave.remove());
    });
});
