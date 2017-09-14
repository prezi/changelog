import * as React from "react";

import { fetchEvents} from './api';

export default class CategoriesList extends React.Component {
    constructor() {
        super();
        this.state = {
            events: []
        };
    }

    componentDidMount() {
        fetchEvents()
            .then(res => res.json())
            .then(json => this.setState({events: json}));
    }

    render() {
        return(
            <div>
                <div>Items:</div>
                {
                    JSON.stringify(this.state.events)
                }
            </div>
        );
    }
}