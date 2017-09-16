import React from 'react'
import PropTypes from 'prop-types'

import Filters from './Filters.jsx'
import EventsList from '../containers/EventsList.jsx'

export default class MainContainer extends React.Component {
  componentDidMount () {
    this.props.init(this.props.filters)
  }

  render () {
    return (<div className='main-container'>
      <Filters />
      <EventsList height={window.innerHeight - this.props.filtersHeight} />
    </div>)
  }
}

MainContainer.propTypes = {
  init: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  filtersHeight: PropTypes.number.isRequired
}
