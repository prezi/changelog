import React from 'react'
import Paper from 'material-ui/Paper'
import sizeMe from 'react-sizeme'

import CriticalityFilter from './CriticalityFilter.jsx'
import CategoryFilter from '../containers/CategoryFilter.jsx'
import TimeFilter from './TimeFilter.jsx'
import DescriptionFilter from './DescriptionFilter.jsx'

const paperStyle = {
  padding: 7
}

const Filters = () =>
  <div className='row'>
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

export default sizeMe({monitorHeight: true})(Filters)
