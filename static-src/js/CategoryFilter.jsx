import React from 'react'
import Chip from 'material-ui/Chip'
import FlatButton from 'material-ui/FlatButton'
import {blue300} from 'material-ui/styles/colors'
import PropTypes from 'prop-types'

import '../../node_modules/simplegrid/simple-grid.scss'

const wrapperStyle = {
  display: 'flex',
  flexWrap: 'wrap'
}

const chipStyle = {
  margin: 4
}

const CategoryFilter = ({categories, filteredCategories, onToggle, onShowOnly, onReset}) => {
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
        {categories.map((category) =>
          <Chip
            key={category}
            style={chipStyle}
            backgroundColor={filteredCategories.indexOf(category) > -1 ? blue300 : null}
            onClick={handleClick(category)}>
            {category}
          </Chip>
        )}
      </div>
      <div>
        <FlatButton onClick={onReset}>Show All</FlatButton>
      </div>
    </div>
  )
}

CategoryFilter.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  filteredCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggle: PropTypes.func.isRequired,
  onShowOnly: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired
}

export default CategoryFilter
