import 'whatwg-fetch'
import {combineReducers} from 'redux'
import {countBy, assign} from 'lodash'
import {flow, map, toPairs, fromPairs, xor} from 'lodash/fp'

import {
  TOGGLE_CATEGORY, FETCH_EVENTS, FETCH_FAILED, RECEIVED_EVENTS,
  FILTERS_HEIGHT_CHANGED
} from './actions.jsx'

const defaultFilters = {
  hours_ago: 90,
  until: -1,
  category: []
}
function filters (state = defaultFilters, action) {
  switch (action.type) {
    case TOGGLE_CATEGORY:
      return {...state, category: xor(state.category, [action.category])}
    default:
      return state
  }
}

function events (state = [], action) {
  switch (action.type) {
    case RECEIVED_EVENTS:
      return action.events
    default:
      return state
  }
}

function categories (state = {}, action) {
  switch (action.type) {
    case RECEIVED_EVENTS:
      return assign(
        flow(
          toPairs,
          map(([category, count]) => [category, 0]),
          fromPairs
        )(state),
        countBy(action.events, (e) => e.category)
      )
    default:
      return state
  }
}

const defaultFetching = {
  isFetching: false,
  promise: null,
  error: null,
  lastFilters: null
}
function fetching (state = defaultFetching, action) {
  switch (action.type) {
    case FETCH_EVENTS:
      return {
        ...state,
        isFetching: true,
        error: null,
        promise: action.promise,
        lastFilters: action.filters
      }
    case RECEIVED_EVENTS:
      return {...state, isFetching: false, error: null}
    case FETCH_FAILED:
      return {...state, isFetching: false, error: action.error}
    default:
      return state
  }
}

function filtersHeight (state = 0, action) {
  switch (action.type) {
    case FILTERS_HEIGHT_CHANGED:
      return action.height
    default:
      return state
  }
}

export default combineReducers({filters, events, categories, fetching, filtersHeight})
