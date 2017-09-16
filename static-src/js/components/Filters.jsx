import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import ReactResizeDetector from 'react-resize-detector'

import CriticalityFilter from './CriticalityFilter.jsx'
import CategoryFilter from '../containers/CategoryFilter.jsx'
import TimeFilter from './TimeFilter.jsx'
import DescriptionFilter from './DescriptionFilter.jsx'

const paperStyle = {
  padding: 7
}

const Filters = ({onResize}) =>
  <div className='row'>
    <ReactResizeDetector handleHeight onResize={onResize} />
    <div className='col-2'>
      <Paper style={paperStyle}>
        <CriticalityFilter />
      </Paper>
    </div>
    <div className='col-3'>
      <Paper style={paperStyle}>
        <TimeFilter />
      </Paper>
    </div>
    <div className='col-7'>
      <Paper style={paperStyle}>
        <CategoryFilter />
      </Paper>
      <Paper style={paperStyle}>
        <DescriptionFilter />
      </Paper>
    </div>
  </div>

Filters.propTypes = {
  onResize: PropTypes.func.isRequired
}

export default Filters
