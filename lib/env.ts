import dotenv from 'dotenv';

// Load environment-specific .env file
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: envFile });

export type Environment = 'development' | 'staging' | 'production' | 'test';

interface EnvConfig {
  NODE_ENV?: Environment;
  SAUCE_USERNAME: string;
  SAUCE_PASSWORD: string;
  BASE_URL?: string;
  TIMEOUT_MULTIPLIER?: number;
  HEADLESS?: boolean;
  SLOW_MO?: boolean;
  PARALLEL_WORKERS?: number;
  RETRY_COUNT?: number;
}

export function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required but not set in ${envFile}`);
  }
  return value;
}

export function getOptionalEnvVar<T>(name: string, defaultValue: T): T {
  const value = process.env[name];
  return (value as T) || defaultValue;
}

export const env: EnvConfig = {
  NODE_ENV: getOptionalEnvVar('NODE_ENV', 'development') as Environment,
  SAUCE_USERNAME: getRequiredEnvVar('SAUCE_USERNAME'),
  SAUCE_PASSWORD: getRequiredEnvVar('SAUCE_PASSWORD'),
  BASE_URL: getOptionalEnvVar('BASE_URL', 'https://www.saucedemo.com'),
  TIMEOUT_MULTIPLIER: getOptionalEnvVar('TIMEOUT_MULTIPLIER', 1),
  HEADLESS: getOptionalEnvVar('HEADLESS', true),
  SLOW_MO: getOptionalEnvVar('SLOW_MO', false),
  PARALLEL_WORKERS: getOptionalEnvVar('PARALLEL_WORKERS', 4),
  RETRY_COUNT: getOptionalEnvVar('RETRY_COUNT', 2)
};

// Helper function to get current environment
export function getCurrentEnvironment(): Environment {
  return env.NODE_ENV || 'development';
}

// Environment checkers
export const isDevelopment = env.NODE_ENV === 'development';
export const isStaging = env.NODE_ENV === 'staging';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';