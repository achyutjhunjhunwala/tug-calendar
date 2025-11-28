import pino from 'pino';
import type { Logger } from 'pino';

const createLogger = (): Logger => {
  const logLevel = process.env.LOG_LEVEL || 'info';
  const serviceName = process.env.SERVICE_NAME || 'tug-calendar';
  const nodeEnv = process.env.NODE_ENV || 'development';

  const baseConfig = {
    level: logLevel,
    base: {
      service: {
        name: serviceName,
        environment: nodeEnv,
      },
    },
  };

  if (nodeEnv === 'development') {
    return pino({
      ...baseConfig,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
    });
  }

  return pino(baseConfig);
};

export const logger = createLogger();

