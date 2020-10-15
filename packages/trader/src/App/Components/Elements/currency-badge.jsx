import PropTypes from 'prop-types';
import React from 'react';
import { getCurrencyDisplayCode } from '@deriv/shared';

const CurrencyBadge = ({ currency }) => <span className='currency-badge'>{getCurrencyDisplayCode(currency)}</span>;

CurrencyBadge.propTypes = {
    currency: PropTypes.string,
};

export default CurrencyBadge;
