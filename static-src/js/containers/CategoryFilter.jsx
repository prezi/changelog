import {connect} from 'react-redux'

import {toggleCategory, showSingleCategory, resetCategories} from '../actions.jsx'
import Component from '../components/CategoryFilter.jsx'

const mapStateToProps = (state) => {
  return {
    categories: state.categories,
    filteredCategories: state.filters.category
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onToggle: (category) => dispatch(toggleCategory(category)),
    onShowOnly: (category) => dispatch(showSingleCategory(category)),
    onReset: () => dispatch(resetCategories())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component)
