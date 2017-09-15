import * as React from "react";
import PropTypes from 'prop-types';

const CategoriesList = ({categories, onToggle}) => <ul>
    {categories.map(category =>
        <li key={category} onClick={() => onToggle(category)}>
            {category}
        </li>
    )}
</ul>;

CategoriesList.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    onToggle: PropTypes.func.isRequired
};

export default CategoriesList;
