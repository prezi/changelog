import {isEqual} from 'lodash'
import {fetchEvents, FETCH_EVENTS} from './actions.jsx'

export const fetchWhenFilterChangesMiddleware = store => next => action => {
  const lastFilters = store.getState().filters
  const retval = next(action)
  const currentFilters = store.getState().filters
  if (action.type !== FETCH_EVENTS && !isEqual(lastFilters, currentFilters)) {
    store.dispatch(fetchEvents(currentFilters))
  }
  return retval
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
