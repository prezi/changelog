import React from 'react'
import Chip from 'material-ui/Chip'
import Button from 'material-ui/Button'
import Avatar from 'material-ui/Avatar'
import { blue, indigo } from 'material-ui/colors'
import { withStyles } from 'material-ui/styles'
import PropTypes from 'prop-types'
import { toPairs, map } from 'lodash'
import classNames from 'classnames'

const styles = {
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: 4
  },
  filteredChip: {
    backgroundColor: blue[300],
    '&:hover, &:focus': {
      backgroundColor: blue[300]
    }
  },
  avatar: {
    fontSize: 13,
    height: 30,
    width: 30
  },
  filteredAvatar: {
    backgroundColor: indigo[900]
  }
}

const CategoryFilter = ({categories, filteredCategories, onToggle, onShowOnly, onReset, classes}) => {
  const renderCategory = ([category, eventCount]) =>
    <Chip
      key={category}
      className={classNames(classes.chip, filteredCategories.indexOf(category) > -1 ? classes.filteredChip : '')}
      onClick={handleClick(category)}
      avatar={<Avatar className={classNames(classes.avatar, filteredCategories.indexOf(category) > -1 ? classes.filteredAvatar : '')}>{eventCount.toString()}</Avatar>}
      label={category}
    />

  const handleClick = (category) => (e) => {
    if (e.shiftKey) {
      onShowOnly(category)
    } else {
      onToggle(category)
    }
  }

  return (
    <div>
      <div className={classes.wrapper}>
        {map(toPairs(categories), renderCategory)}
      </div>
      <div>
        <Button onClick={onReset}>Show All</Button>
      </div>
    </div>
  )
}

CategoryFilter.propTypes = {
  categories: PropTypes.object.isRequired,
  filteredCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggle: PropTypes.func.isRequired,
  onShowOnly: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(CategoryFilter)
