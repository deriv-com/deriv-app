import PropTypes from 'prop-types';
import React     from 'react';

const ResultDetailsItem = ({
    label,
    value,
}) => (
    <div className='result-details__item'>
        <span className='result-details__label'>
            {label}
        </span>
        <span className='result-details__value'>
            {value}
        </span>
    </div>
);

ResultDetailsItem.propTypes = {
    label: PropTypes.string,
    value: PropTypes.PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default ResultDetailsItem;
