import {connect} from 'react-redux'

import Component from '../components/Loader.jsx'

const mapStateToProps = (state) => {
  return {
    isLoading: state.api.isFetching,
    hasError: state.api.error !== null
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component)
