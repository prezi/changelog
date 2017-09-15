import * as React from "react";
import _ from 'lodash';
import autobind from 'autobind-decorator';

import CategoriesList from "./CategoriesList";
import EventsList from "./EventsList";
import { Query } from './api';

export default class MainContainer extends React.Component {
    constructor() {
        super();
        this.query = new Query(this.handleQueryResult);
        this.state = {
            query: {
                hours_ago: 1,
                until: -1
            },
            categories: [],
            events: []
        };
    }

    @autobind
    handleQueryResult(json) {
        this.setState({
            events: json,
            categories: _(json).map(x => x.category).uniq().value()
        });
    }

    @autobind
    handleCategoryToggle(category) {
        this.query.toggleCategory(category);
    }

    componentDidMount() {
        this.query.fetch();
    }

    render() {
        return (<div className="main-container">
            <h2>Categories</h2>
            <CategoriesList categories={this.state.categories} onToggle={this.handleCategoryToggle}/>
            <h2>Events</h2>
            <EventsList events={this.state.events}/>
        </div>);
    }
}