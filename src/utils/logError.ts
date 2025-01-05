import logger from './logger';

export function logError(context: string, error: unknown): void {
  if (error instanceof Error) {
    logger.error(`${context}: ${error.message}`);
  } else {
    logger.error(`${context}: ${String(error)}`);
  }
}
