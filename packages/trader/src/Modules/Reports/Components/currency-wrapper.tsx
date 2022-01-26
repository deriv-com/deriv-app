import React from 'react';
import { Text } from '@deriv/components';

type CurrencyWrapperProps = {
    currency: string;
};

const CurrencyWrapper = ({ currency }: CurrencyWrapperProps) => (
    <div className='currency__wrapper'>
        <Text color='colored-background' weight='bold' size='xxxs'>
            {currency}
        </Text>
    </div>
);

export default CurrencyWrapper;
