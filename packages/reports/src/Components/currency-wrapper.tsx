import React from 'react';
import { Text } from '@deriv/components';

type TCurrencyWrapper = {
    currency: string;
};

const CurrencyWrapper = ({ currency }: TCurrencyWrapper) => (
    <div className='currency__wrapper'>
        <Text color='colored-background' weight='bold' size='xxxs'>
            {currency}
        </Text>
    </div>
);

export default CurrencyWrapper;
