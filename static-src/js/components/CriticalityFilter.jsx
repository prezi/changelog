import React from 'react'
import PropTypes from 'prop-types'
import { FormGroup, FormControlLabel } from 'material-ui/Form'
import Checkbox from 'material-ui/Checkbox'
import Button from 'material-ui/Button'
import { withStyles } from 'material-ui/styles'

const styles = {
  checkbox: {
    height: 24
  }
}

const CriticalityFilter = ({filteredCriticalities, onToggle, onReset, classes}) => {
  const isFiltered = (criticality) => filteredCriticalities.indexOf(criticality) > -1
  const onCheck = (criticality) => () => onToggle(criticality)
  const checkbox = (criticality, label) =>
    <FormGroup row>
      <FormControlLabel
        control={<Checkbox classes={{default: classes.checkbox}} onChange={onCheck(criticality)} checked={isFiltered(criticality)} />}
        label={label}
      />
    </FormGroup>
  return (
    <div>
      {checkbox(5, '5 (Most Criticial)')}
      {checkbox(4, '4')}
      {checkbox(3, '3')}
      {checkbox(2, '2')}
      {checkbox(1, '1 (Least Critical)')}
      <FormGroup row>
        <Button onClick={onReset}>Show All</Button>
      </FormGroup>
    </div>
  )
}

CriticalityFilter.propTypes = {
  filteredCriticalities: PropTypes.arrayOf(PropTypes.number).isRequired,
  onToggle: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(CriticalityFilter)
