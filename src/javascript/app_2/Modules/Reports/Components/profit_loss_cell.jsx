import React               from 'react';
import PropTypes           from 'prop-types';
import { getProfitOrLoss } from 'Modules/Reports/Helpers/profit-loss';

const ProfitLossCell = ({ value, children }) => {
    const status = getProfitOrLoss(value);

    return (
        <span className={`amount--${status}`}>
            {children}
        </span>
    );
};

ProfitLossCell.propTypes = {
    value: PropTypes.string,
};

export default ProfitLossCell;
