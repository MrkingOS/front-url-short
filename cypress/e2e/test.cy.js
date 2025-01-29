describe('URL Shortener E2E', () => {
  const validUrl = 'https://www.youtube.com/watch?v=Y4z3psSbMEo';
  const invalidUrl = 'invalid-url';
  let shortUrl = null;

  beforeEach(() => {
    cy.visit('http://localhost:3001');
    shortUrl = null;
  });

  it('should shorten a valid URL', () => {
    cy.get('[data-testid="long-url-input"]').type(validUrl);
    cy.get('[data-testid="submit-button"]').click();


    cy.get('[data-testid="short-url"]')
      .should('be.visible')
      .should('have.attr', 'href')
      .then((href) => {
        shortUrl = href.split('/').pop(); 
        Cypress.env('shortUrl', shortUrl);
        cy.log('Short URL stored:', shortUrl);
    });
  });

  it('should show an error for an invalid URL', () => {
    cy.get('[data-testid="long-url-input"]').type(invalidUrl);
    cy.get('[data-testid="submit-button"]').click();

    cy.get('[data-testid="error-message"]')
      .should('be.visible')
      .and('contain', 'Please enter a valid URL');
  });

  it('should allow copying the short URL', () => {
    cy.get('[data-testid="long-url-input"]').type(validUrl);
    cy.get('[data-testid="submit-button"]').click();

    cy.get('[data-testid="short-url"]').should('be.visible');
    cy.get('[data-testid="copy-button"]').click();

  });

  it('should redirect to the original URL when visiting a valid short URL', function () {
    const shortUrl = Cypress.env('shortUrl');
    cy.visit(`http://localhost:3000/${shortUrl}`, { failOnStatusCode: false });
  });
  

  it('should show an error for a non-existent short URL', () => {
    cy.visit('http://localhost:3000/nonexistent123');

    cy.get('[data-testid="error-message"]')
      .should('be.visible')
      .and('contain', 'URL not found');
  });
});
