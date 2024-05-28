import React from 'react';
import { Text } from '@deriv-com/ui';
import { getPaymentMethodIcon } from 'src/constants';
import { TPaymentMethod } from 'src/types';

type TPaymentMethodTitleProps = {
    paymentMethod: string;
};

export const PaymentMethodTitle = ({ paymentMethod }: TPaymentMethodTitleProps) => {
    const iconConfig = getPaymentMethodIcon();

    const Icon = iconConfig[paymentMethod.toLowerCase() as TPaymentMethod].light ?? iconConfig.other.dark;

    return (
        <div className='flex justify-between gap-16 items-center'>
            <Icon height={40} width={64} />
            <Text as='h2' size='md' weight='bold'>
                {paymentMethod}
            </Text>
        </div>
    );
};
