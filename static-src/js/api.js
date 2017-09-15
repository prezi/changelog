import 'whatwg-fetch';
import _ from 'lodash';

export class Query {
    constructor(dataHandler) {
        this.params = {
            hours_ago: 1,
            until: -1,
            category: [],
        };
        this.dataHandler = dataHandler;
    }

    fetch() {
        const url = new URL(location.href + 'api/events');
        _(this.params).toPairs()
            .filter(([key, value]) => _.isArray(value) ? !_.isEmpty(value) : !_.isNull(value))
            .forEach(([key, value]) => url.searchParams.append(key, value));
        fetch(url).then(res => res.json()).then(this.dataHandler);
    }

    update(key, value) {
        if (!_.isEqual(this.params[key], value)) {
            this.params[key] = value;
            return this.fetch();
        }
    }

    toggleCategory(category) {
        this.update('category', _.xor(this.params.category, [category]));
    }
}
