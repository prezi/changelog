import {connect} from 'react-redux'

import {filtersHeightChanged} from '../actions.jsx'
import Component from '../components/Filters.jsx'

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onResize: (width, height) => dispatch(filtersHeightChanged(height))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component)
