import React from 'react';
import { TAdvertiserPaymentMethods } from 'types';
import { Text } from '@deriv-com/ui';
import './PaymentMethodCardBody.scss';

type TPaymentMethodCardBodyProps = {
    paymentMethod: NonNullable<TAdvertiserPaymentMethods>[number];
    shouldShowPaymentMethodDisplayName?: boolean;
};

const PaymentMethodCardBody = ({
    paymentMethod,
    shouldShowPaymentMethodDisplayName = true,
}: TPaymentMethodCardBodyProps) => {
    const displayName = paymentMethod?.display_name;
    const modifiedDisplayName = displayName?.replace(/\s|-/gm, '');
    const isBankOrOther = modifiedDisplayName && ['BankTransfer', 'Other'].includes(modifiedDisplayName);
    return (
        <div className='p2p-v2-payment-method-card__body'>
            {isBankOrOther && !shouldShowPaymentMethodDisplayName ? null : <Text size='xs'>{displayName}</Text>}
            <Text size='xs'>{paymentMethod.fields?.bank_name?.value ?? paymentMethod.fields?.name?.value}</Text>
            <Text size='xs'>{paymentMethod.fields?.account?.value}</Text>
        </div>
    );
};

export default PaymentMethodCardBody;
