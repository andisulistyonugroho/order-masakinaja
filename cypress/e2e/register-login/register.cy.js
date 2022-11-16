describe('The Register Page', () => {
  it('register', () => doRegister())
  it('verify token', () => verifyToken())
})

function doRegister () {
  cy.intercept('POST', '/api/Users/registerCustomer').as('registerCustomer')

  cy.visit('/register')
  cy.get('[data-cy="name"]').type('tester cypress')
  cy.get('[data-cy="wa"]').type('08987654321')
  cy.get('[data-cy="birthday-menu"]').click()
  cy.get('[data-cy="ok-birthdate"]').click()
  cy.get('[data-cy="agreement-btn"]').click()
  cy.get('[data-cy="register-btn"]').click()

  cy.wait('@registerCustomer', { timeout: 30000 })
    .then(xhr => xhr.response.statusCode)
    .should('be.oneOf', [200, 304])
}

function verifyToken () {
  cy.intercept('POST', '/api/Users/confirmToken').as('confirmToken')

  cy.get('[data-cy="verification-token"]').type('ganti value dengan value di user->verificationToken')
  cy.get('[data-cy="submit-verification"]').click()

  cy.wait('@confirmToken', { timeout: 30000 })
    .then(xhr => xhr.response.statusCode)
    .should('be.oneOf', [200, 304])
}
