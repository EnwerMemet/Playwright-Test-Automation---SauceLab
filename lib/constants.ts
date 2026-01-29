// URLs
export const URLS = {
  BASE: '/inventory.html',
  LOGIN: '/',
  INVENTORY: '/inventory.html',
  CART: '/cart.html',
  CHECKOUT_STEP_ONE: '/checkout-step-one.html',
  CHECKOUT_STEP_TWO: '/checkout-step-two.html',
  CHECKOUT_COMPLETE: '/checkout-complete.html'
} as const;

// Login Page Selectors
export const LOGIN_SELECTORS = {
  USERNAME_INPUT: '[data-test="username"]',
  PASSWORD_INPUT: '[data-test="password"]',
  LOGIN_BUTTON: '[data-test="login-button"]',
  ERROR_MESSAGE: '[data-test="error"]'
} as const;

// Inventory Page Selectors
export const INVENTORY_SELECTORS = {
  ITEM_NAME: '.inventory_item_name',
  ITEM_PRICE: '.inventory_item_price',
  ADD_TO_CART_BUTTON: '.btn_inventory',
  SHOPPING_CART_LINK: '.shopping_cart_link',
  SHOPPING_CART_BADGE: '.shopping_cart_badge',
  PRODUCT_SORT_CONTAINER: '.product_sort_container',
  TITLE: '.title'
} as const;

// Cart Page Selectors
export const CART_SELECTORS = {
  CHECKOUT_BUTTON: '[data-test="checkout"]'
} as const;

// Checkout Page Selectors
export const CHECKOUT_SELECTORS = {
  FIRST_NAME: '[data-test="firstName"]',
  LAST_NAME: '[data-test="lastName"]',
  POSTAL_CODE: '[data-test="postalCode"]',
  CONTINUE_BUTTON: '[data-test="continue"]'
} as const;

// Overview Page Selectors
export const OVERVIEW_SELECTORS = {
  ITEM_NAME: '.inventory_item_name',
  ITEM_PRICE: '.inventory_item_price',
  FINISH_BUTTON: '[data-test="finish"]'
} as const;

// Checkout Complete Selectors
export const COMPLETE_SELECTORS = {
  COMPLETE_HEADER: '.complete-header',
  BACK_TO_PRODUCTS: '[data-test="back-to-products"]'
} as const;

// Specific Product Selectors
export const PRODUCT_SELECTORS = {
  SAUCE_LABS_BACKPACK_ADD: '#add-to-cart-sauce-labs-backpack',
  SAUCE_LABS_BACKPACK_REMOVE: '#remove-sauce-labs-backpack'
} as const;

// Cookie Configuration
export const COOKIE_CONFIG = {
  SESSION_USERNAME: 'session-username',
  DOMAIN: 'www.saucedemo.com',
  PATH: '/'
} as const;