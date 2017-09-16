import {connect} from 'react-redux'

import {filtersHeightChanged} from '../actions.jsx'
import Component from '../components/Filters.jsx'

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onRezise: (size) => dispatch(filtersHeightChanged(size.height))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component)
