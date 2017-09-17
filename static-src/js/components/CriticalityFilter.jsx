import React from 'react'
import PropTypes from 'prop-types'
import Checkbox from 'material-ui/Checkbox'
import FlatButton from 'material-ui/FlatButton'

const CriticalityFilter = ({filteredCriticalities, onToggle, onReset}) => {
  const isFiltered = (criticality) => filteredCriticalities.indexOf(criticality) > -1
  const onCheck = (criticality) => () => onToggle(criticality)
  return (
    <div>
      <Checkbox onCheck={onCheck(5)} checked={isFiltered(5)} label='5 (Highest)' />
      <Checkbox onCheck={onCheck(4)} checked={isFiltered(4)} label='4' />
      <Checkbox onCheck={onCheck(3)} checked={isFiltered(3)} label='3' />
      <Checkbox onCheck={onCheck(2)} checked={isFiltered(2)} label='2' />
      <Checkbox onCheck={onCheck(1)} checked={isFiltered(1)} label='1 (Lowest)' />
      <FlatButton onClick={onReset}>Show All</FlatButton>
    </div>
  )
}

CriticalityFilter.propTypes = {
  filteredCriticalities: PropTypes.arrayOf(PropTypes.number).isRequired,
  onToggle: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired
}

export default CriticalityFilter
