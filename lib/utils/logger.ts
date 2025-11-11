import { Logtail } from "@logtail/node"

/**
 * BetterStack (Logtail) Logger
 *
 * Centralized logging utility for server-side logging to BetterStack.
 * Supports multiple log levels and structured context data.
 *
 * Usage:
 *   logger.info("Request created", { userId, amount, requestId })
 *   logger.error("Database error", { error: err.message, stack: err.stack })
 *   logger.warn("Validation failed", { field: "amount", value })
 *   logger.debug("Debug info", { context })
 *
 * Environment Variables:
 *   LOGTAIL_SOURCE_TOKEN: BetterStack source token (required for production)
 *   NODE_ENV: Environment mode (development/production)
 *
 * Fallback Behavior:
 *   - Development: Always uses console logging (no BetterStack needed)
 *   - Production/Staging: Uses BetterStack if LOGTAIL_SOURCE_TOKEN is set
 *   - If LOGTAIL_SOURCE_TOKEN is not set in production, falls back to console logging
 */

// Initialize Logtail client (only in production/staging with token)
const logtailToken = process.env.LOGTAIL_SOURCE_TOKEN
const isDevelopment =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
let logtail: Logtail | null = null

// Only initialize Logtail in non-development environments with a token
if (!isDevelopment && logtailToken) {
  logtail = new Logtail(logtailToken)
}

interface LogContext {
  [key: string]: unknown
}

/**
 * Logger utility with support for different log levels
 * Sends logs to BetterStack in production or falls back to console
 */
export const logger = {
  /**
   * Log informational messages (successful operations, status updates)
   */
  info: (message: string, context?: LogContext) => {
    if (logtail) {
      logtail.info(message, context)
    } else {
      console.log(`[INFO] ${message}`, ...(context ? [context] : []))
    }
  },

  /**
   * Log warning messages (non-critical issues, deprecations)
   */
  warn: (message: string, context?: LogContext) => {
    if (logtail) {
      logtail.warn(message, context)
    } else {
      console.warn(`[WARN] ${message}`, ...(context ? [context] : []))
    }
  },

  /**
   * Log error messages (failures, exceptions, critical issues)
   */
  error: (message: string, context?: LogContext) => {
    if (logtail) {
      logtail.error(message, context)
    } else {
      console.error(`[ERROR] ${message}`, ...(context ? [context] : []))
    }
  },

  /**
   * Log debug messages (detailed information for troubleshooting)
   */
  debug: (message: string, context?: LogContext) => {
    if (logtail) {
      logtail.debug(message, context)
    } else {
      console.debug(`[DEBUG] ${message}`, ...(context ? [context] : []))
    }
  },

  /**
   * Flush pending logs (important to call before serverless function exits)
   * Ensures all logs are sent to BetterStack before process terminates
   */
  flush: async () => {
    if (logtail) {
      await logtail.flush()
    }
  },
}

export default logger

