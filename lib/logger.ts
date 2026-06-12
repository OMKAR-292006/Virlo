/**
 * Minimal structured logger.
 * In production, outputs JSON lines suitable for any log aggregator.
 * In development, outputs readable console messages.
 * Swap the `production` block for Sentry / Datadog / Logtail when ready.
 */

type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
}

function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    message,
    context,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === 'production') {
    // Structured JSON — pipe to any log aggregator
    process.stdout.write(JSON.stringify(entry) + '\n');
  } else {
    const prefix = `[${entry.timestamp}] [${level.toUpperCase()}]`;
    if (level === 'error') console.error(prefix, message, context ?? '');
    else if (level === 'warn') console.warn(prefix, message, context ?? '');
    else console.log(prefix, message, context ?? '');
  }
}

export const logger = {
  info: (message: string, context?: Record<string, unknown>) => log('info', message, context),
  warn: (message: string, context?: Record<string, unknown>) => log('warn', message, context),
  error: (message: string, context?: Record<string, unknown>) => log('error', message, context),
};
