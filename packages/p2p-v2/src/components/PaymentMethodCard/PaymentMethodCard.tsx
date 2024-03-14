import React, { HTMLAttributes } from 'react';
import clsx from 'clsx';
import { TPaymentMethod } from 'types';
import { LabelPairedPlusLgBoldIcon } from '@deriv/quill-icons';
import { Button, Text } from '@deriv-com/ui';
import { PaymentMethodCardBody } from './PaymentMethodCardBody';
import { PaymentMethodCardHeader } from './PaymentMethodCardHeader';
import './PaymentMethodCard.scss';

type TPaymentMethodCardProps = HTMLAttributes<HTMLDivElement> & {
    isEditable?: boolean;
    medium?: boolean;
    onClickAdd?: (paymentMethod: TPaymentMethod) => void;
    onDeletePaymentMethod?: () => void;
    onEditPaymentMethod?: () => void;
    onSelectPaymentMethodCard?: (paymentMethodId: number) => void;
    paymentMethod: TPaymentMethod & { isAvailable?: boolean };
    selectedPaymentMethodIds?: number[];
    shouldShowPaymentMethodDisplayName?: boolean;
};

const PaymentMethodCard = ({
    isEditable = false,
    medium = false,
    onClickAdd,
    onDeletePaymentMethod,
    onEditPaymentMethod,
    onSelectPaymentMethodCard,
    paymentMethod,
    selectedPaymentMethodIds = [],
    shouldShowPaymentMethodDisplayName,
}: TPaymentMethodCardProps) => {
    const { display_name, isAvailable, type } = paymentMethod;

    // TODO: Add logic to display the "add" icon here when working on the sell modal under the sell tab

    const toAdd = !!(isAvailable ?? isAvailable === undefined);
    const isSelected = !!paymentMethod.id && selectedPaymentMethodIds.includes(Number(paymentMethod.id));

    return (
        <div
            className={clsx('p2p-v2-payment-method-card', {
                'p2p-v2-payment-method-card--dashed': !toAdd,
                'p2p-v2-payment-method-card--medium': medium,
                'p2p-v2-payment-method-card--selected': isSelected,
            })}
        >
            {!toAdd ? (
                <div className='flex flex-col items-center justify-center w-full h-full'>
                    <Button
                        className='flex items-center justify-center w-[3.2rem] h-[3.2rem] mb-[0.8rem] rounded-full bg-[#ff444f]'
                        onClick={() => onClickAdd?.(paymentMethod)}
                    >
                        <LabelPairedPlusLgBoldIcon fill='white' />
                    </Button>
                    <Text size='sm'>{display_name}</Text>
                </div>
            ) : (
                <>
                    <PaymentMethodCardHeader
                        isEditable={isEditable}
                        isSelectable={!isEditable && toAdd}
                        isSelected={isSelected}
                        onDeletePaymentMethod={onDeletePaymentMethod}
                        onEditPaymentMethod={onEditPaymentMethod}
                        onSelectPaymentMethod={() => onSelectPaymentMethodCard?.(Number(paymentMethod.id))}
                        type={type}
                    />
                    <PaymentMethodCardBody
                        paymentMethod={paymentMethod}
                        shouldShowPaymentMethodDisplayName={shouldShowPaymentMethodDisplayName}
                    />
                </>
            )}
        </div>
    );
};

export default PaymentMethodCard;
