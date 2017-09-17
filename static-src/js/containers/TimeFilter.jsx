import {connect} from 'react-redux'

import {setUntil, setHoursAgo} from '../actions.jsx'
import Component from '../components/TimeFilter.jsx'

const mapStateToProps = (state) => {
  return {
    hoursAgo: state.filters.hours_ago,
    until: new Date(state.filters.until * 1000)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUntil: (date) => dispatch(setUntil(Math.round(date.getTime() / 1000))),
    setHoursAgo: (n) => dispatch(setHoursAgo(n))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component)
