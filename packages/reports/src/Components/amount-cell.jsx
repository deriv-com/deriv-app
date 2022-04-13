import React from 'react';
import PropTypes from 'prop-types';
import { getProfitOrLoss } from '../Helpers/profit-loss';

const AmountCell = ({ value }) => {
    const status = getProfitOrLoss(value);

    return <span className={`amount--${status}`}>{value}</span>;
};

AmountCell.propTypes = {
    value: PropTypes.string,
};

export default AmountCell;
