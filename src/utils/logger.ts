import pino from 'pino';
import type { Logger } from 'pino';

const createLogger = (): Logger => {
  const elasticsearchCloudId = process.env.ELASTIC_CLOUD_ID;
  const elasticsearchApiKey = process.env.ELASTIC_API_KEY;
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

  if (elasticsearchCloudId && elasticsearchApiKey && nodeEnv !== 'development') {
    return pino(
      baseConfig,
      pino.transport({
        target: 'pino-elasticsearch',
        options: {
          cloud: {
            id: elasticsearchCloudId,
          },
          auth: {
            apiKey: elasticsearchApiKey,
          },
          index: 'logs-tug.calendar-production',
          consistency: 'one',
          node: undefined,
          esVersion: 8,
          flushBytes: 100,
          flushInterval: 10000,
          'op-type': 'create',
        },
      })
    );
  }

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
};

export const logger = createLogger();

