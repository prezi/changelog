import React from 'react'
import PropTypes from 'prop-types'

import Filters from '../containers/Filters.jsx'
import EventsList from '../containers/EventsList.jsx'
import Loader from '../containers/Loader.jsx'

const Main = ({filtersHeight}) =>
  <div className='main-container'>
    <Filters />
    <Loader />
    <EventsList height={window.innerHeight - filtersHeight - 10} />
  </div>

Main.propTypes = {
  filtersHeight: PropTypes.number.isRequired
}

export default Main
