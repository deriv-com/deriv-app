import PropTypes from 'prop-types';
import React from 'react';
import NumberButton from './number-button.jsx';

const NumberGrid = ({ onSelect }) => {
    return (
        <React.Fragment>
            {Array.from(new Array(10), (val, index) => index).map(n => (
                <NumberButton key={n} number={n} onSelect={onSelect} />
            ))}
        </React.Fragment>
    );
};

NumberGrid.propType = {
    onSelect: PropTypes.func,
};

export default NumberGrid;
