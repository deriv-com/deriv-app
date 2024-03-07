import React from 'react';
import { Text } from '@deriv-com/ui';

type TBuySellFormHeaderProps = {
    currency?: string;
    isBuy: boolean;
};
const BuySellFormHeader = ({ currency = '', isBuy }: TBuySellFormHeaderProps) => (
    <Text size='lg' weight='bold'>
        {`${isBuy ? 'Sell' : 'Buy'} ${currency}`}
    </Text>
);

export default BuySellFormHeader;
