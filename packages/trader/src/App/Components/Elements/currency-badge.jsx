import PropTypes from 'prop-types';
import React from 'react';

const CurrencyBadge = ({ currency }) => <span className='currency-badge'>{currency}</span>;

CurrencyBadge.propTypes = {
    currency: PropTypes.string,
};

export default CurrencyBadge;
