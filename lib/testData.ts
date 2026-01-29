// User Test Data
export const USERS = {
  STANDARD: 'standard_user',
  LOCKED_OUT: 'locked_out_user',
  PROBLEM: 'problem_user',
  PERFORMANCE_GLITCH: 'performance_glitch_user',
  INVALID: 'invalid_user'
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  LOCKED_OUT: 'Epic sadface: Sorry, this user has been locked out.',
  INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match any user in this service',
  MISSING_PASSWORD: 'Epic sadface: Password is required',
  MISSING_USERNAME: 'Epic sadface: Username is required'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  ORDER_COMPLETE: 'Thank you for your order!',
  PRODUCTS_TITLE: 'Products'
} as const;

// Test Data for Forms
export const TEST_DATA = {
  FIRST_NAME: 'Test',
  LAST_NAME: 'User',
  POSTAL_CODE: '12345',
  LOW_PRICE: '$7.99'
} as const;



// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: '/api/login'
} as const;