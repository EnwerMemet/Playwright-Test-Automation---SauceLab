# Environment Variables for Testing

This directory contains environment-specific configuration files:

## Files Available:
- `.env.development` - Development environment
- `.env.staging` - Staging environment  
- `.env.production` - Production environment
- `.env.test` - CI/Testing environment

## How to Use:

### Manual Environment Setting:
```bash
# Set environment manually
export NODE_ENV=development
npm test

# Or use npm scripts
npm run env:dev  # Shows current env file
npm run test:dev  # Tests with development settings
```

### Environment-Specific Features:

**Development:**
- Faster timeouts (0.8x multiplier)
- Headed browser (visible)
- No retry logic

**Staging:**
- Normal timeouts (1.0x multiplier)
- Headless browser
- Slow mode enabled for debugging

**Production:**
- Longer timeouts (1.2x multiplier)
- Headless browser
- Retry logic enabled (3 retries)
- Slow mode enabled

**CI/Test:**
- Fast timeouts (0.5x multiplier)
- Single worker for stability
- All recording enabled

### Variable Reference:
- `TIMEOUT_MULTIPLIER` - Speed multiplier for timeouts
- `HEADLESS` - Browser visibility control
- `SLOW_MO` - Enable slow mode for debugging
- `PARALLEL_WORKERS` - Number of parallel workers
- `RETRY_COUNT` - Number of retry attempts