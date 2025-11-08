/* SCROLL ANIMATIONS - Intersection Observer */

import { logger } from './utils/logger.js';

(function () {
  'use strict';

  class ScrollAnimations {
    constructor(options = {}) {
      this.options = {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px 0px -50px 0px',
        animateOnce: options.animateOnce !== false, // true by default
        ...options
      };

      this.observers = new Map();
      this.init();
    }

    init() {
      this.initFadeAnimations();

      logger.log('Scroll animations initialized');
    }

    /**
     * Create an intersection observer
     * @param {string} name - Observer name
     * @param {Function} callback - Callback function
     * @param {Object} options - Observer options
     */
    createObserver(name, callback, options = {}) {
      const observerOptions = {
        ...this.options,
        ...options
      };

      const observer = new IntersectionObserver(callback, observerOptions);
      this.observers.set(name, observer);
      return observer;
    }

    /**
     * Fade animations
     */
    initFadeAnimations() {
      const elements = document.querySelectorAll('.fade-in-up');

      const callback = entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            if (this.options.animateOnce) {
              this.observers.get('fade').unobserve(entry.target);
            }
          } else if (!this.options.animateOnce) {
            entry.target.classList.remove('visible');
          }
        });
      };

      const observer = this.createObserver('fade', callback);
      elements.forEach(el => observer.observe(el));
    }

    /**
     * Destroy all observers
     */
    destroy() {
      this.observers.forEach(observer => observer.disconnect());
      this.observers.clear();
    }

    /**
     * Reset animations
     */
    reset() {
      const animatedElements = document.querySelectorAll('.visible');
      animatedElements.forEach(el => el.classList.remove('visible'));
    }
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      logger.log('Reduced motion preferred - animations disabled');
      return;
    }

    const scrollAnimations = new ScrollAnimations({
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      animateOnce: true
    });

    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      window.scrollAnimations = scrollAnimations;
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        document.body.style.animationPlayState = 'paused';
      } else {
        document.body.style.animationPlayState = 'running';
      }
    });
  }

  init();
})();
