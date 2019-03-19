/// <reference types="Cypress" />

// confirming events sent by the Kuker Redux emitter to Kuker DevTools
// by cleaning each event and comparing it to the expected object

// make sure we are only spying on Kuker Redux events (except for init)
const isKukerRedux = what =>
  Cypress._.isPlainObject(what) && what.kuker && what.type !== 'NEW_EMITTER'
// only pick properties we want for testing
const reduxEvent = event => Cypress._.pick(event, 'action', 'state')

describe('Clean Kuker messages', () => {
  beforeEach(() => {
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

  it('adds 2 todos', function () {
    cy.get('.new-todo').type('learn testing{enter}')

    // confirm the first Redux event
    cy.get('@kuker')
      .its('lastCall.args.0')
      .should('deep.equal', {
        action: { type: 'ADD_TODO', text: 'learn testing' },
        state: {
          todos: [
            {
              completed: false,
              id: 0,
              text: 'learn testing'
            }
          ],
          visibilityFilter: 'show_all'
        }
      })

    cy.get('.new-todo').type('be cool{enter}')
    // confirm the second Redux event
    cy.get('@kuker')
      .its('lastCall.args.0')
      .should('deep.equal', {
        action: { type: 'ADD_TODO', text: 'be cool' },
        state: {
          todos: [
            {
              completed: false,
              id: 0,
              text: 'learn testing'
            },
            {
              completed: false,
              id: 1,
              text: 'be cool'
            }
          ],
          visibilityFilter: 'show_all'
        }
      })

    cy.get('.todo-list li').should('have.length', 2)
  })
})
