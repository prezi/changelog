import * as React from "react";

const CategoriesList = ({categories, onToggle}) => <ul>
    {categories.map(category =>
        <li key={category} onClick={() => onToggle(category)}>
            {category}
        </li>
    )}
</ul>;

CategoriesList.propTypes = {
    categories: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    onToggle: React.PropTypes.func.isRequired
};

export default CategoriesList;
