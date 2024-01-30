import React, { HTMLAttributes } from 'react';
import { TAdvertiserPaymentMethods } from 'types';
import { PaymentMethodCardBody } from './PaymentMethodCardBody';
import { PaymentMethodCardHeader } from './PaymentMethodCardHeader';
import './PaymentMethodCard.scss';

type TPaymentMethodCardProps = HTMLAttributes<HTMLDivElement> & {
    isEditable?: boolean;
    isSelectable?: boolean;
    onDeletePaymentMethod: () => void;
    onEditPaymentMethod: () => void;
    paymentMethod: NonNullable<TAdvertiserPaymentMethods>[number];
    shouldShowPaymentMethodDisplayName?: boolean;
};

const PaymentMethodCard = ({
    isEditable = false,
    isSelectable = false,
    onDeletePaymentMethod,
    onEditPaymentMethod,
    paymentMethod,
    shouldShowPaymentMethodDisplayName,
}: TPaymentMethodCardProps) => {
    const { type } = paymentMethod;
    // TODO: Add logic to display the "add" icon here when working on the sell modal under the sell tab
    return (
        <div className='p2p-v2-payment-method-card'>
            <PaymentMethodCardHeader
                isEditable={isEditable}
                isSelectable={isSelectable}
                onDeletePaymentMethod={onDeletePaymentMethod}
                onEditPaymentMethod={onEditPaymentMethod}
                type={type}
            />
            <PaymentMethodCardBody
                paymentMethod={paymentMethod}
                shouldShowPaymentMethodDisplayName={shouldShowPaymentMethodDisplayName}
            />
        </div>
    );
};

export default PaymentMethodCard;
