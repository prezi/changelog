import React from 'react'
import Checkbox from 'material-ui/Checkbox'
import FlatButton from 'material-ui/FlatButton'

const CriticalityFilter = () => <div>
  <Checkbox label='5 (Most critical)' />
  <Checkbox label='4' />
  <Checkbox label='3' />
  <Checkbox label='2' />
  <Checkbox label='1 (Least critical)' />
  <FlatButton>Show All</FlatButton>
</div>

export default CriticalityFilter
