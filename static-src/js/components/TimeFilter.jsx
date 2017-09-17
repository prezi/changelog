import React from 'react'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'

const TimeFilter = () =>
  <div>
    <TextField type='datetime-local' label='From' />
    <TextField type='datetime-local' label='Until' />
    <div style={{display: 'flex'}}>
      <Button>Last 1h</Button>
      <Button>Last 4h</Button>
      <Button>Last 1d</Button>
    </div>
    <div style={{display: 'flex'}}>
      <Button>Last 1w</Button>
      <Button>Last 1M</Button>
      <Button>Last 3M</Button>
    </div>
  </div>

export default TimeFilter
