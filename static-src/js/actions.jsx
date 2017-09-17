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

export const FETCH_EVENTS = 'FETCH_EVENTS'
export function fetchEvents (filters) {
  return function (dispatch) {
    const url = new window.URL(window.location.href + 'api/events')
    flow([
      toPairs,
      filter(([key, value]) => isArray(value) ? !isEmpty(value) : !isNull(value)),
      forEach(([key, value]) => url.searchParams.append(key, value))
    ])(filters)
    const promise = window
      .fetch(url)
      .then(res => res.json())
      .then(json => dispatch(receivedEvents(json)))
    dispatch({type: FETCH_EVENTS, filters, promise})
  }
}

export const RECEIVED_EVENTS = 'RECEIVED_EVENTS'
export function receivedEvents (events) {
  return {
    type: RECEIVED_EVENTS,
    receivedAt: new Date(),
    events
  }
}

export const FETCH_FAILED = 'FETCH_FAILED'
export function fetchFailed (error) {
  return {
    type: FETCH_FAILED,
    error
  }
}

export const FILTERS_HEIGHT_CHANGED = 'FILTERS_HEIGHT_CHANGED'
export function filtersHeightChanged (height) {
  return {
    type: FILTERS_HEIGHT_CHANGED,
    height
  }
}
