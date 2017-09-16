import {connect} from 'react-redux'

import {toggleCategory} from '../actions.jsx'
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
    onShowOnly: () => null,
    onReset: () => null
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component)
