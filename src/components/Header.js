import React from 'react'
import PropTypes from 'prop-types'
import TodoTextInput from './TodoTextInput'

const Header = ({ addTodo }) => (
  <header className='header'>
    <h1>todos</h1>
    <TodoTextInput
      newTodo
      onSave={text => {
        if (text.length !== 0) {
          setTimeout(addTodo, 1000, text)
          // addTodo(text)
        }
      }}
      placeholder='What needs to be done?'
    />
  </header>
)

Header.propTypes = {
  addTodo: PropTypes.func.isRequired
}

export default Header
