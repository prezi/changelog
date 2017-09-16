import {connect} from 'react-redux'

import {fetchEvents} from '../actions.jsx'
import Component from '../components/Main.jsx'

const mapStateToProps = (state) => {
  return {
    filters: state.filters,
    filtersHeight: state.filtersHeight
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    init: (filters) => dispatch(fetchEvents(filters))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component)
