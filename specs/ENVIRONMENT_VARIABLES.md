# Environment Variables

This project uses environment variables to control feature flags and build settings.

## Available Variables

### `VITE_ENABLE_LOGS`

Controls whether debug console logs are enabled.

- **Type**: `boolean` (string: `"true"` or `"false"`)
- **Default**: `false`
- **Description**: When set to `true`, enables all debug console logs (logger.log, logger.warn, logger.info, logger.debug). When `false`, these logs are suppressed. Errors (logger.error) are always logged regardless of this setting.

## Environment Files

### `.env.local`

Used for local development. This file should not be committed to the repository.

**Example:**
```env
VITE_ENABLE_LOGS=true
```

### `.env.production`

Used for production builds. This file is used when running `npm run build`.

**Example:**
```env
VITE_ENABLE_LOGS=false
```

### `.env.example`

Template file showing available environment variables. This file is committed to the repository.

**Example:**
```env
VITE_ENABLE_LOGS=false
```

## Usage

### Local Development

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and set `VITE_ENABLE_LOGS=true`:
   ```env
   VITE_ENABLE_LOGS=true
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

### Production Build

1. The `.env.production` file is automatically used when running:
   ```bash
   npm run build
   ```

2. Or set the variable directly:
   ```bash
   VITE_ENABLE_LOGS=false npm run build
   ```

### GitHub Actions

The GitHub Actions workflow automatically sets `VITE_ENABLE_LOGS=false` for production builds. This is configured in `.github/workflows/deploy.yml`.

## How It Works

The logger utility (`js/utils/logger.js`) checks the `VITE_ENABLE_LOGS` environment variable at build time. Vite replaces `import.meta.env.VITE_ENABLE_LOGS` with the actual value during the build process.

### Logger API

```javascript
import { logger } from './utils/logger.js';

// These are controlled by VITE_ENABLE_LOGS
// All logs automatically include file and line information
logger.log('Debug message');
// Output: [analytics.js:124] Debug message

logger.warn('Warning message');
// Output: [theme-switcher.js:38] Warning message

logger.info('Info message');
logger.debug('Debug message');

// This is always logged (errors are important)
logger.error('Error message');
// Output: [main.js:90] Error message
```

**Note:** All logger methods automatically include file name and line number in the output, making it easy to identify where logs are coming from.

## Notes

- Environment variables must be prefixed with `VITE_` to be accessible in client-side code
- Changes to `.env` files require restarting the development server
- Production builds use `.env.production` by default
- The logger utility is tree-shakeable, so unused logs are removed in production builds

