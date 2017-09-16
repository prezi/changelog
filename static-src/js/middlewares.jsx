import {isEqual} from 'lodash'
import {fetchEvents, FETCH_EVENTS} from './actions.jsx'

export const fetchWhenFilterChangesMiddleware = store => next => action => {
  const retval = next(action)
  const state = store.getState()
  if (action.type !== FETCH_EVENTS && !isEqual(state.filters, state.fetching.lastFilters)) {
    store.dispatch(fetchEvents(state.filters))
  }
  return retval
}
