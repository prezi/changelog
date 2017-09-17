import {connect} from 'react-redux'

import {toggleCriticality, resetCriticality} from '../actions.jsx'
import Component from '../components/CriticalityFilter.jsx'

const mapStateToProps = (state) => {
  return {
    filteredCriticalities: state.filters.criticality
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onToggle: (criticality) => dispatch(toggleCriticality(criticality)),
    onReset: () => dispatch(resetCriticality())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component)
