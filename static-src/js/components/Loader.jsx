import React from 'react'
import PropTypes from 'prop-types'
import { LinearProgress } from 'material-ui/Progress'

const Loader = ({isLoading}) => {
  if (isLoading) {
    return <LinearProgress mode='query' />
  } else {
    return <LinearProgress mode='determinate' value={100} />
  }
}

Loader.propTypes = {
  isLoading: PropTypes.bool.isRequired
}

export default Loader
