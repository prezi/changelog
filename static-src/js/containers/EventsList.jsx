import {connect} from 'react-redux'

import Component from '../components/EventsList.jsx'

const mapStateToProps = (state) => {
  return {
    events: state.api.events
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component)
