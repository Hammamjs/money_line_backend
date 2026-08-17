import { logWarn, logInfo, logError } from './log-type.js';

export enum AuditEvent {
  // Successes
  SIGNIN_SUCCESS = 'AUTH_SIGNIN_SUCCESS',
  SIGNUP_SUCCESS = 'AUTH_SIGNUP_SUCCESS',
  LOGOUT_SUCCESS = 'AUTH_LOGOUT_SUCCESS',
  REFRESH_SUCCESS = 'AUTH_REFRESH_SUCCESS',
  OAUTH_GOOGLE_SUCCESS = 'OAUTH_GOOGLE_SUCCESS',

  // Failures / Warnings
  SIGNIN_FAILED_NO_USER = 'AUTH_SIGNIN_FAILED_NO_USER',
  SIGNIN_FAILED_BAD_PASS = 'AUTH_SIGNIN_FAILED_BAD_PASSWORD',
  SIGNIN_FAILED_NO_PASS = 'AUTH_SIGNIN_FAILED_NO_PASSWORD',
  SIGNUP_CONFLICT = 'AUTH_SIGNUP_CONFLICT',
  INVALID_TOKEN = 'AUTH_INVALID_TOKEN',

  // Security / Errors
  TOKEN_REUSE_DETECTED = 'SECURITY_TOKEN_REUSE_DETECTED',
  DB_UPDATE_ERROR = 'AUTH_DB_UPDATE_ERROR',
}

interface AuditContext {
  userId?: string;
  email?: string;
  reason?: string;
  [key: string]: string;
}

export const auditAuth = (event: AuditEvent, context: AuditContext = {}) => {
  const payload = { action: event, ...context };
  if (event.startsWith('SECURITY') || event.endsWith('ERROR')) {
    logError(`Auth Security/Error ${event}`, payload);
  } else if (
    event.includes('_FAILED') ||
    event.includes('CONFLICT') ||
    event.includes('INVALID')
  ) {
    logWarn(`[Auth Warnign] ${event}`, payload);
  } else {
    logInfo(`Auth Event ${event}`, payload);
  }
};
