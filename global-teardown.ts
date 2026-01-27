import { FullConfig } from '@playwright/test';
import { getEnvironment } from './config/environments';

async function globalTeardown(config: FullConfig) {
  const env = getEnvironment();
  
  console.log(`🏁 Tests completed in ${env.name} environment`);
  
  // Environment-specific cleanup
  if (env.name === 'ci') {
    console.log('📊 CI/CD cleanup: Reports will be uploaded as artifacts');
  }
  
  console.log('✅ Global teardown completed');
}

export default globalTeardown;