import {isEqual} from 'lodash'
import {fetchEvents, FETCH_EVENTS} from './actions.jsx'
import qs from 'query-string'

export const fetchWhenFilterChangesMiddleware = store => next => action => {
  const lastFilters = store.getState().filters
  const retval = next(action)
  const currentFilters = store.getState().filters
  if (action.type !== FETCH_EVENTS && !isEqual(lastFilters, currentFilters)) {
    store.dispatch(fetchEvents(currentFilters))
  }
  return retval
}

export const syncFiltersToHistory = history => {
  var enabled = false
  const f = store => next => action => {
    const retval = next(action)
    if (!enabled) {
      return retval
    }
    const currentFilters = store.getState().filters
    const search = qs.stringify({
      until: currentFilters.until,
      hours_ago: currentFilters.hours_ago,
      description: currentFilters.description,
      category: currentFilters.category.join(','),
      criticality: currentFilters.criticality.join(',')
    })
    const currentLocation = history.location
    if (action.type === FETCH_EVENTS && currentLocation && currentLocation.search !== '?' + search) {
      history.push({
        pathname: '/',
        search
      })
    }
    return retval
  }
  f.setEnabled = (val) => { enabled = val }
  return f
}

// Inline https://github.com/ryanseddon/redux-debounced/pull/10 until it's merged (if ever)
// That PR provides _.throttle-like functionality (specifically trailing and leading)
// to react-debounced, which is really nice to have for debouncing API calls
export const createDebounce = () => {
  let timers = {}

  const middleware = () => dispatch => action => {
    const {
      meta: { debounce = {} } = {},
      type
    } = action

    const {
      time,
      key = type,
      cancel = false,
      leading = false,
      trailing = true
    } = debounce

    const shouldDebounce = ((time && key) || (cancel && key)) && (trailing || leading)
    const dispatchNow = leading && !timers[key]

    const later = () => {
      if (trailing && !dispatchNow) {
        dispatch(action)
      }
      timers[key] = null
    }

    if (!shouldDebounce) {
      return dispatch(action)
    }

    if (timers[key]) {
      clearTimeout(timers[key])
      timers[key] = null
    }

    if (!cancel) {
      if (dispatchNow) {
        dispatch(action)
      }

      timers[key] = setTimeout(later, time)
    }
  }

  middleware._timers = timers

  return middleware
}
