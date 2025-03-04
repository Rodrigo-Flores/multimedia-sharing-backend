export type scopes = 'disk' | 'route' | 'controller' | 'server' | 'database' | 'middleware' | 'auth';

export interface LogOptions {
  error?: Error;
  context?: Record<string, unknown>;
}

export type LoggerLevel = 'error' | 'warn' | 'info' | 'debug' | 'success' | 'api';

export interface LogEntry {
  timestamp: string;
  level: LoggerLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
  scope?: scopes;
}

export interface PlatformLogConfig {
  scope: scopes;
  color: string;
}