import 'whatwg-fetch'

import {flow, toPairs, filter, forEach, isArray, isEmpty, isNull, isEqual, xor} from 'lodash/fp'

import '../css/main.css'

export class Query {
  constructor (dataHandler) {
    this.params = {
      hours_ago: 90,
      until: -1,
      category: []
    }
    this.dataHandler = dataHandler
  }

  fetch () {
    const url = new window.URL(window.location.href + 'api/events')
    flow([
      toPairs,
      filter(([key, value]) => isArray(value) ? !isEmpty(value) : !isNull(value)),
      forEach(([key, value]) => url.searchParams.append(key, value))
    ])(this.params)
    window.fetch(url).then((res) => res.json()).then(this.dataHandler)
  }

  update (key, value) {
    if (!isEqual(this.params[key], value)) {
      this.params[key] = value
      return this.fetch()
    }
  }

  toggleCategory (category) {
    this.update('category', xor(this.params.category, [category]))
  }

  resetCategory () {
    this.update('category', [])
  }

  showSingleCategory (category) {
    this.update('category', [category])
  }
}
