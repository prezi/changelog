import 'whatwg-fetch'
import {flow, toPairs, filter, forEach, isArray, isEmpty, isNull} from 'lodash/fp'

export const TOGGLE_CATEGORY = 'TOGGLE_CATEGORY'
export function toggleCategory (category) {
  return {
    type: TOGGLE_CATEGORY,
    category
  }
}

export const SHOW_SINGLE_CATEGORY = 'SHOW_SINGLE_CATEGORY'
export function showSingleCategory (category) {
  return {
    type: SHOW_SINGLE_CATEGORY,
    category
  }
}

export const RESET_CATEGORIES = 'RESET_CATEGORIES'
export function resetCategories () {
  return {type: RESET_CATEGORIES}
}

export const SET_CATEGORIES = 'SET_CATEGORIES'
export function setCategories (categories) {
  return {
    type: SET_CATEGORIES,
    categories
  }
}

export const TOGGLE_CRITICALITY = 'TOGGLE_CRITICALITY'
export function toggleCriticality (criticality) {
  return {
    type: TOGGLE_CRITICALITY,
    criticality
  }
}

export const RESET_CRITICALITY = 'RESET_CRITICALITY'
export function resetCriticality () {
  return {type: RESET_CRITICALITY}
}

export const SET_CRITICALITIES = 'SET_CRITICALITIES'
export function setCriticalities (criticalities) {
  return {
    type: SET_CRITICALITIES,
    criticalities
  }
}

export const FILTER_BY_DESCRIPTION = 'FILTER_BY_DESCRIPTION'
export function filterByDescription (description) {
  return {
    type: FILTER_BY_DESCRIPTION,
    description: description.trim()
  }
}

export const SET_UNTIL = 'SET_UNTIL'
export function setUntil (until) {
  return {
    type: SET_UNTIL,
    until
  }
}

export const SET_HOURS_AGO = 'SET_HOURS_AGO'
export function setHoursAgo (hoursAgo) {
  return {
    type: SET_HOURS_AGO,
    hoursAgo
  }
}

var fetchingPaused = false
export const pauseFetching = () => { fetchingPaused = true }
export const resumeFetching = () => { fetchingPaused = false }

export const FETCH_EVENTS = 'FETCH_EVENTS'
export function fetchEvents (filters) {
  if (fetchingPaused) {
    return {type: 'NOOP'}
  }
  const thunk = (dispatch) => {
    const url = new window.URL(window.location.origin + '/api/events')
    flow([
      toPairs,
      filter(([key, value]) => isArray(value) ? !isEmpty(value) : !isNull(value)),
      forEach(([key, value]) => url.searchParams.append(key, value))
    ])(filters)
    const promise = window
      .fetch(url, {credentials: 'include'})
      .then(res => res.json())
      .then(json => dispatch(receivedEvents(json, promise, filters)))
      .catch(error => dispatch(fetchFailed(error, promise, filters)))
    dispatch({type: FETCH_EVENTS, filters, promise})
  }
  thunk.meta = {
    debounce: {
      time: 400,
      leading: true,
      trailing: true,
      key: FETCH_EVENTS
    }
  }
  return thunk
}

export const RECEIVED_EVENTS = 'RECEIVED_EVENTS'
export function receivedEvents (events, promise, filters) {
  return {
    type: RECEIVED_EVENTS,
    receivedAt: new Date(),
    events,
    promise,
    filters
  }
}

export const FETCH_FAILED = 'FETCH_FAILED'
export function fetchFailed (error, promise, filters) {
  return {
    type: FETCH_FAILED,
    error,
    promise,
    filters
  }
}

export const FILTERS_HEIGHT_CHANGED = 'FILTERS_HEIGHT_CHANGED'
export function filtersHeightChanged (height) {
  return {
    type: FILTERS_HEIGHT_CHANGED,
    height
  }
}
