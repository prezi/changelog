import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { Provider } from 'react-redux'
import createHistory from 'history/createBrowserHistory'
import qs from 'query-string'
import {map, filter, isEqual} from 'lodash'

import reducers from './reducers.jsx'
import {fetchWhenFilterChangesMiddleware, syncFiltersToHistory, createDebounce} from './middlewares.jsx'
import {pauseFetching, setHoursAgo, setUntil, setCategories, setCriticalities, filterByDescription, resumeFetching, fetchEvents} from './actions.jsx'
import MainContainer from './containers/Main.jsx'

import '../css/main.css'

const history = createHistory()
const filtersToHistorySync = syncFiltersToHistory(history)

const store = createStore(
  reducers,
  applyMiddleware(
    createDebounce(),
    thunkMiddleware,
    filtersToHistorySync,
    fetchWhenFilterChangesMiddleware,
    createLogger()
  )
)

const dispatchIfChanged = (filterKey, value, actionCreator) => {
  const oldValue = store.getState().filters[filterKey]
  if (isEqual(oldValue, value)) {
    return
  }
  store.dispatch(actionCreator(value))
}

const loadLocationIntoState = (location) => {
  const search = qs.parse(location.search)
  pauseFetching()
  dispatchIfChanged('hours_ago', parseInt(search.hours_ago || '1', 10), setHoursAgo)
  dispatchIfChanged(
    'until',
    parseInt(search.until || (Math.round((new Date()).getTime() / 1000)).toString(), 10),
    setUntil
  )
  dispatchIfChanged(
    'category',
    filter((search.category || '').split(','), c => c.length > 0),
    setCategories
  )
  dispatchIfChanged(
    'criticality',
    map(filter((search.criticality || '').split(','), c => c.length > 0), c => parseInt(c, 10)),
    setCriticalities
  )
  dispatchIfChanged('description', search.description || '', filterByDescription)
  resumeFetching()
}

// Load initial filters from URL
loadLocationIntoState(history.location)
filtersToHistorySync.setEnabled(true) // Disabled until now to prevent URL flickering

// Apply changes to filters when the URL changes (say, when the user clicks "back")
history.listen(loadLocationIntoState)

// Trigger the first fetch
store.dispatch(fetchEvents(store.getState().filters))

const App = () => (
  <Provider store={store}>
    <MainContainer />
  </Provider>
)

const container = document.createElement('div')
document.body.appendChild(container)
ReactDOM.render(<App />, container)
