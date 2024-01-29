import React, { ComponentType, SVGAttributes } from 'react';
import { TAdvertiserPaymentMethods } from 'types';
import { Button } from '@deriv-com/ui/dist/components/Button';
import IcCashierBankTransfer from '../../../public/ic-cashier-bank-transfer.svg';
import IcCashierEwallet from '../../../public/ic-cashier-ewallet.svg';
import IcCashierOther from '../../../public/ic-cashier-other.svg';
import IcCashierVerticalEllipsis from '../../../public/ic-cashier-vertical-ellipsis.svg';
import { FlyoutMenu } from '../../FlyoutMenu';
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
    const flyoutMenuItems = [
        <Button color='black' key={0} onClick={onEditPaymentMethod} size='xs' textSize='xs' variant='ghost'>
            Edit
        </Button>,

        <Button color='black' key={1} onClick={onDeletePaymentMethod} size='xs' textSize='xs' variant='ghost'>
            Delete
        </Button>,
    ];
    return (
        <div className='p2p-v2-payment-method-card__header'>
            <Icon
                className='p2p-v2-payment-method-card__icon'
                height={medium || small ? 16 : 24}
                width={medium || small ? 16 : 24}
            />
            {isEditable && (
                <FlyoutMenu
                    listItems={flyoutMenuItems}
                    renderIcon={() => <IcCashierVerticalEllipsis height={16} width={16} />}
                />
            )}
            {/*TODO: wire up logic for the selectable payment method cards here*/}
            {isSelectable && <input type='checkbox' />}
        </div>
    );
};

export default PaymentMethodCardHeader;
