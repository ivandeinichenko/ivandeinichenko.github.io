/* PARTICLE EFFECT - Canvas Animation */

import { logger } from './utils/logger.js';

(function () {
  'use strict';

  class ParticleSystem {
    constructor(canvasId, options = {}) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) {
        logger.warn(`Canvas with id "${canvasId}" not found`);
        return;
      }

      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.mouse = { x: null, y: null, radius: 150 };
      this.animationId = null;

      this.config = {
        particleCount: options.particleCount || 100,
        particleSize: options.particleSize || 2,
        particleColor: options.particleColor || null,
        lineColor: options.lineColor || null,
        maxDistance: options.maxDistance || 120,
        particleSpeed: options.particleSpeed || 0.5,
        interactive: options.interactive !== false,
        responsive: options.responsive !== false,
        ...options
      };

      this.init();
    }

    init() {
      this.setupCanvas();
      this.createParticles();
      this.setupEventListeners();
      this.animate();

      logger.log('Particle system initialized');
    }

    /**
     * Setup canvas dimensions
     */
    setupCanvas() {
      const updateSize = () => {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        this.ctx.scale(dpr, dpr);

        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';

        if (this.config.responsive && this.particles.length > 0) {
          this.createParticles();
        }
      };

      updateSize();

      if (this.config.responsive) {
        window.addEventListener('resize', this.debounce(updateSize.bind(this), 250));
      }
    }

    /**
     * Create particles
     */
    createParticles() {
      this.particles = [];
      const rect = this.canvas.getBoundingClientRect();

      let particleCount = this.config.particleCount;
      if (rect.width < 768) {
        particleCount = Math.floor(particleCount * 0.5);
      } else if (rect.width < 1024) {
        particleCount = Math.floor(particleCount * 0.75);
      }

      for (let i = 0; i < particleCount; i++) {
        this.particles.push(new Particle(rect.width, rect.height, this.config));
      }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
      if (!this.config.interactive) {
        return;
      }

      this.canvas.addEventListener('mousemove', e => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      });

      this.canvas.addEventListener('mouseleave', () => {
        this.mouse.x = null;
        this.mouse.y = null;
      });

      this.canvas.addEventListener(
        'touchmove',
        e => {
          e.preventDefault();
          const rect = this.canvas.getBoundingClientRect();
          const touch = e.touches[0];
          this.mouse.x = touch.clientX - rect.left;
          this.mouse.y = touch.clientY - rect.top;
        },
        { passive: false }
      );

      this.canvas.addEventListener('touchend', () => {
        this.mouse.x = null;
        this.mouse.y = null;
      });
    }

    /**
     * Get theme-aware color
     */
    getColor(colorVar, fallback) {
      if (this.config[colorVar]) {
        return this.config[colorVar];
      }

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

      if (colorVar === 'particleColor') {
        return isDark ? 'rgba(45, 212, 191, 0.8)' : 'rgba(13, 148, 136, 0.8)';
      } else if (colorVar === 'lineColor') {
        return isDark ? 'rgba(45, 212, 191, 0.2)' : 'rgba(13, 148, 136, 0.2)';
      }

      return fallback;
    }

    /**
     * Animation loop
     */
    animate() {
      const rect = this.canvas.getBoundingClientRect();
      this.ctx.clearRect(0, 0, rect.width, rect.height);

      this.particles.forEach(particle => {
        particle.update(rect.width, rect.height, this.mouse);
        particle.draw(this.ctx, this.getColor('particleColor', '#0d9488'));
      });

      this.connectParticles(rect.width, rect.height);

      this.animationId = requestAnimationFrame(this.animate.bind(this));
    }

    /**
     * Connect nearby particles with lines
     */
    connectParticles(_width, _height) {
      const maxDistance = this.config.maxDistance;
      const lineColor = this.getColor('lineColor', 'rgba(13, 148, 136, 0.2)');

      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const dx = this.particles[i].x - this.particles[j].x;
          const dy = this.particles[i].y - this.particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.5;
            this.ctx.strokeStyle = lineColor.replace(/[\d.]+\)/, `${opacity})`);
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
            this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
            this.ctx.stroke();
          }
        }

        if (this.config.interactive && this.mouse.x !== null) {
          const dx = this.particles[i].x - this.mouse.x;
          const dy = this.particles[i].y - this.mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < this.mouse.radius) {
            const opacity = (1 - distance / this.mouse.radius) * 0.8;
            this.ctx.strokeStyle = lineColor.replace(/[\d.]+\)/, `${opacity})`);
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
            this.ctx.lineTo(this.mouse.x, this.mouse.y);
            this.ctx.stroke();
          }
        }
      }
    }

    /**
     * Pause animation
     */
    pause() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    }

    /**
     * Resume animation
     */
    resume() {
      if (!this.animationId) {
        this.animate();
      }
    }

    /**
     * Destroy particle system
     */
    destroy() {
      this.pause();
      this.particles = [];
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Debounce utility
     */
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  }

  class Particle {
    constructor(canvasWidth, canvasHeight, config) {
      this.config = config;
      this.reset(canvasWidth, canvasHeight);
    }

    reset(canvasWidth, canvasHeight) {
      this.x = Math.random() * canvasWidth;
      this.y = Math.random() * canvasHeight;
      this.vx = (Math.random() - 0.5) * this.config.particleSpeed;
      this.vy = (Math.random() - 0.5) * this.config.particleSpeed;
      this.size = this.config.particleSize + Math.random() * 2;
    }

    update(canvasWidth, canvasHeight, mouse) {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvasWidth) {
        this.vx *= -1;
        this.x = Math.max(0, Math.min(canvasWidth, this.x));
      }
      if (this.y < 0 || this.y > canvasHeight) {
        this.vy *= -1;
        this.y = Math.max(0, Math.min(canvasHeight, this.y));
      }

      if (this.config.interactive && mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const dirX = dx / distance;
          const dirY = dy / distance;

          this.vx += dirX * force * 0.5;
          this.vy += dirY * force * 0.5;

          const maxVel = this.config.particleSpeed * 3;
          this.vx = Math.max(-maxVel, Math.min(maxVel, this.vx));
          this.vy = Math.max(-maxVel, Math.min(maxVel, this.vy));
        }
      }

      this.vx *= 0.99;
      this.vy *= 0.99;
    }

    draw(ctx, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();

      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      logger.log('Reduced motion preferred - particles disabled');
      return;
    }

    const heroParticles = new ParticleSystem('particles-canvas', {
      particleCount: 100,
      particleSize: 2,
      maxDistance: 120,
      particleSpeed: 0.5,
      interactive: true,
      responsive: true
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        heroParticles.pause();
      } else {
        heroParticles.resume();
      }
    });

    document.addEventListener('themechange', () => {});

    if (['localhost', '127.0.0.1'].includes(window.location.hostname)) {
      window.particles = heroParticles;
    }
  }

  init();
})();
