import { logger } from './utils/logger.js';

(function () {
  'use strict';

  const utils = {
    throttle(func, limit) {
      let inThrottle;
      return function (...args) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    }
  };

  function getHeaderHeight() {
    return document.querySelector('header')?.offsetHeight || 0;
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        if (href === '#' || href.length === 1) {
          return;
        }

        const target = document.querySelector(href);

        if (!target) {
          return;
        }

        e.preventDefault();

        window.scrollTo({
          top: target.offsetTop - getHeaderHeight() - 20,
          behavior: 'smooth'
        });

        updateActiveNavLink(href);
      });
    });
  }

  function updateActiveNavLink(activeHref) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === activeHref);
    });
  }

  function updateActiveSection() {
    const scrollPosition = window.scrollY + getHeaderHeight() + 100;

    document.querySelectorAll('section[id]').forEach(section => {
      const sectionTop = section.offsetTop;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + section.offsetHeight) {
        updateActiveNavLink(`#${section.getAttribute('id')}`);
      }
    });
  }

  function initActiveSectionTracking() {
    window.addEventListener('scroll', utils.throttle(updateActiveSection, 100));
    updateActiveSection();
  }

  function initExternalLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(link => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    initSmoothScroll();
    initActiveSectionTracking();
    initExternalLinks();

    logger.log('Portfolio initialized successfully!');
  }

  init();
})();
