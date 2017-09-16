import React from 'react'
import ReactDOM from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import MainContainer from './MainContainer.jsx'

const App = () => (
  <MuiThemeProvider>
    <MainContainer />
  </MuiThemeProvider>
)

const container = document.createElement('div')
document.body.appendChild(container)
ReactDOM.render(<App />, container)
