import React from 'react'
import autobind from 'autobind-decorator'

import {flow, map, uniq, union, sortBy, identity} from 'lodash/fp'

import Filters from './Filters.jsx'
import EventsList from './EventsList.jsx'
import {Query} from './api.jsx'

export default class MainContainer extends React.Component {
  constructor () {
    super()
    this.query = new Query(this.handleQueryResult)
    this.state = {
      eventsHeight: 50,
      categories: [],
      events: []
    }
  }

  @autobind
  handleQueryResult (json) {
    this.setState({
      events: json,
      categories: flow([map(x => x.category), union(this.state.categories), sortBy(identity), uniq])(json)
    })
  }

  @autobind
  handleCategoryToggle (category) {
    this.query.toggleCategory(category)
  }

  @autobind
  handleShowSingleCategory (category) {
    this.query.showSingleCategory(category)
  }

  @autobind
  handleCategoryReset () {
    this.query.resetCategory()
  }

  @autobind
  handleSize (size) {
    this.setState({ eventsHeight: window.innerHeight - size.height })
  }

  componentDidMount () {
    this.query.fetch()
  }

  render () {
    return (<div className='main-container'>
      <div id='filters'>
        <Filters
          onSize={this.handleSize}
          categories={this.state.categories}
          filteredCategories={this.query.params.category}
          onToggle={this.handleCategoryToggle}
          onShowOnly={this.handleShowSingleCategory}
          onReset={this.handleCategoryReset}
        />
      </div>
      <EventsList events={this.state.events} height={this.state.eventsHeight} />
    </div>)
  }
}
