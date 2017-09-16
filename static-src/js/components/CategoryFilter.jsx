import React from 'react'
import Chip from 'material-ui/Chip'
import FlatButton from 'material-ui/FlatButton'
import Avatar from 'material-ui/Avatar'
import {blue300, indigo900} from 'material-ui/styles/colors'
import PropTypes from 'prop-types'
import {toPairs, map} from 'lodash'

import 'simplegrid/simple-grid.scss'

const wrapperStyle = {
  display: 'flex',
  flexWrap: 'wrap'
}

const chipStyle = {
  margin: 4
}

const CategoryFilter = ({categories, filteredCategories, onToggle, onShowOnly, onReset}) => {
  const renderCategory = ([category, eventCount]) =>
    <Chip
      key={category}
      style={chipStyle}
      backgroundColor={filteredCategories.indexOf(category) > -1 ? blue300 : null}
      onClick={handleClick(category)}>
      <Avatar backgroundColor={filteredCategories.indexOf(category) > -1 ? indigo900 : null}>{eventCount}</Avatar>
      {category}
    </Chip>

  const handleClick = (category) => (e) => {
    if (e.shiftKey) {
      onShowOnly(category)
    } else {
      onToggle(category)
    }
  }

  return (
    <div>
      <div style={wrapperStyle}>
        {map(toPairs(categories), renderCategory)}
      </div>
      <div>
        <FlatButton onClick={onReset}>Show All</FlatButton>
      </div>
    </div>
  )
}

CategoryFilter.propTypes = {
  categories: PropTypes.object.isRequired,
  filteredCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggle: PropTypes.func.isRequired,
  onShowOnly: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired
}

export default CategoryFilter
