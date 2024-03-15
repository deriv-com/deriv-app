import React from 'react';
import { PageReturn } from '@/components';
import { InlineMessage, Text } from '@deriv-com/ui';
import { OrderDetailsCard } from '../../components/OrderDetailsCard';

const OrderDetails = () => {
    return (
        <div className='w-full'>
            <PageReturn
                onClick={() => {
                    // TODO: handle back button click
                }}
                pageTitle='Sell USD order'
                weight='bold'
            />
            <InlineMessage className='w-fit mb-6' variant='warning'>
                <Text size='2xs'>Don’t risk your funds with cash transactions. Use bank transfers or e-wallets</Text>
            </InlineMessage>
            <OrderDetailsCard />
        </div>
    );
};

export default OrderDetails;
