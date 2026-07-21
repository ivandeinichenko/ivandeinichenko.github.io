/* ==========================================
   THEME SWITCHER - Dark/Light Mode
   Dark is the default palette; light is applied
   via data-theme="light" on <html>. The pre-paint anti-flash pass
   lives inline in index.html — this module owns everything after it.
   ========================================== */

import { logger } from './utils/logger.js';

(function () {
  'use strict';

  const THEME_KEY = 'preferred-theme';
  const THEME_DARK = 'dark';
  const THEME_LIGHT = 'light';

  const META_COLOR = {
    [THEME_DARK]: '#101114',
    [THEME_LIGHT]: '#f2f0eb'
  };

  class ThemeSwitcher {
    constructor() {
      this.currentTheme = null;
      this.toggleBtn = null;
      this.init();
    }

    init() {
      this.toggleBtn = document.getElementById('theme-toggle');

      if (!this.toggleBtn) {
        logger.warn('Theme toggle button not found');
        return;
      }

      this.loadTheme();

      this.toggleBtn.addEventListener('click', () => this.toggleTheme());

      this.watchSystemTheme();

      logger.log('Theme switcher initialized');
    }

    /**
     * Resolve the initial theme: an explicit saved choice wins,
     * otherwise follow the system preference. Never persisted here —
     * only a real click writes to localStorage.
     */
    loadTheme() {
      let savedTheme = null;

      try {
        savedTheme = localStorage.getItem(THEME_KEY);
      } catch {
        logger.warn('localStorage unavailable, theme will not persist');
      }

      if (savedTheme === THEME_DARK || savedTheme === THEME_LIGHT) {
        this.setTheme(savedTheme, false);
        return;
      }

      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      this.setTheme(prefersLight ? THEME_LIGHT : THEME_DARK, false);
    }

    /**
     * @param {string} theme - 'dark' or 'light'
     * @param {boolean} persist - whether to remember the choice
     */
    setTheme(theme, persist = true) {
      if (theme !== THEME_DARK && theme !== THEME_LIGHT) {
        logger.warn('Invalid theme:', theme);
        return;
      }

      this.currentTheme = theme;

      if (theme === THEME_LIGHT) {
        document.documentElement.setAttribute('data-theme', THEME_LIGHT);
      } else {
        document.documentElement.removeAttribute('data-theme');
      }

      if (persist) {
        try {
          localStorage.setItem(THEME_KEY, theme);
        } catch {
          /* non-fatal: the theme still applies for this page view */
        }
      }

      this.updateButtonState();
      this.dispatchThemeChange(theme, persist);
      this.updateMetaThemeColor(theme);
    }

    toggleTheme() {
      const newTheme = this.currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
      this.setTheme(newTheme, true);
    }

    /**
     * The label advertises the theme you would switch *to*.
     */
    updateButtonState() {
      if (!this.toggleBtn) {
        return;
      }

      const isDark = this.currentTheme === THEME_DARK;

      this.toggleBtn.textContent = isDark ? '[light_mode]' : '[dark_mode]';
      this.toggleBtn.setAttribute(
        'aria-label',
        isDark ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }

    watchSystemTheme() {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');

      const handler = e => {
        let saved = null;

        try {
          saved = localStorage.getItem(THEME_KEY);
        } catch {
          /* treat as "no explicit choice" */
        }

        if (saved !== THEME_DARK && saved !== THEME_LIGHT) {
          this.setTheme(e.matches ? THEME_LIGHT : THEME_DARK, false);
        }
      };

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handler);
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(handler);
      }
    }

    /**
     * Consumed by js/analytics.js to report theme_toggle.
     * `userInitiated` separates a real click from the initial resolution
     * and from system-preference changes.
     * @param {string} theme
     * @param {boolean} userInitiated
     */
    dispatchThemeChange(theme, userInitiated) {
      document.dispatchEvent(
        new CustomEvent('themechange', {
          detail: { theme, userInitiated },
          bubbles: true
        })
      );
    }

    updateMetaThemeColor(theme) {
      let metaThemeColor = document.querySelector('meta[name="theme-color"]');

      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.head.appendChild(metaThemeColor);
      }

      metaThemeColor.setAttribute('content', META_COLOR[theme]);
    }

    getCurrentTheme() {
      return this.currentTheme;
    }

    isDarkMode() {
      return this.currentTheme === THEME_DARK;
    }
  }

  function setupKeyboardShortcut(themeSwitcher) {
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        themeSwitcher.toggleTheme();
      }
    });
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    const themeSwitcher = new ThemeSwitcher();
    setupKeyboardShortcut(themeSwitcher);

    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      window.themeSwitcher = themeSwitcher;
    }
  }

  init();
})();
