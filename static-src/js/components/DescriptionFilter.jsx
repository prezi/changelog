import React from 'react'
import TextField from 'material-ui/TextField'
import PropTypes from 'prop-types'

const DescriptionFilter = ({onChange}) => <TextField label='Filter by event description' fullWidth onChange={(e) => onChange(e.target.value)} />

DescriptionFilter.propTypes = {
  onChange: PropTypes.func.isRequired
}

export default DescriptionFilter
