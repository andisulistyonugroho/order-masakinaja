describe('The Login Page', () => {
  it('login', function () {
    cy.visit('/login')
    cy.get('input#username').type(Cypress.env('loginUsername'))

    // {enter} causes the form to submit
    cy.get('input#password').type(`${Cypress.env('loginPassword')}`)

    cy.intercept('GET', '/api/UserProfiles/findOne**').as('getProfile')
    cy.get('button#btnLogin').click()
    cy.wait('@getProfile', { timeout: 30000 })
      .then(xhr => xhr.response.statusCode)
      .should('be.oneOf', [200, 304])

    // auth cookie should be present
    // cy.visit('/')
    // cy.getLocalStorage('masakinajacu').should('exist').then((obj) => {
    //   const data = JSON.parse(obj)
    //   expect(data.user).to.have.property('id', 1)
    // })
  })
})
