import * as React from "react";
import Chip from 'material-ui/Chip';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import {blue300} from 'material-ui/styles/colors';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import PropTypes from 'prop-types';
import _ from 'lodash';

import '../../node_modules/simplegrid/simple-grid.scss';

const paperStyle = {
    padding: 7
};

const wrapperStyle = {
    display: 'flex',
    flexWrap: 'wrap',
};

const chipStyle = {
    margin: 4
};

const CategoriesList = ({categories, filteredCategories, onToggle, onReset}) =>
    <div className="row">
        <div className="col-2">
            <Paper style={paperStyle}>
                Criticality
            </Paper>
        </div>
        <div className="col-2">
            <Paper style={paperStyle}>
                <h3>From</h3>
                <DatePicker/>
                <TimePicker/>
            </Paper>
            <Paper style={paperStyle}>
                <h3>Until</h3>
            </Paper>
        </div>
        <div className="col-8">
            <Paper style={paperStyle}>
                <div style={wrapperStyle}>
                    <FlatButton onClick={onReset}>Show All</FlatButton>
                    {categories.map(category =>
                        <Chip
                            key={category}
                            style={chipStyle}
                            backgroundColor={filteredCategories.indexOf(category) > -1 ? blue300 : null}
                            onClick={_.partial(onToggle, category)}>
                            {category}
                        </Chip>
                    )}
                </div>
            </Paper>
            <Paper style={paperStyle}>
                Description
            </Paper>
        </div>
    </div>;

CategoriesList.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    filteredCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
    onToggle: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired
};

export default CategoriesList;
