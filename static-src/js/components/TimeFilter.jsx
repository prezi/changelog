import React from 'react'
import PropTypes from 'prop-types'

import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import { FormControl, FormLabel, FormGroup, FormControlLabel } from 'material-ui/Form'
import leftPad from 'left-pad'

const formatDate = (d) => {
  return (1900 + d.getYear()) + '-' + leftPad(1 + d.getMonth(), 2, '0') + '-' + leftPad(d.getDate(), 2, '0') +
         'T' + leftPad(d.getHours(), 2, '0') + ':' + leftPad(d.getMinutes(), 2, '0')
}

const TimeFilter = ({hoursAgo, until, setHoursAgo, setUntil}) => {
  const showLastHours = (n) => () => {
    setUntil(new Date())
    setHoursAgo(n)
  }
  return (
    <FormControl component='fieldset'>
      <FormLabel style={{marginBottom: 20}}>Time Range</FormLabel>
      <FormGroup row>
        <FormControlLabel
          style={{marginLeft: 0, marginBottom: 12}}
          control={
            <TextField
              type='number'
              style={{width: 60, marginRight: 15}}
              value={hoursAgo}
              onChange={e => setHoursAgo(parseInt(e.target.value, 10))}
            />}
          label='hours before'
        />
        <TextField
          type='datetime-local'
          value={formatDate(until)}
          pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}'
          max={formatDate(new Date())}
          onChange={e => setUntil(new Date(e.target.value))}
        />
      </FormGroup>
      <FormGroup row>
        <Button onClick={showLastHours(1)}>Last 1h</Button>
        <Button onClick={showLastHours(4)}>Last 4h</Button>
        <Button onClick={showLastHours(24)}>Last 1d</Button>
        <Button onClick={showLastHours(168)}>Last 1w</Button>
        <Button onClick={showLastHours(672)}>Last 1M</Button>
      </FormGroup>
    </FormControl>
  )
}

TimeFilter.propTypes = {
  hoursAgo: PropTypes.number.isRequired,
  until: PropTypes.object.isRequired,
  setUntil: PropTypes.func.isRequired,
  setHoursAgo: PropTypes.func.isRequired
}

export default TimeFilter
