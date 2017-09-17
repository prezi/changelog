import {connect} from 'react-redux'

import Component from '../components/Main.jsx'

const mapStateToProps = (state) => {
  return {
    filtersHeight: state.filtersHeight
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component)
