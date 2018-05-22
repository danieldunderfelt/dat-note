import App from './App'
import React from 'react'
import { render as ReactRender } from 'react-dom'
import { AppContainer } from 'react-hot-loader'

const init = async () => {
  render(App)
}

init()

function render(Component) {
  ReactRender(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app')
  )
}

if( module.hot ) {
  function rerender() {
    const NextRoot = require('./App').default
    render(NextRoot)
  }
  
  module.hot.accept('./App', () => rerender())
}
