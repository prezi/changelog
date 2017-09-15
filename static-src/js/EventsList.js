import * as React from "react";

const EventsList = ({events, onToggle}) => <ul>
    {events.map(event =>
        <li
            key={event.unix_timestamp + ":" + event.description + ":" + event.category + ":" + event.criticality}>
            {event.description}
        </li>
    )}
</ul>;

EventsList.propTypes = {
    events: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
};

export default EventsList;