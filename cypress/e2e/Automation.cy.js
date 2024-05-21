// Added this block to handle uncaught exceptions
describe.only('Automation Exercise', () => {
    // Add this block to handle uncaught exceptions
    Cypress.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from failing the test
      return false;
    });
  
    it.only('Should perform the required actions', () => {
      // Step 1: Visit the website and click on Sign-In
      cy.visit('https://www.automationexercise.com/');
      cy.get('a[href="/login"]').click();
  
      // Step 2: Sign-In using provided credentials
      cy.get('input[data-qa="login-email"]').type('qat@mailinator.com');
      cy.get('input[data-qa="login-password"]').type('123456');
      cy.get('button[data-qa="login-button"]').click();
  
      // Step 3: Fetch labels and prices, sort by price, and log to console
      cy.get('.features_items .col-sm-4').then($items => {
        const items = [];
        $items.each((index, item) => {
          const label = Cypress.$(item).find('.productinfo p').text().trim();
          const price = parseFloat(Cypress.$(item).find('.productinfo h2').text().trim().replace('Rs.', ''));
          items.push({ label, price });
        });
        const sortedItems = items.sort((a, b) => a.price - b.price);
        sortedItems.forEach(item => {
          cy.log(`Label: ${item.label}, Price: Rs.${item.price}`);
        });
      });
  
      // Step 4: Scroll Up and navigate to Women >> Dress >> Women – Tops Products
      cy.scrollTo('top');
      cy.get('a:contains("Women")').click();
      cy.get('#Women').should('have.class', 'in'); // Ensure the panel is expanded
      cy.get('#Women a:contains("Tops")').click();
  
      // Ensure the page has loaded the correct subcategory
      cy.url().should('include', '/category_products/2');
  
      // Select the Fancy Green Top and add to cart
      cy.contains('Fancy Green Top').parents('.productinfo').within(() => {
        cy.get('.add-to-cart').click();
      });
      cy.get('button.close-modal').click();
  
      // Select Summer White Top and add to cart
      cy.contains('Summer White Top').parents('.productinfo').within(() => {
        cy.get('.add-to-cart').click();
      });
      cy.get('button.close-modal').click();
  
      // Step 5: View cart and proceed to checkout
      cy.get('a[href="/view_cart"]').first().click(); // Ensure only the first element is clicked
      cy.contains('Proceed To Checkout').click();
  
      // Add comments and place order
      cy.get('textarea[name="message"]').type('Order placed.');
      cy.contains('Place Order').click();
  
      // Enter card details and confirm order
      cy.get('input[data-qa="name-on-card"]').type('Test Card');
      cy.get('input[data-qa="card-number"]').type('4100 0000 0000 0000');
      cy.get('input[data-qa="cvc"]').type('123');
      cy.get('input[data-qa="expiry-month"]').type('01');
      cy.get('input[data-qa="expiry-year"]').type('1900');
      cy.get('button[data-qa="pay-button"]').click();
  
      // Confirm order has been placed
      cy.contains('Order Placed!').should('be.visible');
    });
  });
  