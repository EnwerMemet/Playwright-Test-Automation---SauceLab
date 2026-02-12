# Multi-Environment Playwright Test Automation

This document explains the environment system setup for running tests across different stages.

## 🚀 Quick Start

### Running Tests
```bash
# Using default environment (test with headless)
npx playwright test

# Using specific environments
npm run test:dev      # Development (fast timeouts, headed)
npm run test:staging  # Staging (normal timeouts, headless)  
npm run test:prod     # Production (long timeouts, headless, retries)
npm run test:ci       # CI (fast timeouts, single worker)

# Manual environment switching
NODE_ENV=development npx playwright test
NODE_ENV=staging npx playwright test
NODE_ENV=production npx playwright test
```

## 📁 Environment Files

### `.env.development`
```bash
NODE_ENV=development
SAUCE_USERNAME=standard_user
SAUCE_PASSWORD=secret_sauce
BASE_URL=https://www.saucedemo.com
TIMEOUT_MULTIPLIER=0.8    # 20% faster than normal
HEADLESS=false            # Visible browser for debugging
SLOW_MO=false
```

### `.env.staging`
```bash
NODE_ENV=staging
SAUCE_USERNAME=standard_user
SAUCE_PASSWORD=secret_sauce
BASE_URL=https://staging.saucedemo.com
TIMEOUT_MULTIPLIER=1.0    # Normal timeouts
HEADLESS=true            # Headless for automated testing
SLOW_MO=true             # Slow mode for debugging
```

### `.env.production`
```bash
NODE_ENV=production
SAUCE_USERNAME=standard_user
SAUCE_PASSWORD=secret_sauce
BASE_URL=https://www.saucedemo.com
TIMEOUT_MULTIPLIER=1.2    # 20% longer timeouts for stability
HEADLESS=true            # Headless for CI/CD
SLOW_MO=true             # Slow mode for thorough testing
RETRY_COUNT=3           # Retry failed tests
```

### `.env.test` (Default)
```bash
NODE_ENV=test
SAUCE_USERNAME=standard_user
SAUCE_PASSWORD=secret_sauce
BASE_URL=https://www.saucedemo.com
TIMEOUT_MULTIPLIER=0.5    # 50% faster timeouts for CI speed
HEADLESS=true            # Always headless in CI
SLOW_MO=false
PARALLEL_WORKERS=1        # Single worker for CI stability
RETRY_COUNT=2
```

## ⚙️ Configuration Details

### Timeout System
- **Base timeouts**: 5s (SHORT), 10s (MEDIUM), 30s (LONG), 15s (NAVIGATION)
- **Multipliers**: 0.5x (test), 0.8x (dev), 1.0x (staging), 1.2x (production)
- **Example**: Test SHORT timeout = 5s × 0.5 = 2.5s

### Browser Configuration
- **Headed**: Development environment for manual debugging
- **Headless**: All other environments for automated testing
- **CI Detection**: Automatically sets headless=true when process.env.CI is true

### Worker Configuration
- **Development**: 4 workers (parallel execution)
- **CI/CD**: 1 worker (single-threaded for stability)
- **Manual**: Controlled by PARALLEL_WORKERS variable

### Retry Logic
- **Enabled**: Only in production environment (3 retries)
- **Disabled**: Other environments for faster feedback

## 🔄 Environment Detection

### TypeScript Helpers
```typescript
import { isDevelopment, isStaging, isProduction, isTest } from '../lib/env';

if (isDevelopment) {
  // Development-specific code
}

if (isProduction) {
  // Production-specific code with retries
}
```

### Current Environment
```typescript
import { getCurrentEnvironment } from '../lib/env';

const currentEnv = getCurrentEnvironment(); // 'development' | 'staging' | 'production' | 'test'
```

## 🐛 Troubleshooting

### CI/CD Pipeline Errors
If you see:
```
Target page, context or browser has been closed
```

Solution: Ensure `HEADLESS=true` in your environment file.

### Module Resolution Issues
If you see:
```
Cannot find module '../env'
```

Solution: Check that env.ts file exists and exports are correct.

### Timeout Issues
If tests are timing out:
1. Check TIMEOUT_MULTIPLIER in your environment file
2. Increase for slower networks: `TIMEOUT_MULTIPLIER=2.0`
3. Decrease for faster feedback: `TIMEOUT_MULTIPLIER=0.3`

## 🎯 Best Practices

### Development
```bash
# Use development environment for debugging
npm run test:dev

# Features: visible browser, fast timeouts, parallel workers
```

### CI/CD Pipeline
```bash
# Use test environment for CI
npm run test:ci

# Features: headless browser, fast timeouts, single worker
```

### Production Monitoring
```bash
# Use production environment for long-running tests
npm run test:prod

# Features: extended timeouts, retry logic, headless browser
```

## 📊 Performance Impact

| Environment | Timeout Speed | Workers | Browser | Best For |
|------------|----------------|---------|----------|------------|
| Development | 0.8x faster   | 4       | Headed  | Local debugging |
| Staging    | Normal       | 4       | Headless | Pre-production |
| Production  | 1.2x slower  | 4       | Headless | Quality checks |
| Test/CI    | 2x faster    | 1       | Headless | Fast pipelines |

## 🚨 Security Notes

- **Never commit real credentials** to environment files
- **Use different accounts** for different environments
- **Rotate secrets** regularly
- **Use environment variables** in CI/CD for sensitive data

## 📝 NPM Scripts Reference

```json
{
  "scripts": {
    "test:dev": "NODE_ENV=development npx playwright test",
    "test:staging": "NODE_ENV=staging npx playwright test", 
    "test:prod": "NODE_ENV=production npx playwright test",
    "test:ci": "NODE_ENV=test npx playwright test",
    "test:slow": "NODE_ENV=test SLOW_MO=true npx playwright test",
    "test:headless": "NODE_ENV=production HEADLESS=true npx playwright test"
  }
}
```