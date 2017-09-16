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
            categories: [],
            events: []
        };
    }

    @autobind
    handleQueryResult(json) {
        this.setState({
            events: json,
            categories: _(json).map(x => x.category).uniq().union(this.state.categories).sort().value()
        });
    }

    @autobind
    handleCategoryToggle(category) {
        this.query.toggleCategory(category);
    }

    @autobind
    handleCategoryReset() {
        this.query.resetCategory();
    }

    componentDidMount() {
        this.query.fetch();
    }

    render() {
        return (<div className="main-container">
            <CategoriesList
                categories={this.state.categories}
                filteredCategories={this.query.params.category}
                onToggle={this.handleCategoryToggle}
                onReset={this.handleCategoryReset}
            />
            <h2>Events</h2>
            <EventsList events={this.state.events}/>
        </div>);
    }
}