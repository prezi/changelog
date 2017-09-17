import React from 'react'
import ReactDOM from 'react-dom'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

import reducers from './reducers.jsx'
import {fetchWhenFilterChangesMiddleware} from './middlewares.jsx'
import MainContainer from './containers/Main.jsx'

import '../css/main.css'

const store = createStore(
  reducers,
  applyMiddleware(
    thunkMiddleware,
    createLogger(),
    fetchWhenFilterChangesMiddleware
  )
)

const App = () => (
  <Provider store={store}>
    <MainContainer />
  </Provider>
)

const container = document.createElement('div')
document.body.appendChild(container)
ReactDOM.render(<App />, container)
