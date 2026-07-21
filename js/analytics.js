/* ==========================================
   GA4 EVENT TRACKING
   The gtag snippet itself lives in index.html. This module only
   reports interactions on top of it, so the page works unchanged
   when analytics is blocked or fails to load.

   Markup contract: put data-ga-event="<name>" on a link; every other
   data-ga-* attribute on that element is forwarded as an event param
   (data-ga-method -> method, data-ga-location -> location).
   ========================================== */

import { logger } from './utils/logger.js';

(function () {
  'use strict';

  function track(name, params = {}) {
    if (typeof window.gtag !== 'function') {
      logger.log('gtag unavailable, skipped event:', name, params);
      return;
    }

    window.gtag('event', name, params);
    logger.log('GA event:', name, params);
  }

  /**
   * Collects data-ga-* attributes into GA params, minus the event name itself.
   * @param {HTMLElement} el
   * @returns {Object}
   */
  function paramsFrom(el) {
    return Object.entries(el.dataset).reduce((params, [key, value]) => {
      if (!key.startsWith('ga') || key === 'gaEvent') {
        return params;
      }

      // gaMethod -> method, gaLocation -> location
      const name = key
        .slice(2)
        .replace(/^[A-Z]/, c => c.toLowerCase())
        .replace(/[A-Z]/g, c => `_${c.toLowerCase()}`);

      params[name] = value;
      return params;
    }, {});
  }

  function initLinkTracking() {
    document.addEventListener('click', e => {
      const el = e.target.closest('[data-ga-event]');

      if (!el) {
        return;
      }

      const params = paramsFrom(el);

      if (el.tagName === 'A' && el.href && !el.href.startsWith('mailto:')) {
        params.link_url = el.href;
      }

      track(el.dataset.gaEvent, params);
    });
  }

  function initThemeTracking() {
    // theme-switcher.js also fires themechange on load and on system-preference
    // changes; only an explicit click carries userInitiated.
    document.addEventListener('themechange', e => {
      if (!e.detail?.userInitiated) {
        return;
      }

      track('theme_toggle', { theme: e.detail.theme });
    });
  }

  function initWorkLogTracking() {
    document.querySelectorAll('.log-row').forEach(row => {
      row.addEventListener('toggle', () => {
        if (row.open) {
          track('work_log_expand', { company: row.dataset.gaCompany || 'unknown' });
        }
      });
    });
  }

  function initSectionTracking() {
    const sections = document.querySelectorAll('section[id]');

    if (!sections.length || !('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            return;
          }

          track('section_view', { section_id: entry.target.id });
          observer.unobserve(entry.target);
        });
      },
      // Fires once a section reaches the middle band of the viewport.
      // A percentage threshold would never trigger for sections taller
      // than the viewport (#log is), so the margin does the gating.
      { rootMargin: '-35% 0px -35% 0px', threshold: 0 }
    );

    sections.forEach(section => observer.observe(section));
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    initLinkTracking();
    initThemeTracking();
    initWorkLogTracking();
    initSectionTracking();

    logger.log('Analytics initialized');
  }

  init();
})();
