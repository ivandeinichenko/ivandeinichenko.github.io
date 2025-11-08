/**
 * Logger utility with feature flag support
 * Uses VITE_ENABLE_LOGS environment variable
 * Automatically includes file and line information in logs
 */

const isLoggingEnabled = import.meta.env.VITE_ENABLE_LOGS === 'true';

/**
 * Get file and line information from stack trace
 * @returns {string} File path and line number
 */
function getFileInfo() {
  const stack = new Error().stack;
  if (!stack) {
    return '';
  }

  const stackLines = stack.split('\n');
  // Skip first 3 lines: Error, getFileInfo, logger method
  // Find the first line that's not from logger.js
  for (let i = 3; i < stackLines.length; i++) {
    const line = stackLines[i];
    if (line && !line.includes('logger.js') && !line.includes('at Object.')) {
      // Extract file path and line number
      const match = line.match(/([^/\\]+\.js):(\d+):(\d+)/);
      if (match) {
        const fileName = match[1];
        const lineNumber = match[2];
        return `[${fileName}:${lineNumber}]`;
      }
      // Alternative format for some browsers
      const altMatch = line.match(/at\s+.*\(([^/\\]+\.js):(\d+):(\d+)\)/);
      if (altMatch) {
        const fileName = altMatch[1];
        const lineNumber = altMatch[2];
        return `[${fileName}:${lineNumber}]`;
      }
    }
  }

  return '';
}

export const logger = {
  log: (...args) => {
    if (isLoggingEnabled) {
      const fileInfo = getFileInfo();
      console.log(fileInfo, ...args);
    }
  },

  warn: (...args) => {
    if (isLoggingEnabled) {
      const fileInfo = getFileInfo();
      console.warn(fileInfo, ...args);
    }
  },

  error: (...args) => {
    // Errors are always logged with file info
    const fileInfo = getFileInfo();
    console.error(fileInfo, ...args);
  },

  info: (...args) => {
    if (isLoggingEnabled) {
      const fileInfo = getFileInfo();
      console.info(fileInfo, ...args);
    }
  },

  debug: (...args) => {
    if (isLoggingEnabled) {
      const fileInfo = getFileInfo();
      console.debug(fileInfo, ...args);
    }
  }
};
