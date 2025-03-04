import { LogOptions, PlatformLogConfig, scopes } from '@ms/types/logger.types.';
import util from 'util';

// ANSI escape codes for colors and formatting
export const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
};

const DEFAULT_INSPECT_OPTIONS = {
  depth: null,
  colors: true,
  compact: false,
  breakLength: 80,
  showHidden: false,
};

const isPlainObject = (obj: unknown): obj is Record<string, unknown> => {
  return typeof obj === 'object' && obj !== null && Object.prototype.toString.call(obj) === '[object Object]';
};

class Logger {
  private readonly platformConfigs: Map<scopes, PlatformLogConfig> = new Map([
    ['disk', { scope: 'disk', color: `${colors.bold}${colors.blue}` }],
    ['route', { scope: 'route', color: `${colors.bold}${colors.cyan}` }],
    ['server', { scope: 'server', color: `${colors.bold}${colors.green}` }],
    ['controller', { scope: 'controller', color: `${colors.bold}${colors.magenta}` }],
    ['database', { scope: 'database', color: `${colors.bold}${colors.yellow}` }],
    ['middleware', { scope: 'middleware', color: `${colors.bold}${colors.white}` }],
    ['auth', { scope: 'auth', color: `${colors.bold}${colors.red}` }],
  ]);

  /**
   * Get formatted timestamp with gray color
   * @private
   */
  private get timestamp(): string {
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${colors.gray}${hours}:${minutes}:${seconds} ${ampm}${colors.reset}`;
  }

  /**
   * Format message with proper object inspection
   * @param message The base log message
   * @param args Additional arguments to format
   * @private
   */
  private formatMessage(message: string, args: unknown[]): string {
    const formattedArgs = args.map(arg => {
      if (typeof arg === 'object' && arg !== null) {
        return util.inspect(arg, DEFAULT_INSPECT_OPTIONS);
      }
      return arg;
    });
    return util.format(message, ...formattedArgs);
  }

  /**
   * Format context object for logging
   * @param context The context object to format
   * @private
   */
  private formatContext(context: Record<string, unknown>): string {
    return `${colors.gray}${util.inspect(context, {
      ...DEFAULT_INSPECT_OPTIONS,
      compact: true
    })}${colors.reset}`;
  }

  /**
   * Process arguments to separate log options from message parameters
   * @param args The arguments array
   * @private
   */
  private processArgs(args: unknown[]): {
    message: string;
    options: LogOptions;
    parameters: unknown[];
  } {
    const [message, ...rest] = args;
    const lastArg = rest[rest.length - 1];
    let options: LogOptions = {};
    let parameters = rest;

    if (isPlainObject(lastArg) && ((lastArg as LogOptions).error || (lastArg as LogOptions).context)) {
      options = lastArg as LogOptions;
      parameters = rest.slice(0, -1);
    }

    return {
      message: this.formatMessage(message as string, parameters),
      options,
      parameters
    };
  }

  /**
   * Log an error message
   * @param message The error message or format string
   * @param args Additional parameters or LogOptions
   * @example
   * logger.error('Database connection failed');
   * logger.error('Payment failed for order %s', orderId, { error: paymentError });
   */
  public error(message: unknown, ...args: unknown[]): void {
    const { message: formattedMessage, options } = this.processArgs([message, ...args]);
    this.logToConsole(
      `${colors.bold}${colors.red}[ERROR]${colors.reset}`,
      formattedMessage,
      options,
      console.error
    );
  }

  /**
   * Log a scope-specific error message
   * @param scope The scope identifier (e.g., 'database', 'auth')
   * @param message The error message or format string
   * @param args Additional parameters or LogOptions
   * @example
   * logger.scopedError('database', 'Connection failed');
   * logger.scopedError('auth', 'Login failed for user %s', username, { error: authError });
   */
  public scopedError(scope: scopes, message: unknown, ...args: unknown[]): void {
    const config = this.platformConfigs.get(scope) || { scope, color: colors.white };
    const { message: formattedMessage, options } = this.processArgs([message, ...args]);
    const platformLabel = `${config.color}[${scope.toUpperCase()}]${colors.reset}`;
    const errorLabel = `${colors.bold}${colors.red}[ERROR]${colors.reset}`;
    this.logToConsole(
      `${platformLabel} ${errorLabel}`,
      formattedMessage,
      options,
      console.error
    );
  }

  /**
   * Log an informational message
   * @param message The info message or format string
   * @param args Additional parameters or LogOptions
   * @example
   * logger.info('Server started on port %d', 3000);
   * logger.info('User %s logged in', username, { context: { userId: 123 } });
   */
  public info(message: unknown, ...args: unknown[]): void {
    const { message: formattedMessage, options } = this.processArgs([message, ...args]);
    this.logToConsole(
      `${colors.bold}${colors.cyan}[INFO]${colors.reset}`,
      formattedMessage,
      options,
      console.log
    );
  }

  /**
   * Log a scope-specific informational message
   * @param scope The scope identifier (e.g., 'route', 'controller')
   * @param message The info message or format string
   * @param args Additional parameters or LogOptions
   * @example
   * logger.scopedInfo('route', 'GET /api/users 200 15ms');
   * logger.scopedInfo('database', 'Query executed in %dms', 42);
   */
  public scopedInfo(scope: scopes, message: unknown, ...args: unknown[]): void {
    const config = this.platformConfigs.get(scope) || { scope, color: colors.white };
    const { message: formattedMessage, options } = this.processArgs([message, ...args]);
    const platformLabel = `${config.color}[${scope.toUpperCase()}]${colors.reset}`;
    const infoLabel = `${colors.bold}${colors.cyan}[INFO]${colors.reset}`;
    this.logToConsole(
      `${platformLabel} ${infoLabel}`,
      formattedMessage,
      options,
      console.log
    );
  }

  /**
   * Log a debug message (only in development environment)
   * @param message The debug message or format string
   * @param args Additional parameters or LogOptions
   * @example
   * logger.debug('Cache state:', cacheEntries);
   * logger.debug('Request headers:', headers, { context: { requestId: 'abc123' } });
   */
  public debug(message: unknown, ...args: unknown[]): void {
    if (process.env.STAGE !== 'development') return;
    const { message: formattedMessage, options } = this.processArgs([message, ...args]);
    this.logToConsole(
      `${colors.bold}${colors.magenta}[DEBUG]${colors.reset}`,
      formattedMessage,
      options,
      console.debug
    );
  }

  /**
   * Log a scope-specific debug message (only in development environment)
   * @param scope The scope identifier (e.g., 'middleware', 'controller')
   * @param message The debug message or format string
   * @param args Additional parameters or LogOptions
   * @example
   * logger.scopedDebug('middleware', 'Request body:', requestBody);
   * logger.scopedDebug('auth', 'JWT payload:', payload, { context: { userId: 456 } });
   */
  public scopedDebug(scope: scopes, message: unknown, ...args: unknown[]): void {
    if (process.env.STAGE !== 'development') return;
    const config = this.platformConfigs.get(scope) || { scope, color: colors.white };
    const { message: formattedMessage, options } = this.processArgs([message, ...args]);
    const platformLabel = `${config.color}[${scope.toUpperCase()}]${colors.reset}`;
    const debugLabel = `${colors.bold}${colors.magenta}[DEBUG]${colors.reset}`;
    this.logToConsole(
      `${platformLabel} ${debugLabel}`,
      formattedMessage,
      options,
      console.debug
    );
  }

  /**
   * Log a success message
   * @param message The success message or format string
   * @param args Additional parameters or LogOptions
   * @example
   * logger.success('Order %s completed', orderId);
   * logger.success('User created successfully', { context: { email: 'user@example.com' } });
   */
  public success(message: unknown, ...args: unknown[]): void {
    const { message: formattedMessage, options } = this.processArgs([message, ...args]);
    this.logToConsole(
      `${colors.bold}${colors.green}[SUCCESS]${colors.reset}`,
      formattedMessage,
      options,
      console.log
    );
  }

  /**
   * Log a warning message
   * @param message The warning message or format string
   * @param args Additional parameters or LogOptions
   * @example
   * logger.warn('Deprecated API called');
   * logger.warn('High memory usage detected: %dMB', memoryUsage, { context: { threshold: 512 } });
   */
  public warn(message: unknown, ...args: unknown[]): void {
    const { message: formattedMessage, options } = this.processArgs([message, ...args]);
    this.logToConsole(
      `${colors.bold}${colors.yellow}[WARNING]${colors.reset}`,
      formattedMessage,
      options,
      console.warn
    );
  }

  /**
   * Log an API-related message
   * @param message The API message or format string
   * @param args Additional parameters or LogOptions
   * @example
   * logger.api('GET /api/products 200 15ms');
   * logger.api('POST /api/users 201 25ms', { context: { userId: 789 } });
   */
  public api(message: unknown, ...args: unknown[]): void {
    const { message: formattedMessage, options } = this.processArgs([message, ...args]);
    this.logToConsole(
      `${colors.bold}${colors.blue}[API]${colors.reset}`,
      formattedMessage,
      options,
      console.log
    );
  }

  /**
   * Log a generic scope-specific message
   * @param scope The scope identifier (e.g., 'server', 'disk')
   * @param message The message or format string
   * @param args Additional parameters or LogOptions
   * @example
   * logger.scope('server', 'Server listening on port %d', 3000);
   * logger.scope('disk', 'Storage usage at %d%%', 75, { context: { totalSpace: '500GB' } });
   */
  public scope(scope: scopes, message: unknown, ...args: unknown[]): void {
    const config = this.platformConfigs.get(scope) || { scope, color: colors.white };
    const { message: formattedMessage, options } = this.processArgs([message, ...args]);
    this.logToConsole(
      `${config.color}[${scope.toUpperCase()}]${colors.reset}`,
      formattedMessage,
      options,
      console.log
    );
  }

  /**
   * Centralized logging logic
   * @private
   */
  private logToConsole(
    levelLabel: string,
    message: string,
    options: LogOptions,
    output: typeof console.log
  ): void {
    const logParts = [this.timestamp, levelLabel, message];

    if (options.context) {
      logParts.push(`\n${colors.gray}CONTEXT:${colors.reset} ${this.formatContext(options.context)}`);
    }

    output(logParts.join(' - '));

    if (options.error) {
      console.error(`${colors.red}%s${colors.reset}`,
        util.inspect(options.error, {
          ...DEFAULT_INSPECT_OPTIONS,
          colors: true,
          compact: false
        })
      );
    }
  }
}

export default new Logger();