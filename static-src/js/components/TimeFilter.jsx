import React from 'react'
import DatePicker from 'material-ui/DatePicker'
import TimePicker from 'material-ui/TimePicker'
import FlatButton from 'material-ui/FlatButton'

const TimeFilter = () => <div>
  <div style={{display: 'flex'}}>
    <strong style={{width: 50}}>From</strong>
    <DatePicker id='from-date' textFieldStyle={{width: 100, marginRight: 20, height: 32}} autoOk />
    <TimePicker id='from-time' textFieldStyle={{width: 100, height: 32}} autoOk />
  </div>
  <div style={{display: 'flex'}}>
    <strong style={{width: 50}}>Until</strong>
    <DatePicker id='until-date' textFieldStyle={{width: 100, marginRight: 20, height: 32}} autoOk />
    <TimePicker id='until-time' textFieldStyle={{width: 100, height: 32}} autoOk />
  </div>
  <div style={{display: 'flex'}}>
    <FlatButton>Last 1h</FlatButton>
    <FlatButton>Last 4h</FlatButton>
    <FlatButton>Last 1d</FlatButton>
  </div>
  <div style={{display: 'flex'}}>
    <FlatButton>Last 1w</FlatButton>
    <FlatButton>Last 1M</FlatButton>
    <FlatButton>Last 3M</FlatButton>
  </div>
</div>

export default TimeFilter
