/**
 * ==============================================================================
 * UTTAKALADEBA GARNAIK — FUTURISTIC DEVELOPER PORTFOLIO
 * High-Performance Interactive Animation Engine & Dynamic UI Controller
 * ==============================================================================
 */

(function () {
    "use strict";

    /* ==========================================================================
       01. AUDIO SYNTHESIZER (WEB AUDIO API - ZERO ASSETS REQUIRED)
       ========================================================================== */
    class CyberAudio {
        constructor() {
            this.ctx = null;
            this.muted = localStorage.getItem("ug_audio_muted") === "true";
            this.initListeners();
            this.updateButtonUI();
        }

        initContext() {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    this.ctx = new AudioCtx();
                }
            }
            if (this.ctx && this.ctx.state === "suspended") {
                this.ctx.resume();
            }
        }

        playTone(freq, type = "sine", duration = 0.05, gainValue = 0.04) {
            if (this.muted) return;
            try {
                this.initContext();
                if (!this.ctx) return;

                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = type;
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

                gain.gain.setValueAtTime(gainValue, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start();
                osc.stop(this.ctx.currentTime + duration);
            } catch (e) {
                // Audio not supported or blocked by browser autoplay policy
            }
        }

        hoverBlip() {
            this.playTone(880, "sine", 0.04, 0.02);
        }

        clickChime() {
            this.playTone(587.33, "triangle", 0.07, 0.04);
            setTimeout(() => this.playTone(880, "sine", 0.08, 0.03), 30);
        }

        successArpeggio() {
            const notes = [523.25, 659.25, 783.99, 1046.5];
            notes.forEach((freq, i) => {
                setTimeout(() => this.playTone(freq, "triangle", 0.15, 0.05), i * 70);
            });
        }

        toggleMute() {
            this.muted = !this.muted;
            localStorage.setItem("ug_audio_muted", this.muted);
            this.updateButtonUI();
            if (!this.muted) {
                this.hoverBlip();
                showToast("Sound Effects: Enabled 🔊");
            } else {
                showToast("Sound Effects: Muted 🔇");
            }
        }

        updateButtonUI() {
            const btns = document.querySelectorAll(".sound-toggle-btn");
            btns.forEach(btn => {
                if (this.muted) {
                    btn.classList.add("is-muted");
                    btn.setAttribute("title", "Unmute Sound Effects");
                    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg><span>SFX OFF</span>`;
                } else {
                    btn.classList.remove("is-muted");
                    btn.setAttribute("title", "Mute Sound Effects");
                    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg><span>SFX ON</span>`;
                }
            });
        }

        initListeners() {
            document.addEventListener("click", (e) => {
                const btn = e.target.closest(".sound-toggle-btn");
                if (btn) {
                    e.preventDefault();
                    this.toggleMute();
                }
            });

            // Hover sound on buttons & cards
            document.addEventListener("mouseover", (e) => {
                const target = e.target.closest("a, button, .project-card, .skill-card, .hackathon-card, .lecture-card");
                if (target && !target.dataset.soundBound) {
                    target.dataset.soundBound = "true";
                    target.addEventListener("mouseenter", () => this.hoverBlip());
                    target.addEventListener("click", () => this.clickChime());
                }
            });
        }
    }

    const soundSystem = new CyberAudio();

    /* ==========================================================================
       02. TOAST NOTIFICATION SYSTEM
       ========================================================================== */
    function showToast(message, duration = 3000) {
        let container = document.getElementById("toast-container");
        if (!container) {
            container = document.createElement("div");
            container.id = "toast-container";
            container.className = "toast-container";
            document.body.appendChild(container);
        }

        const toast = document.createElement("div");
        toast.className = "cyber-toast";
        toast.innerHTML = `<span class="toast-dot"></span><span class="toast-text">${message}</span>`;
        container.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add("toast-show"));

        setTimeout(() => {
            toast.classList.remove("toast-show");
            setTimeout(() => toast.remove(), 400);
        }, duration);
    }
    window.showToast = showToast;

    /* ==========================================================================
       03. INTERACTIVE PARTICLE CONSTELLATION CANVAS
       ========================================================================== */
    class CyberCanvas {
        constructor() {
            this.canvas = document.getElementById("cyberCanvas");
            if (!this.canvas) return;

            this.ctx = this.canvas.getContext("2d");
            this.particles = [];
            this.maxDistance = 140;
            this.mouseDistance = 160;
            this.mouse = { x: null, y: null, active: false };
            this.animationFrameId = null;
            this.isVisible = true;

            this.init();
        }

        init() {
            this.resize();
            this.createParticles();
            this.bindEvents();
            this.start();
        }

        resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.canvas.width = this.width * dpr;
            this.canvas.height = this.height * dpr;
            this.ctx.scale(dpr, dpr);
        }

        createParticles() {
            this.particles = [];
            // Particle count scales with screen size
            const count = Math.floor((this.width * this.height) / 16000);
            const particleCount = Math.min(Math.max(count, 35), 75);

            for (let i = 0; i < particleCount; i++) {
                this.particles.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    vx: (Math.random() - 0.5) * 0.7,
                    vy: (Math.random() - 0.5) * 0.7,
                    radius: Math.random() * 1.8 + 0.8,
                    color: Math.random() > 0.4 ? "rgba(0, 242, 254," : "rgba(121, 40, 202,",
                    alpha: Math.random() * 0.6 + 0.3
                });
            }
        }

        bindEvents() {
            window.addEventListener("resize", () => {
                this.resize();
                this.createParticles();
            }, { passive: true });

            window.addEventListener("mousemove", (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
                this.mouse.active = true;
            }, { passive: true });

            window.addEventListener("mouseleave", () => {
                this.mouse.active = false;
            });

            document.addEventListener("visibilitychange", () => {
                this.isVisible = !document.hidden;
                if (this.isVisible) this.start();
                else this.stop();
            });
        }

        start() {
            if (!this.animationFrameId && this.isVisible) {
                const loop = () => {
                    this.draw();
                    this.animationFrameId = requestAnimationFrame(loop);
                };
                this.animationFrameId = requestAnimationFrame(loop);
            }
        }

        stop() {
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
        }

        draw() {
            this.ctx.clearRect(0, 0, this.width, this.height);

            for (let i = 0; i < this.particles.length; i++) {
                const p = this.particles[i];

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > this.width) p.vx *= -1;
                if (p.y < 0 || p.y > this.height) p.vy *= -1;

                // Mouse repulsion & interaction
                if (this.mouse.active) {
                    const dx = this.mouse.x - p.x;
                    const dy = this.mouse.y - p.y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < this.mouseDistance) {
                        const force = (this.mouseDistance - dist) / this.mouseDistance;
                        p.x -= (dx / dist) * force * 1.5;
                        p.y -= (dy / dist) * force * 1.5;

                        // Draw mouse connection thread
                        const alpha = (1 - dist / this.mouseDistance) * 0.35;
                        this.ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
                        this.ctx.lineWidth = 1;
                        this.ctx.beginPath();
                        this.ctx.moveTo(p.x, p.y);
                        this.ctx.lineTo(this.mouse.x, this.mouse.y);
                        this.ctx.stroke();
                    }
                }

                // Draw Particle Dot
                this.ctx.fillStyle = p.color + p.alpha + ")";
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fill();

                // Draw Inter-Particle Connections
                for (let j = i + 1; j < this.particles.length; j++) {
                    const p2 = this.particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);

                    if (dist < this.maxDistance) {
                        const alpha = (1 - dist / this.maxDistance) * 0.18;
                        this.ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
                        this.ctx.lineWidth = 0.7;
                        this.ctx.beginPath();
                        this.ctx.moveTo(p.x, p.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.stroke();
                    }
                }
            }
        }
    }

    /* ==========================================================================
       04. CUSTOM FUTURISTIC NEON CURSOR (DESKTOP ONLY)
       ========================================================================== */
    class CyberCursor {
        constructor() {
            if (window.matchMedia("(pointer: coarse)").matches) return;

            this.dot = document.createElement("div");
            this.dot.className = "cyber-cursor-dot";

            this.ring = document.createElement("div");
            this.ring.className = "cyber-cursor-ring";

            document.body.appendChild(this.dot);
            document.body.appendChild(this.ring);

            this.mouseX = -100;
            this.mouseY = -100;
            this.ringX = -100;
            this.ringY = -100;
            this.isHovering = false;

            this.bindEvents();
            this.render();
        }

        bindEvents() {
            window.addEventListener("mousemove", (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
                this.dot.style.transform = `translate3d(${this.mouseX}px, ${this.mouseY}px, 0)`;
            }, { passive: true });

            document.addEventListener("mouseover", (e) => {
                const target = e.target.closest("a, button, input, textarea, select, .project-card, .skill-card, .hackathon-card, .lecture-card, .interactive");
                if (target) {
                    this.ring.classList.add("is-hovering");
                } else {
                    this.ring.classList.remove("is-hovering");
                }
            });

            document.addEventListener("mousedown", () => {
                this.ring.classList.add("is-clicking");
            });

            document.addEventListener("mouseup", () => {
                this.ring.classList.remove("is-clicking");
            });

            document.addEventListener("mouseleave", () => {
                this.dot.style.opacity = "0";
                this.ring.style.opacity = "0";
            });

            document.addEventListener("mouseenter", () => {
                this.dot.style.opacity = "1";
                this.ring.style.opacity = "1";
            });
        }

        render() {
            // Smooth linear interpolation for trailing ring
            this.ringX += (this.mouseX - this.ringX) * 0.18;
            this.ringY += (this.mouseY - this.ringY) * 0.18;

            this.ring.style.transform = `translate3d(${this.ringX}px, ${this.ringY}px, 0)`;
            requestAnimationFrame(() => this.render());
        }
    }

    /* ==========================================================================
       05. DYNAMIC TYPEWRITER & ROLE CYCLER
       ========================================================================== */
    class DynamicTypewriter {
        constructor(element, roles, wait = 2200) {
            this.element = element;
            this.roles = roles;
            this.wait = parseInt(wait, 10);
            this.roleIndex = 0;
            this.txt = "";
            this.isDeleting = false;
            this.type();
        }

        type() {
            const currentRole = this.roles[this.roleIndex % this.roles.length];

            if (this.isDeleting) {
                this.txt = currentRole.substring(0, this.txt.length - 1);
            } else {
                this.txt = currentRole.substring(0, this.txt.length + 1);
            }

            this.element.innerHTML = `<span class="typewriter-text">${this.txt}</span><span class="typewriter-cursor">|</span>`;

            let typeSpeed = this.isDeleting ? 40 : 80;

            if (!this.isDeleting && this.txt === currentRole) {
                typeSpeed = this.wait;
                this.isDeleting = true;
            } else if (this.isDeleting && this.txt === "") {
                this.isDeleting = false;
                this.roleIndex++;
                typeSpeed = 400;
            }

            setTimeout(() => this.type(), typeSpeed);
        }
    }

    /* ==========================================================================
       06. 3D CARD TILT WITH DYNAMIC SPECULAR LIGHT SHEEN
       ========================================================================== */
    function init3DTiltCards() {
        if (window.matchMedia("(pointer: coarse)").matches) return;

        const tiltElements = document.querySelectorAll(
            ".project-card, .skill-card, .focus-card, .hackathon-card, .lecture-card, .photo-area, .tilt-card"
        );

        tiltElements.forEach(card => {
            let glare = card.querySelector(".card-glare");
            if (!glare) {
                glare = document.createElement("div");
                glare.className = "card-glare";
                card.appendChild(glare);
            }

            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale3d(1.01, 1.01, 1.01)`;

                glare.style.opacity = "1";
                glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 242, 254, 0.22) 0%, rgba(255, 255, 255, 0.04) 40%, transparent 70%)`;
            });

            card.addEventListener("mouseleave", () => {
                card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)";
                glare.style.opacity = "0";
            });
        });
    }

    /* ==========================================================================
       07. REAL-TIME SYSTEM HUD (IST & UTC CLOCK + STATUS)
       ========================================================================== */
    function initSystemHUD() {
        const istElement = document.getElementById("hud-time-ist");
        const utcElement = document.getElementById("hud-time-utc");

        if (!istElement && !utcElement) return;

        function updateClock() {
            const now = new Date();

            if (istElement) {
                const istTime = now.toLocaleTimeString("en-US", {
                    timeZone: "Asia/Kolkata",
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                });
                istElement.textContent = `${istTime} IST`;
            }

            if (utcElement) {
                const utcTime = now.toLocaleTimeString("en-US", {
                    timeZone: "UTC",
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                });
                utcElement.textContent = `${utcTime} UTC`;
            }
        }

        updateClock();
        setInterval(updateClock, 1000);
    }

    /* ==========================================================================
       08. SCROLL PROGRESS BAR & BACK-TO-TOP BUTTON
       ========================================================================== */
    function initScrollProgressAndTopBtn() {
        // Create Scroll Progress Bar
        let progressBar = document.getElementById("scrollProgressBar");
        if (!progressBar) {
            progressBar = document.createElement("div");
            progressBar.id = "scrollProgressBar";
            progressBar.className = "scroll-progress-bar";
            document.body.prepend(progressBar);
        }

        // Create Back to Top button
        let topBtn = document.getElementById("backToTopBtn");
        if (!topBtn) {
            topBtn = document.createElement("button");
            topBtn.id = "backToTopBtn";
            topBtn.className = "back-to-top-btn";
            topBtn.setAttribute("aria-label", "Scroll back to top");
            topBtn.innerHTML = `
                <svg class="progress-ring" width="48" height="48" viewBox="0 0 48 48">
                    <circle class="progress-ring__circle" stroke="rgba(0, 242, 254, 0.2)" stroke-width="3" fill="transparent" r="20" cx="24" cy="24"/>
                    <circle class="progress-ring__bar" stroke="#00f2fe" stroke-width="3" fill="transparent" r="20" cx="24" cy="24"/>
                </svg>
                <span class="top-arrow">↑</span>
            `;
            document.body.appendChild(topBtn);
        }

        const circleBar = topBtn.querySelector(".progress-ring__bar");
        const radius = circleBar ? circleBar.r.baseVal.value : 20;
        const circumference = radius * 2 * Math.PI;

        if (circleBar) {
            circleBar.style.strokeDasharray = `${circumference} ${circumference}`;
            circleBar.style.strokeDashoffset = `${circumference}`;
        }

        function onScroll() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) : 0;

            progressBar.style.width = `${progress * 100}%`;

            if (circleBar) {
                const offset = circumference - (progress * circumference);
                circleBar.style.strokeDashoffset = offset;
            }

            if (scrollTop > 300) {
                topBtn.classList.add("is-visible");
            } else {
                topBtn.classList.remove("is-visible");
            }
        }

        window.addEventListener("scroll", onScroll, { passive: true });

        topBtn.addEventListener("click", () => {
            soundSystem.clickChime();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    /* ==========================================================================
       09. SCROLL REVEAL OBSERVER & ANIMATED STAT COUNTERS
       ========================================================================== */
    function initScrollRevealAndCounters() {
        const revealTargets = document.querySelectorAll(
            ".reveal, .section-heading, .about-content, .skill-card, .project-card, .hackathon-card, .lecture-card, .focus-card, .process-card, .contact-info, .contact-form-wrapper"
        );

        revealTargets.forEach(el => el.classList.add("reveal-element"));

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("reveal-active");
                    
                    // Trigger counters inside this section
                    const counters = entry.target.querySelectorAll(".counter-number");
                    counters.forEach(counter => animateCounter(counter));

                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        });

        revealTargets.forEach(el => observer.observe(el));
    }

    function animateCounter(counter) {
        if (counter.dataset.animated) return;
        counter.dataset.animated = "true";

        const target = parseInt(counter.dataset.target || counter.textContent, 10);
        if (isNaN(target)) return;

        const duration = 1600;
        const startTime = performance.now();
        const suffix = counter.dataset.suffix || "+";

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(ease * target);

            counter.textContent = currentVal + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target + suffix;
            }
        }

        requestAnimationFrame(update);
    }

    /* ==========================================================================
       10. MOBILE NAVIGATION DRAWER
       ========================================================================== */
    function initMobileNav() {
        const toggleBtn = document.querySelector(".mobile-toggle-btn");
        const drawer = document.querySelector(".mobile-nav-drawer");
        const overlay = document.querySelector(".mobile-nav-overlay");
        const links = document.querySelectorAll(".mobile-nav-drawer a");

        if (!toggleBtn || !drawer) return;

        function openMenu() {
            toggleBtn.classList.add("is-active");
            drawer.classList.add("is-open");
            if (overlay) overlay.classList.add("is-visible");
            document.body.style.overflow = "hidden";
        }

        function closeMenu() {
            toggleBtn.classList.remove("is-active");
            drawer.classList.remove("is-open");
            if (overlay) overlay.classList.remove("is-visible");
            document.body.style.overflow = "";
        }

        toggleBtn.addEventListener("click", () => {
            soundSystem.clickChime();
            if (drawer.classList.contains("is-open")) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        if (overlay) {
            overlay.addEventListener("click", closeMenu);
        }

        links.forEach(link => {
            link.addEventListener("click", closeMenu);
        });
    }

    /* ==========================================================================
       11. INTERACTIVE FILTER TABS (PROJECTS & SKILLS)
       ========================================================================== */
    function initFilterTabs() {
        const tabButtons = document.querySelectorAll(".filter-btn");

        tabButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                soundSystem.clickChime();
                const parent = btn.closest(".filter-container");
                if (!parent) return;

                parent.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const filterValue = btn.dataset.filter;
                const items = document.querySelectorAll(btn.dataset.target || ".filterable-item");

                items.forEach(item => {
                    const category = item.dataset.category || "";
                    if (filterValue === "all" || category.includes(filterValue)) {
                        item.classList.remove("is-hidden");
                        item.classList.add("is-visible");
                    } else {
                        item.classList.add("is-hidden");
                        item.classList.remove("is-visible");
                    }
                });
            });
        });
    }

    /* ==========================================================================
       12. PROJECT QUICK-VIEW MODAL
       ========================================================================== */
    function initProjectModal() {
        const modal = document.getElementById("projectModal");
        if (!modal) return;

        const closeBtn = modal.querySelector(".modal-close-btn");
        const overlay = modal.querySelector(".modal-backdrop");

        function closeModal() {
            modal.classList.remove("is-open");
            document.body.style.overflow = "";
        }

        if (closeBtn) closeBtn.addEventListener("click", closeModal);
        if (overlay) overlay.addEventListener("click", closeModal);

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modal.classList.contains("is-open")) {
                closeModal();
            }
        });

        // Trigger modal open from project cards with detail buttons
        document.querySelectorAll(".open-project-modal").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                soundSystem.clickChime();

                const card = btn.closest(".project-card");
                if (!card) return;

                const title = card.querySelector("h2, h3")?.textContent || "Project Details";
                const desc = card.querySelector(".project-full-desc")?.innerHTML || card.querySelector("p")?.innerHTML || "";
                const img = card.querySelector("img")?.src || "";
                const tech = card.querySelector(".project-tech")?.innerHTML || "";
                const link = card.querySelector(".project-link a")?.href || "#";

                modal.querySelector(".modal-title").textContent = title;
                modal.querySelector(".modal-desc").innerHTML = desc;
                modal.querySelector(".modal-image").src = img;
                modal.querySelector(".modal-tech").innerHTML = tech;
                const liveBtn = modal.querySelector(".modal-live-link");
                if (liveBtn) liveBtn.href = link;

                modal.classList.add("is-open");
                document.body.style.overflow = "hidden";
            });
        });
    }

    /* ==========================================================================
       13. CONFETTI CELEBRATION CANNON & AJAX CONTACT FORM
       ========================================================================== */
    function fireConfetti() {
        let canvas = document.getElementById("confettiCanvas");
        if (!canvas) {
            canvas = document.createElement("canvas");
            canvas.id = "confettiCanvas";
            canvas.className = "confetti-canvas";
            document.body.appendChild(canvas);
        }

        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const pieces = [];
        const colors = ["#00f2fe", "#4facfe", "#ff007a", "#7928ca", "#50e98b", "#ffbe0b"];

        for (let i = 0; i < 90; i++) {
            pieces.push({
                x: canvas.width / 2,
                y: canvas.height * 0.7,
                vx: (Math.random() - 0.5) * 16,
                vy: (Math.random() - 0.8) * 16,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 10,
                alpha: 1,
                decay: Math.random() * 0.015 + 0.008
            });
        }

        let animId;
        function update() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = false;

            for (let i = 0; i < pieces.length; i++) {
                const p = pieces[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.35; // Gravity
                p.rotation += p.rotSpeed;
                p.alpha -= p.decay;

                if (p.alpha > 0) {
                    alive = true;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = p.alpha;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                    ctx.restore();
                }
            }

            if (alive) {
                animId = requestAnimationFrame(update);
            } else {
                cancelAnimationFrame(animId);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.remove();
            }
        }

        animId = requestAnimationFrame(update);
    }

    function initContactForm() {
        const form = document.getElementById("contactForm");
        if (!form) return;

        form.addEventListener("submit", async function (e) {
            e.preventDefault();
            soundSystem.clickChime();

            const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
            const originalText = submitBtn ? submitBtn.innerHTML : "Transmit Message";

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <span class="spinner-ring"></span>
                    <span>Transmitting Signal...</span>
                `;
            }

            const formData = new FormData(form);

            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    soundSystem.successArpeggio();
                    fireConfetti();
                    showToast("🚀 Message Transmitted! I will connect with you soon.");

                    form.reset();

                    // Show success status banner inside form
                    let banner = form.querySelector(".form-status-banner");
                    if (!banner) {
                        banner = document.createElement("div");
                        banner.className = "form-status-banner is-success";
                        form.prepend(banner);
                    }
                    banner.innerHTML = `
                        <div class="banner-icon">✓</div>
                        <div class="banner-text">
                            <strong>Transmission Successful!</strong>
                            <p>Thank you for reaching out. Uttakaladeba will review your message and reply promptly.</p>
                        </div>
                    `;

                    setTimeout(() => {
                        if (banner) banner.remove();
                    }, 8000);
                } else {
                    showToast("❌ Unable to transmit message. Please try again.");
                }
            } catch (err) {
                showToast("⚠️ Network transmission error. Please reach out via email directly.");
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            }
        });
    }

    /* ==========================================================================
       14. COPY TO CLIPBOARD HELPER & TERMINAL TABS
       ========================================================================== */
    function initCopyHelpers() {
        document.querySelectorAll("[data-copy]").forEach(el => {
            el.addEventListener("click", (e) => {
                e.preventDefault();
                soundSystem.clickChime();
                const text = el.dataset.copy;
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(text).then(() => {
                        showToast(`Copied to clipboard: ${text} 📋`);
                    });
                }
            });
        });
    }

    function initTerminalTabs() {
        document.querySelectorAll(".terminal-tab-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                soundSystem.clickChime();
                const terminal = btn.closest(".cyber-terminal");
                if (!terminal) return;

                terminal.querySelectorAll(".terminal-tab-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const targetTab = btn.dataset.tab;
                terminal.querySelectorAll(".terminal-pane").forEach(pane => {
                    if (pane.id === targetTab) {
                        pane.classList.add("active");
                    } else {
                        pane.classList.remove("active");
                    }
                });
            });
        });

        document.querySelectorAll(".terminal-copy-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                soundSystem.clickChime();
                const terminal = btn.closest(".cyber-terminal");
                const activePane = terminal?.querySelector(".terminal-pane.active code") || terminal?.querySelector(".terminal-body");
                if (activePane && navigator.clipboard) {
                    navigator.clipboard.writeText(activePane.innerText).then(() => {
                        showToast("Terminal code copied to clipboard! 📋");
                    });
                }
            });
        });
    }

    /* ==========================================================================
       16. EMBEDDED CYBER AI AGENT (UG-AI KNOWLEDGE ASSISTANT)
       ========================================================================== */
    class CyberAIAgent {
        constructor() {
            this.isOpen = false;
            this.knowledgeBase = this.initKnowledgeBase();
            this.mountUI();
            this.bindEvents();
        }

        initKnowledgeBase() {
            return {
                bio: {
                    name: "Uttakaladeba Garnaik",
                    role: "B.Tech CSE Student, Aspiring Data Analyst & Systems Builder",
                    institution: "Nalanda Institute of Technology, Bhubaneswar",
                    location: "Bhubaneswar, Odisha, India",
                    mindset: "Learn continuously. Analyze deeply. Build practically. Improve consistently.",
                    status: "B.Tech CSE · Aspiring Data Analyst · Cyber Security & Systems · AI-Powered Builder · Hackathon Participant"
                },
                dataAnalytics: {
                    skills: ["SQL", "MySQL", "PostgreSQL", "Microsoft Excel", "Python", "NumPy", "Pandas", "PowerBI", "Exploratory Data Analysis (EDA)", "Data Cleaning", "Data Visualization", "Statistical Insights"],
                    vision: "Transforming raw, unstructured data into actionable insights, automated dashboards, and strategic business intelligence decisions."
                },
                cyberSecurity: {
                    skills: ["Linux CLI & Administration", "Computer Networking (TCP/IP, DNS, OSI Layers)", "Operating Systems Internals", "Process Isolation & Memory Architecture", "Bash / Shell Scripting", "Defensive Security & Secure Coding"],
                    vision: "Understanding low-level systems, networking packets, and OS kernels to build secure, hardened, and resilient digital architectures."
                },
                projects: [
                    {
                        name: "EMPAIR — Personal Life OS",
                        category: "Full-Stack Web & Productivity",
                        tech: "React, Node.js, PostgreSQL, Express",
                        desc: "A centralized Life Operating System engineered for engineering students to track attendance thresholds, schedule daily study sprints, manage routines, and boost cognitive productivity."
                    },
                    {
                        name: "Landsafe-NER — Landslide Risk Monitoring",
                        category: "AI & Early Warning Telemetry",
                        tech: "Node.js, Express, MongoDB, GIS Mapping",
                        desc: "An AI-powered landslide risk monitoring and early-warning telemetry system for mountainous Northeast India. Competed and advanced as Finalist in the Internal Smart India Hackathon (SIH 2026) with team 'Last Minute Pushers'."
                    },
                    {
                        name: "JARVIS Mark-VII — Desktop Agent",
                        category: "Personal Automation & Desktop AI",
                        tech: "Python, Voice/Text UI, System Automation, OS Telemetry",
                        desc: "An intelligent personal desktop assistant capable of natural voice and keystroke automation, system telemetry diagnostics (CPU, RAM, network), and workspace workflow triggers."
                    },
                    {
                        name: "Portfolio Website",
                        category: "Cyber Glassmorphism Web App",
                        tech: "HTML5, CSS3 Glassmorphism, Vanilla JS, Web Audio API, Canvas 2D",
                        desc: "A high-performance cyberpunk portfolio engineered with 3D perspective tilts, real-time particle constellation canvas, native sound synthesizers, and this embedded AI Agent!"
                    }
                ],
                hackathons: {
                    sih: "Finalist in Internal Selection Round for Smart India Hackathon (SIH 2026) with team 'Last Minute Pushers'.",
                    experience: "3+ competitive hackathons with 48-hour continuous rapid MVP sprint stamina.",
                    form: "https://docs.google.com/forms/d/e/1FAIpQLSdCrDpJFta8WveMqcclIFYzWyv9JtLURT3BA-A9Ja3BnQ5rNg/viewform?usp=publish-editor"
                },
                youtube: {
                    channel: "@uttakaladeba",
                    url: "https://www.youtube.com/@uttakaladeba",
                    details: "Free Python programming video lectures covering Introduction, Variables, Data Types, Strings, Input & Type Casting, and Arithmetic Operators with downloadable Google Drive study notes."
                },
                socials: {
                    github: "https://github.com/uttakaladebagarnaik",
                    linkedin: "https://www.linkedin.com/feed/",
                    youtube: "https://www.youtube.com/@uttakaladeba",
                    instagram: "https://www.instagram.com/uttakala_deba/"
                }
            };
        }

        mountUI() {
            // Launcher Button
            this.launcher = document.createElement("div");
            this.launcher.className = "ai-agent-launcher";
            this.launcher.setAttribute("title", "Ask UG-AI Assistant");
            this.launcher.innerHTML = `
                <span class="ai-launcher-icon">🤖</span>
                <span class="ai-launcher-radar"></span>
                <div class="ai-launcher-tooltip">Ask UG-AI Assistant 💬</div>
            `;
            document.body.appendChild(this.launcher);

            // Chat Window
            this.chatWindow = document.createElement("div");
            this.chatWindow.className = "ai-chat-window";
            this.chatWindow.innerHTML = `
                <div class="ai-chat-header">
                    <div class="ai-header-left">
                        <div class="ai-header-avatar">🤖</div>
                        <div class="ai-header-info">
                            <div class="ai-header-title">UG-AI <span>// Assistant</span></div>
                            <div class="ai-header-status">
                                <span class="radar-dot"></span>
                                <span>ONLINE · KNOWLEDGE BASE ACTIVE</span>
                            </div>
                        </div>
                    </div>
                    <div class="ai-header-actions">
                        <button class="ai-btn-icon ai-clear-btn" title="Clear Chat History">🗑️</button>
                        <button class="ai-btn-icon ai-close-btn" title="Close Assistant">✕</button>
                    </div>
                </div>

                <div class="ai-quick-prompts-wrap">
                    <span class="ai-prompt-chip" data-query="Who is Uttakaladeba?">💡 Who is Uttakaladeba?</span>
                    <span class="ai-prompt-chip" data-query="Tell me about his Data Analytics focus">📊 Data Analytics Focus</span>
                    <span class="ai-prompt-chip" data-query="What does he know about Cyber Security, Linux & Networking?">🛡️ Cyber Security & Linux</span>
                    <span class="ai-prompt-chip" data-query="Tell me about his featured projects">🚀 Featured Projects</span>
                    <span class="ai-prompt-chip" data-query="SIH Hackathon 2026 achievements">🏆 SIH Hackathon 2026</span>
                    <span class="ai-prompt-chip" data-query="Where can I watch his YouTube Python tutorials?">🎥 YouTube & Notes</span>
                    <span class="ai-prompt-chip" data-query="What is his Vibe Coding philosophy?">⚡ Vibe Coding Philosophy</span>
                    <span class="ai-prompt-chip" data-query="How can I contact him?">✉️ How to Contact</span>
                </div>

                <div class="ai-chat-messages" id="aiChatMessages">
                    <div class="ai-msg ai-msg-agent">
                        <div class="ai-msg-avatar">UG</div>
                        <div class="ai-msg-bubble">
                            <strong>Greetings! I am UG-AI</strong>, the dedicated personal intelligence assistant for <strong>Uttakaladeba Garnaik</strong>.
                            <br><br>
                            I know everything about his career path in <strong>Data Analytics</strong>, <strong>Cyber Security & Linux</strong> systems, featured projects (<em>EMPAIR, Landsafe-NER, JARVIS</em>), <strong>SIH 2026 Hackathons</strong>, and free <strong>YouTube Python series</strong>!
                            <br><br>
                            Tap any prompt above or type your question below (English or Hindi)!
                        </div>
                    </div>
                </div>

                <div class="ai-chat-footer">
                    <form class="ai-input-form" id="aiChatForm">
                        <input type="text" class="ai-chat-input" id="aiChatInput" placeholder="Ask anything about Uttakaladeba..." autocomplete="off">
                        <button type="submit" class="ai-send-btn" aria-label="Send Message">↗</button>
                    </form>
                </div>
            `;
            document.body.appendChild(this.chatWindow);

            this.messagesContainer = this.chatWindow.querySelector("#aiChatMessages");
            this.input = this.chatWindow.querySelector("#aiChatInput");
            this.form = this.chatWindow.querySelector("#aiChatForm");
        }

        bindEvents() {
            this.launcher.addEventListener("click", () => {
                soundSystem.clickChime();
                this.toggle();
            });

            this.chatWindow.querySelector(".ai-close-btn").addEventListener("click", () => {
                soundSystem.clickChime();
                this.close();
            });

            this.chatWindow.querySelector(".ai-clear-btn").addEventListener("click", () => {
                soundSystem.clickChime();
                this.messagesContainer.innerHTML = `
                    <div class="ai-msg ai-msg-agent">
                        <div class="ai-msg-avatar">UG</div>
                        <div class="ai-msg-bubble">
                            Chat history cleared. How can I assist you with Uttakaladeba's profile today?
                        </div>
                    </div>
                `;
            });

            this.chatWindow.querySelectorAll(".ai-prompt-chip").forEach(chip => {
                chip.addEventListener("click", () => {
                    soundSystem.clickChime();
                    const query = chip.dataset.query;
                    this.handleUserQuery(query);
                });
            });

            this.form.addEventListener("submit", (e) => {
                e.preventDefault();
                const query = this.input.value.trim();
                if (!query) return;
                this.handleUserQuery(query);
                this.input.value = "";
            });
        }

        toggle() {
            if (this.isOpen) this.close();
            else this.open();
        }

        open() {
            this.isOpen = true;
            this.chatWindow.classList.add("is-open");
            setTimeout(() => this.input.focus(), 300);
        }

        close() {
            this.isOpen = false;
            this.chatWindow.classList.remove("is-open");
        }

        handleUserQuery(query) {
            // Append User Message
            this.appendMessage(query, "user");

            // Show Typing Indicator
            const typingEl = document.createElement("div");
            typingEl.className = "ai-msg ai-msg-agent ai-typing-wrapper";
            typingEl.innerHTML = `
                <div class="ai-msg-avatar">UG</div>
                <div class="ai-typing-dots">
                    <span class="ai-typing-dot"></span>
                    <span class="ai-typing-dot"></span>
                    <span class="ai-typing-dot"></span>
                </div>
            `;
            this.messagesContainer.appendChild(typingEl);
            this.scrollToBottom();

            // Simulate intelligent cognitive delay
            setTimeout(() => {
                typingEl.remove();
                const responseHtml = this.generateResponse(query);
                this.appendMessage(responseHtml, "agent");
                soundSystem.hoverBlip();
            }, 400);
        }

        appendMessage(content, sender) {
            const msgEl = document.createElement("div");
            msgEl.className = `ai-msg ai-msg-${sender}`;

            if (sender === "user") {
                msgEl.innerHTML = `<div class="ai-msg-bubble">${this.escapeHTML(content)}</div>`;
            } else {
                msgEl.innerHTML = `
                    <div class="ai-msg-avatar">UG</div>
                    <div class="ai-msg-bubble">${content}</div>
                `;
            }

            this.messagesContainer.appendChild(msgEl);
            this.scrollToBottom();
        }

        scrollToBottom() {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }

        escapeHTML(str) {
            return str.replace(/[&<>'"]/g, tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag));
        }

        generateResponse(rawQuery) {
            const q = rawQuery.toLowerCase();
            const kb = this.knowledgeBase;

            // 1. Data Analytics Queries
            if (q.includes("data") || q.includes("analytic") || q.includes("sql") || q.includes("excel") || q.includes("pandas") || q.includes("numpy") || q.includes("powerbi") || q.includes("eda") || q.includes("clean") || q.includes("mysql") || q.includes("postgres")) {
                return `
                    <strong>📊 Data Analytics (Primary Career Direction):</strong>
                    <br><br>
                    Uttakaladeba's core career goal is to become a high-impact <strong>Data Analyst</strong>. He excels at turning raw numbers into strategic business insights.
                    <br><br>
                    <strong>Core Analytical Stack:</strong>
                    <ul>
                        <li><strong>SQL & Databases:</strong> Relational design, complex joins, subqueries, and aggregation optimization in <em>MySQL</em> and <em>PostgreSQL</em>.</li>
                        <li><strong>Excel & PowerBI:</strong> Data modeling, advanced formula logic, KPI tracking, and interactive business reporting.</li>
                        <li><strong>Python for Analytics:</strong> <em>NumPy</em> for high-performance numerical arrays and <em>Pandas</em> for exploratory data analysis (EDA) and data wrangling.</li>
                        <li><strong>Data Cleaning & Visualization:</strong> Normalizing noisy datasets and crafting intuitive visual dashboards.</li>
                    </ul>
                    Check out his full skills matrix on <a href="skills.html">Skills Page ↗</a>!
                `;
            }

            // 2. Cyber Security, Linux, Networking & OS Queries
            if (q.includes("cyber") || q.includes("security") || q.includes("linux") || q.includes("network") || q.includes("tcp") || q.includes("dns") || q.includes("os") || q.includes("operating system") || q.includes("bash") || q.includes("shell") || q.includes("kernel")) {
                return `
                    <strong>🛡️ Cyber Security, Linux & Systems Exploration:</strong>
                    <br><br>
                    Uttakaladeba maintains deep curiosity and literacy in low-level systems and defensive security architectures:
                    <br><br>
                    <ul>
                        <li><strong>Linux CLI & Shell:</strong> Command-line mastery, file hierarchy management, access permissions, systemd process management, and Bash scripting.</li>
                        <li><strong>Computer Networking:</strong> TCP/IP stack handshake, DNS resolution, OSI layers, port routing, and socket communication.</li>
                        <li><strong>Operating Systems Internals:</strong> Process scheduling, virtual memory, memory management, and thread safety.</li>
                        <li><strong>Defensive Mindset:</strong> Hardening APIs, input sanitization to eliminate SQL injection, and enforcing least-privilege policies across applications.</li>
                    </ul>
                    Read his thoughts on this in Section 03 of <a href="about.html">About Page ↗</a>!
                `;
            }

            // 3. Projects Queries
            if (q.includes("project") || q.includes("empair") || q.includes("landsafe") || q.includes("landslide") || q.includes("jarvis") || q.includes("work") || q.includes("build")) {
                return `
                    <strong>🚀 Featured Projects by Uttakaladeba:</strong>
                    <br><br>
                    <ul>
                        <li><strong>EMPAIR — Personal Life OS:</strong> A holistic web app designed for college students to calculate attendance thresholds, organize sprint timetables, and schedule tasks (React, Node.js, PostgreSQL).</li>
                        <li><strong>Landsafe-NER — Landslide Risk Monitoring:</strong> AI-based early warning telemetry system for Northeast India. Selected as Finalist in Internal Smart India Hackathon (SIH 2026) with team <em>Last Minute Pushers</em> (Node.js, MongoDB, GIS).</li>
                        <li><strong>JARVIS Mark-VII — Desktop Agent:</strong> A personal intelligent assistant featuring speech/text triggers, PC automation, and real-time CPU/RAM telemetry monitoring (Python).</li>
                        <li><strong>Portfolio Website:</strong> Cyber glassmorphism platform with 3D tilts, Web Audio API, and this AI Agent.</li>
                    </ul>
                    Explore all projects and screenshots on <a href="projects.html">Projects Page ↗</a>!
                `;
            }

            // 4. Hackathons & SIH 2026 Queries
            if (q.includes("hackathon") || q.includes("sih") || q.includes("smart india") || q.includes("pushers") || q.includes("last minute") || q.includes("team") || q.includes("sprint")) {
                return `
                    <strong>🏆 Hackathon Journey & SIH 2026:</strong>
                    <br><br>
                    Uttakaladeba thrives in rapid 24-48 hour prototyping sprints:
                    <ul>
                        <li><strong>Internal SIH 2026 Finalist:</strong> Competed with team <em>Last Minute Pushers</em>, building the <strong>Landsafe-NER</strong> early-warning landslide telemetry prototype.</li>
                        <li><strong>3+ Hackathons Competed:</strong> Extensive experience in translating complex problem statements into functional MVPs under tight deadlines.</li>
                        <li><strong>Join His Team:</strong> He is actively assembling talented teammates for upcoming national and state hackathons!</li>
                    </ul>
                    <a href="${kb.hackathons.form}" target="_blank" rel="noopener noreferrer">Apply to Join His Hackathon Team ↗</a> or view <a href="hackathons.html">Hackathons Page ↗</a>!
                `;
            }

            // 5. Education & College Queries
            if (q.includes("college") || q.includes("university") || q.includes("nalanda") || q.includes("bhubaneswar") || q.includes("btech") || q.includes("b.tech") || q.includes("cse") || q.includes("degree") || q.includes("study") || q.includes("padhta")) {
                return `
                    <strong>🎓 Academic Track & College:</strong>
                    <br><br>
                    Uttakaladeba is currently pursuing his <strong>B.Tech in Computer Science Engineering (2026 - Present)</strong> at <strong>Nalanda Institute of Technology, Bhubaneswar</strong>, Odisha, India.
                    <br><br>
                    Beyond university coursework, he dedicates his time to independent project building, Data Analytics masterclasses, cybersecurity literacy, and hackathons.
                `;
            }

            // 6. YouTube & Learn With Me Queries
            if (q.includes("youtube") || q.includes("yt") || q.includes("learn") || q.includes("video") || q.includes("lecture") || q.includes("note") || q.includes("tutorial") || q.includes("channel")) {
                return `
                    <strong>🎥 Learn With Me & Free Python Series:</strong>
                    <br><br>
                    Uttakaladeba passionately teaches programming for free on his YouTube channel <a href="${kb.youtube.url}" target="_blank" rel="noopener noreferrer">@uttakaladeba ↗</a>!
                    <br><br>
                    <strong>Available Lessons:</strong>
                    <ul>
                        <li>Lecture 01: Introduction to Python</li>
                        <li>Lecture 02: Variables & Data Types</li>
                        <li>Lecture 03: Input & Type Casting</li>
                        <li>Lecture 04: Python Arithmetic Operators</li>
                    </ul>
                    Every lecture includes downloadable Google Drive notes! Stream videos directly on <a href="learn.html">Learn Page ↗</a>.
                `;
            }

            // 7. AI-Assisted Development & Vibe Coding Queries
            if (q.includes("vibe") || q.includes("ai") || q.includes("prompt") || q.includes("tool") || q.includes("chatgpt") || q.includes("copilot")) {
                return `
                    <strong>⚡ AI-Assisted Development & Vibe Coding:</strong>
                    <br><br>
                    Uttakaladeba leverages modern AI tools to accelerate development velocity, prototype architectures in hours, and brainstorm ideas.
                    <br><br>
                    <em>"For me, AI is not a replacement for learning or problem-solving. It is a powerful co-pilot that helps me build faster, troubleshoot errors, and experiment efficiently while I master the underlying logic."</em>
                `;
            }

            // 8. Contact & Hiring Queries
            if (q.includes("contact") || q.includes("hire") || q.includes("email") || q.includes("social") || q.includes("github") || q.includes("linkedin") || q.includes("instagram") || q.includes("reach") || q.includes("message") || q.includes("collaborat")) {
                return `
                    <strong>✉️ Connect With Uttakaladeba:</strong>
                    <br><br>
                    He is actively open for <strong>Data Analyst Internships, Hackathons, Project Collaborations, and Freelance Work</strong>!
                    <br><br>
                    <ul>
                        <li><strong>GitHub:</strong> <a href="${kb.socials.github}" target="_blank" rel="noopener noreferrer">github.com/uttakaladebagarnaik ↗</a></li>
                        <li><strong>LinkedIn:</strong> <a href="${kb.socials.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn Profile ↗</a></li>
                        <li><strong>YouTube:</strong> <a href="${kb.socials.youtube}" target="_blank" rel="noopener noreferrer">@uttakaladeba ↗</a></li>
                        <li><strong>Instagram:</strong> <a href="${kb.socials.instagram}" target="_blank" rel="noopener noreferrer">@uttakala_deba ↗</a></li>
                    </ul>
                    Or send a direct message via the <a href="contact.html">Contact Form ↗</a>!
                `;
            }

            // 9. Identity & Bio (Who is he / Mindset)
            if (q.includes("who") || q.includes("koun") || q.includes("kya") || q.includes("about") || q.includes("bio") || q.includes("mindset") || q.includes("philosophy") || q.includes("hello") || q.includes("hi") || q.includes("hey") || q.includes("namaste") || q.includes("bro")) {
                return `
                    <strong>👋 Hello! I'm UG-AI, assistant to Uttakaladeba Garnaik:</strong>
                    <br><br>
                    Uttakaladeba is a Computer Science Engineering student from Bhubaneswar, India, an <strong>Aspiring Data Analyst</strong>, and an enthusiastic builder in full-stack web and cybersecurity systems.
                    <br><br>
                    <strong>Core Mindset:</strong>
                    <br>
                    <em>"${kb.bio.mindset}"</em>
                    <br><br>
                    What would you like to explore?
                    <ul>
                        <li>📊 His Data Analytics Stack</li>
                        <li>🛡️ Cyber Security & Linux knowledge</li>
                        <li>🚀 Projects (EMPAIR, Landsafe-NER, JARVIS)</li>
                        <li>🏆 SIH 2026 Hackathon experience</li>
                    </ul>
                `;
            }

            // Fallback
            return `
                I understand you're asking about <em>"${this.escapeHTML(rawQuery)}"</em>.
                <br><br>
                Here is what I can tell you about <strong>Uttakaladeba Garnaik</strong>:
                <ul>
                    <li><strong>Data Analytics Focus:</strong> SQL, MySQL, PostgreSQL, Excel, Python (NumPy, Pandas), PowerBI, and EDA.</li>
                    <li><strong>Cyber Security & Systems:</strong> Linux command line, TCP/IP networking, and OS architecture.</li>
                    <li><strong>Projects:</strong> EMPAIR Life OS, Landsafe-NER (SIH Finalist), and JARVIS Mark-VII.</li>
                    <li><strong>Education:</strong> B.Tech CSE at Nalanda Institute of Technology, Bhubaneswar.</li>
                </ul>
                Would you like to know more about his <strong>Data Analytics</strong>, <strong>Cyber Security</strong>, or <strong>Projects</strong>?
            `;
        }
    }
    document.addEventListener("DOMContentLoaded", () => {
        // Dynamic Typewriter on Hero
        const typewriterTarget = document.getElementById("heroTypewriter");
        if (typewriterTarget) {
            new DynamicTypewriter(typewriterTarget, [
                "Aspiring Data Analyst 📊",
                "B.Tech CSE Student 🎓",
                "Cyber Security & Systems 🛡️",
                "Smart India Hackathon Finalist ⚡",
                "AI & Full-Stack Builder 💻",
                "Lifelong Tech Explorer 🚀"
            ], 2400);
        }

        // Particle Canvas
        new CyberCanvas();

        // Custom Neon Cursor
        new CyberCursor();

        // 3D Card Tilt with Specular Glare
        init3DTiltCards();

        // System HUD Clock
        initSystemHUD();

        // Scroll Progress & Back to Top
        initScrollProgressAndTopBtn();

        // Scroll Reveal & Stats Counters
        initScrollRevealAndCounters();

        // Mobile Nav Drawer
        initMobileNav();

        // Filter Tabs
        initFilterTabs();

        // Project Quick-View Modal
        initProjectModal();

        // Contact Form
        initContactForm();

        // Copy Helpers & Terminal Tabs
        initCopyHelpers();
        initTerminalTabs();

        // Launch Cyber AI Agent Knowledge Assistant
        new CyberAIAgent();

        // Smooth Scroll on Internal Anchor Links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener("click", function (e) {
                const targetId = this.getAttribute("href");
                if (!targetId || targetId === "#") return;
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    soundSystem.clickChime();
                    targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            });
        });

        // Dynamic Year
        document.querySelectorAll(".current-year").forEach(el => {
            el.textContent = new Date().getFullYear();
        });
    });

})();
