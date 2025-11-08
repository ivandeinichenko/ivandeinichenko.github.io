/* ==========================================
   THEME SWITCHER - Dark/Light Mode
   ========================================== */

import { logger } from './utils/logger.js';

(function () {
  'use strict';

  const THEME_KEY = 'preferred-theme';
  const THEME_DARK = 'dark';
  const THEME_LIGHT = 'light';

  class ThemeSwitcher {
    constructor() {
      this.currentTheme = null;
      this.toggleBtn = null;
      this.init();
    }

    /**
     * Initialize theme switcher
     */
    init() {
      this.toggleBtn = document.getElementById('theme-toggle');
      this.toggleBtnMobile = document.getElementById('theme-toggle-mobile');

      if (!this.toggleBtn && !this.toggleBtnMobile) {
        logger.warn('Theme toggle button not found');
        return;
      }

      this.loadTheme();

      if (this.toggleBtn) {
        this.toggleBtn.addEventListener('click', () => this.toggleTheme());
      }

      if (this.toggleBtnMobile) {
        this.toggleBtnMobile.addEventListener('click', () => this.toggleTheme());
        this.updateToggleSwitchState();
      }

      this.watchSystemTheme();

      logger.log('Theme switcher initialized');
    }

    /**
     * Load theme from localStorage or system preference
     */
    loadTheme() {
      const savedTheme = localStorage.getItem(THEME_KEY);

      if (savedTheme) {
        this.setTheme(savedTheme);
        return;
      }

      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? THEME_DARK : THEME_LIGHT);
    }

    /**
     * Update toggle switch state
     */
    updateToggleSwitchState() {
      if (this.toggleBtnMobile) {
        const isDark = this.currentTheme === THEME_DARK;
        this.toggleBtnMobile.setAttribute('aria-checked', isDark);
      }
    }

    /**
     * Set theme
     * @param {string} theme - 'dark' or 'light'
     */
    setTheme(theme) {
      if (theme !== THEME_DARK && theme !== THEME_LIGHT) {
        logger.warn('Invalid theme:', theme);
        return;
      }

      this.currentTheme = theme;

      if (theme === THEME_DARK) {
        document.documentElement.setAttribute('data-theme', THEME_DARK);
      } else {
        document.documentElement.removeAttribute('data-theme');
      }

      localStorage.setItem(THEME_KEY, theme);

      this.updateButtonState();
      this.updateToggleSwitchState();

      this.dispatchThemeChange(theme);

      this.updateMetaThemeColor(theme);
    }

    /**
     * Toggle between dark and light theme
     */
    toggleTheme() {
      const newTheme = this.currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
      this.setTheme(newTheme);
      this.animateToggle();
    }

    /**
     * Update button visual state
     */
    updateButtonState() {
      if (!this.toggleBtn) {
        return;
      }

      const label =
        this.currentTheme === THEME_DARK ? 'Switch to light mode' : 'Switch to dark mode';
      this.toggleBtn.setAttribute('aria-label', label);
      this.toggleBtn.setAttribute('data-theme', this.currentTheme);
    }

    /**
     * Animate theme toggle button
     */
    animateToggle() {
      if (!this.toggleBtn) {
        return;
      }

      this.toggleBtn.style.transform = 'rotate(360deg)';
      setTimeout(() => {
        this.toggleBtn.style.transform = '';
      }, 300);
    }

    /**
     * Watch for system theme changes
     */
    watchSystemTheme() {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', e => {
          if (!localStorage.getItem(THEME_KEY)) {
            this.setTheme(e.matches ? THEME_DARK : THEME_LIGHT);
          }
        });
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(e => {
          if (!localStorage.getItem(THEME_KEY)) {
            this.setTheme(e.matches ? THEME_DARK : THEME_LIGHT);
          }
        });
      }
    }

    /**
     * Dispatch custom theme change event
     * @param {string} theme
     */
    dispatchThemeChange(theme) {
      const event = new CustomEvent('themechange', {
        detail: { theme },
        bubbles: true
      });
      document.dispatchEvent(event);
    }

    /**
     * Update meta theme-color for mobile browsers
     * @param {string} theme
     */
    updateMetaThemeColor(theme) {
      let metaThemeColor = document.querySelector('meta[name="theme-color"]');

      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.head.appendChild(metaThemeColor);
      }

      const color = theme === THEME_DARK ? '#0f172a' : '#f8fafc';
      metaThemeColor.setAttribute('content', color);
    }

    /**
     * Get current theme
     * @returns {string}
     */
    getCurrentTheme() {
      return this.currentTheme;
    }

    /**
     * Check if dark mode is active
     * @returns {boolean}
     */
    isDarkMode() {
      return this.currentTheme === THEME_DARK;
    }
  }

  function setupKeyboardShortcut(themeSwitcher) {
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
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

    setTimeout(() => {
      document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    }, 100);
  }

  init();

  (function preventThemeFlash() {
    const savedTheme = localStorage.getItem(THEME_KEY);

    if (savedTheme === THEME_DARK) {
      document.documentElement.setAttribute('data-theme', THEME_DARK);
    } else if (!savedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.setAttribute('data-theme', THEME_DARK);
      }
    }
  })();
})();
