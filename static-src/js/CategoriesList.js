import * as React from "react";
import PropTypes from 'prop-types';
import _ from 'lodash';

const CategoriesList = ({categories, filteredCategories, onToggle}) =>
    <ul>
        {categories.map(category =>
            <li key={category} onClick={_.partial(onToggle, category)}>
                {category} {filteredCategories.indexOf(category) > -1 ? "filtered" : ""}
            </li>
        )}
    </ul>;

CategoriesList.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    filteredCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
    onToggle: PropTypes.func.isRequired
};

export default CategoriesList;
