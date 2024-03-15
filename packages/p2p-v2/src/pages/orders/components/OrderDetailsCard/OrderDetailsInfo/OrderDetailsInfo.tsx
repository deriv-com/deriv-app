import React from 'react';
import { Divider, Text } from '@deriv-com/ui';
import { PaymentMethodAccordion } from '../PaymentMethodAccordion';

const OrderDetailsInfo = ({ orderDetails }) => {
    return (
        <div className='flex flex-col'>
            <div className='grid grid-cols-2 grid-rows-3 gap-y-6 p-[1.6rem]'>
                {orderDetails.map(detail => (
                    <div className='flex flex-col' key={detail.text}>
                        <Text color='less-prominent' size='xs' weight='500'>
                            {detail.text}
                        </Text>
                        <Text size='xs'>{detail.value}</Text>
                    </div>
                ))}
            </div>
            <Divider color='#f2f3f4' />
            <PaymentMethodAccordion />
            <Divider color='#f2f3f4' />
            <div className='flex flex-col p-[1.6rem] gap-2'>
                <Text size='sm' weight='bold'>
                    Your contact details
                </Text>
                <Text size='sm'>+18278262568</Text>
            </div>
            <Divider color='#f2f3f4' />
            <div className='flex flex-col p-[1.6rem] gap-2'>
                <Text size='sm' weight='bold'>
                    Buyer’s instructions
                </Text>
                <Text size='sm'>Buyer’s instructions goes here.</Text>
            </div>
        </div>
    );
};

export default OrderDetailsInfo;
