import React, { ComponentType, SVGAttributes } from 'react';
import { TAdvertiserPaymentMethods } from 'types';
import IcCashierBankTransfer from '../../../public/ic-cashier-bank-transfer.svg';
import IcCashierEwallet from '../../../public/ic-cashier-ewallet.svg';
import IcCashierOther from '../../../public/ic-cashier-other.svg';
import IcCashierVerticalEllipsis from '../../../public/ic-cashier-vertical-ellipsis.svg';
import { ClickableText } from '../../ClickableText';
import { Flyout } from '../../Flyout';
import './PaymentMethodCardHeader.scss';

type TPaymentMethodCardHeaderProps = {
    isEditable?: boolean;
    isSelectable?: boolean;
    medium?: boolean;
    onDeletePaymentMethod: () => void;
    onEditPaymentMethod: () => void;
    small?: boolean;
    type: NonNullable<TAdvertiserPaymentMethods>[number]['type'];
};

const PaymentMethodCardHeader = ({
    isEditable = false,
    isSelectable = false,
    medium = false,
    onDeletePaymentMethod,
    onEditPaymentMethod,
    small = false,
    type,
}: TPaymentMethodCardHeaderProps) => {
    let Icon: ComponentType<SVGAttributes<SVGElement>> = IcCashierOther;
    if (type === 'bank') {
        Icon = IcCashierBankTransfer;
    } else if (type === 'ewallet') {
        Icon = IcCashierEwallet;
    }
    // TODO: Remember to translate these
    const flyOutItems = [
        <ClickableText key={0} onClick={onEditPaymentMethod} size='sm'>
            Edit
        </ClickableText>,

        <ClickableText key={1} onClick={onDeletePaymentMethod} size='sm'>
            Delete
        </ClickableText>,
    ];
    return (
        <div className='p2p-v2-payment-method-card__header'>
            <Icon
                className='p2p-v2-payment-method-card__icon'
                height={medium || small ? 16 : 24}
                width={medium || small ? 16 : 24}
            />
            {isEditable ? (
                <Flyout
                    listItems={flyOutItems}
                    renderIcon={() => <IcCashierVerticalEllipsis height={16} width={16} />}
                />
            ) : null}
            {isSelectable ? <input type='checkbox' /> : null}
        </div>
    );
};

export default PaymentMethodCardHeader;
