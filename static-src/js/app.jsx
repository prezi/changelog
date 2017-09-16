import React from 'react'
import ReactDOM from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

import reducers from './reducers.jsx'
import {fetchWhenFilterChangesMiddleware} from './middlewares.jsx'
import MainContainer from './containers/Main.jsx'

const store = createStore(
  reducers,
  applyMiddleware(
    thunkMiddleware,
    createLogger(),
    fetchWhenFilterChangesMiddleware
  )
)

const App = () => (
  <MuiThemeProvider>
    <Provider store={store}>
      <MainContainer />
    </Provider>
  </MuiThemeProvider>
)

const container = document.createElement('div')
document.body.appendChild(container)
ReactDOM.render(<App />, container)
