import React from 'react'
import PropTypes from 'prop-types'

const EventsList = ({events}) => <ul>
  {events.map((event) =>
    <li
      key={event.unix_timestamp + ':' + event.description + ':' + event.category + ':' + event.criticality}>
      {event.description}
    </li>
  )}
</ul>

EventsList.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default EventsList
