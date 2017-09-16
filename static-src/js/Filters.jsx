import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import sizeMe from 'react-sizeme'

import CriticalityFilter from './CriticalityFilter.jsx'
import CategoryFilter from './CategoryFilter.jsx'
import TimeFilter from './TimeFilter.jsx'
import DescriptionFilter from './DescriptionFilter.jsx'

const paperStyle = {
  padding: 7
}

const Filters = ({categories, filteredCategories, onToggle, onShowOnly, onReset}) =>
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
        <CategoryFilter categories={categories} filteredCategories={filteredCategories} onToggle={onToggle} onShowOnly={onShowOnly} onReset={onReset} />
      </Paper>
      <Paper style={paperStyle}>
        <DescriptionFilter />
      </Paper>
    </div>
  </div>

Filters.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  filteredCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggle: PropTypes.func.isRequired,
  onShowOnly: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired
}

export default sizeMe({monitorHeight: true})(Filters)
