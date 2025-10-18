import type { EnvironmentConfig } from '../types';

const validateEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const getConfig = (): EnvironmentConfig => {
  return {
    tugNsApiUrl: validateEnvVar('TUG_NS_API'),
    tugNsApiKey: validateEnvVar('TUG_NS_TOKEN'),
    elasticsearchCloudId: process.env.ELASTIC_CLOUD_ID || '',
    elasticsearchApiKey: process.env.ELASTIC_API_KEY || '',
    serviceName: process.env.SERVICE_NAME || 'tug-calendar',
    nodeEnv: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
  };
};

