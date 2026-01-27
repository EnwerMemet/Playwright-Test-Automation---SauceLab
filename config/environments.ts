export interface EnvironmentConfig {
  name: string;
  baseURL: string;
  apiURL: string;
  timeout: {
    action: number;
    navigation: number;
    network: number;
  };
  retries: {
    test: number;
    operation: number;
  };
  users: {
    standard: string;
    locked: string;
    problem: string;
  };
  password: string;
  headless: boolean;
  slowMo: number;
  screenshot: 'off' | 'on' | 'only-on-failure';
  video: 'off' | 'on' | 'retain-on-failure';
  trace: 'off' | 'on' | 'retain-on-failure';
}

export const environments: Record<string, EnvironmentConfig> = {
  development: {
    name: 'Development',
    baseURL: 'https://www.saucedemo.com',
    apiURL: 'https://www.saucedemo.com/api',
    timeout: {
      action: 15000,
      navigation: 45000,
      network: 15000
    },
    retries: {
      test: 0,
      operation: 3
    },
    users: {
      standard: 'standard_user',
      locked: 'locked_out_user',
      problem: 'problem_user'
    },
    password: 'secret_sauce',
    headless: true,  // Changed to true for headless mode
    slowMo: 0,
    screenshot: 'only-on-failure',
    video: 'off',
    trace: 'retain-on-failure'
  },
  
  staging: {
    name: 'Staging',
    baseURL: 'https://www.saucedemo.com',
    apiURL: 'https://www.saucedemo.com/api',
    timeout: {
      action: 10000,
      navigation: 30000,
      network: 10000
    },
    retries: {
      test: 1,
      operation: 3
    },
    users: {
      standard: 'standard_user',
      locked: 'locked_out_user',
      problem: 'problem_user'
    },
    password: 'secret_sauce',
    headless: true,  // Ensure headless mode
    slowMo: 0,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },
  
  production: {
    name: 'Production',
    baseURL: 'https://www.saucedemo.com',
    apiURL: 'https://www.saucedemo.com/api',
    timeout: {
      action: 8000,
      navigation: 25000,
      network: 8000
    },
    retries: {
      test: 2,
      operation: 5
    },
    users: {
      standard: process.env.SAUCE_USERNAME || 'standard_user',
      locked: 'locked_out_user',
      problem: 'problem_user'
    },
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
    headless: true,
    slowMo: 0,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },
  
  ci: {
    name: 'CI/CD',
    baseURL: 'https://www.saucedemo.com',
    apiURL: 'https://www.saucedemo.com/api',
    timeout: {
      action: 10000,
      navigation: 30000,
      network: 10000
    },
    retries: {
      test: 2,
      operation: 3
    },
    users: {
      standard: process.env.SAUCE_USERNAME || 'standard_user',
      locked: 'locked_out_user',
      problem: 'problem_user'
    },
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
    headless: true,
    slowMo: 0,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  }
};

export function getEnvironment(): EnvironmentConfig {
  const env = process.env.TEST_ENV || 'development';
  
  if (!environments[env]) {
    console.warn(`Environment '${env}' not found. Using 'development' as fallback.`);
    return environments.development;
  }
  
  const config = environments[env];
  
  // Override headless mode if explicitly set
  const headlessOverride = process.env.HEADLESS;
  if (headlessOverride !== undefined) {
    config.headless = headlessOverride === 'true';
  }
  
  return config;
}