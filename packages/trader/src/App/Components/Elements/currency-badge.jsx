import PropTypes from 'prop-types';
import React from 'react';

const CurrencyBadge = ({ className, currency }) => <span className={className}>{currency}</span>;

CurrencyBadge.propTypes = {
    className: PropTypes.string,
    currency: PropTypes.string,
};

export default CurrencyBadge;
