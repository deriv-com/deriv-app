import React from 'react';
import { Text } from '@deriv-com/ui';

type TPaymentMethodLabelProps = {
    color?: string;
    paymentMethodName: string;
    size?: string;
};

const PaymentMethodLabel = ({ color = 'general', paymentMethodName, size = 'sm' }: TPaymentMethodLabelProps) => {
    return (
        <Text className='border-solid border-[1px] border-[#D6DADB] rounded-lg px-[8px] py-1' color={color} size={size}>
            {paymentMethodName}
        </Text>
    );
};

export default PaymentMethodLabel;
