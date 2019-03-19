/// <reference types="Cypress" />
describe('Spying on Kuker messages', () => {
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad (win) {
        // start spying
        cy.spy(win, 'postMessage').as('postMessage')
      }
    })
  })

  it('adds 2 todos', function () {
    cy.get('.new-todo').type('learn testing{enter}')
    cy.get('.new-todo').type('be cool{enter}')
    cy.get('.todo-list li').should('have.length', 2)
    cy.get('@postMessage').should('be.calledThrice')
  })
})
