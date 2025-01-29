const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3001",
    supportFile: "cypress/support/e2e.js",
    setupNodeEvents(on, config) {
      
    },
  },
});