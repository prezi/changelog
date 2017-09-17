import {combineReducers} from 'redux'
import {countBy, assign} from 'lodash'
import {flow, map, toPairs, fromPairs, xor} from 'lodash/fp'

import {
  TOGGLE_CATEGORY, SHOW_SINGLE_CATEGORY, RESET_CATEGORIES, SET_CATEGORIES,
  TOGGLE_CRITICALITY, RESET_CRITICALITY, SET_CRITICALITIES,
  FILTER_BY_DESCRIPTION,
  SET_UNTIL, SET_HOURS_AGO,
  FETCH_EVENTS, FETCH_FAILED, RECEIVED_EVENTS,
  FILTERS_HEIGHT_CHANGED
} from './actions.jsx'

const defaultFilters = {
  hours_ago: 1,
  until: Math.round((new Date()).getTime() / 1000),
  category: [],
  criticality: [],
  description: ''
}

function filters (state = defaultFilters, action) {
  switch (action.type) {
    case TOGGLE_CATEGORY:
      return {...state, category: xor(state.category, [action.category])}
    case SHOW_SINGLE_CATEGORY:
      return {...state, category: [action.category]}
    case RESET_CATEGORIES:
      return {...state, category: []}
    case SET_CATEGORIES:
      return {...state, category: action.categories}
    case TOGGLE_CRITICALITY:
      return {...state, criticality: xor(state.criticality, [action.criticality])}
    case RESET_CRITICALITY:
      return {...state, criticality: []}
    case SET_CRITICALITIES:
      return {...state, criticality: action.criticalities}
    case FILTER_BY_DESCRIPTION:
      return {...state, description: action.description}
    case SET_UNTIL:
      if (action.until > new Date().getTime() / 1000) {
        return state
      }
      return {...state, until: action.until}
    case SET_HOURS_AGO:
      if (action.hoursAgo < 1) {
        return state
      }
      return {...state, hours_ago: action.hoursAgo}
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
        ...map(c => { const o = {}; o[c] = 0; return o })(action.filters.category),
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
  events: [],
  categories: {}
}
function api (state = defaultFetching, action) {
  switch (action.type) {
    case FETCH_EVENTS:
      // Here's the part where we'd state.promise.abort, but that's not yet implemented:
      // https://github.com/whatwg/fetch/pull/523
      return {
        ...state,
        isFetching: true,
        error: null,
        promise: action.promise
      }
    case RECEIVED_EVENTS:
      // Since we can't abort ongoing requests, instead we just check
      // if the response we just got is the response to the latest request we made
      if (action.promise !== state.promise) {
        return state
      }
      return {
        ...state,
        isFetching: false,
        error: null,
        events: events(state.events, action),
        categories: categories(state.categories, action)
      }
    case FETCH_FAILED:
      if (action.promise !== state.promise) {
        return state
      }
      return {...state, isFetching: false, error: action.error}
    default:
      return state
  }
}

function filtersHeight (state = 200, action) {
  switch (action.type) {
    case FILTERS_HEIGHT_CHANGED:
      return action.height
    default:
      return state
  }
}

export default combineReducers({filters, api, filtersHeight})
