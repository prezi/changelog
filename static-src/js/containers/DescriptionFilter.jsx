import {connect} from 'react-redux'

import {filterByDescription} from '../actions.jsx'
import Component from '../components/DescriptionFilter.jsx'

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: (newValue) => dispatch(filterByDescription(newValue))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component)
