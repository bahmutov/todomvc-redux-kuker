/// <reference types="Cypress" />

// uses expected values loaded from fixture files

// make sure we are only spying on Kuker Redux events (except for init)
const isKukerRedux = what =>
  Cypress._.isPlainObject(what) && what.kuker && what.type !== 'NEW_EMITTER'
// only pick properties we want for testing
const reduxEvent = event => Cypress._.pick(event, 'action', 'state')

describe('Expected fixtures', () => {
  beforeEach(() => {
    // load two fixtures
    cy.fixture('first-event').as('first')
    cy.fixture('second-event').as('second')

    cy.visit('/', {
      onBeforeLoad (win) {
        let kuker = cy.spy().as('kuker')

        const postMessage = win.postMessage.bind(win)
        win.postMessage = (what, target) => {
          if (isKukerRedux(what)) {
            const sanitized = reduxEvent(what)
            kuker(sanitized)

            // log better message ourselves
            Cypress.log({
              name: 'Redux',
              message: `${what.action.type} "${what.action.text}"`,
              consoleProps () {
                return sanitized
              }
            }).end()
          } // else ignore messages
          return postMessage(what, target)
        }
      }
    })
  })

  // notice "function" form of callback
  // this is because we need to use "this.first" property
  it('adds 2 todos', function () {
    cy.get('.new-todo').type('learn testing{enter}')

    // confirm the first Redux event
    cy.get('@kuker')
      .its('lastCall.args.0')
      // use loaded fixture "first"
      .should('deep.equal', this.first)

    cy.get('.new-todo').type('be cool{enter}')
    // confirm the second Redux event
    cy.get('@kuker')
      .its('lastCall.args.0')
      .should('deep.equal', this.second)

    cy.get('.todo-list li').should('have.length', 2)
  })
})
