// cypress/support/e2e.js
Cypress.on("uncaught:exception", (err, runnable) => {
    return false; // Prevents Cypress from failing on exceptions thrown by the app
  });