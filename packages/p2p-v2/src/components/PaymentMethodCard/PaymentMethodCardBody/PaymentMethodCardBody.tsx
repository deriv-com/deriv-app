import React from 'react';
import { TAdvertiserPaymentMethods } from 'types';
import { ClickableText } from '../../ClickableText';
import './payment-method-card-body.scss';

type TPaymentMethodCardBodyProps = {
    large?: boolean;
    paymentMethod: NonNullable<TAdvertiserPaymentMethods>[number];
    shouldShowPaymentMethodDisplayName?: boolean;
};

const PaymentMethodCardBody = ({
    large = false,
    paymentMethod,
    shouldShowPaymentMethodDisplayName = true,
}: TPaymentMethodCardBodyProps) => {
    const displayName = paymentMethod?.display_name;
    const modifiedDisplayName = displayName?.replace(/\s|-/gm, '');
    const isBankOrOther = modifiedDisplayName && ['BankTransfer', 'Other'].includes(modifiedDisplayName);
    return (
        <div className='p2p-v2-payment-method-card__body'>
            <ClickableText size={large ? 'xs' : '2xs'}>
                {isBankOrOther && !shouldShowPaymentMethodDisplayName ? '' : displayName}
            </ClickableText>
            <ClickableText size={large ? 'xs' : '2xs'}>
                {paymentMethod.fields?.bank_name?.value ?? paymentMethod.fields?.name?.value}
            </ClickableText>
            <ClickableText size={large ? 'xs' : '2xs'}>{paymentMethod.fields?.account?.value}</ClickableText>
        </div>
    );
};

export default PaymentMethodCardBody;
