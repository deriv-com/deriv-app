import React from 'react';
import { Text } from '@deriv/components';

type OrderInfoBlockProps = {
    label: string,
    value: unknown
};

const OrderInfoBlock = (
    {
        label,
        value
    }: OrderInfoBlockProps
) => <div className='order-details-card__info-block'>
    <Text as='p' color='less-prominent' size='xxs'>
        {label}
    </Text>
    <div className='order-details-card__info-block-value'>{value}</div>
</div>;

export default OrderInfoBlock;
