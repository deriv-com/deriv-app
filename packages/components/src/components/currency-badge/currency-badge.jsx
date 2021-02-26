import PropTypes from 'prop-types';
import React from 'react';
import { getCurrencyDisplayCode } from '@deriv/shared';
import Text from '../text';

const CurrencyBadge = ({ currency }) => (
    <Text className='dc-currency-badge' color='colored-background' line_height='unset' size='xxxs' weight='bold'>
        {getCurrencyDisplayCode(currency)}
    </Text>
);

CurrencyBadge.propTypes = {
    currency: PropTypes.string,
};

export default CurrencyBadge;
