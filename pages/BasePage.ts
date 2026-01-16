import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(path: string) {
    await this.page.goto(path);
  }
}



// // 1. IMPORT: We bring in the 'Page' type. 
// // This gives us autocomplete (IntelliSense) so when we type 'this.page.', 
// // VS Code shows us methods like .goto() or .click().
// import { Page } from '@playwright/test';

// // 2. CLASS DEFINITION: 'export' lets us use this file in our tests.
// // 'BasePage' is the name of our blueprint.
// export class BasePage {
  
//   // 3. VARIABLE DECLARATION: We create a variable called 'page'.
//   // 'readonly' means we can only set its value once (in the constructor).
//   // ': Page' tells TypeScript that this variable IS a Playwright Page object.
//   readonly page: Page;

//   // 4. THE CONSTRUCTOR: This is the "Setup" function.
//   // It runs the moment you write: const myPage = new BasePage(page);
//   // It takes the 'page' from your test and "captures" it inside this class.
//   constructor(page: Page) {
//     this.page = page; // 'this.page' refers to the variable in line 10.
//   }

//   // 5. REUSABLE METHOD: This is a "Helper" function.
//   // Instead of writing 'await page.goto()' in every single test, 
//   // you just call 'await loginPage.navigateTo("/")'.
//   async navigateTo(path: string) {
//     // 'path' is a placeholder for the URL (e.g., "https://google.com")
//     await this.page.goto(path);
//   }
// }