import React, { HTMLAttributes } from 'react';
import clsx from 'clsx';
import { TAdvertiserPaymentMethods } from 'types';
import { PaymentMethodCardBody } from './PaymentMethodCardBody';
import { PaymentMethodCardHeader } from './PaymentMethodCardHeader';
import './PaymentMethodCard.scss';

type TPaymentMethodCardProps = HTMLAttributes<HTMLDivElement> & {
    isEditable?: boolean;
    isSelectable?: boolean;
    large?: boolean;
    medium?: boolean;
    onDeletePaymentMethod: () => void;
    onEditPaymentMethod: () => void;
    paymentMethod: NonNullable<TAdvertiserPaymentMethods>[number];
    shouldShowPaymentMethodDisplayName?: boolean;
    small?: boolean;
};

const PaymentMethodCard = ({
    isEditable = false,
    isSelectable = false,
    large = false,
    medium = false,
    onDeletePaymentMethod,
    onEditPaymentMethod,
    paymentMethod,
    shouldShowPaymentMethodDisplayName,
    small = false,
}: TPaymentMethodCardProps) => {
    const { type } = paymentMethod;
    // TODO: Add logic to display the "add" icon here when working on the sell modal under the sell tab
    return (
        <div
            className={clsx('p2p-v2-payment-method-card', {
                'p2p-v2-payment-method-card--large': large,
                'p2p-v2-payment-method-card--medium': medium,
                'p2p-v2-payment-method-card--small': small,
            })}
        >
            <PaymentMethodCardHeader
                isEditable={isEditable}
                isSelectable={isSelectable}
                onDeletePaymentMethod={onDeletePaymentMethod}
                onEditPaymentMethod={onEditPaymentMethod}
                type={type}
            />
            <PaymentMethodCardBody
                large={large}
                paymentMethod={paymentMethod}
                shouldShowPaymentMethodDisplayName={shouldShowPaymentMethodDisplayName}
            />
        </div>
    );
};

export default PaymentMethodCard;
