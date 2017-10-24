import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import ReactResizeDetector from 'react-resize-detector'
import Grid from 'material-ui/Grid'
import Divider from 'material-ui/Divider'

import CriticalityFilter from '../containers/CriticalityFilter.jsx'
import CategoryFilter from '../containers/CategoryFilter.jsx'
import TimeFilter from '../containers/TimeFilter.jsx'
import DescriptionFilter from '../containers/DescriptionFilter.jsx'

const paperStyle = {
  padding: 7
}

const Filters = ({onResize}) =>
  <Grid container>
    <ReactResizeDetector handleHeight onResize={onResize} />
    <Grid item xs={12} sm={2}>
      <Paper style={paperStyle}>
        <CriticalityFilter />
      </Paper>
    </Grid>
    <Grid item xs={12} sm={3}>
      <Paper style={paperStyle}>
        <TimeFilter />
      </Paper>
    </Grid>
    <Grid item xs={12} sm={7}>
      <Paper style={paperStyle}>
        <CategoryFilter />
        <Divider />
        <DescriptionFilter />
      </Paper>
    </Grid>
  </Grid>

Filters.propTypes = {
  onResize: PropTypes.func.isRequired
}

export default Filters
