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
