import { FullConfig } from '@playwright/test';
import { getEnvironment } from './config/environments';

async function globalSetup(config: FullConfig) {
  const env = getEnvironment();
  
  console.log(`🚀 Starting tests in ${env.name} environment`);
  console.log(`📍 Base URL: ${env.baseURL}`);
  console.log(`🌐 API URL: ${env.apiURL}`);
  console.log(`👤 Users: Standard=${env.users.standard}, Locked=${env.users.locked}`);
  
  // Set environment variables for tests
  process.env.TEST_BASE_URL = env.baseURL;
  process.env.TEST_API_URL = env.apiURL;
  process.env.TEST_STANDARD_USER = env.users.standard;
  process.env.TEST_LOCKED_USER = env.users.locked;
  process.env.TEST_PROBLEM_USER = env.users.problem;
  process.env.TEST_PASSWORD = env.password;
  process.env.TEST_TIMEOUT = String(env.timeout.action);
  process.env.TEST_NAVIGATION_TIMEOUT = String(env.timeout.navigation);
  
  // Environment-specific setup
  if (env.name === 'development') {
    console.log('🛠️ Development mode: Running with visible browser');
  } else if (env.name === 'production') {
    console.log('🔒 Production mode: Using real credentials');
  } else if (env.name === 'ci') {
    console.log('🔄 CI/CD mode: Optimized for pipeline execution');
  }
  
  return async () => {
    // Global cleanup if needed
    console.log('✅ Global setup completed');
  };
}

export default globalSetup;