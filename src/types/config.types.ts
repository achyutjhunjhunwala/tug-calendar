export interface EnvironmentConfig {
  tugNsApiUrl: string;
  tugNsApiKey: string;
  elasticsearchCloudId: string;
  elasticsearchApiKey: string;
  serviceName: string;
  nodeEnv: string;
  logLevel: string;
}

export interface GoogleServiceAccount {
  client_email: string;
  private_key: string;
}

