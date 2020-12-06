import PropTypes from 'prop-types';
import React from 'react';
import { getCurrencyDisplayCode } from '@deriv/shared';
import Text from '../text';

const CurrencyBadge = ({ currency }) => (
    <Text weight='bold' color='colored-background' className='dc-currency-badge'>
        {getCurrencyDisplayCode(currency)}
    </Text>
);

CurrencyBadge.propTypes = {
    currency: PropTypes.string,
};

export default CurrencyBadge;
