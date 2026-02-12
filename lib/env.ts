import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  SAUCE_USERNAME: string;
  SAUCE_PASSWORD: string;
  BASE_URL?: string;
}

function getRequiredEnvVar(name: keyof EnvConfig): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  return value;
}

export const env: EnvConfig = {
  SAUCE_USERNAME: getRequiredEnvVar('SAUCE_USERNAME'),
  SAUCE_PASSWORD: getRequiredEnvVar('SAUCE_PASSWORD'),
  BASE_URL: process.env.BASE_URL || 'https://www.saucedemo.com'
};