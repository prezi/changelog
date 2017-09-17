import {connect} from 'react-redux'
import {debounce} from 'lodash'

import {filterByDescription} from '../actions.jsx'
import Component from '../components/DescriptionFilter.jsx'

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: debounce(
      (newValue) => dispatch(filterByDescription(newValue)),
      400
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component)
