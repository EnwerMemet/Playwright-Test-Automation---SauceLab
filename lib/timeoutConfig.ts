// Environment-specific timeout configurations
export function getTimeouts(timeoutMultiplier: number = 1) {
  return {
    SHORT: Math.floor(5000 * timeoutMultiplier),      // 5 seconds
    MEDIUM: Math.floor(10000 * timeoutMultiplier),   // 10 seconds
    LONG: Math.floor(30000 * timeoutMultiplier),      // 30 seconds
    NAVIGATION: Math.floor(15000 * timeoutMultiplier)  // 15 seconds
  };
}

export const getRetryCount = (retryCount: number = 2): number => {
  return retryCount;
};