import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@deriv/components';

const CurrencyWrapper = ({ currency }) => (
    <div className='currency__wrapper'>
        <Text color='colored-background' weight='bold' size='xxxs'>
            {currency}
        </Text>
    </div>
);

CurrencyWrapper.propTypes = {
    currency: PropTypes.string,
};

export default CurrencyWrapper;
