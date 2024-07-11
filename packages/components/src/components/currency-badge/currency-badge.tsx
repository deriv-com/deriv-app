import React from 'react';
import { getCurrencyDisplayCode } from '@deriv-lib/shared';
import Text from '../text';

type TCurrencyBadgeProps = {
    currency: string;
};

const CurrencyBadge = ({ currency }: TCurrencyBadgeProps) => (
    <Text className='dc-currency-badge' color='colored-background' line_height='unset' size='xxxs' weight='bold'>
        {getCurrencyDisplayCode(currency)}
    </Text>
);

export default CurrencyBadge;
