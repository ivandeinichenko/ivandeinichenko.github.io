import { logger } from './utils/logger.js';

(function () {
  'use strict';

  const utils = {
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
    },

    throttle(func, limit) {
      let inThrottle;
      return function (...args) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    },

    isInViewport(element, offset = 0) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
        rect.bottom >= offset
      );
    }
  };

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        if (href === '#' || href.length === 1) {
          return;
        }

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
          const targetPosition = target.offsetTop - navHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          updateActiveNavLink(href);
        }
      });
    });
  }

  function initNavigation() {
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    function toggleMenu() {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
      overlay.classList.toggle('active');
      document.body.style.overflow = !isExpanded ? 'hidden' : '';
    }

    overlay.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 767) {
          navToggle.setAttribute('aria-expanded', 'false');
          navMenu.classList.remove('active');
          overlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    if (navToggle) {
      navToggle.addEventListener('click', toggleMenu);
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth > 767) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    const scrollIndicator = document.querySelector('.scroll-indicator');
    let hasScrolled = false;

    const handleNavScroll = utils.throttle(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (!hasScrolled && scrollTop > 10) {
        hasScrolled = true;
        if (scrollIndicator) {
          scrollIndicator.style.opacity = '0';
          scrollIndicator.style.visibility = 'hidden';
          scrollIndicator.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
        }
      }

      if (scrollTop > 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }

      updateActiveSection();
    }, 100);

    window.addEventListener('scroll', handleNavScroll);
  }

  function updateActiveNavLink(activeHref) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === activeHref) {
        link.classList.add('active');
      }
    });
  }

  function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
    const scrollPosition = window.scrollY + navHeight + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        updateActiveNavLink(`#${sectionId}`);
      }
    });
  }

  function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px'
    };

    const animateCounter = counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      updateCounter();
    };

    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          animateCounter(entry.target);
        }
      });
    }, observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));
  }

  function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px'
    };

    const skillObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progress = entry.target.getAttribute('data-progress');
          entry.target.style.width = `${progress}%`;
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    skillBars.forEach(bar => skillObserver.observe(bar));
  }

  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.fade-in-up');
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(element => revealObserver.observe(element));
  }

  function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  function initExternalLinks() {
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
      if (!link.querySelector('svg')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  function initBackToTop() {
    const scrollThreshold = 500;
    let backToTopBtn = document.getElementById('back-to-top');

    if (!backToTopBtn) {
      backToTopBtn = document.createElement('button');
      backToTopBtn.id = 'back-to-top';
      backToTopBtn.innerHTML = '↑';
      backToTopBtn.setAttribute('aria-label', 'Back to top');
      backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--color-primary);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s, visibility 0.3s, transform 0.3s;
        z-index: 998;
        box-shadow: 0 4px 12px var(--shadow-color);
      `;
      document.body.appendChild(backToTopBtn);
    }

    const handleBackToTop = utils.throttle(() => {
      if (window.pageYOffset > scrollThreshold) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.visibility = 'visible';
      } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
      }
    }, 100);

    window.addEventListener('scroll', handleBackToTop);

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    backToTopBtn.addEventListener('mouseenter', () => {
      backToTopBtn.style.transform = 'translateY(-5px)';
    });

    backToTopBtn.addEventListener('mouseleave', () => {
      backToTopBtn.style.transform = 'translateY(0)';
    });
  }

  function monitorPerformance() {
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        logger.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      const fidObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          logger.log('FID:', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    }
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    initSmoothScroll();
    initNavigation();
    initCounters();
    initSkillBars();
    initScrollReveal();
    initLazyLoading();
    initExternalLinks();
    initBackToTop();

    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      monitorPerformance();
    }

    document.body.classList.remove('loading');

    logger.log('Portfolio initialized successfully!');
  }

  init();
})();
