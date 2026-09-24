/**
 * ============================================================================
 * VFX & 3D GRAPHICAL SUITE — ULTRA-MODERN PORTFOLIO ENGINE (V2 UPGRADE)
 * Smooth 3D Particle Constellations, Fluid Quantum Waves,
 * 3D Physics Tilt, Particle Sparkle Trails, Holographic Reflections
 * (Unwanted HUD, ticker overlays, and wireframe polyhedra removed)
 * ============================================================================
 */

(function () {
  'use strict';

  // --- High-Performance 3D Particle & Quantum Energy Canvas ---
  class VFX3DCanvas {
    constructor() {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'vfx-bg-canvas';
      document.body.prepend(this.canvas);
      this.ctx = this.canvas.getContext('2d');

      this.width = (this.canvas.width = window.innerWidth);
      this.height = (this.canvas.height = window.innerHeight);

      this.particles = [];
      this.particleCount = Math.min(Math.floor(window.innerWidth / 14), 95);
      this.mouse = {
        x: this.width / 2,
        y: this.height / 2,
        targetX: this.width / 2,
        targetY: this.height / 2,
        active: false,
        radius: 170
      };

      this.waveTime = 0;

      this.initParticles();
      this.bindEvents();
      this.render();
    }

    bindEvents() {
      window.addEventListener('resize', () => {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        this.initParticles();
      });

      window.addEventListener('mousemove', (e) => {
        this.mouse.targetX = e.clientX;
        this.mouse.targetY = e.clientY;
        this.mouse.active = true;
      });

      window.addEventListener('mouseleave', () => {
        this.mouse.active = false;
      });
    }

    initParticles() {
      this.particles = [];
      const palette = ['#c8f135', '#00f0ff', '#7b61ff', '#00d4aa', '#ff5e3a'];

      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push({
          x: (Math.random() - 0.5) * this.width * 1.6,
          y: (Math.random() - 0.5) * this.height * 1.6,
          z: Math.random() * 700 + 50, // 3D depth
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7,
          vz: (Math.random() - 0.5) * 0.4,
          color: palette[Math.floor(Math.random() * palette.length)],
          baseRadius: Math.random() * 2.2 + 1.2,
          pulseSpeed: Math.random() * 0.03 + 0.015,
          pulsePhase: Math.random() * Math.PI * 2
        });
      }
    }

    project(x, y, z, fov = 420) {
      const scale = fov / (fov + z);
      const projX = x * scale + this.width / 2;
      const projY = y * scale + this.height / 2;
      return { x: projX, y: projY, scale };
    }

    render() {
      this.waveTime += 0.012;

      // Smooth mouse easing
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

      this.ctx.clearRect(0, 0, this.width, this.height);

      // --- 1. Ambient Dynamic Quantum Nebula Energy Glows ---
      this.drawAmbientGlow();

      // --- 2. 3D Particle Constellation Nodes & Connective Beams ---
      const fov = 420;
      const mouseOffsetX = (this.mouse.x - this.width / 2) * 0.12;
      const mouseOffsetY = (this.mouse.y - this.height / 2) * 0.12;

      const projected = [];

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.pulsePhase += p.pulseSpeed;

        // 3D toroidal wrap
        if (p.z <= 10) p.z = 700;
        if (p.z > 700) p.z = 10;
        if (p.x < -this.width) p.x = this.width;
        if (p.x > this.width) p.x = -this.width;
        if (p.y < -this.height) p.y = this.height;
        if (p.y > this.height) p.y = -this.height;

        const pr = this.project(p.x - mouseOffsetX, p.y - mouseOffsetY, p.z, fov);

        // Smooth cursor repulsion in 3D
        if (this.mouse.active) {
          const dx = this.mouse.x - pr.x;
          const dy = this.mouse.y - pr.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < this.mouse.radius) {
            const force = (this.mouse.radius - dist) / this.mouse.radius;
            p.x -= (dx / dist) * force * 4.5;
            p.y -= (dy / dist) * force * 4.5;
          }
        }

        projected.push(pr);

        // Render glowing particle
        const depthAlpha = Math.max(0.18, Math.min(0.95, (1 - p.z / 700) * 0.95));
        const pulse = 1 + Math.sin(p.pulsePhase) * 0.25;
        const radius = Math.max(0.9, p.baseRadius * pr.scale * pulse);

        this.ctx.beginPath();
        this.ctx.arc(pr.x, pr.y, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = depthAlpha;
        this.ctx.shadowBlur = 12;
        this.ctx.shadowColor = p.color;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
      }

      // Connective 3D neon laser threads
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const orig1 = this.particles[i];
          const orig2 = this.particles[j];

          const zDist = Math.abs(orig1.z - orig2.z);
          if (zDist > 180) continue;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 115) {
            const lineAlpha = (1 - dist / 115) * (1 - orig1.z / 700) * 0.4;
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = orig1.color;
            this.ctx.globalAlpha = lineAlpha;
            this.ctx.lineWidth = 0.85;
            this.ctx.stroke();
          }
        }
      }

      this.ctx.globalAlpha = 1;
      requestAnimationFrame(() => this.render());
    }

    drawAmbientGlow() {
      // Soft flowing nebula energy gradients
      const g1 = this.ctx.createRadialGradient(
        this.width * 0.25 + Math.sin(this.waveTime * 0.5) * 80,
        this.height * 0.3 + Math.cos(this.waveTime * 0.6) * 60,
        20,
        this.width * 0.25,
        this.height * 0.3,
        this.width * 0.5
      );
      g1.addColorStop(0, 'rgba(123, 97, 255, 0.045)');
      g1.addColorStop(1, 'rgba(9, 9, 14, 0)');
      this.ctx.fillStyle = g1;
      this.ctx.fillRect(0, 0, this.width, this.height);

      const g2 = this.ctx.createRadialGradient(
        this.width * 0.75 + Math.cos(this.waveTime * 0.7) * 90,
        this.height * 0.65 + Math.sin(this.waveTime * 0.5) * 70,
        20,
        this.width * 0.75,
        this.height * 0.65,
        this.width * 0.45
      );
      g2.addColorStop(0, 'rgba(0, 240, 255, 0.04)');
      g2.addColorStop(1, 'rgba(9, 9, 14, 0)');
      this.ctx.fillStyle = g2;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  // --- High-Tech Cyber Laser Cursor & Sparkle Particles ---
  class CyberCursor {
    constructor() {
      if (window.innerWidth < 768) return; // Touch screens skip custom cursor

      this.dot = document.createElement('div');
      this.dot.className = 'vfx-cursor-dot';
      this.ring = document.createElement('div');
      this.ring.className = 'vfx-cursor-ring';

      document.body.appendChild(this.dot);
      document.body.appendChild(this.ring);

      this.x = window.innerWidth / 2;
      this.y = window.innerHeight / 2;
      this.ringX = this.x;
      this.ringY = this.y;

      this.sparks = [];

      this.bindEvents();
      this.render();
    }

    bindEvents() {
      window.addEventListener('mousemove', (e) => {
        this.x = e.clientX;
        this.y = e.clientY;
        this.dot.style.left = `${this.x}px`;
        this.dot.style.top = `${this.y}px`;

        // Emit subtle spark on movement
        if (Math.random() > 0.6) {
          this.createSpark(this.x, this.y);
        }
      });

      // Hover aura over interactive elements
      const interactiveElements = 'a, button, input, .project-entry, .acad-item, .vfx-tilt-card, .sk-word-wrap, .cat-pill, .worker-card';
      document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveElements)) {
          this.ring.classList.add('active');
          this.dot.classList.add('active');
        }
      });

      document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveElements)) {
          this.ring.classList.remove('active');
          this.dot.classList.remove('active');
        }
      });

      // Click shockwave ripple
      window.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.className = 'vfx-ripple';
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);

        for (let k = 0; k < 6; k++) {
          this.createSpark(e.clientX, e.clientY, true);
        }
      });
    }

    createSpark(x, y, burst = false) {
      const spark = document.createElement('div');
      spark.className = 'vfx-spark';
      const size = burst ? Math.random() * 4 + 2 : Math.random() * 2.5 + 1.5;
      const angle = Math.random() * Math.PI * 2;
      const velocity = burst ? Math.random() * 45 + 15 : Math.random() * 20 + 8;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;

      spark.style.width = `${size}px`;
      spark.style.height = `${size}px`;
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      spark.style.setProperty('--tx', `${tx}px`);
      spark.style.setProperty('--ty', `${ty}px`);

      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 500);
    }

    render() {
      this.ringX += (this.x - this.ringX) * 0.2;
      this.ringY += (this.y - this.ringY) * 0.2;

      this.ring.style.left = `${this.ringX}px`;
      this.ring.style.top = `${this.ringY}px`;

      requestAnimationFrame(() => this.render());
    }
  }

  // --- Real-time 3D Card Physics Tilt with Dynamic Specular Glare ---
  function init3DCardTilt() {
    const cards = document.querySelectorAll(
      '.acad-item, .acad-stat, .acad-hub-card, .acad-countdown, .worker-card, .how-card, .vfx-tilt-card, .cert-card, .card, .hero-3d-logo-container'
    );

    cards.forEach((card) => {
      card.classList.add('vfx-tilt-card');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  // --- Scroll-Driven 3D Matrix & Depth Reveal ---
  function init3DScrollReveal() {
    const targets = document.querySelectorAll(
      '.page-section, .hero-bio-strip, .project-entry, .about-grid, .doc-sheet, .problem-list, .how-grid, .worker-grid, .flow-step, .quote-section'
    );

    targets.forEach((el, index) => {
      el.classList.add('vfx-reveal-3d');
      el.style.transitionDelay = `${(index % 4) * 0.08}s`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach((el) => observer.observe(el));
  }

  // --- Seamless 3D Page Transition Portal ---
  function init3DPageTransitions() {
    let overlay = document.getElementById('vfx-page-transition');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'vfx-page-transition';
      overlay.innerHTML = `
        <div class="vfx-transition-loader">
          <div class="vfx-transition-rings"></div>
          <div class="vfx-transition-text">LOADING...</div>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    // Intercept internal page link transitions
    document.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (
        href &&
        !href.startsWith('#') &&
        !href.startsWith('mailto:') &&
        !href.startsWith('tel:') &&
        !href.startsWith('http') &&
        !link.getAttribute('target')
      ) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          overlay.classList.add('active');
          setTimeout(() => {
            window.location.href = href;
          }, 240);
        });
      }
    });

    // Fade in on page load
    window.addEventListener('pageshow', () => {
      overlay.classList.remove('active');
    });
  }

  // --- Initializer on DOM Ready ---
  function initVFXSuite() {
    new VFX3DCanvas();
    new CyberCursor();
    init3DCardTilt();
    init3DScrollReveal();
    init3DPageTransitions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVFXSuite);
  } else {
    initVFXSuite();
  }
})();
