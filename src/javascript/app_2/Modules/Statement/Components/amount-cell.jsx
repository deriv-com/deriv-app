import React      from 'react';
import PropTypes  from 'prop-types';

const AmountCell = ({ value }) => {
    const status = +value.replace(/,/g, '') >= 0 ? 'profit' : 'loss';

    return (
        <span className={`amount--${status}`}>
            {value}
        </span>
    );
};

AmountCell.propTypes = {
    value: PropTypes.string,
};

export default AmountCell;
