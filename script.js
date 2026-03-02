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

if (hamburger && navLinks) {
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
}

/* ── 4. Smooth Scroll ─────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        // Exclude href="#"
        const href = anchor.getAttribute('href');
        if (href === '#') return;

        try {
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (err) {
            // Ignore invalid selectors
        }
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
        static lastSoundTime = 0;
        static canPlaySound() {
            const now = Date.now();
            return now - Particle.lastSoundTime > 300; // Increased cooldown for longer laser asset length
        }
        static resetSoundCooldown() {
            Particle.lastSoundTime = Date.now();
        }

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

                // Reactive Audio (Throttled)
                if (typeof AudioManager !== 'undefined' && Particle.canPlaySound()) {
                    AudioManager.playParticleDisturb();
                    Particle.resetSoundCooldown();
                }
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

/* ══════════════════════════════════════════════════
   14. FLOATING RADIAL FAB MENU
   Menu now uses purely CSS :hover to open/close
   ══════════════════════════════════════════════════ */
(function initFAB() {
    const fabItems = document.querySelectorAll('.fab-item');

    // Smooth scroll for FAB items
    fabItems.forEach(item => {
        item.addEventListener('click', e => {
            const href = item.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Optional: remove focus so tooltip hides if keyboard navigated
                    document.activeElement.blur();
                }
            }
        });
    });
})();

/* ══════════════════════════════════════════════════
   15. PROJECTS 3D CONTAINER SCROLL
   Tilts the projects grid in from a perspective angle
   as the user scrolls into the section
   ══════════════════════════════════════════════════ */
(function initProjectsScroll() {
    const wrap = document.getElementById('projectsScrollWrap');
    const grid = wrap ? wrap.querySelector('.projects-grid') : null;
    if (!grid) return;

    let tiltApplied = false;

    // IntersectionObserver to detect when the section enters the viewport
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !tiltApplied) {
                // Small delay so the CSS transition starts from rotateX(18deg)
                requestAnimationFrame(() => {
                    grid.classList.add('tilted-in');
                });
                tiltApplied = true;
                // Keep observing for second visits (single-page navigation)
            } else if (!entry.isIntersecting) {
                grid.classList.remove('tilted-in');
                tiltApplied = false;
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    observer.observe(wrap);
})();

/* ══════════════════════════════════════════════════
   16. SVG NB LOGO — dynamic path length calibration
   Measures actual path length so dash arrays are exact
   ══════════════════════════════════════════════════ */
(function calibrateNBLogo() {
    const paths = document.querySelectorAll('.nb-path');
    paths.forEach(path => {
        try {
            const len = Math.ceil(path.getTotalLength());
            path.style.strokeDasharray = len;
            path.style.strokeDashoffset = 0;
            // Store original length for hover animation
            path.dataset.pathLen = len; // Store for potential use
        } catch (_) { /* SVG not loaded yet */ }
    });
})();

/* ══════════════════════════════════════════════════
   17. ABOUT BADGE CYCLER
   ══════════════════════════════════════════════════ */
(function initBadgeCycler() {
    const badge = document.getElementById('achieveBadge');
    if (!badge) return;

    const icon = badge.querySelector('#achieveIcon');
    const text = badge.querySelector('#achieveText');

    const achievements = [
        { text: "SIH 2025 Finalist", icon: "fa-trophy" },
        { text: "Smart Interviews Mentor", icon: "fa-chalkboard-user" },
        { text: "College PS Winner", icon: "fa-medal" },
        { text: "Hackathon Winner", icon: "fa-award" }
    ];

    let index = 0;

    setInterval(() => {
        // Fade out
        badge.style.opacity = '0';
        badge.style.transform = 'translateX(-50%) translateY(-8px)';

        setTimeout(() => {
            // Update content
            index = (index + 1) % achievements.length;
            text.textContent = achievements[index].text;
            icon.className = `fa-solid ${achievements[index].icon}`;

            // Fade in
            badge.style.opacity = '1';
            badge.style.transform = 'translateX(-50%) translateY(0)';
        }, 400); // Wait for CSS transition (0.4s)
    }, 3500); // Cycle every 3.5s
})();

/* ══════════════════════════════════════════════════
   18. FAB MENU TOGGLE (MOBILE)
   ══════════════════════════════════════════════════ */
(function initFabMenu() {
    const fabMenu = document.getElementById('fabMenu');
    const fabTrigger = document.getElementById('fabTrigger');
    if (!fabMenu || !fabTrigger) return;

    fabTrigger.addEventListener('click', (e) => {
        fabMenu.classList.toggle('open');
        e.stopPropagation();
    });

    document.addEventListener('click', (e) => {
        if (!fabMenu.contains(e.target)) {
            fabMenu.classList.remove('open');
        }
    });
})();

/* ══════════════════════════════════════════════════
   19. HYPER TEXT DECRYPTION
   ══════════════════════════════════════════════════ */
(function initHyperText() {
    const targetElement = document.querySelector('.about-lead');
    if (!targetElement) return;

    // Words to apply the effect to
    const highlightWords = ['Full', 'Stack', 'Developer', 'Java', 'web', 'development', 'passion', 'building', 'things'];
    const text = targetElement.textContent.trim().split(/\s+/);
    const originalHTML = targetElement.innerHTML;
    targetElement.innerHTML = '';

    const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+";
    const SCRAMBLE_SPEED = 25;
    const CYCLES_PER_LETTER = 3;

    text.forEach(word => {
        const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '');
        const isHighlightable = highlightWords.some(hw => hw.toLowerCase() === cleanWord.toLowerCase());

        const wordSpan = document.createElement('span');
        wordSpan.className = `hyper-word ${isHighlightable ? 'hyper-highlightable' : ''}`;

        const textSpan = document.createElement('span');
        textSpan.className = 'hyper-text';
        textSpan.textContent = word;

        wordSpan.appendChild(textSpan);

        if (isHighlightable) {
            const bgPill = document.createElement('span');
            bgPill.className = 'hyper-bg';
            wordSpan.insertBefore(bgPill, textSpan);

            const dot1 = document.createElement('span');
            dot1.className = 'hyper-dot top-right';
            const dot2 = document.createElement('span');
            dot2.className = 'hyper-dot bottom-left';
            wordSpan.appendChild(dot1);
            wordSpan.appendChild(dot2);

            let interval;
            const scramble = () => {
                let pos = 0;
                clearInterval(interval);
                interval = setInterval(() => {
                    const scrambled = word.split("").map((char, index) => {
                        // Don't scramble punctuation or spaces
                        if (!/[a-zA-Z0-9]/.test(char)) return char;
                        if (pos / CYCLES_PER_LETTER > index) return char;
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    }).join("");
                    textSpan.textContent = scrambled;
                    pos++;
                    if (pos >= word.length * CYCLES_PER_LETTER) {
                        clearInterval(interval);
                        textSpan.textContent = word;
                    }
                }, SCRAMBLE_SPEED);
            };

            wordSpan.addEventListener('mouseenter', () => {
                wordSpan.classList.add('hovered');
                scramble();
            });

            wordSpan.addEventListener('mouseleave', () => {
                wordSpan.classList.remove('hovered');
                clearInterval(interval);
                textSpan.textContent = word;
            });
        }

        targetElement.appendChild(wordSpan);
        targetElement.appendChild(document.createTextNode(" "));
    });
})();

/* ══════════════════════════════════════════════════
   19. AUDIO MANAGER (Web Audio Synthesis)
   ══════════════════════════════════════════════════ */
const AudioManager = (function () {
    let audioCtx = null;
    let isMuted = localStorage.getItem('portfolio-muted') === 'true';

    function init() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function playTone({ freq, type = 'sine', duration = 0.1, volume = 0.1, ramp = 'expo', endFreq = null }) {
        if (isMuted) return;
        try {
            init();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = type;
            const now = audioCtx.currentTime;

            osc.frequency.setValueAtTime(freq, now);
            if (endFreq) {
                if (ramp === 'expo') osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
                else osc.frequency.linearRampToValueAtTime(endFreq, now + duration);
            }

            gain.gain.setValueAtTime(volume, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(now + duration);
        } catch (e) {
            console.warn("Audio Context failed:", e);
        }
    }

    return {
        playHover: () => {
            AudioManager.resume();
            playTone({ freq: 1400, endFreq: 1100, duration: 0.04, volume: 0.4, type: 'sine' });
        },
        playClick: () => {
            AudioManager.resume();
            playTone({ freq: 400, endFreq: 150, duration: 0.12, volume: 0.5, type: 'triangle' });
        },
        playToggle: (isOn) => {
            AudioManager.resume();
            if (isOn) {
                playTone({ freq: 400, endFreq: 800, duration: 0.08, volume: 0.3, type: 'square' });
            } else {
                playTone({ freq: 800, endFreq: 400, duration: 0.08, volume: 0.3, type: 'square' });
            }
        },
        playCardFlip: () => {
            AudioManager.resume();
            playTone({ freq: 300, endFreq: 100, duration: 0.15, volume: 0.15, type: 'sine' });
        },
        playWhoosh: (vol) => {
            AudioManager.resume();
            playTone({ freq: 100, endFreq: 300, duration: 0.2, volume: Math.min(0.05, vol * 5), type: 'sine' });
        },

        // --- External Asset Support ---
        assets: {},
        loadAsset: async (name, url) => {
            try {
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
                AudioManager.assets[name] = audioBuffer;
                console.log("Audio Loaded Successfully:", name);
            } catch (err) {
                console.warn("Audio Load Failed (CORS or Path):", name, err);
            }
        },
        playParticleDisturb: () => {
            const buffer = AudioManager.assets['laser'];
            if (!buffer || isMuted || !audioCtx) return;
            AudioManager.resume();

            const source = audioCtx.createBufferSource();
            const gain = audioCtx.createGain();
            source.buffer = buffer;

            const startTime = 0;
            const duration = 0.4;

            gain.gain.setValueAtTime(0.6, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

            source.connect(gain);
            gain.connect(audioCtx.destination);

            source.start(0, startTime, duration);
            console.log("Laser Played");
        },
        resume: () => {
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
        },
        toggleMute: () => {
            isMuted = !isMuted;
            localStorage.setItem('portfolio-muted', isMuted);
            return isMuted;
        },
        getMuted: () => isMuted
    };
})();

/* ══════════════════════════════════════════════════
   20. AUDIO TOGGLE & COMPONENT TRIGGERS
   ══════════════════════════════════════════════════ */
(function initAudioInteractions() {
    const audioToggle = document.getElementById('audioToggle');
    if (!audioToggle) return;

    // Set initial state
    if (AudioManager.getMuted()) {
        audioToggle.classList.add('muted');
    }

    audioToggle.addEventListener('click', () => {
        const currentlyMuted = AudioManager.toggleMute();
        audioToggle.classList.toggle('muted', currentlyMuted);
        // Play distinct ON/OFF tones
        AudioManager.playToggle(!currentlyMuted);
    });

    // Helper to add audio to elements
    const addAudio = (selector, type = 'hover') => {
        document.querySelectorAll(selector).forEach(el => {
            el.addEventListener(type === 'hover' ? 'mouseenter' : 'click', () => {
                if (type === 'hover') {
                    if (el.classList.contains('coding-card')) AudioManager.playCardFlip();
                    else AudioManager.playHover();
                }
                else AudioManager.playClick();
            });
        });
    };

    // Attach to major components
    addAudio('.nav-logo', 'hover');
    addAudio('.theme-toggle', 'click');
    addAudio('.btn', 'hover');
    addAudio('.btn', 'click');
    addAudio('.fab-trigger', 'click');
    addAudio('.fab-item', 'hover');
    addAudio('.coding-card', 'hover');
    addAudio('.project-card', 'hover');
    addAudio('.hyper-highlightable', 'hover');
})();

/* ══════════════════════════════════════════════════
   21. DYNAMIC BACKGROUND AUDIO
   ══════════════════════════════════════════════════ */
(function initAdvancedAudio() {
    // Background Move Sound (Throttled)
    let lastMove = 0;
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastMove < 300) return; // Throttle to 300ms

        // Only trigger if moving over empty-ish space (not too fast/constant)
        if (Math.abs(e.movementX) + Math.abs(e.movementY) > 20) {
            const vol = Math.min(0.015, (Math.abs(e.movementX) + Math.abs(e.movementY)) / 2000);
            AudioManager.playWhoosh(vol);
            lastMove = now;
        }
    });
})();

// Initial asset loading
if (typeof AudioManager !== 'undefined') {
    AudioManager.loadAsset('laser', './assets/laser.mp3');
}
