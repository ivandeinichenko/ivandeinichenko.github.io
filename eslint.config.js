// ESLint configuration for browser JavaScript
export default [
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        localStorage: 'readonly',
        location: 'readonly',
        navigator: 'readonly',
        IntersectionObserver: 'readonly',
        PerformanceObserver: 'readonly',
        CustomEvent: 'readonly',
        getComputedStyle: 'readonly',
        Math: 'readonly',
        Date: 'readonly',
        Error: 'readonly',
        import: 'readonly',
        meta: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_' 
      }],
      'no-console': 'off',
      'no-undef': 'error',
      'no-redeclare': 'error',
      'no-var': 'warn',
      'prefer-const': 'warn',
      'prefer-arrow-callback': 'warn',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'brace-style': ['error', '1tbs'],
      'semi': ['error', 'always'],
      'quotes': ['warn', 'single', { avoidEscape: true }],
      'comma-dangle': ['warn', 'never'],
      'indent': ['warn', 2, { SwitchCase: 1 }],
      'no-trailing-spaces': 'warn',
      'eol-last': ['warn', 'always'],
      'no-multiple-empty-lines': ['warn', { max: 2, maxEOF: 1 }]
    }
  }
];

