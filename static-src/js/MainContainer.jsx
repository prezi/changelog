import React from 'react'
import autobind from 'autobind-decorator'

import {flow, map, uniq, union, sortBy, identity} from 'lodash/fp'

import CategoriesList from './CategoriesList.jsx'
import EventsList from './EventsList.jsx'
import {Query} from './api.jsx'

export default class MainContainer extends React.Component {
  constructor () {
    super()
    this.query = new Query(this.handleQueryResult)
    this.state = {
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

  componentDidMount () {
    this.query.fetch()
  }

  render () {
    return (<div className='main-container'>
      <CategoriesList
        categories={this.state.categories}
        filteredCategories={this.query.params.category}
        onToggle={this.handleCategoryToggle}
        onShowOnly={this.handleShowSingleCategory}
        onReset={this.handleCategoryReset}
      />
      <h2>Events</h2>
      <EventsList events={this.state.events} />
    </div>)
  }
}
