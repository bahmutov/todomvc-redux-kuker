/// <reference types="Cypress" />

context('TodoMVC', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('adds 2 todos', function () {
    cy.get('.new-todo')
      .type('learn testing{enter}')
      .type('be cool{enter}')
    cy.get('.todo-list li').should('have.length', 2)
  })

  it.only('clears completed', () => {
    cy.get('.new-todo')
      .type('first{enter}')
      .type('second{enter}')
      .type('third{enter}')
      .type('fourth{enter}')
    cy.get('.todo-list li').should('have.length', 4)
    cy.contains('li', 'second')
      .find('.toggle')
      .check()
    cy.contains('li', 'fourth')
      .find('.toggle')
      .check()
    cy.get('.clear-completed').click()
    // only two items should remain
    cy.get('.todo-list li')
      .should('have.length', 2)
      .and(li$ => {
        // make sure the expected items remain
        expect(li$[0].textContent).to.equal('first')
        expect(li$[1].textContent).to.equal('third')
      })
  })
})
